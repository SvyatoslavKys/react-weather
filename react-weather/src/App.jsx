import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { WeatherBackground } from './components/WeatherBackground'
import { WeatherPage } from './pages/WeatherPage'
import { Homepage } from './pages/Home'
import { AppPage } from './pages/AppPage'
import { MoonCalendar } from './pages/MoonCalendar'


function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="relative min-h-screen overflow-hidden text-slate-950">
        <WeatherBackground />
        <div className="relative z-10 min-h-screen">
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-5 sm:pb-10 sm:pt-5">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/app" element={<AppPage />} />
              <Route path="/moon" element={<MoonCalendar />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
