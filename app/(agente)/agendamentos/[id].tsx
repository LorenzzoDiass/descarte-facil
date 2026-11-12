import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { ConfirmPanel } from '@/components/ConfirmPanel';
import { Notice } from '@/components/Notice';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { SolicitacaoDetails } from '@/components/SolicitacaoDetails';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { STATUS_SOLICITACAO } from '@/constants/status';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { useDadosAoFocar } from '@/hooks/useDadosAoFocar';
import { atualizarStatus, buscarSolicitacao } from '@/services/solicitacaoService';
import { spacing } from '@/theme';
import { StatusSolicitacao } from '@/types';

type Acao = 'coletada' | 'nao_coletada' | 'aguardando_coleta';

const CONFIRMACOES: Record<Acao, { mensagem: string; botao: string; perigoso: boolean }> = {
  coletada: { mensagem: 'Confirmar que o objeto foi recolhido?', botao: 'Confirmar coleta', perigoso: false },
  nao_coletada: { mensagem: 'Registrar que o objeto não foi encontrado ou não pôde ser recolhido?', botao: 'Registrar', perigoso: true },
  aguardando_coleta: { mensagem: 'Reabrir este agendamento como aguardando coleta?', botao: 'Reabrir', perigoso: false },
};

export default function DetalheAgendamentoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const agente = useUsuarioLogado();
  const { dados, carregando, erro, recarregar } = useDadosAoFocar(() => buscarSolicitacao(id));
  const [acaoPendente, setAcaoPendente] = useState<Acao | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tom: 'success' | 'danger'; texto: string } | null>(null);

  if (carregando && !dados) return <LoadingState />;
  if (erro) return <ErrorState mensagem={erro} onRetry={recarregar} />;
  if (!dados) return <EmptyState titulo="Agendamento não encontrado" icone="search" />;

  const solicitacao = dados;

  async function aplicar(status: StatusSolicitacao) {
    setSalvando(true);
    try {
      await atualizarStatus(solicitacao.id, status, agente.nome);
      setMensagem({ tom: 'success', texto: `Situação atualizada para "${STATUS_SOLICITACAO[status].rotulo}".` });
      recarregar();
    } catch {
      setMensagem({ tom: 'danger', texto: 'Não foi possível atualizar a situação. Tente novamente.' });
    } finally {
      setSalvando(false);
      setAcaoPendente(null);
    }
  }

  function renderizarAcoes() {
    if (acaoPendente) {
      const confirmacao = CONFIRMACOES[acaoPendente];
      return (
        <ConfirmPanel
          mensagem={confirmacao.mensagem}
          rotuloConfirmar={confirmacao.botao}
          perigoso={confirmacao.perigoso}
          carregando={salvando}
          onConfirmar={() => aplicar(acaoPendente)}
          onCancelar={() => setAcaoPendente(null)}
        />
      );
    }

    if (solicitacao.status === 'aguardando_coleta') {
      return (
        <View style={styles.acoes}>
          <Button label="Confirmar coleta" icon="check" onPress={() => setAcaoPendente('coletada')} />
          <Button label="Não foi possível coletar" variant="danger" onPress={() => setAcaoPendente('nao_coletada')} />
        </View>
      );
    }

    if (solicitacao.status === 'nao_coletada') {
      return <Button label="Reabrir agendamento" variant="secondary" onPress={() => setAcaoPendente('aguardando_coleta')} />;
    }

    return null;
  }

  const acoes = renderizarAcoes();

  return (
    <Screen>
      {mensagem ? <Notice tom={mensagem.tom} mensagem={mensagem.texto} onDismiss={() => setMensagem(null)} /> : null}
      <SolicitacaoDetails solicitacao={solicitacao} />
      {solicitacao.status === 'cancelada' ? <Notice mensagem="O próprio solicitante cancelou esta coleta." /> : null}
      {acoes ? <Section titulo="Atualizar situação">{acoes}</Section> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  acoes: {
    gap: spacing.sm,
  },
});
