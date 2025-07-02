import { useEffect, useRef, useState } from 'react'
import App2 from '../../../../client/src/app/App'
import AlwaysOnTopToggle from './components/AlwaysOnTopToggle'

function App(): React.JSX.Element {
  const [showControls, setShowControls] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleMouseEnter = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setShowControls(true)
  }

  const handleMouseLeave = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => setShowControls(false), 500)
  }

  const handleTouch = (): void => {
    setShowControls(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => setShowControls(false), 4000)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
    >
      <AlwaysOnTopToggle showControls={showControls} />
      <App2 />
    </div>
  )
}

export default App
