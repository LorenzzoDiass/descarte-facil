import { Redirect } from 'expo-router';
import { LoadingState } from '@/components/StateViews';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { usuario, carregando } = useAuth();

  if (carregando) return <LoadingState mensagem="Abrindo o Descarte Fácil..." />;
  if (!usuario) return <Redirect href="/login" />;
  return <Redirect href={usuario.perfil === 'agente' ? '/agendamentos' : '/inicio'} />;
}
