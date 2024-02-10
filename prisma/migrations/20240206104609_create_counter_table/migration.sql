/*
  Warnings:

  - You are about to drop the column `definition` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `examples` on the `Word` table. All the data in the column will be lost.
  - Added the required column `meaning` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "definition",
DROP COLUMN "examples",
ADD COLUMN     "meaning" TEXT NOT NULL,
ADD COLUMN     "usages" TEXT[];

-- CreateTable
CREATE TABLE "Counter" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    "countdown" INTEGER NOT NULL DEFAULT 40,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Counter_userId_idx" ON "Counter"("userId");

-- CreateIndex
CREATE INDEX "Word_word_idx" ON "Word"("word");

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
