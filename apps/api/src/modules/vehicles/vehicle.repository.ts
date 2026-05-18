import { prisma } from '../../database/prisma';

export class VehicleRepository {
  async create(data: {
    employeeId: string;
    plate: string;
    make?: string | null;
    model?: string | null;
    color?: string | null;
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
                },
              },
              {
                make: {
                  contains: search,
                },
              },
              {
                model: {
                  contains: search,
                },
              },
              {
                color: {
                  contains: search,
                },
              },
              {
                employee: {
                  name: {
                    contains: search,
                  },
                },
              },
              {
                employee: {
                  ra: {
                    contains: search,
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
}