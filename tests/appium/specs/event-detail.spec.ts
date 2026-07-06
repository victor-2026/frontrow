import { expect, driver } from '@wdio/globals'

import { waitForId, tapId, byId, skipOnboarding } from './helpers'

const BUNDLE_ID = 'app.frontrow.qa'

async function setup() {
  await driver.activateApp(BUNDLE_ID)
  await driver.pause(3000)
  await skipOnboarding()
  try { await tapId('tab.events', 5000) } catch {}
  try {
    await waitForId('events.list', 30000)
  } catch {
    await skipOnboarding()
    try { await tapId('tab.events', 5000) } catch {}
    await waitForId('events.list', 30000)
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
