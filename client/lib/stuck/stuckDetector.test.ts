/**
 * Stuck-detector tests.
 *
 * The heuristic is the entire risk of the suggester feature, so it's tested
 * harder than the code around it. Most of these assert SILENCE — that's the
 * failure mode that matters, because a nudge at the wrong moment costs more
 * trust than a missed nudge saves.
 *
 * Compile and run (no test runner in the client):
 *   npx tsc lib/stuck/stuckDetector.ts lib/stuck/stuckDetector.test.ts \
 *     --outDir /tmp/stucktest --module commonjs --target es2020 --skipLibCheck
 *   node /tmp/stucktest/stuckDetector.test.js
 */
import {
  createState,
  reduce,
  evaluate,
  isSilenced,
  currentCooldown,
  promptFor,
  type StuckEvent,
  type StuckState,
  TYPING_GRACE_MS,
  COOLDOWN_MS,
  IDLE_MS,
  WARMUP_MS,
  DISMISSALS_BEFORE_MUTE,
} from "./stuckDetector";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const T0 = 1_000_000;
/** Past warmup, and long enough since any edit that typing grace has expired. */
const READY = T0 + WARMUP_MS + TYPING_GRACE_MS + 1000;

function apply(state: StuckState, events: [StuckEvent, number][]): StuckState {
  return events.reduce((s, [e, t]) => reduce(s, e, t), state);
}

console.log("\n1. Silence guards — the paperclip defences");
{
  const fresh = createState(T0);

  // Someone who just arrived cannot be stuck yet.
  const busy = apply(fresh, [[{ type: "review_failed", failedCriterionIds: ["c1"] }, T0 + 1000],
                             [{ type: "review_failed", failedCriterionIds: ["c1"] }, T0 + 2000]]);
  check("silent during warmup even with a strong signal", evaluate(busy, T0 + 5_000) === null);
  check("fires once warmup has passed", evaluate(busy, READY) !== null);

  // The signature paperclip failure: interrupting mid-keystroke.
  const typing = reduce(busy, { type: "edit" }, READY);
  check(
    "silent while actively typing",
    evaluate(typing, READY + TYPING_GRACE_MS - 1) === null,
  );
  check(
    "speaks once typing has paused",
    evaluate(typing, READY + TYPING_GRACE_MS + 1) !== null,
  );

  const shown = reduce(busy, { type: "suggestion_shown", key: "criterion:c1" }, READY);
  check("silent during cooldown", evaluate(shown, READY + COOLDOWN_MS - 1) === null);

  const muted = reduce(busy, { type: "muted" }, READY);
  check("silent when muted", evaluate(muted, READY + 10 * COOLDOWN_MS) === null);
  check("isSilenced agrees with evaluate", isSilenced(muted, READY));
}

console.log("\n2. Dismissal is treated as a signal, not noise");
{
  const base = apply(createState(T0), [
    [{ type: "review_failed", failedCriterionIds: ["c1"] }, T0 + 1000],
    [{ type: "review_failed", failedCriterionIds: ["c1"] }, T0 + 2000],
  ]);

  const onceDismissed = apply(base, [
    [{ type: "suggestion_shown", key: "criterion:c1" }, READY],
    [{ type: "suggestion_dismissed" }, READY + 1000],
  ]);
  check(
    "cooldown lengthens after a dismissal",
    currentCooldown(onceDismissed) > COOLDOWN_MS,
    `${currentCooldown(onceDismissed)} vs ${COOLDOWN_MS}`,
  );
  check(
    "still silent well past the normal cooldown",
    evaluate(onceDismissed, READY + COOLDOWN_MS + 1000) === null,
  );

  let twice = base;
  for (let i = 0; i < DISMISSALS_BEFORE_MUTE; i++) {
    twice = reduce(twice, { type: "suggestion_dismissed" }, READY + i);
  }
  check(`mutes for the session after ${DISMISSALS_BEFORE_MUTE} dismissals`, twice.muted);
  check("stays silent forever once muted", evaluate(twice, READY + 24 * 60 * 60_000) === null);
}

console.log("\n3. Repeated criterion failure — the strongest signal");
{
  const once = reduce(createState(T0), { type: "review_failed", failedCriterionIds: ["c1"] }, T0 + 1000);
  check("one failure is not enough", evaluate(once, READY) === null);

  const twice = reduce(once, { type: "review_failed", failedCriterionIds: ["c1"] }, T0 + 2000);
  const trigger = evaluate(twice, READY);
  check("two consecutive failures of the same criterion fire", trigger?.reason === "repeated_criterion");
  check("identifies which criterion", trigger?.subjectId === "c1");

  // Fixing something is progress, and progress must not read as being stuck.
  const partiallyFixed = reduce(twice, { type: "review_failed", failedCriterionIds: ["c2"] }, T0 + 3000);
  check(
    "a criterion the user fixed stops counting toward stuckness",
    (partiallyFixed.criterionFailures["c1"] ?? 0) === 0,
  );
  check(
    "and a newly-failing criterion starts from one, so it doesn't fire yet",
    evaluate(partiallyFixed, READY) === null,
  );

  const cleared = reduce(twice, { type: "review_passed" }, T0 + 3000);
  check("passing the review clears everything", evaluate(cleared, READY) === null);
}

console.log("\n4. Never offering the same nudge twice");
{
  const twice = apply(createState(T0), [
    [{ type: "review_failed", failedCriterionIds: ["c1"] }, T0 + 1000],
    [{ type: "review_failed", failedCriterionIds: ["c1"] }, T0 + 2000],
  ]);
  const offered = reduce(twice, { type: "suggestion_shown", key: "criterion:c1" }, READY);

  // Well past cooldown, still failing the same thing — but we already said our
  // piece about it, and repeating it is strictly worse than silence.
  const later = READY + 10 * COOLDOWN_MS;
  const stillFailing = reduce(offered, { type: "review_failed", failedCriterionIds: ["c1"] }, later);
  check("the same criterion is not nudged about twice", evaluate(stillFailing, later + 1000) === null);

  // A different problem is still fair game.
  const other = apply(stillFailing, [
    [{ type: "review_failed", failedCriterionIds: ["c9"] }, later + 2000],
    [{ type: "review_failed", failedCriterionIds: ["c9"] }, later + 3000],
  ]);
  check("a different criterion still fires", evaluate(other, later + 4000)?.subjectId === "c9");
}

console.log("\n5. Knowledge checks and runs");
{
  let s = createState(T0);
  for (let i = 0; i < 2; i++) s = reduce(s, { type: "check_failed", checkId: "k1" }, T0 + i);
  check("two wrong answers is not enough", evaluate(s, READY) === null);

  s = reduce(s, { type: "check_failed", checkId: "k1" }, T0 + 10);
  check("three fires", evaluate(s, READY)?.reason === "repeated_check");

  const answered = reduce(s, { type: "check_passed", checkId: "k1" }, T0 + 20);
  check("getting it right clears it", evaluate(answered, READY) === null);

  let r = createState(T0);
  for (let i = 0; i < 3; i++) r = reduce(r, { type: "run_failed" }, T0 + i);
  check("three failed runs fire", evaluate(r, READY)?.reason === "repeated_run_failure");
  const recovered = reduce(r, { type: "run_succeeded" }, T0 + 10);
  check("one success resets the streak", evaluate(recovered, READY) === null);
}

console.log("\n6. Idleness is the weakest signal");
{
  // Someone who opened the page and walked away is absent, not stuck.
  const neverEdited = createState(T0);
  check(
    "idling without ever having worked never fires",
    evaluate(neverEdited, T0 + 10 * IDLE_MS) === null,
  );

  const worked = reduce(createState(T0), { type: "edit" }, T0 + WARMUP_MS);
  check(
    "idling shortly after an edit does not fire",
    evaluate(worked, T0 + WARMUP_MS + IDLE_MS - 1000) === null,
  );
  check(
    "idling long enough after real activity does fire",
    evaluate(worked, T0 + WARMUP_MS + IDLE_MS + 1000)?.reason === "idle_after_activity",
  );

  // Specific beats vague whenever both are available.
  const both = apply(worked, [
    [{ type: "review_failed", failedCriterionIds: ["c1"] }, T0 + WARMUP_MS + 1],
    [{ type: "review_failed", failedCriterionIds: ["c1"] }, T0 + WARMUP_MS + 2],
  ]);
  check(
    "a specific reason outranks idleness",
    evaluate(both, T0 + WARMUP_MS + IDLE_MS + 1000)?.reason === "repeated_criterion",
  );
}

console.log("\n7. Prompts");
{
  const p = promptFor({ reason: "repeated_criterion", key: "k", subjectId: "c1" }, "Nav links target section IDs");
  check("names the failing criterion when known", p.includes("Nav links target section IDs"));
  check("reads as the user asking, not the tool announcing", /^I /.test(p));
  for (const reason of ["repeated_criterion", "repeated_check", "repeated_run_failure", "idle_after_activity"] as const) {
    const text = promptFor({ reason, key: "k" });
    check(`${reason} has a prompt`, text.length > 10);
  }
}

console.log("\n8. Purity");
{
  const s = createState(T0);
  const before = JSON.stringify(s);
  reduce(s, { type: "edit" }, T0 + 1);
  reduce(s, { type: "review_failed", failedCriterionIds: ["x"] }, T0 + 2);
  evaluate(s, READY);
  check("reduce and evaluate never mutate the state passed in", JSON.stringify(s) === before);
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
