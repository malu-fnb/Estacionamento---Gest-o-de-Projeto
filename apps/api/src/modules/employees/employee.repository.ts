import { prisma } from '../../database/prisma';

export class EmployeeRepository {
    async create(data: {
        name: string;
        department?: string | null;
        ra: string;
        email?: string | null;
        phone?: string | null;
    }) {
        return prisma.employee.create({ data });
    }

    async findMany(search?: string) {
        return prisma.employee.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search } },
                        { department: { contains: search } },
                        { ra: { contains: search } },
                        { email: { contains: search } },
                    ],
                }
                : undefined,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findById(id: string) {
        return prisma.employee.findUnique({
            where: {
                id,
            },
            include: {
                vehicles: true,
            },
        });
    }

    async findByRa(ra: string) {
        return prisma.employee.findUnique({
            where: {
                ra,
            },
            include: {
                vehicles: true,
            },
        });
    }

    async update(
        id: string,
        data: {
            name?: string;
            department?: string | null;
            ra?: string;
            email?: string | null;
            phone?: string | null;
        },
    ) {
        return prisma.employee.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: string) {
        return prisma.employee.delete({
            where: {
                id,
            },
        });
    }
}