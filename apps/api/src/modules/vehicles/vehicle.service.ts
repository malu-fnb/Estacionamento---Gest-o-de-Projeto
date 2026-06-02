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

        const employee = await this.employeeRepository.findByRa(ownerRa);

        if (!employee) {
            throw new AppError('Funcionário não encontrado para este registro.', 404);
        }

        const existingVehicleForEmployee =
            await this.vehicleRepository.findByPlateAndEmployeeId(plate, employee.id);

        if (existingVehicleForEmployee) {
            throw new AppError(
                'Esta placa já está vinculada a este funcionário.',
                409,
            );
        }

        const vehicle = await this.vehicleRepository.create({
            employeeId: employee.id,
            plate,
            make: data.make.trim(),
            model: data.model.trim(),
            color: data.color.trim(),
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

        const vehicles = await this.vehicleRepository.findManyByPlate(plate);

        if (vehicles.length === 0) {
            throw new AppError('Veículo não encontrado.', 404);
        }

        if (vehicles.length > 1) {
            throw new AppError(
                'Existe mais de um veículo com esta placa. Informe também o registro do proprietário.',
                409,
            );
        }

        return toFrontVehicle(vehicles[0]);
    }

    async delete(id: string) {
        const vehicle = await this.vehicleRepository.findById(id);

        if (!vehicle) {
            throw new AppError('Veículo não encontrado.', 404);
        }

        return this.vehicleRepository.deleteWithRecords(id);
    }
}