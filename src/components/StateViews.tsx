import { Feather } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';

export function LoadingState({ mensagem = 'Carregando...' }: { mensagem?: string }) {
  return (
    <View style={styles.centro} accessibilityRole="progressbar" accessibilityLabel={mensagem}>
      <ActivityIndicator color={colors.primary} size="large" />
      <AppText variant="small">{mensagem}</AppText>
    </View>
  );
}

interface ErrorStateProps {
  mensagem: string;
  onRetry?: () => void;
}

export function ErrorState({ mensagem, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.centro} accessibilityRole="alert">
      <Feather name="alert-circle" size={28} color={colors.danger} />
      <AppText variant="body" style={styles.textoCentral}>
        {mensagem}
      </AppText>
      {onRetry ? <Button label="Tentar novamente" variant="secondary" onPress={onRetry} compact /> : null}
    </View>
  );
}

interface EmptyStateProps {
  titulo: string;
  descricao?: string;
  icone?: ComponentProps<typeof Feather>['name'];
  acao?: { rotulo: string; onPress: () => void };
}

export function EmptyState({ titulo, descricao, icone = 'inbox', acao }: EmptyStateProps) {
  return (
    <View style={styles.vazio}>
      <Feather name={icone} size={28} color={colors.textMuted} />
      <AppText variant="bodyStrong" style={styles.textoCentral}>
        {titulo}
      </AppText>
      {descricao ? (
        <AppText variant="small" style={styles.textoCentral}>
          {descricao}
        </AppText>
      ) : null}
      {acao ? <Button label={acao.rotulo} variant="secondary" onPress={acao.onPress} compact /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  vazio: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  textoCentral: {
    textAlign: 'center',
  },
});
