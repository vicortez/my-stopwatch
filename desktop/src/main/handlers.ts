import { BrowserWindow } from 'electron'

export function handleToggleAlwaysOnTop(
  mainWindow: BrowserWindow
): (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any {
  return () => {
    const isAlwaysOnTop = mainWindow.isAlwaysOnTop()
    mainWindow.setAlwaysOnTop(!isAlwaysOnTop)
    return !isAlwaysOnTop
  }
}

export function handleGetIsAlwaysOnTop(
  mainWindow: BrowserWindow
): (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<boolean> | boolean {
  return () => {
    return mainWindow.isAlwaysOnTop()
  }
}
