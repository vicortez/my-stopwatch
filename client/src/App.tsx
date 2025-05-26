import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/health')
        const memoryUse = await (await fetch('/api/memory')).json()
        console.log(memoryUse)
        const data = await response.json()
        setMessage(data.message)
      } catch (error) {
        setMessage('Failed to connect to server')
        console.error('API Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <div className="min-h-screen min-w-screen  flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Full-Stack App
          </h1>
          {loading ? (
            <p className="text-gray-600">Connecting to server...</p>
          ) : (
            <p className="text-green-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    </>
  )
}

export default App
