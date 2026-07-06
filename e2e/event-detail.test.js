async function setup() {
  await device.launchApp({ newInstance: true })
  try {
    await element(by.id('onboarding.skipButton')).tap()
  } catch {}
  await device.openURL({ url: 'frontrow://e2e/setup' })
  await waitFor(element(by.id('events.list')))
    .toBeVisible()
    .withTimeout(30000)
}

describe('Event detail sections', () => {
  beforeEach(async () => { await setup() })

  it('shows share button without scrolling', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await expect(element(by.id('screen.eventDetail'))).toBeVisible()
    await expect(element(by.id('eventDetail.shareButton'))).toBeVisible()
  })

  it('shows reviews button on event detail', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('screen.eventDetail')).swipe('up')
    await expect(element(by.id('eventDetail.reviewsButton'))).toBeVisible()
  })

  it('shows follow artist button', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('screen.eventDetail')).swipe('up')
    await expect(element(by.id('eventDetail.followArtistButton'))).toBeVisible()
  })

})
