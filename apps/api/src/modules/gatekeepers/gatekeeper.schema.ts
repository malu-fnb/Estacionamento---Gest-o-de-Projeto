import { z } from 'zod';

export const registerGatekeeperSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'Name is required'),
        phone: z.string().trim().optional().nullable(),
        email: z.string().trim().email('Invalid email'),
        cpf: z.string().trim().min(1, 'CPF is required'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const loginGatekeeperSchema = z.object({
    body: z.object({
        name: z.string().trim().optional(),
        email: z.string().trim().optional(),
        password: z.string().optional(),
    }),
});