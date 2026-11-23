-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "published_from_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_published_from_id_key" ON "campaigns"("published_from_id");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_published_from_id_fkey" FOREIGN KEY ("published_from_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- UnpublishOriginals
UPDATE "campaigns" SET "is_public" = false WHERE "published_from_id" IS NULL;

-- AddCheckConstraint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_only_published_version_is_public_check" CHECK (NOT "is_public" OR "published_from_id" IS NOT NULL);
