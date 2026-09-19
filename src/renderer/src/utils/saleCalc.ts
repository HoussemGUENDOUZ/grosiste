import Decimal from 'decimal.js';
import type { Product } from '../../../shared/types/product';
import type { UnitUsed } from '../../../shared/types/sale';

export function availableUnits(product: Product): UnitUsed[] {
  const units: UnitUsed[] = [];
  if (product.pricePiece) units.push('piece');
  if (product.priceCarton) units.push('carton');
  if (product.priceKg) units.push('kg');
  return units;
}

export function getUnitPrice(product: Product, unitUsed: UnitUsed): string | null {
  if (unitUsed === 'piece') return product.pricePiece;
  if (unitUsed === 'carton') return product.priceCarton;
  return product.priceKg;
}

export function calcLineTotal(product: Product, unitUsed: UnitUsed, quantity: string): string | null {
  const price = getUnitPrice(product, unitUsed);
  if (!price || !quantity || isNaN(Number(quantity))) return null;
  return new Decimal(quantity).times(new Decimal(price)).toFixed(2);
}