/*
  Warnings:

  - You are about to drop the `PreferenceQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PreferenceQuestions" DROP CONSTRAINT "PreferenceQuestions_project_id_fkey";

-- DropTable
DROP TABLE "PreferenceQuestions";

-- CreateTable
CREATE TABLE "EligibiltyTest" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "descriptiveAnswer" TEXT,
    "solution" TEXT NOT NULL,
    "project_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EligibiltyTest_id_key" ON "EligibiltyTest"("id");

-- AddForeignKey
ALTER TABLE "EligibiltyTest" ADD CONSTRAINT "EligibiltyTest_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
