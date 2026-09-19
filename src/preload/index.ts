import { contextBridge ,ipcRenderer} from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { NewProduct, UpdateProduct } from '../shared/types/product';
import type { NewClient, UpdateClient } from '../shared/types/client';
import type { NewSaleInput } from '../shared/types/sale';
// Custom APIs for renderer
const api = {}
const productAPI = {
  getAll: () => ipcRenderer.invoke('product:getAll'),
  getById: (id: number) => ipcRenderer.invoke('product:getById', id),
  create: (input: NewProduct) => ipcRenderer.invoke('product:create', input),
  update: (id: number, input: UpdateProduct) => ipcRenderer.invoke('product:update', id, input),
  delete: (id: number) => ipcRenderer.invoke('product:delete', id),
};
const clientAPI = {
  getAll: () => ipcRenderer.invoke('client:getAll'),
  getById: (id: number) => ipcRenderer.invoke('client:getById', id),
  create: (input: NewClient) => ipcRenderer.invoke('client:create', input),
  update: (id: number, input: UpdateClient) => ipcRenderer.invoke('client:update', id, input),
  delete: (id: number) => ipcRenderer.invoke('client:delete', id),
};
const saleAPI = {
  getAll: () => ipcRenderer.invoke('sale:getAll'),
  getById: (id: number) => ipcRenderer.invoke('sale:getById', id),
  create: (input: NewSaleInput) => ipcRenderer.invoke('sale:create', input),
};
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('productAPI', productAPI);
    contextBridge.exposeInMainWorld('clientAPI', clientAPI);
    contextBridge.exposeInMainWorld('saleAPI', saleAPI);
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
