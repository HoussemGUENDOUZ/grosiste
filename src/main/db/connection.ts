import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'

const dbPath = path.join(app.getPath('userData'), 'store.db')
export const db: Database.Database = new Database(dbPath)
db.pragma('journal_mode = WAL') // better write performance/safety for a desktop app
