-- add_auth_columns_to_user created "approvalStatus" as TEXT, but schema.prisma
-- declares the ApprovalStatus enum. Convert in place and keep existing values.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ApprovalStatus') THEN
    CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
END $$;

ALTER TABLE "User" ALTER COLUMN "approvalStatus" DROP DEFAULT;
ALTER TABLE "User"
  ALTER COLUMN "approvalStatus" TYPE "ApprovalStatus"
  USING "approvalStatus"::"ApprovalStatus";
ALTER TABLE "User" ALTER COLUMN "approvalStatus" SET DEFAULT 'PENDING';

-- schema.prisma maps this column to TIMESTAMP(3) (no @db.Timestamptz).
ALTER TABLE "User"
  ALTER COLUMN "verificationExpiresAt" TYPE TIMESTAMP(3);
