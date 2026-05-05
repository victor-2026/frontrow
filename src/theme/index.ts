export const theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F7F7F8',
    text: '#0A0A0B',
    muted: '#6B6B72',
    primary: '#FF3B5C',
    primaryText: '#FFFFFF',
    border: '#E5E5EA',
    success: '#1AAB5A',
    warning: '#E8A500',
    danger: '#D7263D',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    heading: 24,
    title: 18,
    body: 16,
    caption: 13,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
  },
} as const;

export type Theme = typeof theme;
