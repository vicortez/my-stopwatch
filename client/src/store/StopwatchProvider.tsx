import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ConnectionState, StopwatchData, StopwatchTime } from '../types/models'
import { padTime } from '../utils/timeUtils'

const formatTime = (time: StopwatchTime) =>
  `${padTime(time.hours)}:${padTime(time.minutes)}:${padTime(time.seconds)}`

interface IStopwatchContext {
  connectionState: ConnectionState
  error: string | null
  stopwatchTime: StopwatchTime
  isRunning: boolean
  play: () => void
  pause: () => void
  reset: () => void
}
interface PropType {
  children: ReactNode
}
// const defaultContextValue: IStopwatchContext = {
//   connectionState: 'DISCONNECTED',
//   error: null,
//   stopwatchTime: defaultStopwatchTime,
// }

const url = '/api/stopwatch'
const defaultStopwatchTime: StopwatchTime = { hours: 0, minutes: 0, seconds: 0 }
const StopwatchContext = createContext<IStopwatchContext | null>(null)
export const StopwatchProvider = ({ children }: PropType) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED')
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [stopwatchTime, setStopwatchTime] = useState<StopwatchTime>(defaultStopwatchTime)

  const play = useCallback(async () => {
    await fetch(`${url}/play`, { method: 'POST' })
  }, [])
  const pause = useCallback(async () => {
    await fetch(`${url}/pause`, { method: 'POST' })
  }, [])
  const reset = useCallback(async () => {
    await fetch(`${url}/reset`, { method: 'POST' })
  }, [])

  const eventSourceRef = useRef<EventSource>(null)

  useEffect(() => {
    console.log('Will configure eventsource connection')
    const connectEventSource = () => {
      try {
        const eventSource = new EventSource(`${url}/consume`)
        eventSourceRef.current = eventSource
        console.log('EventSource object created' + eventSource)

        eventSource.onopen = () => {
          console.log('EventSource connection opened')
          setConnectionState('CONNECTED')
          setError(null)
        }
        eventSource.onerror = (event) => {
          console.error('EventSource error:', event)
          setConnectionState('ERROR')
          setError('Connection error occurred')
          document.title = getTitle(isRunning, stopwatchTime, connectionState)
        }
        eventSource.onmessage = (msgEvent: MessageEvent<string>) => {
          try {
            const { stopwatchTime, isRunning } = JSON.parse(msgEvent.data) as StopwatchData
            document.title = getTitle(isRunning, stopwatchTime, connectionState)
            console.log(stopwatchTime)
            setStopwatchTime(stopwatchTime)
            setIsRunning(isRunning)
          } catch (parseError) {
            console.error('Failed to parse SSE data:', parseError)
            setError('Invalid data received from server')
          }
        }
      } catch (connectionError) {
        console.error('Exception. Failed to create EventSource:', connectionError)
        setError('Failed to establish connection')
        setConnectionState('ERROR')
        document.title = getTitle(isRunning, stopwatchTime, connectionState)
      }
    }
    connectEventSource()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      setConnectionState('DISCONNECTED')
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      connectionState,
      error,
      stopwatchTime,
      isRunning,
      play,
      pause,
      reset,
    }),
    [connectionState, error, stopwatchTime, isRunning, play, pause, reset]
  )

  return <StopwatchContext value={contextValue}>{children}</StopwatchContext>
}

export const useStopwatch = (): IStopwatchContext => {
  const context = use(StopwatchContext)
  if (!context) {
    throw new Error(' must be used within a StopwatchProvider')
  }
  return context
}

function getTitle(
  isRunning: boolean,
  stopwatchTime: StopwatchTime,
  connectionState: ConnectionState
): string {
  let connStateIndicator = ''
  if (connectionState === 'CONNECTING') {
    connStateIndicator = '🔃'
  } else if (connectionState === 'DISCONNECTED') {
    connStateIndicator = '📵'
  } else if (connectionState === 'ERROR') {
    connStateIndicator = '✖'
  } else if (connectionState === 'FAILED') {
    connStateIndicator = '❌'
  }
  return `${connStateIndicator}${isRunning ? '' : '⏸️'} ${formatTime(stopwatchTime)}`
}
