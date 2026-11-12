
import { STATUS_SOLICITACAO } from '@/constants/status';
import { Solicitacao } from '@/types';
import { formatarData } from '@/utils/dates';
import { ListRow } from './ListRow';
import { StatusBadge } from './StatusBadge';

interface SolicitacaoRowProps {
  solicitacao: Solicitacao;
  onPress: () => void;
  ultimo?: boolean;
  mostrarBairro?: boolean;
}

export function SolicitacaoRow({
  solicitacao,
  onPress,
  ultimo,
  mostrarBairro = false,
}: SolicitacaoRowProps) {
  const eventoColeta = [...solicitacao.historico]
    .reverse()
    .find((evento) => evento.status === 'coletada');

  let data = solicitacao.dataColeta
    ? `Coleta prevista para ${formatarData(solicitacao.dataColeta)}`
    : 'Sem data de coleta';

  if (solicitacao.status === 'coletada') {
    data = eventoColeta
      ? `Coletado em ${formatarData(eventoColeta.em)}`
      : 'Coleta realizada';
  } else if (solicitacao.status === 'nao_coletada') {
    data = 'Coleta não realizada';
  } else if (solicitacao.status === 'cancelada') {
    data = 'Solicitação cancelada';
  }

  const subtitulo = mostrarBairro
    ? `${solicitacao.bairro} · ${data}`
    : data;

  return (
    <ListRow
      titulo={solicitacao.nomeObjeto}
      subtitulo={subtitulo}
      detalhe={<StatusBadge {...STATUS_SOLICITACAO[solicitacao.status]} />}
      onPress={onPress}
      accessibilityHint="Abre os detalhes da solicitação"
      ultimo={ultimo}
    />
  );
}
