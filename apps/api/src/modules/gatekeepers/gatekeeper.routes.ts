import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { GatekeeperController } from './gatekeeper.controller';
import {
    loginGatekeeperSchema,
    registerGatekeeperSchema,
} from './gatekeeper.schema';

const gatekeeperRoutes = Router();
const gatekeeperController = new GatekeeperController();

gatekeeperRoutes.post(
    '/register',
    validateRequest(registerGatekeeperSchema),
    asyncHandler(gatekeeperController.register.bind(gatekeeperController)),
);

gatekeeperRoutes.post(
    '/login',
    validateRequest(loginGatekeeperSchema),
    asyncHandler(gatekeeperController.login.bind(gatekeeperController)),
);

export { gatekeeperRoutes };