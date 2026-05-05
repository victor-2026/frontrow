import { useQuery } from '@tanstack/react-query';

import { listEvents, getEvent, type EventFilters } from '../api/services/events';

export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => listEvents(filters),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => getEvent(id),
    enabled: Boolean(id),
  });
}
