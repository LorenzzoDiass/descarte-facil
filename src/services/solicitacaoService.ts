import { criarSolicitacoesIniciais } from '@/data/registrosIniciais';
import { NovaSolicitacao, Solicitacao, StatusSolicitacao, Usuario } from '@/types';
import { gerarId } from '@/utils/ids';
import { CHAVES, lerColecao, salvarJson } from './storage';

async function lerTodas(): Promise<Solicitacao[]> {
  return lerColecao(CHAVES.solicitacoes, () => criarSolicitacoesIniciais());
}

function ordenarPorDataDeColeta(lista: Solicitacao[]): Solicitacao[] {
  return [...lista].sort((a, b) => (a.dataColeta ?? '9999').localeCompare(b.dataColeta ?? '9999'));
}

export async function listarSolicitacoes(): Promise<Solicitacao[]> {
  return ordenarPorDataDeColeta(await lerTodas());
}

export async function listarSolicitacoesDoUsuario(usuarioId: string): Promise<Solicitacao[]> {
  const todas = await lerTodas();
  return todas
    .filter((solicitacao) => solicitacao.usuarioId === usuarioId)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
}

export async function buscarSolicitacao(id: string): Promise<Solicitacao | undefined> {
  const todas = await lerTodas();
  return todas.find((solicitacao) => solicitacao.id === id);
}

export async function criarSolicitacao(dados: NovaSolicitacao, usuario: Usuario): Promise<Solicitacao> {
  const agora = new Date().toISOString();
  const nova: Solicitacao = {
    ...dados,
    id: gerarId('solicitacao'),
    usuarioId: usuario.id,
    solicitante: usuario.nome,
    status: 'aguardando_coleta',
    historico: [{ status: 'aguardando_coleta', em: agora, responsavel: usuario.nome }],
    criadaEm: agora,
    origem: 'usuario',
  };

  const todas = await lerTodas();
  await salvarJson(CHAVES.solicitacoes, [...todas, nova]);
  return nova;
}

export async function atualizarStatus(
  id: string,
  status: StatusSolicitacao,
  responsavel: string,
): Promise<Solicitacao> {
  const todas = await lerTodas();
  const atual = todas.find((solicitacao) => solicitacao.id === id);
  if (!atual) throw new Error('Solicitação não encontrada.');
  if (atual.status === status) return atual;

  const atualizada: Solicitacao = {
    ...atual,
    status,
    historico: [...atual.historico, { status, em: new Date().toISOString(), responsavel }],
  };

  await salvarJson(
    CHAVES.solicitacoes,
    todas.map((solicitacao) => (solicitacao.id === id ? atualizada : solicitacao)),
  );
  return atualizada;
}

export async function restaurarSolicitacoesDemonstrativas(): Promise<void> {
  await salvarJson(CHAVES.solicitacoes, criarSolicitacoesIniciais());
}
