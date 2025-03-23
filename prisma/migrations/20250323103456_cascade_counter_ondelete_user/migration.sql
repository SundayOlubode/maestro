-- DropForeignKey
ALTER TABLE "Counter" DROP CONSTRAINT "Counter_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
