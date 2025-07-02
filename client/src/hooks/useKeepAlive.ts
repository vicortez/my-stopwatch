import { useEffect, useRef } from 'react'

export const useKeepAlive = () => {
  const intervalRef = useRef<number | null>(null)
  useEffect(() => {
    let url = '/api/health'
    if (import.meta.env.RENDERER_VITE_API_PROD_URL) {
      url = import.meta.env.RENDERER_VITE_API_PROD_URL + url
    }

    intervalRef.current = setInterval(() => {
      console.log('Keeping connection alive by pinging server')
      fetch(url).then(async (val) => {
        const res = await val.json()
        console.log(res)
      })
    }, 30000)
  }, [])
}
