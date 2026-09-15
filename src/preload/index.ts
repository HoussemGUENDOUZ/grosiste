import { contextBridge ,ipcRenderer} from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { NewProduct, UpdateProduct } from '../shared/types/product';
// Custom APIs for renderer
const api = {}
const productAPI = {
  getAll: () => ipcRenderer.invoke('product:getAll'),
  getById: (id: number) => ipcRenderer.invoke('product:getById', id),
  create: (input: NewProduct) => ipcRenderer.invoke('product:create', input),
  update: (id: number, input: UpdateProduct) => ipcRenderer.invoke('product:update', id, input),
  delete: (id: number) => ipcRenderer.invoke('product:delete', id),
};
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('productAPI', productAPI);
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
