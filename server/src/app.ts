import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import stopwatchRoutes from './routes/stopwatchRoutes.js'

console.log('starting dev server: loading configs')

// Load environment variables
dotenv.config({ path: '.env.local', override: false }) // loads secret local vars and overrides for the base vars
dotenv.config({ path: '.env.public', override: false }) // loads base env vars after.

const app = express()
const PORT = Number(process.env.PORT)
const NODE_ENV = process.env.NODE_ENV

console.log('starting dev server: loading current path')

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('starting dev server: Adding middleware')
// Middleware
app.use(cors())
app.use(express.json())

console.log('starting dev server: Adding routes')

// basic routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is indeed running' })
})
app.get('/api', (req, res) => {
  res.json({ message: 'Server is indeed running' })
})
app.get('/api/memory', (req, res) => {
  const usage = process.memoryUsage()
  res.json({
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`, // Resident Set Size
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(usage.external / 1024 / 1024)}MB`,
  })
})

// mount our routes
app.use('/api/stopwatch', stopwatchRoutes)

// Serve static files from React build in production
if (process.env.NODE_ENV === 'prod') {
  const clientBuildPath = path.join(__dirname, '../../client/dist')
  app.use(express.static(clientBuildPath))

  // Handle React Router - send all non-API requests to React app
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. node env = ${NODE_ENV}`)
})
