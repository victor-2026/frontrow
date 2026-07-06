import { expect } from '@wdio/globals'

import { byId, waitForId, tapId, typeIntoId } from './helpers'

describe('Profile & Settings', () => {
  before(async () => {
    await waitForId('screen.events')
    await byId('tab.profile').click()
    await waitForId('profile.signInButton')
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
