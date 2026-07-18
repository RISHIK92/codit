// services/shared/src/logger.ts
// One structured logger shared by every Node service (ai-service,
// resource-service, user-service), each scoped with its own name so log
// lines can be told apart when aggregated.
import pino from "pino";

export function createLogger(service: string) {
  return pino({
    name: service,
    level: process.env.LOG_LEVEL || "info",
  });
}

export type Logger = ReturnType<typeof createLogger>;
