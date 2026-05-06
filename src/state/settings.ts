import { create } from 'zustand';

import { store } from '../storage/asyncStore';

const NOTIFICATIONS_KEY = 'frontrow.settings.notifications';

type SettingsState = {
  hydrated: boolean;
  notificationsEnabled: boolean;
  hydrate: () => Promise<void>;
  setNotificationsEnabled: (v: boolean) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  hydrated: false,
  notificationsEnabled: true,
  async hydrate() {
    const v = await store.get<boolean>(NOTIFICATIONS_KEY);
    set({ notificationsEnabled: v ?? true, hydrated: true });
  },
  async setNotificationsEnabled(v) {
    await store.set(NOTIFICATIONS_KEY, v);
    set({ notificationsEnabled: v });
  },
}));
