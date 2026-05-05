# Maestro Flows

End-to-end flows authored in Maestro YAML.

> Flows land in Phase 1.

## Running locally

```bash
# Install Maestro: https://maestro.mobile.dev/
maestro test tests/maestro/smoke/launch.yaml
```

## Convention

- One YAML file per scenario.
- Group scenarios by feature in subdirectories: `auth/`, `events/`, `tickets/`, `debug/`, `smoke/`.
- Use `id:` matchers against the IDs in `app/src/testIds.ts`. Never match by visible text alone.
- Scenarios that need specific app state should `launchApp` with `arguments` (Phase 2 wires this up) or open a `frontrow://debug/seed/<id>` deep link first.
