#!/usr/bin/env python3
"""Replace hardcoded colours with design tokens, per line.

Context decides the token: text inside a white card needs
*-on-raised; the same colour on the page needs the plain token.
Your light mode has a dark surface with white cards, so getting this
wrong gives you white-on-white.
"""
import re, sys

# file -> line -> (substring to find, replacement)
EDITS = {
 "app/dashboard.tsx": {
   18:[("bg-[#f4f7f8]","bg-surface")],
   22:[("text-4xl font-bold text-[#0c1953]","text-display font-bold text-content")],
   26:[("text-base text-gray-500","text-body text-content-muted")],
   36:[("rounded-2xl bg-[#0c1953]","rounded-control bg-accent")],
   38:[("text-white","text-content-on-accent")],
   43:[("text-xl font-bold text-[#0c1953]","text-heading font-bold text-content")],
   62:[("rounded-2xl bg-white","rounded-card bg-surface-raised")],
   64:[("text-[#0c1953]","text-content-on-raised")],
 },
 "app/map.tsx": {
   7:[("bg-[#dcebed]","bg-surface")],
   11:[("rounded-xl bg-white","rounded-control bg-surface-raised")],
   13:[("text-[#0c1953]","text-content-on-raised")],
   18:[("rounded-2xl bg-white","rounded-card bg-surface-raised")],
   19:[("text-lg font-bold text-[#0c1953]","text-body font-bold text-content-on-raised")],
   22:[("text-gray-500","text-content-on-raised-muted")],
   30:[("text-xl font-bold text-[#0c1953]","text-heading font-bold text-content")],
   33:[("text-gray-600","text-content-muted")],
   48:[("rounded-2xl bg-white","rounded-card bg-surface-raised")],
   50:[("text-[#0c1953]","text-content-on-raised")],
   53:[("text-gray-500","text-content-on-raised-muted")],
 },
 "app/sources.tsx": {
   12:[("bg-[#f4f7f8]","bg-surface")],
   15:[("text-[#0c1953]","text-content")],
   18:[("text-3xl font-bold text-[#0c1953]","text-heading font-bold text-content")],
   22:[("text-gray-500","text-content-muted")],
   29:[("rounded-2xl bg-white","rounded-card bg-surface-raised")],
   31:[("text-[#0c1953]","text-content-on-raised")],
   37:[("text-sm text-gray-500","text-caption text-content-muted")],
 },
 "app/location.tsx": {
   13:[("bg-[#f4f7f8]","bg-surface")],
   16:[("text-[#0c1953]","text-content")],
   19:[("text-3xl font-bold text-[#0c1953]","text-heading font-bold text-content")],
   23:[("text-gray-500","text-content-muted")],
   34:[("text-xl font-bold text-[#0c1953]","text-heading font-bold text-content")],
   38:[("text-gray-600","text-content-muted")],
   49:[("rounded-2xl bg-[#0c1953]","rounded-control bg-accent")],
   51:[("text-white","text-content-on-accent")],
   63:[("rounded-2xl bg-white","rounded-card bg-surface-raised")],
   65:[("text-[#0c1953]","text-content-on-raised")],
 },
 "app/settings.tsx": {
   6:[("bg-[#f4f7f8]","bg-surface")],
   8:[("text-[#0c1953]","text-content")],
   11:[("text-3xl font-bold text-[#0c1953]","text-heading font-bold text-content")],
   15:[("rounded-2xl bg-white","rounded-card bg-surface-raised")],
   16:[("text-lg font-bold text-[#0c1953]","text-body font-bold text-content-on-raised")],
   20:[("text-gray-500","text-content-on-raised-muted")],
   25:[("rounded-2xl bg-white","rounded-card bg-surface-raised")],
   26:[("text-[#0c1953]","text-content-on-raised")],
   30:[("text-gray-500","text-content-on-raised-muted")],
 },
}

changed = missed = 0
for path, by_line in EDITS.items():
    try:
        lines = open(path).read().split("\n")
    except FileNotFoundError:
        print(f"SKIP  {path} (not found)"); continue
    for ln, subs in by_line.items():
        i = ln - 1
        if i >= len(lines):
            print(f"MISS  {path}:{ln} past end of file"); missed += 1; continue
        for old, new in subs:
            if old in lines[i]:
                lines[i] = lines[i].replace(old, new); changed += 1
            else:
                print(f"MISS  {path}:{ln} no '{old}'"); missed += 1
    open(path, "w").write("\n".join(lines))
    print(f"OK    {path}")

print(f"\n{changed} replaced, {missed} missed")

# Anything left behind?
import subprocess
leftover = subprocess.run(
    ["grep","-rnE",r"#0c1953|#f4f7f8|#dcebed|bg-white|text-gray-","app/"],
    capture_output=True, text=True).stdout.strip()
print("\nRemaining hardcoded colours:\n" + (leftover or "  none"))
