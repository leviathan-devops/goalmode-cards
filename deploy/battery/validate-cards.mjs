#!/usr/bin/env node
// validate-cards.mjs — GM Card schema validator (battery gate for §0)
// Family-aware: goalmode-v1 needs §0-§6 + cmd/expect pairs;
// js-workflow-v1 needs meta + export default; compose-function-v1
// needs function: + contract body. Exit 1 on any FAIL.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || 'cards';
const results = [];
let fail = 0;

function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.md')) results.push(check(p, readFileSync(p, 'utf8')));
  }
}
function check(path, text) {
  const errs = [];
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return { path, ok: false, errs: ['no frontmatter'] };
  const f = fm[1];
  for (const k of ['card:', 'id:', 'version:', 'forked-from:', 'mode:'])
    if (!new RegExp(`^${k}`, 'm').test(f)) errs.push(`frontmatter missing ${k}`);
  const family = (f.match(/^card:\s*(\S+)/m) || [])[1];
  if (family === 'goalmode-v1') {
    const unfenced = text.replace(/```[\s\S]*?```/g, '');   // C3: fences never satisfy section presence
    for (const s of ['## §0', '## §1', '## §2', '## §3', '## §4', '## §5', '## §6'])
      if (!unfenced.includes(s)) errs.push(`missing section ${s}`);
    const sec0 = unfenced.split('## §0')[1]?.split('## §1')[0] || '';
    const pairs = sec0.match(/- cmd:/g)?.length || 0;
    const expects = sec0.match(/expect:/g)?.length || 0;
    if (pairs === 0) errs.push('§0 has no cmd pairs');
    if (pairs !== expects) errs.push(`§0 cmd/expect mismatch ${pairs}/${expects}`);
    if (!/nl_prompt:/.test(sec0)) errs.push('§0 missing nl_prompt');
  } else if (family === 'js-workflow-v1') {
    if (!/^\s*name:\s*"(\[FILL[^\]]*\]|[A-Za-z0-9._-]+)"/m.test(f)) errs.push('meta.name missing or bad charset');
    if (!/^\s*description:\s*\S/m.test(f)) errs.push('meta.description missing');
    const code = text.replace(/^---[\s\S]*?---/, '');   // C2: export must live in code, not prose
    if (!/^export default async function/m.test(code)) errs.push('no default export');
  } else if (family === 'compose-function-v1') {
    if (!/^function:/m.test(f)) errs.push('function: missing');
    if (!/micro_loop:|phases:|contract/.test(text)) errs.push('no contract body');
  } else errs.push(`unknown family "${family}"`);
  return { path, ok: errs.length === 0, errs };
}
walk(root);
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.path}${r.errs.length ? ' :: ' + r.errs.join('; ') : ''}`);
  if (!r.ok) fail++;
}
const pass = results.length - fail;
console.log(`\nVALIDATOR: PASS count ${pass}, FAIL count ${fail}, total ${results.length}`);
process.exit(fail ? 1 : 0);
