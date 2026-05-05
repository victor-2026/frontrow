export type ProductKind = 'consumable' | 'non_consumable' | 'subscription';

export type Product = {
  id: string;
  kind: ProductKind;
  title: string;
  description: string;
  priceCents: number;
  currency: 'USD';
  /** Subscription only. */
  durationDays?: number;
};

export const products: Product[] = [
  {
    id: 'frontrow.fanclub.monthly',
    kind: 'subscription',
    title: 'Fan Club — Monthly',
    description: 'Early access to ticket sales and exclusive merch drops.',
    priceCents: 499,
    currency: 'USD',
    durationDays: 30,
  },
  {
    id: 'frontrow.vip.upgrade',
    kind: 'non_consumable',
    title: 'VIP Upgrade',
    description: 'Unlock VIP tiers across every event you book.',
    priceCents: 1999,
    currency: 'USD',
  },
  {
    id: 'frontrow.beer.voucher',
    kind: 'consumable',
    title: 'Beer Voucher',
    description: 'Redeem one drink at the bar at any partner venue.',
    priceCents: 800,
    currency: 'USD',
  },
];

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
