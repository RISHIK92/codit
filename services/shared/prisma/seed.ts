import {
  PrismaClient,
  Skill_Level,
  PhaseStatus,
  Question_Type,
  Difficulty,
} from "../src/generated/prisma-client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── BEGINNER PROJECT 1: Personal Portfolio Website ─────────────────────────
  const portfolio = await prisma.projects.create({
    data: {
      name: "Personal Portfolio Website",
      tech_stack: ["HTML", "CSS", "JavaScript"],
      skill_level: Skill_Level.beginner,
      estimated_minutes: 180,
      goal: "Build and deploy a fully responsive personal portfolio website from scratch.",
    },
  });
  console.log(`✅ Created project: ${portfolio.name} (${portfolio.id})`);

  const portfolioPhase1 = await prisma.learningPhase.create({
    data: {
      project_id: portfolio.id,
      title: "HTML Structure",
      description:
        "Build the skeleton of your portfolio using semantic HTML5 elements.",
      concepts: [
        "HTML5 semantics",
        "Document structure",
        "Forms and inputs",
        "Accessibility attributes",
      ],
      goal: {
        description:
          "Create a fully structured HTML page with header, about, projects, and contact sections.",
      },
      phase_number: 1,
      phase_status: PhaseStatus.in_progress,
      estimated_minutes: 45,
    },
  });

  const portfolioPhase2 = await prisma.learningPhase.create({
    data: {
      project_id: portfolio.id,
      title: "CSS Styling & Layout",
      description:
        "Style your portfolio using modern CSS including Flexbox and Grid.",
      concepts: [
        "CSS Flexbox",
        "CSS Grid",
        "Responsive design",
        "CSS variables",
        "Animations",
      ],
      goal: {
        description:
          "Make the portfolio visually appealing and fully responsive across devices.",
      },
      phase_number: 2,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 60,
    },
  });

  const portfolioPhase3 = await prisma.learningPhase.create({
    data: {
      project_id: portfolio.id,
      title: "JavaScript Interactivity",
      description:
        "Add dynamic behaviour: smooth scrolling, dark mode toggle, and a contact form.",
      concepts: [
        "DOM manipulation",
        "Event listeners",
        "Local storage",
        "Form validation",
      ],
      goal: {
        description:
          "Portfolio has working dark-mode toggle, smooth scroll, and validated contact form.",
      },
      phase_number: 3,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 75,
    },
  });

  // Resources
  await prisma.resources.createMany({
    data: [
      {
        phase_id: portfolioPhase1.id,
        type: "video",
        title: "HTML Full Course – freeCodeCamp",
        url: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
        duration_minutes: 120,
        provider: "freeCodeCamp",
        quality_score: 9.2,
      },
      {
        phase_id: portfolioPhase1.id,
        type: "article",
        title: "HTML Semantic Elements – MDN",
        url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html",
        duration_minutes: 15,
        provider: "MDN Web Docs",
        quality_score: 9.5,
      },
      {
        phase_id: portfolioPhase2.id,
        type: "video",
        title: "CSS Grid & Flexbox – Kevin Powell",
        url: "https://www.youtube.com/watch?v=u044iM9xsWU",
        duration_minutes: 30,
        provider: "Kevin Powell",
        quality_score: 9.3,
      },
      {
        phase_id: portfolioPhase3.id,
        type: "article",
        title: "JavaScript DOM Manipulation – javascript.info",
        url: "https://javascript.info/document",
        duration_minutes: 40,
        provider: "javascript.info",
        quality_score: 9.4,
      },
    ],
  });

  // Knowledge checks
  await prisma.knowledgeChecks.createMany({
    data: [
      {
        phase_id: portfolioPhase1.id,
        question:
          "Which HTML element is most appropriate for a site-wide navigation menu?",
        options: ["<div>", "<nav>", "<header>", "<section>"],
        correct_answer: "<nav>",
        explanation:
          "The <nav> element semantically represents a section of the page intended for navigation links.",
        question_type: Question_Type.multiple_choice,
      },
      {
        phase_id: portfolioPhase2.id,
        question:
          "Complete the CSS to centre an element both horizontally and vertically using Flexbox:\n.container { display: flex; ___ }",
        correct_answer: "justify-content: center; align-items: center;",
        explanation:
          "justify-content centres along the main axis; align-items centres along the cross axis.",
        question_type: Question_Type.code_completion,
      },
      {
        phase_id: portfolioPhase3.id,
        question:
          "The following dark-mode toggle is broken – fix it:\ndocument.querySelector('#toggle').addEventListener('click', () => {\n  document.body.classList.add('dark');\n});",
        correct_answer: "document.body.classList.toggle('dark');",
        explanation:
          "toggle() adds the class if absent and removes it if present, enabling true on/off behaviour.",
        question_type: Question_Type.debug,
      },
    ],
  });

  // ─── BEGINNER PROJECT 2: To-Do List App ─────────────────────────────────────
  // Curated for a developer with ZERO prior React/TypeScript experience.
  // Each phase introduces exactly one new layer of concepts, builds directly
  // on the previous phase's working code, and pairs a "read/watch" resource
  // with a "do" knowledge check (multiple_choice for understanding,
  // code_completion + debug for application) — never both at once.
  const todo = await prisma.projects.create({
    data: {
      name: "To-Do List App",
      tech_stack: ["React", "TypeScript", "Tailwind CSS"],
      skill_level: Skill_Level.beginner,
      estimated_minutes: 300,
      goal: "Build a fully functional to-do list application with CRUD operations, persistence, and filtering — starting from zero React/TypeScript experience.",
    },
  });
  console.log(`✅ Created project: ${todo.name} (${todo.id})`);

  const todoPhase1 = await prisma.learningPhase.create({
    data: {
      project_id: todo.id,
      title: "Your First Component",
      description:
        "Set up the project and render your first typed React components.",
      long_description:
        "## What you're learning\n\n" +
        "React apps are built out of **components** — JavaScript functions that return markup written in **JSX** (HTML-like syntax inside JS). TypeScript adds a type layer on top: you describe the *shape* of the data a component expects, and the compiler catches mistakes before the code ever runs.\n\n" +
        "**JSX** looks like HTML but compiles to plain JS function calls — `<TaskItem title=\"Buy milk\" />` becomes `React.createElement(TaskItem, { title: \"Buy milk\" })` under the hood. That's why JSX has small differences from HTML (`className` instead of `class`, every tag must close).\n\n" +
        "**Props** are how a parent passes data into a child component — think of them as function arguments. In TypeScript, you declare an `interface` describing exactly which props a component accepts and their types.\n\n" +
        "## What to build\n\n" +
        "Scaffold a Vite + React + TypeScript project. Create a `TaskItem` component that accepts typed props (`title: string`, `completed: boolean`) and renders a single task. Then render a **hardcoded array** of at least 3 tasks, mapping each one to a `TaskItem`.\n\n" +
        "Don't wire up any interactivity yet — that's the next phase. The goal here is just: components, props, and getting comfortable reading TypeScript errors when a prop is missing or the wrong type.",
      concepts: [
        "JSX syntax",
        "Functional components",
        "Props & TypeScript interfaces",
        "Rendering a static list with .map()",
      ],
      goal: {
        description:
          "Scaffold the Vite + React + TypeScript project and render a static list of at least 3 tasks using a reusable, typed TaskItem component.",
      },
      phase_number: 1,
      phase_status: PhaseStatus.in_progress,
      estimated_minutes: 45,
    },
  });

  const todoPhase2 = await prisma.learningPhase.create({
    data: {
      project_id: todo.id,
      title: "State & Events",
      description:
        "Make the input field interactive: capture typing and add new tasks to state.",
      long_description:
        "## What you're learning\n\n" +
        "Static markup can't change. **State** is React's way of storing data that *can* change and re-rendering the UI automatically when it does. The `useState` hook gives a component a piece of memory: `const [text, setText] = useState('')` — `text` is the current value, `setText` is the only way to update it.\n\n" +
        "**Event handlers** (`onClick`, `onChange`, `onSubmit`) are how you respond to what the user does. A **controlled input** is one whose value is driven entirely by state — you read `e.target.value` in `onChange` and store it, so the input always reflects state rather than its own internal DOM value.\n\n" +
        "## What to build\n\n" +
        "Add a text input and an 'Add' button above your task list from Phase 1. Typing should update a piece of state; clicking 'Add' (or pressing Enter) should append a new task object to your tasks array and clear the input. Reuse your `TaskItem` component to render the now-dynamic list.\n\n" +
        "Watch out: appending to an array in state means creating a *new* array (e.g. `[...tasks, newTask]`), not mutating the existing one — you'll hit this directly in this phase's debug exercise.",
      concepts: [
        "useState hook",
        "Event handlers (onChange, onClick)",
        "Controlled inputs",
        "Immutable array updates",
      ],
      goal: {
        description:
          "Users can type a task into an input box and click 'Add' to see it appear in the list, with the input clearing afterward.",
      },
      phase_number: 2,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 60,
    },
  });

  const todoPhase3 = await prisma.learningPhase.create({
    data: {
      project_id: todo.id,
      title: "Complete & Delete Tasks",
      description:
        "Let users tick off and remove tasks, rendering lists the React way.",
      long_description:
        "## What you're learning\n\n" +
        "You already render lists with `.map()`. Now you'll update *individual items* inside a list — the trickiest part of this phase. React needs a stable **`key` prop** on each list item so it can tell which item is which across re-renders; using the task's `id` (not its array index) avoids subtle bugs when items are reordered or removed.\n\n" +
        "To toggle or delete one task without touching the others, you transform the whole array immutably: `.map()` to produce a new array where one item changed, `.filter()` to produce a new array with one item removed. Neither mutates the original — both return a fresh array, which is what tells React something changed.\n\n" +
        "## What to build\n\n" +
        "Add a checkbox (or click-to-toggle) on each `TaskItem` that flips its `completed` state and strikes through the text when done. Add a delete button that removes that task from the list. Both actions should feel instant — no page reload, no flicker.",
      concepts: [
        "Rendering lists with .map() and key",
        "Updating one item with .map()",
        "Removing an item with .filter()",
        "Lifting state up (parent owns the tasks array)",
      ],
      goal: {
        description:
          "Users can mark any task complete (with a visual strikethrough) and delete any task, with every update done immutably.",
      },
      phase_number: 3,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 60,
    },
  });

  const todoPhase4 = await prisma.learningPhase.create({
    data: {
      project_id: todo.id,
      title: "Persisting Data",
      description:
        "Save tasks to localStorage so they survive a page refresh.",
      long_description:
        "## What you're learning\n\n" +
        "Right now, refreshing the page wipes your tasks — state only lives in memory. The browser's **`localStorage`** API lets you persist small amounts of data as key-value strings that survive reloads. Since `localStorage` only stores strings, you'll serialize your tasks array with `JSON.stringify()` before saving and parse it back with `JSON.parse()` when loading.\n\n" +
        "The `useEffect` hook lets you run code in response to state changing, *after* React has rendered — exactly what you need to \"sync tasks to localStorage whenever tasks changes.\" Its second argument, the **dependency array**, controls when it re-runs: `[]` means \"once, on mount,\" `[tasks]` means \"whenever tasks changes.\" Getting this array wrong is the single most common React bug for beginners — this phase's debug exercise puts you face to face with it.\n\n" +
        "## What to build\n\n" +
        "On load, read any saved tasks from `localStorage` and use them as your initial state (falling back to an empty list if none exist). Add an effect that writes the current tasks to `localStorage` every time they change. Test it: add a task, refresh the page, and confirm it's still there.",
      concepts: [
        "useEffect hook & dependency arrays",
        "localStorage API",
        "JSON.stringify / JSON.parse",
        "Lazy state initialization from storage",
      ],
      goal: {
        description:
          "Tasks persist across a full page refresh, loaded from and saved to localStorage.",
      },
      phase_number: 4,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 60,
    },
  });

  const todoPhase5 = await prisma.learningPhase.create({
    data: {
      project_id: todo.id,
      title: "Filtering & Polish",
      description:
        "Add All / Active / Completed filter tabs and style empty states with Tailwind.",
      long_description:
        "## What you're learning\n\n" +
        "It's tempting to store \"the filtered list\" as its own state variable — don't. That's **redundant state**: a second source of truth that can drift out of sync with the real tasks array. Instead, compute the visible list *during render* from `tasks` + the current filter, using `Array.filter()`. This is called **derived state**, and it's a core React principle: if you can calculate a value from existing state, don't duplicate it in a new state variable.\n\n" +
        "You'll also add basic polish with **Tailwind CSS** utility classes — conditionally applying classes based on state (e.g. a strikethrough only when `completed` is true, or highlighting the active filter tab) and handling the empty-list case gracefully instead of showing a blank screen.\n\n" +
        "## What to build\n\n" +
        "Add three tabs — All, Active, Completed — that filter which tasks are shown, without adding a second array to state. Style the active tab differently from the others. When the visible list is empty (e.g. no completed tasks yet), show a friendly empty-state message instead of nothing.",
      concepts: [
        "Derived state vs. redundant state",
        "Array.filter() for view logic",
        "Conditional Tailwind classes",
        "Empty states",
      ],
      goal: {
        description:
          "All / Active / Completed filter tabs work correctly, computed as derived state (not a separate state variable), with a styled empty state.",
      },
      phase_number: 5,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 75,
    },
  });

  await prisma.resources.createMany({
    data: [
      // Phase 1 — Your First Component
      {
        phase_id: todoPhase1.id,
        type: "article",
        title: "Your First Component – React Docs",
        url: "https://react.dev/learn/your-first-component",
        duration_minutes: 10,
        provider: "react.dev",
        quality_score: 9.7,
      },
      {
        phase_id: todoPhase1.id,
        type: "article",
        title: "Passing Props to a Component – React Docs",
        url: "https://react.dev/learn/passing-props-to-a-component",
        duration_minutes: 15,
        provider: "react.dev",
        quality_score: 9.6,
      },
      {
        phase_id: todoPhase1.id,
        type: "article",
        title: "TypeScript for JavaScript Programmers",
        url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html",
        duration_minutes: 10,
        provider: "typescriptlang.org",
        quality_score: 9.2,
      },
      // Phase 2 — State & Events
      {
        phase_id: todoPhase2.id,
        type: "article",
        title: "State: A Component's Memory – React Docs",
        url: "https://react.dev/learn/state-a-components-memory",
        duration_minutes: 15,
        provider: "react.dev",
        quality_score: 9.7,
      },
      {
        phase_id: todoPhase2.id,
        type: "article",
        title: "Responding to Events – React Docs",
        url: "https://react.dev/learn/responding-to-events",
        duration_minutes: 12,
        provider: "react.dev",
        quality_score: 9.6,
      },
      {
        phase_id: todoPhase2.id,
        type: "video",
        title: "React Course for Beginners – freeCodeCamp",
        url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        duration_minutes: 720,
        provider: "freeCodeCamp",
        quality_score: 8.9,
      },
      // Phase 3 — Complete & Delete Tasks
      {
        phase_id: todoPhase3.id,
        type: "article",
        title: "Rendering Lists – React Docs",
        url: "https://react.dev/learn/rendering-lists",
        duration_minutes: 15,
        provider: "react.dev",
        quality_score: 9.6,
      },
      {
        phase_id: todoPhase3.id,
        type: "article",
        title: "Updating Arrays in State – React Docs",
        url: "https://react.dev/learn/updating-arrays-in-state",
        duration_minutes: 15,
        provider: "react.dev",
        quality_score: 9.6,
      },
      {
        phase_id: todoPhase3.id,
        type: "article",
        title: "Understanding React's key Prop – Kent C. Dodds",
        url: "https://kentcdodds.com/blog/understanding-reacts-key-prop",
        duration_minutes: 12,
        provider: "kentcdodds.com",
        quality_score: 9.0,
      },
      // Phase 4 — Persisting Data
      {
        phase_id: todoPhase4.id,
        type: "article",
        title: "useEffect – React Docs",
        url: "https://react.dev/reference/react/useEffect",
        duration_minutes: 20,
        provider: "react.dev",
        quality_score: 9.4,
      },
      {
        phase_id: todoPhase4.id,
        type: "article",
        title: "Window.localStorage – MDN",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
        duration_minutes: 10,
        provider: "MDN Web Docs",
        quality_score: 9.3,
      },
      {
        phase_id: todoPhase4.id,
        type: "article",
        title: "useLocalStorage Pattern – useHooks",
        url: "https://usehooks.com/uselocalstorage",
        duration_minutes: 15,
        provider: "useHooks",
        quality_score: 8.8,
      },
      // Phase 5 — Filtering & Polish
      {
        phase_id: todoPhase5.id,
        type: "article",
        title: "Avoiding Redundant State – React Docs",
        url: "https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state",
        duration_minutes: 12,
        provider: "react.dev",
        quality_score: 9.5,
      },
      {
        phase_id: todoPhase5.id,
        type: "article",
        title: "Array.prototype.filter() – MDN",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter",
        duration_minutes: 10,
        provider: "MDN Web Docs",
        quality_score: 9.2,
      },
      {
        phase_id: todoPhase5.id,
        type: "article",
        title: "Utility-First Fundamentals – Tailwind CSS Docs",
        url: "https://tailwindcss.com/docs/utility-first",
        duration_minutes: 10,
        provider: "tailwindcss.com",
        quality_score: 9.0,
      },
    ],
  });

  await prisma.knowledgeChecks.createMany({
    data: [
      // Phase 1
      {
        phase_id: todoPhase1.id,
        question:
          "What does JSX compile down to at build time?",
        options: [
          "Plain HTML strings",
          "React.createElement() calls",
          "CSS-in-JS objects",
          "WebAssembly bytecode",
        ],
        correct_answer: "React.createElement() calls",
        explanation:
          "JSX is syntactic sugar — a tool like Babel or the TypeScript compiler transforms it into nested React.createElement() calls before the code ever runs in the browser.",
        question_type: Question_Type.multiple_choice,
      },
      {
        phase_id: todoPhase1.id,
        question:
          "Write a TypeScript interface named TaskItemProps for a component that receives a title (string) and a completed (boolean) prop.",
        correct_answer:
          "interface TaskItemProps { title: string; completed: boolean; }",
        explanation:
          "Typed props let TypeScript catch mistakes — like passing a number where a string is expected — before the code runs, instead of failing silently in the browser.",
        question_type: Question_Type.code_completion,
      },
      {
        phase_id: todoPhase1.id,
        question:
          "This component renders nothing and TypeScript flags an error — find and fix the bug:\nfunction TaskItem(props: TaskItemProps) {\n  <li>{props.title}</li>\n}",
        correct_answer:
          "function TaskItem(props: TaskItemProps) { return <li>{props.title}</li>; }",
        explanation:
          "An arrow or regular function with a { } body doesn't automatically return its last expression — without an explicit return statement, the component returns undefined and renders nothing.",
        question_type: Question_Type.debug,
      },
      // Phase 2
      {
        phase_id: todoPhase2.id,
        question:
          "Complete the controlled input's change handler so it keeps state in sync with what the user types:\nconst [text, setText] = useState('');\n<input value={text} onChange={(e) => ___} />",
        correct_answer: "setText(e.target.value)",
        explanation:
          "A controlled input's displayed value always comes from state — onChange is the only place that state gets updated to match what the user just typed.",
        question_type: Question_Type.code_completion,
      },
      {
        phase_id: todoPhase2.id,
        question:
          "Why does calling tasks.push(newTask) directly on the state array fail to update the UI, even though the array technically now contains the new task?",
        options: [
          "React compares object references to detect changes; mutating in place keeps the same reference, so React thinks nothing changed and skips the re-render.",
          "push() is not a valid JavaScript array method inside React components.",
          "React automatically reverts any direct array mutation within one render cycle.",
          "State variables are frozen with Object.freeze() by useState, so push() throws silently.",
        ],
        correct_answer:
          "React compares object references to detect changes; mutating in place keeps the same reference, so React thinks nothing changed and skips the re-render.",
        explanation:
          "Always create a new array (e.g. setTasks([...tasks, newTask])) instead of mutating — a new reference is what tells React to re-render.",
        question_type: Question_Type.multiple_choice,
      },
      {
        phase_id: todoPhase2.id,
        question:
          "This 'Add Task' handler doesn't update the list on screen — find and fix the bug:\nfunction handleAdd() {\n  tasks.push({ id: crypto.randomUUID(), title: text, completed: false });\n}",
        correct_answer:
          "function handleAdd() { setTasks([...tasks, { id: crypto.randomUUID(), title: text, completed: false }]); }",
        explanation:
          "The handler mutates the tasks array directly and never calls the state setter, so React never knows a re-render is needed. Building a new array and passing it to setTasks fixes both problems.",
        question_type: Question_Type.debug,
      },
      // Phase 3
      {
        phase_id: todoPhase3.id,
        question:
          "Why should the key prop on a list item be the task's stable id rather than its array index?",
        options: [
          "Using the array index as key can cause React to mix up which DOM node belongs to which item once the list is reordered, filtered, or an item is deleted.",
          "React throws a runtime error if the key is a number instead of a string.",
          "The key prop only affects sorting order, not correctness.",
          "Array indices are slower for React to compare than UUIDs.",
        ],
        correct_answer:
          "Using the array index as key can cause React to mix up which DOM node belongs to which item once the list is reordered, filtered, or an item is deleted.",
        explanation:
          "A stable, unique id keeps each list item's identity consistent across re-renders, even as the array's order or length changes — an index doesn't survive a deletion in the middle of the list.",
        question_type: Question_Type.multiple_choice,
      },
      {
        phase_id: todoPhase3.id,
        question:
          "Complete the immutable delete: remove the task with the given id from state without mutating the original array.\nsetTasks(tasks.filter((t) => ___));",
        correct_answer: "t.id !== id",
        explanation:
          "filter() returns a brand-new array containing every task except the one matching id, leaving the original tasks array untouched.",
        question_type: Question_Type.code_completion,
      },
      {
        phase_id: todoPhase3.id,
        question:
          "This 'toggle complete' handler mutates state directly — find and fix the bug:\nfunction toggleTask(id: string) {\n  const task = tasks.find((t) => t.id === id);\n  task!.completed = !task!.completed;\n  setTasks(tasks);\n}",
        correct_answer:
          "function toggleTask(id: string) { setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)); }",
        explanation:
          "Mutating task.completed changes the object in place, and passing the same tasks reference to setTasks means React sees no change. Mapping to a new array with a new object for the toggled task fixes it.",
        question_type: Question_Type.debug,
      },
      // Phase 4
      {
        phase_id: todoPhase4.id,
        question:
          "Why must you call JSON.stringify() on the tasks array before passing it to localStorage.setItem()?",
        options: [
          "localStorage can only store strings — any other value type is implicitly converted to the unhelpful string \"[object Object]\" if not serialized first.",
          "JSON.stringify() compresses the data to save disk space.",
          "localStorage.setItem() only accepts arguments in JSON format as a security requirement.",
          "It's not required — localStorage automatically serializes objects.",
        ],
        correct_answer:
          "localStorage can only store strings — any other value type is implicitly converted to the unhelpful string \"[object Object]\" if not serialized first.",
        explanation:
          "localStorage's API is string-only. JSON.stringify() turns your tasks array into a string representation you can save, and JSON.parse() turns it back into real data on load.",
        question_type: Question_Type.multiple_choice,
      },
      {
        phase_id: todoPhase4.id,
        question:
          "Complete the effect that saves tasks to localStorage every time the tasks array changes:\nuseEffect(() => {\n  ___\n}, [tasks]);",
        correct_answer: "localStorage.setItem('tasks', JSON.stringify(tasks));",
        explanation:
          "The [tasks] dependency array tells React to re-run this effect only after a render where tasks changed — exactly the sync behavior you want.",
        question_type: Question_Type.code_completion,
      },
      {
        phase_id: todoPhase4.id,
        question:
          "This effect is meant to save tasks whenever they change, but it causes an infinite render loop — find and fix the bug:\nuseEffect(() => {\n  localStorage.setItem('tasks', JSON.stringify(tasks));\n  setTasks(tasks);\n});",
        correct_answer:
          "useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);",
        explanation:
          "Two bugs: the missing dependency array means the effect re-runs after every single render, and the unnecessary setTasks(tasks) call inside it triggers another render each time, compounding the loop.",
        question_type: Question_Type.debug,
      },
      // Phase 5
      {
        phase_id: todoPhase5.id,
        question:
          "Why is storing the filtered task list in its own useState variable (rather than computing it during render) considered a bug-prone pattern?",
        options: [
          "It creates redundant state — a second source of truth that must be manually kept in sync with the real tasks array, and will silently go stale if you forget an update.",
          "useState variables cannot hold derived arrays, only primitive values.",
          "It causes a TypeScript compile error.",
          "Filtering is only allowed inside useEffect, never inside useState.",
        ],
        correct_answer:
          "It creates redundant state — a second source of truth that must be manually kept in sync with the real tasks array, and will silently go stale if you forget an update.",
        explanation:
          "If a value can be calculated from existing state during render, calculating it there (rather than duplicating it in new state) guarantees it's always correct and removes an entire class of sync bugs.",
        question_type: Question_Type.multiple_choice,
      },
      {
        phase_id: todoPhase5.id,
        question:
          "Complete the derived (not stored) visible-tasks calculation for the three filter tabs:\nconst visibleTasks =\n  filter === 'active' ? tasks.filter((t) => ___) :\n  filter === 'completed' ? tasks.filter((t) => ___) :\n  tasks;",
        correct_answer: "!t.completed  /  t.completed",
        explanation:
          "Both branches derive their result fresh from tasks on every render — there's no separate state variable to fall out of sync.",
        question_type: Question_Type.code_completion,
      },
      {
        phase_id: todoPhase5.id,
        question:
          "This filter implementation keeps showing stale results after tasks change — find and fix the bug:\nconst [visibleTasks, setVisibleTasks] = useState(tasks);\nfunction onFilterClick(f: string) {\n  setFilter(f);\n  setVisibleTasks(tasks.filter(/* ... */));\n}",
        correct_answer:
          "Remove the visibleTasks state entirely; compute it during render instead: const visibleTasks = filter === 'active' ? tasks.filter((t) => !t.completed) : filter === 'completed' ? tasks.filter((t) => t.completed) : tasks;",
        explanation:
          "visibleTasks is redundant state that only updates when onFilterClick runs — if tasks changes for any other reason (add, delete, toggle), visibleTasks goes stale. Deriving it during render eliminates the bug class entirely.",
        question_type: Question_Type.debug,
      },
    ],
  });

  // ─── BEGINNER PROJECT 3: Interactive Quiz App ────────────────────────────────
  // Pure HTML/CSS/vanilla JS — no framework. Deliberately teaches the DOM,
  // event, and state-management fundamentals that React abstracts away, as a
  // bridge between the Portfolio (HTML/CSS-only) and the To-Do List App
  // (React) — hence it becomes a prerequisite of To-Do List App below.
  const quizApp = await prisma.projects.create({
    data: {
      name: "Interactive Quiz App",
      tech_stack: ["HTML", "CSS", "JavaScript"],
      skill_level: Skill_Level.beginner,
      estimated_minutes: 330,
      goal: "Build a multi-question interactive quiz with scoring and a persisted high score, using only HTML, CSS, and vanilla JavaScript — no frameworks.",
    },
  });
  console.log(`✅ Created project: ${quizApp.name} (${quizApp.id})`);

  // To-Do List App assumes DOM/event/state fundamentals from this project
  // before jumping into React's abstractions over the same ideas.
  await prisma.projects.update({
    where: { id: todo.id },
    data: { prerequisite_ids: [quizApp.id] },
  });

  const quizPhase0 = await prisma.learningPhase.create({
    data: {
      project_id: quizApp.id,
      title: "HTML Basics",
      description: "What HTML actually is, before touching any CSS or JavaScript.",
      long_description:
        "## What you're learning\n\n" +
        "HTML (HyperText Markup Language) isn't a programming language — it's a markup language that describes the structure and content of a page using **tags**. A tag like `<p>` wraps content to say \"this is a paragraph\": the opening tag `<p>`, the closing tag `</p>`, and everything between them together form an **element**. Some elements take **attributes** — extra information written inside the opening tag as `name=\"value\"` pairs, like `<button type=\"button\">` or `<div id=\"card\">`.\n\n" +
        "Every HTML page follows the same skeleton: `<!DOCTYPE html>` tells the browser this is modern HTML, `<html>` wraps the whole page, `<head>` holds metadata that isn't shown on the page itself (like the title in the browser tab), and `<body>` holds everything the user actually sees.\n\n" +
        "You'll meet a handful of everyday elements here: `<div>` (a generic container for grouping content — it has no meaning of its own, it's just a box), `<p>` (a paragraph of text), `<h1>`–`<h6>` (headings, largest to smallest), `<button>` (a clickable button), and `<input>` (a form control like a text box or radio button). None of these look like anything special by default — styling is CSS's job, which starts in the next phase.\n\n" +
        "## What to build\n\n" +
        "Create a new `.html` file with the full `<!DOCTYPE html><html><head><title>…</title></head><body>…</body></html>` skeleton. Inside `<body>`, add a heading with your quiz's name, a paragraph describing it, and one `<button>`. Open the file directly in a browser and confirm it renders — this plain, unstyled page is the foundation the rest of the project builds on.",
      concepts: [
        "What HTML is (tags, elements, attributes)",
        "Document structure (doctype, html, head, body)",
        "Common elements (div, p, h1-h6, button, input)",
        "Opening a local HTML file in a browser",
      ],
      goal: { description: "A valid, complete HTML document — proper doctype/html/head/body structure — renders a heading, a paragraph, and one button in the browser." },
      phase_number: 1,
      phase_status: PhaseStatus.in_progress,
      estimated_minutes: 30,
    },
  });

  const quizPhase1 = await prisma.learningPhase.create({
    data: {
      project_id: quizApp.id,
      title: "Structure & Style",
      description: "Build a static, styled quiz card with one hardcoded question.",
      long_description:
        "## What you're learning\n\n" +
        "Now that you know how tags, elements, and attributes work, it's time to build a real layout instead of a bare page. A group of answer choices is a classic use case for `<fieldset>` and `<legend>` — HTML elements built specifically for grouping related form controls, which communicate their purpose better than a plain `<div>` would.\n\n" +
        "You'll also use **Flexbox** to lay out the question card and stack the answer options with consistent spacing, and review the **CSS box model** (`padding`, `border`, `margin`) to control how the card is sized and spaced on the page. This is your first CSS in the project — CSS is a separate language from HTML that describes how elements should *look*, written either in a `<style>` tag or a linked `.css` file, using selectors (like `.card` or `button`) to target the elements you built in the previous phase.\n\n" +
        "## What to build\n\n" +
        "Turn last phase's bare page into a styled quiz card containing one hardcoded question and four answer options (radio buttons or styled buttons), wrapped in a `<fieldset>`/`<legend>`. Style it with Flexbox so the card is centered on the page and the options stack vertically with even spacing. No JavaScript yet — get the static structure and styling right first.",
      concepts: [
        "CSS basics (selectors, a style block)",
        "Semantic HTML (fieldset & legend)",
        "CSS Flexbox layout",
        "The CSS box model",
      ],
      goal: { description: "A static, styled quiz card renders one hardcoded question with four answer options, centered on the page." },
      phase_number: 2,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 45,
    },
  });

  const quizPhase2 = await prisma.learningPhase.create({
    data: {
      project_id: quizApp.id,
      title: "Selecting the DOM",
      description: "Use JavaScript to read the page and populate content from data.",
      long_description:
        "## What you're learning\n\n" +
        "The DOM (Document Object Model) is the live, in-memory tree of your HTML that JavaScript can read and change. `document.querySelector()` finds a single element matching a CSS selector; `document.querySelectorAll()` finds all of them.\n\n" +
        "Once you have an element, `textContent` lets you safely set its text — unlike `innerHTML`, which parses the string as markup and can be a security risk (HTML/script injection) if the text ever comes from user input. For plain text, `textContent` is both simpler and safer.\n\n" +
        "## What to build\n\n" +
        "Move your question and answers into a JavaScript array of objects (e.g. `{ question: string, options: string[], correctIndex: number }`). Use `querySelector`/`querySelectorAll` to select your question and option elements, and set their text from the first item in your array using `textContent` — so the card is now driven by data, not hardcoded HTML, even though it still only shows one question.",
      concepts: [
        "document.querySelector / querySelectorAll",
        "textContent vs innerHTML",
        "Arrays of objects as data",
        "DOM traversal basics",
      ],
      goal: { description: "The quiz card's question and options are populated from a JavaScript data array via the DOM, not hardcoded in HTML." },
      phase_number: 3,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 60,
    },
  });

  const quizPhase3 = await prisma.learningPhase.create({
    data: {
      project_id: quizApp.id,
      title: "Events & Interactivity",
      description: "Make the options clickable and give immediate visual feedback.",
      long_description:
        "## What you're learning\n\n" +
        "`addEventListener` is how you respond to user actions. Rather than attaching a separate listener to every option button, you can attach **one** listener to their shared parent container and use **event delegation**: the `event` object's `target` property tells you exactly which child element was actually clicked, even though the listener lives on the parent.\n\n" +
        "`classList.add()` / `.remove()` / `.toggle()` let you flip CSS classes on and off in response to those clicks — e.g. adding a `.selected` class to style whichever option the user picked, and making sure to remove it from any previously selected option first.\n\n" +
        "## What to build\n\n" +
        "Add a click listener on the options container. When an option is clicked, mark it visually as selected (and unmark any previously selected option — only one choice active at a time). Don't reveal correct/incorrect yet — that's just the selection interaction working.",
      concepts: [
        "addEventListener & event delegation",
        "The event object and event.target",
        "classList.add / remove / toggle",
        "Single-selection UI state",
      ],
      goal: { description: "Clicking an answer option visually selects it, and only one option can be selected at a time." },
      phase_number: 4,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 60,
    },
  });

  const quizPhase4 = await prisma.learningPhase.create({
    data: {
      project_id: quizApp.id,
      title: "Quiz Flow & State",
      description: "Advance through every question, tracking score along the way.",
      long_description:
        "## What you're learning\n\n" +
        "Without a framework, \"state\" is just plain variables — a `let currentIndex = 0` and `let score = 0` are enough to track the whole quiz, as long as you always **re-render from them** rather than editing the DOM ad hoc. This is the same derived-render idea React automates: given the current state, there's exactly one correct DOM to show, so write a `renderQuestion()` function that rebuilds the card from `questions[currentIndex]` every time state changes.\n\n" +
        "You'll also handle the score carefully: increment it exactly once per answer (in the click handler, not in `renderQuestion`, which may run more than once) to avoid double-counting.\n\n" +
        "## What to build\n\n" +
        "Add a 'Next' button that increments `currentIndex` and re-renders the card with the next question from your array — looping through all of them. Track the running score as the user answers, incrementing it exactly once when a correct option is selected. Disable or hide 'Next' until an option has been chosen for the current question.",
      concepts: [
        "Plain-variable state (no framework)",
        "Re-render-from-state pattern",
        "Index-based navigation through an array",
        "Avoiding double-counted score updates",
      ],
      goal: { description: "A 'Next' button advances through every question in order, and the running score increments exactly once per correct answer." },
      phase_number: 5,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 75,
    },
  });

  const quizPhase5 = await prisma.learningPhase.create({
    data: {
      project_id: quizApp.id,
      title: "Results & Persistence",
      description: "Show a final score screen and remember the best score across visits.",
      long_description:
        "## What you're learning\n\n" +
        "\"Conditional rendering\" without a framework just means manually showing and hiding sections — e.g. hiding the quiz card and showing a results section once `currentIndex` runs past the last question. **Template literals** (`` `You scored ${score}/${total}` ``) make building that dynamic text far more readable than string concatenation.\n\n" +
        "To remember the best score across page reloads, you'll read and write it to `localStorage` — but only overwrite the stored value when the new score is actually higher, using `Math.max()` or a simple comparison, so a worse run never erases a better one.\n\n" +
        "## What to build\n\n" +
        "After the last question, hide the quiz card and show a results screen with the final score and percentage. Compare the final score to any previously saved `localStorage` best score, update it only if the new score is higher, and display the all-time best. Add a 'Restart' button that resets all state variables back to their initial values and re-renders the first question.",
      concepts: [
        "Manual conditional rendering (show/hide)",
        "Template literals",
        "localStorage with a 'keep the best' comparison",
        "Resetting state on restart",
      ],
      goal: { description: "A results screen shows the final score and percentage, an all-time best score persists via localStorage, and 'Restart' resets the quiz to question one." },
      phase_number: 6,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 60,
    },
  });

  await prisma.resources.createMany({
    data: [
      { phase_id: quizPhase0.id, type: "video", title: "HTML Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg", duration_minutes: 120, provider: "freeCodeCamp", quality_score: 9.2 },
      { phase_id: quizPhase0.id, type: "article", title: "Basic HTML Syntax – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax", duration_minutes: 15, provider: "MDN Web Docs", quality_score: 9.5 },
      { phase_id: quizPhase0.id, type: "article", title: "HTML Elements Reference – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element", duration_minutes: 10, provider: "MDN Web Docs", quality_score: 9.3 },
      { phase_id: quizPhase1.id, type: "article", title: "Semantics – MDN", url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html", duration_minutes: 15, provider: "MDN Web Docs", quality_score: 9.5 },
      { phase_id: quizPhase1.id, type: "article", title: "A Complete Guide to Flexbox – CSS-Tricks", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", duration_minutes: 20, provider: "CSS-Tricks", quality_score: 9.6 },
      { phase_id: quizPhase1.id, type: "article", title: "Introduction to the CSS Box Model – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model", duration_minutes: 12, provider: "MDN Web Docs", quality_score: 9.4 },
      { phase_id: quizPhase2.id, type: "article", title: "Document.querySelector() – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector", duration_minutes: 10, provider: "MDN Web Docs", quality_score: 9.5 },
      { phase_id: quizPhase2.id, type: "article", title: "Node.textContent – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent", duration_minutes: 8, provider: "MDN Web Docs", quality_score: 9.3 },
      { phase_id: quizPhase2.id, type: "article", title: "Walking the DOM – javascript.info", url: "https://javascript.info/dom-navigation", duration_minutes: 20, provider: "javascript.info", quality_score: 9.4 },
      { phase_id: quizPhase3.id, type: "article", title: "EventTarget.addEventListener() – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener", duration_minutes: 15, provider: "MDN Web Docs", quality_score: 9.4 },
      { phase_id: quizPhase3.id, type: "article", title: "Introduction to Browser Events – javascript.info", url: "https://javascript.info/introduction-browser-events", duration_minutes: 20, provider: "javascript.info", quality_score: 9.5 },
      { phase_id: quizPhase3.id, type: "article", title: "Element.classList – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/classList", duration_minutes: 8, provider: "MDN Web Docs", quality_score: 9.3 },
      { phase_id: quizPhase4.id, type: "article", title: "Arrays – javascript.info", url: "https://javascript.info/array", duration_minutes: 25, provider: "javascript.info", quality_score: 9.4 },
      { phase_id: quizPhase4.id, type: "article", title: "Conditional (Ternary) Operator – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator", duration_minutes: 8, provider: "MDN Web Docs", quality_score: 9.2 },
      { phase_id: quizPhase4.id, type: "article", title: "Array.prototype.forEach() – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach", duration_minutes: 10, provider: "MDN Web Docs", quality_score: 9.3 },
      { phase_id: quizPhase5.id, type: "article", title: "Window.localStorage – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage", duration_minutes: 10, provider: "MDN Web Docs", quality_score: 9.3 },
      { phase_id: quizPhase5.id, type: "article", title: "Template Literals – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals", duration_minutes: 10, provider: "MDN Web Docs", quality_score: 9.4 },
      { phase_id: quizPhase5.id, type: "article", title: "Array.prototype.reduce() – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce", duration_minutes: 12, provider: "MDN Web Docs", quality_score: 9.2 },
    ],
  });

  await prisma.knowledgeChecks.createMany({
    data: [
      { phase_id: quizPhase0.id, question: "What is the correct top-level structure of an HTML document?", options: ["<html><head></head><body></body></html>, with no doctype needed", "<!DOCTYPE html><html><head>...</head><body>...</body></html>", "<head><html><body></body></html></head>", "<body><head></head>...</body>"], correct_answer: "<!DOCTYPE html><html><head>...</head><body>...</body></html>", explanation: "The doctype declares this as modern HTML, <html> wraps the page, <head> holds metadata not shown on the page, and <body> holds everything the user actually sees — always in that order.", question_type: Question_Type.multiple_choice },
      { phase_id: quizPhase0.id, question: "Complete this paragraph element so it's properly closed:\n<p>Welcome to the quiz___", correct_answer: "</p>", explanation: "An element consists of an opening tag, its content, and a matching closing tag — </p> is what closes the <p> opened at the start.", question_type: Question_Type.code_completion },
      { phase_id: quizPhase0.id, question: "This page renders blank in the browser — find and fix the bug:\n<html>\n<body>\n<h1>My Quiz</h1>\n</body>", correct_answer: "<!DOCTYPE html>\n<html>\n<body>\n<h1>My Quiz</h1>\n</body>\n</html>", explanation: "The <html> element is never closed, so the document is malformed — every opening tag needs a matching closing tag, and a real page should also start with <!DOCTYPE html>.", question_type: Question_Type.debug },
      { phase_id: quizPhase1.id, question: "Which HTML element pairing is the semantically correct way to group a question with its set of answer options?", options: ["<div> wrapping a <div> for each option", "<section> wrapping <p> elements", "<fieldset> with a <legend>", "<article> wrapping <span> elements"], correct_answer: "<fieldset> with a <legend>", explanation: "<fieldset> groups related form controls and <legend> labels the group — the purpose-built HTML pattern for a question with a set of choices, unlike generic <div>/<section>.", question_type: Question_Type.multiple_choice },
      { phase_id: quizPhase1.id, question: "Complete the CSS so the four answer options stack in a single column with 10px of spacing between them:\n.options { display: flex; ___ }", correct_answer: "flex-direction: column; gap: 10px;", explanation: "flex-direction: column stacks flex children vertically instead of the default row, and gap adds consistent spacing between them without needing margin on each item.", question_type: Question_Type.code_completion },
      { phase_id: quizPhase1.id, question: "This quiz card isn't centering on the page — find and fix the bug:\nbody { display: flex; justify-content: center; }\n.card { width: 400px; }", correct_answer: "body { display: flex; justify-content: center; align-items: center; min-height: 100vh; }", explanation: "justify-content centers along the main (row) axis only. Without align-items: center and a body with actual height (min-height: 100vh), there's no cross-axis space to center within, so the card stays pinned to the top.", question_type: Question_Type.debug },
      { phase_id: quizPhase2.id, question: "When inserting quiz question text that always comes from your own JS array (never user input), why prefer textContent over innerHTML?", options: ["textContent inserts the string as plain text and can't be misinterpreted as HTML/script; innerHTML parses its argument as markup, which is a needless risk when you just want text.", "textContent is a newer API and innerHTML is deprecated.", "innerHTML only works on <div> elements.", "There's no difference — they're aliases for the same operation."], correct_answer: "textContent inserts the string as plain text and can't be misinterpreted as HTML/script; innerHTML parses its argument as markup, which is a needless risk when you just want text.", explanation: "Defaulting to textContent for plain text is a safe habit — it avoids a class of injection bugs that shows up the moment the text source changes to something less trusted.", question_type: Question_Type.multiple_choice },
      { phase_id: quizPhase2.id, question: "Select the element with id 'question-text' and store it in a variable named questionEl.\nconst questionEl = ___;", correct_answer: "document.querySelector('#question-text')", explanation: "querySelector accepts any CSS selector, including an id selector (#question-text), and returns the first matching element.", question_type: Question_Type.code_completion },
      { phase_id: quizPhase2.id, question: "This code is supposed to style every option element, but only the first one changes — find and fix the bug:\nconst option = document.querySelector('.option');\noption.classList.add('option-style');", correct_answer: "const options = document.querySelectorAll('.option');\noptions.forEach((option) => option.classList.add('option-style'));", explanation: "querySelector returns only the first matching element. querySelectorAll returns every match as a NodeList, which you can iterate with forEach to affect all of them.", question_type: Question_Type.debug },
      { phase_id: quizPhase3.id, question: "With one click listener attached to the shared options container (event delegation), how do you find out which specific option element was actually clicked?", options: ["event.target refers to the exact element the click landed on, even though the listener is registered on its parent container.", "You must attach a separate listener to each option to know which one was clicked.", "event.currentTarget always refers to the clicked child element.", "The click event doesn't carry information about which child was clicked."], correct_answer: "event.target refers to the exact element the click landed on, even though the listener is registered on its parent container.", explanation: "event.target is the actual element the event originated from; event.currentTarget is the element the listener is attached to (the container). Delegation relies on that distinction.", question_type: Question_Type.multiple_choice },
      { phase_id: quizPhase3.id, question: "Complete the delegated click handler that marks the clicked option as selected:\noptionsContainer.addEventListener('click', (event) => {\n  ___\n});", correct_answer: "event.target.classList.add('selected');", explanation: "event.target is the specific option element that was clicked, so calling classList.add on it applies the selected style to exactly that element.", question_type: Question_Type.code_completion },
      { phase_id: quizPhase3.id, question: "Clicking a second option leaves both options visually selected — find and fix the bug:\noptionsContainer.addEventListener('click', (event) => {\n  event.target.classList.add('selected');\n});", correct_answer: "optionsContainer.addEventListener('click', (event) => {\n  optionsContainer.querySelectorAll('.selected').forEach((el) => el.classList.remove('selected'));\n  event.target.classList.add('selected');\n});", explanation: "The handler only ever adds the class and never removes it from a previously selected option, so every clicked option accumulates the class. Clearing .selected from all options first (or tracking the previously selected element) fixes it.", question_type: Question_Type.debug },
      { phase_id: quizPhase4.id, question: "Why is a single currentIndex variable enough to track quiz progress, instead of a separate boolean flag per question?", options: ["The current question is always derivable as questions[currentIndex] — storing it as one number avoids a whole class of sync bugs that separate per-question flags would introduce.", "JavaScript doesn't support boolean arrays.", "currentIndex is required by the DOM API for navigation.", "Boolean flags would be slower to check than a number."], correct_answer: "The current question is always derivable as questions[currentIndex] — storing it as one number avoids a whole class of sync bugs that separate per-question flags would introduce.", explanation: "This is the same derived-state principle as elsewhere in the catalogue: one minimal source of truth (the index) beats several flags that could drift out of sync with each other.", question_type: Question_Type.multiple_choice },
      { phase_id: quizPhase4.id, question: "Complete the 'Next' button handler so it advances to the next question and rebuilds the card from the new state:\nfunction nextQuestion() {\n  currentIndex++;\n  ___();\n}", correct_answer: "renderQuestion", explanation: "Incrementing currentIndex only changes a number in memory — renderQuestion() is what reads that new state and rebuilds the visible DOM to match it.", question_type: Question_Type.code_completion },
      { phase_id: quizPhase4.id, question: "The score displayed is always double what it should be — find and fix the bug:\nfunction renderQuestion() {\n  if (answered) score++;\n  questionEl.textContent = questions[currentIndex].question;\n}", correct_answer: "Move the score++ out of renderQuestion and into the click handler that records the answer, so it runs exactly once per answer instead of every time the question re-renders.", explanation: "renderQuestion can run more than once for the same answered question (e.g. on any re-render), so incrementing score there double-counts. Incrementing it in the one-time click handler that marks the answer as recorded fixes it.", question_type: Question_Type.debug },
      { phase_id: quizPhase5.id, question: "Why compare the new score to the stored localStorage best score with Math.max (or an if-check) instead of always overwriting it?", options: ["Always overwriting would let a worse run replace a previously saved higher score, defeating the purpose of tracking a 'best' score at all.", "localStorage.setItem() throws an error if called more than once.", "Math.max is required by the localStorage API.", "It prevents the browser from clearing localStorage between sessions."], correct_answer: "Always overwriting would let a worse run replace a previously saved higher score, defeating the purpose of tracking a 'best' score at all.", explanation: "A 'best score' feature is only meaningful if worse attempts can't erase a better one — the comparison is what makes it a high score rather than just 'last score'.", question_type: Question_Type.multiple_choice },
      { phase_id: quizPhase5.id, question: "Complete the code that updates the stored best score only when the new score is higher:\nconst best = Number(localStorage.getItem('bestScore')) || 0;\nif (score > best) {\n  ___;\n}", correct_answer: "localStorage.setItem('bestScore', score);", explanation: "setItem only runs inside the if block, so the stored value is only ever replaced by a strictly higher score — a lower or equal score leaves the existing best untouched.", question_type: Question_Type.code_completion },
      { phase_id: quizPhase5.id, question: "Clicking 'Restart' resets the score to 0 internally, but the results screen stays visible with the old score shown — find and fix the bug:\nfunction restart() {\n  currentIndex = 0;\n  score = 0;\n}", correct_answer: "function restart() {\n  currentIndex = 0;\n  score = 0;\n  showQuizCard();\n  renderQuestion();\n}", explanation: "Resetting the state variables doesn't touch the DOM by itself — restart() also needs to hide the results screen, show the quiz card again, and call renderQuestion() to rebuild the visible UI from the reset state.", question_type: Question_Type.debug },
    ],
  });

  // ─── INTERMEDIATE PROJECT 1: REST API with Auth ──────────────────────────────
  const restApi = await prisma.projects.create({
    data: {
      name: "REST API with JWT Authentication",
      tech_stack: ["Node.js", "Express", "PostgreSQL", "JWT", "Prisma"],
      skill_level: Skill_Level.intermediate,
      estimated_minutes: 360,
      goal: "Build a secure REST API with JWT-based authentication, protected routes, and database integration.",
      // Needs the CRUD/state-management fundamentals from the To-Do List App.
      prerequisite_ids: [todo.id],
    },
  });
  console.log(`✅ Created project: ${restApi.name} (${restApi.id})`);

  const restPhase1 = await prisma.learningPhase.create({
    data: {
      project_id: restApi.id,
      title: "Project Setup & Database Modelling",
      description:
        "Bootstrap an Express server, configure Prisma with PostgreSQL, and design the schema.",
      concepts: [
        "Express middleware pipeline",
        "Prisma schema",
        "Migrations",
        "Environment variables",
      ],
      goal: {
        description:
          "Server runs on port 3000; User and Post models migrated to the database.",
      },
      phase_number: 1,
      phase_status: PhaseStatus.in_progress,
      estimated_minutes: 90,
    },
  });

  const restPhase2 = await prisma.learningPhase.create({
    data: {
      project_id: restApi.id,
      title: "Authentication Endpoints",
      description:
        "Implement /register and /login endpoints that issue signed JWTs.",
      concepts: [
        "bcrypt password hashing",
        "JWT sign & verify",
        "HTTP-only cookies",
        "Refresh tokens",
      ],
      goal: {
        description:
          "Clients can register, log in, and receive access + refresh tokens.",
      },
      phase_number: 2,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 90,
    },
  });

  const restPhase3 = await prisma.learningPhase.create({
    data: {
      project_id: restApi.id,
      title: "Protected Routes & CRUD",
      description:
        "Guard routes with a JWT middleware and implement full CRUD for Posts.",
      concepts: [
        "Express middleware",
        "Role-based access control",
        "Error handling middleware",
        "Pagination",
      ],
      goal: {
        description:
          "Only authenticated users can create/update/delete posts; list endpoint is public.",
      },
      phase_number: 3,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 120,
    },
  });

  const restPhase4 = await prisma.learningPhase.create({
    data: {
      project_id: restApi.id,
      title: "Testing & Documentation",
      description:
        "Write integration tests with Supertest and auto-generate OpenAPI docs with Swagger.",
      concepts: [
        "Supertest",
        "Jest test lifecycle",
        "OpenAPI 3.0",
        "Swagger UI Express",
      ],
      goal: {
        description:
          "≥80% test coverage; /api-docs serves interactive Swagger UI.",
      },
      phase_number: 4,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 60,
    },
  });

  await prisma.resources.createMany({
    data: [
      {
        phase_id: restPhase1.id,
        type: "video",
        title: "Prisma with Express full tutorial – Fireship",
        url: "https://www.youtube.com/watch?v=RebA5J-rlwg",
        duration_minutes: 15,
        provider: "Fireship",
        quality_score: 9.1,
      },
      {
        phase_id: restPhase2.id,
        type: "article",
        title: "JWT Authentication Best Practices",
        url: "https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/",
        duration_minutes: 20,
        provider: "Auth0",
        quality_score: 9.3,
      },
      {
        phase_id: restPhase3.id,
        type: "video",
        title: "Express Middleware Deep Dive – The Net Ninja",
        url: "https://www.youtube.com/watch?v=lY6icfhap2o",
        duration_minutes: 25,
        provider: "The Net Ninja",
        quality_score: 8.9,
      },
      {
        phase_id: restPhase4.id,
        type: "article",
        title: "Testing Node.js with Supertest – LogRocket",
        url: "https://blog.logrocket.com/testing-node-js-apps-using-supertest/",
        duration_minutes: 30,
        provider: "LogRocket",
        quality_score: 8.7,
      },
    ],
  });

  await prisma.knowledgeChecks.createMany({
    data: [
      {
        phase_id: restPhase2.id,
        question:
          "What is the purpose of a refresh token alongside an access token?",
        options: [
          "Refresh tokens replace access tokens entirely once issued.",
          "Refresh tokens are long-lived and used to obtain new short-lived access tokens without re-authentication.",
          "Refresh tokens are sent with every API request instead of access tokens.",
          "Refresh tokens encrypt the access token for transport.",
        ],
        correct_answer:
          "Refresh tokens are long-lived and used to obtain new short-lived access tokens without re-authentication.",
        explanation:
          "Short-lived access tokens limit exposure if stolen; refresh tokens allow transparent renewal.",
        question_type: Question_Type.multiple_choice,
      },
      {
        phase_id: restPhase3.id,
        question:
          "The following middleware never calls next(). Fix it so errors are forwarded to the error handler:\nasync function requireAuth(req, res, next) {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'No token' });\n  const payload = jwt.verify(token, process.env.SECRET);\n  req.user = payload;\n}",
        correct_answer: "Add next() after req.user = payload;",
        explanation:
          "Without next() the middleware chain stalls and subsequent handlers never execute.",
        question_type: Question_Type.debug,
      },
    ],
  });

  // ─── INTERMEDIATE PROJECT 2: Real-Time Chat App ──────────────────────────────
  const chat = await prisma.projects.create({
    data: {
      name: "Real-Time Chat Application",
      tech_stack: ["Next.js", "Socket.IO", "Redis", "TypeScript"],
      skill_level: Skill_Level.intermediate,
      estimated_minutes: 480,
      goal: "Build a scalable real-time chat application with rooms, presence, and message persistence.",
      // Combines the React frontend skills from the To-Do List App with the
      // backend/API fundamentals from the REST API project.
      prerequisite_ids: [todo.id, restApi.id],
    },
  });
  console.log(`✅ Created project: ${chat.name} (${chat.id})`);

  const chatPhase1 = await prisma.learningPhase.create({
    data: {
      project_id: chat.id,
      title: "WebSocket Fundamentals",
      description:
        "Understand the WebSocket protocol and integrate Socket.IO into a Next.js custom server.",
      concepts: [
        "WebSocket handshake",
        "Socket.IO rooms",
        "Namespaces",
        "Custom Next.js server",
      ],
      goal: {
        description:
          "Server and at least one client can exchange messages in real time.",
      },
      phase_number: 1,
      phase_status: PhaseStatus.in_progress,
      estimated_minutes: 120,
    },
  });

  const chatPhase2 = await prisma.learningPhase.create({
    data: {
      project_id: chat.id,
      title: "Rooms, Presence & Typing Indicators",
      description:
        "Support multiple chat rooms, show online users, and broadcast typing events.",
      concepts: [
        "Socket.IO rooms",
        "Volatile events",
        "Presence tracking",
        "Debouncing",
      ],
      goal: {
        description:
          "Users can join named rooms; typing indicators appear within 300 ms of keystrokes.",
      },
      phase_number: 2,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 120,
    },
  });

  const chatPhase3 = await prisma.learningPhase.create({
    data: {
      project_id: chat.id,
      title: "Message Persistence with Redis",
      description:
        "Store recent messages in Redis sorted sets so late-joiners see chat history.",
      concepts: [
        "Redis sorted sets (ZADD/ZRANGE)",
        "TTL & eviction",
        "Pub/Sub vs. streams",
        "Connection pooling",
      ],
      goal: {
        description:
          "Last 50 messages per room are loaded on join without a relational database.",
      },
      phase_number: 3,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 120,
    },
  });

  const chatPhase4 = await prisma.learningPhase.create({
    data: {
      project_id: chat.id,
      title: "Scaling with Redis Adapter",
      description:
        "Replace in-memory state with the Socket.IO Redis adapter to support multiple server instances.",
      concepts: [
        "Socket.IO Redis adapter",
        "Horizontal scaling",
        "Sticky sessions vs. pub/sub",
        "Health checks",
      ],
      goal: {
        description:
          "Two server instances can handle the same room transparently.",
      },
      phase_number: 4,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 120,
    },
  });

  await prisma.resources.createMany({
    data: [
      {
        phase_id: chatPhase1.id,
        type: "video",
        title: "Socket.IO Crash Course – Traversy Media",
        url: "https://www.youtube.com/watch?v=jD7FnbI76Hg",
        duration_minutes: 45,
        provider: "Traversy Media",
        quality_score: 9.0,
      },
      {
        phase_id: chatPhase3.id,
        type: "article",
        title: "Redis Data Types – Sorted Sets",
        url: "https://redis.io/docs/data-types/sorted-sets/",
        duration_minutes: 20,
        provider: "Redis",
        quality_score: 9.5,
      },
      {
        phase_id: chatPhase4.id,
        type: "article",
        title: "Socket.IO Redis Adapter Docs",
        url: "https://socket.io/docs/v4/redis-adapter/",
        duration_minutes: 25,
        provider: "Socket.IO",
        quality_score: 9.2,
      },
    ],
  });

  await prisma.knowledgeChecks.createMany({
    data: [
      {
        phase_id: chatPhase1.id,
        question:
          "What is the key difference between socket.emit() and socket.broadcast.emit()?",
        options: [
          "socket.emit() sends to everyone; socket.broadcast.emit() sends only to the sender.",
          "socket.emit() sends only to the sender; socket.broadcast.emit() sends to everyone except the sender.",
          "There is no functional difference between the two methods.",
          "socket.broadcast.emit() requires a room name while socket.emit() does not.",
        ],
        correct_answer:
          "socket.emit() sends only to the sender; socket.broadcast.emit() sends to everyone except the sender.",
        explanation:
          "Use io.emit() to send to all connected clients including the sender.",
        question_type: Question_Type.multiple_choice,
      },
      {
        phase_id: chatPhase3.id,
        question:
          "Write a Redis command to add a message with score (timestamp) 1712000000 and value 'Hello' to the sorted set 'room:general'.",
        correct_answer: "ZADD room:general 1712000000 Hello",
        explanation:
          "ZADD key score member adds a member with the given score; ZRANGE retrieves in ascending order.",
        question_type: Question_Type.code_completion,
      },
    ],
  });

  // ─── ADVANCED PROJECT 1: Distributed Task Queue ──────────────────────────────
  const taskQueue = await prisma.projects.create({
    data: {
      name: "Distributed Task Queue System",
      tech_stack: ["Go", "gRPC", "Redis", "PostgreSQL", "Docker"],
      skill_level: Skill_Level.advanced,
      estimated_minutes: 720,
      goal: "Design and implement a production-grade distributed task queue with workers, retries, and observability.",
      // Distributed-systems work builds directly on the API/DB fundamentals
      // from the REST API project.
      prerequisite_ids: [restApi.id],
    },
  });
  console.log(`✅ Created project: ${taskQueue.name} (${taskQueue.id})`);

  const tqPhase1 = await prisma.learningPhase.create({
    data: {
      project_id: taskQueue.id,
      title: "Queue Architecture & Redis Streams",
      description:
        "Design the queue topology using Redis Streams (XADD/XREADGROUP) for at-least-once delivery.",
      concepts: [
        "Redis Streams",
        "Consumer groups",
        "XACK & XPENDING",
        "Backpressure",
      ],
      goal: {
        description:
          "Producer sends 1 000 jobs; consumer group processes them with acknowledgement.",
      },
      phase_number: 1,
      phase_status: PhaseStatus.in_progress,
      estimated_minutes: 180,
    },
  });

  const tqPhase2 = await prisma.learningPhase.create({
    data: {
      project_id: taskQueue.id,
      title: "Worker Pool & Concurrency in Go",
      description:
        "Build a bounded worker pool using goroutines, channels, and the errgroup package.",
      concepts: [
        "Goroutines & channels",
        "sync.WaitGroup",
        "errgroup",
        "Context cancellation",
        "Rate limiting",
      ],
      goal: {
        description:
          "Worker pool processes jobs concurrently with configurable parallelism and graceful shutdown.",
      },
      phase_number: 2,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 180,
    },
  });

  const tqPhase3 = await prisma.learningPhase.create({
    data: {
      project_id: taskQueue.id,
      title: "gRPC Control Plane",
      description:
        "Expose queue operations (enqueue, status, cancel) over a gRPC API with streaming job status updates.",
      concepts: [
        "Protocol Buffers",
        "Server-streaming RPC",
        "Interceptors",
        "Deadlines & cancellation",
      ],
      goal: {
        description:
          "Clients enqueue jobs and stream real-time status updates via server-side streaming.",
      },
      phase_number: 3,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 180,
    },
  });

  const tqPhase4 = await prisma.learningPhase.create({
    data: {
      project_id: taskQueue.id,
      title: "Observability & Deployment",
      description:
        "Add structured logging, Prometheus metrics, distributed tracing with OpenTelemetry, and Dockerise the stack.",
      concepts: [
        "slog structured logging",
        "Prometheus counters/histograms",
        "OpenTelemetry traces",
        "Docker Compose health checks",
      ],
      goal: {
        description:
          "Grafana dashboard shows queue depth, throughput, and p99 latency in real time.",
      },
      phase_number: 4,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 180,
    },
  });

  await prisma.resources.createMany({
    data: [
      {
        phase_id: tqPhase1.id,
        type: "article",
        title: "Redis Streams Introduction",
        url: "https://redis.io/docs/data-types/streams/",
        duration_minutes: 30,
        provider: "Redis",
        quality_score: 9.5,
      },
      {
        phase_id: tqPhase2.id,
        type: "article",
        title: "Go Concurrency Patterns – Google I/O",
        url: "https://go.dev/blog/pipelines",
        duration_minutes: 45,
        provider: "go.dev",
        quality_score: 9.7,
      },
      {
        phase_id: tqPhase3.id,
        type: "article",
        title: "gRPC Server Streaming – official docs",
        url: "https://grpc.io/docs/what-is-grpc/core-concepts/#server-streaming-rpc",
        duration_minutes: 20,
        provider: "gRPC",
        quality_score: 9.4,
      },
      {
        phase_id: tqPhase4.id,
        type: "video",
        title: "OpenTelemetry in Go – Grafana Labs",
        url: "https://www.youtube.com/watch?v=v4C3K8QLSBA",
        duration_minutes: 35,
        provider: "Grafana Labs",
        quality_score: 9.1,
      },
    ],
  });

  await prisma.knowledgeChecks.createMany({
    data: [
      {
        phase_id: tqPhase1.id,
        question:
          "What command acknowledges a message in a Redis consumer group, removing it from the PEL?",
        correct_answer: "XACK stream-key group-name message-id",
        explanation:
          "Without XACK the message stays in the Pending Entries List and will be redelivered after the visibility timeout.",
        question_type: Question_Type.code_completion,
      },
      {
        phase_id: tqPhase2.id,
        question:
          "The following goroutine leaks because nothing closes the channel. Fix it:\nfunc produce(ch chan int) {\n  for i := 0; i < 10; i++ { ch <- i }\n}\nfunc main() {\n  ch := make(chan int)\n  go produce(ch)\n  for v := range ch { fmt.Println(v) }\n}",
        correct_answer:
          "Add `close(ch)` at the end of produce() after the loop.",
        explanation:
          "range over a channel blocks forever unless the channel is closed; the goroutine and main routine both hang.",
        question_type: Question_Type.debug,
      },
      {
        phase_id: tqPhase3.id,
        question:
          "What distinguishes a server-streaming RPC from a unary RPC in Protocol Buffers?",
        options: [
          "The request type is prefixed with `stream` instead of the response.",
          "The response type is prefixed with `stream`, e.g. `rpc Watch(JobId) returns (stream JobStatus);`",
          "Server-streaming RPCs require a separate .proto file from unary RPCs.",
          "There is no syntactic difference; it's determined entirely by server-side code.",
        ],
        correct_answer:
          "The response type is prefixed with `stream`, e.g. `rpc Watch(JobId) returns (stream JobStatus);`",
        explanation:
          "The server sends multiple messages over a single connection until it calls Done().",
        question_type: Question_Type.multiple_choice,
      },
    ],
  });

  // ─── ADVANCED PROJECT 2: ML-Powered Code Review Bot ─────────────────────────
  const codeBot = await prisma.projects.create({
    data: {
      name: "ML-Powered Code Review Bot",
      tech_stack: [
        "Python",
        "FastAPI",
        "LangChain",
        "OpenAI API",
        "GitHub Webhooks",
        "PostgreSQL",
      ],
      skill_level: Skill_Level.advanced,
      estimated_minutes: 600,
      goal: "Build an ML-powered code review bot that analyses pull requests and provides automated feedback using LLMs.",
      // Needs backend API fundamentals before layering on LLM integration.
      prerequisite_ids: [restApi.id],
    },
  });
  console.log(`✅ Created project: ${codeBot.name} (${codeBot.id})`);

  const cbPhase1 = await prisma.learningPhase.create({
    data: {
      project_id: codeBot.id,
      title: "GitHub Webhook Integration",
      description:
        "Register a GitHub App, receive pull_request events, and verify HMAC-SHA256 signatures.",
      concepts: [
        "GitHub Apps vs. OAuth Apps",
        "Webhook payloads",
        "HMAC-SHA256 signature verification",
        "Ngrok for local testing",
      ],
      goal: {
        description:
          "Server logs validated PR open/sync events from a test repository.",
      },
      phase_number: 1,
      phase_status: PhaseStatus.in_progress,
      estimated_minutes: 120,
    },
  });

  const cbPhase2 = await prisma.learningPhase.create({
    data: {
      project_id: codeBot.id,
      title: "Diff Parsing & Context Extraction",
      description:
        "Parse unified diffs, extract changed hunks, and enrich context with surrounding code.",
      concepts: [
        "Unified diff format",
        "AST parsing (tree-sitter)",
        "Chunking strategies",
        "Token budgets",
      ],
      goal: {
        description:
          "Pipeline extracts per-file diffs as structured objects ready for LLM prompting.",
      },
      phase_number: 2,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 120,
    },
  });

  const cbPhase3 = await prisma.learningPhase.create({
    data: {
      project_id: codeBot.id,
      title: "LangChain Review Chain",
      description:
        "Build a LangChain LCEL chain that generates line-level review comments from diff chunks.",
      concepts: [
        "LCEL pipe operator",
        "ChatPromptTemplate",
        "Output parsers",
        "Structured output with Pydantic",
      ],
      goal: {
        description:
          "Chain returns structured review comments (file, line, severity, message) for a given diff.",
      },
      phase_number: 3,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 180,
    },
  });

  const cbPhase4 = await prisma.learningPhase.create({
    data: {
      project_id: codeBot.id,
      title: "Posting Comments & Feedback Loop",
      description:
        "Post review comments back to GitHub PRs and store them for retrieval-augmented generation memory.",
      concepts: [
        "GitHub REST API – PR review comments",
        "pgvector embeddings",
        "RAG retrieval",
        "Rate limiting & retry",
      ],
      goal: {
        description:
          "Bot posts inline review comments; past reviews inform future ones via vector similarity.",
      },
      phase_number: 4,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 180,
    },
  });

  await prisma.resources.createMany({
    data: [
      {
        phase_id: cbPhase1.id,
        type: "article",
        title: "Creating a GitHub App – GitHub Docs",
        url: "https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps",
        duration_minutes: 30,
        provider: "GitHub Docs",
        quality_score: 9.4,
      },
      {
        phase_id: cbPhase2.id,
        type: "article",
        title: "tree-sitter – Introduction",
        url: "https://tree-sitter.github.io/tree-sitter/",
        duration_minutes: 20,
        provider: "tree-sitter",
        quality_score: 9.0,
      },
      {
        phase_id: cbPhase3.id,
        type: "article",
        title: "LangChain Expression Language (LCEL) – Docs",
        url: "https://python.langchain.com/docs/expression_language/",
        duration_minutes: 40,
        provider: "LangChain",
        quality_score: 9.3,
      },
      {
        phase_id: cbPhase4.id,
        type: "article",
        title: "pgvector – README & setup guide",
        url: "https://github.com/pgvector/pgvector",
        duration_minutes: 25,
        provider: "pgvector",
        quality_score: 9.1,
      },
    ],
  });

  await prisma.knowledgeChecks.createMany({
    data: [
      {
        phase_id: cbPhase1.id,
        question: "How do you verify a GitHub webhook payload is authentic?",
        options: [
          "Check that the request originates from a GitHub IP address range.",
          "Verify the payload's Content-Type header equals application/json.",
          "Compute HMAC-SHA256 of the raw request body using the webhook secret and compare to the X-Hub-Signature-256 header using a constant-time comparison.",
          "Decode the JWT included in the Authorization header.",
        ],
        correct_answer:
          "Compute HMAC-SHA256 of the raw request body using the webhook secret and compare to the X-Hub-Signature-256 header using a constant-time comparison.",
        explanation:
          "Constant-time comparison prevents timing attacks that could reveal the secret.",
        question_type: Question_Type.multiple_choice,
      },
      {
        phase_id: cbPhase3.id,
        question:
          "Complete the LCEL chain that pipes a prompt template into a chat model and then into a string output parser:\nfrom langchain_core.output_parsers import StrOutputParser\nchain = prompt ___ model ___ StrOutputParser()",
        correct_answer: "chain = prompt | model | StrOutputParser()",
        explanation:
          "The | operator composes LCEL runnables left-to-right, passing each output as input to the next.",
        question_type: Question_Type.code_completion,
      },
      {
        phase_id: cbPhase4.id,
        question:
          "The bot is double-posting comments on re-runs. Debug the issue:\nasync def post_review(pr_number, comments):\n    for c in comments:\n        await github.post_comment(pr_number, c)\n# called on every push event",
        correct_answer:
          "Check if a comment with the same fingerprint (file+line+message hash) already exists before posting.",
        explanation:
          "Idempotency keys prevent duplicate side effects when webhooks fire multiple times for the same push.",
        question_type: Question_Type.debug,
      },
    ],
  });

  // ─── ENTRANCE TEST QUESTION POOL ────────────────────────────────────────────
  console.log("\n🧪 Seeding entrance test questions...");

  await prisma.entranceQuestion.createMany({
    data: [
      // ── EASY (6 questions) ─────────────────────────────────────────────────
      {
        question:
          "Which HTML element semantically represents a navigation menu?",
        options: ["<section>", "<nav>", "<aside>", "<header>"],
        correct_option: 1,
        explanation:
          "<nav> is the semantic element for groups of navigation links.",
        description:
          "<nav> is the semantic element for groups of navigation links.",
        difficulty: Difficulty.easy,
        topic: "HTML",
      },
      {
        question: "What does CSS stand for?",
        options: [
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Computer Style Syntax",
          "Coloured Style Sheets",
        ],
        correct_option: 1,
        explanation:
          "CSS stands for Cascading Style Sheets — it describes how HTML elements are displayed.",
        description:
          "CSS stands for Cascading Style Sheets — it describes how HTML elements are displayed.",
        difficulty: Difficulty.easy,
        topic: "CSS",
      },
      {
        question:
          "Which JavaScript method is used to add an element to the end of an array?",
        options: [
          "array.append()",
          "array.push()",
          "array.insert()",
          "array.add()",
        ],
        correct_option: 1,
        explanation:
          "Array.push() adds one or more elements to the end of an array and returns the new length.",
        description:
          "Array.push() adds one or more elements to the end of an array and returns the new length.",
        difficulty: Difficulty.easy,
        topic: "JavaScript",
      },
      {
        question:
          "What hook do you use to add local state to a React functional component?",
        options: ["useEffect", "useContext", "useState", "useRef"],
        correct_option: 2,
        explanation:
          "useState returns a state value and a setter function for local component state.",
        description:
          "useState returns a state value and a setter function for local component state.",
        difficulty: Difficulty.easy,
        topic: "React",
      },
      {
        question:
          "Which HTTP method is typically used to retrieve data from a server?",
        options: ["POST", "PUT", "GET", "DELETE"],
        correct_option: 2,
        explanation:
          "GET requests retrieve data without modifying the server state.",
        description:
          "GET requests retrieve data without modifying the server state.",
        difficulty: Difficulty.easy,
        topic: "HTTP",
      },
      {
        question: "What does 'responsive design' mean?",
        options: [
          "A website that loads quickly",
          "A website that adapts its layout to different screen sizes",
          "A website that responds to keyboard shortcuts",
          "A website with fast server response times",
        ],
        correct_option: 1,
        explanation:
          "Responsive design uses flexible layouts and media queries to adapt to any viewport size.",
        description:
          "Responsive design uses flexible layouts and media queries to adapt to any viewport size.",
        difficulty: Difficulty.easy,
        topic: "CSS",
      },

      // ── INTERMEDIATE (6 questions) ─────────────────────────────────────────
      {
        question: "What is the primary purpose of a database index?",
        options: [
          "To enforce uniqueness on a column",
          "To speed up data retrieval at the cost of extra storage",
          "To encrypt sensitive columns",
          "To create foreign key constraints",
        ],
        correct_option: 1,
        explanation:
          "Indexes allow the database engine to find rows quickly without scanning the full table.",
        description:
          "Indexes allow the database engine to find rows quickly without scanning the full table.",
        difficulty: Difficulty.intermediate,
        topic: "Databases",
      },
      {
        question:
          "Which HTTP status code indicates a resource was successfully created?",
        options: ["200 OK", "204 No Content", "201 Created", "202 Accepted"],
        correct_option: 2,
        explanation:
          "201 Created is the standard response for a successful POST that creates a new resource.",
        description:
          "201 Created is the standard response for a successful POST that creates a new resource.",
        difficulty: Difficulty.intermediate,
        topic: "REST APIs",
      },
      {
        question:
          "What is the difference between synchronous and asynchronous code in JavaScript?",
        options: [
          "Synchronous code runs in parallel; asynchronous runs sequentially",
          "Synchronous code blocks further execution; asynchronous code does not block while waiting",
          "Asynchronous code is always faster than synchronous",
          "There is no real difference in modern JavaScript",
        ],
        correct_option: 1,
        explanation:
          "Asynchronous code (via Promises/async-await) allows the event loop to continue while I/O operations complete.",
        description:
          "Asynchronous code (via Promises/async-await) allows the event loop to continue while I/O operations complete.",
        difficulty: Difficulty.intermediate,
        topic: "JavaScript",
      },
      {
        question:
          "In JWT authentication, what are the three dot-separated parts?",
        options: [
          "Header, Payload, Signature",
          "Key, Value, Hash",
          "Algorithm, Claims, Secret",
          "ID, Data, Token",
        ],
        correct_option: 0,
        explanation:
          "A JWT is a Base64-encoded Header + Payload (claims) + Signature, separated by dots.",
        description:
          "A JWT is a Base64-encoded Header + Payload (claims) + Signature, separated by dots.",
        difficulty: Difficulty.intermediate,
        topic: "Authentication",
      },
      {
        question:
          "What does the 'useEffect' hook do when given an empty dependency array []?",
        options: [
          "Runs on every render",
          "Never runs",
          "Runs once after the initial render",
          "Runs before every render",
        ],
        correct_option: 2,
        explanation:
          "An empty dependency array tells React to run the effect only after the first render (mount).",
        description:
          "An empty dependency array tells React to run the effect only after the first render (mount).",
        difficulty: Difficulty.intermediate,
        topic: "React",
      },
      {
        question:
          "Which SQL clause is used to filter results after a GROUP BY?",
        options: ["WHERE", "FILTER", "HAVING", "AND"],
        correct_option: 2,
        explanation:
          "HAVING filters grouped rows, whereas WHERE filters individual rows before grouping.",
        description:
          "HAVING filters grouped rows, whereas WHERE filters individual rows before grouping.",
        difficulty: Difficulty.intermediate,
        topic: "Databases",
      },

      // ── ADVANCED (6 questions) ─────────────────────────────────────────────
      {
        question: "In distributed systems, what does the CAP theorem state?",
        options: [
          "A system can be fast, cheap, and reliable simultaneously",
          "A distributed system can guarantee at most two of: Consistency, Availability, and Partition tolerance",
          "Caching, Async processing, and Partitioning are the three pillars of scalability",
          "All distributed systems are eventually consistent",
        ],
        correct_option: 1,
        explanation:
          "CAP theorem: in the presence of a network partition, you must choose between consistency and availability.",
        description:
          "CAP theorem: in the presence of a network partition, you must choose between consistency and availability.",
        difficulty: Difficulty.advanced,
        topic: "System Design",
      },
      {
        question: "What is the purpose of a database read replica?",
        options: [
          "To provide a backup for disaster recovery only",
          "To serve read-heavy traffic and reduce load on the primary write node",
          "To enforce schema migrations",
          "To store large binary objects separately",
        ],
        correct_option: 1,
        explanation:
          "Read replicas scale out read throughput by directing SELECT queries away from the write primary.",
        description:
          "Read replicas scale out read throughput by directing SELECT queries away from the write primary.",
        difficulty: Difficulty.advanced,
        topic: "System Design",
      },
      {
        question: "What does the Go keyword 'defer' do?",
        options: [
          "Pauses execution for a duration",
          "Runs a function concurrently as a goroutine",
          "Schedules a function call to run just before the surrounding function returns",
          "Marks a function as non-blocking",
        ],
        correct_option: 2,
        explanation:
          "defer pushes a function call onto a stack that is executed in LIFO order when the surrounding function returns.",
        description:
          "defer pushes a function call onto a stack that is executed in LIFO order when the surrounding function returns.",
        difficulty: Difficulty.advanced,
        topic: "Go",
      },
      {
        question:
          "What is the main advantage of Protocol Buffers over JSON for service-to-service communication?",
        options: [
          "Human readable and easier to debug",
          "Supported by all browsers natively",
          "Smaller payload size and faster serialisation/deserialisation due to binary encoding",
          "Does not require a schema",
        ],
        correct_option: 2,
        explanation:
          "Protobuf binary encoding is typically 3-10x smaller and 5-10x faster to parse than equivalent JSON.",
        description:
          "Protobuf binary encoding is typically 3-10x smaller and 5-10x faster to parse than equivalent JSON.",
        difficulty: Difficulty.advanced,
        topic: "gRPC",
      },
      {
        question: "What problem does database connection pooling solve?",
        options: [
          "Prevents SQL injection attacks",
          "Reduces the overhead of establishing new database connections by reusing existing ones",
          "Automatically scales the number of database instances",
          "Encrypts database connections",
        ],
        correct_option: 1,
        explanation:
          "Opening a DB connection is expensive; a pool keeps a set of connections open and reuses them across requests.",
        description:
          "Opening a DB connection is expensive; a pool keeps a set of connections open and reuses them across requests.",
        difficulty: Difficulty.advanced,
        topic: "Databases",
      },
      {
        question:
          "In React, what is the purpose of 'key' when reconciling lists and why must it be stable?",
        options: [
          "It is used for CSS styling; stability ensures consistent design",
          "It identifies elements for React's diffing algorithm; unstable keys (e.g. array index) cause unnecessary unmounts and remounts",
          "It is only relevant for accessibility — screen readers use it",
          "It prevents duplicate API calls for list items",
        ],
        correct_option: 1,
        explanation:
          "React uses key to match old and new tree nodes. Using index as key breaks diffing when items are reordered.",
        description:
          "React uses key to match old and new tree nodes. Using index as key breaks diffing when items are reordered.",
        difficulty: Difficulty.advanced,
        topic: "React",
      },
    ],
  });

  console.log(
    "✅ Seeded 18 entrance test questions (6 easy / 6 intermediate / 6 advanced)",
  );

  console.log("\n✨ Seeding complete!");
  console.log("   Projects seeded:");
  console.log("   • [beginner]      Personal Portfolio Website");
  console.log("   • [beginner]      To-Do List App");
  console.log("   • [intermediate]  REST API with JWT Authentication");
  console.log("   • [intermediate]  Real-Time Chat Application");
  console.log("   • [advanced]      Distributed Task Queue System");
  console.log("   • [advanced]      ML-Powered Code Review Bot");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
