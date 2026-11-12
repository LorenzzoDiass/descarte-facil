import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';

interface ConfirmPanelProps {
  mensagem: string;
  rotuloConfirmar: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  carregando?: boolean;
  perigoso?: boolean;
}

/**
 * Confirmação exibida na própria tela. Funciona igual no celular e na versão web,
 * diferente do Alert nativo.
 */
export function ConfirmPanel({
  mensagem,
  rotuloConfirmar,
  onConfirmar,
  onCancelar,
  carregando = false,
  perigoso = false,
}: ConfirmPanelProps) {
  return (
    <View style={styles.painel} accessibilityRole="alert">
      <AppText variant="bodyStrong">{mensagem}</AppText>
      <View style={styles.acoes}>
        <View style={styles.acao}>
          <Button label="Voltar" variant="secondary" onPress={onCancelar} disabled={carregando} />
        </View>
        <View style={styles.acao}>
          <Button
            label={rotuloConfirmar}
            variant={perigoso ? 'danger' : 'primary'}
            onPress={onConfirmar}
            loading={carregando}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  painel: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  acoes: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  acao: {
    flex: 1,
  },
});
