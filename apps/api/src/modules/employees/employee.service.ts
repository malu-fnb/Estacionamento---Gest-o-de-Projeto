import { AppError } from '../../shared/errors/AppError';
import { EmployeeRepository } from './employee.repository';

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

    async create(data: {
        name: string;
        department?: string | null;
        ra: string;
        email?: string | null;
        phone?: string | null;
    }) {
        const ra = data.ra.trim().toUpperCase();

        const existing = await this.employeeRepository.findByRa(ra);

        if (existing) {
            throw new AppError('Employee RA already registered', 409);
        }

        const employee = await this.employeeRepository.create({
            name: data.name.trim(),
            department: data.department?.trim() || null,
            ra,
            email: data.email?.trim() || null,
            phone: data.phone?.trim() || null,
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
            throw new AppError('Employee not found', 404);
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
            throw new AppError('Employee not found', 404);
        }

        if (data.ra) {
            const ra = data.ra.trim().toUpperCase();
            const existing = await this.employeeRepository.findByRa(ra);

            if (existing && existing.id !== id) {
                throw new AppError('Employee RA already registered', 409);
            }
        }

        const updatedEmployee = await this.employeeRepository.update(id, {
            name: data.name?.trim(),
            department: data.department?.trim() || null,
            ra: data.ra?.trim().toUpperCase(),
            email: data.email?.trim() || null,
            phone: data.phone?.trim() || null,
        });

        return toFrontEmployee(updatedEmployee);
    }

    async delete(id: string) {
        const employee = await this.employeeRepository.findById(id);

        if (!employee) {
            throw new AppError('Employee not found', 404);
        }

        return this.employeeRepository.delete(id);
    }
}