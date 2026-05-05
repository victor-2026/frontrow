import { applyQaDelay, ApiClientError } from '../api/client';
import { useBillingStore, nextReceiptId, type Receipt } from '../state/billing';
import { findProduct } from './products';
import { now } from '../state/qa';
import { track } from '../state/analytics';

export class BillingError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'BillingError';
    this.code = code;
  }
}

export async function purchase(productId: string): Promise<Receipt> {
  const product = findProduct(productId);
  if (!product) {
    throw new BillingError('product_not_found', `Unknown product ${productId}.`);
  }
  await applyQaDelay();

  const outcome = useBillingStore.getState().outcome;
  track('billing.purchase.attempt', { productId, outcome });

  if (outcome === 'cancel') {
    throw new BillingError('user_cancelled', 'Purchase cancelled.');
  }
  if (outcome === 'decline') {
    throw new BillingError('payment_declined', 'Payment was declined by the issuer.');
  }
  if (outcome === 'pending') {
    throw new BillingError('pending_review', 'Purchase is pending review. Check back later.');
  }

  const purchasedAt = now();
  const receipt: Receipt = {
    id: nextReceiptId(),
    productId,
    purchasedAt: purchasedAt.toISOString(),
    status: 'active',
    ...(product.durationDays
      ? {
          expiresAt: new Date(
            purchasedAt.getTime() + product.durationDays * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }
      : {}),
  };
  await useBillingStore.getState().addReceipt(receipt);
  track('billing.purchase.success', { productId, receiptId: receipt.id });
  return receipt;
}

/**
 * Mimics Apple's restorePurchases / Google's queryPurchases — re-emits all
 * non-consumable / subscription receipts that should still be active.
 */
export async function restorePurchases(): Promise<Receipt[]> {
  await applyQaDelay();
  const receipts = useBillingStore.getState().receipts;
  const restored = receipts.filter((r) => {
    if (r.status === 'cancelled' || r.status === 'refunded') return false;
    if (r.expiresAt && new Date(r.expiresAt) < now()) return false;
    return true;
  });
  track('billing.restore', { count: restored.length });
  return restored;
}

/** Last-line safety so callers can show a uniform error UI. */
export function asApiError(e: unknown): ApiClientError {
  if (e instanceof BillingError) {
    return new ApiClientError(402, { code: e.code, message: e.message });
  }
  if (e instanceof ApiClientError) return e;
  return new ApiClientError(500, {
    code: 'unknown',
    message: e instanceof Error ? e.message : 'Unknown error',
  });
}
