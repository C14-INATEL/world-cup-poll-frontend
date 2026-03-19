import { Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import { AuthPage } from './components/auth/AuthPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="*" element={<AuthPage />} />
    </Routes>
  )
}

export default App
