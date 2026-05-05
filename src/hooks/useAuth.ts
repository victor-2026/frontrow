import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login, logout } from '../api/services/auth';
import { useAuthStore } from '../state/auth';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await login(input);
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
      try {
        await logout(token);
      } catch {
        // best-effort; logout always clears local session
      }
      await clear();
    },
    onSuccess: () => {
      qc.clear();
    },
  });
}
