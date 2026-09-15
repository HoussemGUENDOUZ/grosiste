import Decimal from 'decimal.js';
import type { Product } from '../../../shared/types/product';

export function isLowStock(product: Product): boolean {
  return new Decimal(product.quantity).lessThanOrEqualTo(new Decimal(product.lowStockThreshold));
}