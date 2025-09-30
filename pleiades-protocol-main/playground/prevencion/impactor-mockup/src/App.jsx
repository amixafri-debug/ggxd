import { useState } from 'react'
import Sidebar from './control/Sidebar'
import { SpeedControl } from './control/SpeedControl'
import MainCanvas from './MainCanvas'
//import './css/app.css'


export default function App() {
  const [timeSpeed, setTimeSpeed] = useState(0)
  return (
    <div className="app-container flex h-screen">
      <div className="w-1/3 bg-gray-800 text-white">
        <Sidebar />
      </div>
      <div className="w-2/3 flex flex-col">
        <SpeedControl timeSpeed={timeSpeed} setTimeSpeed={setTimeSpeed} />
        <main className="main-content flex-1">
          <MainCanvas timeSpeed={timeSpeed} />
        </main>
      </div>
    </div>
  )
}