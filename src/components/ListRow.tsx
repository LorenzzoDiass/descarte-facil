import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, MIN_TOUCH_SIZE, spacing } from '@/theme';
import { AppText } from './AppText';

interface ListRowProps {
  titulo: string;
  subtitulo?: string;
  detalhe?: ReactNode;
  onPress: () => void;
  accessibilityHint?: string;
  ultimo?: boolean;
}

export function ListRow({ titulo, subtitulo, detalhe, onPress, accessibilityHint, ultimo = false }: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitulo ? `${titulo}. ${subtitulo}` : titulo}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.linha, !ultimo && styles.divisor, pressed && styles.pressionado]}
    >
      <View style={styles.textos}>
        <AppText variant="bodyStrong">{titulo}</AppText>
        {subtitulo ? <AppText variant="small">{subtitulo}</AppText> : null}
        {detalhe}
      </View>
      <Feather name="chevron-right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: {
    minHeight: MIN_TOUCH_SIZE + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  divisor: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressionado: {
    opacity: 0.6,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
});
