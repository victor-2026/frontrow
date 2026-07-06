import { browser, expect } from '@wdio/globals'

import { waitForId, tapId, typeIntoId, byId } from './helpers'

const BUNDLE_ID = 'app.frontrow.qa'

async function restartApp() {
  await browser.executeScript('mobile: terminateApp', [{ bundleId: BUNDLE_ID }])
  await browser.executeScript('mobile: activateApp', [{ bundleId: BUNDLE_ID }])
  await waitForId('tab.profile', 90000)
}

async function ensureLoggedOut() {
  try {
    await byId('tab.profile').waitForDisplayed({ timeout: 2000 })
  } catch {
    // Tab bar hidden → restart app
    await restartApp()
  }
  await tapId('tab.profile')
  try {
    const signOut = await byId('profile.signOutButton')
    await signOut.waitForDisplayed({ timeout: 3000 })
    await signOut.click()
  } catch {}
  await waitForId('profile.signInButton')
}

describe('Auth (Appium)', () => {
  before(async () => {
    await waitForId('tab.profile', 90000)
  })

  beforeEach(async () => {
    await ensureLoggedOut()
  })

  it('shows sign-in button on profile tab (logged out)', async () => {
    await waitForId('profile.signInButton')
  })

  it('signs in with pre-filled credentials (no typing needed)', async () => {
    await tapId('profile.signInButton')
    await waitForId('screen.login')
    await tapId('login.submitButton')
    await waitForId('profile.signOutButton')
  })

  it('navigates to forgot password screen', async () => {
    await tapId('profile.signInButton')
    await waitForId('screen.login')
    await tapId('login.forgotPasswordLink')
    await waitForId('screen.forgotPassword')
    await waitForId('forgotPassword.confirmation')
  })

  it('submits forgot password and navigates to OTP', async () => {
    await tapId('profile.signInButton')
    await waitForId('screen.login')
    await tapId('login.forgotPasswordLink')
    await waitForId('screen.forgotPassword')

    await typeIntoId('forgotPassword.emailInput', 'demo@frontrow.app')
    await tapId('forgotPassword.submitButton')
    await waitForId('screen.otp')
  })

  it('signs out after login', async () => {
    await tapId('profile.signInButton')
    await tapId('login.submitButton')
    await waitForId('profile.signOutButton')

    await tapId('profile.signOutButton')
    await waitForId('profile.signInButton')
  })
})
