import { useAuthStore } from '../auth';
import { store } from '../../storage/asyncStore';

/**
 * Auth store is the source of truth for "is the user signed in." Every
 * authed query keys off `token`, so transitions here ripple into the
 * whole app. The contract worth pinning:
 *   - setSession persists token + user; both flip on the in-memory
 *     state and in MMKV in one round-trip
 *   - clear wipes both
 *   - setUser updates only the profile, leaving the token untouched
 *     (used by editProfile)
 *   - hydrate reads back what was persisted
 */

const DEMO_USER = {
  id: 'usr_test',
  email: 'test@frontrow.app',
  displayName: 'Test',
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
};

beforeEach(async () => {
  await store.wipe();
  useAuthStore.setState({ token: null, user: null, hydrated: false });
});

describe('setSession', () => {
  it('persists token and user, sets in-memory state', async () => {
    await useAuthStore.getState().setSession('tok_abc', DEMO_USER);
    expect(useAuthStore.getState().token).toBe('tok_abc');
    expect(useAuthStore.getState().user).toEqual(DEMO_USER);
    expect(await store.get('frontrow.auth.token')).toBe('tok_abc');
    expect(await store.get('frontrow.auth.user')).toEqual(DEMO_USER);
  });
});

describe('setUser', () => {
  it('updates profile fields without disturbing the token', async () => {
    await useAuthStore.getState().setSession('tok_abc', DEMO_USER);
    const updated = { ...DEMO_USER, displayName: 'Renamed' };
    await useAuthStore.getState().setUser(updated);
    expect(useAuthStore.getState().token).toBe('tok_abc');
    expect(useAuthStore.getState().user?.displayName).toBe('Renamed');
  });
});

describe('clear', () => {
  it('wipes both token and user from memory and storage', async () => {
    await useAuthStore.getState().setSession('tok_abc', DEMO_USER);
    await useAuthStore.getState().clear();
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(await store.get('frontrow.auth.token')).toBeNull();
    expect(await store.get('frontrow.auth.user')).toBeNull();
  });
});

describe('hydrate', () => {
  it('restores persisted session', async () => {
    await store.set('frontrow.auth.token', 'tok_persisted');
    await store.set('frontrow.auth.user', DEMO_USER);
    await useAuthStore.getState().hydrate();
    const s = useAuthStore.getState();
    expect(s.hydrated).toBe(true);
    expect(s.token).toBe('tok_persisted');
    expect(s.user).toEqual(DEMO_USER);
  });

  it('hydrates with null when nothing was persisted (cold install)', async () => {
    await useAuthStore.getState().hydrate();
    const s = useAuthStore.getState();
    expect(s.hydrated).toBe(true);
    expect(s.token).toBeNull();
    expect(s.user).toBeNull();
  });
});
