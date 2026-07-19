// ─── Layer 1.5: exported-symbol extraction ────────────────────────────────
// Same lexer-free, regex-based philosophy as importGraph.ts. Used to build a
// compact structural summary of a project's code — file, exports, imports —
// as context for the "review" chat mode, instead of forwarding raw file
// contents to the LLM.

import { buildImportGraph, ProjectFileInput } from "./importGraph";

const EXPORT_PATTERNS: { re: RegExp; render: (m: RegExpExecArray) => string }[] = [
  // export function foo(a, b) / export default function foo(a, b)
  {
    re: /export\s+(?:default\s+)?function\s*(\w*)\s*\(([^)]*)\)/g,
    render: (m) => `${m[1] || "default"}(${compactParams(m[2])})`,
  },
  // export const foo = (a, b) => ... / export const foo = async (a) => ...
  {
    re: /export\s+const\s+(\w+)\s*(?::[^=(]+)?=\s*(?:async\s*)?\(([^)]*)\)\s*=>/g,
    render: (m) => `${m[1]}(${compactParams(m[2])})`,
  },
  // export class Foo
  {
    re: /export\s+(?:default\s+)?class\s+(\w+)/g,
    render: (m) => `class ${m[1]}`,
  },
  // export interface Foo / export type Foo
  {
    re: /export\s+(interface|type)\s+(\w+)/g,
    render: (m) => `${m[1]} ${m[2]}`,
  },
  // export const FOO = <value, not a function> — catch-all for plain const/let/var exports
  {
    re: /export\s+(?:const|let|var)\s+(\w+)\s*(?::[^=]+)?=(?!\s*(?:async\s*)?\()/g,
    render: (m) => m[1],
  },
  // export default Identifier;
  {
    re: /export\s+default\s+(\w+)\s*;/g,
    render: (m) => `default (${m[1]})`,
  },
];

function compactParams(raw: string): string {
  // Collapse whitespace/newlines and drop default-value expressions so the
  // summary stays short — this is a structural map, not a type reference.
  return raw
    .replace(/\s+/g, " ")
    .replace(/=\s*[^,)]+/g, "")
    .trim();
}

export function extractExports(content: string): string[] {
  const found = new Set<string>();
  for (const { re, render } of EXPORT_PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content))) {
      found.add(render(m));
    }
  }
  return [...found];
}

// ── HTML structure extraction ──────────────────────────────────────────────
// A pure-HTML project has no exports/imports at all — without this, the
// review context for an .html file was just its bare path, which gives the
// reviewer nothing to actually judge. This produces a structural fact list
// (doctype/html/head/body presence, and a tally of content elements) instead
// of the raw markup.

const STRUCTURAL_TAGS = ["html", "head", "body", "title"];
const NON_CONTENT_TAGS = new Set([
  ...STRUCTURAL_TAGS,
  "meta",
  "link",
  "style",
  "script",
]);

export function extractHtmlStructure(content: string): string {
  const hasDoctype = /<!DOCTYPE\s+html/i.test(content);
  const tagCounts = new Map<string, number>();

  const tagPattern = /<([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = tagPattern.exec(content))) {
    const tag = m[1].toLowerCase();
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }

  const parts: string[] = [];
  parts.push(hasDoctype ? "doctype: present" : "doctype: MISSING");
  parts.push(
    STRUCTURAL_TAGS.map(
      (tag) => `<${tag}>: ${tagCounts.has(tag) ? "present" : "MISSING"}`,
    ).join(", "),
  );

  const contentTags = [...tagCounts.entries()]
    .filter(([tag]) => !NON_CONTENT_TAGS.has(tag))
    .map(([tag, count]) => `${tag}×${count}`);
  parts.push(
    contentTags.length
      ? `content elements: ${contentTags.join(", ")}`
      : "content elements: (none found)",
  );

  return parts.join("; ");
}

// ── CSS selector + layout-fact extraction ──────────────────────────────────
// A bare selector list ("body, .card, .options") tells a reviewer THAT
// something is styled but not HOW — it can't judge "is this centered?" or
// "does this use Flexbox?" from selector names alone. So alongside each
// selector we also surface a curated set of layout-relevant property:value
// pairs (not the whole declaration block) — enough to verify concrete claims
// like centering or column layout without dumping the full stylesheet.

const LAYOUT_PROPERTIES = new Set([
  "display",
  "position",
  "justify-content",
  "align-items",
  "align-content",
  "flex-direction",
  "flex-wrap",
  "gap",
  "text-align",
  "top",
  "left",
  "right",
  "bottom",
  "transform",
  "margin",
  "width",
  "max-width",
  "min-height",
  "height",
]);

export function extractCssSelectors(content: string): string[] {
  return extractCssRules(content).map((r) => r.selector);
}

interface CssRule {
  selector: string;
  layoutDeclarations: string[];
}

function extractCssRules(content: string): CssRule[] {
  const withoutComments = content.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: CssRule[] = [];
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = rulePattern.exec(withoutComments))) {
    const selector = m[1].trim().replace(/\s+/g, " ");
    if (!selector || selector.startsWith("@")) continue;

    const layoutDeclarations: string[] = [];
    const declPattern = /([\w-]+)\s*:\s*([^;]+);?/g;
    let d: RegExpExecArray | null;
    while ((d = declPattern.exec(m[2]))) {
      const prop = d[1].trim().toLowerCase();
      if (LAYOUT_PROPERTIES.has(prop)) {
        layoutDeclarations.push(`${prop}: ${d[2].trim()}`);
      }
    }
    rules.push({ selector, layoutDeclarations });
  }
  return rules;
}

const PARSEABLE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs"];
const HTML_EXTENSIONS = [".html", ".htm"];
const CSS_EXTENSIONS = [".css"];

/**
 * Compact per-file structural summary, in place of raw file contents:
 * exports + local imports for JS/TS, doctype/element tally for HTML,
 * selector list for CSS. Anything else is listed by path only.
 */
export function buildProjectSymbolSummary(files: ProjectFileInput[]): string {
  const graph = buildImportGraph(files);
  const lines: string[] = [];

  for (const file of files) {
    if (HTML_EXTENSIONS.some((ext) => file.filePath.endsWith(ext))) {
      lines.push(file.filePath);
      lines.push(`  structure: ${extractHtmlStructure(file.content)}`);
      continue;
    }

    if (CSS_EXTENSIONS.some((ext) => file.filePath.endsWith(ext))) {
      const rules = extractCssRules(file.content);
      lines.push(file.filePath);
      if (!rules.length) {
        lines.push("  rules: (none found)");
      } else {
        for (const rule of rules) {
          lines.push(
            rule.layoutDeclarations.length
              ? `  ${rule.selector} { ${rule.layoutDeclarations.join("; ")} }`
              : `  ${rule.selector} { (no layout-relevant properties) }`,
          );
        }
      }
      continue;
    }

    const isParseable = PARSEABLE_EXTENSIONS.some((ext) =>
      file.filePath.endsWith(ext),
    );
    if (!isParseable) {
      lines.push(file.filePath);
      continue;
    }

    const exports = extractExports(file.content);
    const imports = graph.imports.get(file.filePath) ?? [];

    lines.push(file.filePath);
    if (exports.length) lines.push(`  exports: ${exports.join(", ")}`);
    if (imports.length) lines.push(`  imports: ${imports.join(", ")}`);
  }

  return lines.join("\n");
}
