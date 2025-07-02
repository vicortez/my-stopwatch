export interface CustomAPI {
  toggleAlwaysOnTop: () => Promise<boolean>
  getIsAlwaysOnTop: () => Promise<boolean>
}
