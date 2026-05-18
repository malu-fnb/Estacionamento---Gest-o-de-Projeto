import { z } from 'zod';

export const gateActionSchema = z.object({
  body: z.object({
    plate: z.string().trim().min(1, 'Plate is required'),
    gatekeeperName: z.string().trim().optional().nullable(),
    gatekeeperId: z.string().trim().optional().nullable(),
    notes: z.string().trim().optional().nullable(),
  }),
});