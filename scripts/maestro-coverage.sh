#!/usr/bin/env bash
set -euo pipefail

MAESTRO_DIR="tests/maestro"
TEST_IDS_FILE="src/testIds.ts"

echo "=== Screen Coverage: Maestro tests vs testIds.ts ==="
echo ""

# 1. Extract all test IDs from YAML files (id: '...' patterns)
declare -A USED_IDS
YAML_FILES=$(find "$MAESTRO_DIR" -name '*.yaml' | sort)
YAML_COUNT=0

echo "Files scanned:"
for f in $YAML_FILES; do
  YAML_COUNT=$((YAML_COUNT + 1))
  echo "  $f"
  while IFS= read -r tid; do
    [ -z "$tid" ] && continue
    USED_IDS["$tid"]=1
  done < <(grep -ohE "id: '[^']+'" "$f" | sed "s/^id: '//;s/'$//")
done
echo ""

echo "Total YAML files: $YAML_COUNT"
echo "Unique test IDs used in tests: ${#USED_IDS[@]}"
echo ""

# 2. Extract all defined test IDs from testIds.ts
#    Simple approach: find all string literal values in the object
declare -A DEFINED_IDS
DEFINED_COUNT=0

while IFS= read -r line; do
  # Match lines like "screen: 'screen.events'," or "myId: 'id.value',"
  # Also handle function returns: (id: string) => `template`
  tid=$(echo "$line" | grep -ohE "'[a-zA-Z0-9._-]+'" | head -1 | tr -d "'")
  [ -z "$tid" ] && continue
  # Skip non-testID strings like '1', 'description', etc - only take dotted paths
  [[ "$tid" == *"."* ]] || continue
  DEFINED_IDS["$tid"]=1
  DEFINED_COUNT=$((DEFINED_COUNT + 1))
done < <(grep -E "^\s+[a-zA-Z]" "$TEST_IDS_FILE" | grep -v "//\|^$\|: string\|: number\|typeof\|=>\|as const\|export\|import")

# 3. Compare
echo "=== Coverage Report ==="
echo ""
echo "Test IDs in testIds.ts: $DEFINED_COUNT"
echo ""

# Covered
COVERED=0
MISSING=0
echo "--- Covered ($(for id in "${!DEFINED_IDS[@]}"; do [[ -v USED_IDS[$id] ]] && echo "$id"; done | wc -l | tr -d ' ')) ---"
for id in "${!DEFINED_IDS[@]}"; do
  if [[ -v USED_IDS[$id] ]]; then
    echo "  [OK] $id"
    COVERED=$((COVERED + 1))
  fi
done | sort

echo ""
echo "--- Uncovered ($(for id in "${!DEFINED_IDS[@]}"; do [[ -v USED_IDS[$id] ]] || echo "$id"; done | wc -l | tr -d ' ')) ---"
for id in "${!DEFINED_IDS[@]}"; do
  if [[ ! -v USED_IDS[$id] ]]; then
    echo "  [  ] $id"
    MISSING=$((MISSING + 1))
  fi
done | sort

echo ""
PCT=0
[ "$DEFINED_COUNT" -gt 0 ] && PCT=$((COVERED * 100 / DEFINED_COUNT))
echo "Coverage: $COVERED / $DEFINED_COUNT = ${PCT}%"
