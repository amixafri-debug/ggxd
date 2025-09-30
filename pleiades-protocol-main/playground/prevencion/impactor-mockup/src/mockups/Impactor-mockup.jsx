import { useMemo, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

/**
 * Mockup simple de desvío por impacto cinético (tipo DART)
 * - Muestra una Tierra 3D y una trayectoria de asteroide con offset lateral.
 * - La UI permite ajustar parámetros y calcula si el desvío evita el impacto.
 *
 * Simplificaciones clave:
 *  - Umbral de "choque" (ventana de colisión) fijo: 10,000 km.
 *  - Línea de vuelo recta; el desplazamiento = Δv * tiempo_anticipación.
 *  - Densidad homogénea; sin mecánica orbital completa ni b-plane real.
 */

// === Utilidades físicas (unidades SI donde tenga sentido) ===
const KM = 1000; // m en un km
const YEAR = 365.25 * 24 * 3600; // s

function asteroidMass(diameterMeters, densityKgM3) {
  const r = diameterMeters / 2;
  const volume = (4 / 3) * Math.PI * r * r * r; // m^3 (esfera)
  return volume * densityKgM3; // kg
}

function deltaV(beta, mImpactorKg, vRelMS, mAstKg) {
  // Δv ≈ β * (m_imp * v_rel) / m_ast
  if (mAstKg <= 0) return 0;
  return (beta * mImpactorKg * vRelMS) / mAstKg; // m/s
}

function missDistance(deltaVms, leadTimeYears) {
  // Desplazamiento a lo largo de trayectoria ≈ Δs = Δv * t
  return deltaVms * leadTimeYears * YEAR; // metros
}

// === Escena 3D ===
function Earth() {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#2b6cb0" metalness={0.1} roughness={0.8} />
    </mesh>
  );
}

function Asteroid({ xOffset = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Movimiento simple a lo largo de Z
    const z = 4 - ((t % 8) / 8) * 8; // de +4 a -4 y reinicia
    if (ref.current) {
      ref.current.position.set(xOffset, 0, z);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 32, 32]} />
      <meshStandardMaterial color="#aaaaaa" metalness={0.3} roughness={0.6} />
    </mesh>
  );
}

function Trajectory({ xOffset = 0 }) {
  // Segmento largo en Z con offset X
  const points = useMemo(() => {
    const arr = [];
    for (let z = -5; z <= 5; z += 0.25) arr.push([xOffset, 0, z]);
    return arr;
  }, [xOffset]);
  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={points.length}
          array={new Float32Array(points.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial linewidth={2} />
    </line>
  );
}

export default function App() {
  // === Estado de parámetros ===
  const [diameterKm, setDiameterKm] = useState(0.3); // 300 m
  const [density, setDensity] = useState(3000); // kg/m^3 (rocoso)
  const [vRelKms, setVRelKms] = useState(15); // km/s
  const [beta, setBeta] = useState(2); // factor de multiplicación de momento
  const [mImpactorTon, setMImpactorTon] = useState(1); // toneladas
  const [leadYears, setLeadYears] = useState(5); // años de anticipación

  // === Cálculos ===
  const mAst = useMemo(
    () => asteroidMass(diameterKm * KM, density),
    [diameterKm, density]
  );
  const dv = useMemo(
    () => deltaV(beta, mImpactorTon * 1000, vRelKms * KM, mAst),
    [beta, mImpactorTon, vRelKms, mAst]
  );
  const missM = useMemo(() => missDistance(dv, leadYears), [dv, leadYears]);

  // Umbral: 10,000 km como "ventana de colisión" aproximada
  const collisionWindowKm = 10000;
  const missKm = missM / KM;
  const avoidsImpact = missKm >= collisionWindowKm;

  // === Escala de visualización ===
  // 1 unidad ~ 10,000 km (radio umbral)
  const unitPerKm = 1 / collisionWindowKm; // unidad por km
  const xOffsetUnits = Math.min(missKm * unitPerKm, 3); // cap visual a 3u

  return (
    <div className="w-screen h-screen grid grid-cols-1 md:grid-cols-3">
      {/* Panel de controles */}
      <div className="p-4 md:col-span-1 space-y-4 overflow-y-auto">
        <h1 className="text-2xl font-bold">Impacto cinético — Mockup</h1>
        <p className="text-sm opacity-80">
          Ajusta parámetros y observa si el desvío supera la ventana de colisión (~10,000 km).
        </p>

        <Control label={`Diámetro asteroide: ${diameterKm.toFixed(2)} km`}>
          <input
            type="range"
            min={0.05}
            max={1.5}
            step={0.01}
            value={diameterKm}
            onChange={(e) => setDiameterKm(parseFloat(e.target.value))}
          />
        </Control>

        <Control label={`Densidad: ${density} kg/m³`}>
          <input
            type="range"
            min={500}
            max={8000}
            step={50}
            value={density}
            onChange={(e) => setDensity(parseInt(e.target.value))}
          />
        </Control>

        <Control label={`Velocidad relativa: ${vRelKms.toFixed(1)} km/s`}>
          <input
            type="range"
            min={5}
            max={40}
            step={0.5}
            value={vRelKms}
            onChange={(e) => setVRelKms(parseFloat(e.target.value))}
          />
        </Control>

        <Control label={`β (multiplicador de momento): ${beta.toFixed(2)}`}>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.1}
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
          />
        </Control>

        <Control label={`Masa impactor: ${mImpactorTon.toFixed(2)} t`}>
          <input
            type="range"
            min={0.05}
            max={20}
            step={0.05}
            value={mImpactorTon}
            onChange={(e) => setMImpactorTon(parseFloat(e.target.value))}
          />
        </Control>

        <Control label={`Anticipación: ${leadYears.toFixed(1)} años`}>
          <input
            type="range"
            min={0.5}
            max={30}
            step={0.5}
            value={leadYears}
            onChange={(e) => setLeadYears(parseFloat(e.target.value))}
          />
        </Control>

        <div className="mt-4 p-3 rounded-2xl border">
          <h2 className="font-semibold mb-2">Resultados</h2>
          <ul className="text-sm space-y-1">
            <li>masa asteroide ≈ {(mAst).toExponential(3)} kg</li>
            <li>Δv ≈ {dv.toExponential(3)} m/s</li>
            <li>desplazamiento ≈ {Math.round(missKm).toLocaleString()} km</li>
            <li>umbral colisión ≈ {collisionWindowKm.toLocaleString()} km</li>
          </ul>
          <div className={`mt-3 px-3 py-2 rounded-xl inline-block ${avoidsImpact ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {avoidsImpact ? "✅ Evita el impacto" : "⚠️ No evita el impacto"}
          </div>
        </div>

        <p className="text-xs opacity-70 mt-2">
          Nota: modelo de juguete para demo. Próximos pasos: b-plane real, perturbaciones,
          límites de β según composición, y análisis de ventanas de lanzamiento.
        </p>
      </div>

      {/* Lienzo 3D */}
      <div className="md:col-span-2">
        <Canvas camera={{ position: [3, 2, 4], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.9} />

          {/* Tierra */}
          <Earth />

          {/* Trayectoria y asteroide con offset proporcional al miss distance */}
          <Trajectory xOffset={xOffsetUnits} />
          <Asteroid xOffset={xOffsetUnits} />

          {/* Plano de referencia del umbral (círculo radio ~1u) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.99, 1.01, 64]} />
            <meshBasicMaterial color="#888" side={2} />
          </mesh>

          {/* UI flotante dentro del Canvas */}
          <Html position={[0, 1.4, 0]} center>
            <div className="px-2 py-1 rounded-lg text-xs bg-white/80 shadow">
              1 unidad ≈ {collisionWindowKm.toLocaleString()} km
            </div>
          </Html>

          <OrbitControls enablePan={true} enableZoom={true} />
        </Canvas>
      </div>
    </div>
  );
}

function Control({ label, children }) {
  return (
    <div>
      <div className="text-sm font-medium mb-1">{label}</div>
      {children}
    </div>
  );
}
