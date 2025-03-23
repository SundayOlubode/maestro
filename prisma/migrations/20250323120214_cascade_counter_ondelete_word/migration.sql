-- DropForeignKey
ALTER TABLE "Counter" DROP CONSTRAINT "Counter_word_id_fkey";

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
