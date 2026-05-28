import { AppError } from '../errors/AppError';

export function normalizePlate(plate: string): string {
  return plate.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function isOldBrazilianPlate(plate: string): boolean {
  return /^[A-Z]{3}[0-9]{4}$/.test(plate);
}

export function isMercosulPlate(plate: string): boolean {
  return /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(plate);
}

export function isValidBrazilianPlate(plate: string): boolean {
  return isOldBrazilianPlate(plate) || isMercosulPlate(plate);
}

export function normalizeAndValidatePlate(plate: string): string {
  const normalizedPlate = normalizePlate(plate);

  if (!normalizedPlate) {
    throw new AppError('A placa é obrigatória.', 400);
  }

  if (!isValidBrazilianPlate(normalizedPlate)) {
    throw new AppError(
        'Formato de placa inválido. Use o padrão antigo ABC1234 ou o padrão Mercosul ABC1D23.',
        400,
    );
  }

  return normalizedPlate;
}