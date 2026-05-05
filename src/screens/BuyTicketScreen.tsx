import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { theme } from '../theme';
import { testIds } from '../testIds';
import { Button } from '../components/Button';
import { useEvent } from '../hooks/useEvents';
import { usePurchaseTicket } from '../hooks/useTickets';
import { useAuthStore } from '../state/auth';
import { formatPrice } from '../utils/format';
import type { EventsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<EventsStackParamList, 'BuyTicket'>;

export function BuyTicketScreen({ route }: Props) {
  const { eventId } = route.params;
  const nav = useNavigation();
  const { data: event } = useEvent(eventId);
  const { mutateAsync, isPending } = usePurchaseTicket();
  const token = useAuthStore((s) => s.token);
  const [qty, setQty] = useState(1);

  if (!event) return null;

  const totalCents = event.priceCents * qty;

  const onPay = async () => {
    if (!token) {
      Alert.alert('Sign in required', 'Please sign in to purchase tickets.');
      return;
    }
    try {
      await mutateAsync({ eventId: event.id, quantity: qty });
      nav.goBack();
      Alert.alert('Success', 'Ticket purchased.');
    } catch (e) {
      Alert.alert('Purchase failed', (e as Error).message);
    }
  };

  return (
    <View style={styles.container} testID={testIds.buyTicket.screen}>
      <Text style={styles.heading}>{event.title}</Text>
      <View testID={testIds.buyTicket.quantityStepper} style={styles.stepper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrease quantity"
          onPress={() => setQty((q) => Math.max(1, q - 1))}
          style={styles.stepBtn}
        >
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <Text style={styles.qty} accessibilityLabel={`Quantity ${qty}`}>
          {qty}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increase quantity"
          onPress={() => setQty((q) => Math.min(10, q + 1))}
          style={styles.stepBtn}
        >
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
      <Text style={styles.total}>Total: {formatPrice(totalCents, event.currency)}</Text>
      <Button
        testID={testIds.buyTicket.payButton}
        title={isPending ? 'Processing…' : 'Confirm purchase'}
        onPress={onPay}
        loading={isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  heading: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.text },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontSize: theme.typography.title, color: theme.colors.text },
  qty: {
    fontSize: theme.typography.heading,
    color: theme.colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
  total: { fontSize: theme.typography.title, color: theme.colors.text },
});
