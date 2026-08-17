/**
 * Authored phase criteria — the rubric each phase submission is graded against.
 *
 * This is catalogue content, not code, and it is deliberately hand-written. The
 * point of writing these by hand first is to learn what a criterion has to look
 * like to actually grade well; that answer becomes the spec a generator has to
 * hit later, for AI-authored projects and for inferring phases over a user's own
 * repository. Generating them before knowing what "good" means would be
 * generating against an unknown target.
 *
 * ── What makes a criterion good ──────────────────────────────────────────────
 *
 *   Specific enough that two people would agree whether it's met.
 *     bad:  "the navigation works"
 *     good: "nav links use href="#id" pointing at section IDs on the same page"
 *
 *   Written in the user's language, so it reads as a checklist of what to build
 *   rather than as grader internals.
 *
 *   About one thing. A criterion that fails for two unrelated reasons can't tell
 *   the user which one to fix.
 *
 *   Scoped to THIS phase. The single most common grading failure observed is a
 *   grader wandering into later phases' concerns — commenting on CSS during an
 *   HTML-structure phase. Criteria are what keep it in its lane.
 *
 * ── On `kind` ────────────────────────────────────────────────────────────────
 *
 *   behavioral  — the built thing does what it should.
 *   structural  — it's built the way this phase teaches. The distinction that
 *                 matters: code that works by accident satisfies behavioral and
 *                 fails structural, which is exactly the gap this product exists
 *                 to catch.
 *   conceptual  — they can articulate why. NOT authored here yet, deliberately:
 *                 nothing in the codebase can grade "do they understand this",
 *                 so authoring them now would fail every user on a criterion
 *                 with no path to passing. The enum value is the slot the
 *                 explain-it-back checkpoint fills later; knowledge checks carry
 *                 the comprehension load until then.
 *
 * ── On `check_type` ──────────────────────────────────────────────────────────
 *
 *   deterministic — decided in code, no model. Used only where the check is
 *                   genuinely unambiguous. These are cheap, instant and can't be
 *                   talked out of a verdict, so they run first and catch a large
 *                   share of failures before a token is spent.
 *   model_judged  — needs reading and judgement. Graded one criterion at a time,
 *                   and must cite the file and lines that satisfy it.
 *
 * Deterministic checks are a floor, never a ceiling: matching a pattern proves
 * the shape is present, not that it's right. Anything that could be satisfied by
 * pasting the pattern in a comment must also have a model_judged criterion
 * covering the substance.
 *
 * File paths are stored without a leading slash ("index.html", "src/App.tsx").
 * The Phase 2 checker should normalise both forms rather than relying on this.
 */

export type CheckConfig =
  /** The file exists and is non-empty. */
  | { check: "file_exists"; path: string }
  /** The file's contents match `pattern` (JS regex source, `flags` default "m"). */
  | { check: "file_matches"; path: string; pattern: string; flags?: string }
  /** The file's contents do NOT match — for "stopped doing the naive thing" criteria. */
  | { check: "file_lacks"; path: string; pattern: string; flags?: string }
  /** An HTML file contains at least `min` (default 1) elements matching a CSS selector. */
  | { check: "html_element"; path: string; selector: string; min?: number };

export interface CriterionSeed {
  order: number;
  text: string;
  kind: "behavioral" | "structural" | "conceptual";
  check_type: "deterministic" | "model_judged";
  check_config?: CheckConfig;
  /** Shown on failure. Names the concept or what to look up — never the code. */
  hint?: string;
}

type ProjectCriteria = Record<number, CriterionSeed[]>;

const d = (
  order: number,
  text: string,
  kind: CriterionSeed["kind"],
  check_config: CheckConfig,
  hint?: string,
): CriterionSeed => ({ order, text, kind, check_type: "deterministic", check_config, hint });

const m = (
  order: number,
  text: string,
  kind: CriterionSeed["kind"],
  hint?: string,
): CriterionSeed => ({ order, text, kind, check_type: "model_judged", hint });

// ─── Personal Portfolio Website (beginner — HTML/CSS/JS) ─────────────────────

const portfolio: ProjectCriteria = {
  1: [
    d(1, "index.html exists and starts with a <!DOCTYPE html> declaration", "structural",
      { check: "file_matches", path: "index.html", pattern: "^\\s*<!DOCTYPE html>", flags: "i" },
      "Every HTML document opens by declaring what it is. Look up the doctype declaration."),
    d(2, "The page has header, about, projects, and contact sections", "behavioral",
      { check: "file_matches", path: "index.html", pattern: "id=[\"'](about)[\"']", flags: "i" },
      "Each major area of the page needs to be its own section element with an id you can link to."),
    m(3, "Sections use semantic elements (header, main, section, footer) rather than a page built entirely from divs", "structural",
      "A div says nothing about what it contains. HTML has elements that describe their own role — look up HTML5 semantic elements."),
    m(4, "The contact form's inputs each have an associated label", "structural",
      "A placeholder is not a label. Look up how the label element is tied to an input, and why a screen reader needs that connection."),
    m(5, "Navigation links point at the section IDs on this page, not at empty or placeholder hrefs", "behavioral",
      "An href of # goes nowhere. To jump to an element on the same page the href has to reference that element's id."),
  ],
  2: [
    d(1, "style.css exists and is linked from index.html", "structural",
      { check: "file_matches", path: "index.html", pattern: "<link[^>]+stylesheet", flags: "i" },
      "A CSS file sitting next to your HTML does nothing on its own — the browser has to be told to load it."),
    m(2, "Layout uses Flexbox or Grid rather than floats or absolute positioning for page structure", "structural",
      "Floats were a workaround from before CSS had real layout tools. This phase is about the tools that replaced them."),
    d(3, "At least one media query adapts the layout to smaller screens", "behavioral",
      { check: "file_matches", path: "style.css", pattern: "@media", flags: "i" },
      "Responsive means the layout changes at certain widths. Look up media queries."),
    m(4, "Repeated values (colours, spacing) are defined once as CSS custom properties rather than retyped", "structural",
      "If you change your accent colour, how many places do you have to edit? Look up CSS custom properties."),
    m(5, "The page is readable and unbroken at mobile widths — no horizontal scrolling or overlapping text", "behavioral",
      "Narrow the browser right down. Anything that spills sideways is usually a fixed width that should be a max-width."),
  ],
  3: [
    d(1, "script.js exists and is loaded from index.html", "structural",
      { check: "file_matches", path: "index.html", pattern: "<script[^>]+src=", flags: "i" },
      "The browser needs a script tag pointing at your JS file."),
    m(2, "The dark-mode toggle switches the theme when clicked", "behavioral",
      "You need to listen for a click, then change something the CSS reacts to — usually a class or attribute on a root element."),
    m(3, "The chosen theme survives a page refresh", "behavioral",
      "JavaScript variables reset on reload. Something has to write the choice somewhere the browser keeps between visits."),
    m(4, "The contact form validates input and prevents submission when invalid, showing the user what's wrong", "behavioral",
      "Look at the submit event and how to stop its default behaviour, then how to tell the user which field is the problem."),
    m(5, "Event handling is attached in JavaScript rather than through inline onclick attributes in the HTML", "structural",
      "Mixing behaviour into markup is the pattern this phase moves away from. Look up addEventListener."),
  ],
};

// ─── Interactive Quiz App (beginner — HTML/CSS/JS) ───────────────────────────

const quiz: ProjectCriteria = {
  1: [
    d(1, "index.html exists with a doctype, html, head, and body", "structural",
      { check: "file_matches", path: "index.html", pattern: "^\\s*<!DOCTYPE html>", flags: "i" },
      "There's a fixed skeleton every HTML page starts with. Look up basic HTML document structure."),
    d(2, "The page has a title in the head", "structural",
      { check: "html_element", path: "index.html", selector: "head title" },
      "The title element is what names the browser tab."),
    d(3, "The body renders a heading, a paragraph, and a button", "behavioral",
      { check: "html_element", path: "index.html", selector: "button" },
      "Three specific elements — a heading, a paragraph of text, and a clickable button."),
    m(4, "Tags are properly nested and every element that needs closing is closed", "structural",
      "Elements have to close in the reverse order they opened. Browsers guess when you get it wrong, which hides the mistake."),
  ],
  2: [
    d(1, "A CSS file or style block styles the page", "structural",
      { check: "file_exists", path: "style.css" },
      "Styles belong in their own file, linked from the head."),
    d(2, "The four answer options are grouped in a fieldset with a legend", "structural",
      { check: "html_element", path: "index.html", selector: "fieldset legend" },
      "A group of related choices has a specific pair of HTML elements for exactly this. Look up fieldset and legend."),
    m(3, "The quiz card is centred on the page using Flexbox", "behavioral",
      "Centring both horizontally and vertically is a two-property job in Flexbox. Look up justify-content and align-items."),
    m(4, "One question and four answer options are visible and readable", "behavioral",
      "This phase is static — the content is hardcoded. It just has to look like a quiz card."),
  ],
  3: [
    d(1, "A JavaScript file holds the questions as an array of objects", "structural",
      { check: "file_matches", path: "script.js", pattern: "\\[\\s*\\{", flags: "s" },
      "Your data should be a list, where each entry is an object holding the question and its options."),
    m(2, "The question text and options on screen come from the JavaScript data, not from hardcoded HTML", "behavioral",
      "Change a question in your array — the page should change. If it doesn't, the HTML is still the source of truth."),
    m(3, "Elements are found with querySelector/querySelectorAll rather than assumed to exist", "structural",
      "You need a reference to an element before you can change it. Look up document.querySelector."),
    m(4, "Text is inserted with textContent rather than innerHTML where no markup is needed", "structural",
      "One of these interprets what you give it as HTML. Consider what happens when a question contains a < character."),
  ],
  4: [
    m(1, "Clicking an answer option visibly marks it as selected", "behavioral",
      "You need a click listener, and a CSS class that changes appearance. Look up classList."),
    m(2, "Only one option can be selected at a time — selecting a second clears the first", "behavioral",
      "Before marking the new choice, something has to un-mark the old one."),
    m(3, "Click handling uses one listener on the container rather than a separate listener per option", "structural",
      "Attaching a listener to every option doesn't scale and breaks for elements added later. Look up event delegation and event.target."),
    m(4, "Selection state is reflected by toggling classes, not by writing inline styles", "structural",
      "Appearance belongs in CSS. JavaScript should decide which class applies, not what colour it is."),
  ],
  5: [
    m(1, "A Next button moves through every question in order and stops at the last one", "behavioral",
      "You're tracking a position in an array. Consider what should happen when that index reaches the end."),
    m(2, "The score increases exactly once per correct answer, even if the option is clicked repeatedly", "behavioral",
      "This is the bug this phase is really about. Ask what stops a second click on an already-scored question."),
    m(3, "The screen is redrawn from the current state rather than patched piece by piece on each click", "structural",
      "Keep the truth in variables and have one function draw the screen from them. Patching the DOM directly is how state and display drift apart."),
    m(4, "Question data and current position are held in variables, not read back out of the DOM", "structural",
      "Reading the answer back out of the page makes the page the source of truth. It shouldn't be."),
  ],
  6: [
    m(1, "A results screen appears after the final question, showing score and percentage", "behavioral",
      "Showing and hiding sections is the same conditional-rendering idea as before, just at screen level."),
    m(2, "A best score persists across a full page refresh", "behavioral",
      "localStorage survives reloads. Remember it stores strings only."),
    m(3, "The stored best score only updates when the new score actually beats it", "behavioral",
      "Read the old value first and compare before writing. Watch out for the very first run when nothing is stored yet."),
    m(4, "Restart returns to question one with score and selection fully reset", "behavioral",
      "Everything you track has to go back to its starting value — it's easy to miss one and leak state into the next run."),
  ],
};

// ─── To-Do List App (beginner — React/TS/Tailwind) ───────────────────────────

const todo: ProjectCriteria = {
  1: [
    d(1, "The project has a package.json with React as a dependency", "structural",
      { check: "file_matches", path: "package.json", pattern: "\"react\"" },
      "Scaffold with Vite's React + TypeScript template."),
    m(2, "A reusable TaskItem component renders a single task and is used for every task in the list", "structural",
      "If you wrote the same markup three times, that's the component you haven't extracted yet."),
    m(3, "TaskItem's props are typed with a TypeScript interface", "structural",
      "Describe the shape of what the component receives. Look up typing props with an interface."),
    m(4, "At least three tasks render, produced with .map() over an array rather than written out one by one", "behavioral",
      "The list comes from data. Look up rendering a list with .map()."),
  ],
  2: [
    m(1, "Typing in the input and clicking Add appends the task to the visible list", "behavioral",
      "The input's value and the list both live in state. Look up useState."),
    m(2, "The input clears after a task is added", "behavioral",
      "If the input is controlled, clearing it means setting its state back to empty."),
    m(3, "The input is controlled — its value comes from state and changes through onChange", "structural",
      "A controlled input has React as the source of truth for its contents."),
    m(4, "Adding a task creates a new array rather than pushing into the existing one", "structural",
      "Mutating state in place means React can't tell anything changed. Look up immutable array updates and the spread syntax."),
  ],
  3: [
    m(1, "A task can be marked complete and shows a visual strikethrough", "behavioral",
      "Completion is a property on the task, and the styling follows from it."),
    m(2, "A task can be deleted and disappears from the list", "behavioral",
      "Removing an item means producing a new array without it. Look up .filter()."),
    m(3, "Toggling one task leaves the others untouched, using .map() to replace only the matching item", "structural",
      "Map over the array and return a changed object only for the one that matched."),
    m(4, "Each rendered task has a stable, unique key that isn't the array index", "structural",
      "Indexes shift when items are removed, which makes React reuse the wrong element. Each task needs its own id."),
    m(5, "The tasks array lives in the parent and children receive it plus callbacks via props", "structural",
      "Two components needing the same data means it belongs to their parent. Look up lifting state up."),
  ],
  4: [
    m(1, "Tasks are still there after a full page refresh", "behavioral",
      "Something has to write to localStorage on change and read it back on load."),
    m(2, "Saving happens in a useEffect that runs when the tasks change", "structural",
      "Look up useEffect and how its dependency array decides when it runs."),
    m(3, "Tasks are serialised with JSON.stringify and parsed on the way back in", "structural",
      "localStorage stores strings only — an array has to be converted both ways."),
    m(4, "Initial state is read from storage once at start-up, not on every render", "structural",
      "Reading storage in the render body runs it constantly. Look up lazy initial state in useState."),
    m(5, "A first-time visitor with nothing stored gets an empty list rather than a crash", "behavioral",
      "Parsing null is the failure here. Consider what getItem returns when the key was never set."),
  ],
  5: [
    m(1, "All / Active / Completed tabs each show the correct subset of tasks", "behavioral",
      "Filtering is a view concern applied to the one list you already have."),
    m(2, "The filtered list is computed during render from tasks plus the active filter, not stored in its own state", "structural",
      "This is the core lesson of the phase. A second copy in state can disagree with the first — derive it instead."),
    m(3, "An empty state message appears when no tasks match the current filter", "behavioral",
      "An empty screen looks broken. Say why it's empty."),
    m(4, "The active tab is visually distinguishable from the others", "behavioral",
      "Conditional classes based on which filter is selected."),
  ],
};

// ─── REST API with JWT Authentication (intermediate — Node/Express/Prisma) ───

const restApi: ProjectCriteria = {
  1: [
    d(1, "package.json exists with express as a dependency", "structural",
      { check: "file_matches", path: "package.json", pattern: "\"express\"" }),
    m(2, "The server starts and listens on port 3000", "behavioral",
      "Look at app.listen and how the port is supplied."),
    m(3, "A Prisma schema defines User and Post models with a relation between them", "structural",
      "A post belongs to a user — that relationship is declared in the schema, not just implied."),
    m(4, "Configuration comes from environment variables rather than values written into the source", "structural",
      "Connection strings and secrets differ per environment and must not be committed."),
    m(5, "A migration exists so the schema can be recreated from scratch", "structural",
      "Pushing changes straight to a database leaves no record of how it got that shape."),
  ],
  2: [
    m(1, "Register creates a user and rejects a duplicate email", "behavioral",
      "The uniqueness has to be enforced, and the failure has to come back as a sensible status code."),
    m(2, "Passwords are stored hashed, never in plain text or reversibly encrypted", "structural",
      "Hashing is one-way by design. Look up bcrypt and why a salt matters."),
    m(3, "Login returns an access token and a refresh token on correct credentials", "behavioral",
      "Two tokens with different lifetimes and different jobs."),
    m(4, "Login fails with the same generic message whether the email or the password was wrong", "structural",
      "Distinguishing them tells an attacker which emails are registered."),
    m(5, "The refresh endpoint issues a new access token from a valid refresh token", "behavioral",
      "Short-lived access tokens are the reason refresh exists."),
  ],
  3: [
    m(1, "Creating, updating and deleting posts requires a valid token", "behavioral",
      "Authentication middleware runs before the handler and stops the request when there's no valid token."),
    m(2, "Listing posts works without authentication", "behavioral",
      "Not every route is protected — the middleware has to be applied selectively."),
    m(3, "A user cannot modify or delete another user's post", "behavioral",
      "Being logged in is not the same as being the owner. This is the check people forget."),
    m(4, "Auth is applied as middleware rather than repeated inside each handler", "structural",
      "A check copy-pasted into every route is one you'll eventually forget to paste."),
    m(5, "Errors are handled centrally and return appropriate status codes rather than leaking stack traces", "structural",
      "Look up Express error-handling middleware and its four-argument signature."),
    m(6, "The list endpoint is paginated instead of returning every row", "behavioral",
      "Returning an unbounded table gets slower forever."),
  ],
  4: [
    m(1, "Tests cover the auth flow and the protected routes, including the failure cases", "behavioral",
      "Tests that only cover success don't test the security."),
    m(2, "Tests run against the real HTTP layer rather than calling handlers directly", "structural",
      "Look up Supertest — middleware and routing only get exercised through real requests."),
    m(3, "Coverage is at least 80%", "behavioral",
      "Your test runner can report this."),
    m(4, "Tests leave no shared state behind — each run starts from a known database state", "structural",
      "Tests that pass only in a particular order aren't testing anything reliable."),
    m(5, "/api-docs serves interactive API documentation generated from an OpenAPI definition", "behavioral",
      "Look up Swagger UI Express."),
  ],
};

// ─── Real-Time Chat Application (intermediate — Next.js/Socket.IO/Redis) ─────

const chat: ProjectCriteria = {
  1: [
    m(1, "A message sent by a client is received by the server and delivered back to clients in real time", "behavioral",
      "Both ends emit and both ends listen — a one-directional setup only looks like it works."),
    m(2, "Socket.IO is attached to a custom Next.js server rather than a standard API route", "structural",
      "Serverless request/response handlers can't hold a long-lived connection open."),
    m(3, "Connection and disconnection are both handled, with cleanup on disconnect", "structural",
      "Sockets that are never cleaned up accumulate for as long as the process runs."),
    m(4, "Event names are defined once and shared rather than retyped as string literals on both sides", "structural",
      "A typo in an event name fails silently — nothing errors, the message just never arrives."),
  ],
  2: [
    m(1, "Users can join a named room and only receive messages from that room", "behavioral",
      "Look up Socket.IO rooms and emitting to a room rather than broadcasting to everyone."),
    m(2, "A typing indicator appears for other users within about 300ms of a keystroke", "behavioral",
      "Fast enough to feel live without emitting on literally every keypress."),
    m(3, "Typing events are debounced rather than emitted on every keystroke", "structural",
      "One event per character is a lot of traffic for information that changes meaning slowly."),
    m(4, "Presence is tracked so the room shows who is currently connected", "behavioral",
      "Presence has to be updated on both join and disconnect, or it drifts."),
    m(5, "Typing indicators use volatile emits, since a dropped one doesn't matter", "structural",
      "Some events aren't worth buffering and redelivering. Look up volatile events."),
  ],
  3: [
    m(1, "Joining a room loads the last 50 messages", "behavioral",
      "Read the most recent range rather than everything."),
    m(2, "Messages are stored in a Redis sorted set keyed by room, ordered by timestamp", "structural",
      "Look up ZADD and ZRANGE and why the score gives you ordering for free."),
    m(3, "History is capped rather than growing without limit", "structural",
      "Unbounded keys eventually become the outage. Look up trimming and TTL."),
    m(4, "The Redis connection is created once and reused, not opened per message", "structural",
      "Connection setup per operation is a large hidden cost."),
    m(5, "No relational database is used for message history", "structural",
      "This phase is specifically about the trade-off Redis makes."),
  ],
  4: [
    m(1, "Two server instances serve the same room and clients on either see each other's messages", "behavioral",
      "In-memory state doesn't cross processes — the instances need something between them."),
    m(2, "The Socket.IO Redis adapter is configured on every instance", "structural",
      "Look up the Redis adapter and how it forwards emits between processes."),
    m(3, "A health check endpoint reports whether the instance is ready to serve", "behavioral",
      "A load balancer needs a way to know."),
    m(4, "Presence stays correct when a user's connection lands on a different instance", "behavioral",
      "Per-process presence maps disagree once there's more than one process."),
  ],
};

// ─── Distributed Task Queue System (advanced — Go/gRPC/Redis) ────────────────

const taskQueue: ProjectCriteria = {
  1: [
    m(1, "A producer enqueues 1000 jobs and a consumer group processes all of them", "behavioral",
      "Look up Redis Streams and consumer groups."),
    m(2, "Jobs are acknowledged after successful processing, not on receipt", "structural",
      "Acknowledging on receipt loses work whenever a worker dies mid-job. Look up XACK."),
    m(3, "Jobs left unacknowledged by a dead consumer can be found and reclaimed", "behavioral",
      "Look up XPENDING and claiming stale entries."),
    m(4, "The consumer applies backpressure rather than reading faster than it can process", "structural",
      "Unbounded reading moves the queue into memory, which just relocates the problem."),
  ],
  2: [
    m(1, "Jobs are processed concurrently by a pool of workers", "behavioral",
      "Goroutines plus a channel to feed them."),
    m(2, "Pool size is configurable rather than hardcoded", "structural",
      "The right parallelism depends on the workload and the machine."),
    m(3, "Shutdown is graceful — in-flight jobs finish and nothing is dropped", "behavioral",
      "Look up signal handling, context cancellation, and WaitGroup."),
    m(4, "Cancellation propagates through context rather than via a shared boolean", "structural",
      "Context is Go's built-in mechanism for exactly this, and it composes."),
    m(5, "Errors from workers are collected rather than silently swallowed", "structural",
      "A goroutine that fails quietly is indistinguishable from one that succeeded. Look up errgroup."),
  ],
  3: [
    m(1, "A gRPC service accepts job submissions from clients", "behavioral",
      "Define the service in a .proto file and generate from it."),
    m(2, "Clients receive live status updates over a server-streaming RPC", "behavioral",
      "The stream stays open and the server sends as things change."),
    m(3, "The proto definition is the source of truth and Go types are generated, not hand-written", "structural",
      "Hand-written types drift from the contract."),
    m(4, "RPCs honour deadlines and stop working when the client has gone away", "structural",
      "Work continuing after the caller has given up is wasted."),
    m(5, "Cross-cutting concerns like logging live in interceptors rather than in each handler", "structural",
      "Look up gRPC interceptors."),
  ],
  4: [
    m(1, "Queue depth, throughput, and p99 latency are exported as metrics", "behavioral",
      "Latency needs a histogram — an average hides exactly the tail you care about."),
    m(2, "A Grafana dashboard displays those metrics live", "behavioral",
      "Prometheus scrapes, Grafana draws."),
    m(3, "Logs are structured rather than formatted strings", "structural",
      "Look up slog. Grep stops working at volume; fields don't."),
    m(4, "docker compose brings the whole system up with health checks that gate startup order", "behavioral",
      "A service starting before its dependency is ready is the classic compose failure."),
    m(5, "A request can be followed across services by a trace or correlation id", "structural",
      "Without one, a distributed failure is many disconnected logs."),
  ],
};

// ─── ML-Powered Code Review Bot (advanced — Python/FastAPI/LangChain) ────────

const reviewBot: ProjectCriteria = {
  1: [
    m(1, "The server receives and logs pull-request opened and synchronised webhook events", "behavioral",
      "Subscribe to the right events and confirm the payloads arrive."),
    m(2, "Webhook signatures are verified before the payload is trusted", "structural",
      "The endpoint is public — anyone can post to it. Look up HMAC-SHA256 verification of the GitHub signature header."),
    m(3, "Signature comparison is constant-time rather than a plain equality check", "structural",
      "Ordinary string comparison leaks timing information. Look up compare_digest."),
    m(4, "The webhook responds quickly and does slow work outside the request", "structural",
      "GitHub times these out — the handler should acknowledge and hand off."),
  ],
  2: [
    m(1, "Diffs are parsed into structured per-file objects rather than passed around as raw text", "structural",
      "The unified diff format carries file paths, hunks and line numbers — that structure is worth keeping."),
    m(2, "Line numbers survive parsing so a comment can be attached to the right line", "behavioral",
      "Hunk headers are what let you map a diff position back to a file line."),
    m(3, "Large diffs are chunked to stay within a token budget instead of being truncated blindly", "structural",
      "Cutting mid-function produces confident nonsense."),
    m(4, "Binary files, lockfiles and generated output are skipped", "behavioral",
      "Reviewing a lockfile wastes tokens and produces noise."),
  ],
  3: [
    m(1, "The chain returns review comments with file, line, severity and message", "behavioral",
      "A shape you can act on, not prose you have to re-parse."),
    m(2, "Output is validated against a schema rather than parsed out of free text", "structural",
      "Look up structured output with Pydantic — regexing model output fails eventually and silently."),
    m(3, "Prompts are templates with typed inputs, not strings concatenated at the call site", "structural",
      "Look up ChatPromptTemplate."),
    m(4, "A malformed model response is handled rather than crashing the request", "behavioral",
      "It will happen. Decide what should occur when it does."),
  ],
  4: [
    m(1, "The bot posts inline comments on the correct lines of the pull request", "behavioral",
      "Review comments need the commit id and the position within the diff."),
    m(2, "Past reviews are embedded and retrieved by similarity to inform new ones", "behavioral",
      "Look up pgvector and similarity search."),
    m(3, "The bot doesn't repeat a comment it has already left on unchanged code", "behavioral",
      "This is what makes it usable rather than annoying."),
    m(4, "API rate limits are respected, with retry and backoff on failure", "structural",
      "Retrying immediately turns a limit into an outage."),
  ],
};

export const PHASE_CRITERIA: Record<string, ProjectCriteria> = {
  "Personal Portfolio Website": portfolio,
  "Interactive Quiz App": quiz,
  "To-Do List App": todo,
  "REST API with JWT Authentication": restApi,
  "Real-Time Chat Application": chat,
  "Distributed Task Queue System": taskQueue,
  "ML-Powered Code Review Bot": reviewBot,
};
