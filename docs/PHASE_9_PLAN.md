# Phase 9 — Design polish + real-world feature parity

A pass to make FrontRow look and feel more like a production concert/events app, and to close the gap between our seed data and the user journeys real apps put in front of someone buying a ticket.

## How we compare to real apps

The following is a survey across the patterns shown by **Dice**, **Ticketmaster**, **AXS**, **SeatGeek**, **Bandsintown**, **Songkick**, **Resident Advisor**, and **Eventbrite**. Marked ✓ if FrontRow already has it, ✗ if missing, ~ if partial.

### Discovery

| Pattern                              | FrontRow | Notes                                                  |
| ------------------------------------ | -------- | ------------------------------------------------------ |
| Search by query                      | ✓        | Debounced, queries title / artist / venue.city         |
| Genre filter                         | ✓        | Chip row above list                                    |
| Favorites filter                     | ✓        | Chip on signed-in users                                |
| Sort by date / price / distance      | ✗        | Real apps default to date ASC; we have no sort control |
| **"Near me" / location filter**      | ✗        | Bandsintown / SeatGeek lead with this                  |
| Date-range filter (this weekend etc) | ✗        | Common drop-down                                       |
| Hero / featured event card           | ✗        | Top of list real estate, drives conversion             |
| Recently viewed                      | ✗        | Songkick + Eventbrite both surface this                |
| Sectioned by date ("This weekend")   | ✗        | Dice + Resident Advisor both group by day              |
| Map view                             | ✗        | Native maps dep — out of scope this phase              |

### Event detail

| Pattern                            | FrontRow | Notes                                                 |
| ---------------------------------- | -------- | ----------------------------------------------------- |
| Hero image                         | ✓        |                                                       |
| Title / artist / venue / date      | ✓        |                                                       |
| Buy / Reviews / Favorite / Share   | ✓        |                                                       |
| **Lineup with set times**          | ✗        | Festivals + multi-artist nights need this             |
| **Ticket tiers (GA/VIP/Reserved)** | ✗        | Every real app sells more than one tier               |
| **Refund / cancellation policy**   | ✗        | Trust signal — common just above the Buy button       |
| **Save to calendar**               | ~        | Capability demo exists, not yet wired here            |
| **Follow artist**                  | ✗        | Bandsintown + Songkick are entirely built around this |
| Image carousel                     | ✗        | Multiple photos / promo art                           |
| FAQ block (age, accessibility)     | ✗        | Common on Ticketmaster / AXS                          |
| Seat map                           | ✗        | Heavy work; intentionally out of scope                |

### Buy flow

| Pattern                        | FrontRow | Notes                                     |
| ------------------------------ | -------- | ----------------------------------------- |
| Quantity stepper               | ✓        |                                           |
| Promo code                     | ✓        |                                           |
| **Tier selection at checkout** | ✗        | Pairs with the missing event-level tiers  |
| **Promo code via deep link**   | ✗        | `?promo=XYZ` is a common share path       |
| Apple/Google Pay sheet (mock)  | ✓        | MockBillingSheet                          |
| **Wallet pass (Apple/Google)** | ✗        | Real apps add ticket to Wallet on success |

### Tickets

| Pattern                              | FrontRow | Notes                                      |
| ------------------------------------ | -------- | ------------------------------------------ |
| QR code                              | ✓        |                                            |
| Cancel / refund flow                 | ✓        |                                            |
| Transfer to friend                   | ✓        |                                            |
| Active / Past filter                 | ✓        | Just shipped                               |
| **Tier label on ticket**             | ✗        | Need tier in the ticket model              |
| **Ticket countdown ("doors in 1h")** | ✗        | Live-updating UI; common just above the QR |
| **Calendar export per ticket**       | ✗        |                                            |

### Account / personal

| Pattern                         | FrontRow | Notes                                            |
| ------------------------------- | -------- | ------------------------------------------------ |
| Sign in / forgot pw / reset     | ✓        |                                                  |
| Edit profile                    | ✓        |                                                  |
| Saved payment methods           | ✓        |                                                  |
| Notification inbox              | ✓        |                                                  |
| **Followed artists**            | ✗        |                                                  |
| **Concert history / "wrapped"** | ✗        |                                                  |
| **Saved searches / alerts**     | ✗        | Rarer, but Bandsintown / Songkick lead with this |

## Design polish

The screens are functionally complete but visually plain. Production concert apps lean heavily on:

- **Hero treatment** — the top item on a list deserves a featured card.
- **Genre badges with color** — chips per genre, not raw text.
- **Strong typography hierarchy** — titles are bigger than they currently are, captions are smaller.
- **Empty-state illustrations** — every empty state should have an icon, not just text.
- **Settings row icons** — every row gets a leading icon.
- **Safe-area handling** — current screens don't use `useSafeAreaInsets` consistently; iOS devices with notches show the header butting up against the clock.
- **Skeletons everywhere** — events list has it, my tickets / inbox / reviews still spin.
- **Press affordance** — `Pressable` rows could subtly fade or scale on press.

## Execution order

We bias toward visual wins first (so a screenshot tells the right story) and then fill the missing real-world surfaces.

1. **Visual polish pass** — hero event card, genre badge, empty-state icons across screens, settings row icons, safe-area insets on the events list header. _Single commit._
2. **Artist following** — follow toggle on detail, "Following" filter chip, dedicated FollowingScreen for the profile, Maestro flow.
3. **Ticket tiers** — add tiers to the event seed, tier picker on Buy, render tier on ticket detail, Maestro flow.
4. **Lineup with set times** — multi-artist event support, render lineup block, Maestro assertion.
5. **Sort options** — date asc/desc, price asc/desc picker on the events list.
6. **Refund policy** — copy block on event detail + ticket detail.
7. **Recently viewed events** — horizontal carousel above the main events list, persisted in MMKV.

Out of scope this phase, deliberately:

- **Dark mode** — every screen reads `theme.colors.x` as a static import, retrofitting it to a hook-based dynamic palette is a large refactor that should happen as its own phase.
- **Native maps** — adds a heavy native pod for one screen.
- **Apple/Google Wallet** — iOS-only and hard to test in Maestro.
- **Seat selection** — would require its own data model + UI; festival-style GA covers most real flows.

## Test surface

Every new feature ships with at least one Maestro flow. The new flows land under existing folders so the workspace ordering keeps working. The `frontrow/require-testid` lint rule catches any new interactive surface that ships without an ID.
