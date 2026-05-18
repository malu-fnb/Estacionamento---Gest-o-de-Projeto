import { z } from 'zod';

export const createVehicleSchema = z.object({
    body: z.object({
        ownerRa: z.string().trim().min(1, 'Owner RA is required'),
        plate: z.string().trim().min(1, 'Plate is required'),
        make: z.string().trim().optional().nullable(),
        model: z.string().trim().optional().nullable(),
        color: z.string().trim().optional().nullable(),
    }),
});

export const vehicleIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Vehicle id is required'),
    }),
});

export const vehiclePlateParamSchema = z.object({
    params: z.object({
        plate: z.string().min(1, 'Plate is required'),
    }),
});