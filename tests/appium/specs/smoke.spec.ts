import { expect } from '@wdio/globals'
import { byId, waitForId } from './helpers'

describe('FrontRow App', () => {
  it('should display the Events screen on launch', async () => {
    await waitForId('screen.events', 20000)
    expect(await byId('screen.events').isDisplayed()).toBe(true)
  })

  it('should navigate to Profile and show the sign-in button', async () => {
    await byId('tab.profile').click()

    await waitForId('profile.signInButton', 10000)
    expect(await byId('profile.signInButton').isDisplayed()).toBe(true)
  })
})
