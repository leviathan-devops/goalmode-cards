---
card: js-workflow-v1
version: 1
forked-from: JS_WORKFLOW_CARD_MASTER_v1.md
mode: build
id: [FILL]
slot_in: "[FILL parent Goalmode Card §2 slot]"
meta:                      # verbatim workflows.md contract
  name: "[FILL A-Za-z0-9._-]"
  description: "[FILL]"
  phases: [{title: "[FILL]"}]
  permissions: [{permission: bash, patterns: ["[FILL]"], reason: "[FILL]"}]
---
export default async function () {
  phase("[FILL]")
  const units = await glob("[FILL pattern]")       // enumerate, don't spawn
  const results = await parallel(units.map(u => () =>
    agent("[FILL distilled brief for u]", {
      agentType: "[FILL general|explore]",
      schema: {                                    // typed gate = the point
        type: "object",
        properties: { ok: {type:"boolean"},
                      evidence: {type:"string"} },
        required: ["ok","evidence"] } })))
  const failed = results.filter(r => r === null || !r.ok)
  phase("gate")
  if (failed.length) { log(`${failed.length} units failed`) ; return {ok:false,failed} }
  return {ok:true, evidence: results.map(r=>r.evidence)}
}
# pass_token: return {ok:true,...}   fail_token: {ok:false}
# determinism: no Date/crypto/fetch in script — inside agent() only
