/*
  Warnings:

  - The primary key for the `Counter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Counter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Word` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Word` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `user_id` on the `Counter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `word_id` on the `Counter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_UserToWord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_UserToWord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Counter" DROP CONSTRAINT "Counter_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Counter" DROP CONSTRAINT "Counter_word_id_fkey";

-- DropForeignKey
ALTER TABLE "_UserToWord" DROP CONSTRAINT "_UserToWord_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToWord" DROP CONSTRAINT "_UserToWord_B_fkey";

-- AlterTable
ALTER TABLE "Counter" DROP CONSTRAINT "Counter_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "word_id",
ADD COLUMN     "word_id" INTEGER NOT NULL,
ADD CONSTRAINT "Counter_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Word" DROP CONSTRAINT "Word_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Word_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_UserToWord" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Counter_user_id_idx" ON "Counter"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWord_AB_unique" ON "_UserToWord"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWord_B_index" ON "_UserToWord"("B");

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWord" ADD CONSTRAINT "_UserToWord_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWord" ADD CONSTRAINT "_UserToWord_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
