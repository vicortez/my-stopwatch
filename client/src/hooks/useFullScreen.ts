import { useCallback, useEffect, useState } from 'react'

export const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)

  //set fullscreen listener to update state
  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleChange)

    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  const toggleFullScreen = useCallback(async () => {
    try {
      const docElement = document.documentElement
      if (!document.fullscreenElement) {
        await docElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error)
    }
  }, [])

  return { isFullScreen, toggleFullScreen }
}
