export type Perfil = 'cidadao' | 'agente';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  bairro?: string;
}

export interface Sessao {
  usuario: Usuario;
  iniciadaEm: string;
}

export type CategoriaId =
  | 'moveis'
  | 'colchoes'
  | 'eletrodomesticos'
  | 'eletronicos'
  | 'entulho'
  | 'madeira_poda'
  | 'outros_volumosos';

export type Destino = 'cata_bagulho' | 'ecoponto' | 'logistica_reversa';

export interface Categoria {
  id: CategoriaId;
  nome: string;
  exemplos: string;
  destino: Destino;
  orientacao: string;
  podeSerDoado: boolean;
}

export type OrigemRegistro = 'demonstracao' | 'usuario';

export type StatusSolicitacao = 'aguardando_coleta' | 'coletada' | 'nao_coletada' | 'cancelada';

export interface EventoHistorico {
  status: StatusSolicitacao;
  em: string;
  responsavel: string;
}

export interface Solicitacao {
  id: string;
  usuarioId: string;
  solicitante: string;
  nomeObjeto: string;
  categoriaId: CategoriaId;
  descricao?: string;
  fotoUri?: string;
  cep: string;
  endereco: string;
  bairro: string;
  dataColeta?: string;
  status: StatusSolicitacao;
  historico: EventoHistorico[];
  criadaEm: string;
  origem: OrigemRegistro;
}

export interface NovaSolicitacao {
  nomeObjeto: string;
  categoriaId: CategoriaId;
  descricao?: string;
  fotoUri?: string;
  cep: string;
  endereco: string;
  bairro: string;
  dataColeta?: string;
}

export interface Doacao {
  id: string;
  usuarioId: string;
  nomeObjeto: string;
  categoriaId: CategoriaId;
  descricao: string;
  fotoUri?: string;
  bairro: string;
  telefone?: string;
  disponivel: boolean;
  criadaEm: string;
  origem: OrigemRegistro;
}

export interface NovaDoacao {
  nomeObjeto: string;
  categoriaId: CategoriaId;
  descricao: string;
  fotoUri?: string;
  bairro: string;
  telefone?: string;
}

export interface Ecoponto {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  subprefeitura: string;
  horario: string;
  ocupacaoInicial: number;
}

export type EstadoLotacao = 'disponivel' | 'quase_cheio' | 'lotado';

export interface LeituraSensor {
  ecopontoId: string;
  ocupacao: number;
  estado: EstadoLotacao;
  lidaEm: string;
}

export type DiaDaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface SetorCataBagulho {
  id: string;
  nome: string;
  faixasCep: { inicio: number; fim: number }[];
  semanaDoMes: 1 | 2 | 3 | 4;
  diaDaSemana: DiaDaSemana;
}

export interface ResultadoCataBagulho {
  setor: SetorCataBagulho;
  proximaData: string;
}
