import { Feather } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { LoadingState } from '@/components/StateViews';
import { opcoesAbas } from '@/constants/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AgenteLayout() {
  const { usuario, carregando } = useAuth();

  if (carregando) return <LoadingState />;
  if (!usuario) return <Redirect href="/login" />;
  if (usuario.perfil !== 'agente') return <Redirect href="/inicio" />;

  return (
    <Tabs screenOptions={opcoesAbas}>
      <Tabs.Screen
        name="agendamentos"
        options={{
          title: 'Agendamentos',
          headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Feather name="clipboard" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="agente-conta"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
