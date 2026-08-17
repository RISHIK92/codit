/**
 * Deterministic checker unit tests — no database, no services, no model.
 *
 *   npx ts-node tests/phase2.deterministic.test.ts
 */
import { runDeterministicCheck, type CheckSubject } from "../src/grading/deterministicChecks";

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

const subject = (files: Record<string, string>): CheckSubject => ({
  files: new Map(Object.entries(files)),
});

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>My Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header><h1>Hi</h1></header>
  <main>
    <section id="about"><h2>About</h2></section>
    <fieldset>
      <legend>Pick one</legend>
      <button>A</button>
    </fieldset>
  </main>
</body>
</html>`;

console.log("\n1. file_exists");
{
  const s = subject({ "index.html": HTML, "empty.css": "   " });
  check("passes for a real file", runDeterministicCheck({ check: "file_exists", path: "index.html" }, s).passed);
  check("fails for a missing file", !runDeterministicCheck({ check: "file_exists", path: "nope.js" }, s).passed);
  check("fails for an empty file", !runDeterministicCheck({ check: "file_exists", path: "empty.css" }, s).passed);
  check(
    "tolerates a leading slash in the config path",
    runDeterministicCheck({ check: "file_exists", path: "/index.html" }, s).passed,
  );
}

console.log("\n2. file_matches");
{
  const s = subject({ "index.html": HTML });
  const ok = runDeterministicCheck(
    { check: "file_matches", path: "index.html", pattern: "^\\s*<!DOCTYPE html>", flags: "i" },
    s,
  );
  check("passes and reports a line number", ok.passed && ok.evidenceLines === "1", ok.evidenceLines);
  check("carries the matched text as evidence", (ok.evidenceQuote ?? "").includes("DOCTYPE"));
  check(
    "fails when nothing matches",
    !runDeterministicCheck(
      { check: "file_matches", path: "index.html", pattern: "<canvas" },
      s,
    ).passed,
  );
  check(
    "fails closed on an invalid regex rather than throwing",
    !runDeterministicCheck(
      { check: "file_matches", path: "index.html", pattern: "([unclosed" },
      s,
    ).passed,
  );
  check(
    "fails when the file is missing",
    !runDeterministicCheck({ check: "file_matches", path: "gone.html", pattern: "a" }, s).passed,
  );
}

console.log("\n3. html_element");
{
  const s = subject({ "index.html": HTML });
  check("finds a bare tag", runDeterministicCheck({ check: "html_element", path: "index.html", selector: "button" }, s).passed);
  check(
    "finds a descendant chain",
    runDeterministicCheck({ check: "html_element", path: "index.html", selector: "head title" }, s).passed,
  );
  check(
    "finds a nested descendant chain",
    runDeterministicCheck({ check: "html_element", path: "index.html", selector: "fieldset legend" }, s).passed,
  );
  check(
    "rejects a descendant chain that isn't actually nested",
    !runDeterministicCheck({ check: "html_element", path: "index.html", selector: "header title" }, s).passed,
  );
  check(
    "respects min count",
    !runDeterministicCheck({ check: "html_element", path: "index.html", selector: "button", min: 3 }, s).passed,
  );
  check(
    "fails closed on an unsupported selector rather than guessing",
    !runDeterministicCheck({ check: "html_element", path: "index.html", selector: ".btn > span" }, s).passed,
  );

  // The whole point of a structural check is that the element is really there.
  const commented = subject({
    "index.html": "<html><body><!-- <button>fake</button> --></body></html>",
  });
  check(
    "an element only inside a comment does not count",
    !runDeterministicCheck({ check: "html_element", path: "index.html", selector: "button" }, commented).passed,
  );

  const inScript = subject({
    "index.html": `<html><body><script>document.write("<button>x</button>")</script></body></html>`,
  });
  check(
    "an element only inside a script string does not count",
    !runDeterministicCheck({ check: "html_element", path: "index.html", selector: "button" }, inScript).passed,
  );

  const unclosed = subject({
    "index.html": "<html><body><div><section id=x><button>ok</button></body></html>",
  });
  check(
    "survives unclosed tags without derailing",
    runDeterministicCheck({ check: "html_element", path: "index.html", selector: "button" }, unclosed).passed,
  );

  const voidEl = subject({
    "index.html": "<html><head><meta charset=utf-8><title>T</title></head></html>",
  });
  check(
    "void elements don't corrupt the nesting stack",
    runDeterministicCheck({ check: "html_element", path: "index.html", selector: "head title" }, voidEl).passed,
  );
}

console.log("\n4. file_lacks");
{
  const s = subject({ "script.js": "element.onclick = f", "clean.js": "addEventListener('click', f)" });
  check(
    "fails when the discouraged pattern is present",
    !runDeterministicCheck({ check: "file_lacks", path: "script.js", pattern: "onclick" }, s).passed,
  );
  check(
    "passes when it isn't",
    runDeterministicCheck({ check: "file_lacks", path: "clean.js", pattern: "onclick" }, s).passed,
  );
  check(
    "passes vacuously when the file doesn't exist",
    runDeterministicCheck({ check: "file_lacks", path: "absent.js", pattern: "onclick" }, s).passed,
  );
}

console.log("\n5. Failing closed on bad configuration");
{
  const s = subject({ "index.html": HTML });
  check("null config fails", !runDeterministicCheck(null, s).passed);
  check("config with no check kind fails", !runDeterministicCheck({ path: "index.html" } as any, s).passed);
  check("unknown check kind fails", !runDeterministicCheck({ check: "telepathy", path: "index.html" } as any, s).passed);
  check(
    "every failure explains itself",
    [
      runDeterministicCheck(null, s),
      runDeterministicCheck({ check: "telepathy" } as any, s),
      runDeterministicCheck({ check: "file_exists", path: "x" }, s),
    ].every((o) => o.reasoning.trim().length > 10),
  );
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
