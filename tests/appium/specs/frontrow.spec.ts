import { expect, driver } from '@wdio/globals'

import {
  byId, waitForId, tapId, typeIntoId,
  deepLink, skipOnboarding, scrollDown, ensureSignedInViaDeepLink
} from './helpers'

const BUNDLE_ID = 'app.frontrow.qa'

async function setup() {
  await driver.activateApp(BUNDLE_ID)
  await driver.pause(3000)
  await skipOnboarding()
  await deepLink('frontrow://e2e/setup')
  await driver.pause(3000)
  try {
    await tapId('tab.events', 5000)
  } catch {}
  try {
    await waitForId('events.list', 20000)
  } catch {
    await skipOnboarding()
    await ensureSignedInViaDeepLink()
    try { await tapId('tab.events', 5000) } catch {}
    await waitForId('events.list', 20000)
  }
}

async function buyTicket() {
  await tapId('events.item.evt_001')
  expect(await byId('screen.eventDetail').isDisplayed()).toBe(true)
  try { await tapId('eventDetail.buyButton', 5000) } catch {
    await scrollDown()
    await tapId('eventDetail.buyButton')
  }
  expect(await byId('screen.buyTicket').isDisplayed()).toBe(true)
  await tapId('buyTicket.payButton')
  await waitForId('toast.message', 15000)
  expect(await byId('toast.message').getText()).toBe('Ticket purchased')
}

async function goToEventsTab() {
  await tapId('tab.events')
  await waitForId('events.list', 15000)
}

async function typeInto(id: string, text: string) {
  const el = byId(id)
  await el.click()
  await driver.pause(500)
  const pairs = text.split('').flatMap(c => [
    { type: 'keyDown', value: c },
    { type: 'keyUp', value: c },
  ])
  try {
    await driver.performActions([{ type: 'key', id: 'keyboard', actions: pairs }])
  } catch {
    try {
      await el.setValue(text)
    } catch {
      await typeIntoId(id, text)
    }
  }
  await driver.pause(300)
  try {
    await tapId('buyTicket.quantityStepper', 1000)
    await driver.pause(300)
  } catch {
    try { await tapId('buyTicket.payButton', 1000) } catch {}
  }
}

describe('FrontRow — Appium (cross-platform)', function () {
  this.timeout(300_000)
  beforeEach(async () => { await setup() })

  // --- Promo codes (data-driven) ---

  describe('Promo codes', () => {
    const codes: Array<[string, string]> = [
      ['FRONTROW10', '$40.50'],
      ['FRONTROW25', '$33.75'],
      ['FRONTROW50', '$22.50'],
      ['FREE', '$0.00'],
    ]

    for (const [code, expected] of codes) {
      it(`${code} → ${expected}`, async () => {
        await tapId('events.item.evt_001')
        await tapId('eventDetail.buyButton')
        expect(await byId('screen.buyTicket').isDisplayed()).toBe(true)

        await typeInto('buyTicket.promoInput', code)
        await tapId('buyTicket.promoApplyButton')

        expect(await byId('buyTicket.promoSuccess').isDisplayed()).toBe(true)
        expect(await byId('buyTicket.totalAmount').getText()).toBe(expected)
      })
    }
  })

  // --- Promo error handling ---

  describe('Promo error handling', () => {
    it('shows error for invalid promo code', async () => {
      await tapId('events.item.evt_001')
      await tapId('eventDetail.buyButton')
      expect(await byId('screen.buyTicket').isDisplayed()).toBe(true)

      await typeInto('buyTicket.promoInput', 'BOGUS123')
      await tapId('buyTicket.promoApplyButton')

      expect(await byId('buyTicket.promoError').isDisplayed()).toBe(true)
    })

    it('shows error for expired promo code', async () => {
      await tapId('events.item.evt_001')
      await tapId('eventDetail.buyButton')
      expect(await byId('screen.buyTicket').isDisplayed()).toBe(true)

      await typeInto('buyTicket.promoInput', 'EXPIRED')
      await tapId('buyTicket.promoApplyButton')

      expect(await byId('buyTicket.promoError').isDisplayed()).toBe(true)
    })

    it('removes applied promo and restores input', async () => {
      await tapId('events.item.evt_001')
      await tapId('eventDetail.buyButton')
      expect(await byId('screen.buyTicket').isDisplayed()).toBe(true)

      await typeInto('buyTicket.promoInput', 'FRONTROW10')
      await tapId('buyTicket.promoApplyButton')
      expect(await byId('buyTicket.promoSuccess').isDisplayed()).toBe(true)

      await tapId('buyTicket.promoRemoveButton')
      expect(await byId('buyTicket.promoInput').isDisplayed()).toBe(true)
    })
  })

  // --- Quantity stepper ---

  describe('Quantity stepper', () => {
    it('shows $135.00 for qty 3', async () => {
      await tapId('events.item.evt_001')
      await tapId('eventDetail.buyButton')
      expect(await byId('screen.buyTicket').isDisplayed()).toBe(true)

      await tapId('buyTicket.quantityIncrement')
      await tapId('buyTicket.quantityIncrement')

      expect(await byId('buyTicket.totalAmount').getText()).toBe('$135.00')
    })

    it('shows $90.00 after decrement to qty 2', async () => {
      await tapId('events.item.evt_001')
      await tapId('eventDetail.buyButton')
      expect(await byId('screen.buyTicket').isDisplayed()).toBe(true)

      await tapId('buyTicket.quantityIncrement')
      await tapId('buyTicket.quantityIncrement')
      await tapId('buyTicket.quantityDecrement')

      expect(await byId('buyTicket.totalAmount').getText()).toBe('$90.00')
    })
  })

  // --- Edit profile ---

  describe('Edit profile', () => {
    it('shows editable bio field with character count', async () => {
      await tapId('tab.profile')
      await waitForId('profile.editButton', 10000)
      await tapId('profile.editButton')
      expect(await byId('screen.editProfile').isDisplayed()).toBe(true)

      await typeInto('editProfile.bioInput', 'Hello from Appium!')
      expect(await byId('editProfile.bioCharCount').isDisplayed()).toBe(true)
    })
  })

  // --- Avatar ---

  describe('Avatar', () => {
    it('shows default avatar on profile tab', async () => {
      await tapId('tab.profile')
      expect(await byId('profile.avatar').isDisplayed()).toBe(true)
    })
  })

  // --- Profile Edit (with sign-in) ---

  describe('Profile Edit', () => {
    async function ensureSignedIn() {
      try {
        await tapId('tab.profile')
        if (await byId('profile.signOutButton').isDisplayed()) return
      } catch {}
      await ensureSignedInViaDeepLink()
      await driver.pause(2000)
      try { await tapId('tab.profile', 5000) } catch {}
    }

    async function typeBio(text: string) {
      const el = byId('editProfile.bioInput')
      await el.click()
      await driver.pause(500)
      try {
        await driver.performActions([{
          type: 'key', id: 'keyboard',
          actions: text.split('').flatMap(c => [
            { type: 'keyDown', value: c },
            { type: 'keyUp', value: c },
          ])
        }])
      } catch {
        await el.setValue(text)
      }
      await driver.pause(300)
      try { await tapId('editProfile.bioCharCount', 2000); await driver.pause(300) } catch {}
    }

    it('signs in and shows editable bio field with character count', async () => {
      await ensureSignedIn()
      await tapId('profile.editButton')
      await waitForId('screen.editProfile', 10000)
      expect(await byId('editProfile.bioCharCount').isDisplayed()).toBe(true)
    })

    it('shows discard dialog when edited, cancel stays', async () => {
      await ensureSignedIn()
      await tapId('profile.editButton')
      await waitForId('screen.editProfile', 10000)

      await typeBio('Updated bio for discard test.')

      await tapId('editProfile.backButton')
      expect(await byId('editProfile.discardConfirmDialog').isDisplayed()).toBe(true)
      await tapId('editProfile.discardConfirmNo', 3000)
      expect(await byId('editProfile.discardConfirmDialog').isDisplayed()).toBe(false)
      await waitForId('screen.editProfile', 5000)
    })

    it('saves profile changes', async () => {
      await ensureSignedIn()
      await tapId('profile.editButton')
      await waitForId('screen.editProfile', 10000)

      await typeBio('Front-row regular since 2018.')

      await tapId('editProfile.saveButton')
      expect(await byId('toast.message').isDisplayed()).toBe(true)
    })
  })

  // --- Inbox ---

  describe('Inbox', () => {
    it('opens inbox and shows notification list', async () => {
      await tapId('events.inboxButton')
      expect(await byId('screen.inbox').isDisplayed()).toBe(true)
      expect(await byId('inbox.list').isDisplayed()).toBe(true)
    })

    it('marks all notifications as read', async () => {
      await tapId('events.inboxButton')
      await waitForId('inbox.markAllReadButton', 10000)
      await tapId('inbox.markAllReadButton')
      expect(await byId('inbox.markAllReadButton').isDisplayed()).toBe(false)
    })
  })

  // --- My Tickets filter ---

  describe('My Tickets filter', () => {
    it('filters by Active after buying a ticket', async () => {
      await buyTicket()
      await goToEventsTab()
      await tapId('tab.myTickets')
      expect(await byId('myTickets.filterChip.all').isDisplayed()).toBe(true)
      await tapId('myTickets.filterChip.active')
    })
  })

  // --- Event detail ---

  describe('Event detail', () => {
    it('shows title, buy button, and favorite', async () => {
      await tapId('events.item.evt_001')
      expect(await byId('screen.eventDetail').isDisplayed()).toBe(true)
      expect(await byId('eventDetail.title').isDisplayed()).toBe(true)
      expect(await byId('eventDetail.buyButton').isDisplayed()).toBe(true)
      expect(await byId('eventDetail.favoriteButton').isDisplayed()).toBe(true)
    })

    it('shows refund policy section', async () => {
      await tapId('events.item.evt_001')
      expect(await byId('screen.eventDetail').isDisplayed()).toBe(true)
      await scrollDown()
      await waitForId('eventDetail.refundPolicy', 5000)
    })
  })

  // --- My Tickets (screen + list) ---

  describe('My Tickets screen', () => {
    it('shows filter chips and ticket list after buying a ticket', async () => {
      await buyTicket()
      await tapId('tab.events')
      await tapId('tab.myTickets')
      expect(await byId('myTickets.filterChip.all').isDisplayed()).toBe(true)
      expect(await byId('myTickets.filterChip.active').isDisplayed()).toBe(true)
      expect(await byId('myTickets.list').isDisplayed()).toBe(true)
    })
  })
})
