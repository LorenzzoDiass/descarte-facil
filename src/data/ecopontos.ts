import { Ecoponto } from '@/types';

/**
 * Endereços conforme a página da Subprefeitura Vila Prudente (consultada em novembro de 2026).
 * A ocupação inicial é um valor demonstrativo usado como ponto de partida da simulação IoT.
 */
export const ECOPONTOS: Ecoponto[] = [
  {
    id: 'ecoponto-sao-lucas',
    nome: 'Ecoponto São Lucas',
    endereco: 'Rua Florêncio Sanches, 307',
    bairro: 'São Lucas',
    subprefeitura: 'Vila Prudente',
    horario: 'Seg. a sáb., 6h às 22h. Dom. e feriados, 6h às 18h.',
    ocupacaoInicial: 34,
  },
  {
    id: 'ecoponto-lisa-ansorge',
    nome: 'Ecoponto Lisa Ansorge',
    endereco: 'Rua Lisa Ansorge, altura do nº 653',
    bairro: 'São Lucas',
    subprefeitura: 'Vila Prudente',
    horario: 'Seg. a sáb., 6h às 22h. Dom. e feriados, 6h às 18h.',
    ocupacaoInicial: 72,
  },
  {
    id: 'ecoponto-vila-prudente',
    nome: 'Ecoponto Vila Prudente',
    endereco: 'Rua da Prece, 296',
    bairro: 'Vila Prudente',
    subprefeitura: 'Vila Prudente',
    horario: 'Seg. a sáb., 6h às 22h. Dom. e feriados, 6h às 18h.',
    ocupacaoInicial: 86,
  },
];
