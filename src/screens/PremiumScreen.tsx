import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';

import { theme } from '../theme';
import { Button } from '../components/Button';
import { Section } from '../components/Section';
import { Row } from '../components/Row';
import { MockBillingSheet } from '../components/MockBillingSheet';
import { products, type Product } from '../billing/products';
import { purchase, restorePurchases, asApiError } from '../billing/service';
import { useBillingStore } from '../state/billing';

export function PremiumScreen() {
  const receipts = useBillingStore((s) => s.receipts);
  const [pending, setPending] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const onConfirm = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await purchase(pending.id);
      Alert.alert('Purchased', `You unlocked ${pending.title}.`);
      setPending(null);
    } catch (e) {
      const err = asApiError(e);
      Alert.alert('Purchase failed', err.message);
    } finally {
      setBusy(false);
    }
  };

  const onRestore = async () => {
    setBusy(true);
    try {
      const restored = await restorePurchases();
      Alert.alert('Restored', `${restored.length} entitlement(s) restored.`);
    } catch (e) {
      Alert.alert('Restore failed', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      testID="screen.premium"
      contentContainerStyle={{ paddingVertical: theme.spacing.md }}
    >
      <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
        <Text style={styles.heading} accessibilityRole="header">
          Premium
        </Text>
        <Text style={styles.body}>
          Mock in-app purchases. Outcome is controlled from the QA Debug Menu.
        </Text>
      </View>

      <Section title="Products">
        {products.map((p) => (
          <Row key={p.id} label={p.title} value={formatPrice(p.priceCents)}>
            <Text style={styles.productDescription}>{p.description}</Text>
            <Button
              testID={`premium.buy.${p.id}`}
              title={`Buy ${formatPrice(p.priceCents)}`}
              onPress={() => setPending(p)}
            />
          </Row>
        ))}
      </Section>

      <View style={styles.actions}>
        <Button
          testID="premium.restore"
          title={busy ? 'Restoring…' : 'Restore purchases'}
          variant="secondary"
          onPress={() => void onRestore()}
          loading={busy}
        />
      </View>

      <Section title="Receipts">
        {receipts.length === 0 ? (
          <Row label="None" />
        ) : (
          receipts.map((r) => (
            <Row
              key={r.id}
              testID={`premium.receipt.${r.id}`}
              label={r.productId}
              value={`${r.status}${r.expiresAt ? ` · expires ${r.expiresAt.slice(0, 10)}` : ''}`}
            />
          ))
        )}
      </Section>

      <MockBillingSheet
        product={pending}
        visible={pending != null}
        loading={busy}
        onConfirm={() => void onConfirm()}
        onCancel={() => setPending(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.text },
  body: { fontSize: theme.typography.body, color: theme.colors.muted, marginTop: theme.spacing.xs },
  productDescription: {
    fontSize: theme.typography.caption,
    color: theme.colors.muted,
    paddingVertical: theme.spacing.xs,
  },
  actions: { padding: theme.spacing.md },
});
