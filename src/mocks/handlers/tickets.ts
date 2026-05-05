import { http, HttpResponse } from 'msw';

import { endpoints } from '../../api/endpoints';
import type { Ticket } from '../../api/types';
import { mockState } from '../state';

function authedUserId(req: Request): string | null {
  const token = req.headers.get('Authorization')?.replace(/^Bearer /, '');
  return token ? (mockState.sessions.get(token) ?? null) : null;
}

let ticketCounter = 100;
function nextTicketId(): string {
  ticketCounter += 1;
  return `tkt_${ticketCounter.toString().padStart(3, '0')}`;
}

export const ticketHandlers = [
  http.get(endpoints.tickets.list(), ({ request }) => {
    const userId = authedUserId(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 'unauthorized', message: 'Sign in required.' },
        { status: 401 },
      );
    }
    return HttpResponse.json(mockState.tickets.filter((t) => t.userId === userId));
  }),

  http.post(endpoints.tickets.purchase(), async ({ request }) => {
    const userId = authedUserId(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 'unauthorized', message: 'Sign in required.' },
        { status: 401 },
      );
    }
    const body = (await request.json()) as {
      eventId: string;
      quantity: number;
      tier?: string;
    };
    const event = mockState.events.find((e) => e.id === body.eventId);
    if (!event) {
      return HttpResponse.json({ code: 'not_found', message: 'Event not found.' }, { status: 404 });
    }
    if (event.soldOut) {
      return HttpResponse.json(
        { code: 'sold_out', message: 'This event is sold out.' },
        { status: 409 },
      );
    }
    const ticket: Ticket = {
      id: nextTicketId(),
      userId,
      eventId: event.id,
      quantity: body.quantity,
      tier: body.tier ?? 'General Admission',
      purchasedAt: new Date().toISOString(),
      totalCents: event.priceCents * body.quantity,
      currency: event.currency,
      status: 'active',
      qrPayload: `FR-${nextTicketId()}-${event.id}-${body.quantity}`,
    };
    mockState.tickets.push(ticket);
    return HttpResponse.json(ticket, { status: 201 });
  }),

  http.post(`${endpoints.tickets.list()}/:id/cancel`, ({ params, request }) => {
    const userId = authedUserId(request);
    if (!userId) {
      return HttpResponse.json(
        { code: 'unauthorized', message: 'Sign in required.' },
        { status: 401 },
      );
    }
    const id = params['id'] as string;
    const ticket = mockState.tickets.find((t) => t.id === id && t.userId === userId);
    if (!ticket) {
      return HttpResponse.json(
        { code: 'not_found', message: 'Ticket not found.' },
        { status: 404 },
      );
    }
    if (ticket.status !== 'active') {
      return HttpResponse.json(
        { code: 'invalid_state', message: 'Only active tickets can be cancelled.' },
        { status: 409 },
      );
    }
    ticket.status = 'refund_pending';
    return HttpResponse.json(ticket);
  }),
];
