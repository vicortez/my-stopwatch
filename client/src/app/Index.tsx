import { useEffect, useRef, useState } from 'react'
import Clock from '../components/clock/Clock'
import { useFullScreen } from '../hooks/useFullScreen'
import { useKeepAlive } from '../hooks/useKeepAlive'
import { useStopwatch } from '../store/StopwatchProvider'
import { cn } from '../utils/cssUtils'

let wakeLock = null

function Index() {
  const { error, stopwatchTime, isRunning, play, pause, reset } = useStopwatch()
  const [showControls, setShowControls] = useState(false)
  const [blinkingPauseIndicator, setBlinkingPauseIndicator] = useState(false)
  const { toggleFullScreen } = useFullScreen()

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
  }, [isRunning, stopwatchTime])

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
          <div className={cn(`py-2`)}>
            <Clock
              className={cn({ 'text-gray-500': blinkingPauseIndicator }, 'date-text')}
              hours={stopwatchTime.hours}
              minutes={stopwatchTime.minutes}
              seconds={stopwatchTime.seconds}
            ></Clock>
          </div>
        </section>
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 flex justify-center transition-all duration-200 ease-in-out',
            {
              'translate-y-0 opacity-100': showControls,
              'translate-y-full opacity-0': !showControls,
            }
          )}
        >
          <div className="flex gap-2 py-1 sm:py-4 px-4 text-xs sm:text-base">
            <button type="button" onClick={() => (isRunning ? pause() : play())}>
              {isRunning ? 'Pause' : 'Play'}
            </button>
            <button type="button" onClick={reset}>
              Reset
            </button>
            <button type="button" onClick={toggleFullScreen} className="bg-transparent">
              ⛶
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default Index
