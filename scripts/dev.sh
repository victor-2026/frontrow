#!/usr/bin/env bash
set -euo pipefail

# One-command boot for FrontRow contributors.
# Usage:
#   scripts/dev.sh           # iOS simulator (default)
#   scripts/dev.sh android   # Android emulator
#   scripts/dev.sh start     # Metro only, no platform

PLATFORM="${1:-ios}"

case "$PLATFORM" in
  ios)     exec npm run ios ;;
  android) exec npm run android ;;
  start)   exec npm start ;;
  *)
    echo "Usage: scripts/dev.sh [ios|android|start]" >&2
    exit 2
    ;;
esac
