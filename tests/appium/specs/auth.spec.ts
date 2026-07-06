import { expect, driver } from '@wdio/globals'

import { waitForId, tapId, typeIntoId, byId, skipOnboarding } from './helpers'

const BUNDLE_ID = 'app.frontrow.qa'

async function activate() {
  await driver.activateApp(BUNDLE_ID)
  await driver.pause(3000)
  await skipOnboarding()
}

async function ensureLoggedOut() {
  await activate()
  try { await tapId('tab.profile', 5000) } catch {
    await activate()
    await tapId('tab.profile', 5000)
  }
  try {
    await tapId('profile.signOutButton', 3000)
  } catch {}
  await waitForId('profile.signInButton', 15000)
}

describe('Auth (Appium)', () => {
  before(async () => {
    await activate()
    try { await tapId('tab.profile', 5000) } catch {}
    await waitForId('profile.signInButton', 30000)
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
