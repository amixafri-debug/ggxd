import { useState } from 'react'
import { SpeedControl } from './components/control/SpeedControl'
import MainCanvas from './components/MainCanvas'
import './styles/app.css'


export default function App() {
  const [timeMultiplier, setTimeMultiplier] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [date, setDate] = useState(() => new Date())

  return (
    <div className="app-container">
      <aside className="sidebar">
      </aside>

      <main className="main-content">
        <div className="stage">
          <MainCanvas
            timeMultiplier={timeMultiplier}
            setDate={setDate}
            date={date}
            isPaused={isPaused}
          />
          <div className="speed-overlay">
            <SpeedControl
              timeMultiplier={timeMultiplier}
              setTimeMultiplier={setTimeMultiplier}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              date={date}
            />
          </div>
        </div>
      </main>
    </div>
  )
}