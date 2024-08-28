/*
  Warnings:

  - A unique constraint covering the columns `[customer_code]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reading" DROP CONSTRAINT "Reading_customerId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_code_key" ON "Customer"("customer_code");

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customer_code") ON DELETE RESTRICT ON UPDATE CASCADE;
