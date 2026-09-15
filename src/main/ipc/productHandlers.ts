import { ipcMain } from 'electron';
import { productRepository } from '../db/repositories/productRepository';

export function registerProductHandlers() {
  ipcMain.handle('product:getAll', () => productRepository.getAll());
  ipcMain.handle('product:getById', (_e, id: number) => productRepository.getById(id));
  ipcMain.handle('product:create', (_e, input) => productRepository.create(input));
  ipcMain.handle('product:update', (_e, id: number, input) => productRepository.update(id, input));
  ipcMain.handle('product:delete', (_e, id: number) => productRepository.delete(id));
}