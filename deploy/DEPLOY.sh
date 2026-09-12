#!/usr/bin/env bash
# DEPLOY.sh — install the goalmode-cards substrate into ANY project.
# Usage: ./DEPLOY.sh /abs/path/to/target-project
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:?usage: DEPLOY.sh <target-project-dir>}"
[ -d "$TARGET" ] || { echo "BLOCKED: target $TARGET does not exist"; exit 1; }
mkdir -p "$TARGET/.mimocode" "$TARGET/cards" "$TARGET/deploy/battery" "$TARGET/machinery" "$TARGET/sdk"
cp -r "$SRC/.mimocode/workflows"  "$TARGET/.mimocode/"
cp -r "$SRC/.mimocode/skills"     "$TARGET/.mimocode/"
cp -r "$SRC/.mimocode/commands"   "$TARGET/.mimocode/"
cp -r "$SRC/cards/masters"        "$TARGET/cards/"
cp -r "$SRC/cards/examples"       "$TARGET/cards/"
cp -r "$SRC/sdk/bridge"           "$TARGET/sdk/"
cp    "$SRC/deploy/battery/validate-cards.mjs" "$SRC/deploy/battery/bridge-tests.mjs" "$TARGET/deploy/battery/"
cp    "$SRC/machinery/run-smoke.mjs" "$TARGET/machinery/"
echo "INSTALLED goalmode-cards substrate into $TARGET"
echo "next: cd $TARGET && fork cards/masters/ + pin /goal"
