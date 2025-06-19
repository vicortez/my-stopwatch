import { useEffect, useRef, useState } from 'react'
import Clock from '../components/clock/Clock'
import { useKeepAlive } from '../hooks/useKeepAlive'
import { useStopwatch } from '../store/StopwatchProvider'
import { cn } from '../utils/cssUtils'

let wakeLock = null

function App() {
  const { connectionState, error, stopwatchTime, isRunning, play, pause, reset } = useStopwatch()
  const [showControls, setShowControls] = useState(false)
  const [blinkingPauseIndicator, setBlinkingPauseIndicator] = useState(false)
  // const [loading, setLoading] = useState(true)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    requestWakeLock()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // blink text color on paused
  const blinkingIntervalRef = useRef<number>(null)
  useEffect(() => {
    if (blinkingIntervalRef.current) {
      clearInterval(blinkingIntervalRef.current)
    }
    const hasTimeElapsed = stopwatchTime.hours + stopwatchTime.minutes + stopwatchTime.seconds > 0
    if (!isRunning && hasTimeElapsed) {
      blinkingIntervalRef.current = setInterval(() => {
        setBlinkingPauseIndicator((val) => !val)
      }, 1000)
    } else {
      setBlinkingPauseIndicator(false)
    }

    return () => {
      if (blinkingIntervalRef.current) {
        clearInterval(blinkingIntervalRef.current)
      }
    }
  }, [isRunning])

  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen')
      wakeLock.addEventListener('release', () => {
        console.log('Screen Wake Lock released')
      })
      console.log('Screen Wake Lock is active')
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`)
    }
  }

  useKeepAlive()

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => setShowControls(false), 500)
  }

  const handleTouch = () => {
    setShowControls(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => setShowControls(false), 4000)
  }

  return (
    <>
      <main
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouch}
      >
        <section className="min-h-screen min-w-screen flex items-center justify-center">
          <div className={cn(`py-2 px-4`)}>
            <Clock
              className={cn({ 'text-gray-500': blinkingPauseIndicator }, 'date-text')}
              hours={stopwatchTime.hours}
              minutes={stopwatchTime.minutes}
              seconds={stopwatchTime.seconds}
            ></Clock>
            <div
              className={cn(
                'flex flex-col justify-center transition-all duration-900 ease-in-out overflow-hidden',
                {
                  'max-h-20 opacity-100 translate-y-0': showControls,
                  'max-h-20 opacity-0 translate-y-4': !showControls,
                }
              )}
            >
              <br />
              <div className="text-xs">Connection State: {connectionState}</div>
            </div>
          </div>
        </section>
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 flex justify-center transition-all duration-300 ease-in-out',
            {
              'translate-y-0 opacity-100': showControls,
              'translate-y-full opacity-0': !showControls,
            }
          )}
        >
          <div className="flex gap-2 py-4 px-4">
            <button type="button" onClick={play}>
              Play
            </button>
            <button type="button" onClick={pause}>
              Pause
            </button>
            <button type="button" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
