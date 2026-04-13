-- CreateTable
CREATE TABLE "ResourceProgress" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResourceProgress_user_email_project_id_idx" ON "ResourceProgress"("user_email", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceProgress_resource_id_user_email_project_id_key" ON "ResourceProgress"("resource_id", "user_email", "project_id");

-- AddForeignKey
ALTER TABLE "ResourceProgress" ADD CONSTRAINT "ResourceProgress_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
