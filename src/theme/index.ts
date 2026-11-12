export const colors = {
  primary: '#1E6B47',
  primaryPressed: '#16543A',
  primarySoft: '#E7F1EB',
  background: '#F6F7F6',
  surface: '#FFFFFF',
  border: '#DDE2DF',
  text: '#1A1F1C',
  textMuted: '#55615B',
  textOnPrimary: '#FFFFFF',
  danger: '#B42318',
  dangerSoft: '#FCEBEA',
  warning: '#8A5A00',
  warningSoft: '#FFF3D9',
  info: '#28507A',
  infoSoft: '#E9F0F7',
  success: '#1E6B47',
  successSoft: '#E7F1EB',
  neutralSoft: '#EEF0EF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
} as const;

export const typography = {
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const, color: colors.text },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const, color: colors.text },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const, color: colors.textMuted },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const, color: colors.text },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const, color: colors.textMuted },
};

export const MIN_TOUCH_SIZE = 48;
