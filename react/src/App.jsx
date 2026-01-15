import { useState } from 'react'
import MainPage from './pages/MainPage.jsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MainPage />
    </>
  )
}

export default App
