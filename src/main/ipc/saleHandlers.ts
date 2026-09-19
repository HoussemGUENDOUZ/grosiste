import { ipcMain } from 'electron';
import { saleRepository } from '../db/repositories/saleRepository';

export function registerSaleHandlers() {
  ipcMain.handle('sale:getAll', () => saleRepository.getAll());
  ipcMain.handle('sale:getById', (_e, id: number) => saleRepository.getById(id));
  ipcMain.handle('sale:create', (_e, input) => saleRepository.create(input));
}