import { Modal, View, Text, StyleSheet, Platform } from 'react-native';

import { theme } from '../theme';
import { Button } from './Button';
import type { Product } from '../billing/products';

type Props = {
  product: Product | null;
  visible: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function MockBillingSheet({ product, visible, loading, onConfirm, onCancel }: Props) {
  if (!product) return null;
  const isIos = Platform.OS === 'ios';
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} testID="billing.sheet">
          <Text style={styles.platform}>
            {isIos ? 'Confirm with Touch ID / Face ID' : 'Google Play'}
          </Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatPrice(product.priceCents)}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.actions}>
            <Button
              testID="billing.sheet.confirm"
              title={loading ? 'Processing…' : `Buy ${formatPrice(product.priceCents)}`}
              onPress={onConfirm}
              loading={loading}
            />
            <Button
              testID="billing.sheet.cancel"
              title="Cancel"
              variant="ghost"
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  platform: {
    textAlign: 'center',
    fontSize: theme.typography.caption,
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    textAlign: 'center',
    fontSize: theme.typography.heading,
    fontWeight: '700',
    color: theme.colors.text,
  },
  price: {
    textAlign: 'center',
    fontSize: theme.typography.title,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  description: { textAlign: 'center', fontSize: theme.typography.body, color: theme.colors.muted },
  actions: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
});
