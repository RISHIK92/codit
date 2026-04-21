import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const email = "rishik3555@gmail.com";
  // 1. Find or create the test user (User table, uses uid)
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return
  }

  // 2. Get 6 projects from the catalogue
  const projects = await prisma.projects.findMany({ take: 6 });
  if (projects.length < 6) {
    throw new Error("Not enough projects in the catalogue (need at least 6)");
  }

  // 3. Create 6 user projects with status 'abandoned'
  for (const project of projects) {
    await prisma.userProjects.create({
      data: {
        user_email: user.email,
        project_id: project.id,
        status: "abandoned",
        current_phase: 0,
      },
    });
  }

  console.log("Seeded 6 abandoned user projects for", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
