import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { EmployeeController } from './employee.controller';
import {
    createEmployeeSchema,
    employeeIdParamSchema,
    updateEmployeeSchema,
} from './employee.schema';

const employeeRoutes = Router();
const employeeController = new EmployeeController();

employeeRoutes.post(
    '/',
    validateRequest(createEmployeeSchema),
    asyncHandler(employeeController.create.bind(employeeController)),
);

employeeRoutes.get(
    '/',
    asyncHandler(employeeController.findMany.bind(employeeController)),
);

employeeRoutes.get(
    '/:id',
    validateRequest(employeeIdParamSchema),
    asyncHandler(employeeController.findById.bind(employeeController)),
);

employeeRoutes.put(
    '/:id',
    validateRequest(updateEmployeeSchema),
    asyncHandler(employeeController.update.bind(employeeController)),
);

employeeRoutes.delete(
    '/:id',
    validateRequest(employeeIdParamSchema),
    asyncHandler(employeeController.delete.bind(employeeController)),
);

export { employeeRoutes };