-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('ENTRY', 'EXIT');

-- CreateTable
CREATE TABLE "gatekeepers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gatekeepers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT,
    "ra" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_records" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "gatekeeperId" TEXT,
    "type" "AccessType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parking_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gatekeepers_email_key" ON "gatekeepers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "gatekeepers_cpf_key" ON "gatekeepers"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "employees_ra_key" ON "employees"("ra");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_key" ON "vehicles"("plate");

-- CreateIndex
CREATE INDEX "vehicles_employeeId_idx" ON "vehicles"("employeeId");

-- CreateIndex
CREATE INDEX "parking_records_vehicleId_idx" ON "parking_records"("vehicleId");

-- CreateIndex
CREATE INDEX "parking_records_gatekeeperId_idx" ON "parking_records"("gatekeeperId");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_records" ADD CONSTRAINT "parking_records_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_records" ADD CONSTRAINT "parking_records_gatekeeperId_fkey" FOREIGN KEY ("gatekeeperId") REFERENCES "gatekeepers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
