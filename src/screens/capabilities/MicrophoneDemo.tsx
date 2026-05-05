import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';

import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { Section } from '../../components/Section';
import { Row } from '../../components/Row';

export function MicrophoneDemo() {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'unknown'>('unknown');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const request = async () => {
    const r = await Audio.requestPermissionsAsync();
    setPermission(r.granted ? 'granted' : 'denied');
  };

  const start = async () => {
    setBusy(true);
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const r = new Audio.Recording();
      await r.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await r.startAsync();
      setRecording(r);
    } catch (e) {
      Alert.alert('Recording error', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const stop = async () => {
    if (!recording) return;
    setBusy(true);
    try {
      await recording.stopAndUnloadAsync();
      setUri(recording.getURI());
      setRecording(null);
    } catch (e) {
      Alert.alert('Stop error', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingVertical: theme.spacing.md }}
      testID="screen.capability.microphone"
    >
      <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
        <Text style={styles.heading} accessibilityRole="header">
          Microphone
        </Text>
        <Text style={styles.body}>Request mic access and record a short audio clip.</Text>
      </View>

      <Section title="Permission">
        <Row label="Status" value={permission} />
      </Section>

      <View style={styles.actions}>
        <Button
          title="Request permission"
          variant="secondary"
          onPress={() => void request()}
          testID="microphone.requestPermission"
        />
        {recording ? (
          <Button
            title="Stop"
            onPress={() => void stop()}
            loading={busy}
            testID="microphone.stop"
          />
        ) : (
          <Button
            title="Record"
            onPress={() => void start()}
            loading={busy}
            testID="microphone.record"
          />
        )}
      </View>

      {uri && (
        <Section title="Last recording">
          <Row label="URI" value={uri} />
        </Section>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.text },
  body: { fontSize: theme.typography.body, color: theme.colors.muted, marginTop: theme.spacing.xs },
  actions: { padding: theme.spacing.md, gap: theme.spacing.sm },
});
