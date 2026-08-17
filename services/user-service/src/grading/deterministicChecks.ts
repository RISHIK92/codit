/**
 * Deterministic criterion checks — decided in code, with no model involved.
 *
 * These run before anything is sent to a grader. They are instant, free, and
 * cannot be talked out of a verdict, which makes them the right first pass: a
 * submission missing its entry file doesn't need an LLM to notice.
 *
 * They are a floor, never a ceiling. Matching a pattern proves a shape is
 * present, not that it's right — `<link rel="stylesheet">` inside an HTML
 * comment still matches. Any criterion whose substance matters beyond the shape
 * is authored as model_judged as well; see the note in criteria.ts.
 *
 * Everything here fails closed. An unknown check kind, an unparseable config,
 * or a regex that won't compile returns "not passed" with a reason, rather than
 * throwing (which would fail the whole submission) or passing (which would let
 * a broken rubric silently wave work through).
 */

export interface CheckSubject {
  /** file path -> contents. Paths as stored: no leading slash. */
  files: Map<string, string>;
}

export interface CheckOutcome {
  passed: boolean;
  /** Shown to the user when it failed; recorded either way. */
  reasoning: string;
  evidencePath?: string;
  evidenceLines?: string;
  evidenceQuote?: string;
}

/** Paths are inconsistent across the codebase — the client's file tree uses
 * bare ids ("index.html") while some callers pass "/index.html". Normalise
 * rather than trusting either. */
function normalise(path: string): string {
  return path.replace(/^\/+/, "").trim();
}

function lookup(files: Map<string, string>, path: string): string | null {
  const want = normalise(path);
  const direct = files.get(want);
  if (direct !== undefined) return direct;
  for (const [k, v] of files) {
    if (normalise(k) === want) return v;
  }
  return null;
}

/** 1-based line number of a character offset, for evidence. */
function lineOf(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

function compile(pattern: string, flags?: string): RegExp | null {
  try {
    return new RegExp(pattern, flags ?? "m");
  } catch {
    return null;
  }
}

// ── Minimal HTML element matching ───────────────────────────────────────────
//
// Supports exactly the selector grammar the authored rubric uses: one or more
// tag names separated by whitespace, meaning "descendant of". No classes, ids,
// attributes or combinators — an unsupported selector fails closed rather than
// being silently reinterpreted as something weaker.
//
// A real parser would be better and is worth adding when the grammar grows; for
// tag-descendant chains a tag scanner is enough and avoids a dependency.

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;

function stripUncounted(html: string): string {
  // Comments and script/style bodies shouldn't satisfy a structural claim —
  // an element mentioned in a comment isn't on the page. Replaced with spaces
  // of equal length so character offsets stay meaningful for evidence.
  const blank = (m: string) => " ".repeat(m.length);
  return html
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, blank)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, blank);
}

function isSupportedSelector(selector: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9-]*(\s+[a-zA-Z][a-zA-Z0-9-]*)*$/.test(selector.trim());
}

/** Offsets of elements matching a descendant chain of tag names. */
function findElements(html: string, selector: string): number[] {
  const chain = selector.trim().toLowerCase().split(/\s+/);
  const target = chain[chain.length - 1];
  const ancestors = chain.slice(0, -1);

  const source = stripUncounted(html);
  const stack: string[] = [];
  const hits: number[] = [];

  TAG_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TAG_RE.exec(source)) !== null) {
    const raw = match[0];
    const tag = match[1].toLowerCase();
    const selfClosing = match[2] === "/" || VOID_ELEMENTS.has(tag);
    const isClosing = raw.startsWith("</");

    if (isClosing) {
      // Unwind to the matching open tag; tolerates unclosed elements rather
      // than derailing on them.
      const at = stack.lastIndexOf(tag);
      if (at !== -1) stack.length = at;
      continue;
    }

    if (tag === target) {
      // Every ancestor in the chain must appear in the open stack, in order.
      let cursor = 0;
      for (const a of ancestors) {
        const found = stack.indexOf(a, cursor);
        if (found === -1) {
          cursor = -1;
          break;
        }
        cursor = found + 1;
      }
      if (ancestors.length === 0 || cursor !== -1) hits.push(match.index);
    }

    if (!selfClosing) stack.push(tag);
  }

  return hits;
}

// ── The checks ──────────────────────────────────────────────────────────────

export type CheckConfig = Record<string, any>;

export function runDeterministicCheck(
  config: CheckConfig | null | undefined,
  subject: CheckSubject,
): CheckOutcome {
  if (!config || typeof config !== "object" || typeof config.check !== "string") {
    return { passed: false, reasoning: "This check isn't configured correctly — reported as unmet so it can be fixed rather than silently passing." };
  }

  const path = typeof config.path === "string" ? config.path : "";
  const content = path ? lookup(subject.files, path) : null;

  switch (config.check) {
    case "file_exists": {
      if (content === null) {
        return { passed: false, reasoning: `${path} doesn't exist yet.` };
      }
      if (content.trim() === "") {
        return { passed: false, reasoning: `${path} exists but is empty.` };
      }
      return { passed: true, reasoning: `${path} exists.`, evidencePath: path };
    }

    case "file_matches": {
      if (content === null) {
        return { passed: false, reasoning: `${path} doesn't exist yet.` };
      }
      const re = compile(config.pattern, config.flags);
      if (!re) {
        return { passed: false, reasoning: "This check's pattern is invalid — reported as unmet so it gets fixed." };
      }
      const m = re.exec(content);
      if (!m) {
        return { passed: false, reasoning: `Nothing in ${path} matches what this check is looking for.` };
      }
      const line = lineOf(content, m.index);
      return {
        passed: true,
        reasoning: `Found in ${path}.`,
        evidencePath: path,
        evidenceLines: String(line),
        evidenceQuote: m[0].slice(0, 200),
      };
    }

    case "file_lacks": {
      if (content === null) {
        // Nothing there to contain the thing — vacuously satisfied, but say so
        // rather than implying the file was checked.
        return { passed: true, reasoning: `${path} doesn't exist, so nothing to flag.` };
      }
      const re = compile(config.pattern, config.flags);
      if (!re) {
        return { passed: false, reasoning: "This check's pattern is invalid — reported as unmet so it gets fixed." };
      }
      const m = re.exec(content);
      if (m) {
        return {
          passed: false,
          reasoning: `${path} still contains the thing this phase asks you to move away from.`,
          evidencePath: path,
          evidenceLines: String(lineOf(content, m.index)),
          evidenceQuote: m[0].slice(0, 200),
        };
      }
      return { passed: true, reasoning: `${path} is clear.`, evidencePath: path };
    }

    case "html_element": {
      if (content === null) {
        return { passed: false, reasoning: `${path} doesn't exist yet.` };
      }
      const selector = typeof config.selector === "string" ? config.selector : "";
      if (!isSupportedSelector(selector)) {
        return { passed: false, reasoning: "This check uses a selector the checker doesn't support — reported as unmet so it gets fixed." };
      }
      const min = typeof config.min === "number" ? config.min : 1;
      const hits = findElements(content, selector);
      if (hits.length < min) {
        return {
          passed: false,
          reasoning:
            min === 1
              ? `No <${selector.split(/\s+/).pop()}> found in ${path}${selector.includes(" ") ? ` inside ${selector.split(/\s+/).slice(0, -1).join(" ")}` : ""}.`
              : `Found ${hits.length} of the ${min} expected in ${path}.`,
        };
      }
      return {
        passed: true,
        reasoning: `Found ${hits.length} in ${path}.`,
        evidencePath: path,
        evidenceLines: String(lineOf(content, hits[0])),
        evidenceQuote: content.slice(hits[0], hits[0] + 120).split("\n")[0],
      };
    }

    default:
      return {
        passed: false,
        reasoning: `Unknown check type "${config.check}" — reported as unmet so it gets fixed rather than passing silently.`,
      };
  }
}
