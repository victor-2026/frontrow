import { expect, driver } from '@wdio/globals'
import { byId, waitForId, tapId, skipOnboarding, deepLink } from './helpers'

const BUNDLE_ID = 'app.frontrow.qa'

describe('FrontRow App', () => {
  before(async () => {
    await driver.activateApp(BUNDLE_ID)
    await driver.pause(3000)
    await skipOnboarding()
    await deepLink('frontrow://e2e/setup')
    await driver.pause(3000)
    try { await tapId('tab.events', 5000) } catch {}
    try { await waitForId('screen.events', 20000) } catch {
      await skipOnboarding()
      await driver.pause(2000)
    }
  })

  it('should display the Events screen on launch', async () => {
    await waitForId('screen.events', 20000)
    expect(await byId('screen.events').isDisplayed()).toBe(true)
  })

  it('should navigate to Profile and show the sign-in button', async () => {
    await tapId('tab.profile')
    await waitForId('profile.signInButton', 10000)
    expect(await byId('profile.signInButton').isDisplayed()).toBe(true)
  })
})
