import { Request, Response } from 'express';
import { VehicleService } from './vehicle.service';

const vehicleService = new VehicleService();

export class VehicleController {
    async create(request: Request, response: Response): Promise<void> {
        const vehicle = await vehicleService.create(request.body);

        response.status(201).json(vehicle);
    }

    async findMany(request: Request, response: Response): Promise<void> {
        const vehicles = await vehicleService.findMany(
            String(request.query.search || ''),
        );

        response.json(vehicles);
    }

    async findById(request: Request, response: Response): Promise<void> {
        const vehicle = await vehicleService.findById(request.params.id);

        response.json(vehicle);
    }

    async findByPlate(request: Request, response: Response): Promise<void> {
        const vehicle = await vehicleService.findByPlate(request.params.plate);

        response.json(vehicle);
    }

    async delete(request: Request, response: Response): Promise<void> {
        await vehicleService.delete(request.params.id);

        response.status(204).send();
    }
}