import { AccessType } from '@prisma/client';
import { AppError } from '../../shared/errors/AppError';
import { normalizeAndValidatePlate } from '../../shared/utils/normalizePlate';
import { VehicleRepository } from '../vehicles/vehicle.repository';
import { ParkingRecordRepository } from './parking-record.repository';

function toAccessLog(record: any) {
  return {
    id: record.id,
    vehiclePlate: record.vehicle.plate,
    type: record.type === AccessType.ENTRY ? 'entry' : 'exit',
    timestamp: record.timestamp,
    ownerName: record.vehicle.employee.name,
    gatekeeperName: record.gatekeeper?.name || 'Sistema',
  };
}

export class ParkingRecordService {
  constructor(
      private readonly parkingRecordRepository = new ParkingRecordRepository(),
      private readonly vehicleRepository = new VehicleRepository(),
  ) {}

  async findMany() {
    const records = await this.parkingRecordRepository.findMany();

    return records.map(toAccessLog);
  }

  async createEntry(data: {
    plate: string;
    gatekeeperId?: string | null;
    gatekeeperName?: string | null;
    notes?: string | null;
  }) {
    const plate = normalizeAndValidatePlate(data.plate);

    const vehicle = await this.vehicleRepository.findByPlate(plate);

    if (!vehicle) {
      throw new AppError(`Placa ${plate} não encontrada.`, 404);
    }

    const lastRecord = await this.parkingRecordRepository.findLastByVehicleId(
        vehicle.id,
    );

    if (lastRecord?.type === AccessType.ENTRY) {
      throw new AppError(
          'Entrada não permitida. Este veículo já possui uma entrada em aberto.',
          409,
      );
    }

    const record = await this.parkingRecordRepository.create({
      vehicleId: vehicle.id,
      gatekeeperId: data.gatekeeperId || null,
      type: AccessType.ENTRY,
      notes: data.notes?.trim() || null,
    });

    const log = toAccessLog(record);

    if (!record.gatekeeper && data.gatekeeperName) {
      log.gatekeeperName = data.gatekeeperName;
    }

    return log;
  }

  async createExit(data: {
    plate: string;
    gatekeeperId?: string | null;
    gatekeeperName?: string | null;
    notes?: string | null;
  }) {
    const plate = normalizeAndValidatePlate(data.plate);

    const vehicle = await this.vehicleRepository.findByPlate(plate);

    if (!vehicle) {
      throw new AppError(`Placa ${plate} não encontrada.`, 404);
    }

    const lastRecord = await this.parkingRecordRepository.findLastByVehicleId(
        vehicle.id,
    );

    if (!lastRecord) {
      throw new AppError(
          'Saída não permitida. Este veículo ainda não possui registro de entrada.',
          409,
      );
    }

    if (lastRecord.type === AccessType.EXIT) {
      throw new AppError(
          'Saída não permitida. Este veículo já teve a saída registrada.',
          409,
      );
    }

    const record = await this.parkingRecordRepository.create({
      vehicleId: vehicle.id,
      gatekeeperId: data.gatekeeperId || null,
      type: AccessType.EXIT,
      notes: data.notes?.trim() || null,
    });

    const log = toAccessLog(record);

    if (!record.gatekeeper && data.gatekeeperName) {
      log.gatekeeperName = data.gatekeeperName;
    }

    return log;
  }
}