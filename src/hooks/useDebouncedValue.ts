import { useEffect, useState } from 'react';

/**
 * Debounce a fast-changing value (search query, slider position) so downstream
 * effects (network calls, expensive memoization) only react after the user has
 * paused for `delayMs`. The visible input stays unaffected.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
