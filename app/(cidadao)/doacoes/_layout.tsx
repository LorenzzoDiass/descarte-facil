import { Stack } from 'expo-router';
import { opcoesCabecalho } from '@/constants/navigation';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function DoacoesLayout() {
  return (
    <Stack screenOptions={opcoesCabecalho}>
      <Stack.Screen name="index" options={{ title: 'Doações' }} />
      <Stack.Screen name="nova" options={{ title: 'Nova doação' }} />
      <Stack.Screen name="[id]" options={{ title: 'Doação' }} />
    </Stack>
  );
}
