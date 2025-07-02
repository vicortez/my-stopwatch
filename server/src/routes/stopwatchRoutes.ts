import express, { Request, Response } from 'express'
import { Stopwatch, StopwatchTime } from '../Stopwatch.js'

const router = express.Router()

// singleton that keeps track of the time globally
// const stopwatch = new Stopwatch()
const stopwatchesBySession: Record<string, Stopwatch> = {}

// cleanup sessions if no subscribers every 24h
setInterval(() => {
  console.log(
    `Will run cleanup function. Current number of active stopwatches: ${
      Object.keys(stopwatchesBySession).length
    }`
  )
  Object.keys(stopwatchesBySession).forEach((sessionCode) => {
    if (stopwatchesBySession[sessionCode].subscribedEventHandlers.size < 1) {
      console.log(`${sessionCode} had no subscribers. Removing.`)
      delete stopwatchesBySession[sessionCode]
    }
  })
  console.log(
    `Ran cleanup function. Current number of active stopwatches: ${
      Object.keys(stopwatchesBySession).length
    }`
  )
}, 24 * 60 * 60 * 1000)

router.get('/consume', (req: Request, res: Response) => {
  console.log('Initializing consumption of stopwatch by call to', req.url)
  const { session } = req.query as { session: string }
  if (!session || !session.trim()) {
    res.status(400).json({ message: 'Missing required parameter: session' })
    return
  }
  if (!stopwatchesBySession[session]) {
    console.log('New connection', session, 'creating new stopwatch.')

    stopwatchesBySession[session] = new Stopwatch()
  }
  const stopwatch = stopwatchesBySession[session]

  res.writeHead(200, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
  })
  res.write(': comment opening connection\n\n')

  const unsubscribe = stopwatch.subscribe((time: StopwatchTime) => {
    if (res.destroyed) {
      console.log('Tried to send data on a destroyed connection')
      return
    }
    const stopwatchData = { stopwatchTime: time, isRunning: stopwatch.isRunning() }
    res.write(`data: ${JSON.stringify(stopwatchData)}\n\n`)
  })

  res.on('close', () => {
    unsubscribe()
    console.log('Closing request')
  })
  res.on('error', (error) => {
    console.error('SSE connection error:', error)
    unsubscribe()
  })

  const stopwatchData = {
    stopwatchTime: stopwatch.stopwatchTime,
    isRunning: stopwatch.isRunning(),
  }
  res.write(`data: ${JSON.stringify(stopwatchData)}\n\n`)
})

router.post('/play', (req, res): void => {
  const { session } = req.query as { session: string }
  if (!session || !session.trim()) {
    res.status(400).json({ error: 'Bad request', message: 'Missing required parameter: session' })
    return
  }
  if (!stopwatchesBySession[session]) {
    res.status(400).json({ error: 'Bad request', message: `Session code ${session} not found.` })
    return
  }
  const stopwatch = stopwatchesBySession[session]
  try {
    stopwatch.play()
    res.send('started stopwatch.')
  } catch (error) {
    console.error('Error starting stopwatch:', error)
    res.status(500).send('Failed to start stopwatch.')
  }
})

router.post('/pause', (req, res) => {
  const { session } = req.query as { session: string }
  if (!session || !session.trim()) {
    res.status(400).json({ error: 'Bad request', message: 'Missing required parameter: session' })
    return
  }
  if (!stopwatchesBySession[session]) {
    res.status(400).json({ error: 'Bad request', message: 'Missing required parameter: session' })
    return
  }
  const stopwatch = stopwatchesBySession[session]
  try {
    stopwatch.pause()
    res.send('paused stopwatch.')
  } catch (error) {
    console.error('Error pausing stopwatch:', error)
    res.status(500).send('Failed to pause stopwatch.')
  }
})

router.post('/reset', (req, res) => {
  const { session } = req.query as { session: string }
  if (!session || !session.trim()) {
    res.status(400).json({ error: 'Bad request', message: 'Missing required parameter: session' })
    return
  }
  if (!stopwatchesBySession[session]) {
    res.status(400).json({ error: 'Bad request', message: 'Missing required parameter: session' })
    return
  }
  const stopwatch = stopwatchesBySession[session]
  try {
    stopwatch.reset()
    res.send('reset stopwatch.')
  } catch (error) {
    console.error('Error resetting stopwatch:', error)
    res.status(500).send('Failed to reset stopwatch.')
  }
})

//  HTTP endpoint to get current time without SSE. useful for debugging
router.get('/current', (req, res) => {
  const { session } = req.query as { session: string }
  if (!session || !session.trim()) {
    res.status(400).json({ error: 'Bad request', message: 'Missing required parameter: session' })
    return
  }
  if (!stopwatchesBySession[session]) {
    res.status(400).json({ error: 'Bad request', message: 'Missing required parameter: session' })
    return
  }
  const stopwatch = stopwatchesBySession[session]
  const now = new Date()
  res.json({
    data: stopwatch.stopwatchTime,
  })
})

export default router
