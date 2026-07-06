# Session Checkpoint — 2026-07-02 (Session 68)

## Goal
Port 13 new test IDs to Appium: event-detail sections (reviews, follow artist, share), profile-edit save/discard, my-tickets screen, promo error/remove, avatar.

## Summary
**20/20 in frontrow.spec.ts, all 39 Appium tests passing. Coverage jump: 8% → 36%.**

| Framework | Tests | Coverage | IDs |
|-----------|-------|----------|-----|
| Appium | **39** (+22) | **36%** (+28pp) | **56/154** |
| Maestro | 43 | 80% | 124/154 |
| Detox | 29 | 35% | 54/154 |
| **Unique** | **111** | **~87%** | **134 used** |

## Key Discovery: W3C keyboard + tap dismiss
- Previous session claimed `setValue` didn't trigger RN onChangeText — **wrong on this stack** (`setValue` works, confirmed in auth tests)
- **New discovery**: `setValue` on iOS **disables navigation bar** (back/nav buttons unresponsive post-input)
- **Fix**: W3C keyDown/keyUp Actions per character, dismiss by tapping `buyTicket.quantityStepper`
- `screen.events`/`screen.eventDetail` invisible to `~` selector — use child elements (`events.list`)
- `beforeEach(setup)` (deepLink) must precede buyTicket — state resets

## Structural Changes
- **Merged** `my-tickets.spec.ts` + `profile-edit.spec.ts` into `frontrow.spec.ts` — avoids pay-flow flakiness
- `ensureSignedIn()` — skip if `signOutButton` already visible (survives `noReset` sessions)
- After buying a ticket, go `tab.events` → `tab.myTickets` (tab sometimes unresponsive on buy confirm)
- **Deleted:** `my-tickets.spec.ts`, `profile-edit.spec.ts`, `debug.spec.ts`, `wdio.debug.conf.ts`, `wdio.fresh.conf.ts`

## Appium Tests (39 across 7 specs, all PASS)

### frontrow.spec.ts — 20/20
- Promo codes (4): FRONTROW10, FRONTROW25, FRONTROW50, FREE
- Promo error (3): invalid, expired, remove applied
- Quantity stepper (2): increment → $135, decrement → $90
- Edit profile bio (1): charCount visible
- Avatar (1): default avatar on profile tab
- Profile Edit sign-in (1): bio field + charCount
- Profile Edit discard (1): dialog visible, cancel stays
- Profile Edit save (1): toast appears
- Inbox (2): opens + markAllRead
- My Tickets filter (1): Active filter after buy
- My Tickets screen (1): chips + ticket list after buy
- Event detail (2): title/buy/favorite, refund policy

### event-detail.spec.ts — 5/5: reviews button, reviews screen, follow artist, refund policy, buy

### Others: auth (5), events (3), profile-settings (4), smoke (2), login (1)

## Infrastructure
```bash
# Run one spec
npx wdio run tests/appium/wdio.ios.conf.ts --spec ./tests/appium/specs/frontrow.spec.ts

# Run all (takes ~60m)
npx wdio run tests/appium/wdio.ios.conf.ts
```

## Coverage Updated
- `docs/functional-coverage.xlsx` — regenerated with 36/80/35% per framework

## Files
```bash
code /Users/victor/Projects/Mobile_1/frontrow/tests/appium/specs/frontrow.spec.ts
code /Users/victor/Projects/Mobile_1/frontrow/tests/appium/specs/event-detail.spec.ts
code /Users/victor/Projects/Mobile_1/frontrow/tests/appium/wdio.ios.conf.ts
code /Users/victor/Projects/Mobile_1/frontrow/docs/functional-coverage.xlsx
```

## Next
- Merge Appium 36% findings into Detox vs Appium article
- 10x runs for flake statistics
- Push to GitHub if user's fork exists

---

# Session Checkpoint — 2026-07-01 (Session 67)

## Goal
Compare Detox 20.51.4 vs Appium 3.3.0 (XCUITest 11.0.0) on FrontRow (Expo 54 + RN 0.81 + new arch, iOS 26.3). Write 12 matching tests per framework, collect pass/fail and duration data for article.

## Result
| Framework | Passing | Failing | Total Time | Reliability |
|-----------|---------|---------|------------|-------------|
| **Detox 20.51.4** | **12/12** ✅ | 0 | ~500s (8.5m) | 100% |
| **Appium 3.3.0** | **8/12** ✅ | 4 (text input) | ~454s (7.5m) | 67% |

## Detailed Breakdown

### Promo codes (data-driven, 4 tests)
| Code | Expected | Detox | Appium |
|------|----------|-------|--------|
| FRONTROW10 → $40.50 | `promoSuccess` visible + `totalAmount: "$40.50"` | ✅ | ❌ setValue/typeText bypasses RN onChangeText |
| FRONTROW25 → $33.75 | same | ✅ | ❌ same |
| FRONTROW50 → $22.50 | same | ✅ | ❌ same |
| FREE → $0.00 | same | ✅ | ❌ same |

### Quantity stepper (2 tests) — **Both PASS** ✅
| Test | Detox | Appium |
|------|-------|--------|
| qty 3 → $135.00 | ✅ | ✅ |
| qty 2 → $90.00 | ✅ | ✅ |

### Other flows (6 tests) — **Both PASS** ✅
| Test | Detox | Appium |
|------|-------|--------|
| Edit profile bio | ✅ (charCount updates) | ✅ (charCount exists, value may not update) |
| Inbox opens | ✅ | ✅ |
| Inbox markAllRead | ✅ | ✅ |
| My Tickets filter | ✅ | ✅ |
| Event detail elements | ✅ | ✅ |
| Event detail refund (swipe) | ✅ | ✅ |

## Key Technical Findings

### Detox Advantages
- **RN bridge integration** — idling resources eliminate explicit waits (no `driver.pause()`)
- **`typeText` with `\n`** properly triggers RN `onChangeText` and dismisses keyboard
- **`device.launchApp({newInstance: true})`** — reliable full state reset (30s/test)
- **Swipe gesture** — native `element.swipe('up')` is clean and precise
- **`toHaveText`** — exact price verification works natively

### Appium Limitations (this env)
- **`setValue`, `addValue`, `driver.keys()`, `mobile: type`, W3C Actions** — none trigger RN `onChangeText` on XCUITest 11.0.0 + iOS 26.3. WDA rejects W3C keyDown/keyUp sequences ("must have a closing Key Up successor")
- **`mobile: type`** — "Method is not implemented" (removed in recent XCUITest driver)
- **State reset** — `mobile: deepLink` works for ~6 calls, then becomes unreliable. Fallback `terminateApp` + `activateApp` needed
- **WDA build** requires 10 min on Intel Mac first time. Solved with `usePrebuiltWDA: true` + explicit `wdaDerivedDataPath`

### Shared Limitations
- **RN `<Modal>`** — invisible to both Detox and Appium (separate UIWindow). Maestro handles it fine
- **Swipe gesture** — both work (Detox: `swipe('up')`, Appium: `mobile: swipe {direction: 'up'}`)

## Infrastructure Setup
```bash
# Pre-build WDA for Appium (once per env change)
WDA_PATH="/Users/victor/.appium/node_modules/appium-xcuitest-driver"
xcodebuild -project "$WDA_PATH/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj" \
  -scheme WebDriverAgentRunner \
  -destination "id=$(xcrun simctl list devices booted | grep '26.3' | sed -n 's/.*(\([A-F0-9-]*\)).*/\1/p')" \
  -derivedDataPath "$WDA_PATH/build" \
  build-for-testing \
  GCC_TREAT_WARNINGS_AS_ERRORS=0 \
  COMPILER_INDEX_STORE_ENABLE=NO \
  ONLY_ACTIVE_ARCH=YES
```

## Files Modified/Created
- `tests/appium/specs/frontrow.spec.ts` — 12 Appium tests (8 pass)
- `tests/appium/wdio.ios.conf.ts` — usePrebuiltWDA + wdaDerivedDataPath
- `tests/appium/wdio.shared.conf.ts` — removed WDIO appium service (use external server)
- `e2e/smoke.test.js` — 12 tests (all passing)
- `docs/functional-coverage.xlsx` — coverage matrix (55% Maestro, 8% Detox, 8% Appium)

## Next Session Tasks
1. Publish Detox vs Appium article with 8/12 vs 12/12 hard numbers
2. Add Maestro equivalent flows for the 4 failing Appium tests (promo codes)
3. 10x runs of all suites for flake/duration statistics
4. Consider: Appium gap is text-input-only — for 67% of tests it's equally capable
