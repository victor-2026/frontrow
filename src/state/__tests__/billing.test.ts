import { useBillingStore, nextReceiptId, type Receipt } from '../billing';
import { store } from '../../storage/asyncStore';

/**
 * Billing store backs the in-app-purchase mock surface. It tracks the
 * QA-selected purchase outcome and an array of receipts that drive the
 * Debug menu's "Receipts: N" indicator. Cancel/refund mutations flip
 * status without dropping the receipt — the IAP flows assert on the
 * resulting status text.
 */

const sampleReceipt: Receipt = {
  id: 'rcpt_test',
  productId: 'gold_tier',
  purchasedAt: '2026-05-01T12:00:00.000Z',
  status: 'active',
};

beforeEach(async () => {
  await store.wipe();
  useBillingStore.setState({
    hydrated: false,
    receipts: [],
    outcome: 'success',
  });
});

describe('outcome', () => {
  it('round-trips through storage', async () => {
    await useBillingStore.getState().setOutcome('decline');
    expect(useBillingStore.getState().outcome).toBe('decline');
    expect(await store.get('frontrow.qa.iapOutcome')).toBe('decline');
  });
});

describe('addReceipt', () => {
  it('prepends — newest receipt first', async () => {
    await useBillingStore.getState().addReceipt({ ...sampleReceipt, id: 'rcpt_a' });
    await useBillingStore.getState().addReceipt({ ...sampleReceipt, id: 'rcpt_b' });
    const ids = useBillingStore.getState().receipts.map((r) => r.id);
    expect(ids).toEqual(['rcpt_b', 'rcpt_a']);
  });
});

describe('cancel / refund', () => {
  it('cancel flips status to cancelled', async () => {
    await useBillingStore.getState().addReceipt(sampleReceipt);
    await useBillingStore.getState().cancel(sampleReceipt.id);
    expect(useBillingStore.getState().receipts[0].status).toBe('cancelled');
  });

  it('refund flips status to refunded', async () => {
    await useBillingStore.getState().addReceipt(sampleReceipt);
    await useBillingStore.getState().refund(sampleReceipt.id);
    expect(useBillingStore.getState().receipts[0].status).toBe('refunded');
  });

  it('mutating an unknown id is a no-op (no throw, no change)', async () => {
    await useBillingStore.getState().addReceipt(sampleReceipt);
    await useBillingStore.getState().cancel('rcpt_doesnotexist');
    expect(useBillingStore.getState().receipts[0].status).toBe('active');
  });
});

describe('reset', () => {
  it('drops all receipts and returns outcome to success', async () => {
    await useBillingStore.getState().addReceipt(sampleReceipt);
    await useBillingStore.getState().setOutcome('decline');
    await useBillingStore.getState().reset();
    const s = useBillingStore.getState();
    expect(s.receipts).toEqual([]);
    expect(s.outcome).toBe('success');
  });
});

describe('nextReceiptId', () => {
  it('issues monotonically increasing ids', () => {
    const a = nextReceiptId();
    const b = nextReceiptId();
    const aN = Number(a.split('_')[1]);
    const bN = Number(b.split('_')[1]);
    expect(bN).toBeGreaterThan(aN);
  });
});
