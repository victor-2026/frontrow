export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export type Venue = {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  capacity: number;
};

export type Event = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  startsAt: string; // ISO
  doorsAt: string; // ISO
  venue: Venue;
  priceCents: number;
  currency: CurrencyCode;
  imageUrl: string;
  soldOut: boolean;
  tags: string[];
};

export type TicketStatus = 'active' | 'used' | 'cancelled' | 'refunded' | 'refund_pending';

export type Ticket = {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  tier: string;
  purchasedAt: string; // ISO
  totalCents: number;
  currency: CurrencyCode;
  status: TicketStatus;
  qrPayload: string;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string; // ISO
  locked?: boolean;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiError = {
  code: string;
  message: string;
};
