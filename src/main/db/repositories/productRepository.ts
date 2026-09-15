import { db } from '../connection';
import type { Product, NewProduct, UpdateProduct } from '../../../shared/types/product';

// snake_case (DB) <-> camelCase (app) mapping lives here, nowhere else
function toProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    quantity: row.quantity,
    lowStockThreshold: row.low_stock_threshold,
    pricePiece: row.price_piece,
    priceCarton: row.price_carton,
    priceKg: row.price_kg,
    unitsPerCarton: row.units_per_carton,
    weightPerCartonKg: row.weight_per_carton_kg,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const productRepository = {
  getAll(): Product[] {
    const rows = db.prepare('SELECT * FROM product ORDER BY name').all();
    return rows.map(toProduct);
  },

  getById(id: number): Product | null {
    const row = db.prepare('SELECT * FROM product WHERE id = ?').get(id);
    return row ? toProduct(row) : null;
  },

  create(input: NewProduct): Product {
    const stmt = db.prepare(`
      INSERT INTO product (name, quantity, low_stock_threshold, price_piece, price_carton, price_kg, units_per_carton, weight_per_carton_kg)
      VALUES (@name, @quantity, @lowStockThreshold, @pricePiece, @priceCarton, @priceKg, @unitsPerCarton, @weightPerCartonKg)
    `);
    const result = stmt.run(input);
    return this.getById(result.lastInsertRowid as number)!;
  },

  update(id: number, input: UpdateProduct): Product {
    const existing = this.getById(id);
    if (!existing) throw new Error(`Product ${id} not found`);
    const merged = { ...existing, ...input };
    db.prepare(`
      UPDATE product SET
        name = @name, quantity = @quantity, low_stock_threshold = @lowStockThreshold,
        price_piece = @pricePiece, price_carton = @priceCarton, price_kg = @priceKg,
        units_per_carton = @unitsPerCarton, weight_per_carton_kg = @weightPerCartonKg,
        updated_at = datetime('now')
      WHERE id = @id
    `).run({ ...merged, id });
    return this.getById(id)!;
  },

  delete(id: number): void {
    db.prepare('DELETE FROM product WHERE id = ?').run(id);
  },
};