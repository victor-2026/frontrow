import { useQaStore, NETWORK_PROFILES, failIfTriggered } from '../qa';

/**
 * The QA store is the single source of truth for every test-affecting
 * toggle: failure triggers, network profiles, time travel, scenario
 * selection. Bugs here ripple into every flow that depends on
 * deterministic test conditions, so behavior worth pinning down:
 *
 *   - profile transitions correctly compose with the offline forceError
 *   - triggers compose (multiple on at once) and clear cleanly
 *   - failIfTriggered throws with the expected error code
 *   - reset returns the store to its pristine defaults
 */

beforeEach(() => {
  // Each test sees a clean store. We can't call reset() because that's
  // async + writes MMKV; setState is synchronous and self-contained.
  useQaStore.setState({
    timeOffsetMs: 0,
    scenario: null,
    forceError: 'none',
    networkDelayMs: 0,
    networkProfile: 'online',
    locale: null,
    triggers: {
      push: false,
      geolocation: false,
      camera: false,
      biometric: false,
      imageUpload: false,
      sessionExpired: false,
      paymentTimeout: false,
      reviewSubmit: false,
    },
  });
});

describe('NETWORK_PROFILES', () => {
  it('exposes the five named presets in order', () => {
    expect(NETWORK_PROFILES.map((p) => p.id)).toEqual([
      'online',
      'slow4g',
      'fast3g',
      'slow3g',
      'offline',
    ]);
  });

  it('online has zero delay; slow profiles add latency', () => {
    expect(NETWORK_PROFILES[0]).toMatchObject({ id: 'online', delayMs: 0 });
    const slow3g = NETWORK_PROFILES.find((p) => p.id === 'slow3g');
    expect(slow3g?.delayMs).toBeGreaterThan(1000);
  });
});

describe('setNetworkProfile', () => {
  it('applies the matching delay and updates networkProfile', async () => {
    await useQaStore.getState().setNetworkProfile('fast3g');
    const state = useQaStore.getState();
    expect(state.networkProfile).toBe('fast3g');
    expect(state.networkDelayMs).toBe(NETWORK_PROFILES.find((p) => p.id === 'fast3g')!.delayMs);
  });

  it('offline preset doubles as the offline forceError', async () => {
    await useQaStore.getState().setNetworkProfile('offline');
    expect(useQaStore.getState().forceError).toBe('offline');
  });

  it('leaving offline auto-clears the offline forceError', async () => {
    await useQaStore.getState().setNetworkProfile('offline');
    expect(useQaStore.getState().forceError).toBe('offline');
    await useQaStore.getState().setNetworkProfile('online');
    expect(useQaStore.getState().forceError).toBe('none');
  });

  it('does not clobber a non-offline forceError when leaving offline', async () => {
    await useQaStore.getState().setForceError('5xx');
    // Switching profiles shouldn't override an explicitly chosen non-offline error.
    await useQaStore.getState().setNetworkProfile('fast3g');
    expect(useQaStore.getState().forceError).toBe('5xx');
  });

  it('ignores unknown profile ids', async () => {
    const before = useQaStore.getState();
    // @ts-expect-error — testing the runtime guard
    await useQaStore.getState().setNetworkProfile('lte');
    const after = useQaStore.getState();
    expect(after.networkProfile).toBe(before.networkProfile);
  });
});

describe('failure triggers', () => {
  it('starts with all triggers off', () => {
    const triggers = useQaStore.getState().triggers;
    expect(Object.values(triggers).every((v) => v === false)).toBe(true);
  });

  it('compose: setting two triggers leaves both on', () => {
    useQaStore.getState().setTrigger('paymentTimeout', true);
    useQaStore.getState().setTrigger('sessionExpired', true);
    const triggers = useQaStore.getState().triggers;
    expect(triggers.paymentTimeout).toBe(true);
    expect(triggers.sessionExpired).toBe(true);
  });

  it('clearTriggers resets every trigger to off in one call', () => {
    useQaStore.getState().setTrigger('biometric', true);
    useQaStore.getState().setTrigger('camera', true);
    useQaStore.getState().clearTriggers();
    const triggers = useQaStore.getState().triggers;
    expect(Object.values(triggers).every((v) => v === false)).toBe(true);
  });

  it('failIfTriggered no-ops when the trigger is off', () => {
    expect(() => failIfTriggered('camera')).not.toThrow();
  });

  it('failIfTriggered throws with the kind-derived error code', () => {
    useQaStore.getState().setTrigger('imageUpload', true);
    let caught: unknown;
    try {
      failIfTriggered('imageUpload');
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error & { code: string }).code).toBe('qa_trigger_imageUpload');
  });

  it('failIfTriggered honors a custom message', () => {
    useQaStore.getState().setTrigger('push', true);
    expect(() => failIfTriggered('push', 'push gateway down')).toThrow('push gateway down');
  });
});

describe('time travel', () => {
  it('setTimeOffsetMs reflects on read', async () => {
    await useQaStore.getState().setTimeOffsetMs(60_000);
    expect(useQaStore.getState().timeOffsetMs).toBe(60_000);
  });
});
