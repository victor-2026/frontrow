import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

import { theme } from '../theme';
import { testIds } from '../testIds';
import type { Event } from '../api/types';
import { formatPrice, formatEventDate } from '../utils/format';

type Props = {
  event: Event;
  onPress: (event: Event) => void;
};

export function EventListItem({ event, onPress }: Props) {
  return (
    <Pressable
      testID={testIds.events.item(event.id)}
      accessibilityRole="button"
      accessibilityLabel={`${event.title} at ${event.venue.name}`}
      onPress={() => onPress(event)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
    >
      <Image source={{ uri: event.imageUrl }} style={styles.image} accessible={false} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {event.venue.name} · {event.venue.city}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.date}>{formatEventDate(event.startsAt)}</Text>
          <Text style={[styles.price, event.soldOut && styles.soldOut]}>
            {event.soldOut ? 'Sold out' : formatPrice(event.priceCents, event.currency)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },
  body: { flex: 1, marginLeft: theme.spacing.md, justifyContent: 'space-between' },
  title: { fontSize: theme.typography.title, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: theme.typography.caption, color: theme.colors.muted },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: theme.typography.caption, color: theme.colors.muted },
  price: { fontSize: theme.typography.body, fontWeight: '600', color: theme.colors.primary },
  soldOut: { color: theme.colors.danger },
});
