import dotenv from "dotenv";
import path from "path";

// Anchored on cwd (always this service's own directory, via npm scripts),
// not __dirname — __dirname differs by depth between the compiled
// dist/ai-service/src/config and running server.ts directly (ts-node-dev).
// Preserve an externally supplied GROQ_API_KEY while loading the shared
// local default.
dotenv.config({
  path: path.resolve(process.cwd(), "../shared/.env"),
  override: false,
});
