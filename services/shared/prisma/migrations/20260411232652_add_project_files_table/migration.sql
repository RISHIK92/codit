/*
  Warnings:

  - A unique constraint covering the columns `[project_id,user_email]` on the table `UserProjects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "ProjectFile" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "is_directory" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectFile_project_id_user_email_idx" ON "ProjectFile"("project_id", "user_email");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectFile_project_id_user_email_file_path_key" ON "ProjectFile"("project_id", "user_email", "file_path");

-- CreateIndex
CREATE UNIQUE INDEX "UserProjects_project_id_user_email_key" ON "UserProjects"("project_id", "user_email");

-- AddForeignKey
ALTER TABLE "ProjectFile" ADD CONSTRAINT "ProjectFile_project_id_user_email_fkey" FOREIGN KEY ("project_id", "user_email") REFERENCES "UserProjects"("project_id", "user_email") ON DELETE RESTRICT ON UPDATE CASCADE;
