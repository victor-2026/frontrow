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

  it('cancels a ticket via confirm dialog', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('eventDetail.buyButton')).tap()
    await element(by.id('buyTicket.payButton')).tap()
    await expect(element(by.text('Ticket purchased'))).toBeVisible()

    await element(by.id('tab.events')).tap()
    await waitFor(element(by.id('events.list'))).toBeVisible().withTimeout(15000)

    await element(by.id('tab.myTickets')).tap()
    await waitFor(element(by.id('myTickets.list'))).toBeVisible().withTimeout(15000)

    await waitFor(element(by.id('myTickets.list'))).toBeVisible().withTimeout(15000)
    await element(by.id('myTickets.list')).swipe('up')
    await element(by.id('tab.myTickets')).tap()
    await element(by.id('myTickets.item.tkt_001')).tap()
    await expect(element(by.id('screen.ticketDetail'))).toBeVisible()

    await element(by.id('screen.ticketDetail')).swipe('up')
    await waitFor(element(by.id('ticketDetail.cancelButton'))).toBeVisible().withTimeout(15000)
    await element(by.id('ticketDetail.cancelButton')).tap()
    await expect(element(by.id('ticketDetail.cancelConfirmDialog'))).toBeVisible()
    await element(by.id('ticketDetail.cancelConfirmYes')).tap()
    await expect(element(by.text('refund pending'))).toBeVisible()
  })
})
