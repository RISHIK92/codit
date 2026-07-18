import dotenv from "dotenv";
import path from "path";

// Anchored on cwd (always this service's own directory, via npm scripts),
// not __dirname — __dirname differs by depth between the compiled
// dist/user-service/src/config and running server.ts directly (ts-node-dev).
// Preserves values supplied by the process (Docker, CI, or production).
dotenv.config({
  path: path.resolve(process.cwd(), "../shared/.env"),
  override: false,
});
