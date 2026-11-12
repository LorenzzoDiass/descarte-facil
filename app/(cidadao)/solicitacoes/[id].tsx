import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { ConfirmPanel } from '@/components/ConfirmPanel';
import { Notice } from '@/components/Notice';
import { Screen } from '@/components/Screen';
import { SolicitacaoDetails } from '@/components/SolicitacaoDetails';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { useDadosAoFocar } from '@/hooks/useDadosAoFocar';
import { atualizarStatus, buscarSolicitacao } from '@/services/solicitacaoService';

export default function DetalheSolicitacaoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const usuario = useUsuarioLogado();
  const { dados, carregando, erro, recarregar } = useDadosAoFocar(() => buscarSolicitacao(id));
  const [confirmando, setConfirmando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tom: 'success' | 'danger'; texto: string } | null>(null);

  if (carregando && !dados) return <LoadingState />;
  if (erro) return <ErrorState mensagem={erro} onRetry={recarregar} />;
  if (!dados || dados.usuarioId !== usuario.id) {
    return <EmptyState titulo="Solicitação não encontrada" icone="search" />;
  }

  async function cancelar() {
    setSalvando(true);
    try {
      await atualizarStatus(dados!.id, 'cancelada', usuario.nome);
      setMensagem({ tom: 'success', texto: 'Solicitação cancelada.' });
      recarregar();
    } catch {
      setMensagem({ tom: 'danger', texto: 'Não foi possível cancelar. Tente novamente.' });
    } finally {
      setSalvando(false);
      setConfirmando(false);
    }
  }

  return (
    <Screen>
      {mensagem ? <Notice tom={mensagem.tom} mensagem={mensagem.texto} onDismiss={() => setMensagem(null)} /> : null}
      <SolicitacaoDetails solicitacao={dados} />

      {dados.status === 'aguardando_coleta' ? (
        confirmando ? (
          <ConfirmPanel
            mensagem="Cancelar esta solicitação de coleta?"
            rotuloConfirmar="Cancelar coleta"
            perigoso
            carregando={salvando}
            onConfirmar={cancelar}
            onCancelar={() => setConfirmando(false)}
          />
        ) : (
          <Button label="Cancelar solicitação" variant="danger" onPress={() => setConfirmando(true)} />
        )
      ) : null}
    </Screen>
  );
}
