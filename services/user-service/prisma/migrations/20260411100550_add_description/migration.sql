/*
  Warnings:

  - Added the required column `description` to the `EntranceQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntranceQuestion" ADD COLUMN     "description" TEXT NOT NULL;
