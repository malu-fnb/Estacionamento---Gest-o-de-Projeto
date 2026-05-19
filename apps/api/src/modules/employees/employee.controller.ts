import { Request, Response } from 'express';
import { EmployeeService } from './employee.service';

const employeeService = new EmployeeService();

export class EmployeeController {
    async create(request: Request, response: Response): Promise<void> {
        const employee = await employeeService.create(request.body);

        response.status(201).json(employee);
    }

    async findMany(request: Request, response: Response): Promise<void> {
        const employees = await employeeService.findMany(
            String(request.query.search || ''),
        );

        response.json(employees);
    }

    async findById(request: Request, response: Response): Promise<void> {
        const employee = await employeeService.findById(request.params.id);

        response.json(employee);
    }

    async update(request: Request, response: Response): Promise<void> {
        const employee = await employeeService.update(
            request.params.id,
            request.body,
        );

        response.json(employee);
    }

    async delete(request: Request, response: Response): Promise<void> {
        await employeeService.delete(request.params.id);

        response.status(204).send();
    }
}