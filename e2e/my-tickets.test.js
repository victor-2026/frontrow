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

describe('My Tickets', () => {
  beforeEach(async () => { await setup() })

  it('shows my tickets screen after tab tap', async () => {
    await element(by.id('tab.myTickets')).tap()
    await expect(element(by.id('screen.myTickets'))).toExist()
  })

  it('shows filter chips after buying a ticket', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('eventDetail.buyButton')).tap()
    await element(by.id('buyTicket.payButton')).tap()
    await expect(element(by.text('Ticket purchased'))).toBeVisible()

    await element(by.id('tab.events')).tap()
    await waitFor(element(by.id('events.list'))).toBeVisible().withTimeout(15000)

    await element(by.id('tab.myTickets')).tap()
    await expect(element(by.id('myTickets.filterChip.all'))).toBeVisible()
    await expect(element(by.id('myTickets.filterChip.active'))).toBeVisible()
  })

  it('shows ticket list after purchase', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('eventDetail.buyButton')).tap()
    await element(by.id('buyTicket.payButton')).tap()
    await expect(element(by.text('Ticket purchased'))).toBeVisible()

    await element(by.id('tab.events')).tap()
    await waitFor(element(by.id('events.list'))).toBeVisible().withTimeout(15000)

    await element(by.id('tab.myTickets')).tap()
    await expect(element(by.id('myTickets.list'))).toBeVisible()
  })
})
