import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export function Card({ style, children, ...props }: PropsWithChildren<ViewProps>) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
