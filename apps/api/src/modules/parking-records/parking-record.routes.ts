import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { ParkingRecordController } from './parking-record.controller';
import { gateActionSchema } from './parking-record.schema';

const parkingRecordRoutes = Router();
const parkingRecordController = new ParkingRecordController();

parkingRecordRoutes.get(
    '/',
    asyncHandler(parkingRecordController.findMany.bind(parkingRecordController)),
);

parkingRecordRoutes.post(
    '/entry',
    validateRequest(gateActionSchema),
    asyncHandler(parkingRecordController.createEntry.bind(parkingRecordController)),
);

parkingRecordRoutes.post(
    '/exit',
    validateRequest(gateActionSchema),
    asyncHandler(parkingRecordController.createExit.bind(parkingRecordController)),
);

export { parkingRecordRoutes };