import { useRef, useState } from 'react'
import Clock from '../components/clock/Clock'
import { useKeepAlive } from '../hooks/useKeepAlive'
import { useStopwatch } from '../store/StopwatchProvider'
import { cn } from '../utils/cssUtils'

function App() {
  const { connectionState, error, stopwatchTime, play, pause, reset } = useStopwatch()
  const [showControls, setShowControls] = useState(false)
  // const [loading, setLoading] = useState(true)
  const intervalRef = useRef<number | null>(null)

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
    intervalRef.current = setInterval(() => setShowControls(false), 5000)
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
              className="date-text"
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
