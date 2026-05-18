import { AppError } from '../../shared/errors/AppError';
import { GatekeeperRepository } from './gatekeeper.repository';

function toFrontGatekeeper(gatekeeper: any) {
    return {
        id: gatekeeper.id,
        name: gatekeeper.name,
        phone: gatekeeper.phone || '',
        email: gatekeeper.email,
        cpf: gatekeeper.cpf,
    };
}

export class GatekeeperService {
    constructor(
        private readonly gatekeeperRepository = new GatekeeperRepository(),
    ) {}

    async register(data: {
        name: string;
        phone?: string | null;
        email: string;
        cpf: string;
        password: string;
    }) {
        const email = data.email.trim().toLowerCase();
        const cpf = data.cpf.trim();

        const existingEmail = await this.gatekeeperRepository.findByEmail(email);

        if (existingEmail) {
            throw new AppError('Gatekeeper email already registered', 409);
        }

        const existingCpf = await this.gatekeeperRepository.findByCpf(cpf);

        if (existingCpf) {
            throw new AppError('Gatekeeper CPF already registered', 409);
        }

        const gatekeeper = await this.gatekeeperRepository.create({
            name: data.name.trim(),
            phone: data.phone?.trim() || null,
            email,
            cpf,
            password: data.password,
        });

        return toFrontGatekeeper(gatekeeper);
    }

    async login(data: {
        name?: string;
        email?: string;
        password?: string;
    }) {
        const name = data.name?.trim();
        const email = data.email?.trim().toLowerCase();

        let gatekeeper = email
            ? await this.gatekeeperRepository.findByEmail(email)
            : null;

        if (!gatekeeper && name) {
            gatekeeper = await this.gatekeeperRepository.findByName(name);
        }

        if (!gatekeeper) {
            if (!name) {
                throw new AppError('Gatekeeper not found', 404);
            }

            gatekeeper = await this.gatekeeperRepository.create({
                name,
                phone: '',
                email: `${name.toLowerCase().replace(/\s+/g, '.')}@campusgate.local`,
                cpf: `TEMP-${Date.now()}`,
                password: data.password || 'temporary',
            });
        }

        if (data.password && gatekeeper.password !== data.password) {
            throw new AppError('Invalid password', 401);
        }

        return toFrontGatekeeper(gatekeeper);
    }
}