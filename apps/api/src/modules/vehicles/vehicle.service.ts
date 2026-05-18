import { AppError } from '../../shared/errors/AppError';
import { normalizePlate } from '../../shared/utils/normalizePlate';
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
        make?: string | null;
        model?: string | null;
        color?: string | null;
    }) {
        const ownerRa = data.ownerRa.trim().toUpperCase();
        const plate = normalizePlate(data.plate);

        const employee = await this.employeeRepository.findByRa(ownerRa);

        if (!employee) {
            throw new AppError('Employee RA not found', 404);
        }

        const existingVehicle = await this.vehicleRepository.findByPlate(plate);

        if (existingVehicle) {
            throw new AppError('Vehicle plate already registered', 409);
        }

        const vehicle = await this.vehicleRepository.create({
            employeeId: employee.id,
            plate,
            make: data.make?.trim() || null,
            model: data.model?.trim() || null,
            color: data.color?.trim() || null,
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
            throw new AppError('Vehicle not found', 404);
        }

        return toFrontVehicle(vehicle);
    }

    async findByPlate(plateInput: string) {
        const plate = normalizePlate(plateInput);

        const vehicle = await this.vehicleRepository.findByPlate(plate);

        if (!vehicle) {
            throw new AppError('Vehicle not found', 404);
        }

        return toFrontVehicle(vehicle);
    }

    async delete(id: string) {
        const vehicle = await this.vehicleRepository.findById(id);

        if (!vehicle) {
            throw new AppError('Vehicle not found', 404);
        }

        return this.vehicleRepository.delete(id);
    }
}