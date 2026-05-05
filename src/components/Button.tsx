import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { PressableProps } from 'react-native';

import { theme } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = PressableProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

export function Button({ title, variant = 'primary', loading, disabled, ...rest }: Props) {
  const isDisabled = disabled || loading;
  const containerStyle = variantContainer[variant];
  const textStyle = variantText[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: Boolean(loading) }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.primaryText : theme.colors.text}
        />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  text: { fontSize: theme.typography.body, fontWeight: '600' },
});

const variantContainer = StyleSheet.create({
  primary: { backgroundColor: theme.colors.primary },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: { backgroundColor: 'transparent' },
});

const variantText = StyleSheet.create({
  primary: { color: theme.colors.primaryText },
  secondary: { color: theme.colors.text },
  ghost: { color: theme.colors.primary },
});
