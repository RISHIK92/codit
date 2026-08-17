# Codit — The Idea

*A working document. Written to be read cold, argued with, and torn apart.*

---

## 1. The one-liner

> **Codit is a coding platform where an AI mentor can read your entire codebase and refuses to write a single line of it — and where you can't move forward until you've proven you understood what you built.**

It looks like an IDE. It behaves like a demanding teacher.

---

## 2. The problem

### The short version

A generation of new developers can produce working code they cannot explain.

### The longer version

Two things used to be roughly the same skill:

1. Getting code to work.
2. Understanding why it works.

If you were learning to program in 2015, you couldn't do (1) without doing at least some of (2). The struggle was the curriculum. You read the docs because nothing else would unblock you.

AI assistants severed that link. Now you can do (1) completely without (2). You describe what you want, you get working code, you ship it. The feedback loop that used to *force* comprehension now routes around it entirely.

This produces a specific and increasingly common person:

- They have shipped real things.
- Their GitHub looks credible.
- They cannot debug their own project when it breaks in a way the AI doesn't immediately fix.
- They cannot answer "why did you structure it this way?" in an interview.
- They cannot make an architectural decision without asking a model.
- **And they usually know this about themselves.** That's the important part — the pain is felt, not theoretical.

### Why existing options don't fix it

| Option | What it gets right | Why it doesn't solve this |
|---|---|---|
| **Tutorials / YouTube** | Free, plentiful, well-produced | You follow along and feel competent. Nothing verifies you could do it alone. "Tutorial hell" is the folk name for exactly this failure. |
| **Codecademy, freeCodeCamp** | Structured, sequenced, interactive | Exercises are gap-fill against a fixed answer. You learn to satisfy a checker, not to build a system. |
| **Bootcamps** | Real projects, real accountability, real humans | Expensive, months long, and the AI-era version of the problem shows up *inside* them too — students now prompt their way through the projects. |
| **Cursor / Copilot / Claude Code** | Genuinely excellent at producing code | They are optimized to make (1) frictionless. That is the correct goal for a professional and the exact opposite of what a learner needs. |
| **LeetCode** | Rigorously verifies a skill | Verifies algorithmic puzzle-solving, which is not building software. |

Notice the gap. **Nothing on that list verifies that a person understood a real project they actually built.** The tutorial platforms verify tiny exercises. The AI tools verify nothing and are designed not to. Bootcamps verify with humans, which is why they cost thousands.

That verification gap is the product.

---

## 3. The core idea

Codit is built on one inversion:

> **Most tools optimize for the code you produce. Codit optimizes for the understanding you can demonstrate.**

Three mechanisms enforce it.

### Mechanism 1 — The AI that won't write your code

Codit gives you an AI assistant with full visibility into your project. It can list your files, read any of them, and answer questions about your actual code, not generic code.

And it is hard-blocked from writing code for you. Not discouraged. Blocked.

This isn't a soft instruction in a prompt — soft instructions get rationalized away by models the instant a code block would be "the helpful thing to do." The rule is absolute and exception-free: no code blocks, ever, for any reason, not even a one-liner, not even to illustrate syntax.

So instead of this:

> **You:** my CSS isn't applying
>
> **Normal AI:** Add this to your `<head>`:
> ```html
> <link rel="stylesheet" href="style.css">
> ```

You get this:

> **You:** my CSS isn't applying
>
> **Codit:** I read your `index.html` — there's no reference to `style.css` anywhere in it. A browser doesn't automatically find CSS files sitting next to your HTML; you have to link them explicitly. You'll want a `<link>` tag inside your `<head>`, and it needs two attributes: one declaring the relationship (that this is a stylesheet), and one giving the path to the file. Look up `<link>` on MDN if you need the exact attribute names.

You still get unstuck. You just have to type it yourself, which means you have to know what you're typing.

### Mechanism 2 — Advancement is gated on demonstrated understanding

Projects are broken into ordered **phases**. Each phase has a goal, the concepts it teaches, curated learning resources, and a set of knowledge checks.

To move to the next phase, two things must happen:

1. **You answer the phase's knowledge checks.** These aren't multiple-choice trivia only — they include code-completion and debugging questions, and they're graded for *equivalent understanding*, not exact string match. Different variable names are fine. Stating only the crucial change instead of reproducing a whole snippet is fine.

2. **You submit for review, and an AI grader reads your actual project files** — not your description of them, not the one file you have open — and judges whether the phase goal is genuinely met. It's explicitly instructed to catch gaps rather than rubber-stamp, and to be specific about what's missing.

If it says no, it tells you what's wrong in prose. It still won't write the fix.

### Mechanism 3 — Your growth is recorded, not just your output

Every time you clear a phase, Codit freezes a complete copy of your project as it existed at that moment. That history is browsable, permanent, and read-only — and you can *ask the AI questions about your own past code*.

Six weeks in, you can look at what you wrote in week one. That's a very different experience from a progress bar. It's evidence.

This is also where the long-term design goes: **understanding and output are tracked as separate things and never blended into one score.** Shipping something moves one stat. Proving you understood it moves a different one. You can't grind your way past comprehension by producing more code.

---

## 4. Walked-through example

**Maya, 23.** CS degree, six months job hunting. She has three projects on GitHub. She built all of them with an AI assistant. In her last interview she was asked why she chose to store auth state the way she did and she had no answer, because she hadn't chosen it — she'd accepted it.

**Day 1.** Maya signs up. She takes a short adaptive placement test — it starts with two easy questions and branches: get both right and it escalates to intermediate, then advanced; miss both and it stays easy. It's not trying to rank her, it's trying to find where to start her. She lands on *intermediate*. She says she has ~10 hours a week and prefers written docs over video.

**Day 1, later.** She picks a project from the catalogue. Codit enforces **one live project at a time** — she can't collect half-finished starts. The project is split into four phases. Phase 1 unlocks; the rest are visibly locked.

She opens the workspace: file tree, code editor, terminal, live preview, all running in her browser. The phase panel shows the goal, the concepts, and two curated resources — an MDN page and a specific article, because she said she prefers reading.

**Day 2.** She's stuck on layout. Old habit: describe it to an AI, paste the answer. She tries that.

Codit tells her which of her flex properties is fighting which, and names the property she hasn't set. It does not give her the line. She reads the MDN page it referenced, tries two things, gets it. **It takes her 25 minutes instead of 2.** Those 23 minutes are the entire product.

**Day 4.** Phase 1 knowledge checks. Three questions: one on semantic HTML, one where she completes a snippet, one where she's given broken code and has to say what's wrong. She gets the debugging one wrong on the first pass, reads the explanation, and it lands — she'd never actually understood that particular behavior, she'd just been pattern-matching around it.

**Day 4, later.** She hits *Submit for review*. The AI reads through her project files and comes back:

> Your structure is solid and the sections are all present. Two gaps: your navigation links point to `#` rather than to the section IDs, so nothing actually navigates — check what the `href` needs to contain to target an element on the same page. And your contact form's inputs have no associated labels, which is the accessibility requirement this phase is specifically about.
>
> **VERDICT: NOT MET**

She's annoyed. She fixes both. She resubmits. `VERDICT: MET`. Phase 1 freezes into her history and Phase 2 unlocks.

**Week 6.** She finishes the project. She has: a thing that works, a browsable record of six weeks of her own decisions, and — critically — the experience of having been stuck and gotten unstuck *herself*, roughly forty times.

The next interview goes differently. Not because she memorized anything. Because she has actually done the thing this time.

---

## 5. Second example — bring your own project

The end-state version, and the biggest bet in the roadmap:

**Dev has a half-finished side project.** It works, sort of. He built most of it by prompting. He doesn't fully understand his own state management and he knows it.

He points Codit at the repo. Codit reads it and proposes a phase structure *for his actual codebase* — not a generic curriculum: "Phase 1: your data flow. Phase 2: the auth path. Phase 3: the parts that will break under load." It generates knowledge checks against **his own code**, and the review criteria are about his project's real problems.

He's not learning React from scratch. He's being made to understand the thing he already shipped.

This is the version with the largest market, because it doesn't require anyone to adopt a curriculum. It meets people at the exact moment of felt pain: *I built this and I don't understand it.*

---

## 6. How it's different, stated bluntly

Most learning platforms ask: **did you complete the material?**

Codit asks: **can you demonstrate you understood the thing you built?**

Those produce completely different products. The first optimizes for completion rate, which means it optimizes for *ease*, which means it eventually optimizes for the illusion of learning. The second optimizes for difficulty that the user consents to — which is a much smaller market and a much more defensible one.

The sharpest way to say it: **every other AI coding tool is competing to write your code faster. Codit is the only one competing to make you not need it.**

---

## 7. Why now

- **The problem is new.** This exact failure mode barely existed three years ago. The AI tools that caused it went mainstream in 2023–24, and the first cohort of developers trained entirely inside them is entering the job market now.
- **The pain is felt, not just observed.** People are personally aware they're leaning on AI in a way that scares them. You don't have to convince them a problem exists.
- **Employers are noticing.** Hiring processes are visibly adapting to the fact that a portfolio no longer proves ability. That creates demand for something that does.
- **The enabling tech is finally cheap.** Full dev environments in the browser, and models capable of reading a real codebase and making a judgment about it, both became practical at reasonable cost very recently.

---

## 8. The honest risks

A brainstorm doc that only lists strengths is useless. These are the real ones.

**1. Is friction sellable?**
The entire product is deliberate difficulty. Every growth instinct — reduce time-to-value, lower friction, increase completion — is *directly against* the thesis. If the answer to bad retention is "make it easier," the product dies by becoming a worse Codecademy. There may be a real ceiling on how many people voluntarily choose the hard path.

**2. The AI can just be opened in another tab.**
Codit refuses to write code. ChatGPT is one keystroke away and does not. The product can only ever be a *chosen* constraint, like a gym membership or a website blocker. That's not fatal — self-imposed constraints are a real and proven category — but it means Codit is selling to people who already want to be stopped, which is a smaller group than people who *should* be stopped.

**3. The grader is the whole product, and it's a language model.**
A false *no* is annoying. A **false yes is fatal** — it silently turns Codit into the thing it was built to oppose, and the user gets a credential-feeling experience with none of the substance. Grading reliability isn't a feature, it's the entire value proposition, and it rests on a probabilistic system. This has to be engineered like a safety-critical component, not a chat feature.

**4. Content is expensive.**
Hand-curated projects are the quality moat and don't scale. AI-generated ones scale and risk being generic slop. The staged plan — curate first, generate second, adopt-your-repo third — is the bet that stage 1 teaches you what stage 2 has to produce. Unproven.

**5. Verification without recognition is a hobby.**
"Proof you understand this" is only economically valuable if someone who matters accepts it as proof. Right now that's nobody. Either the credential becomes recognized (slow, hard, requires distribution) or the value has to be purely the transformation itself — you got better, and you know it. The second is honest but harder to price.

**6. It may be a feature, not a company.**
"Learning mode" is something an existing tool with distribution could ship in a quarter. The defense has to be that doing it *properly* — curriculum, verified gates, growth records — is a different product built on a different incentive, and that a company whose revenue depends on you writing code faster is structurally unable to build a mode that slows you down. That argument is plausible. It is not airtight.

---

## 9. Questions worth brainstorming

**On the market**
- Who pays — the learner, their employer, or a school? Each implies a completely different product.
- Is the wedge B2C (individual juniors) or B2B (companies onboarding juniors who can prompt but not reason)? The B2B version has budget and a clearer buyer. The B2C version has the emotional pull.
- Is the buyer the person in pain, or someone who's noticed the pain in others?

**On positioning**
- "A real curriculum, not tutorials" vs. "the AI that won't write your code" vs. "proof you actually understand it." These attract different people. Which one converts?
- Is the enemy tutorial hell, or AI dependence? Naming the wrong enemy attracts the wrong users.

**On the product**
- Does the difficulty need a pressure valve — something that still rewards you on a failed review — or does that undermine the gate?
- How much does the social/visible-proof layer matter? Is "others can see you understood this" the thing that makes the difficulty worth it?
- What's the smallest version that proves the thesis? Possibly: one excellent project, a bulletproof grader, and twenty users.

**On proof**
- What single metric would convince a skeptic this works? Candidate: *can users solve a novel problem in the same domain, unaided, that they never saw during the project?* That's the only test that separates real learning from platform-specific pattern-matching — and it's the one worth building early.

---

## 10. Where it stands

**Built and working:** in-browser IDE (editor, file tree, terminal, live preview), adaptive placement test, hand-curated project catalogue with phases and prerequisites, per-phase resources and knowledge checks, the codebase-aware AI with the no-code-writing rule enforced, submit-for-review with an AI verdict, and frozen phase-by-phase history you can browse and ask questions about.

**Next:** making the review gate rigorous enough to bet the product on, deepening the AI's understanding of the codebase so its help is sharper, and building the growth layer that makes the difficulty feel worth choosing.

**Later:** AI-generated projects on request, then bring-your-own-repo.

---

*Tear this apart. The risks section is the part most worth arguing with.*
