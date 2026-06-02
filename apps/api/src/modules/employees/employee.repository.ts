import { prisma } from '../../database/prisma';

export class EmployeeRepository {
    async create(data: {
        name: string;
        department?: string | null;
        ra: string;
        email?: string | null;
        phone?: string | null;
    }) {
        return prisma.employee.create({
            data,
            include: {
                vehicles: true,
            },
        });
    }

    async findMany(search?: string) {
        return prisma.employee.findMany({
            where: search
                ? {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            department: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            ra: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            phone: {
                                contains: search,
                            },
                        },
                    ],
                }
                : undefined,
            include: {
                vehicles: true,
            },
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

    async findByEmail(email: string) {
        return prisma.employee.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
            },
            include: {
                vehicles: true,
            },
        });
    }

    async findByPhone(phone: string) {
        return prisma.employee.findFirst({
            where: {
                phone,
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
            include: {
                vehicles: true,
            },
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