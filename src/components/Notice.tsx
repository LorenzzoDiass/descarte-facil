import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

type Tom = 'info' | 'success' | 'warning' | 'danger';

interface NoticeProps {
  tom?: Tom;
  titulo?: string;
  mensagem: string;
  onDismiss?: () => void;
}

const TONS: Record<Tom, { cor: string; fundo: string; icone: 'info' | 'check-circle' | 'alert-triangle' | 'alert-octagon' }> = {
  info: { cor: colors.info, fundo: colors.infoSoft, icone: 'info' },
  success: { cor: colors.success, fundo: colors.successSoft, icone: 'check-circle' },
  warning: { cor: colors.warning, fundo: colors.warningSoft, icone: 'alert-triangle' },
  danger: { cor: colors.danger, fundo: colors.dangerSoft, icone: 'alert-octagon' },
};

export function Notice({ tom = 'info', titulo, mensagem, onDismiss }: NoticeProps) {
  const estilo = TONS[tom];
  const urgente = tom === 'danger' || tom === 'warning';

  return (
    <View
      style={[styles.container, { backgroundColor: estilo.fundo, borderLeftColor: estilo.cor }]}
      accessibilityRole={urgente ? 'alert' : 'summary'}
      accessibilityLiveRegion={urgente ? 'assertive' : 'polite'}
    >
      <Feather name={estilo.icone} size={18} color={estilo.cor} style={styles.icone} />
      <View style={styles.textos}>
        {titulo ? (
          <AppText variant="label" color={estilo.cor}>
            {titulo}
          </AppText>
        ) : null}
        <AppText variant="small" color={colors.text}>
          {mensagem}
        </AppText>
      </View>
      {onDismiss ? (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Fechar aviso"
          hitSlop={12}
          style={styles.fechar}
        >
          <Feather name="x" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 3,
  },
  icone: {
    marginTop: 1,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  fechar: {
    padding: spacing.xs,
  },
});
