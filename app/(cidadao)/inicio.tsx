import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HeaderAccountButton } from '@/components/HeaderAccountButton';
import { ListRow } from '@/components/ListRow';
import { Notice } from '@/components/Notice';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { useDadosAoFocar } from '@/hooks/useDadosAoFocar';
import { listarSolicitacoesDoUsuario } from '@/services/solicitacaoService';
import { colors, radius, spacing } from '@/theme';
import { Solicitacao } from '@/types';
import { descreverPrazo, diasAte, formatarDataPorExtenso } from '@/utils/dates';

const DIAS_PARA_AVISO = 7;

function encontrarProximaColeta(solicitacoes: Solicitacao[]): Solicitacao | undefined {
  return solicitacoes
    .filter((item) => item.status === 'aguardando_coleta' && item.dataColeta && diasAte(item.dataColeta) >= 0)
    .sort((a, b) => (a.dataColeta ?? '').localeCompare(b.dataColeta ?? ''))[0];
}

export default function InicioScreen() {
  const usuario = useUsuarioLogado();
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosAoFocar(() => listarSolicitacoesDoUsuario(usuario.id));

  const cabecalho = <Tabs.Screen options={{ headerRight: () => <HeaderAccountButton /> }} />;

  if (carregando && !dados) return <LoadingState />;
  if (erro || !dados) return <ErrorState mensagem={erro ?? 'Dados indisponíveis.'} onRetry={recarregar} />;

  const proxima = encontrarProximaColeta(dados);
  const diasParaColeta = proxima?.dataColeta ? diasAte(proxima.dataColeta) : undefined;
  const coletaPerto = diasParaColeta !== undefined && diasParaColeta <= DIAS_PARA_AVISO;
  const naoColetadas = dados.filter((item) => item.status === 'nao_coletada');
  const contagem = {
    aguardando: dados.filter((item) => item.status === 'aguardando_coleta').length,
    coletadas: dados.filter((item) => item.status === 'coletada').length,
    outras: dados.filter((item) => item.status === 'nao_coletada' || item.status === 'cancelada').length,
  };

  return (
    <Screen>
      {cabecalho}
      <View style={styles.saudacao}>
        <AppText variant="title">Olá, {usuario.nome.split(' ')[0]}</AppText>
        {usuario.bairro ? <AppText variant="small">{usuario.bairro}, São Paulo</AppText> : null}
      </View>

      {coletaPerto && proxima?.dataColeta ? (
        <Notice
          tom={diasParaColeta !== undefined && diasParaColeta <= 1 ? 'warning' : 'info'}
          titulo={`Coleta programada: ${descreverPrazo(proxima.dataColeta).toLowerCase()}`}
          mensagem={`Deixe "${proxima.nomeObjeto}" na calçada na data programada. Desmonte o que for possível.`}
        />
      ) : null}

      {naoColetadas.length > 0 ? (
        <Notice
          titulo="Coleta não realizada"
          mensagem={`${naoColetadas.length === 1 ? 'Uma solicitação não foi coletada' : `${naoColetadas.length} solicitações não foram coletadas`}. Confira o histórico e registre uma nova data se necessário.`}
        />
      ) : null}

      <Section titulo="Próxima coleta">
        {proxima?.dataColeta ? (
          <Card>
            <AppText variant="bodyStrong">{proxima.nomeObjeto}</AppText>
            <AppText variant="body">{formatarDataPorExtenso(proxima.dataColeta)}</AppText>
            <AppText variant="small">{proxima.endereco}</AppText>
            <Button
              label="Ver detalhes"
              variant="ghost"
              compact
              onPress={() => router.push(`/solicitacoes/${proxima.id}`)}
            />
          </Card>
        ) : (
          <Card>
            <AppText variant="body">Nenhuma coleta programada.</AppText>
            <Button label="Registrar descarte" variant="secondary" compact onPress={() => router.push('/descartar')} />
          </Card>
        )}
      </Section>

      <Section
        titulo="Suas solicitações"
        acao={<Button label="Histórico" variant="ghost" compact onPress={() => router.push('/solicitacoes')} />}
      >
        <View style={styles.resumo}>
          <Resumo valor={contagem.aguardando} rotulo="Aguardando" />
          <Resumo valor={contagem.coletadas} rotulo="Coletadas" />
          <Resumo valor={contagem.outras} rotulo="Não coletadas ou canceladas" />
        </View>
      </Section>

      <Section titulo="Acesso rápido">
        <Card style={styles.atalhos}>
          <ListRow titulo="Descartar um objeto" subtitulo="Descubra o destino e registre a coleta" onPress={() => router.push('/descartar')} />
          <ListRow titulo="Consultar o Cata-Bagulho" subtitulo="Data da coleta pelo CEP" onPress={() => router.push('/cata-bagulho')} />
          <ListRow titulo="Doar um objeto" subtitulo="Ofereça para vizinhos antes de descartar" onPress={() => router.push('/doacoes/nova')} />
          <ListRow titulo="Ecopontos" subtitulo="Endereços e lotação das caçambas" onPress={() => router.push('/ecopontos')} ultimo />
        </Card>
      </Section>
    </Screen>
  );
}

function Resumo({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <View style={styles.itemResumo} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <AppText variant="title" color={colors.primary}>
        {valor}
      </AppText>
      <AppText variant="caption">{rotulo}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  saudacao: {
    gap: 2,
  },
  resumo: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  itemResumo: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    gap: 2,
  },
  atalhos: {
    paddingVertical: 0,
    gap: 0,
  },
});
