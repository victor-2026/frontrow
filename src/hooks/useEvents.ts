import { useQuery } from '@tanstack/react-query';

import { api } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { Event } from '../api/types';

export function useEvents(filters: { q?: string; genre?: string } = {}) {
  const search = new URLSearchParams();
  if (filters.q) search.set('q', filters.q);
  if (filters.genre) search.set('genre', filters.genre);
  const url = `${endpoints.events.list()}${search.size ? `?${search.toString()}` : ''}`;

  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => api<Event[]>(url),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => api<Event>(endpoints.events.detail(id)),
    enabled: Boolean(id),
  });
}
