/*
  Warnings:

  - You are about to drop the column `user_id` on the `UserProjects` table. All the data in the column will be lost.
  - Added the required column `user_email` to the `UserProjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProjects" DROP CONSTRAINT "UserProjects_user_id_fkey";

-- AlterTable
ALTER TABLE "UserProjects" DROP COLUMN "user_id",
ADD COLUMN     "user_email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
