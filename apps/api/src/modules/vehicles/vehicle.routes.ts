import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { VehicleController } from './vehicle.controller';
import {
    createVehicleSchema,
    vehicleIdParamSchema,
    vehiclePlateParamSchema,
} from './vehicle.schema';

const vehicleRoutes = Router();
const vehicleController = new VehicleController();

vehicleRoutes.post(
    '/',
    validateRequest(createVehicleSchema),
    asyncHandler(vehicleController.create.bind(vehicleController)),
);

vehicleRoutes.get(
    '/',
    asyncHandler(vehicleController.findMany.bind(vehicleController)),
);

vehicleRoutes.get(
    '/plate/:plate',
    validateRequest(vehiclePlateParamSchema),
    asyncHandler(vehicleController.findByPlate.bind(vehicleController)),
);

vehicleRoutes.get(
    '/:id',
    validateRequest(vehicleIdParamSchema),
    asyncHandler(vehicleController.findById.bind(vehicleController)),
);

vehicleRoutes.delete(
    '/:id',
    validateRequest(vehicleIdParamSchema),
    asyncHandler(vehicleController.delete.bind(vehicleController)),
);

export { vehicleRoutes };