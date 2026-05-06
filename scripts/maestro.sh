#!/usr/bin/env bash
# Reliable Maestro runner. Cleans up stale daemon processes from previous runs,
# sets the iOS XCTest startup timeout, picks the right device based on argument.
#
# Usage:
#   scripts/maestro.sh android [<flow|dir>]   # default: tests/maestro/
#   scripts/maestro.sh ios     [<flow|dir>]
set -euo pipefail

PLATFORM="${1:-}"
TARGET="${2:-tests/maestro/}"

if [[ "$PLATFORM" != "android" && "$PLATFORM" != "ios" ]]; then
  echo "Usage: scripts/maestro.sh [android|ios] [flow-or-dir]" >&2
  exit 2
fi

# Maestro's daemon survives interrupted runs and can corrupt subsequent
# invocations (every flow instant-fails in 0s). Killing leftovers is safe —
# Maestro starts a fresh daemon on demand.
echo "→ cleaning up stale Maestro processes…"
pkill -9 -f maestro 2>/dev/null || true
sleep 2

if [[ "$PLATFORM" == "android" ]]; then
  DEVICE="${DEVICE:-$(adb devices | awk 'NR==2 {print $1}')}"
  if [[ -z "$DEVICE" ]]; then
    echo "no Android device connected (check 'adb devices')" >&2
    exit 1
  fi
  echo "→ Android device: $DEVICE"
  exec maestro --device "$DEVICE" test "$TARGET"
fi

# iOS — iPhone simulator booted via Xcode or `xcrun simctl boot`
DEVICE="${DEVICE:-$(xcrun simctl list devices booted | awk -F'[()]' '/Booted/{gsub(/^[ \t]+/, "", $2); print $2; exit}')}"
if [[ -z "$DEVICE" ]]; then
  echo "no iOS simulator booted (use Xcode or 'xcrun simctl boot <udid>')" >&2
  exit 1
fi
echo "→ iOS simulator: $DEVICE"
# XCTest agent install can take 60-90s the first time; bump from the default.
export MAESTRO_DRIVER_STARTUP_TIMEOUT="${MAESTRO_DRIVER_STARTUP_TIMEOUT:-300000}"
exec maestro --device "$DEVICE" test "$TARGET"
