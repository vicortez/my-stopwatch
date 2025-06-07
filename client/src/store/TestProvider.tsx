import { createContext, use, useEffect, useState, type ReactNode } from 'react'

// Create the context - initially undefined since we haven't provided a value yet
const TestContext = createContext(0)

const externalCounter = 0

/**
 * TestProvider component that manages the interval and provides the counter value
 *
 * Key insight: This component has NO internal state, which means it never
 * re-renders on its own. The counter variable updates outside of React's
 * knowledge, creating an interesting disconnect.
 */
export const TestProvider = ({ children }: { children: ReactNode }) => {
  // This is our React state that will trigger re-renders
  const [internalCount, setInternalCount] = useState(0)

  // This memoized value has an empty dependency array, so it will never update
  // Even though we're creating it inside the component, it's effectively frozen
  const value = internalCount

  // Set up the interval when the provider mounts
  useEffect(() => {
    console.log('TestProvider: Setting up interval')

    const intervalId = setInterval(() => {
      // Now we're updating React state, which will trigger re-renders
      setInternalCount((prev) => {
        const newValue = prev + 1
        console.log(
          `Internal count updated to: ${newValue} (React knows about this!)`
        )
        return newValue
      })
    }, 1000)

    // Cleanup the interval when the provider unmounts
    return () => {
      console.log('TestProvider: Cleaning up interval')
      clearInterval(intervalId)
    }
  }, []) // Empty dependency array means this effect runs once on mount

  // Here's the critical part: we're providing the current value of counter
  // But since this component never re-renders, this value gets "frozen"
  // at whatever counter was when the component first rendered
  //   const contextValue = counter

  //   console.log(`TestProvider rendering with counter value: ${contextValue}`)

  return <TestContext value={value}>{children}</TestContext>
}

/**
 * Custom hook for consuming the test context
 *
 * This provides a clean interface for components to access the context value
 * and will throw a helpful error if used outside of a TestProvider
 */
export const useTestContext = () => {
  const context = use(TestContext)

  // Good practice: check if the hook is being used within a provider
  if (context === undefined) {
    throw new Error('useTestContext must be used within a TestProvider')
  }

  return context
}
