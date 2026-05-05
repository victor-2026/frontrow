/**
 * Logical endpoint paths. Even though FrontRow has no real backend, the app issues
 * normal `fetch` calls against these paths and MSW intercepts them. This keeps the
 * client code identical to a "real" networked app.
 */
export const API_BASE = 'https://api.frontrow.app';

export const endpoints = {
  events: {
    list: () => `${API_BASE}/events`,
    detail: (id: string) => `${API_BASE}/events/${id}`,
  },
  auth: {
    login: () => `${API_BASE}/auth/login`,
    logout: () => `${API_BASE}/auth/logout`,
    me: () => `${API_BASE}/auth/me`,
  },
  tickets: {
    list: () => `${API_BASE}/tickets`,
    detail: (id: string) => `${API_BASE}/tickets/${id}`,
    purchase: () => `${API_BASE}/tickets`,
    cancel: (id: string) => `${API_BASE}/tickets/${id}/cancel`,
    restore: () => `${API_BASE}/tickets/restore`,
  },
} as const;
