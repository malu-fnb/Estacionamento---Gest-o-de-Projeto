import { AccessType } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../database/prisma';

export class DashboardController {
    async summary(request: Request, response: Response): Promise<void> {
        const [totalEmployees, totalVehicles, vehicles, logs] = await Promise.all([
            prisma.employee.count(),
            prisma.vehicle.count(),
            prisma.vehicle.findMany(),
            prisma.parkingRecord.findMany({
                orderBy: {
                    timestamp: 'desc',
                },
            }),
        ]);

        const insideVehicles = vehicles.filter((vehicle) => {
            const lastLog = logs.find((log) => log.vehicleId === vehicle.id);

            return lastLog?.type === AccessType.ENTRY;
        });

        response.json({
            currentOccupancy: insideVehicles.length,
            totalEmployees,
            totalVehicles,
        });
    }
}