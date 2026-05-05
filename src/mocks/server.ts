/**
 * MSW setup for React Native. Imported only when QA mode / __DEV__ is on.
 *
 * Note: MSW v2's React Native adapter requires `setupServer` from `msw/native`.
 * It runs at the fetch layer using `react-native-url-polyfill` (already pulled
 * in via Expo) plus `react-native-fetch-api` polyfills if needed.
 */
import { setupServer } from 'msw/native';

import { handlers } from './handlers';

export const server = setupServer(...handlers);

let started = false;
export function startMockServer(): void {
  if (started) return;
  server.listen({ onUnhandledRequest: 'bypass' });
  started = true;
}

export function stopMockServer(): void {
  if (!started) return;
  server.close();
  started = false;
}
