import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { AuthResponse } from '../api/types';
import { useAuthStore } from '../state/auth';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await api<AuthResponse>(endpoints.auth.login(), {
        method: 'POST',
        body: JSON.stringify(input),
      });
      await setSession(res.token, res.user);
      return res;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useLogout() {
  const token = useAuthStore((s) => s.token);
  const clear = useAuthStore((s) => s.clear);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (token) {
        try {
          await api(endpoints.auth.logout(), { method: 'POST', token });
        } catch {
          // best-effort; logout always clears local session
        }
      }
      await clear();
    },
    onSuccess: () => {
      qc.clear();
    },
  });
}
