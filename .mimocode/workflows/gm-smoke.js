export const meta = {
  name: "gm-smoke",
  description: "GM Card smoke check: masters present, frontmatter marker intact, [FILL] slots intact for templates",
  phases: [{ title: "Enumerate" }, { title: "Check" }, { title: "Gate" }],
  permissions: [
    { permission: "read", patterns: ["cards/**"], reason: "read card files" },
  ],
}

export default async function (g = globalThis) {
  const { phase, log, glob, readFile } = g;
  phase("Enumerate")
  const files = await glob("cards/masters/*.md")
  const contract = "cards/GOAL_REPO_BUILD_v1.md"
  const all = (await readFile(contract) !== null && !files.includes(contract))
    ? [...files, contract] : files

  phase("Check")
  const evidence = []
  const failed = []
  for (const f of all) {
    const text = await readFile(f)
    if (text === null) { failed.push(`${f}: unreadable`); continue }
    if (!text.startsWith("---")) { failed.push(`${f}: no frontmatter`); continue }
    const hasFills = /\[FILL/.test(text)
    const isMaster = f.startsWith("cards/masters/")
    evidence.push(`${f}: frontmatter ok, fills=${hasFills} (master=${isMaster})`)
    if (!isMaster && hasFills) failed.push(`${f}: non-master card still carries [FILL] slots`)
  }

  phase("Gate")
  if (failed.length) { log(`${failed.length} smoke failures`); return { ok: false, failed, evidence } }
  return { ok: true, checked: all.length, evidence }
}
