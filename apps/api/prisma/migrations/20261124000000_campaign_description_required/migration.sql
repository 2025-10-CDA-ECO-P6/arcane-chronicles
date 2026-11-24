/*
  Warnings:

  - Made the column `description` on table `campaigns` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "campaigns" ALTER COLUMN "description" SET NOT NULL;
