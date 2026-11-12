import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { colors, MIN_TOUCH_SIZE } from '@/theme';

export function HeaderAccountButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/conta')}
      accessibilityRole="button"
      accessibilityLabel="Minha conta"
      style={styles.botao}
    >
      <Feather name="user" size={22} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: MIN_TOUCH_SIZE,
    height: MIN_TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
