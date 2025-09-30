import { useMemo } from 'react'
import '../../styles/control/speedControl.css'

export function SpeedControl({ timeMultiplier, setTimeMultiplier, isPaused, setIsPaused, date}) {
  const formatted = useMemo(() => {
    if (!date) return '—'
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(date)
  }, [date])

  const handleTimeSpeedChange = (e) => {
    setTimeMultiplier(parseFloat(e.target.value))
  }

  return (
    <div id="speed-control" className="speed-control">
      <div className="control-row">
        <div className="clock">{formatted}</div>
      </div>

      <div className="row">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className={`pause-btn ${isPaused ? "paused" : "playing"}`} onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? "▶" : "❚❚"}
          </button>
          <div className="row-buttons">
            {[
              { label: "real time", value: 1 },
              { label: "1 min", value: 60 },
              { label: "1 hour", value: 3600 },
              { label: "1 day", value: 86400 },
              { label: "1 week", value: 604800 },
              { label: "1 month", value: 2592000 },
              { label: "1 year", value: 31536000 },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleTimeSpeedChange({ target: { value } })}
                className={`speed-btn ${timeMultiplier === value ? "active" : ""}`}
                style={{ borderRadius: "6px", 
                  border: timeMultiplier === value ? "2px solid #0b427e" : "1px solid #5f5f5fff", 
                  background: timeMultiplier === value ? "#0b427e" : "#5f5f5fff", 
                  color: "rgb(181, 194, 0)", cursor: "pointer"}}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
