import { colors } from '@/theme';
import { EstadoLotacao, StatusSolicitacao } from '@/types';

interface EstiloStatus {
  rotulo: string;
  cor: string;
  fundo: string;
}

export const STATUS_SOLICITACAO: Record<StatusSolicitacao, EstiloStatus> = {
  aguardando_coleta: { rotulo: 'Aguardando coleta', cor: colors.info, fundo: colors.infoSoft },
  coletada: { rotulo: 'Coletada', cor: colors.success, fundo: colors.successSoft },
  nao_coletada: { rotulo: 'Não coletada', cor: colors.warning, fundo: colors.warningSoft },
  cancelada: { rotulo: 'Cancelada', cor: colors.textMuted, fundo: colors.neutralSoft },
};

export const ESTADO_LOTACAO: Record<EstadoLotacao, EstiloStatus> = {
  disponivel: { rotulo: 'Disponível', cor: colors.success, fundo: colors.successSoft },
  quase_cheio: { rotulo: 'Quase cheio', cor: colors.warning, fundo: colors.warningSoft },
  lotado: { rotulo: 'Lotado', cor: colors.danger, fundo: colors.dangerSoft },
};
