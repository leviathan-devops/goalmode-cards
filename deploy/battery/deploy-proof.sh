#!/usr/bin/env bash
# deploy-proof.sh — prove DEPLOY.sh installs into a CLEAN target.
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
T=$(mktemp -d)
bash "$REPO/deploy/DEPLOY.sh" "$T"
for f in .mimocode/workflows/gm-smoke.js .mimocode/skills/goalmode-card/SKILL.md \
         .mimocode/commands/goalmode.md cards/masters/GOALMODE_CARD_MASTER_v1.md \
         sdk/bridge/gsh.js deploy/battery/validate-cards.mjs machinery/run-smoke.mjs; do
  [ -f "$T/$f" ] || { echo "MISSING $f"; exit 1; }
done
cd "$T"
node machinery/run-smoke.mjs . > /dev/null   # smoke works in the clean target
echo "DEPLOY PROOF: clean target verified, smoke {ok:true} in target"
rm -rf "$T"
