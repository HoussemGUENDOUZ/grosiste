import Decimal from 'decimal.js';
import { db } from '../connection';
import { productRepository } from './productRepository';
import type { Sale, SaleItem, NewSaleInput } from '../../../shared/types/sale';

function toSaleItem(row: any): SaleItem {
  return {
    id: row.id, saleId: row.sale_id, productId: row.product_id,
    productName: row.product_name, unitUsed: row.unit_used,
    quantitySold: row.quantity_sold, unitPrice: row.unit_price, lineTotal: row.line_total,
  };
}

function toSale(row: any, items: SaleItem[]): Sale {
  return {
    id: row.id, clientId: row.client_id, totalAmount: row.total_amount,
    amountPaid: row.amount_paid, createdAt: row.created_at, items,
  };
}

export const saleRepository = {
  getAll(): Sale[] {
    const rows = db.prepare('SELECT * FROM sale ORDER BY created_at DESC').all() as any[];
    return rows.map((row) => {
      const items = (db.prepare('SELECT * FROM sale_item WHERE sale_id = ?').all(row.id) as any[]).map(toSaleItem);
      return toSale(row, items);
    });
  },

  getById(id: number): Sale | null {
    const row = db.prepare('SELECT * FROM sale WHERE id = ?').get(id) as any;
    if (!row) return null;
    const items = (db.prepare('SELECT * FROM sale_item WHERE sale_id = ?').all(id) as any[]).map(toSaleItem);
    return toSale(row, items);
  },

  create(input: NewSaleInput): Sale {
    if (input.items.length === 0) throw new Error('A sale must have at least one item.');

    const runTransaction = db.transaction((input: NewSaleInput) => {
      let total = new Decimal(0);
      const lines: any[] = [];

      // Pass 1: validate every line and compute totals BEFORE writing anything
      for (const item of input.items) {
        const product = productRepository.getById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);

        const qty = new Decimal(item.quantitySold);
        let unitPrice: string | null;
        let cartonsToDeduct: Decimal;

        if (item.unitUsed === 'carton') {
          unitPrice = product.priceCarton;
          cartonsToDeduct = qty;
        } else if (item.unitUsed === 'piece') {
          unitPrice = product.pricePiece;
          if (!product.unitsPerCarton) throw new Error(`${product.name}: no units_per_carton set, cannot sell by piece`);
          cartonsToDeduct = qty.dividedBy(new Decimal(product.unitsPerCarton));
        } else {
          unitPrice = product.priceKg;
          if (!product.weightPerCartonKg) throw new Error(`${product.name}: no weight_per_carton_kg set, cannot sell by kg`);
          cartonsToDeduct = qty.dividedBy(new Decimal(product.weightPerCartonKg));
        }

        if (!unitPrice) throw new Error(`${product.name}: no price set for unit "${item.unitUsed}"`);

        const lineTotal = qty.times(new Decimal(unitPrice));
        total = total.plus(lineTotal);
        lines.push({ product, item, unitPrice, lineTotal, cartonsToDeduct });
      }

      const amountPaid = new Decimal(input.amountPaid);
      if (amountPaid.lessThan(total) && !input.clientId) {
        throw new Error('A client must be selected when amount paid is less than the total.');
      }

      // Pass 2: write everything (only reached if every line above was valid)
      const saleResult = db.prepare(`
        INSERT INTO sale (client_id, total_amount, amount_paid)
        VALUES (@clientId, @totalAmount, @amountPaid)
      `).run({ clientId: input.clientId, totalAmount: total.toString(), amountPaid: input.amountPaid });

      const saleId = saleResult.lastInsertRowid as number;
      const insertItem = db.prepare(`
        INSERT INTO sale_item (sale_id, product_id, product_name, unit_used, quantity_sold, unit_price, line_total)
        VALUES (@saleId, @productId, @productName, @unitUsed, @quantitySold, @unitPrice, @lineTotal)
      `);
      const updateStock = db.prepare(`UPDATE product SET quantity = @quantity, updated_at = datetime('now') WHERE id = @id`);

      for (const line of lines) {
        // Re-fetch current quantity each time, so two lines for the same product in one sale still deduct correctly
        const current = productRepository.getById(line.product.id)!;
        const newQty = new Decimal(current.quantity).minus(line.cartonsToDeduct);
        if (newQty.lessThan(0)) {
          throw new Error(`Not enough stock for ${line.product.name}. Available: ${current.quantity}`);
        }

        insertItem.run({
          saleId, productId: line.product.id, productName: line.product.name,
          unitUsed: line.item.unitUsed, quantitySold: line.item.quantitySold,
          unitPrice: line.unitPrice, lineTotal: line.lineTotal.toString(),
        });
        updateStock.run({ id: line.product.id, quantity: newQty.toString() });
      }

      return saleId;
    });

    const saleId = runTransaction(input);
    return this.getById(saleId)!;
  },
};