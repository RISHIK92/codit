/**
 * Import-graph and symbol-extraction tests — pure functions, no services.
 *
 * These modules existed for a while without being imported by anything, so
 * nothing had ever exercised them. Now that tier 3's context is built from
 * them, a wrong edge or a missed export becomes the assistant confidently
 * describing a project that isn't there.
 *
 *   npx ts-node tests/phase3.graph.test.ts
 */
import { buildImportGraph } from "../src/graph/importGraph";
import {
  extractExports,
  extractHtmlStructure,
  buildProjectSymbolSummary,
} from "../src/graph/symbolExtractor";
import { renderNeighbourSlice, WEBCONTAINER_CONSTRAINTS } from "../src/context/tierContext";

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

console.log("\n1. Import graph");
{
  const files = [
    { filePath: "src/index.js", content: `import { render } from "./ui/render.js";\nimport util from "./util";` },
    { filePath: "src/ui/render.js", content: `import { fmt } from "../util";\nexport function render(){}` },
    { filePath: "src/util.js", content: `export const fmt = x => x;\nexport function other(){}` },
    { filePath: "src/orphan.js", content: `export const nobodyUsesThis = 1;` },
  ];
  const g = buildImportGraph(files);

  check(
    "resolves a relative import with an extension",
    (g.imports.get("src/index.js") ?? []).includes("src/ui/render.js"),
    JSON.stringify(g.imports.get("src/index.js")),
  );
  check(
    "resolves an extensionless import",
    (g.imports.get("src/index.js") ?? []).includes("src/util.js"),
  );
  check(
    "resolves a parent-relative import",
    (g.imports.get("src/ui/render.js") ?? []).includes("src/util.js"),
  );
  check(
    "builds reverse edges — util is imported by two files",
    (g.importers.get("src/util.js") ?? []).length === 2,
    JSON.stringify(g.importers.get("src/util.js")),
  );
  check(
    "a file nothing imports has no importers",
    (g.importers.get("src/orphan.js") ?? []).length === 0,
  );

  // Bare specifiers resolve outside the project; treating them as edges would
  // invent files that don't exist.
  const withNpm = buildImportGraph([
    { filePath: "a.js", content: `import React from "react";\nimport x from "./b";` },
    { filePath: "b.js", content: "export default 1;" },
  ]);
  check(
    "npm packages are not graph edges",
    (withNpm.imports.get("a.js") ?? []).join() === "b.js",
    JSON.stringify(withNpm.imports.get("a.js")),
  );

  const unresolvable = buildImportGraph([
    { filePath: "a.js", content: `import x from "./does-not-exist";` },
  ]);
  check(
    "an import of a nonexistent file produces no edge",
    (unresolvable.imports.get("a.js") ?? []).length === 0,
  );

  const cyclic = buildImportGraph([
    { filePath: "a.js", content: `import b from "./b";` },
    { filePath: "b.js", content: `import a from "./a";` },
  ]);
  check(
    "a cycle doesn't hang or duplicate",
    (cyclic.imports.get("a.js") ?? []).join() === "b.js" &&
      (cyclic.imports.get("b.js") ?? []).join() === "a.js",
  );

  const selfImport = buildImportGraph([
    { filePath: "a.js", content: `import a from "./a";` },
  ]);
  check("a self-import is dropped", (selfImport.imports.get("a.js") ?? []).length === 0);

  const reexport = buildImportGraph([
    { filePath: "index.js", content: `export { a } from "./a";` },
    { filePath: "a.js", content: "export const a = 1;" },
  ]);
  check("re-exports count as edges", (reexport.imports.get("index.js") ?? []).join() === "a.js");

  const dynamic = buildImportGraph([
    { filePath: "a.js", content: `const m = await import("./b");\nconst c = require("./c");` },
    { filePath: "b.js", content: "" },
    { filePath: "c.js", content: "" },
  ]);
  check(
    "dynamic import() and require() are both edges",
    (dynamic.imports.get("a.js") ?? []).sort().join() === "b.js,c.js",
    JSON.stringify(dynamic.imports.get("a.js")),
  );
}

console.log("\n2. Export extraction");
{
  const src = `
export const a = 1;
export function b() {}
export class C {}
export default function d() {}
const notExported = 2;
`;
  const ex = extractExports(src);
  check("finds exported const", ex.some((e) => e.includes("a")));
  check("finds exported function", ex.some((e) => e.includes("b")));
  check("finds exported class", ex.some((e) => e.includes("C")));
  check("does not report a non-exported binding", !ex.some((e) => e.includes("notExported")));
}

console.log("\n3. HTML structure extraction");
{
  const full = extractHtmlStructure(
    `<!DOCTYPE html><html><head><title>T</title></head><body><header></header><section></section></body></html>`,
  );
  check("reports doctype present", /doctype: present/i.test(full));
  check("reports structural tags present", /<body>: present/.test(full));
  check("tallies content elements", /header/.test(full) && /section/.test(full));

  const bare = extractHtmlStructure("<html><body></body></html>");
  check("reports a missing doctype as MISSING", /doctype: MISSING/i.test(bare));
  check("reports a missing title as MISSING", /<title>: MISSING/.test(bare));
}

console.log("\n4. Project map");
{
  const summary = buildProjectSymbolSummary([
    { filePath: "index.html", content: "<!DOCTYPE html><html><body><button>x</button></body></html>" },
    { filePath: "style.css", content: ".card { display: flex; color: red; }" },
    { filePath: "src/app.js", content: `import "./util";\nexport function boot(){}` },
    { filePath: "src/util.js", content: "export const u = 1;" },
    { filePath: "notes.txt", content: "hello" },
  ]);

  check("includes every file path", ["index.html", "style.css", "src/app.js", "notes.txt"].every((p) => summary.includes(p)));
  check("summarises HTML structurally", /doctype/i.test(summary));
  check("lists CSS selectors", summary.includes(".card"));
  check("keeps layout-relevant CSS properties", /display/.test(summary));
  check("lists JS exports", /boot/.test(summary));

  // The map is orientation, not content — including raw file bodies would
  // defeat the point of having a map at all.
  check(
    "does not inline raw file contents",
    !summary.includes("<button>x</button>") && !summary.includes("color: red"),
  );
}

console.log("\n5. Neighbour rendering");
{
  check(
    "renders nothing when there are no neighbours",
    renderNeighbourSlice({ imports: [], importers: [], contents: new Map() }) === "",
  );

  const rendered = renderNeighbourSlice({
    imports: ["src/util.js"],
    importers: ["src/index.js"],
    contents: new Map([["src/util.js", "export const u = 1;"]]),
  });
  check("names reverse dependencies first", rendered.indexOf("src/index.js") < rendered.indexOf("src/util.js"));
  check("explains why reverse dependencies matter", /affects these/i.test(rendered));
  check("inlines neighbour contents", rendered.includes("export const u = 1;"));
}

console.log("\n6. Sandbox constraints");
{
  // These are facts no amount of reading the user's code reveals, so they have
  // to be asserted rather than inferred.
  check("names the WebContainer runtime", /WebContainer/.test(WEBCONTAINER_CONSTRAINTS));
  check("rules out native modules", /native module/i.test(WEBCONTAINER_CONSTRAINTS));
  check("rules out child_process", /child_process/.test(WEBCONTAINER_CONSTRAINTS));
  check(
    "names packages that will not install",
    /bcrypt|sharp|sqlite3/.test(WEBCONTAINER_CONSTRAINTS),
  );
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
