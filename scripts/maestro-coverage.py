#!/usr/bin/env python3
"""Screen coverage: Maestro YAML testIDs vs testIds.ts"""
import re, glob, sys

maestro_dir = "tests/maestro"
testids_file = "src/testIds.ts"

# 1. Extract test IDs from YAML files
used_ids = set()
yaml_files = sorted(glob.glob(f"{maestro_dir}/**/*.yaml", recursive=True))
print(f"Files scanned: {len(yaml_files)}")
for f in yaml_files:
    with open(f) as fh:
        for m in re.findall(r"id:\s+['\"]([^'\"]+)['\"]", fh.read()):
            used_ids.add(m)

print(f"Unique test IDs used in tests: {len(used_ids)}")
print()

# 2. Extract defined test IDs from testIds.ts
defined_ids = set()
with open(testids_file) as fh:
    content = fh.read()

# Find all string literal values (dotted paths like 'screen.events')
for m in re.findall(r":\s+'((?:[a-zA-Z_]\w*\.)+[a-zA-Z_]\w*(?:\.\w+)*)'", content):
    defined_ids.add(m)

# Also extract function/template string patterns like `events.item.${id}`
for m in re.findall(r":\s+\([^)]+\)\s*=>\s*`(\w+(?:\.\w+)*)\$\{", content):
    defined_ids.add(f"{m}<id>")

print(f"Test IDs in testIds.ts: {len(defined_ids)}")
print()

# 3. Compare
covered = defined_ids & used_ids
missing = defined_ids - used_ids

print(f"--- Covered ({len(covered)}) ---")
for tid in sorted(covered):
    print(f"  [OK] {tid}")

print()
print(f"--- Uncovered ({len(missing)}) ---")
for tid in sorted(missing):
    print(f"  [  ] {tid}")

print()
pct = len(covered) * 100 // len(defined_ids) if defined_ids else 0
print(f"Coverage: {len(covered)} / {len(defined_ids)} = {pct}%")
