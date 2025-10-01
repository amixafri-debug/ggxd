import { useState } from 'react';
import MainCanvas from './components/MainCanvas';
import Sidebar from './components/control/Sidebar';
import { SpeedControl } from './components/control/SpeedControl';
import './styles/app.css';

export default function App() {
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [date, setDate] = useState(() => new Date());

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <MainCanvas
          timeMultiplier={timeMultiplier}
          setDate={setDate}
          date={date}
          isPaused={isPaused}
        />
      </div>
      <Sidebar />
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <SpeedControl
          timeMultiplier={timeMultiplier}
          setTimeMultiplier={setTimeMultiplier}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          date={date}
        />
      </div>
    </div>
  );
}