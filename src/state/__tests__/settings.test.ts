import { useSettingsStore } from '../settings';
import { store } from '../../storage/asyncStore';

/**
 * Settings store owns the onboarding state machine, the appearance
 * preference (light/dark/system), and the notifications toggle. The
 * onboarding lifecycle is the most error-prone slice — startOnboarding
 * and finishOnboarding both write to MMKV and update local state, and
 * subtle bugs here would force every QA flow to bounce through
 * onboarding on cold launch.
 */

beforeEach(async () => {
  await store.wipe();
  // Reset to fresh defaults — useSettingsStore is module-level so it
  // carries state between tests unless we explicitly reset.
  useSettingsStore.setState({
    hydrated: false,
    notificationsEnabled: true,
    onboardingPending: false,
    appearance: 'system',
  });
});

describe('hydrate', () => {
  it('falls back to defaults when storage is empty', async () => {
    await useSettingsStore.getState().hydrate();
    const s = useSettingsStore.getState();
    expect(s.hydrated).toBe(true);
    expect(s.notificationsEnabled).toBe(true);
    expect(s.onboardingPending).toBe(false);
    expect(s.appearance).toBe('system');
  });

  it('reads previously persisted values', async () => {
    await store.set('frontrow.settings.notifications', false);
    await store.set('frontrow.settings.onboardingPending', true);
    await store.set('frontrow.settings.appearance', 'dark');
    await useSettingsStore.getState().hydrate();
    const s = useSettingsStore.getState();
    expect(s.notificationsEnabled).toBe(false);
    expect(s.onboardingPending).toBe(true);
    expect(s.appearance).toBe('dark');
  });
});

describe('onboarding lifecycle', () => {
  it('startOnboarding flips pending to true and persists', async () => {
    await useSettingsStore.getState().startOnboarding();
    expect(useSettingsStore.getState().onboardingPending).toBe(true);
    expect(await store.get('frontrow.settings.onboardingPending')).toBe(true);
  });

  it('finishOnboarding flips pending to false and removes the storage key', async () => {
    await useSettingsStore.getState().startOnboarding();
    await useSettingsStore.getState().finishOnboarding();
    expect(useSettingsStore.getState().onboardingPending).toBe(false);
    expect(await store.get('frontrow.settings.onboardingPending')).toBeNull();
  });

  it('finishOnboarding is idempotent — calling twice stays at false', async () => {
    await useSettingsStore.getState().finishOnboarding();
    await useSettingsStore.getState().finishOnboarding();
    expect(useSettingsStore.getState().onboardingPending).toBe(false);
  });
});

describe('appearance', () => {
  it('round-trips through storage', async () => {
    await useSettingsStore.getState().setAppearance('dark');
    expect(useSettingsStore.getState().appearance).toBe('dark');
    expect(await store.get('frontrow.settings.appearance')).toBe('dark');
    await useSettingsStore.getState().setAppearance('light');
    expect(useSettingsStore.getState().appearance).toBe('light');
  });
});

describe('notifications toggle', () => {
  it('round-trips through storage', async () => {
    await useSettingsStore.getState().setNotificationsEnabled(false);
    expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
    expect(await store.get('frontrow.settings.notifications')).toBe(false);
  });
});
