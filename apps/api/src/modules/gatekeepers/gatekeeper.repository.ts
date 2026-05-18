import { prisma } from '../../database/prisma';

export class GatekeeperRepository {
    async create(data: {
        name: string;
        phone?: string | null;
        email: string;
        cpf: string;
        password: string;
    }) {
        return prisma.gatekeeper.create({
            data,
        });
    }

    async findByEmail(email: string) {
        return prisma.gatekeeper.findUnique({
            where: {
                email,
            },
        });
    }

    async findByCpf(cpf: string) {
        return prisma.gatekeeper.findUnique({
            where: {
                cpf,
            },
        });
    }

    async findByName(name: string) {
        return prisma.gatekeeper.findFirst({
            where: {
                name,
            },
        });
    }
}