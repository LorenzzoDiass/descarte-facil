import { SETORES_CATA_BAGULHO } from '@/data/setoresCataBagulho';
import { ResultadoCataBagulho } from '@/types';
import { proximaOcorrenciaNoMes } from '@/utils/dates';
import { apenasDigitos } from '@/utils/masks';

export class CepForaDaBaseError extends Error {
  constructor() {
    super('Este CEP não está na base demonstrativa. A base cobre CEPs da capital iniciados em 01 a 05 e de 08000 a 08499.');
  }
}

/**
 * Consulta a base local de setores. Recebe a data de referência para facilitar testes.
 */
export function consultarProximaColeta(cep: string, referencia: Date = new Date()): ResultadoCataBagulho {
  const numero = Number(apenasDigitos(cep));
  const setor = SETORES_CATA_BAGULHO.find((item) =>
    item.faixasCep.some((faixa) => numero >= faixa.inicio && numero <= faixa.fim),
  );
  if (!setor) throw new CepForaDaBaseError();

  return {
    setor,
    proximaData: proximaOcorrenciaNoMes(setor.semanaDoMes, setor.diaDaSemana, referencia),
  };
}
