import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { WeatherPage } from './pages/WeatherPage'
import { Homepage } from './pages/Home'
import { AppPage } from './pages/AppPage'


function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/app" element={<AppPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
