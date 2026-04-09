/*
  Warnings:

  - You are about to drop the `EligibiltyTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EligibiltyTest" DROP CONSTRAINT "EligibiltyTest_project_id_fkey";

-- DropTable
DROP TABLE "EligibiltyTest";

-- CreateTable
CREATE TABLE "EligibilityTest" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EligibilityQuestion" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correct_option" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EligibilityTest_id_key" ON "EligibilityTest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EligibilityTest_project_id_key" ON "EligibilityTest"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "EligibilityQuestion_id_key" ON "EligibilityQuestion"("id");

-- AddForeignKey
ALTER TABLE "EligibilityTest" ADD CONSTRAINT "EligibilityTest_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EligibilityQuestion" ADD CONSTRAINT "EligibilityQuestion_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "EligibilityTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
