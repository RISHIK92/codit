/**
 * Stuck detection — decides WHEN the assistant offers an unprompted nudge.
 *
 * The suggester tier can produce a good nudge; the hard part is choosing the
 * moment. Get this wrong in one direction and it never fires, so the feature
 * doesn't exist. Get it wrong in the other and it becomes a paperclip: an
 * interruption that arrives while you're mid-thought, says something obvious,
 * and trains you to dismiss it on sight. The second failure is worse, because
 * it also poisons the times the nudge would have been genuinely useful.
 *
 * So the bias throughout is: stay quiet unless there is *evidence* of being
 * stuck. Idleness alone is weak evidence — people read documentation, think,
 * and get coffee. Repeatedly failing the same specific thing is strong evidence,
 * because it means the user is trying and not converging.
 *
 * Deliberately pure and clock-injected. The heuristic is the whole risk of this
 * feature, so it's kept out of React entirely and tested directly.
 */

// ── Tunables ────────────────────────────────────────────────────────────────

/** Never interrupt within this long of a keystroke. Someone actively typing is
 * by definition not stuck, and interrupting mid-edit is the paperclip's
 * signature move. */
export const TYPING_GRACE_MS = 45_000;

/** Silence after any suggestion, accepted or not. */
export const COOLDOWN_MS = 6 * 60_000;

/** Idle time that counts as possibly-stuck — only ever after real activity. */
export const IDLE_MS = 4 * 60_000;

/** Nothing fires this soon after arriving. Someone who just opened the page
 * hasn't had a chance to get stuck, and being greeted by a nudge reads as
 * spam rather than help. */
export const WARMUP_MS = 60_000;

/** A dismissal is a signal, not noise: the user just told us the timing or the
 * content was wrong. Back off hard rather than trying again shortly. */
export const DISMISS_BACKOFF_MULTIPLIER = 3;

/** Two dismissals in a session means stop asking. Continuing past this is how
 * a helpful feature becomes a resented one. */
export const DISMISSALS_BEFORE_MUTE = 2;

/** Same criterion failing across this many consecutive review submissions. */
export const CRITERION_FAILURE_THRESHOLD = 2;

/** Same knowledge check answered wrong this many times. */
export const CHECK_FAILURE_THRESHOLD = 3;

/** Consecutive failed runs with no successful run in between. */
export const RUN_FAILURE_THRESHOLD = 3;

// ── Events and state ────────────────────────────────────────────────────────

export type StuckEvent =
  | { type: "edit" }
  | { type: "run_failed" }
  | { type: "run_succeeded" }
  | { type: "review_failed"; failedCriterionIds: string[] }
  | { type: "review_passed" }
  | { type: "check_failed"; checkId: string }
  | { type: "check_passed"; checkId: string }
  | { type: "suggestion_shown"; key: string }
  | { type: "suggestion_dismissed" }
  | { type: "muted" };

export interface StuckState {
  startedAt: number;
  lastEditAt: number | null;
  lastSuggestionAt: number | null;
  dismissals: number;
  muted: boolean;
  consecutiveRunFailures: number;
  /** criterionId -> consecutive review submissions it has failed. */
  criterionFailures: Record<string, number>;
  /** checkId -> times answered wrong. */
  checkFailures: Record<string, number>;
  /** Trigger keys already offered. A nudge about the same thing twice is
   * strictly worse than silence — the user heard it and it didn't help. */
  offeredKeys: string[];
}

export function createState(now: number): StuckState {
  return {
    startedAt: now,
    lastEditAt: null,
    lastSuggestionAt: null,
    dismissals: 0,
    muted: false,
    consecutiveRunFailures: 0,
    criterionFailures: {},
    checkFailures: {},
    offeredKeys: [],
  };
}

export function reduce(state: StuckState, event: StuckEvent, now: number): StuckState {
  switch (event.type) {
    case "edit":
      return { ...state, lastEditAt: now };

    case "run_failed":
      return { ...state, consecutiveRunFailures: state.consecutiveRunFailures + 1 };

    case "run_succeeded":
      return { ...state, consecutiveRunFailures: 0 };

    case "review_failed": {
      const next: Record<string, number> = {};
      // Only criteria that failed *this* submission carry their streak forward.
      // A criterion the user fixed shouldn't keep counting toward being stuck —
      // that's progress, and treating it as failure would nudge about something
      // already solved.
      for (const id of event.failedCriterionIds) {
        next[id] = (state.criterionFailures[id] ?? 0) + 1;
      }
      return { ...state, criterionFailures: next };
    }

    case "review_passed":
      return { ...state, criterionFailures: {} };

    case "check_failed":
      return {
        ...state,
        checkFailures: {
          ...state.checkFailures,
          [event.checkId]: (state.checkFailures[event.checkId] ?? 0) + 1,
        },
      };

    case "check_passed": {
      const { [event.checkId]: _removed, ...rest } = state.checkFailures;
      return { ...state, checkFailures: rest };
    }

    case "suggestion_shown":
      return {
        ...state,
        lastSuggestionAt: now,
        offeredKeys: state.offeredKeys.includes(event.key)
          ? state.offeredKeys
          : [...state.offeredKeys, event.key],
      };

    case "suggestion_dismissed": {
      const dismissals = state.dismissals + 1;
      return {
        ...state,
        dismissals,
        muted: state.muted || dismissals >= DISMISSALS_BEFORE_MUTE,
      };
    }

    case "muted":
      return { ...state, muted: true };

    default:
      return state;
  }
}

// ── Evaluation ──────────────────────────────────────────────────────────────

export type StuckReason =
  | "repeated_criterion"
  | "repeated_check"
  | "repeated_run_failure"
  | "idle_after_activity";

export interface StuckTrigger {
  reason: StuckReason;
  /** Identifies the specific thing, so the same nudge isn't offered twice. */
  key: string;
  /** What the suggester should be pointed at. Empty for idle. */
  subjectId?: string;
}

/** Current cooldown, lengthened once the user has dismissed something. */
export function currentCooldown(state: StuckState): number {
  return state.dismissals > 0
    ? COOLDOWN_MS * DISMISS_BACKOFF_MULTIPLIER * state.dismissals
    : COOLDOWN_MS;
}

/**
 * Whether a nudge may be offered at all, ignoring whether there's a reason to.
 * Separated from reason-finding so the guards can be reasoned about — and
 * tested — independently of the signals.
 */
export function isSilenced(state: StuckState, now: number): boolean {
  if (state.muted) return true;
  if (now - state.startedAt < WARMUP_MS) return true;
  if (state.lastEditAt !== null && now - state.lastEditAt < TYPING_GRACE_MS) return true;
  if (state.lastSuggestionAt !== null && now - state.lastSuggestionAt < currentCooldown(state)) {
    return true;
  }
  return false;
}

/**
 * The strongest available reason to think the user is stuck, or null.
 *
 * Ordered by specificity, because specificity is what makes a nudge worth
 * receiving. "You've failed this same criterion twice" can point somewhere
 * exact; "you've been quiet a while" cannot, and is the weakest thing here for
 * that reason — it exists only as a last resort, and only after the user has
 * actually done something first.
 */
export function evaluate(state: StuckState, now: number): StuckTrigger | null {
  if (isSilenced(state, now)) return null;

  const unoffered = (key: string) => !state.offeredKeys.includes(key);

  // 1. Same criterion failing across submissions — the user is trying and not
  //    converging, and we know exactly what on.
  const stuckCriterion = Object.entries(state.criterionFailures)
    .filter(([, n]) => n >= CRITERION_FAILURE_THRESHOLD)
    .sort((a, b) => b[1] - a[1])[0];
  if (stuckCriterion) {
    const key = `criterion:${stuckCriterion[0]}`;
    if (unoffered(key)) {
      return { reason: "repeated_criterion", key, subjectId: stuckCriterion[0] };
    }
  }

  // 2. Same knowledge check answered wrong repeatedly — a comprehension gap,
  //    which is the thing this product most wants to catch.
  const stuckCheck = Object.entries(state.checkFailures)
    .filter(([, n]) => n >= CHECK_FAILURE_THRESHOLD)
    .sort((a, b) => b[1] - a[1])[0];
  if (stuckCheck) {
    const key = `check:${stuckCheck[0]}`;
    if (unoffered(key)) {
      return { reason: "repeated_check", key, subjectId: stuckCheck[0] };
    }
  }

  // 3. Runs failing over and over with no success in between.
  if (state.consecutiveRunFailures >= RUN_FAILURE_THRESHOLD) {
    const key = `runs:${state.consecutiveRunFailures}`;
    if (unoffered(key)) {
      return { reason: "repeated_run_failure", key };
    }
  }

  // 4. Idle, but only after real activity. Someone who opened the page and
  //    walked away isn't stuck — they're absent, and nudging an empty chair
  //    is what makes the feature feel like surveillance.
  if (state.lastEditAt !== null && now - state.lastEditAt >= IDLE_MS) {
    const key = `idle:${Math.floor(state.lastEditAt / IDLE_MS)}`;
    if (unoffered(key)) {
      return { reason: "idle_after_activity", key };
    }
  }

  return null;
}

/** Framing sent to the suggester, so the nudge answers the right question. */
export function promptFor(trigger: StuckTrigger, criterionText?: string): string {
  switch (trigger.reason) {
    case "repeated_criterion":
      return criterionText
        ? `I keep failing this review check and I'm not sure why: "${criterionText}". What should I look at?`
        : "I keep failing the same review check. What should I look at?";
    case "repeated_check":
      return "I keep getting this knowledge check wrong. What concept am I missing?";
    case "repeated_run_failure":
      return "My code keeps failing when I run it. What should I check?";
    case "idle_after_activity":
      return "I'm not sure what to do next here. What should I be looking at?";
  }
}
