import { SetorCataBagulho } from '@/types';

/**
 * Base demonstrativa: as faixas de CEP e os dias de coleta abaixo foram definidos pela equipe
 * para simular a consulta. Não correspondem ao calendário oficial da Prefeitura de São Paulo.
 */
export const SETORES_CATA_BAGULHO: SetorCataBagulho[] = [
  {
    id: 'setor-centro',
    nome: 'Setor demonstrativo Centro',
    faixasCep: [{ inicio: 1000000, fim: 1599999 }],
    semanaDoMes: 1,
    diaDaSemana: 2,
  },
  {
    id: 'setor-norte',
    nome: 'Setor demonstrativo Zona Norte',
    faixasCep: [{ inicio: 2000000, fim: 2999999 }],
    semanaDoMes: 2,
    diaDaSemana: 3,
  },
  {
    id: 'setor-leste-1',
    nome: 'Setor demonstrativo Zona Leste 1',
    faixasCep: [{ inicio: 3000000, fim: 3999999 }],
    semanaDoMes: 3,
    diaDaSemana: 6,
  },
  {
    id: 'setor-sul',
    nome: 'Setor demonstrativo Zona Sul',
    faixasCep: [{ inicio: 4000000, fim: 4999999 }],
    semanaDoMes: 2,
    diaDaSemana: 4,
  },
  {
    id: 'setor-oeste',
    nome: 'Setor demonstrativo Zona Oeste',
    faixasCep: [{ inicio: 5000000, fim: 5999999 }],
    semanaDoMes: 4,
    diaDaSemana: 1,
  },
  {
    id: 'setor-leste-2',
    nome: 'Setor demonstrativo Zona Leste 2',
    faixasCep: [{ inicio: 8000000, fim: 8499999 }],
    semanaDoMes: 1,
    diaDaSemana: 6,
  },
];

export const URL_CALENDARIO_OFICIAL = 'https://coleta.prefeitura.sp.gov.br/';
