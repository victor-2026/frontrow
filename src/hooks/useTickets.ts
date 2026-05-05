import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { Ticket } from '../api/types';
import { useAuthStore } from '../state/auth';

export function useMyTickets() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['tickets', 'mine', token],
    queryFn: () => api<Ticket[]>(endpoints.tickets.list(), { token }),
    enabled: Boolean(token),
  });
}

export function usePurchaseTicket() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { eventId: string; quantity: number; tier?: string }) =>
      api<Ticket>(endpoints.tickets.purchase(), {
        method: 'POST',
        body: JSON.stringify(input),
        token,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['tickets', 'mine'] });
    },
  });
}

export function useCancelTicket() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<Ticket>(endpoints.tickets.cancel(id), { method: 'POST', token }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['tickets', 'mine'] });
    },
  });
}
