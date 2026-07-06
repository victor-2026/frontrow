async function setupFresh() {
  await device.launchApp({ newInstance: true, delete: true })
  try {
    await element(by.id('onboarding.skipButton')).tap()
  } catch {}
  await waitFor(element(by.id('events.list')))
    .toBeVisible()
    .withTimeout(30000)
}

describe('Auth', () => {
  beforeEach(async () => { await setupFresh() })

  it('signs in with pre-filled demo credentials', async () => {
    await element(by.id('tab.profile')).tap()
    await waitFor(element(by.id('profile.signInButton'))).toBeVisible().withTimeout(10000)
    await element(by.id('profile.signInButton')).tap()
    await expect(element(by.id('screen.login'))).toBeVisible()

    await element(by.id('login.submitButton')).tap()
    await waitFor(element(by.id('profile.signOutButton'))).toBeVisible().withTimeout(10000)
  })

  it('navigates to forgot password screen', async () => {
    await element(by.id('tab.profile')).tap()
    await waitFor(element(by.id('profile.signInButton'))).toBeVisible().withTimeout(10000)
    await element(by.id('profile.signInButton')).tap()
    await expect(element(by.id('screen.login'))).toBeVisible()
    await element(by.id('login.forgotPasswordLink')).tap()
    await expect(element(by.id('screen.forgotPassword'))).toBeVisible()
  })

  it('submits forgot password and navigates to OTP', async () => {
    await element(by.id('tab.profile')).tap()
    await waitFor(element(by.id('profile.signInButton'))).toBeVisible().withTimeout(10000)
    await element(by.id('profile.signInButton')).tap()
    await element(by.id('login.forgotPasswordLink')).tap()
    await expect(element(by.id('screen.forgotPassword'))).toBeVisible()

    await element(by.id('forgotPassword.emailInput')).typeText('demo@frontrow.app\n')
    await element(by.id('forgotPassword.submitButton')).tap()
    await waitFor(element(by.id('screen.otp'))).toBeVisible().withTimeout(10000)
  })

  it('signs out after login', async () => {
    await element(by.id('tab.profile')).tap()
    await waitFor(element(by.id('profile.signInButton'))).toBeVisible().withTimeout(10000)
    await element(by.id('profile.signInButton')).tap()
    await element(by.id('login.submitButton')).tap()
    await waitFor(element(by.id('profile.signOutButton'))).toBeVisible().withTimeout(10000)

    await element(by.id('profile.signOutButton')).tap()
    await waitFor(element(by.id('profile.signInButton'))).toBeVisible().withTimeout(10000)
  })
})
