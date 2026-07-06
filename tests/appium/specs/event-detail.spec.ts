import { expect, driver } from '@wdio/globals'

import { waitForId, tapId, byId } from './helpers'

const BUNDLE_ID = 'app.frontrow.qa'

async function deepLink(url: string) {
  const caps = driver.capabilities as { platformName?: string }
  if (caps.platformName === 'Android') {
    await driver.execute('mobile: deepLink', { url, package: BUNDLE_ID })
  } else {
    await driver.execute('mobile: deepLink', { url })
  }
}

async function setup() {
  try {
    await deepLink('frontrow://e2e/setup')
    await waitForId('events.list', 30000)
    return
  } catch {
    // Fallback: restart and skip onboarding
  }

  await driver.terminateApp(BUNDLE_ID)
  await driver.activateApp(BUNDLE_ID)
  await driver.pause(5000)
  try {
    await waitForId('onboarding.skipButton', 5000)
    await tapId('onboarding.skipButton')
    await driver.pause(1000)
  } catch {}
  try {
    await deepLink('frontrow://e2e/setup')
    await waitForId('events.list', 60000)
  } catch {
    await driver.terminateApp(BUNDLE_ID)
    await driver.activateApp(BUNDLE_ID)
    await waitForId('events.list', 60000)
  }
}

async function goToEventDetail() {
  await waitForId('events.list', 30000)
  await tapId('events.item.evt_001')
  await waitForId('eventDetail.title', 15000)
}

describe('Event Detail', () => {
  beforeEach(async () => { await setup() })

  it('navigates to event detail from event item', async () => {
    await waitForId('events.list', 30000)
    await tapId('events.item.evt_001')
    await waitForId('eventDetail.title', 15000)
  })

  it('shows event detail with buy button and favorite', async () => {
    await goToEventDetail()
    expect(await byId('eventDetail.buyButton').isDisplayed()).toBe(true)
    expect(await byId('eventDetail.favoriteButton').isDisplayed()).toBe(true)
  })

  it('shows share button on event detail', async () => {
    await goToEventDetail()
    expect(await byId('eventDetail.shareButton').isDisplayed()).toBe(true)
  })

  it('shows reviews button on event detail', async () => {
    await goToEventDetail()
    expect(await byId('eventDetail.reviewsButton').isDisplayed()).toBe(true)
  })

  it('shows follow artist button on event detail', async () => {
    await goToEventDetail()
    expect(await byId('eventDetail.followArtistButton').isDisplayed()).toBe(true)
  })
})
