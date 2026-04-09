import {
  PrismaClient,
  Skill_Level,
  PhaseStatus,
  Question_Type,
} from "@prisma/client";

// Helper: create an EligibilityTest with 5 questions for a project
async function seedEligibilityTest(
  prisma: PrismaClient,
  projectId: string,
  title: string,
  questions: {
    question: string;
    options: [string, string, string, string];
    correct_option: number;
    explanation: string;
  }[],
) {
  const test = await prisma.eligibilityTest.create({
    data: {
      project_id: projectId,
      title,
    },
  });
  await prisma.eligibilityQuestion.createMany({
    data: questions.map((q) => ({
      test_id: test.id,
      question: q.question,
      options: q.options,
      correct_option: q.correct_option,
      explanation: q.explanation,
    })),
  });
  return test;
}

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

  // Eligibility Test
  await seedEligibilityTest(
    prisma,
    portfolio.id,
    "Personal Portfolio Website – Eligibility Check",
    [
      {
        question:
          "Which HTML element semantically represents the main navigation of a page?",
        options: ["<section>", "<nav>", "<aside>", "<header>"],
        correct_option: 1,
        explanation:
          "<nav> is the semantic element for groups of navigation links.",
      },
      {
        question:
          "Which CSS property is used to make a flex container wrap its items onto multiple lines?",
        options: [
          "flex-direction: wrap",
          "flex-wrap: wrap",
          "align-items: wrap",
          "flex-flow: nowrap",
        ],
        correct_option: 1,
        explanation:
          "flex-wrap: wrap allows flex items to overflow onto the next line.",
      },
      {
        question:
          "What does document.querySelector('#toggle') return if no element with id 'toggle' exists?",
        options: ["undefined", "null", "0", "false"],
        correct_option: 1,
        explanation:
          "querySelector returns null when no matching element is found.",
      },
      {
        question:
          "Which CSS unit is relative to the font-size of the root element?",
        options: ["em", "px", "rem", "vh"],
        correct_option: 2,
        explanation:
          "rem (root em) is relative to the <html> element's font-size.",
      },
      {
        question: "What attribute should images always have for accessibility?",
        options: ["title", "src", "alt", "id"],
        correct_option: 2,
        explanation:
          "The alt attribute provides alternative text for screen readers and when the image fails to load.",
      },
    ],
  );
  console.log(`✅ Created eligibility test for: ${portfolio.name}`);

  // ─── BEGINNER PROJECT 2: To-Do List App ─────────────────────────────────────
  const todo = await prisma.projects.create({
    data: {
      name: "To-Do List App",
      tech_stack: ["React", "TypeScript", "Tailwind CSS"],
      skill_level: Skill_Level.beginner,
      estimated_minutes: 240,
    },
  });
  console.log(`✅ Created project: ${todo.name} (${todo.id})`);

  const todoPhase1 = await prisma.learningPhase.create({
    data: {
      project_id: todo.id,
      title: "React & TypeScript Foundations",
      description:
        "Set up a Vite + React + TypeScript project and learn component basics.",
      concepts: [
        "JSX",
        "Functional components",
        "Props & types",
        "useState hook",
      ],
      goal: {
        description:
          "Scaffold the project and render a static list of tasks as components.",
      },
      phase_number: 1,
      phase_status: PhaseStatus.in_progress,
      estimated_minutes: 60,
    },
  });

  const todoPhase2 = await prisma.learningPhase.create({
    data: {
      project_id: todo.id,
      title: "CRUD Operations",
      description:
        "Implement add, complete, and delete task functionality with proper state management.",
      concepts: [
        "useReducer",
        "Immutable state updates",
        "Controlled inputs",
        "Key prop",
      ],
      goal: {
        description:
          "Users can add, tick off, and delete tasks with immediate UI updates.",
      },
      phase_number: 2,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 90,
    },
  });

  const todoPhase3 = await prisma.learningPhase.create({
    data: {
      project_id: todo.id,
      title: "Persistence & Filters",
      description:
        "Persist tasks in localStorage and add All / Active / Completed filter tabs.",
      concepts: [
        "localStorage API",
        "useEffect",
        "Derived state",
        "URL search params",
      ],
      goal: {
        description:
          "Tasks survive a page refresh and can be filtered by status.",
      },
      phase_number: 3,
      phase_status: PhaseStatus.locked,
      estimated_minutes: 90,
    },
  });

  await prisma.resources.createMany({
    data: [
      {
        phase_id: todoPhase1.id,
        type: "video",
        title: "React + TypeScript Crash Course – Traversy Media",
        url: "https://www.youtube.com/watch?v=jrKcJxF0lAU",
        duration_minutes: 90,
        provider: "Traversy Media",
        quality_score: 9.0,
      },
      {
        phase_id: todoPhase2.id,
        type: "article",
        title: "useReducer – React Docs",
        url: "https://react.dev/reference/react/useReducer",
        duration_minutes: 20,
        provider: "react.dev",
        quality_score: 9.6,
      },
      {
        phase_id: todoPhase3.id,
        type: "article",
        title: "localStorage with React – useLocalStorage pattern",
        url: "https://usehooks.com/uselocalstorage",
        duration_minutes: 15,
        provider: "useHooks",
        quality_score: 8.8,
      },
    ],
  });

  await prisma.knowledgeChecks.createMany({
    data: [
      {
        phase_id: todoPhase1.id,
        question:
          "Define a TypeScript interface for a Task that has an id (string), title (string), and completed (boolean).",
        correct_answer:
          "interface Task { id: string; title: string; completed: boolean; }",
        explanation:
          "Typed interfaces ensure compile-time safety across the component tree.",
        question_type: Question_Type.code_completion,
      },
      {
        phase_id: todoPhase2.id,
        question: "Why should you never mutate state directly in React?",
        correct_answer:
          "React compares references to detect changes; mutating in place bypasses this and prevents re-renders.",
        explanation:
          "Return new objects/arrays to trigger the reconciler correctly.",
        question_type: Question_Type.multiple_choice,
      },
    ],
  });

  await seedEligibilityTest(
    prisma,
    todo.id,
    "To-Do List App – Eligibility Check",
    [
      {
        question:
          "What hook do you use to add local state to a React functional component?",
        options: ["useEffect", "useContext", "useState", "useRef"],
        correct_option: 2,
        explanation:
          "useState returns a state value and a setter function for local component state.",
      },
      {
        question:
          "What is the correct TypeScript type for a function that returns nothing?",
        options: ["null", "undefined", "void", "never"],
        correct_option: 2,
        explanation:
          "void is used as the return type of functions that do not explicitly return a value.",
      },
      {
        question:
          "Which hook is used to run a side-effect after every render in React?",
        options: ["useState", "useMemo", "useCallback", "useEffect"],
        correct_option: 3,
        explanation:
          "useEffect runs after the render phase; passing an empty array makes it run only on mount.",
      },
      {
        question:
          "In JSX, what prop must be unique among siblings when rendering a list?",
        options: ["id", "name", "key", "index"],
        correct_option: 2,
        explanation:
          "The key prop helps React identify which items changed, were added, or removed.",
      },
      {
        question:
          "What does the spread operator (...) do when used with an array in JavaScript?",
        options: [
          "Creates a reference to the array",
          "Copies array elements into a new context",
          "Reverses the array",
          "Flattens nested arrays",
        ],
        correct_option: 1,
        explanation:
          "The spread operator shallow-copies array elements, enabling immutable state patterns.",
      },
    ],
  );
  console.log(`✅ Created eligibility test for: ${todo.name}`);

  // ─── INTERMEDIATE PROJECT 1: REST API with Auth ──────────────────────────────
  const restApi = await prisma.projects.create({
    data: {
      name: "REST API with JWT Authentication",
      tech_stack: ["Node.js", "Express", "PostgreSQL", "JWT", "Prisma"],
      skill_level: Skill_Level.intermediate,
      estimated_minutes: 360,
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

  await seedEligibilityTest(
    prisma,
    restApi.id,
    "REST API with JWT Authentication – Eligibility Check",
    [
      {
        question: "What does REST stand for?",
        options: [
          "Remote Execution State Transfer",
          "Representational State Transfer",
          "Resource Endpoint Service Transfer",
          "Reactive Server Technology",
        ],
        correct_option: 1,
        explanation:
          "REST (Representational State Transfer) is an architectural style for distributed hypermedia systems.",
      },
      {
        question:
          "Which HTTP status code indicates a resource was successfully created?",
        options: ["200 OK", "204 No Content", "201 Created", "202 Accepted"],
        correct_option: 2,
        explanation:
          "201 Created is the standard response for a successful POST that creates a new resource.",
      },
      {
        question: "In JWT, what are the three dot-separated parts called?",
        options: [
          "Header, Payload, Signature",
          "Key, Value, Hash",
          "Algorithm, Claims, Secret",
          "ID, Data, Token",
        ],
        correct_option: 0,
        explanation:
          "A JWT is composed of a Base64-encoded Header, Payload (claims), and Signature.",
      },
      {
        question: "What is the primary purpose of a database migration?",
        options: [
          "To move data between servers",
          "To version-control schema changes",
          "To back up the database",
          "To seed test data",
        ],
        correct_option: 1,
        explanation:
          "Migrations track incremental schema changes, letting teams evolve the database safely over time.",
      },
      {
        question:
          "Which Express function registers a middleware that runs for every incoming request?",
        options: ["app.get()", "app.route()", "app.use()", "app.all()"],
        correct_option: 2,
        explanation:
          "app.use() mounts a middleware function at a path; without a path it applies to all requests.",
      },
    ],
  );
  console.log(`✅ Created eligibility test for: ${restApi.name}`);

  // ─── INTERMEDIATE PROJECT 2: Real-Time Chat App ──────────────────────────────
  const chat = await prisma.projects.create({
    data: {
      name: "Real-Time Chat Application",
      tech_stack: ["Next.js", "Socket.IO", "Redis", "TypeScript"],
      skill_level: Skill_Level.intermediate,
      estimated_minutes: 480,
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

  await seedEligibilityTest(
    prisma,
    chat.id,
    "Real-Time Chat Application – Eligibility Check",
    [
      {
        question:
          "What protocol does Socket.IO use by default for real-time communication?",
        options: [
          "HTTP long polling only",
          "WebSocket (with HTTP polling fallback)",
          "TCP raw sockets",
          "Server-Sent Events",
        ],
        correct_option: 1,
        explanation:
          "Socket.IO first upgrades to WebSocket; it falls back to HTTP long polling when WebSocket is unavailable.",
      },
      {
        question:
          "What is the difference between socket.emit() and io.to(room).emit()?",
        options: [
          "No difference",
          "socket.emit() sends to all; io.to(room).emit() sends to sender only",
          "socket.emit() sends to the connected client; io.to(room).emit() sends to all in a room",
          "io.to(room).emit() is deprecated",
        ],
        correct_option: 2,
        explanation:
          "socket.emit targets the individual socket; io.to(room) broadcasts to every socket in the named room.",
      },
      {
        question:
          "Which Redis data structure is best suited for storing a sorted list of chat messages by timestamp?",
        options: ["Hash", "List", "Sorted Set", "Set"],
        correct_option: 2,
        explanation:
          "Sorted Sets (ZADD/ZRANGE) store members with a numeric score, making timestamp-based ordering trivial.",
      },
      {
        question:
          "What does 'volatile' mean in Socket.IO when emitting an event?",
        options: [
          "The event is encrypted",
          "The event is dropped if the client is not connected",
          "The event triggers an acknowledgement",
          "The event is broadcast to all namespaces",
        ],
        correct_option: 1,
        explanation:
          "Volatile emits are fire-and-forget; useful for typing indicators where dropped events are acceptable.",
      },
      {
        question:
          "In a Next.js app, which file would you customise to attach a Socket.IO server?",
        options: [
          "next.config.ts",
          "middleware.ts",
          "A custom server.js/ts entry point",
          "app/layout.tsx",
        ],
        correct_option: 2,
        explanation:
          "Socket.IO requires direct access to the HTTP server, which is only possible through a custom Node.js server entry point.",
      },
    ],
  );
  console.log(`✅ Created eligibility test for: ${chat.name}`);

  // ─── ADVANCED PROJECT 1: Distributed Task Queue ──────────────────────────────
  const taskQueue = await prisma.projects.create({
    data: {
      name: "Distributed Task Queue System",
      tech_stack: ["Go", "gRPC", "Redis", "PostgreSQL", "Docker"],
      skill_level: Skill_Level.advanced,
      estimated_minutes: 720,
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
        correct_answer:
          "The response type is prefixed with `stream`, e.g. `rpc Watch(JobId) returns (stream JobStatus);`",
        explanation:
          "The server sends multiple messages over a single connection until it calls Done().",
        question_type: Question_Type.multiple_choice,
      },
    ],
  });

  await seedEligibilityTest(
    prisma,
    taskQueue.id,
    "Distributed Task Queue System – Eligibility Check",
    [
      {
        question: "Which Go keyword is used to start a new goroutine?",
        options: ["async", "go", "thread", "spawn"],
        correct_option: 1,
        explanation:
          "The go keyword starts a goroutine — a lightweight concurrently-executed function.",
      },
      {
        question: "What does the XACK command do in Redis Streams?",
        options: [
          "Adds a new message to the stream",
          "Deletes all pending messages",
          "Acknowledges a message, removing it from the Pending Entries List",
          "Lists all consumer groups",
        ],
        correct_option: 2,
        explanation:
          "Without XACK the message stays in the PEL and will be redelivered after the visibility timeout.",
      },
      {
        question: "How do you safely pass data between goroutines in Go?",
        options: [
          "Use a global variable with a mutex",
          "Use channels",
          "Use shared memory without synchronisation",
          "Use HTTP requests",
        ],
        correct_option: 1,
        explanation:
          "Channels are Go's primary mechanism for safe communication between goroutines.",
      },
      {
        question:
          "In Protocol Buffers, which file extension is used for schema definitions?",
        options: [".json", ".yaml", ".proto", ".pb"],
        correct_option: 2,
        explanation:
          ".proto files define message types and service RPCs; they are compiled to language-specific code.",
      },
      {
        question: "What is the purpose of context.WithCancel() in Go?",
        options: [
          "Creates a new goroutine",
          "Returns a context and a function to cancel it, propagating cancellation to child contexts",
          "Sets a deadline on a network call",
          "Recovers from a panic",
        ],
        correct_option: 1,
        explanation:
          "context.WithCancel lets you cancel long-running operations and their children by calling the returned cancel function.",
      },
    ],
  );
  console.log(`✅ Created eligibility test for: ${taskQueue.name}`);

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

  await seedEligibilityTest(
    prisma,
    codeBot.id,
    "ML-Powered Code Review Bot – Eligibility Check",
    [
      {
        question:
          "What does HMAC stand for in the context of webhook signature verification?",
        options: [
          "Hash-based Message Authentication Code",
          "HTTP Method Access Control",
          "Hosted Microservice API Check",
          "Header Meta-Authentication Credential",
        ],
        correct_option: 0,
        explanation:
          "HMAC uses a shared secret key combined with a hash function to verify message integrity and authenticity.",
      },
      {
        question:
          "In the unified diff format, what does a line starting with '+' mean?",
        options: [
          "A line that was deleted",
          "A context line (unchanged)",
          "A line that was added",
          "A file header",
        ],
        correct_option: 2,
        explanation:
          "Lines prefixed with '+' were added in the change; '-' lines were removed; unchanged lines have no prefix.",
      },
      {
        question: "What is the LangChain pipe operator (|) used for?",
        options: [
          "Parallel execution of chains",
          "Composing runnables left-to-right, passing each output as the next input",
          "Merging two prompt templates",
          "Logging intermediate outputs",
        ],
        correct_option: 1,
        explanation:
          "The | operator is LCEL syntax for chaining runnables sequentially.",
      },
      {
        question: "What is pgvector used for in a RAG pipeline?",
        options: [
          "Storing relational tables",
          "Caching HTTP responses",
          "Storing and querying high-dimensional vector embeddings",
          "Running Python functions inside PostgreSQL",
        ],
        correct_option: 2,
        explanation:
          "pgvector extends PostgreSQL with a vector data type and ANN index operators for similarity search.",
      },
      {
        question:
          "Why should webhook signature verification use a constant-time comparison function?",
        options: [
          "To improve performance",
          "To prevent timing attacks that could reveal the secret",
          "To support multiple hashing algorithms simultaneously",
          "To allow async verification",
        ],
        correct_option: 1,
        explanation:
          "Standard string comparison short-circuits on the first mismatch; constant-time comparison always takes the same duration, preventing timing-based secret leakage.",
      },
    ],
  );
  console.log(`✅ Created eligibility test for: ${codeBot.name}`);

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
