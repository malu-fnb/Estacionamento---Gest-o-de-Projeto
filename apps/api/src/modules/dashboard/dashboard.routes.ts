import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler';
import { DashboardController } from './dashboard.controller';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get(
    '/summary',
    asyncHandler(dashboardController.summary.bind(dashboardController)),
);

export { dashboardRoutes };