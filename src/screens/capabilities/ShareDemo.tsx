import { ScrollView, View, Text, StyleSheet, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { Section } from '../../components/Section';
import { Row } from '../../components/Row';

const SHARE_URL = 'frontrow://events/evt_001';

export function ShareDemo() {
  const onShare = async () => {
    await Share.share({
      message: 'Come see Midnight Howl with me!',
      url: SHARE_URL,
      title: 'FrontRow event',
    });
  };

  const onCopy = async () => {
    await Clipboard.setStringAsync(SHARE_URL);
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingVertical: theme.spacing.md }}
      testID="screen.capability.share"
    >
      <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
        <Text style={styles.heading} accessibilityRole="header">
          Share
        </Text>
        <Text style={styles.body}>
          Open the system share sheet or copy a deep link to clipboard.
        </Text>
      </View>

      <Section title="Share target">
        <Row label="URL" value={SHARE_URL} />
      </Section>

      <View style={styles.actions}>
        <Button title="Open share sheet" onPress={() => void onShare()} testID="share.open" />
        <Button
          title="Copy URL to clipboard"
          variant="secondary"
          onPress={() => void onCopy()}
          testID="share.copy"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.text },
  body: { fontSize: theme.typography.body, color: theme.colors.muted, marginTop: theme.spacing.xs },
  actions: { padding: theme.spacing.md, gap: theme.spacing.sm },
});
