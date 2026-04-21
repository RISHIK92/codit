// services/shared/src/index.ts
import { PrismaClient } from "./generated/prisma-client";

// Instantiate it once here
export const prisma = new PrismaClient();

// Export the types so your services can use them
export * from "./generated/prisma-client";
