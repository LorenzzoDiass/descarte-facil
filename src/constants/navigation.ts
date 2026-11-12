import { colors } from '@/theme';

export const opcoesCabecalho = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '600' as const, fontSize: 17 },
  headerShadowVisible: false,
};

export const opcoesAbas = {
  ...opcoesCabecalho,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
  tabBarLabelStyle: { fontSize: 12 },
};
