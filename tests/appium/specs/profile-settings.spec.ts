import { expect, driver } from '@wdio/globals'

import { byId, waitForId, tapId, typeIntoId, skipOnboarding, deepLink } from './helpers'

const BUNDLE_ID = 'app.frontrow.qa'

describe('Profile & Settings', () => {
  before(async () => {
    await driver.activateApp(BUNDLE_ID)
    await driver.pause(3000)
    await skipOnboarding()
    await deepLink('frontrow://e2e/setup')
    await driver.pause(3000)
    try { await tapId('tab.events', 5000) } catch {}
    try { await waitForId('screen.events', 20000) } catch {
      await skipOnboarding()
      try { await tapId('tab.events', 5000) } catch {}
    }
    try { await tapId('tab.profile', 5000) } catch {}
    await waitForId('profile.signInButton', 15000)
  })

  it('shows sign-in button before login', async () => {
    await waitForId('profile.signInButton')
    expect(await byId('profile.signInButton').isDisplayed()).toBe(true)
  })

  it('signs in with demo account', async () => {
    await tapId('profile.signInButton')
    await typeIntoId('login.emailInput', 'demo@frontrow.app')
    await typeIntoId('login.passwordInput', 'demo1234')
    await tapId('login.submitButton')
    await waitForId('profile.signOutButton')
  })

  it('shows settings after login', async () => {
    await waitForId('profile.signOutButton')
  })

  it('navigates to about page via webview', async () => {
    await tapId('settings.aboutRow')
    await waitForId('screen.settings.about')
  })
})
