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

async function buyTicket() {
  await element(by.id('events.item.evt_001')).tap()
  await expect(element(by.id('screen.eventDetail'))).toBeVisible()
  await element(by.id('eventDetail.buyButton')).tap()
  await expect(element(by.id('screen.buyTicket'))).toBeVisible()
  await element(by.id('buyTicket.payButton')).tap()
  await expect(element(by.text('Ticket purchased'))).toBeVisible()
}

async function goToEventsTab() {
  await element(by.id('tab.events')).tap()
  await waitFor(element(by.id('events.list')))
    .toBeVisible()
    .withTimeout(15000)
}

// --- Promo codes (data-driven) ---

describe('Promo codes', () => {
  beforeEach(async () => { await setup() })

  const codes = [
    ['FRONTROW10', '$40.50'],
    ['FRONTROW25', '$33.75'],
    ['FRONTROW50', '$22.50'],
    ['FREE', '$0.00'],
  ]

  for (const [code, expected] of codes) {
    it(`${code} → ${expected}`, async () => {
      await element(by.id('events.item.evt_001')).tap()
      await element(by.id('eventDetail.buyButton')).tap()
      await element(by.id('buyTicket.promoInput')).tap()
      await element(by.id('buyTicket.promoInput')).typeText(code + '\n')
      await element(by.id('buyTicket.promoApplyButton')).tap()
      await expect(element(by.id('buyTicket.promoSuccess'))).toBeVisible()
      await expect(element(by.id('buyTicket.totalAmount'))).toHaveText(expected)
    })
  }
})

// --- Promo errors ---

describe('Promo errors', () => {
  beforeEach(async () => { await setup() })

  it('shows error for invalid promo code', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('eventDetail.buyButton')).tap()
    await element(by.id('buyTicket.promoInput')).tap()
    await element(by.id('buyTicket.promoInput')).typeText('INVALIDCODE\n')
    await element(by.id('buyTicket.promoApplyButton')).tap()
    await expect(element(by.id('buyTicket.promoError'))).toBeVisible()
  })

  it('shows success then can remove promo', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('eventDetail.buyButton')).tap()
    await element(by.id('buyTicket.promoInput')).tap()
    await element(by.id('buyTicket.promoInput')).typeText('FRONTROW50\n')
    await element(by.id('buyTicket.promoApplyButton')).tap()
    await expect(element(by.id('buyTicket.promoSuccess'))).toBeVisible()

    await element(by.id('buyTicket.promoRemoveButton')).tap()
    await expect(element(by.id('buyTicket.promoRemoveButton'))).not.toExist()
  })
})

// --- Quantity stepper ---

describe('Quantity stepper', () => {
  beforeEach(async () => { await setup() })

  it('shows $135.00 for qty 3', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('eventDetail.buyButton')).tap()

    await element(by.id('buyTicket.quantityIncrement')).tap()
    await element(by.id('buyTicket.quantityIncrement')).tap()

    await expect(element(by.id('buyTicket.totalAmount'))).toHaveText('$135.00')
  })

  it('shows $90.00 after decrement to qty 2', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('eventDetail.buyButton')).tap()

    await element(by.id('buyTicket.quantityIncrement')).tap()
    await element(by.id('buyTicket.quantityIncrement')).tap()
    await element(by.id('buyTicket.quantityDecrement')).tap()

    await expect(element(by.id('buyTicket.totalAmount'))).toHaveText('$90.00')
  })
})

// --- Events screen ---

describe('Events screen', () => {
  beforeEach(async () => { await setup() })

  it('shows events screen header and list', async () => {
    await expect(element(by.id('screen.events'))).toBeVisible()
    await expect(element(by.id('events.list'))).toBeVisible()
  })
})

describe('Onboarding', () => {
  it('navigates through onboarding pages and gets started', async () => {
    await device.launchApp({ newInstance: true, delete: true })
    await expect(element(by.id('screen.onboarding'))).toBeVisible()
    await element(by.id('onboarding.nextButton')).tap()
    await element(by.id('onboarding.nextButton')).tap()
    await element(by.id('onboarding.getStartedButton')).tap()
    await expect(element(by.id('events.list'))).toBeVisible()
  })
})

// --- Edit profile ---

describe('Edit profile', () => {
  beforeEach(async () => { await setup() })

  it('shows editable bio field with character count', async () => {
    await element(by.id('tab.profile')).tap()
    await waitFor(element(by.id('profile.editButton')))
      .toBeVisible()
      .withTimeout(10000)
    await element(by.id('profile.editButton')).tap()
    await expect(element(by.id('screen.editProfile'))).toBeVisible()

    await element(by.id('editProfile.bioInput')).tap()
    await element(by.id('editProfile.bioInput')).typeText('Hello from Detox!\n')
    await expect(element(by.id('editProfile.bioCharCount'))).toExist()
  })

  it('shows avatar on profile screen', async () => {
    await element(by.id('tab.profile')).tap()
    await waitFor(element(by.id('profile.editButton')))
      .toBeVisible()
      .withTimeout(10000)
    await expect(element(by.id('profile.avatar'))).toBeVisible()
  })
})

// --- Inbox ---

describe('Inbox', () => {
  beforeEach(async () => { await setup() })

  it('opens inbox and shows notification list', async () => {
    await element(by.id('events.inboxButton')).tap()
    await expect(element(by.id('screen.inbox'))).toExist()
    await expect(element(by.id('inbox.list'))).toBeVisible()
  })

  it('marks all notifications as read', async () => {
    await element(by.id('events.inboxButton')).tap()
    await waitFor(element(by.id('inbox.markAllReadButton')))
      .toBeVisible()
      .withTimeout(10000)
    await element(by.id('inbox.markAllReadButton')).tap()
    await expect(element(by.id('inbox.markAllReadButton'))).not.toExist()
  })
})

// --- Filter chips ---

describe('My Tickets filter', () => {
  beforeEach(async () => { await setup() })

  it('filters by Active after buying a ticket', async () => {
    await buyTicket()
    await goToEventsTab()

    await element(by.id('tab.myTickets')).tap()
    await expect(element(by.id('myTickets.filterChip.all'))).toBeVisible()
    await element(by.id('myTickets.filterChip.active')).tap()
  })
})

// --- Event detail ---

describe('Event detail', () => {
  beforeEach(async () => { await setup() })

  it('shows title, buy button, and favorite', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await expect(element(by.id('screen.eventDetail'))).toBeVisible()
    await expect(element(by.id('eventDetail.title'))).toExist()
    await expect(element(by.id('eventDetail.buyButton'))).toBeVisible()
    await expect(element(by.id('eventDetail.favoriteButton'))).toBeVisible()
  })

  it('shows refund policy section', async () => {
    await element(by.id('events.item.evt_001')).tap()
    await element(by.id('screen.eventDetail')).swipe('up')
    await expect(element(by.id('eventDetail.refundPolicy'))).toBeVisible()
  })
})
