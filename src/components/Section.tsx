import { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { AppText } from './AppText';

interface SectionProps {
  titulo: string;
  acao?: ReactNode;
}

export function Section({ titulo, acao, children }: PropsWithChildren<SectionProps>) {
  return (
    <View style={styles.secao}>
      <View style={styles.cabecalho}>
        <AppText variant="heading" accessibilityRole="header">
          {titulo}
        </AppText>
        {acao}
      </View>
      {children}
    </View>
  );
}

export function InfoRow({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.info}>
      <AppText variant="caption">{rotulo}</AppText>
      <AppText variant="body">{valor}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  secao: {
    gap: spacing.md,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  info: {
    gap: 2,
  },
});
