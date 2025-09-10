-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "contributionAmount" INTEGER,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "frequency" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "nextOfKin" TEXT,
ADD COLUMN     "nextOfKinPhone" TEXT,
ADD COLUMN     "nin" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "startDate" TEXT;
