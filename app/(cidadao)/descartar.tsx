import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Notice } from '@/components/Notice';
import { OptionSelector } from '@/components/OptionSelector';
import { PhotoPicker } from '@/components/PhotoPicker';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { TextField } from '@/components/TextField';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { buscarCategoria, CATEGORIAS, NOMES_DESTINO } from '@/data/categorias';
import { consultarProximaColeta } from '@/services/cataBagulhoService';
import { criarSolicitacao } from '@/services/solicitacaoService';
import { colors, spacing } from '@/theme';
import { CategoriaId, Solicitacao } from '@/types';
import { formatarDataPorExtenso } from '@/utils/dates';
import { apenasDigitos, formatarCep } from '@/utils/masks';
import { ErrosFormulario, possuiErros, validarCep, validarObrigatorio } from '@/utils/validators';

interface Formulario {
  nomeObjeto: string;
  categoriaId?: CategoriaId;
  descricao: string;
  fotoUri?: string;
  cep: string;
  endereco: string;
  bairro: string;
}

const FORMULARIO_VAZIO: Formulario = { nomeObjeto: '', descricao: '', cep: '', endereco: '', bairro: '' };

const OPCOES_CATEGORIA = CATEGORIAS.map((categoria) => ({ valor: categoria.id, rotulo: categoria.nome }));

function validar(formulario: Formulario): ErrosFormulario<Formulario> {
  return {
    nomeObjeto: validarObrigatorio(formulario.nomeObjeto, 'o nome do objeto', 3),
    categoriaId: formulario.categoriaId ? undefined : 'Escolha uma categoria.',
    cep: validarCep(formulario.cep),
    endereco: validarObrigatorio(formulario.endereco, 'o endereço', 5),
    bairro: validarObrigatorio(formulario.bairro, 'o bairro', 3),
  };
}

export default function DescartarScreen() {
  const usuario = useUsuarioLogado();
  const router = useRouter();
  const params = useLocalSearchParams<{ cep?: string }>();
  const [formulario, setFormulario] = useState<Formulario>({ ...FORMULARIO_VAZIO, bairro: usuario.bairro ?? '' });
  const [erros, setErros] = useState<ErrosFormulario<Formulario>>({});
  const [salvando, setSalvando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [registrada, setRegistrada] = useState<Solicitacao | null>(null);

  useEffect(() => {
    if (params.cep) setFormulario((atual) => ({ ...atual, cep: formatarCep(params.cep ?? '') }));
  }, [params.cep]);

  const categoria = formulario.categoriaId ? buscarCategoria(formulario.categoriaId) : undefined;
  const recolhidoPeloCataBagulho = categoria?.destino === 'cata_bagulho';

  const coleta = useMemo(() => {
    if (apenasDigitos(formulario.cep).length !== 8) return null;
    try {
      return consultarProximaColeta(formulario.cep);
    } catch {
      return undefined;
    }
  }, [formulario.cep]);

  function atualizar<K extends keyof Formulario>(campo: K, valor: Formulario[K]) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atuais) => ({ ...atuais, [campo]: undefined }));
  }

  async function registrar() {
    const novosErros = validar(formulario);
    setErros(novosErros);
    setErroEnvio(null);
    if (possuiErros(novosErros) || !formulario.categoriaId) return;

    setSalvando(true);
    try {
      const solicitacao = await criarSolicitacao(
        {
          nomeObjeto: formulario.nomeObjeto.trim(),
          categoriaId: formulario.categoriaId,
          descricao: formulario.descricao.trim() || undefined,
          fotoUri: formulario.fotoUri,
          cep: formatarCep(formulario.cep),
          endereco: formulario.endereco.trim(),
          bairro: formulario.bairro.trim(),
          dataColeta: coleta?.proximaData,
        },
        usuario,
      );
      setRegistrada(solicitacao);
      setFormulario({ ...FORMULARIO_VAZIO, bairro: usuario.bairro ?? '' });
      setErros({});
    } catch {
      setErroEnvio('Não foi possível salvar a solicitação no aparelho. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  if (registrada) {
    return (
      <Screen>
        <Notice
          tom="success"
          titulo="Solicitação registrada"
          mensagem={
            registrada.dataColeta
              ? `Coleta prevista para ${formatarDataPorExtenso(registrada.dataColeta)} (data demonstrativa). Você verá um aviso no início quando a data estiver próxima.`
              : 'O CEP não está na base demonstrativa, então a solicitação ficou sem data. Consulte o calendário oficial da prefeitura.'
          }
        />
        <Card>
          <AppText variant="bodyStrong">{registrada.nomeObjeto}</AppText>
          <AppText variant="small">{registrada.endereco}</AppText>
        </Card>
        <Button label="Ver solicitação" onPress={() => router.push(`/solicitacoes/${registrada.id}`)} />
        <Button label="Registrar outro objeto" variant="secondary" onPress={() => setRegistrada(null)} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="small">
        Informe o objeto para ver a destinação correta. Objetos recolhidos pelo Cata-Bagulho podem ter a coleta registrada aqui.
      </AppText>

      <TextField
        label="Nome do objeto"
        placeholder="Ex.: sofá de 2 lugares"
        value={formulario.nomeObjeto}
        onChangeText={(valor) => atualizar('nomeObjeto', valor)}
        error={erros.nomeObjeto}
        maxLength={60}
      />

      <OptionSelector
        label="Categoria"
        opcoes={OPCOES_CATEGORIA}
        selecionado={formulario.categoriaId}
        onChange={(valor) => atualizar('categoriaId', valor)}
        error={erros.categoriaId}
      />

      {categoria ? (
        <Card style={styles.orientacao}>
          <AppText variant="caption">Destinação indicada</AppText>
          <AppText variant="bodyStrong" color={colors.primary}>
            {NOMES_DESTINO[categoria.destino]}
          </AppText>
          <AppText variant="body">{categoria.orientacao}</AppText>
          <AppText variant="caption">Exemplos: {categoria.exemplos}. Classificação feita por regras locais do app.</AppText>
          {categoria.podeSerDoado ? (
            <Button
              label="Ainda funciona? Ofereça para doação"
              variant="ghost"
              compact
              onPress={() => router.push('/doacoes/nova')}
            />
          ) : null}
        </Card>
      ) : null}

      {categoria && !recolhidoPeloCataBagulho ? (
        <>
          <Notice
            mensagem="Este tipo de objeto não é recolhido na calçada, por isso não é preciso registrar uma coleta."
          />
          {categoria.destino === 'ecoponto' ? (
            <Button label="Ver ecopontos" variant="secondary" icon="map-pin" onPress={() => router.push('/ecopontos')} />
          ) : null}
        </>
      ) : null}

      {recolhidoPeloCataBagulho ? (
        <>
          <TextField
            label="Descrição"
            optional
            placeholder="Estado do objeto, se está desmontado, medidas"
            value={formulario.descricao}
            onChangeText={(valor) => atualizar('descricao', valor)}
            multiline
            maxLength={240}
          />

          <PhotoPicker optional uri={formulario.fotoUri} onChange={(uri) => atualizar('fotoUri', uri)} />

          <Section titulo="Local da coleta">
            <TextField
              label="CEP"
              placeholder="00000-000"
              keyboardType="number-pad"
              value={formulario.cep}
              onChangeText={(valor) => atualizar('cep', formatarCep(valor))}
              error={erros.cep}
              maxLength={9}
            />
            <TextField
              label="Endereço"
              placeholder="Rua e número"
              value={formulario.endereco}
              onChangeText={(valor) => atualizar('endereco', valor)}
              error={erros.endereco}
              autoComplete="street-address"
            />
            <TextField
              label="Bairro"
              value={formulario.bairro}
              onChangeText={(valor) => atualizar('bairro', valor)}
              error={erros.bairro}
            />

            <View>
              {coleta ? (
                <Card>
                  <AppText variant="caption">Data de coleta (base demonstrativa)</AppText>
                  <AppText variant="bodyStrong">{formatarDataPorExtenso(coleta.proximaData)}</AppText>
                  <AppText variant="caption">{coleta.setor.nome}</AppText>
                </Card>
              ) : coleta === undefined ? (
                <Notice
                  tom="warning"
                  mensagem="CEP fora da base demonstrativa. A solicitação pode ser registrada, mas ficará sem data de coleta."
                />
              ) : null}
            </View>
          </Section>

          {erroEnvio ? <Notice tom="danger" mensagem={erroEnvio} /> : null}
          <Button label="Registrar solicitação" icon="check" onPress={registrar} loading={salvando} />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  orientacao: {
    gap: spacing.xs,
  },
});
