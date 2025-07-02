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
import { getBaseUrl } from '../utils/apiUtils'
import { generateCode } from '../utils/randomUtils'
import { padTime } from '../utils/timeUtils'

const formatTime = (time: StopwatchTime) =>
  `${padTime(time.hours)}:${padTime(time.minutes)}:${padTime(time.seconds)}`

function getOrCreateSessionCodeInURL(): string {
  console.log(typeof import.meta.env.RENDERER_VITE_IS_DESKTOP_APP)
  if (import.meta.env.RENDERER_VITE_IS_DESKTOP_APP) {
    return handleGetOrCreateSessionCodeInDesktopApp()
  }
  let code = window.location.pathname.split('/').pop()
  if (!code) {
    code = generateCode()
    window.location.href = `/${code}`
  }
  return code
}
function handleGetOrCreateSessionCodeInDesktopApp() {
  let code = window.location.hash.slice(1)
  if (!code) {
    console.log('Session code not found. Generating one..')
    code = generateCode()
    window.location.hash = code
  }
  return code
}

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

const defaultStopwatchTime: StopwatchTime = { hours: 0, minutes: 0, seconds: 0 }
const StopwatchContext = createContext<IStopwatchContext | null>(null)

export const StopwatchProvider = ({ children }: PropType) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED')
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [stopwatchTime, setStopwatchTime] = useState<StopwatchTime>(defaultStopwatchTime)
  const [sessionCode, setSessionCode] = useState<string>(() => {
    return getOrCreateSessionCodeInURL()
  })

  const play = useCallback(async () => {
    await fetch(`${getBaseUrl()}/play?session=${sessionCode}`, { method: 'POST' })
  }, [sessionCode])
  const pause = useCallback(async () => {
    await fetch(`${getBaseUrl()}/pause?session=${sessionCode}`, { method: 'POST' })
  }, [sessionCode])
  const reset = useCallback(async () => {
    await fetch(`${getBaseUrl()}/reset?session=${sessionCode}`, { method: 'POST' })
  }, [sessionCode])

  const eventSourceRef = useRef<EventSource>(null)

  useEffect(() => {
    console.log('Will configure eventsource connection')
    const connectEventSource = () => {
      try {
        const eventSource = new EventSource(`${getBaseUrl()}/consume?session=${sessionCode}`)
        eventSourceRef.current = eventSource
        console.log('EventSource object created' + eventSource)

        eventSource.onopen = () => {
          console.log('EventSource connection opened')
          setConnectionState('CONNECTED')
          setError(null)
          document.title = getTitle(isRunning, stopwatchTime, 'CONNECTED')
        }
        eventSource.onerror = (event) => {
          console.error('EventSource error:', event)
          setConnectionState('ERROR')
          setError('Connection error occurred')
          document.title = getTitle(isRunning, stopwatchTime, 'ERROR')
        }
        eventSource.onmessage = (msgEvent: MessageEvent<string>) => {
          try {
            const { stopwatchTime, isRunning } = JSON.parse(msgEvent.data) as StopwatchData
            console.log(stopwatchTime)
            setStopwatchTime(stopwatchTime)
            setIsRunning(isRunning)
            document.title = getTitle(isRunning, stopwatchTime, 'CONNECTED')
          } catch (parseError) {
            console.error('Failed to parse SSE data:', parseError)
            setError('Invalid data received from server')
          }
        }
      } catch (connectionError) {
        console.error('Exception. Failed to create EventSource:', connectionError)
        setError('Failed to establish connection')
        setConnectionState('ERROR')
        document.title = getTitle(isRunning, stopwatchTime, 'ERROR')
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
  }, [sessionCode])

  // Listen for hash changes (for desktop app)
  useEffect(() => {
    if (!import.meta.env.RENDERER_VITE_IS_DESKTOP_APP) {
      return // Only listen in desktop app
    }

    const handleHashChange = () => {
      const newCode = window.location.hash.slice(1)
      console.log('Detected new code: ', newCode)
      if (newCode && newCode !== sessionCode) {
        setSessionCode(newCode)
      }
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [sessionCode])

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
