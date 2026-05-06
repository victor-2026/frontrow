import { create } from 'zustand';

import type { User } from '../api/types';
import { store, storeKeys } from '../storage/asyncStore';

type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (token: string, user: User) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  clear: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  async hydrate() {
    const [token, user] = await Promise.all([
      store.get<string>(storeKeys.authToken),
      store.get<User>(storeKeys.authUser),
    ]);
    set({ token: token ?? null, user: user ?? null, hydrated: true });
  },
  async setSession(token, user) {
    await store.set(storeKeys.authToken, token);
    await store.set(storeKeys.authUser, user);
    set({ token, user });
  },
  async setUser(user) {
    await store.set(storeKeys.authUser, user);
    set({ user });
  },
  async clear() {
    await store.remove(storeKeys.authToken);
    await store.remove(storeKeys.authUser);
    set({ token: null, user: null });
  },
}));
