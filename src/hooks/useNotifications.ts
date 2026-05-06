import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/services/notifications';
import { useAuthStore } from '../state/auth';
import { track } from '../state/analytics';

const KEY = ['notifications'] as const;

export function useNotifications() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: [...KEY, token],
    queryFn: () => listNotifications(token),
    enabled: Boolean(token),
  });
}

export function useUnreadNotificationCount() {
  const { data } = useNotifications();
  return useMemo(() => (data ?? []).filter((n) => !n.readAt).length, [data]);
}

export function useMarkNotificationRead() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(token, id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      track('notifications.markAllRead');
      await markAllNotificationsRead(token);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}
