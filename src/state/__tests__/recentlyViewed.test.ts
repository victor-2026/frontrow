import { useRecentlyViewedStore } from '../recentlyViewed';
import { store } from '../../storage/asyncStore';

/**
 * Recently-viewed list has three subtle invariants worth pinning:
 *   1. Most recent first — push prepends, doesn't append
 *   2. Dedup on re-add — viewing the same event twice moves it to the
 *      top, doesn't duplicate
 *   3. Capped at MAX (10) — pushing an 11th evicts the oldest entry
 */

beforeEach(async () => {
  await store.wipe();
  useRecentlyViewedStore.setState({ ids: [], hydrated: false });
});

describe('hydrate', () => {
  it('starts empty when storage is empty', async () => {
    await useRecentlyViewedStore.getState().hydrate();
    const s = useRecentlyViewedStore.getState();
    expect(s.ids).toEqual([]);
    expect(s.hydrated).toBe(true);
  });

  it('reads previously persisted ids in order', async () => {
    await store.set('frontrow.events.recentlyViewed', ['evt_3', 'evt_2', 'evt_1']);
    await useRecentlyViewedStore.getState().hydrate();
    expect(useRecentlyViewedStore.getState().ids).toEqual(['evt_3', 'evt_2', 'evt_1']);
  });
});

describe('push', () => {
  it('prepends — most recent first', async () => {
    await useRecentlyViewedStore.getState().push('a');
    await useRecentlyViewedStore.getState().push('b');
    await useRecentlyViewedStore.getState().push('c');
    expect(useRecentlyViewedStore.getState().ids).toEqual(['c', 'b', 'a']);
  });

  it('dedup on re-add — moves the existing id to the front, no dup', async () => {
    await useRecentlyViewedStore.getState().push('a');
    await useRecentlyViewedStore.getState().push('b');
    await useRecentlyViewedStore.getState().push('a');
    expect(useRecentlyViewedStore.getState().ids).toEqual(['a', 'b']);
  });

  it('caps the list at 10 entries — oldest gets evicted', async () => {
    for (let i = 1; i <= 12; i++) {
      await useRecentlyViewedStore.getState().push(`evt_${i}`);
    }
    const ids = useRecentlyViewedStore.getState().ids;
    expect(ids).toHaveLength(10);
    // Most recent (12) at front, oldest two (1, 2) evicted.
    expect(ids[0]).toBe('evt_12');
    expect(ids).not.toContain('evt_1');
    expect(ids).not.toContain('evt_2');
  });

  it('persists to storage', async () => {
    await useRecentlyViewedStore.getState().push('evt_x');
    expect(await store.get('frontrow.events.recentlyViewed')).toEqual(['evt_x']);
  });
});

describe('clear', () => {
  it('empties the list and removes the storage key', async () => {
    await useRecentlyViewedStore.getState().push('evt_1');
    await useRecentlyViewedStore.getState().clear();
    expect(useRecentlyViewedStore.getState().ids).toEqual([]);
    expect(await store.get('frontrow.events.recentlyViewed')).toBeNull();
  });
});
