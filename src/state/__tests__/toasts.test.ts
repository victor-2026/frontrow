import { useToastsStore, showToast } from '../toasts';

/**
 * Toast store has one subtle behavior worth pinning: each `show` call
 * schedules a `dismiss` via setTimeout, so the toast auto-disappears
 * after its duration. We use jest fake timers to assert that without
 * actually waiting wall-clock seconds.
 */

beforeEach(() => {
  useToastsStore.setState({ toasts: [] });
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('show', () => {
  it('appends a toast with sensible defaults', () => {
    useToastsStore.getState().show({ message: 'Hi' });
    const t = useToastsStore.getState().toasts[0];
    expect(t.message).toBe('Hi');
    expect(t.kind).toBe('info');
    expect(t.durationMs).toBe(3000);
  });

  it('honors explicit kind + durationMs', () => {
    useToastsStore.getState().show({ message: 'Boom', kind: 'error', durationMs: 1500 });
    const t = useToastsStore.getState().toasts[0];
    expect(t.kind).toBe('error');
    expect(t.durationMs).toBe(1500);
  });

  it('auto-dismisses after the duration elapses', () => {
    useToastsStore.getState().show({ message: 'Bye', durationMs: 2000 });
    expect(useToastsStore.getState().toasts).toHaveLength(1);
    jest.advanceTimersByTime(1999);
    expect(useToastsStore.getState().toasts).toHaveLength(1);
    jest.advanceTimersByTime(1);
    expect(useToastsStore.getState().toasts).toHaveLength(0);
  });
});

describe('dismiss', () => {
  it('removes a toast by id', () => {
    useToastsStore.getState().show({ message: 'A' });
    useToastsStore.getState().show({ message: 'B' });
    const idA = useToastsStore.getState().toasts[0].id;
    useToastsStore.getState().dismiss(idA);
    const remaining = useToastsStore.getState().toasts;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].message).toBe('B');
  });
});

describe('showToast (free function)', () => {
  it('routes through the store', () => {
    showToast('Quick', 'success', 1000);
    const t = useToastsStore.getState().toasts[0];
    expect(t.message).toBe('Quick');
    expect(t.kind).toBe('success');
  });
});

describe('clear', () => {
  it('drops all toasts', () => {
    useToastsStore.getState().show({ message: 'A' });
    useToastsStore.getState().show({ message: 'B' });
    useToastsStore.getState().clear();
    expect(useToastsStore.getState().toasts).toEqual([]);
  });
});
