import { create } from 'zustand';

import { store, storeKeys } from '../storage/asyncStore';

export type PurchaseOutcome = 'success' | 'decline' | 'cancel' | 'pending';

export type Receipt = {
  id: string;
  productId: string;
  purchasedAt: string;
  status: 'active' | 'cancelled' | 'expired' | 'refunded';
  /** Subscription only. */
  expiresAt?: string;
};

const RECEIPTS_KEY = 'frontrow.billing.receipts';
const OUTCOME_KEY = 'frontrow.qa.iapOutcome';

type BillingState = {
  hydrated: boolean;
  receipts: Receipt[];
  outcome: PurchaseOutcome;
  hydrate: () => Promise<void>;
  setOutcome: (o: PurchaseOutcome) => Promise<void>;
  addReceipt: (r: Receipt) => Promise<void>;
  cancel: (receiptId: string) => Promise<void>;
  refund: (receiptId: string) => Promise<void>;
  reset: () => Promise<void>;
};

let receiptCounter = 1000;
function nextReceiptId(): string {
  receiptCounter += 1;
  return `rcpt_${receiptCounter}`;
}

export { nextReceiptId };

export const useBillingStore = create<BillingState>((set, get) => ({
  hydrated: false,
  receipts: [],
  outcome: 'success',
  async hydrate() {
    const [receipts, outcome] = await Promise.all([
      store.get<Receipt[]>(RECEIPTS_KEY),
      store.get<PurchaseOutcome>(OUTCOME_KEY),
    ]);
    set({
      receipts: receipts ?? [],
      outcome: outcome ?? 'success',
      hydrated: true,
    });
  },
  async setOutcome(o) {
    await store.set(OUTCOME_KEY, o);
    set({ outcome: o });
  },
  async addReceipt(r) {
    const next = [r, ...get().receipts];
    await store.set(RECEIPTS_KEY, next);
    set({ receipts: next });
  },
  async cancel(receiptId) {
    const next = get().receipts.map((r) =>
      r.id === receiptId ? { ...r, status: 'cancelled' as const } : r,
    );
    await store.set(RECEIPTS_KEY, next);
    set({ receipts: next });
  },
  async refund(receiptId) {
    const next = get().receipts.map((r) =>
      r.id === receiptId ? { ...r, status: 'refunded' as const } : r,
    );
    await store.set(RECEIPTS_KEY, next);
    set({ receipts: next });
  },
  async reset() {
    await store.remove(RECEIPTS_KEY);
    set({ receipts: [], outcome: 'success' });
  },
}));

void storeKeys; // keep referenced; re-exported via hydrate keys above
