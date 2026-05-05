import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { theme } from '../theme';
import { testIds } from '../testIds';

export function ProfileScreen() {
  const { t } = useTranslation();
  return (
    <View
      style={styles.container}
      testID={testIds.profile.screen}
      accessibilityLabel="Profile screen"
    >
      <Text style={styles.heading} accessibilityRole="header">
        {t('profile.heading')}
      </Text>
      <Text style={styles.body}>{t('profile.placeholder')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  heading: {
    fontSize: theme.typography.heading,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  body: {
    fontSize: theme.typography.body,
    color: theme.colors.muted,
    textAlign: 'center',
  },
});
