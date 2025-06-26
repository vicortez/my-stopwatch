import { StopwatchProvider } from '../store/StopwatchProvider'
import Index from './Index'

const App = () => {
  return (
    <StopwatchProvider>
      <Index />
    </StopwatchProvider>
  )
}
export default App
