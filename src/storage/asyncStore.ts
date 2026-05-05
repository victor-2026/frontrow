import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin namespaced wrapper over AsyncStorage. Migrate to MMKV in Phase 5.
 */
export const store = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    return raw == null ? null : (JSON.parse(raw) as T);
  },

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clearNamespace(prefix: string): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const matching = keys.filter((k) => k.startsWith(prefix));
    if (matching.length > 0) {
      await AsyncStorage.multiRemove(matching);
    }
  },

  async wipe(): Promise<void> {
    await AsyncStorage.clear();
  },
};

export const storeKeys = {
  authToken: 'frontrow.auth.token',
  authUser: 'frontrow.auth.user',
  ticketsByUser: (userId: string) => `frontrow.tickets.${userId}`,
  qaTimeOffsetMs: 'frontrow.qa.timeOffsetMs',
  qaScenario: 'frontrow.qa.scenario',
  qaForceError: 'frontrow.qa.forceError',
  qaNetworkDelayMs: 'frontrow.qa.networkDelayMs',
  qaLocale: 'frontrow.qa.locale',
} as const;
