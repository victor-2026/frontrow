import { useAnalyticsStore, track } from '../analytics';

/**
 * Analytics is a purely in-memory ring buffer of recent events. Two
 * invariants worth pinning:
 *   - newest event at index 0 (descending order, matches DebugScreen
 *     which displays the most recent events first)
 *   - capped at 200 entries, oldest evicted when the buffer overflows
 *
 * Plus the `track` free function (which most call sites use) routes
 * to the same store.
 */

beforeEach(() => {
  useAnalyticsStore.setState({ events: [] });
});

describe('track', () => {
  it('prepends events, newest first', () => {
    track('event.a');
    track('event.b');
    const events = useAnalyticsStore.getState().events;
    expect(events[0].name).toBe('event.b');
    expect(events[1].name).toBe('event.a');
  });

  it('records props passed in', () => {
    track('event.with-props', { ticketId: 'tk_42', count: 3 });
    const event = useAnalyticsStore.getState().events[0];
    expect(event.props).toEqual({ ticketId: 'tk_42', count: 3 });
  });

  it('caps the ring buffer at 200 entries', () => {
    for (let i = 0; i < 250; i++) track(`event.${i}`);
    const events = useAnalyticsStore.getState().events;
    expect(events).toHaveLength(200);
    // Newest at front, oldest 50 evicted.
    expect(events[0].name).toBe('event.249');
    expect(events.find((e) => e.name === 'event.0')).toBeUndefined();
  });

  it('the free function and store action share state', () => {
    track('via.free.fn');
    useAnalyticsStore.getState().track('via.action');
    const events = useAnalyticsStore.getState().events;
    expect(events[0].name).toBe('via.action');
    expect(events[1].name).toBe('via.free.fn');
  });
});

describe('clear', () => {
  it('empties the buffer', () => {
    track('event.a');
    track('event.b');
    useAnalyticsStore.getState().clear();
    expect(useAnalyticsStore.getState().events).toEqual([]);
  });
});
