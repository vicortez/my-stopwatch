export interface StopwatchData {
  stopwatchTime: StopwatchTime
  isRunning: boolean
}
export interface StopwatchTime {
  hours: number
  minutes: number
  seconds: number
}

export type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'ERROR' | 'FAILED' | 'CONNECTED'
