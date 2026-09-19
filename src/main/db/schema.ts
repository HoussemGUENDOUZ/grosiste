import { db } from './connection'

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
      archived              INTEGER NOT NULL DEFAULT 0,
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
    CREATE TABLE IF NOT EXISTS sale (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id     INTEGER REFERENCES client(id),
  total_amount  TEXT NOT NULL,
  amount_paid   TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sale_item (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id        INTEGER NOT NULL REFERENCES sale(id),
  product_id     INTEGER NOT NULL REFERENCES product(id),
  product_name   TEXT NOT NULL,
  unit_used      TEXT NOT NULL,
  quantity_sold  TEXT NOT NULL,
  unit_price     TEXT NOT NULL,
  line_total     TEXT NOT NULL
);
  `)
}
