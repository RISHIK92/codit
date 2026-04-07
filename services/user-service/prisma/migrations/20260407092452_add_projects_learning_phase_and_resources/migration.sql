-- CreateEnum
CREATE TYPE "Skill_Level" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('in_progress', 'completed', 'abandoned');

-- CreateEnum
CREATE TYPE "Question_Type" AS ENUM ('code_completion', 'multiple_choice', 'debug');

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tech_stack" TEXT[],
    "skill_level" "Skill_Level" NOT NULL,
    "estimated_minutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PreferenceQuestions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "descriptiveAnswer" TEXT,
    "solution" TEXT NOT NULL,
    "project_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserProjects" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "current_phase" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "LearningPhase" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "concepts" TEXT[],
    "goal" JSONB,
    "phase_number" INTEGER NOT NULL,
    "estimated_minutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KnowledgeChecks" (
    "id" TEXT NOT NULL,
    "phase_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correct_answer" TEXT,
    "explanation" TEXT NOT NULL,
    "question_type" "Question_Type" NOT NULL
);

-- CreateTable
CREATE TABLE "Resources" (
    "id" TEXT NOT NULL,
    "phase_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "timestamps" JSONB,
    "quality_score" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_id_key" ON "Projects"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PreferenceQuestions_id_key" ON "PreferenceQuestions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProjects_id_key" ON "UserProjects"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPhase_id_key" ON "LearningPhase"("id");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeChecks_id_key" ON "KnowledgeChecks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Resources_id_key" ON "Resources"("id");

-- AddForeignKey
ALTER TABLE "PreferenceQuestions" ADD CONSTRAINT "PreferenceQuestions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPhase" ADD CONSTRAINT "LearningPhase_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeChecks" ADD CONSTRAINT "KnowledgeChecks_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "LearningPhase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "LearningPhase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
