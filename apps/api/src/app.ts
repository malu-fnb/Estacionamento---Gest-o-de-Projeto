import cors from 'cors';
import express from 'express';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { employeeRoutes } from './modules/employees/employee.routes';
import { gatekeeperRoutes } from './modules/gatekeepers/gatekeeper.routes';
import { parkingRecordRoutes } from './modules/parking-records/parking-record.routes';
import { vehicleRoutes } from './modules/vehicles/vehicle.routes';
import { errorHandler } from './shared/middlewares/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (request, response) => {
  return response.json({
    status: 'ok',
    message: 'CampusGate API is running',
  });
});

app.use('/gatekeepers', gatekeeperRoutes);
app.use('/employees', employeeRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/parking-records', parkingRecordRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(errorHandler);