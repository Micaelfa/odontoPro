/*
  Warnings:

  - You are about to drop the column `adrres` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "adrres",
ADD COLUMN     "address" TEXT DEFAULT '';
