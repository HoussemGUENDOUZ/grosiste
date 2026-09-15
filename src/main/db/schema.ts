import { db } from './connection';

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS product (
      id                    INTEGER PRIMARY KEY AUTOINCREMENT,
      name                  TEXT NOT NULL,
      quantity              TEXT NOT NULL,
      low_stock_threshold   TEXT NOT NULL,
      price_piece           TEXT,
      price_carton          TEXT,
      price_kg              TEXT,
      units_per_carton      TEXT,
      weight_per_carton_kg  TEXT,
      created_at            TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS client (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      address     TEXT,
      phone       TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}