# Deep Links

FrontRow exposes a stable set of deep links so test flows can jump directly to a screen without driving through navigation. Links accept the `frontrow://` scheme and (in production builds) `https://frontrow.app/`.

## Public links

| Link                              | Screen                   | Status  |
| --------------------------------- | ------------------------ | ------- |
| `frontrow://events`               | Events list              | Phase 0 |
| `frontrow://events/:id`           | Event detail             | Phase 1 |
| `frontrow://tickets`              | My Tickets               | Phase 0 |
| `frontrow://tickets/:id`          | Ticket detail            | Phase 1 |
| `frontrow://profile`              | Profile                  | Phase 0 |
| `frontrow://debug`                | QA Debug Menu            | Phase 0 |
| `frontrow://debug/seed/:scenario` | Apply seed scenario      | Phase 2 |
| `frontrow://debug/route/:route`   | Jump to arbitrary screen | Phase 2 |

## Testing deep links locally

```bash
# iOS simulator
xcrun simctl openurl booted frontrow://events

# Android emulator
adb shell am start -W -a android.intent.action.VIEW -d "frontrow://events"
```

In Expo Go you can trigger deep links from the developer menu, or use the dev URL `exp://<host>/--/events`.
