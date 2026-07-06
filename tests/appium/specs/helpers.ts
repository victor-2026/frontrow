import { browser, $ } from '@wdio/globals';

const _isAndroid = (browser.capabilities as { platformName?: string }).platformName === 'Android';

/**
 * Resolve a test ID to a platform-specific selector. testID becomes
 * accessibilityIdentifier on iOS (matched with `~`) and resource-id on
 * Android (matched with xpath since `~` maps to content-desc, not resource-id).
 */
export function byId(id: string) {
  return _isAndroid
    ? $(`//*[@resource-id="${id}"]`)
    : $(`~${id}`);
}

export async function waitForId(id: string, timeoutMs = 10_000): Promise<void> {
  await byId(id).waitForDisplayed({ timeout: timeoutMs });
}

export async function tapId(id: string): Promise<void> {
  await waitForId(id);
  await byId(id).click();
}

export async function typeIntoId(id: string, text: string): Promise<void> {
  await waitForId(id);
  await byId(id).setValue(text);
}
