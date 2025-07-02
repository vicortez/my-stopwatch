import { cn } from '@renderer/lib/utils'
import React, { useEffect, useState } from 'react'

interface IProps {
  showControls: boolean
}
const AlwaysOnTopToggle: React.FC<IProps> = ({ showControls }) => {
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false)

  useEffect(() => {
    // Get initial state
    window.api.getIsAlwaysOnTop().then(setIsAlwaysOnTop)
  }, [])
  const handleToggle = async (): Promise<void> => {
    try {
      const newState = await window.api.toggleAlwaysOnTop()
      setIsAlwaysOnTop(newState)
    } catch (error) {
      console.error('Failed to toggle always on top:', error)
    }
  }

  return (
    <div
      // temporary fix: -top-5.5 because for some reason the div is shown with a large gap to top even with top-0
      className={cn(
        'fixed -top-5.5 left-0 right-0 flex justify-center transition-all duration-300 ease-in-out',
        {
          'translate-y-full opacity-100': showControls,
          'translate-y-0 opacity-0': !showControls
        },
        `flex justify-center w-full`
      )}
    >
      <div
        className={cn(
          `px-3 py-1 text-xs rounded-md border transition-colors left-auto right-auto flex items-center bg-[#1a1a1a]`
        )}
      >
        <input
          className="hover:cursor-pointer"
          type="checkbox"
          id="ontop"
          checked={isAlwaysOnTop}
          onChange={handleToggle}
        />
        <label className="hover:cursor-pointer" htmlFor="ontop">
          📌{'On top'}
        </label>
      </div>
    </div>
  )
}

export default AlwaysOnTopToggle
