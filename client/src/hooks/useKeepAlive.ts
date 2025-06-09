import { useEffect, useRef } from 'react'

export const useKeepAlive = () => {
  const intervalRef = useRef<number | null>(null)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('Keeping connection alive by pinging server')
      fetch('/api/health').then(async (val) => {
        const res = await val.json()
        console.log(res)
      })
    }, 30000)
  }, [])
}
