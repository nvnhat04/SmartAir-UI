import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// @ts-ignore - AirGuardApp is a JS file without a declaration file
import AirGuardApp from './pages/AirGuardApp'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AirGuardApp />
    </>
  )
}

export default App
