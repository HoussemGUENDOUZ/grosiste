import { ipcMain } from 'electron';
import { clientRepository } from '../db/repositories/clientRepository';

export function registerClientHandlers() {
  ipcMain.handle('client:getAll', () => clientRepository.getAll());
  ipcMain.handle('client:getById', (_e, id: number) => clientRepository.getById(id));
  ipcMain.handle('client:create', (_e, input) => clientRepository.create(input));
  ipcMain.handle('client:update', (_e, id: number, input) => clientRepository.update(id, input));
  ipcMain.handle('client:delete', (_e, id: number) => clientRepository.delete(id));
}