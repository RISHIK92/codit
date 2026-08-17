/**
 * Ground-truth submissions for "Personal Portfolio Website" phase 1.
 *
 * Each fixture states what a competent human reviewer would decide, so grading
 * can be measured rather than eyeballed. The interesting ones are the near
 * misses: a submission that is obviously empty proves very little, while one
 * that looks complete and isn't is exactly where a generous grader waves work
 * through. False passes are the failure that matters — they turn the gate into
 * a rubber stamp — so most fixtures here are designed to bait one.
 *
 * Phase 1 criteria being graded:
 *   1. doctype                      (deterministic)
 *   2. an #about section exists     (deterministic)
 *   3. semantic elements, not all divs
 *   4. form inputs have labels
 *   5. nav links target section IDs on this page
 */

export interface Fixture {
  name: string;
  /** What a careful human reviewer would decide. */
  expectPass: boolean;
  /** 1-based criterion orders a human would mark failed. Used to measure
   * whether the grader fails the RIGHT check, not just the right total. */
  expectFailedOrders?: number[];
  why: string;
  files: Record<string, string>;
}

const STYLE = "body { font-family: system-ui; }";

const COMPLETE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Jane Doe — Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Jane Doe</h1>
    <nav>
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section id="about">
      <h2>About</h2>
      <p>Front-end developer.</p>
    </section>
    <section id="projects">
      <h2>Projects</h2>
      <article><h3>Recipe Tracker</h3><p>Saves recipes.</p></article>
    </section>
    <section id="contact">
      <h2>Contact</h2>
      <form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name">
        <label for="email">Email</label>
        <input type="email" id="email" name="email">
        <label for="msg">Message</label>
        <textarea id="msg" name="msg"></textarea>
        <button type="submit">Send</button>
      </form>
    </section>
  </main>
  <footer><p>&copy; 2026</p></footer>
</body>
</html>`;

export const FIXTURES: Fixture[] = [
  {
    name: "complete",
    expectPass: true,
    why: "Every criterion genuinely satisfied.",
    files: { "index.html": COMPLETE, "style.css": STYLE },
  },
  {
    name: "complete-reordered",
    expectPass: true,
    why: "Same substance, different markup order and naming — a grader keying on surface shape rather than meaning will trip here.",
    files: {
      "index.html": COMPLETE.replace("Jane Doe", "Sam Rivera")
        .replace('id="name"', 'id="fullname"')
        .replace('for="name"', 'for="fullname"'),
      "style.css": STYLE,
    },
  },
  {
    name: "empty",
    expectPass: false,
    expectFailedOrders: [1, 2, 3, 4, 5],
    why: "Bare page — nothing is satisfied.",
    files: { "index.html": "<html><body><h1>Hello</h1></body></html>", "style.css": "" },
  },
  {
    name: "divs-only",
    expectPass: false,
    expectFailedOrders: [3, 4, 5],
    why: "Sections exist but as divs, no labels, nav goes nowhere.",
    files: {
      "index.html": `<!DOCTYPE html>
<html><head><title>P</title></head>
<body>
  <div class="header"><h1>Me</h1>
    <div class="nav"><a href="#">About</a><a href="#">Projects</a><a href="#">Contact</a></div>
  </div>
  <div id="about">About me</div>
  <div id="projects">Projects</div>
  <div id="contact">
    <form><input type="text" placeholder="Name"><input type="email" placeholder="Email">
    <button>Send</button></form>
  </div>
</body></html>`,
      "style.css": STYLE,
    },
  },
  {
    name: "commented-out",
    expectPass: false,
    expectFailedOrders: [3, 4, 5],
    why: "The semantic markup, labels and real nav hrefs exist ONLY inside HTML comments. This is the sharpest false-pass probe: the right strings are all present in the file.",
    files: {
      "index.html": `<!DOCTYPE html>
<html><head><title>P</title></head>
<body>
  <!-- <header><nav><a href="#about">About</a></nav></header> -->
  <!-- <label for="name">Name</label> -->
  <!-- <section id="projects"></section><footer></footer> -->
  <div class="top"><a href="#">About</a></div>
  <div id="about">About</div>
  <div id="contact"><form><input type="text"><button>Send</button></form></div>
</body></html>`,
      "style.css": STYLE,
    },
  },
  {
    name: "no-labels",
    expectPass: false,
    expectFailedOrders: [4],
    why: "Everything correct except form labels — tests whether the grader fails the one criterion that's actually wrong rather than the whole submission.",
    files: {
      "index.html": COMPLETE.replace(/<label[^>]*>.*?<\/label>\s*/g, ""),
      "style.css": STYLE,
    },
  },
  {
    name: "placeholder-nav",
    expectPass: false,
    expectFailedOrders: [5],
    why: "Everything correct except nav hrefs are all '#' — the single most common real-world version of this mistake.",
    files: {
      "index.html": COMPLETE.replace(/href="#(about|projects|contact)"/g, 'href="#"'),
      "style.css": STYLE,
    },
  },
];
