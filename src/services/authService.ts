import { USUARIOS_DEMONSTRACAO } from '@/data/usuarios';
import { Sessao, Usuario } from '@/types';
import { CHAVES, lerJson, remover, salvarJson } from './storage';

export class CredenciaisInvalidasError extends Error {
  constructor() {
    super('E-mail ou senha incorretos.');
  }
}

export async function autenticar(email: string, senha: string): Promise<Sessao> {
  const encontrado = USUARIOS_DEMONSTRACAO.find(
    (usuario) => usuario.email === email.trim().toLowerCase() && usuario.senha === senha,
  );
  if (!encontrado) throw new CredenciaisInvalidasError();

  const { senha: _senha, ...usuario } = encontrado;
  const sessao: Sessao = { usuario: usuario as Usuario, iniciadaEm: new Date().toISOString() };
  await salvarJson(CHAVES.sessao, sessao);
  return sessao;
}

export async function carregarSessao(): Promise<Sessao | null> {
  return lerJson<Sessao>(CHAVES.sessao);
}

export async function encerrarSessao(): Promise<void> {
  await remover(CHAVES.sessao);
}
