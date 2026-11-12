import { StyleSheet, Text, TextProps } from 'react-native';
import { typography } from '@/theme';

type Variante = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: Variante;
  color?: string;
}

export function AppText({ variant = 'body', color, style, ...props }: AppTextProps) {
  return <Text style={[styles[variant], color ? { color } : null, style]} {...props} />;
}

const styles = StyleSheet.create(typography);
