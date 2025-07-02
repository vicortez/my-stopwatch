import { useEffect, useRef, useState } from 'react'
import App2 from '../../../../client/src/app/App'
import AlwaysOnTopToggle from './components/AlwaysOnTopToggle'
import { OptionsButton } from './components/OptionsButton'
import { FormValue, OptionsModal } from './components/OptionsModal'
import { cn } from './lib/utils'

function App(): React.JSX.Element {
  const [showControls, setShowControls] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [sessionCode, setSessionCode] = useState('12345')

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Always apply an initial value, since we dont support deep links and we need a session code
  // to get a stopwatch
  useEffect(() => {
    window.location.hash = sessionCode
  }, [sessionCode])

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

  const handleSubmitModal = ({ sessionCode }: FormValue): void => {
    setShowModal(false)
    setSessionCode(sessionCode)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
    >
      <div
        className={cn(
          'fixed -top-5.5 left-0 right-0 flex justify-center transition-all duration-300 ease-in-out',
          {
            'translate-y-full opacity-100': showControls,
            'translate-y-0 opacity-0': !showControls
          },
          `flex justify-center w-full gap-2`
        )}
      >
        <AlwaysOnTopToggle />
        <OptionsButton onClick={() => setShowModal(true)} />
      </div>
      <App2 />
      <OptionsModal
        isOpen={showModal}
        initialFormValue={{ sessionCode }}
        onCancel={() => setShowModal(false)}
        onSubmit={handleSubmitModal}
      />
    </div>
  )
}

export default App
