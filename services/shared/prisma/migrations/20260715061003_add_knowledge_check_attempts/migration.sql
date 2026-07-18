-- AlterTable
ALTER TABLE "KnowledgeChecks" ADD COLUMN     "options" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "KnowledgeCheckAttempt" (
    "id" TEXT NOT NULL,
    "knowledge_check_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeCheckAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeCheckAttempt_user_email_project_id_idx" ON "KnowledgeCheckAttempt"("user_email", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeCheckAttempt_knowledge_check_id_user_email_key" ON "KnowledgeCheckAttempt"("knowledge_check_id", "user_email");

-- AddForeignKey
ALTER TABLE "KnowledgeCheckAttempt" ADD CONSTRAINT "KnowledgeCheckAttempt_knowledge_check_id_fkey" FOREIGN KEY ("knowledge_check_id") REFERENCES "KnowledgeChecks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
