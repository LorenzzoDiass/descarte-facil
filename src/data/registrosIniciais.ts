import { Doacao, Solicitacao, StatusSolicitacao } from '@/types';
import { adicionarDias, deDataISO, hojeISO, proximaOcorrenciaNoMes } from '@/utils/dates';
import { apenasDigitos } from '@/utils/masks';
import { SETORES_CATA_BAGULHO } from './setoresCataBagulho';

const CIDADAO_DEMO = 'usuario-cidadao-demo';
const OUTRO_MORADOR = 'usuario-morador-demo';

function criarHistorico(status: StatusSolicitacao, criadaEm: string, atualizadaEm: string) {
  const historico = [{ status: 'aguardando_coleta' as StatusSolicitacao, em: criadaEm, responsavel: 'Solicitante' }];
  if (status !== 'aguardando_coleta') {
    historico.push({ status, em: atualizadaEm, responsavel: 'Carlos Mendes' });
  }
  return historico;
}

/**
 * Usa a mesma base demonstrativa da consulta do Cata-Bagulho, para que as datas dos registros
 * iniciais sejam coerentes com o que o usuário vê ao consultar o CEP.
 */
function dataDeColeta(cep: string, referencia: string, passada = false): string {
  const numero = Number(apenasDigitos(cep));
  const setor = SETORES_CATA_BAGULHO.find((item) => item.faixasCep.some((f) => numero >= f.inicio && numero <= f.fim));
  if (!setor) throw new Error(`CEP demonstrativo fora da base: ${cep}`);
  const inicioBusca = passada ? adicionarDias(referencia, -40) : referencia;
  return proximaOcorrenciaNoMes(setor.semanaDoMes, setor.diaDaSemana, deDataISO(inicioBusca));
}

/**
 * Registros demonstrativos gerados com datas relativas ao dia em que o app é aberto pela
 * primeira vez, para que a demonstração sempre tenha coletas futuras e passadas coerentes.
 */
export function criarSolicitacoesIniciais(referencia: Date = new Date()): Solicitacao[] {
  const hoje = hojeISO(referencia);
  const momento = (dias: number) => `${adicionarDias(hoje, dias)}T10:00:00.000Z`;

  const registros: Omit<Solicitacao, 'historico'>[] = [
    {
      id: 'solicitacao-demo-1',
      usuarioId: CIDADAO_DEMO,
      solicitante: 'Lorenzzo Dias',
      nomeObjeto: 'Sofá de 3 lugares',
      categoriaId: 'moveis',
      descricao: 'Estrutura de madeira com o tecido rasgado.',
      cep: '03151-000',
      endereco: 'Rua Exemplo A, 120 (endereço demonstrativo)',
      bairro: 'Vila Prudente',
      dataColeta: dataDeColeta('03151-000', hoje),
      status: 'aguardando_coleta',
      criadaEm: momento(-3),
      origem: 'demonstracao',
    },
    {
      id: 'solicitacao-demo-2',
      usuarioId: CIDADAO_DEMO,
      solicitante: 'Lorenzzo Dias',
      nomeObjeto: 'Colchão de casal',
      categoriaId: 'colchoes',
      cep: '03151-000',
      endereco: 'Rua Exemplo A, 120 (endereço demonstrativo)',
      bairro: 'Vila Prudente',
      dataColeta: dataDeColeta('03151-000', hoje, true),
      status: 'coletada',
      criadaEm: momento(-50),
      origem: 'demonstracao',
    },
    {
      id: 'solicitacao-demo-3',
      usuarioId: OUTRO_MORADOR,
      solicitante: 'Morador demonstrativo',
      nomeObjeto: 'Geladeira duplex',
      categoriaId: 'eletrodomesticos',
      descricao: 'Não liga mais. Portas presas com fita.',
      cep: '03244-000',
      endereco: 'Rua Exemplo B, 45 (endereço demonstrativo)',
      bairro: 'São Lucas',
      dataColeta: dataDeColeta('03244-000', hoje),
      status: 'aguardando_coleta',
      criadaEm: momento(-2),
      origem: 'demonstracao',
    },
    {
      id: 'solicitacao-demo-4',
      usuarioId: OUTRO_MORADOR,
      solicitante: 'Morador demonstrativo',
      nomeObjeto: 'Guarda-roupa de 6 portas',
      categoriaId: 'moveis',
      descricao: 'Desmontado em quatro partes.',
      cep: '03102-000',
      endereco: 'Rua Exemplo C, 310 (endereço demonstrativo)',
      bairro: 'Mooca',
      dataColeta: dataDeColeta('03102-000', hoje),
      status: 'aguardando_coleta',
      criadaEm: momento(-1),
      origem: 'demonstracao',
    },
    {
      id: 'solicitacao-demo-5',
      usuarioId: OUTRO_MORADOR,
      solicitante: 'Morador demonstrativo',
      nomeObjeto: 'Fogão 4 bocas',
      categoriaId: 'eletrodomesticos',
      cep: '03978-000',
      endereco: 'Rua Exemplo D, 78 (endereço demonstrativo)',
      bairro: 'Sapopemba',
      dataColeta: dataDeColeta('03978-000', hoje, true),
      status: 'nao_coletada',
      criadaEm: momento(-45),
      origem: 'demonstracao',
    },
  ];

  return registros.map((registro) => ({
    ...registro,
    historico: criarHistorico(registro.status, registro.criadaEm, `${registro.dataColeta ?? hoje}T15:00:00.000Z`),
  }));
}

export function criarDoacoesIniciais(referencia: Date = new Date()): Doacao[] {
  const hoje = hojeISO(referencia);
  const momento = (dias: number) => `${adicionarDias(hoje, dias)}T12:00:00.000Z`;

  return [
    {
      id: 'doacao-demo-1',
      usuarioId: OUTRO_MORADOR,
      nomeObjeto: 'Cadeira de escritório',
      categoriaId: 'moveis',
      descricao: 'Rodinhas funcionando. O encosto tem um pequeno rasgo.',
      bairro: 'São Lucas',
      disponivel: true,
      criadaEm: momento(-1),
      origem: 'demonstracao',
    },
    {
      id: 'doacao-demo-2',
      usuarioId: CIDADAO_DEMO,
      nomeObjeto: 'Rack para TV',
      categoriaId: 'moveis',
      descricao: 'Madeira, 1,20 m de largura, gavetas em bom estado.',
      bairro: 'Vila Prudente',
      disponivel: true,
      criadaEm: momento(-2),
      origem: 'demonstracao',
    },
    {
      id: 'doacao-demo-3',
      usuarioId: OUTRO_MORADOR,
      nomeObjeto: 'Micro-ondas 20 litros',
      categoriaId: 'eletrodomesticos',
      descricao: 'Funcionando. A porta tem um risco na parte de fora.',
      bairro: 'Mooca',
      disponivel: true,
      criadaEm: momento(-4),
      origem: 'demonstracao',
    },
    {
      id: 'doacao-demo-4',
      usuarioId: OUTRO_MORADOR,
      nomeObjeto: 'Berço de madeira',
      categoriaId: 'moveis',
      descricao: 'Desmontado, acompanha os parafusos.',
      bairro: 'Ipiranga',
      disponivel: false,
      criadaEm: momento(-8),
      origem: 'demonstracao',
    },
  ];
}
