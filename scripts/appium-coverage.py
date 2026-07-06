#!/usr/bin/env python3
"""Coverage: Appium (WDIO) testIDs vs testIds.ts"""
import re, glob

spec_dir = "tests/appium/specs"
testids_file = "src/testIds.ts"

used_ids = set()
ts_files = sorted(glob.glob(f"{spec_dir}/**/*.spec.ts", recursive=True))
print(f"Files scanned: {len(ts_files)}")
for f in ts_files:
    with open(f) as fh:
        content = fh.read()
    for m in re.findall(r"\$\(\s*['\"]~(\w[\w.]+)['\"]\s*\)", content):
        used_ids.add(m)
    for m in re.findall(r"(?:waitForId|tapId|typeIntoId|byId)\(\s*['\"](\w[\w.]+)['\"]\s*\)", content):
        used_ids.add(m)

print(f"Unique test IDs used in Appium tests: {len(used_ids)}")
print()

defined_ids = set()
template_ids = {}
with open(testids_file) as fh:
    content = fh.read()

for m in re.findall(r":\s+'((?:[a-zA-Z_]\w*\.)+[a-zA-Z_]\w*(?:\.\w+)*)'", content):
    defined_ids.add(m)

for m in re.findall(r":\s+\([^)]+\)\s*=>\s*`(\w+(?:\.\w+)*)\$\{", content):
    template_ids[m] = f"{m}<id>"
    defined_ids.add(f"{m}<id>")

print(f"Test IDs in testIds.ts: {len(defined_ids)}")
print()

covered_literal = defined_ids & used_ids
covered_template = set()
for prefix, template_id in template_ids.items():
    for tid in used_ids:
        if tid.startswith(prefix):
            covered_template.add(template_id)

covered = covered_literal | covered_template
missing = defined_ids - covered

print(f"--- Covered ({len(covered)}) ---")
for tid in sorted(covered_literal):
    print(f"  [OK] {tid}")
if covered_template:
    for tid in sorted(covered_template):
        print(f"  [OK] {tid}  (via template match)")

print()
print(f"--- Uncovered ({len(missing)}) ---")
for tid in sorted(missing):
    print(f"  [  ] {tid}")

print()
pct = len(covered) * 100 // len(defined_ids) if defined_ids else 0
print(f"Coverage: {len(covered)} / {len(defined_ids)} = {pct}%")
