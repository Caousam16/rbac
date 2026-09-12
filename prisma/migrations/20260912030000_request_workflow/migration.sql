CREATE TYPE "RequestStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED');
CREATE TABLE "Request" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "RequestStatus" NOT NULL DEFAULT 'SUBMITTED',
  "reviewedById" TEXT,
  "reviewNote" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Request_userId_createdAt_idx" ON "Request"("userId", "createdAt");
CREATE INDEX "Request_status_createdAt_idx" ON "Request"("status", "createdAt");
CREATE INDEX "Request_reviewedById_reviewedAt_idx" ON "Request"("reviewedById", "reviewedAt");
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Request" ADD CONSTRAINT "Request_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
