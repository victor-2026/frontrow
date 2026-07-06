import { browser, driver, $ } from '@wdio/globals';

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

export async function tapId(id: string, timeoutMs = 10_000): Promise<void> {
  await waitForId(id, timeoutMs);
  await byId(id).click();
}

export async function typeIntoId(id: string, text: string): Promise<void> {
  await waitForId(id);
  await byId(id).setValue(text);
}

export async function deepLink(url: string, bundleId = 'app.frontrow.qa'): Promise<void> {
  if (_isAndroid) {
    await driver.execute('mobile: deepLink', [{ url, package: bundleId }])
  } else {
    await driver.execute('mobile: deepLink', [{ url }])
  }
}

export async function scrollDown(): Promise<void> {
  const { width, height } = await driver.getWindowSize()
  if (_isAndroid) {
    await driver.execute('mobile: scrollGesture', {
      left: 0, top: 200, width, height: height - 400,
      direction: 'down', percent: 0.6
    })
  } else {
    await driver.execute('mobile: swipe', { direction: 'up' })
  }
}

export async function skipOnboarding(): Promise<boolean> {
  try {
    await waitForId('onboarding.skipButton', 3000)
    await tapId('onboarding.skipButton')
    await driver.pause(1500)
    return true
  } catch {
    return false
  }
}

export async function ensureSignedInViaDeepLink(): Promise<void> {
  await deepLink('frontrow://debug/seed/signed_in')
  await driver.pause(2000)
}
