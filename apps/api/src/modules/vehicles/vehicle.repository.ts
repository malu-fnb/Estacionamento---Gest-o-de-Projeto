import { Prisma } from '@prisma/client';
import { prisma } from '../../database/prisma';

export class VehicleRepository {
  async create(data: {
    employeeId: string;
    plate: string;
    make: string;
    model: string;
    color: string;
  }) {
    return prisma.vehicle.create({
      data,
      include: {
        employee: true,
      },
    });
  }

  async findMany(search?: string) {
    return prisma.vehicle.findMany({
      where: search
          ? {
            OR: [
              {
                plate: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                make: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                model: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                color: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                employee: {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                employee: {
                  ra: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
          : undefined,
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: {
        id,
      },
      include: {
        employee: true,
      },
    });
  }

  async findByPlate(plate: string) {
    return prisma.vehicle.findUnique({
      where: {
        plate,
      },
      include: {
        employee: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.vehicle.delete({
      where: {
        id,
      },
    });
  }

  async deleteWithRecords(id: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.parkingRecord.deleteMany({
        where: {
          vehicleId: id,
        },
      });

      return tx.vehicle.delete({
        where: {
          id,
        },
      });
    });
  }
}