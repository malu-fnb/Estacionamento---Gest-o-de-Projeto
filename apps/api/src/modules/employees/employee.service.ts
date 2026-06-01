import { AppError } from '../../shared/errors/AppError';
import { EmployeeRepository } from './employee.repository';

function normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
}

function normalizeRa(ra: string): string {
    return ra.trim().toUpperCase();
}

function normalizeEmail(email?: string | null): string | null {
    const normalizedEmail = email?.trim().toLowerCase();

    return normalizedEmail || null;
}

function normalizePhone(phone?: string | null): string | null {
    const normalizedPhone = phone?.replace(/\D/g, '');

    return normalizedPhone || null;
}

function toFrontEmployee(employee: any) {
    return {
        id: employee.id,
        name: employee.name,
        department: employee.department || '',
        ra: employee.ra,
        email: employee.email || '',
        phone: employee.phone || '',
        vehicles: employee.vehicles || [],
    };
}

export class EmployeeService {
    constructor(private readonly employeeRepository = new EmployeeRepository()) {}

    private async validateUniqueFields(data: {
        name: string;
        ra: string;
        email?: string | null;
        phone?: string | null;
        ignoreEmployeeId?: string;
    }) {
        const existingName = await this.employeeRepository.findByName(data.name);

        if (existingName && existingName.id !== data.ignoreEmployeeId) {
            throw new AppError('Já existe um funcionário cadastrado com este nome.', 409);
        }

        const existingRa = await this.employeeRepository.findByRa(data.ra);

        if (existingRa && existingRa.id !== data.ignoreEmployeeId) {
            throw new AppError('Já existe um funcionário cadastrado com este registro.', 409);
        }

        if (data.email) {
            const existingEmail = await this.employeeRepository.findByEmail(data.email);

            if (existingEmail && existingEmail.id !== data.ignoreEmployeeId) {
                throw new AppError('Já existe um funcionário cadastrado com este e-mail.', 409);
            }
        }

        if (data.phone) {
            const existingPhone = await this.employeeRepository.findByPhone(data.phone);

            if (existingPhone && existingPhone.id !== data.ignoreEmployeeId) {
                throw new AppError('Já existe um funcionário cadastrado com este celular.', 409);
            }
        }
    }

    async create(data: {
        name: string;
        department?: string | null;
        ra: string;
        email?: string | null;
        phone?: string | null;
    }) {
        const name = normalizeName(data.name);
        const ra = normalizeRa(data.ra);
        const email = normalizeEmail(data.email);
        const phone = normalizePhone(data.phone);

        await this.validateUniqueFields({
            name,
            ra,
            email,
            phone,
        });

        const employee = await this.employeeRepository.create({
            name,
            department: data.department?.trim() || null,
            ra,
            email,
            phone,
        });

        return toFrontEmployee(employee);
    }

    async findMany(search?: string) {
        const employees = await this.employeeRepository.findMany(search?.trim());

        return employees.map(toFrontEmployee);
    }

    async findById(id: string) {
        const employee = await this.employeeRepository.findById(id);

        if (!employee) {
            throw new AppError('Funcionário não encontrado.', 404);
        }

        return toFrontEmployee(employee);
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
        const employee = await this.employeeRepository.findById(id);

        if (!employee) {
            throw new AppError('Funcionário não encontrado.', 404);
        }

        const name = data.name !== undefined ? normalizeName(data.name) : employee.name;
        const ra = data.ra !== undefined ? normalizeRa(data.ra) : employee.ra;
        const email =
            data.email !== undefined ? normalizeEmail(data.email) : employee.email;
        const phone =
            data.phone !== undefined ? normalizePhone(data.phone) : employee.phone;

        await this.validateUniqueFields({
            name,
            ra,
            email,
            phone,
            ignoreEmployeeId: id,
        });

        const updatedEmployee = await this.employeeRepository.update(id, {
            name,
            department:
                data.department !== undefined
                    ? data.department?.trim() || null
                    : employee.department,
            ra,
            email,
            phone,
        });

        return toFrontEmployee(updatedEmployee);
    }

    async delete(id: string) {
        const employee = await this.employeeRepository.findById(id);

        if (!employee) {
            throw new AppError('Funcionário não encontrado.', 404);
        }

        if (employee.vehicles.length > 0) {
            throw new AppError(
                'Não é possível excluir este funcionário porque ele possui veículo cadastrado. Exclua o veículo primeiro.',
                409,
            );
        }

        await this.employeeRepository.delete(id);
    }
}