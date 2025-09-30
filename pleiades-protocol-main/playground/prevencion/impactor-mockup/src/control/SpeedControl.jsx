import '../css/control/speedControl.css'

export function SpeedControl({ timeSpeed, setTimeSpeed }) {
    const handleTimeSpeedChange = (e) => {
        setTimeSpeed(parseFloat(e.target.value))
    }

    return (
        <div id="speed-control">
            <label htmlFor="time-speed">Time Speed:</label>
            <input
                id="time-speed"
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={timeSpeed}
                onChange={handleTimeSpeedChange}
            />
            <span>{timeSpeed.toFixed(1)}x</span>
        </div>
    )
}