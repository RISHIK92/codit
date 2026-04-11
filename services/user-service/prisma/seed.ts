import {
  PrismaClient,
  Skill_Level,
  PhaseStatus,
  Question_Type,
  Difficulty,
} from "@prisma/client";

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
  const todo = await prisma.projects.create({
    data: {
      name: "To-Do List App",
      tech_stack: ["React", "TypeScript", "Tailwind CSS"],
      skill_level: Skill_Level.beginner,
      estimated_minutes: 240,
      goal: "Build a fully functional to-do list application with CRUD operations and local state management.",
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

  // ─── INTERMEDIATE PROJECT 1: REST API with Auth ──────────────────────────────
  const restApi = await prisma.projects.create({
    data: {
      name: "REST API with JWT Authentication",
      tech_stack: ["Node.js", "Express", "PostgreSQL", "JWT", "Prisma"],
      skill_level: Skill_Level.intermediate,
      estimated_minutes: 360,
      goal: "Build a secure REST API with JWT-based authentication, protected routes, and database integration.",
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

  // ─── INTERMEDIATE PROJECT 2: Real-Time Chat App ──────────────────────────────
  const chat = await prisma.projects.create({
    data: {
      name: "Real-Time Chat Application",
      tech_stack: ["Next.js", "Socket.IO", "Redis", "TypeScript"],
      skill_level: Skill_Level.intermediate,
      estimated_minutes: 480,
      goal: "Build a scalable real-time chat application with rooms, presence, and message persistence.",
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

  // ─── ADVANCED PROJECT 1: Distributed Task Queue ──────────────────────────────
  const taskQueue = await prisma.projects.create({
    data: {
      name: "Distributed Task Queue System",
      tech_stack: ["Go", "gRPC", "Redis", "PostgreSQL", "Docker"],
      skill_level: Skill_Level.advanced,
      estimated_minutes: 720,
      goal: "Design and implement a production-grade distributed task queue with workers, retries, and observability.",
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
