import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface ScreenProps {
  semCabecalho?: boolean;
}

export function Screen({ children, semCabecalho = false }: PropsWithChildren<ScreenProps>) {
  return (
    <SafeAreaView style={styles.area} edges={semCabecalho ? ['top', 'left', 'right'] : ['left', 'right']}>
      <KeyboardAvoidingView style={styles.area} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
});
