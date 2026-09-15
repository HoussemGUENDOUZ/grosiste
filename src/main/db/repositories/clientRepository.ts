import { db } from '../connection';
import type { Client, NewClient, UpdateClient } from '../../../shared/types/client';

function toClient(row: any): Client {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const clientRepository = {
  getAll(): Client[] {
    const rows = db.prepare('SELECT * FROM client ORDER BY name').all();
    return rows.map(toClient);
  },

  getById(id: number): Client | null {
    const row = db.prepare('SELECT * FROM client WHERE id = ?').get(id);
    return row ? toClient(row) : null;
  },

  create(input: NewClient): Client {
    const stmt = db.prepare(`
      INSERT INTO client (name, address, phone)
      VALUES (@name, @address, @phone)
    `);
    const result = stmt.run(input);
    return this.getById(result.lastInsertRowid as number)!;
  },

  update(id: number, input: UpdateClient): Client {
    const existing = this.getById(id);
    if (!existing) throw new Error(`Client ${id} not found`);
    const merged = { ...existing, ...input };
    db.prepare(`
      UPDATE client SET name = @name, address = @address, phone = @phone, updated_at = datetime('now')
      WHERE id = @id
    `).run({ ...merged, id });
    return this.getById(id)!;
  },

  delete(id: number): void {
    db.prepare('DELETE FROM client WHERE id = ?').run(id);
  },
};