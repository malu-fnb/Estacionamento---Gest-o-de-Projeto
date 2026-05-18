import { z } from 'zod';

export const createEmployeeSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'Name is required'),
        department: z.string().trim().optional().nullable(),
        ra: z.string().trim().min(1, 'RA is required'),
        email: z.string().trim().optional().nullable(),
        phone: z.string().trim().optional().nullable(),
    }),
});

export const updateEmployeeSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Employee id is required'),
    }),
    body: z.object({
        name: z.string().trim().min(1).optional(),
        department: z.string().trim().optional().nullable(),
        ra: z.string().trim().min(1).optional(),
        email: z.string().trim().optional().nullable(),
        phone: z.string().trim().optional().nullable(),
    }),
});

export const employeeIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Employee id is required'),
    }),
});