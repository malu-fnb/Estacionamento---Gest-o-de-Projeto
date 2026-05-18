import { AccessType } from '@prisma/client';
import { prisma } from '../../database/prisma';

export class ParkingRecordRepository {
  async findMany() {
    return prisma.parkingRecord.findMany({
      include: {
        vehicle: {
          include: {
            employee: true,
          },
        },
        gatekeeper: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async findLastByVehicleId(vehicleId: string) {
    return prisma.parkingRecord.findFirst({
      where: {
        vehicleId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async create(data: {
    vehicleId: string;
    gatekeeperId?: string | null;
    type: AccessType;
    notes?: string | null;
  }) {
    return prisma.parkingRecord.create({
      data,
      include: {
        vehicle: {
          include: {
            employee: true,
          },
        },
        gatekeeper: true,
      },
    });
  }
}