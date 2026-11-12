import { Usuario } from '@/types';

interface UsuarioDemonstracao extends Usuario {
  senha: string;
}

/**
 * Contas fictícias usadas apenas para demonstração acadêmica.
 * Senhas em texto puro dentro do app não são adequadas para produção.
 */
export const USUARIOS_DEMONSTRACAO: UsuarioDemonstracao[] = [
  {
    id: 'usuario-cidadao-demo',
    nome: 'Lorenzzo Dias',
    email: 'cidadao@descartefacil.demo',
    senha: 'demo123',
    perfil: 'cidadao',
    bairro: 'Vila Prudente',
  },
  {
    id: 'usuario-agente-demo',
    nome: 'Carlos Mendes',
    email: 'agente@descartefacil.demo',
    senha: 'demo123',
    perfil: 'agente',
  },
];
