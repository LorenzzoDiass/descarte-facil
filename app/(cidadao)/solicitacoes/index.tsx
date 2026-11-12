import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Card } from '@/components/Card';
import { OptionSelector } from '@/components/OptionSelector';
import { Screen } from '@/components/Screen';
import { SolicitacaoRow } from '@/components/SolicitacaoRow';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { useDadosAoFocar } from '@/hooks/useDadosAoFocar';
import { listarSolicitacoesDoUsuario } from '@/services/solicitacaoService';
import { StatusSolicitacao } from '@/types';

type Filtro = 'todas' | StatusSolicitacao;

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'aguardando_coleta', rotulo: 'Aguardando' },
  { valor: 'coletada', rotulo: 'Coletadas' },
  { valor: 'nao_coletada', rotulo: 'Não coletadas' },
  { valor: 'cancelada', rotulo: 'Canceladas' },
];

export default function MinhasSolicitacoesScreen() {
  const usuario = useUsuarioLogado();
  const router = useRouter();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const { dados, carregando, erro, recarregar } = useDadosAoFocar(() => listarSolicitacoesDoUsuario(usuario.id));

  if (carregando && !dados) return <LoadingState />;
  if (erro || !dados) return <ErrorState mensagem={erro ?? 'Dados indisponíveis.'} onRetry={recarregar} />;

  const filtradas = filtro === 'todas' ? dados : dados.filter((item) => item.status === filtro);

  return (
    <Screen>
      <OptionSelector label="Filtrar por situação" opcoes={FILTROS} selecionado={filtro} onChange={setFiltro} />

      {filtradas.length === 0 ? (
        <EmptyState
          titulo={dados.length === 0 ? 'Você ainda não registrou descartes' : 'Nenhuma solicitação nesta situação'}
          acao={dados.length === 0 ? { rotulo: 'Registrar descarte', onPress: () => router.push('/descartar') } : undefined}
        />
      ) : (
        <Card style={{ paddingVertical: 0, gap: 0 }}>
          {filtradas.map((solicitacao, indice) => (
            <SolicitacaoRow
              key={solicitacao.id}
              solicitacao={solicitacao}
              ultimo={indice === filtradas.length - 1}
              onPress={() => router.push(`/solicitacoes/${solicitacao.id}`)}
            />
          ))}
        </Card>
      )}
    </Screen>
  );
}
