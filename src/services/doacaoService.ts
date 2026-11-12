import { criarDoacoesIniciais } from '@/data/registrosIniciais';
import { Doacao, NovaDoacao, Usuario } from '@/types';
import { gerarId } from '@/utils/ids';
import { CHAVES, lerColecao, salvarJson } from './storage';

async function lerTodas(): Promise<Doacao[]> {
  return lerColecao(CHAVES.doacoes, () => criarDoacoesIniciais());
}

export async function listarDoacoes(): Promise<Doacao[]> {
  const todas = await lerTodas();
  return [...todas].sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
}

export async function buscarDoacao(id: string): Promise<Doacao | undefined> {
  const todas = await lerTodas();
  return todas.find((doacao) => doacao.id === id);
}

export async function criarDoacao(dados: NovaDoacao, usuario: Usuario): Promise<Doacao> {
  const nova: Doacao = {
    ...dados,
    id: gerarId('doacao'),
    usuarioId: usuario.id,
    disponivel: true,
    criadaEm: new Date().toISOString(),
    origem: 'usuario',
  };

  const todas = await lerTodas();
  await salvarJson(CHAVES.doacoes, [...todas, nova]);
  return nova;
}

export async function alterarDisponibilidade(id: string, disponivel: boolean, usuarioId: string): Promise<Doacao> {
  const todas = await lerTodas();
  const atual = todas.find((doacao) => doacao.id === id);
  if (!atual) throw new Error('Doação não encontrada.');
  if (atual.usuarioId !== usuarioId) throw new Error('Apenas quem cadastrou a doação pode alterá-la.');

  const atualizada: Doacao = { ...atual, disponivel };
  await salvarJson(
    CHAVES.doacoes,
    todas.map((doacao) => (doacao.id === id ? atualizada : doacao)),
  );
  return atualizada;
}

export async function restaurarDoacoesDemonstrativas(): Promise<void> {
  await salvarJson(CHAVES.doacoes, criarDoacoesIniciais());
}
