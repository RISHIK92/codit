-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hoursPerWeek" INTEGER,
ADD COLUMN     "learningModes" TEXT[] DEFAULT ARRAY['project-based']::TEXT[],
ADD COLUMN     "skillLevel" "Skill_Level";
