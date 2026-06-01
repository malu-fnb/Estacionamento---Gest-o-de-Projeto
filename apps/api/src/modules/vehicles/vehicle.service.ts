import { AppError } from '../../shared/errors/AppError';
import { normalizeAndValidatePlate } from '../../shared/utils/normalizePlate';
import { EmployeeRepository } from '../employees/employee.repository';
import { VehicleRepository } from './vehicle.repository';

function toFrontVehicle(vehicle: any) {
    return {
        id: vehicle.id,
        ownerId: vehicle.employeeId,
        plate: vehicle.plate,
        make: vehicle.make || '',
        model: vehicle.model || '',
        color: vehicle.color || '',
        owner: vehicle.employee
            ? {
                id: vehicle.employee.id,
                name: vehicle.employee.name,
                department: vehicle.employee.department || '',
                ra: vehicle.employee.ra,
                email: vehicle.employee.email || '',
                phone: vehicle.employee.phone || '',
            }
            : undefined,
    };
}

export class VehicleService {
    constructor(
        private readonly vehicleRepository = new VehicleRepository(),
        private readonly employeeRepository = new EmployeeRepository(),
    ) {}

    async create(data: {
        ownerRa: string;
        plate: string;
        make: string;
        model: string;
        color: string;
    }) {
        const ownerRa = data.ownerRa.trim().toUpperCase();
        const plate = normalizeAndValidatePlate(data.plate);
        const make = data.make.trim();
        const model = data.model.trim();
        const color = data.color.trim();

        if (!make || !model || !color) {
            throw new AppError('Marca, modelo e cor predominante são obrigatórios.', 400);
        }

        const employee = await this.employeeRepository.findByRa(ownerRa);

        if (!employee) {
            throw new AppError('Funcionário não encontrado para este registro.', 404);
        }

        const existingVehicle = await this.vehicleRepository.findByPlate(plate);

        if (existingVehicle) {
            throw new AppError('Esta placa já está cadastrada no sistema.', 409);
        }

        const vehicle = await this.vehicleRepository.create({
            employeeId: employee.id,
            plate,
            make,
            model,
            color,
        });

        return toFrontVehicle(vehicle);
    }

    async findMany(search?: string) {
        const vehicles = await this.vehicleRepository.findMany(search?.trim());

        return vehicles.map(toFrontVehicle);
    }

    async findById(id: string) {
        const vehicle = await this.vehicleRepository.findById(id);

        if (!vehicle) {
            throw new AppError('Veículo não encontrado.', 404);
        }

        return toFrontVehicle(vehicle);
    }

    async findByPlate(plateInput: string) {
        const plate = normalizeAndValidatePlate(plateInput);

        const vehicle = await this.vehicleRepository.findByPlate(plate);

        if (!vehicle) {
            throw new AppError('Veículo não encontrado.', 404);
        }

        return toFrontVehicle(vehicle);
    }

    async delete(id: string) {
        const vehicle = await this.vehicleRepository.findById(id);

        if (!vehicle) {
            throw new AppError('Veículo não encontrado.', 404);
        }

        await this.vehicleRepository.deleteWithRecords(id);
    }
}
