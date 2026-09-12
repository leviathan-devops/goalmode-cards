// bridge.template.js — forkable pair with bridge.gm.md.
// Import gsh.js and compose your slots in shell order:
import { seq, and, or, run, pipe, jobs, trap, until, exit } from "./gsh.js";
export const meta = { name: "my-gsh-slot", description: "<FILL>", phases: [{title:"<FILL>"}] };
export default async function (g = globalThis) {
  const { phase, glob, readFile, log } = g;
  // example: gate a command, pipeline its output into a transform
  return pipe(
    run("node deploy/battery/validate-cards.mjs cards/", { expect: "FAIL count 0" }),
    async (gate) => { log(gate.evidence); return gate; },
  )();
}
