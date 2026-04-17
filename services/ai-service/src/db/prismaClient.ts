// Re-export the shared singleton so all existing imports within user-service
// continue to work without modification.
import { prisma } from "../../../shared/src/index";

export default prisma;
