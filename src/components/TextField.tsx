import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors, MIN_TOUCH_SIZE, radius, spacing, typography } from '@/theme';
import { AppText } from './AppText';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export function TextField({ label, error, hint, optional = false, multiline, ...props }: TextFieldProps) {
  const [focado, setFocado] = useState(false);
  const corBorda = error ? colors.danger : focado ? colors.primary : colors.border;

  return (
    <View style={styles.container}>
      <AppText variant="label">
        {label}
        {optional ? <AppText variant="caption"> (opcional)</AppText> : null}
      </AppText>
      <TextInput
        accessibilityLabel={optional ? `${label}, opcional` : label}
        accessibilityHint={error ?? hint}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        style={[styles.input, multiline && styles.multiline, { borderColor: corBorda }]}
        {...props}
      />
      {error ? (
        <AppText variant="caption" color={colors.danger} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption">{hint}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  input: {
    ...typography.body,
    minHeight: MIN_TOUCH_SIZE,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
});
