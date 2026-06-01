import { z } from 'zod';

export const createVehicleSchema = z.object({
    body: z.object({
        ownerRa: z.string().trim().min(1, 'Registro do proprietário é obrigatório'),
        plate: z.string().trim().min(1, 'Placa é obrigatória'),
        make: z.string().trim().min(1, 'Marca é obrigatória'),
        model: z.string().trim().min(1, 'Modelo é obrigatório'),
        color: z.string().trim().min(1, 'Cor predominante é obrigatória'),
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
