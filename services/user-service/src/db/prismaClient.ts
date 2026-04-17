// Re-export the shared singleton so all existing imports within user-service
// continue to work without modification.
export { prisma } from "../../../shared/src/index";

export * from "../../../shared/src/index";
