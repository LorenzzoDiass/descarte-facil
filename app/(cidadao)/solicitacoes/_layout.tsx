import { Stack } from 'expo-router';
import { opcoesCabecalho } from '@/constants/navigation';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function SolicitacoesLayout() {
  return (
    <Stack screenOptions={opcoesCabecalho}>
      <Stack.Screen name="index" options={{ title: 'Minhas solicitações' }} />
      <Stack.Screen name="[id]" options={{ title: 'Solicitação' }} />
    </Stack>
  );
}
