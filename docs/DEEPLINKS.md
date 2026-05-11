# Deep Links

FrontRow exposes a stable set of deep links so test flows can jump directly to a screen — or set up QA state — without driving through navigation. Links accept the `frontrow://` scheme; `https://frontrow.app/` is also registered as a prefix in `src/navigation/linking.ts` but no Universal/App-Links entitlement ships with this demo, so use the custom scheme for QA.

Two categories of links exist:

1. **Navigation links** — handled by React Navigation's `linking` config in [`src/navigation/linking.ts`](../src/navigation/linking.ts). Opening one pushes a screen.
2. **QA control links** — handled in [`src/hooks/useDeepLinkScenario.ts`](../src/hooks/useDeepLinkScenario.ts). Opening one mutates app state (auth, mock fixtures, failure triggers, IAP outcome) and does not navigate.

## Navigation links

| Link                                     | Screen                |
| ---------------------------------------- | --------------------- |
| `frontrow://events`                      | Events list           |
| `frontrow://events/:id`                  | Event detail          |
| `frontrow://events/:eventId/buy`         | Buy ticket modal      |
| `frontrow://events/:eventId/reviews`     | Event reviews         |
| `frontrow://inbox`                       | Notifications inbox   |
| `frontrow://tickets`                     | My Tickets            |
| `frontrow://tickets/:id`                 | Ticket detail (QR)    |
| `frontrow://profile`                     | Profile               |
| `frontrow://profile/edit`                | Edit profile          |
| `frontrow://profile/following`           | Followed artists      |
| `frontrow://profile/login`               | Sign-in screen        |
| `frontrow://profile/forgot-password`     | Forgot password       |
| `frontrow://profile/otp`                 | OTP entry             |
| `frontrow://profile/reset-password`      | Reset password        |
| `frontrow://profile/premium`             | Premium upsell        |
| `frontrow://profile/settings`            | Settings              |
| `frontrow://profile/language`            | Language picker       |
| `frontrow://profile/about`               | About                 |
| `frontrow://profile/payment-methods`     | Saved payment methods |
| `frontrow://profile/payment-methods/add` | Add payment method    |
| `frontrow://debug`                       | QA Debug Menu         |

## QA control links

These intercept before navigation and apply side-effects. The app stays on whatever screen it was on (or lands on Events if it cold-launches).

| Link                                         | What it does                                                                                                                                                   |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontrow://e2e/setup`                       | Signs in the demo user, marks onboarding complete, resets mock data, clears failure triggers. Replaces the cold-boot + login dance with one openLink (~200ms). |
| `frontrow://debug/reset`                     | Wipes the in-process `mockState` back to fixture defaults and clears the active scenario.                                                                      |
| `frontrow://debug/seed/<scenario_id>`        | Applies a seed scenario (see [SCENARIOS.md](SCENARIOS.md) for IDs).                                                                                            |
| `frontrow://debug/replayOnboarding`          | Re-enables the onboarding pager without uninstalling.                                                                                                          |
| `frontrow://debug/iap/<outcome>`             | Sets IAP outcome (`success`, `decline`, `cancel`, `pending`).                                                                                                  |
| `frontrow://debug/forceError/<mode>`         | Sets force-error mode (`none`, `4xx`, `5xx`, `timeout`, `offline`).                                                                                            |
| `frontrow://debug/trigger/<kind>[/on\|/off]` | Toggles a [failure trigger](FAILURE_TRIGGERS.md). Omit the `/on\|/off` segment to default to `on`.                                                             |

## Testing deep links locally

```bash
# iOS simulator
xcrun simctl openurl booted "frontrow://debug/seed/expired_tickets"

# Android emulator
adb shell am start -W -a android.intent.action.VIEW -d "frontrow://debug/seed/expired_tickets"
```

In Expo Go you can trigger deep links from the developer menu, or use the dev URL `exp://<host>/--/events`.

## iOS-specific gotcha: foregrounded-app delivery

iOS does not reliably re-deliver a URL to a foregrounded app via `Linking.addEventListener`. For QA control links that need to take effect on the _next_ render (most importantly `debug/trigger/...`), kill the app first and let the platform cold-launch path process the URL:

```yaml
# Maestro
- stopApp
- openLink: 'frontrow://debug/trigger/paymentTimeout/on'
```

This pattern is used in [`tests/maestro/debug/failure-trigger.yaml`](../tests/maestro/debug/failure-trigger.yaml).
