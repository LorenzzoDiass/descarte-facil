import { EstadoLotacao, LeituraSensor } from '@/types';

export const LIMITE_QUASE_CHEIO = 70;
export const LIMITE_LOTADO = 90;
export const OCUPACAO_DEMONSTRACAO_LOTADO = 95;
export const INTERVALO_LEITURA_MS = 3000;

export function limitarPercentual(valor: number): number {
  return Math.min(100, Math.max(0, Math.round(valor)));
}

export function classificarOcupacao(ocupacao: number): EstadoLotacao {
  if (ocupacao > LIMITE_LOTADO) return 'lotado';
  if (ocupacao >= LIMITE_QUASE_CHEIO) return 'quase_cheio';
  return 'disponivel';
}

export function criarLeitura(ecopontoId: string, ocupacao: number, lidaEm: Date = new Date()): LeituraSensor {
  const valor = limitarPercentual(ocupacao);
  return { ecopontoId, ocupacao: valor, estado: classificarOcupacao(valor), lidaEm: lidaEm.toISOString() };
}

/**
 * Representa o sensor ultrassônico da caçamba: a cada leitura o volume tende a subir
 * entre -1 e +4 pontos percentuais. Quando a caçamba está totalmente cheia, há 25% de
 * chance de ela ter sido trocada por uma vazia antes da próxima leitura.
 */
export function gerarProximaOcupacao(atual: number, sortear: () => number = Math.random): number {
  if (atual >= 100 && sortear() < 0.25) {
    return limitarPercentual(3 + sortear() * 7);
  }

  const variacao = Math.floor(sortear() * 6) - 1;
  return limitarPercentual(atual + variacao);
}

export function cruzouLimiteDeLotacao(anterior: LeituraSensor | undefined, atual: LeituraSensor): boolean {
  return atual.estado === 'lotado' && anterior?.estado !== 'lotado';
}
