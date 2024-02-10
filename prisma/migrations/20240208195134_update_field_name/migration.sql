/*
  Warnings:

  - You are about to drop the column `userId` on the `Counter` table. All the data in the column will be lost.
  - You are about to drop the column `wordId` on the `Counter` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `word_id` to the `Counter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Counter" DROP CONSTRAINT "Counter_userId_fkey";

-- DropForeignKey
ALTER TABLE "Counter" DROP CONSTRAINT "Counter_wordId_fkey";

-- DropIndex
DROP INDEX "Counter_userId_idx";

-- AlterTable
ALTER TABLE "Counter" DROP COLUMN "userId",
DROP COLUMN "wordId",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "word_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Counter_user_id_idx" ON "Counter"("user_id");

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
