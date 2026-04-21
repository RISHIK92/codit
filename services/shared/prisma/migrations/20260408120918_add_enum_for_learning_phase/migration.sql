-- CreateEnum
CREATE TYPE "PhaseStatus" AS ENUM ('in_progress', 'completed', 'locked');

-- AlterTable
ALTER TABLE "LearningPhase" ADD COLUMN     "phase_status" "PhaseStatus" NOT NULL DEFAULT 'locked';

-- AlterTable
ALTER TABLE "UserProjects" ALTER COLUMN "status" SET DEFAULT 'in_progress',
ALTER COLUMN "current_phase" SET DEFAULT 0;
