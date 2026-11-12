import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Notice } from '@/components/Notice';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { SolicitacaoRow } from '@/components/SolicitacaoRow';
import { TextField } from '@/components/TextField';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { URL_CALENDARIO_OFICIAL } from '@/data/setoresCataBagulho';
import { useDadosAoFocar } from '@/hooks/useDadosAoFocar';
import { CepForaDaBaseError, consultarProximaColeta } from '@/services/cataBagulhoService';
import { listarSolicitacoesDoUsuario } from '@/services/solicitacaoService';
import { colors, spacing } from '@/theme';
import { ResultadoCataBagulho } from '@/types';
import { descreverPrazo, diasAte, formatarDataPorExtenso, nomeDiaDaSemana } from '@/utils/dates';
import { formatarCep } from '@/utils/masks';
import { validarCep } from '@/utils/validators';

const COMO_FUNCIONA = [
  'Serviço gratuito da prefeitura para móveis, colchões, eletrodomésticos e outros objetos volumosos.',
  'O caminhão passa pela rua em datas programadas. Coloque os objetos na calçada apenas no dia da coleta.',
  'Desmonte móveis grandes e embale objetos cortantes antes de colocá-los na calçada.',
  'Também é possível solicitar a retirada pelo SP156: telefone 156, aplicativo ou portal.',
];

function descreverRecorrencia({ setor }: ResultadoCataBagulho): string {
  const masculino = setor.diaDaSemana === 0 || setor.diaDaSemana === 6;
  return `${masculino ? 'no' : 'na'} ${setor.semanaDoMes}${masculino ? 'º' : 'ª'} ${nomeDiaDaSemana(setor.diaDaSemana)} de cada mês`;
}

export default function CataBagulhoScreen() {
  const usuario = useUsuarioLogado();
  const router = useRouter();
  const [cep, setCep] = useState('');
  const [erroCep, setErroCep] = useState<string>();
  const [resultado, setResultado] = useState<ResultadoCataBagulho | null>(null);
  const { dados: solicitacoes } = useDadosAoFocar(() => listarSolicitacoesDoUsuario(usuario.id));

  const programadas = (solicitacoes ?? [])
    .filter((item) => item.status === 'aguardando_coleta' && item.dataColeta && diasAte(item.dataColeta) >= 0)
    .sort((a, b) => (a.dataColeta ?? '').localeCompare(b.dataColeta ?? ''));

  function consultar() {
    const erro = validarCep(cep);
    setResultado(null);
    setErroCep(erro);
    if (erro) return;

    try {
      setResultado(consultarProximaColeta(cep));
    } catch (falha) {
      setErroCep(falha instanceof CepForaDaBaseError ? falha.message : 'Não foi possível consultar este CEP.');
    }
  }

  return (
    <Screen>
      <Notice
        titulo="Datas simuladas"
        mensagem="Esta consulta usa uma base demonstrativa criada pela equipe. Não há integração com a Prefeitura de São Paulo. Confirme sempre no calendário oficial."
      />

      <Section titulo="Consultar pelo CEP">
        <TextField
          label="CEP"
          placeholder="00000-000"
          keyboardType="number-pad"
          value={cep}
          onChangeText={(valor) => {
            setCep(formatarCep(valor));
            setErroCep(undefined);
          }}
          error={erroCep}
          maxLength={9}
          onSubmitEditing={consultar}
        />
        <Button label="Consultar" icon="search" onPress={consultar} />
      </Section>

      {resultado ? (
        <Card accessibilityLiveRegion="polite">
          <AppText variant="caption">{resultado.setor.nome}</AppText>
          <AppText variant="heading" color={colors.primary}>
            {formatarDataPorExtenso(resultado.proximaData)}
          </AppText>
          <AppText variant="body">
            {descreverPrazo(resultado.proximaData)}. Neste setor demonstrativo a coleta ocorre {descreverRecorrencia(resultado)}.
          </AppText>
          <Button
            label="Registrar objeto para esta coleta"
            variant="secondary"
            onPress={() => router.push({ pathname: '/descartar', params: { cep } })}
          />
        </Card>
      ) : null}

      <Section titulo="Suas coletas programadas">
        {programadas.length === 0 ? (
          <AppText variant="small">Nenhuma coleta programada no momento.</AppText>
        ) : (
          <Card style={styles.lista}>
            {programadas.map((solicitacao, indice) => (
              <View key={solicitacao.id}>
                <SolicitacaoRow
                  solicitacao={solicitacao}
                  ultimo={indice === programadas.length - 1}
                  onPress={() => router.push(`/solicitacoes/${solicitacao.id}`)}
                />
              </View>
            ))}
          </Card>
        )}
      </Section>

      <Section titulo="Como funciona">
        <View style={styles.itens}>
          {COMO_FUNCIONA.map((item) => (
            <View key={item} style={styles.item}>
              <View style={styles.marcador} />
              <AppText variant="body" style={styles.textoItem}>
                {item}
              </AppText>
            </View>
          ))}
        </View>
        <Button
          label="Abrir calendário oficial da prefeitura"
          variant="ghost"
          icon="external-link"
          accessibilityHint="Abre o site da Prefeitura de São Paulo no navegador"
          onPress={() => Linking.openURL(URL_CALENDARIO_OFICIAL)}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lista: {
    paddingVertical: 0,
    gap: 0,
  },
  itens: {
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  marcador: {
    width: 6,
    height: 6,
    marginTop: 8,
    backgroundColor: colors.primary,
  },
  textoItem: {
    flex: 1,
  },
});
