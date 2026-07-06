import { expect } from '@wdio/globals'

import { byId, waitForId } from './helpers'

describe('Events', () => {
  it('shows the events screen on launch', async () => {
    await waitForId('screen.events')
    expect(await byId('screen.events').isDisplayed()).toBe(true)
  })

  it('shows the hero card', async () => {
    await waitForId('events.heroCard')
    expect(await byId('events.heroCard').isDisplayed()).toBe(true)
  })

  it('shows sort button and filter row', async () => {
    await waitForId('events.sortButton')
    await waitForId('events.filterRow')
  })
})
