import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

export interface Opcao<T extends string> {
  valor: T;
  rotulo: string;
}

interface OptionSelectorProps<T extends string> {
  label?: string;
  opcoes: Opcao<T>[];
  selecionado: T | undefined;
  onChange: (valor: T) => void;
  error?: string;
}

export function OptionSelector<T extends string>({ label, opcoes, selecionado, onChange, error }: OptionSelectorProps<T>) {
  return (
    <View style={styles.container}>
      {label ? <AppText variant="label">{label}</AppText> : null}
      <View style={styles.opcoes} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {opcoes.map((opcao) => {
          const ativo = opcao.valor === selecionado;
          return (
            <Pressable
              key={opcao.valor}
              onPress={() => onChange(opcao.valor)}
              accessibilityRole="radio"
              accessibilityLabel={opcao.rotulo}
              accessibilityState={{ selected: ativo, checked: ativo }}
              style={[styles.opcao, ativo && styles.opcaoAtiva]}
            >
              <AppText variant="small" color={ativo ? colors.textOnPrimary : colors.text}>
                {opcao.rotulo}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.danger}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  opcao: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  opcaoAtiva: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
