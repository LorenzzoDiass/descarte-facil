import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { autenticar, carregarSessao, encerrarSessao } from '@/services/authService';
import { Usuario } from '@/types';

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<Usuario>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarSessao()
      .then((sessao) => setUsuario(sessao?.usuario ?? null))
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const sessao = await autenticar(email, senha);
    setUsuario(sessao.usuario);
    return sessao.usuario;
  }, []);

  const sair = useCallback(async () => {
    await encerrarSessao();
    setUsuario(null);
  }, []);

  const valor = useMemo(() => ({ usuario, carregando, entrar, sair }), [usuario, carregando, entrar, sair]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return contexto;
}

export function useUsuarioLogado(): Usuario {
  const { usuario } = useAuth();
  if (!usuario) throw new Error('Esta tela exige um usuário autenticado.');
  return usuario;
}
