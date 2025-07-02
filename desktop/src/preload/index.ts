import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { CustomAPI } from '../shared/types'

// Custom APIs for renderer
const api: CustomAPI = {
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
  getIsAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top')
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
