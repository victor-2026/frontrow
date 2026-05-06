import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { listFavoriteEventIds, addFavorite, removeFavorite } from '../api/services/favorites';
import { useAuthStore } from '../state/auth';
import { track } from '../state/analytics';

const KEY = ['favorites'] as const;

export function useFavoriteEventIds() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: [...KEY, token],
    queryFn: () => listFavoriteEventIds(token),
    enabled: Boolean(token),
  });
}

export function useToggleFavorite() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { eventId: string; favorite: boolean }) => {
      track('favorite.toggle', input);
      if (input.favorite) await addFavorite(token, input.eventId);
      else await removeFavorite(token, input.eventId);
      return input;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
