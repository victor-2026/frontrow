import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { listMyTickets, purchaseTicket, cancelTicket } from '../api/services/tickets';
import { useAuthStore } from '../state/auth';

export function useMyTickets() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['tickets', 'mine', token],
    queryFn: () => listMyTickets(token),
    enabled: Boolean(token),
  });
}

export function usePurchaseTicket() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { eventId: string; quantity: number; tier?: string }) =>
      purchaseTicket(token, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['tickets', 'mine'] });
    },
  });
}

export function useCancelTicket() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelTicket(token, id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['tickets', 'mine'] });
    },
  });
}
