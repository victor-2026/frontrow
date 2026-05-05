import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';

import { theme } from '../../theme';
import { Button } from '../../components/Button';
import { Section } from '../../components/Section';
import { Row } from '../../components/Row';

export function CalendarDemo() {
  const [permission, setPermission] = useState<Calendar.PermissionStatus | 'unknown'>('unknown');
  const [lastEventId, setLastEventId] = useState<string | null>(null);

  const request = async () => {
    const r = await Calendar.requestCalendarPermissionsAsync();
    setPermission(r.status);
  };

  const addEvent = async () => {
    try {
      const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const writable = cals.find((c) => c.allowsModifications);
      if (!writable) {
        Alert.alert('No writable calendar', 'Connect a calendar account first.');
        return;
      }
      const start = new Date();
      start.setHours(start.getHours() + 1);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const id = await Calendar.createEventAsync(writable.id, {
        title: 'Midnight Howl Live in Brooklyn',
        startDate: start,
        endDate: end,
        location: 'Warsaw, Brooklyn, NY',
        notes: 'FrontRow event',
      });
      setLastEventId(id);
      Alert.alert('Added', 'Event added to your calendar.');
    } catch (e) {
      Alert.alert('Calendar error', (e as Error).message);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingVertical: theme.spacing.md }}
      testID="screen.capability.calendar"
    >
      <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
        <Text style={styles.heading} accessibilityRole="header">
          Calendar
        </Text>
        <Text style={styles.body}>Request access and add an event to a writable calendar.</Text>
      </View>

      <Section title="Permission">
        <Row label="Status" value={permission} />
      </Section>

      <View style={styles.actions}>
        <Button
          title="Request permission"
          variant="secondary"
          onPress={() => void request()}
          testID="calendar.requestPermission"
        />
        <Button
          title="Add event in 1h"
          onPress={() => void addEvent()}
          testID="calendar.addEvent"
        />
      </View>

      {lastEventId && (
        <Section title="Last event">
          <Row label="ID" value={lastEventId} />
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
