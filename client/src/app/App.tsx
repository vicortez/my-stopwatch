import Clock from '../components/clock/Clock'
import { useStopwatch } from '../store/StopwatchProvider'
import { cn } from '../utils/cssUtils'

function App() {
  const { connectionState, error, stopwatchTime, play, pause, reset } = useStopwatch()
  // const [loading, setLoading] = useState(true)

  return (
    <>
      <main>
        <section className="min-h-screen min-w-screen flex items-center justify-center">
          <div className={cn(`p-2`)}>
            <Clock
              className="date-text"
              hours={stopwatchTime.hours}
              minutes={stopwatchTime.minutes}
              seconds={stopwatchTime.seconds}
            ></Clock>
            <div className="flex justify-center">
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
            <br />
            <div className="text-xs">Connection State: {connectionState}</div>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
