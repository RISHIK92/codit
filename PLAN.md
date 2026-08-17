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

## Phase 2 — The rigorous gate

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

---

## Phase 3 — ai-service, three tiers

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

**Size:** large.

---

## Phase 4 — Engagement I: the moment-to-moment loop

**Goal:** make the struggle feel supported rather than abandoned.

**Why here:** the stuck-suggester *is* tier 2. It cannot exist before Phase 3. And this is the engagement work that most directly serves the thesis — it reduces the pain of difficulty without reducing the difficulty.

### Work

- **Stuck detection.** Orchestration logic, separate from the tiers: no edits for N minutes, repeated failed runs, same file open with no progress, repeated failed reviews on the same criterion. This heuristic is its own design problem — get it wrong and it's either invisible or a paperclip.
- **The suggester's offer.** Non-blocking, dismissible, and — non-negotiably — still no code. A nudge toward the concept, or the resource, or the criterion they're failing.
- **Faster feedback.** Cut dead air in the build loop: preview boot time, review latency, save round-trips.

**Exit criteria:** the suggester fires when users are actually stuck and is dismissed rather than resented.

**Size:** medium.

---

## Phase 5 — Engagement II: the growth layer

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

**Size:** large, plus meaningful design work.

---

## Phase 6 — Engagement III: visible proof

**Goal:** make the achievement legible to other people.

**Why last of the three:** it's the least useful with a small user base, and it depends on there being something credible to show — which means the gate has to be trustworthy first. Sharing an unreliable verdict is worse than sharing nothing.

### Work

- Shareable phase snapshots — you already store the full frozen tree, content-addressed. This is mostly a permissions and presentation problem, not a storage one.
- Public profile, milestone-gated (unlocks at the Builder era rather than on signup).
- The share artifact should show **the criteria passed and the evidence**, not just "completed." That's the difference between a badge and proof.

**Exit criteria:** a user can send someone a link that credibly demonstrates understanding, not just completion.

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
