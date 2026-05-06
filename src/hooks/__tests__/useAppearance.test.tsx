import { renderHook } from '@testing-library/react-native';
import * as ReactNative from 'react-native';

import { useThemeColors, useResolvedAppearance } from '../useAppearance';
import { useSettingsStore } from '../../state/settings';
import { palettes } from '../../theme';

/**
 * useAppearance is the bridge between the user's persisted preference
 * and the active palette. Three things matter for tests:
 *   - 'system' follows the OS scheme
 *   - 'light' / 'dark' override the OS unconditionally
 *   - a null/undefined OS scheme falls back to light (safe default)
 *
 * react-native's useColorScheme is spied per-test so we can drive both
 * branches deterministically without re-mocking the whole module
 * (which clashes with RN's lazy property getters).
 */

const useColorSchemeSpy = jest.spyOn(ReactNative, 'useColorScheme');

beforeEach(() => {
  useColorSchemeSpy.mockReset();
  useSettingsStore.setState({ appearance: 'system' });
});

afterAll(() => {
  useColorSchemeSpy.mockRestore();
});

describe('useResolvedAppearance', () => {
  it('returns "dark" when system is dark and pref is system', () => {
    useColorSchemeSpy.mockReturnValue('dark');
    useSettingsStore.setState({ appearance: 'system' });
    const { result } = renderHook(() => useResolvedAppearance());
    expect(result.current).toBe('dark');
  });

  it('returns "light" when system is light and pref is system', () => {
    useColorSchemeSpy.mockReturnValue('light');
    useSettingsStore.setState({ appearance: 'system' });
    const { result } = renderHook(() => useResolvedAppearance());
    expect(result.current).toBe('light');
  });

  it('falls back to light when system scheme is null and pref is system', () => {
    useColorSchemeSpy.mockReturnValue(null);
    useSettingsStore.setState({ appearance: 'system' });
    const { result } = renderHook(() => useResolvedAppearance());
    expect(result.current).toBe('light');
  });

  it('explicit "dark" overrides a light system scheme', () => {
    useColorSchemeSpy.mockReturnValue('light');
    useSettingsStore.setState({ appearance: 'dark' });
    const { result } = renderHook(() => useResolvedAppearance());
    expect(result.current).toBe('dark');
  });

  it('explicit "light" overrides a dark system scheme', () => {
    useColorSchemeSpy.mockReturnValue('dark');
    useSettingsStore.setState({ appearance: 'light' });
    const { result } = renderHook(() => useResolvedAppearance());
    expect(result.current).toBe('light');
  });
});

describe('useThemeColors', () => {
  it('returns the dark palette in dark mode', () => {
    useColorSchemeSpy.mockReturnValue('dark');
    useSettingsStore.setState({ appearance: 'system' });
    const { result } = renderHook(() => useThemeColors());
    expect(result.current).toBe(palettes.dark);
  });

  it('returns the light palette in light mode', () => {
    useColorSchemeSpy.mockReturnValue('light');
    useSettingsStore.setState({ appearance: 'system' });
    const { result } = renderHook(() => useThemeColors());
    expect(result.current).toBe(palettes.light);
  });
});
