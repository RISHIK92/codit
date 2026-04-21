/*
  Warnings:

  - You are about to drop the `EligibilityQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EligibilityTest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `goal` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('in_progress', 'completed');

-- DropForeignKey
ALTER TABLE "EligibilityQuestion" DROP CONSTRAINT "EligibilityQuestion_test_id_fkey";

-- DropForeignKey
ALTER TABLE "EligibilityTest" DROP CONSTRAINT "EligibilityTest_project_id_fkey";

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "demo_url" TEXT,
ADD COLUMN     "goal" TEXT NOT NULL;

-- DropTable
DROP TABLE "EligibilityQuestion";

-- DropTable
DROP TABLE "EligibilityTest";

-- CreateTable
CREATE TABLE "EntranceQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correct_option" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EntranceTestAttempt" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "status" "TestStatus" NOT NULL DEFAULT 'in_progress',
    "round" INTEGER NOT NULL DEFAULT 1,
    "answers" JSONB NOT NULL DEFAULT '[]',
    "result_level" "Skill_Level",
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "EntranceQuestion_id_key" ON "EntranceQuestion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EntranceTestAttempt_id_key" ON "EntranceTestAttempt"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EntranceTestAttempt_user_email_key" ON "EntranceTestAttempt"("user_email");

-- AddForeignKey
ALTER TABLE "EntranceTestAttempt" ADD CONSTRAINT "EntranceTestAttempt_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
