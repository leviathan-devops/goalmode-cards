#!/usr/bin/env node
// deploy-proof.mjs — prove DEPLOY.sh installs into a CLEAN target and
// the substrate smoke passes THERE. Node runner (parses cleanly in the
// host toolchain); identical mechanism to the bash proof.
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const target = mkdtempSync(join(tmpdir(), 'gmc-deploy-'));
try {
  execFileSync('bash', [join(repo, 'deploy', 'DEPLOY.sh'), target], { stdio: 'inherit' });
  const required = [
    '.mimocode/workflows/gm-smoke.js',
    '.mimocode/skills/goalmode-card/SKILL.md',
    '.mimocode/commands/goalmode.md',
    'cards/masters/GOALMODE_CARD_MASTER_v1.md',
    'cards/examples/BUILD_TETRIS_v1.md',
    'sdk/bridge/gsh.js',
    'deploy/battery/validate-cards.mjs',
    'machinery/run-smoke.mjs',
  ];
  let missing = 0;
  for (const f of required) {
    const ok = existsSync(join(target, f));
    console.log(`${ok ? 'PASS' : 'MISSING'} ${f}`);
    if (!ok) missing++;
  }
  if (missing) process.exit(1);
  const smoke = execFileSync('node', [join(target, 'machinery', 'run-smoke.mjs'), '.'], { cwd: target, encoding: 'utf8' });
  const okToken = smoke.includes('"ok": true');
  console.log(`SMOKE-IN-TARGET: ${okToken ? '{ok:true} PASS' : 'FAIL'}`);
  console.log(okToken ? 'DEPLOY PROOF: clean target verified, substrate operational' : 'DEPLOY PROOF: FAIL');
  process.exit(okToken ? 0 : 1);
} finally {
  rmSync(target, { recursive: true, force: true });
}
