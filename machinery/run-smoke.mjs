#!/usr/bin/env node
// run-smoke.mjs — executes the EXACT gm-smoke workflow module under a
// node harness providing the sandbox globals (glob/readFile/phase/log).
// Prints the module's return as JSON; exit 1 unless ok:true.
// The substrate-native path is `workflow run gm-smoke` in a TUI session.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] || '.';
function glob(pattern) {
  const base = pattern.replace(/\*.*$/, '');
  try { return readdirSync(join(root, base)).filter(f => f.endsWith('.md')).map(f => `${base}${f}`); }
  catch { return []; }
}
const readFile = (p) => { try { return readFileSync(join(root, p), 'utf8'); } catch { return null; } };
const log = () => {};
const phase = () => {};

const mod = await import('../.mimocode/workflows/gm-smoke.js');
const result = await mod.default({ glob, readFile, phase, log, join, relative, statSync });
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok === true ? 0 : 1);
