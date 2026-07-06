async function setupSignedIn() {
  await device.launchApp({ newInstance: true, delete: true })
  try {
    await element(by.id('onboarding.skipButton')).tap()
  } catch {}
  await waitFor(element(by.id('events.list')))
    .toBeVisible()
    .withTimeout(30000)
  await element(by.id('tab.profile')).tap()
  await waitFor(element(by.id('profile.signInButton'))).toBeVisible().withTimeout(10000)
  await element(by.id('profile.signInButton')).tap()
  await element(by.id('login.submitButton')).tap()
  await waitFor(element(by.id('profile.signOutButton'))).toBeVisible().withTimeout(10000)
}

async function goToEditProfile() {
  await element(by.id('profile.editButton')).tap()
  await expect(element(by.id('screen.editProfile'))).toBeVisible()
}

describe('Profile editing', () => {
  beforeEach(async () => { await setupSignedIn() })

  it('navigates back from edit profile', async () => {
    await goToEditProfile()
    await element(by.id('editProfile.backButton')).tap()
    await expect(element(by.id('screen.profile'))).toBeVisible()
  })

  it('edits display name and saves', async () => {
    await goToEditProfile()
    await element(by.id('editProfile.displayNameInput')).tap()
    await element(by.id('editProfile.displayNameInput')).clearText()
    await element(by.id('editProfile.displayNameInput')).typeText('Victor Detox\n')
    await element(by.id('editProfile.saveButton')).tap()
    await expect(element(by.id('screen.profile'))).toBeVisible()
  })

  it('shows discard confirmation on back with changes', async () => {
    await goToEditProfile()
    await element(by.id('editProfile.bioInput')).tap()
    await element(by.id('editProfile.bioInput')).clearText()
    await element(by.id('editProfile.bioInput')).typeText('Unsaved bio\n')
    await element(by.id('editProfile.backButton')).tap()
    await expect(element(by.id('editProfile.discardConfirmDialog'))).toBeVisible()
    await expect(element(by.id('editProfile.discardConfirmYes'))).toBeVisible()
    await expect(element(by.id('editProfile.discardConfirmNo'))).toBeVisible()
  })

  it('cancels discard and stays on edit profile', async () => {
    await goToEditProfile()
    await element(by.id('editProfile.bioInput')).tap()
    await element(by.id('editProfile.bioInput')).clearText()
    await element(by.id('editProfile.bioInput')).typeText('Unsaved bio\n')
    await element(by.id('editProfile.backButton')).tap()
    await expect(element(by.id('editProfile.discardConfirmDialog'))).toBeVisible()
    await element(by.id('editProfile.discardConfirmNo')).tap()
    await waitFor(element(by.id('screen.editProfile'))).toExist().withTimeout(5000)
  })

  it('confirms discard and goes back to profile', async () => {
    await goToEditProfile()
    await element(by.id('editProfile.bioInput')).tap()
    await element(by.id('editProfile.bioInput')).clearText()
    await element(by.id('editProfile.bioInput')).typeText('Unsaved bio\n')
    await element(by.id('editProfile.backButton')).tap()
    await expect(element(by.id('editProfile.discardConfirmDialog'))).toBeVisible()
    await element(by.id('editProfile.discardConfirmYes')).tap()
    await expect(element(by.id('screen.profile'))).toBeVisible()
  })
})
