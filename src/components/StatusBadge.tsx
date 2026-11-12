import { StyleSheet, View } from 'react-native';
import { radius, spacing } from '@/theme';
import { AppText } from './AppText';

interface StatusBadgeProps {
  rotulo: string;
  cor: string;
  fundo: string;
}

export function StatusBadge({ rotulo, cor, fundo }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: fundo }]} accessibilityLabel={`Situação: ${rotulo}`}>
      <AppText variant="caption" color={cor} style={styles.texto}>
        {rotulo}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  texto: {
    fontWeight: '600',
  },
});
