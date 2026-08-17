# Codit — Phased Build Plan

*Companion to [IDEA.md](./IDEA.md). This is the execution order and why it is that order.*

---

## The organizing insight

Three priorities are on the table: **harden the review gate**, **rebuild ai-service into three tiers**, and **make the platform engaging**. They look like three parallel tracks. They aren't.

All three converge on one missing primitive: **a per-phase, structured rubric.**

- The **gate** needs it to produce a verdict as a conjunction of specific, evidenced findings instead of one holistic vibe.
- The **3-tier AI** needs it as a retrieval target. "Find evidence for criterion 3" is a tractable context-selection problem. "Is this good enough?" is not.
- The **growth layer** needs it because Build and Understand can only be separate stats if something in the data distinguishes *the code works* from *they understood it*.
- **AI-generated projects** and **bring-your-own-repo** need it as the generation contract. You cannot ask a model to invent phases for someone's codebase until you have defined what a phase's success condition looks like *as data*.

So the rubric is not phase one because it's exciting. It's phase one because five other things are blocked on it.

```
Phase 0  Integrity fixes ─────┐
                              ├──> Phase 1  Rubric ──┬──> Phase 2  Gate ──┬──> Phase 4  Growth layer
                              │                      │                    ├──> Phase 5  Social proof
                              └──────────────────────┴──> Phase 3  3-tier ┴──> Phase 6  AI-gen catalogue
                                                              AI                        │
                                                                                        └──> Phase 7  BYO repo
```

---

## Phase 0 — Close the integrity holes ✅ DONE

*Verified end-to-end against a live database and running services: 16 integrity
checks (`services/user-service/tests/phase0.integrity.test.ts`) and 15 grading
checks (`tests/phase0.grading.test.ts`), all passing.*


**Goal:** make the existing gate honest before making it rigorous. These are small, and everything downstream is meaningless without them.

**Why first:** Phases 1–2 build an elaborate grading system. If advancement can still be triggered client-side, that whole investment secures a door with no lock.

### What's wrong right now

**1. The verdict is decided in the browser.**
`client/app/dashboard/build/[projectId]/page.tsx:1398` runs `/VERDICT:\s*MET\b/i` against the streamed reply text, and on a match calls `advanceUserProjectPhase`. Two failures: the advance endpoint accepts no proof, so it can be called directly; and one stray "VERDICT: MET" inside prose explaining *what MET would look like* advances the phase.

**2. Knowledge checks gate on attendance, not correctness.**
`page.tsx:1366` — `checks.filter(c => c.attempted)`. Answer every question wrong, still reach review. One of the three proof-of-understanding layers is currently checking that you showed up.

**3. `review` mode isn't in the contract.**
`shared/proto/ai.proto` documents `mode` as `"" | "chat" | "explain"`. The handler also implements `review`. Undocumented load-bearing behavior.

### Work

- Add `POST /api/projects/:id/advance` server-side authorization: advancement requires a stored, server-issued pass for the current phase. Reject otherwise.
- Change the knowledge-check gate to require *correct*, not *attempted*. Allow unlimited retries — this is a learning tool, not an exam — but the phase doesn't open until they're right.
- Document `review` in `ai.proto`.
- Add a server-side guard that `current_phase` can only increment by 1, and only for the caller's own enrollment.

**Exit criteria:** a user with devtools open cannot advance a phase. Answering everything wrong cannot reach review.

**Size:** small. Days, not weeks.

---

## Phase 1 — The rubric primitive ✅ DONE

*135 criteria authored across all 30 seeded phases, source-of-truth in
`services/shared/prisma/criteria.ts`, applied via `npm run db:criteria`.
Verified by 19 checks in `services/user-service/tests/phase1.criteria.test.ts`.
`conceptual` criteria are intentionally unauthored — see the note below.*


**Goal:** replace free-text phase goals with structured, checkable criteria.

**Why now:** it's the blocker for everything else. Today `LearningPhase.goal` is a JSON blob containing a `description` string. The grader receives prose and returns a binary judgment, with no intermediate structure to inspect, debug, or count.

### Proposed schema

```prisma
model PhaseCriterion {
  id          String        @default(uuid()) @unique
  phase_id    String
  order       Int
  /// Human-readable, specific: "Nav links target section IDs on the same page"
  text        String
  /// Splits the Build stat from the Understand stat downstream.
  kind        CriterionKind
  /// deterministic criteria run as code; model_judged go to the LLM with evidence required.
  check_type  CheckType
  /// For deterministic: file glob, required pattern, parse target, element query.
  check_config Json?
  /// Shown on failure. Names the concept, never the code.
  hint        String        @default("")

  learningPhase LearningPhase @relation(fields: [phase_id], references: [id])
}

enum CriterionKind {
  behavioral    // the thing does what it should
  structural    // it's built the way the phase teaches
  conceptual    // they can articulate why
}

enum CheckType {
  deterministic  // file exists, parses, contains pattern, element present
  model_judged   // requires reading and reasoning about the code
}
```

Note `Deliverable` already exists on `Projects` — this is deliberately its per-phase sibling, at the granularity grading actually happens.

### Work

- Migration for `PhaseCriterion` + enums.
- Backfill: convert existing seeded phase goals into 3–6 criteria each, by hand. **This is the important part** — authoring these teaches you what a good criterion looks like, which is exactly the spec Phase 6's generator has to hit.
- Extend `knowledgeCheck`/`project` protos and the user-service repos to read criteria.
- Show criteria in the phase panel as a visible checklist, so the user knows the target before they submit. Removing the guesswork isn't making it easier — it's making the difficulty legitimate.

**Exit criteria:** every seeded phase has criteria. The build UI shows them. Nothing grades against them yet.

**Size:** medium. The schema is a day; the authoring is the real cost.

### What authoring 135 criteria actually taught

Worth recording, because this is the spec Phase 7's generator has to hit:

- **`conceptual` criteria can't be authored yet.** Nothing in the system can grade "do they understand this" from code. Authoring them now would fail every user on a criterion with no path to passing. The enum value is the slot Phase 5's explain-it-back checkpoint fills; knowledge checks carry the comprehension load until then. This is why the split ended up 65 behavioral / 70 structural / 0 conceptual.
- **Deterministic checks are a floor, not a ceiling.** Only 13 of 135 are deterministic. A regex proves a shape is present, not that it's right — anything satisfiable by pasting the pattern into a comment needs a model-judged criterion covering the substance too.
- **The hardest constraint is staying in the phase's lane.** The observed grader failure was wandering into later phases' concerns (commenting on CSS during an HTML-structure phase). Criteria are the fix, but only if each one is scoped to what *this* phase teaches.
- **`behavioral` vs `structural` is the load-bearing distinction.** Code that works by accident passes behavioral and fails structural. That gap is the entire product, and it's why the two must never be collapsed into one score.

---

## Phase 2 — The rigorous gate ✅ DONE

*Deterministic checks + per-criterion evidence grading, verdict computed as a
conjunction. Audit result on the portfolio phase-1 fixture set (7 fixtures × 2
runs): **0% false pass, 0% false fail, 10/10 criterion attribution exact, 7/7
stable verdicts**. Re-run with `npx ts-node tests/phase2.accuracy.test.ts`.*


**Goal:** a verdict you'd bet the product on.

**Why this matters more than anything else:** a false *no* is annoying. **A false *yes* is fatal** — it silently converts Codit into the thing it exists to oppose, and the user gets the feeling of a credential with none of the substance. This is the safety-critical component.

### Design

**Step 1 — Deterministic pre-checks run first.** File exists. File parses. Required pattern present. HTML element query matches. These are cheap, instant, unfakeable, and catch a large share of NOT-MET cases before spending a token.

**Step 2 — Model-judged criteria are graded one at a time, not holistically.** Each gets a focused call and must return **evidence**: a file path, a line range, and the quoted snippet that satisfies it. A criterion with no citable evidence fails. This is the single biggest lever against false positives — a model asked "is this good?" will drift generous; a model required to *point at the line* cannot bluff as easily.

**Step 3 — The verdict is computed, not parsed.** `verdict = all criteria passed`, calculated server-side. The regex disappears entirely.

**Step 4 — Every submission is recorded.**

```prisma
model ReviewSubmission {
  id, user_project_id, phase_number, verdict, model, created_at
  results ReviewCriterionResult[]
}

model ReviewCriterionResult {
  submission_id, criterion_id, passed
  evidence_path, evidence_lines, evidence_quote, reasoning
}
```

This table is not bookkeeping. It's the training data for the AI-generated catalogue, the input to the growth layer, and the only way to measure whether grading actually works.

### Work

- New `ReviewSubmission` RPC in `ai.proto` — separate from `Chat`. Grading is a structured operation returning structured results; overloading a chat stream for it is why the verdict ended up as a regex in the first place.
- Deterministic checker module in user-service.
- Per-criterion evidence-grading in ai-service.
- Server-issued advancement pass on all-pass, consumed by the Phase 0 endpoint.
- Rewrite the review UI: per-criterion pass/fail with the evidence shown, and the hint on failures. Far better feedback than a paragraph.

### Measure it

Ship an audit: sample N submissions, hand-review the verdicts, and track **false-MET rate** as a real number. "Harden the gate" is unfalsifiable without this. Target it explicitly — a false-MET rate above a few percent means the product doesn't work yet.

**Also worth building here:** the transfer test from IDEA.md §9 — can a user solve a *novel* problem in the same domain, unaided, that they never saw during the project? That's the only measurement that separates learning from platform-specific pattern-matching, and the rubric makes it cheap to generate.

**Exit criteria:** verdicts are server-computed from evidenced per-criterion results, every submission is recorded, and false-MET rate is a number you can quote.

**Size:** large. This is the centerpiece.

### What building the audit actually caught

Every one of these was invisible until there was a number:

- **The default model was decommissioned.** `llama-3.3-70b-versatile` 404s. Every AI feature — chat, explain, knowledge-check grading, review — was silently broken. Now `openai/gpt-oss-120b`, overridable via `GROQ_MODEL`.
- **No rate-limit handling anywhere.** Per-criterion grading issues one request per criterion, which bursts straight through a low tokens-per-minute quota. Criteria came back *ungraded*, which the gate correctly refused to treat as failures. Fixed with 429-aware backoff that honours the provider's own stated wait.
- **The evidence check was too strict, and it was mine, not the model's.** Requiring one contiguous verbatim quote rejected correct work whenever a criterion is satisfied by several separate places in a file ("uses header, main, section and footer" is four non-adjacent elements). That alone produced a **100% false-fail rate** while the model was behaving perfectly. Now verified segment-by-segment: every segment must exist, so invented evidence still fails.
- **Criterion wording measurably changes accuracy.** "X rather than Y" is two claims, and graders conflate them. Rewording one such criterion as a single positive claim improved attribution from 3/5 to 4/5 immediately. **34 criteria in `criteria.ts` still use that shape** — worth a pass.

### Known cost — since resolved by measurement

Per-criterion grading resends the file context for each criterion, so N criteria cost roughly N× the tokens. On a tokens-per-minute quota that is also N× the *latency*: the audit measured a **median 18.3s review, worst case 25.6s**.

Batching all criteria into one call was the obvious fix and the obvious risk — the model sees the criteria together and might anchor, judging them as a set rather than independently. Rather than argue about it, both modes were scored against the same ground-truth fixtures over 14 trials:

| | per-criterion | batch |
|---|---|---|
| False pass | 0% | 0% |
| False fail | 0% | 0% |
| Attribution | 10/10 exact | 10/10 exact |
| Median review | 18.3s | **9.3s** |

Identical accuracy, half the latency. Batch is now the default (`GRADING_MODE`), with per-criterion kept as the more conservative fallback if a harder fixture set ever shows it regressing. The evidence requirement — every pass must quote real code, verified against the files — is shared by both modes and unchanged.

---

## Phase 3 — ai-service, three tiers ✅ DONE

*`explain` / `suggest` / `chat` now assemble genuinely different context. The
`graph/` modules are wired into tier 3 as a project map. Verified by 34 offline
graph checks and 10 live tier checks. The headline: tier 3 answered a
reverse-dependency question correctly **with zero tool calls**, in 0.9s.*


**Goal:** stop paying full agentic cost for cheap questions, and give the expensive tier real codebase understanding.

**Why after the gate:** the tiers exist to serve consumers. Tier 3's hardest consumer is per-criterion evidence retrieval. Building the retrieval layer before knowing what it retrieves *for* means guessing at the interface.

### The tiers

| Tier | Trigger | Context needed | Cost target |
|---|---|---|---|
| **1 — Explainer** | Option+click "explain this" | The snippet itself. Nothing more. | Cheapest, fastest, no tools |
| **2 — Suggester** | Wakes when the user seems stuck | Current file + immediate reverse-dependency neighbors + relevant phase goal | Thin slice, ~seconds |
| **3 — Polyfill agent** | Deep questions, debugging, review evidence | Import graph, symbol summaries, memory store, phase criteria | Expensive, justified |

Tier 1 already effectively exists as `mode: "explain"`. Tier 3 is today's tool-calling loop — capped at 4 rounds and 6 file reads at 4000 chars each, finding files by guessing paths.

### Already built, not yet wired

`services/ai-service/src/graph/` contains `importGraph.ts` (regex import extraction + path resolution), `symbolExtractor.ts` (exports, HTML structure, CSS selectors), and `graphCache.ts`. **Nothing imports any of it.** Wiring this is the cheapest available upgrade to tier 3 — it replaces "guess a path, call read_file, hope" with directed lookup.

### Work

- Request-level discriminator: `mode: explain | suggest | polyfill | review`.
- Narrow accessors (`getSymbolSnippet`, `getNeighborSlice`) for tiers 1–2 that bypass the query engine entirely.
- Wire the graph modules into tier 3 context assembly.
- Inject the static WebContainer-constraints memory into tier 3 — the sandbox has no native `fs`/`child_process` and limited npm compatibility, and that isn't derivable from any AST.
- Staleness: mark stale on file change, regenerate lazily on query. Not eagerly.

**Exit criteria:** explain calls are measurably cheaper and faster; tier 3 resolves files by graph lookup rather than guessing.

### Result

Asked "if I change the signature of `addItem`, which other files would I have to update?" with `src/cart.js` open, tier 3 answered:

> The only place that calls `addItem` right now is **src/index.js**… No other files currently depend on that signature.

Correct, including the negative — `format.js` is a dependency *of* cart, not a dependent, and it correctly excluded it. It took **0.9s and zero tool calls**. The old path would have needed `list_files`, then two `read_file` guesses, to reach the same answer — if it got there at all.

The mechanism is just handing it a structural map up front (what each file exports, what imports what) instead of making it discover that through tool rounds. Same tools, far less groping.

### Also settled here

- **`review` mode is gone from `chat`.** Phase 2 moved grading to `GradeCriteria`; a chat reply ending in a verdict line was a holistic judgement dressed as a contract. Removed from the handler, the proto, and the client's `ChatMode`.
- **Sandbox constraints are injected into tier 3.** No amount of reading the user's code reveals that `bcrypt` won't install or that `child_process` can't spawn — so it's asserted rather than inferred. Previously the assistant would confidently suggest things that cannot work in WebContainer.
- **The `graph/` modules had never been executed by anything.** They turned out to be correct — cycles, self-imports, re-exports, dynamic `import()`, bare npm specifiers all handled — but that was luck until there were 34 tests on them.

**Size:** large.

---

## Phase 4 — Engagement I: the moment-to-moment loop ✅ MOSTLY DONE

*Stuck detection and the nudge are built and tested (35 checks on the pure
heuristic). The latency work in this phase is **not** done — see below.*


**Goal:** make the struggle feel supported rather than abandoned.

**Why here:** the stuck-suggester *is* tier 2. It cannot exist before Phase 3. And this is the engagement work that most directly serves the thesis — it reduces the pain of difficulty without reducing the difficulty.

### Work

- **Stuck detection.** Orchestration logic, separate from the tiers: no edits for N minutes, repeated failed runs, same file open with no progress, repeated failed reviews on the same criterion. This heuristic is its own design problem — get it wrong and it's either invisible or a paperclip.
- **The suggester's offer.** Non-blocking, dismissible, and — non-negotiably — still no code. A nudge toward the concept, or the resource, or the criterion they're failing.
- **Faster feedback.** Cut dead air in the build loop: preview boot time, review latency, save round-trips.

**Exit criteria:** the suggester fires when users are actually stuck and is dismissed rather than resented.

### The heuristic, and why it's shaped this way

The whole risk of this feature is the timing, so the judgement lives in one pure, clock-injected module (`client/lib/stuck/stuckDetector.ts`) with 35 tests, most of which assert **silence**. A nudge at the wrong moment costs more trust than a missed nudge saves.

Signals, ordered by specificity — because specificity is what makes a nudge worth receiving:

1. **Same criterion failing across submissions** (2×). The strongest signal available: the user is trying, not converging, and the rubric says exactly what on. This only exists because of Phase 2.
2. **Same knowledge check wrong** (3×). A comprehension gap — the thing this product most wants to catch.
3. **Consecutive failed runs** (3×), reset by any success.
4. **Idle after real activity** (4 min). Deliberately last and weakest: it can't point anywhere specific, and someone who opened the page and walked away is *absent*, not stuck. It never fires unless they've actually edited something first.

Anti-paperclip guards, each independently tested:

- Never within 45s of a keystroke. Someone typing is by definition not stuck, and interrupting mid-edit is the paperclip's signature move.
- Nothing in the first minute after arriving.
- Silent while the assistant is already open, a review is on screen, or the user is reading frozen history.
- **A dismissal is treated as information, not noise** — cooldown triples, and two dismissals mute for the session. There's also a plainly-offered permanent "turn these off" that persists across reloads.
- The same trigger is never offered twice. If the nudge didn't help the first time, repeating it is strictly worse than silence.
- Fixing one criterion clears its streak, so progress never reads as stuckness.

### Not done: the latency work

This phase also listed cutting dead air — preview boot, review latency, save round-trips. None of that is done. Review latency in particular got *worse* in Phase 2, since per-criterion grading is serial by default. That is a real, known regression in felt speed, and it belongs to whoever picks this up next.

**Size:** medium.

---

## Phase 5 — Engagement II: the growth layer ✅ DONE

*Four stats derived from real rows, nine named eras, fog, and the explain-it-back
checkpoint. Verified by 34 pure-logic checks and 22 live checks. The load-bearing
test: **no era is reachable by building alone** — someone with 500 phases and 100
projects but zero demonstrated comprehension stays at era one.*


**Goal:** make the difficulty feel worth choosing.

**Why after the gate:** the whole point is that Build and Understand never merge into one bar. Phase 2 supplies exactly that split — `CriterionKind` distinguishes behavioral from conceptual, and `ReviewCriterionResult` records which kind you actually passed. Building these stats before that data exists means inventing a number, which is how you end up with a progress bar that lies.

### Work

Draws on the existing Observatory / Living Sky spec:

- **Four stats — Build, Understand, Explore, Show — never blended.** Build from passed behavioral/structural criteria and shipped phases. Understand from conceptual criteria and knowledge checks. Explore from resources consumed and codebase navigation. Show from the social layer in Phase 6.
- **Era progression** gated by named milestones, no hidden score. Every era gate requires Understand movement — you cannot ship your way past comprehension.
- **Fog** = unresolved understanding. Clears only on an explain-it-back checkpoint. Lives in the environment, never on the avatar.
- **Absence is a season, not a broken streak.** No shame mechanics — the audience is people who already feel bad about their skills.
- Backend: era gates, checkpoint records, stat derivation from `ReviewCriterionResult` + `KnowledgeCheckAttempt`.

**The design constraint that matters:** a failed review must still move *something*. That's the pressure valve for a gate that says no. It cannot move Build — but discovering you didn't understand something, and then resolving it, is precisely Understand movement.

**Exit criteria:** stats derive from real grading data, not a fabricated score. A NOT MET verdict still produces visible progress.

### The checkpoint finally fills the conceptual gap

Phase 1 left `conceptual` criteria deliberately unauthored because nothing could grade them. This is that mechanism. It asks the user to explain, in their own words, why something *they already built* works — and because the code already exists and already works, reproducing it demonstrates nothing. **Pasted code is an automatic fail**, detected before the model is even asked so a lenient grader can't overrule it.

It works. Asked to generate a question for a real submission, it produced:

> Your navigation links jump to the About and Contact sections when clicked. What in your HTML makes the browser know where to scroll?

Grounded in their actual file, not the topic in the abstract. Pasted markup failed it; a plain-prose explanation of the hash-to-id mechanism passed.

### Design decisions worth keeping

- **`criteriaRecovered` — failed once, passed later — is the most honest signal in the system.** Not "got it right", but "got it wrong, found out why, fixed it". It counts toward Understand, and it's worth more than passing first try is worth Build. An *ungraded* result never counts, so a grader outage can't be farmed.
- **A failed review moves Explore.** That's the pressure valve: a gate that says no and moves nothing is the one that makes people quit.
- **Fog is a property of the work, not the person.** It counts phases shipped but never explained, and building more *increases* it. Only a passed checkpoint clears it. The Cartographer era is the one gate that requires its absence.
- **No decay, no streaks, no time terms anywhere.** Absence genuinely cannot cost you anything — asserted by a test rather than by intention.

### Open question for you

The era names: "Blank Page" and "The Long Approach" come from your spec; the seven between (First Light, Foundations, Apprentice, Debugger, Builder, Cartographer, Practitioner) are mine and are placeholders. The gates are the engineering — the names are yours to replace.

**Size:** large, plus meaningful design work.

---

## Phase 6 — Engagement III: visible proof ✅ DONE

*Publishing requires a passed checkpoint, so a shared artifact is evidence of
understanding rather than of completion. 30 checks, including the privacy
boundary on the unauthenticated read.*


**Goal:** make the achievement legible to other people.

**Why last of the three:** it's the least useful with a small user base, and it depends on there being something credible to show — which means the gate has to be trustworthy first. Sharing an unreliable verdict is worse than sharing nothing.

### Work

- Shareable phase snapshots — you already store the full frozen tree, content-addressed. This is mostly a permissions and presentation problem, not a storage one.
- Public profile, milestone-gated (unlocks at the Builder era rather than on signup).
- The share artifact should show **the criteria passed and the evidence**, not just "completed." That's the difference between a badge and proof.

**Exit criteria:** a user can send someone a link that credibly demonstrates understanding, not just completion.

### The rule that makes it worth anything

**You can only publish a phase you have explained back.** Completing it isn't enough. An artifact saying "this person finished a phase" is a badge, and badges are the credential-without-substance this product argues against. The published page instead says three things: here is what was built, here is *where each requirement was verified in the code*, and here is the author explaining in their own words why it works — an explanation they had to pass before the page could exist.

That also means **Show can only ever be earned through Understand**, which keeps the four stats from collapsing into "activity".

### Privacy, since this is the only endpoint a stranger can call

- Slugs are random and unguessable, never row ids — published work can't be enumerated.
- The public response is a fixed, curated shape. Tested explicitly: no email, no internal project id, no enrollment id, nothing about the author's other work or failed attempts.
- Publishing is per-phase and opt-in, with a separate "explanation only" option that withholds the code.
- Revoking is immediate, and **re-publishing issues a new slug** — a link the author killed stays dead rather than quietly coming back to life.
- A withdrawn link says so instead of 404ing, so a stranger following it learns it was taken down rather than that they typed it wrong.
- Withdrawing lowers Show.

### Known wart

`startCheckpoint` writes its row eagerly because the client needs an id, so opening a checkpoint and abandoning it leaves a `passed: false` row forever. It is completely inert — every stat, the fog calculation and the share eligibility check all count only passed checkpoints — but it is untidy and would matter if abandoned attempts were ever surfaced.

**Size:** medium.

---

## Phase 7 — AI-generated projects

**Goal:** break the hand-authoring ceiling.

**Why it needs everything above:** the generator's output target is a project → phases → criteria → knowledge checks → resources. That target is only well-defined once you've hand-authored enough of it (Phase 1) and learned which criteria actually grade reliably (Phase 2's audit data).

### Work

- Generation pipeline from a user request + skill level → full project structure.
- **Validation gate:** generated criteria must be checkable before publication. Run the generator's own rubric against a reference solution — if the criteria can't distinguish a correct implementation from an incomplete one, they're rejected. Generated content that can't grade itself doesn't ship.
- Resource sourcing and quality scoring — the existing `Resources` model already has `quality_score` and `timestamps`; `resource-service` is still a stub.
- Human review queue for generated projects, at least at first.

**Exit criteria:** a generated project grades as reliably as a hand-authored one, measured with the same false-MET audit.

**Size:** large.

---

## Phase 8 — Bring your own project

**Goal:** meet people at the exact moment of felt pain — *I built this and I don't understand it.*

**Decision made:** stays in WebContainer. That caps the addressable set to frontend/Node projects without native dependencies, and keeps live preview, terminal, and — critically — **the ability to verify the thing actually runs**, which every deterministic check depends on. Remote containers would lift the cap at a cost in infrastructure, money, and security surface that isn't worth paying yet.

### Work

- Repo import into the existing `ProjectFile` model, with an explicit compatibility check up front. Be honest and immediate about what won't run rather than failing deep in the flow.
- Phase inference over an existing codebase — harder than Phase 7's generation, because the structure is given rather than chosen and the phases have to correspond to real weak points.
- Criteria generated against *their* code.
- Knowledge checks generated from *their* code.

**Exit criteria:** a user points at a compatible repo and gets a phase structure that credibly targets what they don't understand.

**Size:** the largest, and the most uncertain.

---

## What not to do yet

- **Don't build the Observatory visuals against invented stats.** The visual work can proceed in parallel, but the numbers must wait for Phase 2 or they'll be dishonest — and a growth layer that lies is worse than none.
- **Don't scale content before the gate is trustworthy.** More projects with an unreliable grader multiplies the failure rather than the value.
- **Don't soften the gate to fix retention.** If retention is poor, the answer is Phases 4–6 (make the difficulty feel worth it), never lowering the bar. That path ends at a worse Codecademy.
- **Don't chase remote containers** until BYO demand is demonstrated with the WebContainer-limited version.

---

## Suggested near-term sequence

1. **Phase 0** — days. Unblocks trusting anything.
2. **Phase 1** — the schema is quick; budget real time for hand-authoring criteria.
3. **Phase 2** — the centerpiece. Ship the false-MET audit *with* it, not after.
4. Then reassess. Phase 3 and Phase 5 are both large, and which comes first should depend on what the Phase 2 audit reveals: if grading is unreliable because the model can't find the right code, go to Phase 3. If grading works and users are dropping off, go to Phases 4–5.

The decision point after Phase 2 is real, and it's better made with data than scheduled now.
