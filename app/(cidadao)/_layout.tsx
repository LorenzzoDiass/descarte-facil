import { Feather } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { LoadingState } from '@/components/StateViews';
import { opcoesAbas } from '@/constants/navigation';
import { useAuth } from '@/contexts/AuthContext';

type NomeIcone = ComponentProps<typeof Feather>['name'];

function iconeDaAba(nome: NomeIcone) {
  return ({ color, size }: { color: string; size: number }) => <Feather name={nome} size={size} color={color} />;
}

export default function CidadaoLayout() {
  const { usuario, carregando } = useAuth();

  if (carregando) return <LoadingState />;
  if (!usuario) return <Redirect href="/login" />;
  if (usuario.perfil !== 'cidadao') return <Redirect href="/agendamentos" />;

  return (
    <Tabs screenOptions={opcoesAbas}>
      <Tabs.Screen name="inicio" options={{ title: 'Início', tabBarIcon: iconeDaAba('home') }} />
      <Tabs.Screen name="descartar" options={{ title: 'Descartar', tabBarIcon: iconeDaAba('package') }} />
      <Tabs.Screen name="cata-bagulho" options={{ title: 'Cata-Bagulho', tabBarIcon: iconeDaAba('calendar') }} />
      <Tabs.Screen
        name="doacoes"
        options={{ title: 'Doações', headerShown: false, tabBarIcon: iconeDaAba('repeat') }}
      />
      <Tabs.Screen name="ecopontos" options={{ title: 'Ecopontos', tabBarIcon: iconeDaAba('map-pin') }} />
      <Tabs.Screen name="solicitacoes" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="conta" options={{ href: null, title: 'Minha conta' }} />
    </Tabs>
  );
}
