import { ScrollView, View, Text, StyleSheet } from 'react-native';

import { theme } from '../../theme';
import { testIds } from '../../testIds';
import { Section } from '../../components/Section';
import { Row } from '../../components/Row';
import { getBuildInfo } from '../../utils/buildInfo';

export function AboutScreen() {
  const info = getBuildInfo();
  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
      testID={testIds.settings.aboutScreen}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle} accessibilityRole="header">
          FrontRow
        </Text>
        <Text style={styles.heroSubtitle}>
          An open-source mobile app for QA automation training.
        </Text>
      </View>

      <Section title="Build">
        <Row label="Version" value={`${info.version} (${info.buildNumber})`} />
        <Row label="Platform" value={`${info.platform} ${info.osVersion}`} />
        <Row label="Expo SDK" value={info.expoSdk} />
        <Row label="Environment" value={info.env} />
      </Section>

      <Section title="Credits">
        <Row label="License" value="MIT" />
        <Row label="Source" value="github.com/majdukovic/frontrow" />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: theme.spacing.md },
  hero: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  heroTitle: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.text },
  heroSubtitle: { fontSize: theme.typography.body, color: theme.colors.muted },
});
