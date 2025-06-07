// import '@fontsource/dseg7-classic'
import '@fontsource/dseg7-classic/300-italic.css'
import '@fontsource/dseg7-classic/300.css'
import '@fontsource/dseg7-classic/400-italic.css'
import '@fontsource/dseg7-classic/400.css'
import '@fontsource/dseg7-classic/700-italic.css'
import '@fontsource/dseg7-classic/700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import './index.css'
import { StopwatchProvider } from './store/StopwatchProvider.tsx'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <StopwatchProvider>
        <App />
      </StopwatchProvider>
    </StrictMode>
  )
} else {
  console.error('The root element with ID "root" was not found!')
}
