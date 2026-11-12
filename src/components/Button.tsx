import { Feather } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { colors, MIN_TOUCH_SIZE, radius, spacing } from '@/theme';
import { AppText } from './AppText';

type Variante = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variante;
  icon?: ComponentProps<typeof Feather>['name'];
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  compact?: boolean;
}

const ESTILOS: Record<Variante, { fundo: string; fundoPressionado: string; texto: string; borda: string }> = {
  primary: { fundo: colors.primary, fundoPressionado: colors.primaryPressed, texto: colors.textOnPrimary, borda: colors.primary },
  secondary: { fundo: colors.surface, fundoPressionado: colors.primarySoft, texto: colors.primary, borda: colors.primary },
  ghost: { fundo: 'transparent', fundoPressionado: colors.neutralSoft, texto: colors.primary, borda: 'transparent' },
  danger: { fundo: colors.surface, fundoPressionado: colors.dangerSoft, texto: colors.danger, borda: colors.danger },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  accessibilityHint,
  compact = false,
}: ButtonProps) {
  const estilo = ESTILOS[variant];
  const inativo = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inativo, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        {
          backgroundColor: pressed ? estilo.fundoPressionado : estilo.fundo,
          borderColor: estilo.borda,
          opacity: inativo && !loading ? 0.5 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={estilo.texto} />
      ) : (
        <View style={styles.conteudo}>
          {icon ? <Feather name={icon} size={18} color={estilo.texto} /> : null}
          <AppText variant="bodyStrong" color={estilo.texto}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_SIZE,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    alignSelf: 'flex-start',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
