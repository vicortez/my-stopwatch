import express from 'express'
import { Stopwatch, StopwatchTime } from '../Stopwatch.js'

const router = express.Router()

// singleton that keeps track of the time globally
const stopwatch = new Stopwatch()

router.get('/consume', (req, res) => {
  console.log('Initializing consumption of stopwatch by call to', req.url)

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
    res.write(`data: ${JSON.stringify(time)}\n\n`)
  })

  res.on('close', () => {
    unsubscribe()
    console.log('Closing request')
  })
  res.on('error', (error) => {
    console.error('SSE connection error:', error)
    unsubscribe()
  })

  res.write(`data: ${JSON.stringify(stopwatch.stopwatchTime)}\n\n`)
})

router.post('/play', (req, res) => {
  try {
    stopwatch.play()
    res.send('started stopwatch.')
  } catch (error) {
    console.error('Error starting stopwatch:', error)
    res.status(500).send('Failed to start stopwatch.')
  }
})

router.post('/pause', (req, res) => {
  try {
    stopwatch.pause()
    res.send('paused stopwatch.')
  } catch (error) {
    console.error('Error pausing stopwatch:', error)
    res.status(500).send('Failed to pause stopwatch.')
  }
})

router.post('/reset', (req, res) => {
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
  const now = new Date()
  res.json({
    data: stopwatch.stopwatchTime,
  })
})

export default router
