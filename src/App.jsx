import { useState, useEffect } from 'react'
import SplashLoader from './components/common/SplashLoader'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 900))
      } catch (error) {
        console.error('Initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  if (isLoading) {
    return <SplashLoader />
  }

  return (
    <div className="App">
      <AppRoutes />
    </div>
  )
}

export default App
