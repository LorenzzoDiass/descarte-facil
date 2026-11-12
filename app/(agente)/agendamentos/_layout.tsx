import { Stack } from 'expo-router';
import { opcoesCabecalho } from '@/constants/navigation';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AgendamentosLayout() {
  return (
    <Stack screenOptions={opcoesCabecalho}>
      <Stack.Screen name="index" options={{ title: 'Agendamentos' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalhes da coleta' }} />
    </Stack>
  );
}
