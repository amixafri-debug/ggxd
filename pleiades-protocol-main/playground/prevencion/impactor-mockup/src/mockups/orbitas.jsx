import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";

/**
 * Órbita elíptica realista Tierra–Sol con a=1 UA y e=0.0167.
 * - Escala: 1 UA = 10 unidades 3D (ajustable).
 * - Periodo sideral: 365.256 días.
 * - Sol en el foco (origen).
 * - Resolución de Kepler con Newton–Raphson.
 */

// Constantes astronómicas (unidades: UA y días)
const AU = 1.0;                 // Unidad Astronómica
const a = AU;                   // semieje mayor = 1 UA
const e = 0.0167;               // excentricidad orbital de la Tierra
const T = 365.256;              // periodo sideral (días)
const TWO_PI = Math.PI * 2;

// Escala visual (escala: 1 UA -> 10 unidades de escena)
const SCALE = 10;

// Tamaños de las esferas (no a escala física para que se vean bien)
const SUN_RADIUS = 0.5;   // unidades de escena
const EARTH_RADIUS = 0.15;

// Movimiento medio (rad/día)
const n = TWO_PI / T;

function keplerE(M, ecc, tol = 1e-8, maxIter = 25) {
  // Normalizar M al rango [-π, π] para convergencia estable
  let m = ((M + Math.PI) % TWO_PI) - Math.PI;
  // Estimación inicial: para excentricidades pequeñas, E0 ≈ M
  let E = m;
  for (let i = 0; i < maxIter; i++) {
    const f = E - ecc * Math.sin(E) - m;
    const fp = 1 - ecc * Math.cos(E);
    const dE = -f / fp;
    E += dE;
    if (Math.abs(dE) < tol) break;
  }
  // Volver al mismo offset de 2π que llevaba M original
  const wraps = Math.floor((M - m) / TWO_PI);
  return E + wraps * TWO_PI;
}

function trueAnomaly(E, ecc) {
  const s = Math.sqrt((1 + ecc) / (1 - ecc));
  const tanHalfNu = s * Math.tan(E / 2);
  let nu = 2 * Math.atan(tanHalfNu);
  // Asegura rango [0, 2π)
  if (nu < 0) nu += TWO_PI;
  return nu;
}

function heliocentricPosition(a, ecc, M) {
  const E = keplerE(M, ecc);
  const r = a * (1 - ecc * Math.cos(E));
  const nu = trueAnomaly(E, ecc);
  const x = r * Math.cos(nu);
  const y = r * Math.sin(nu);
  // Orbital plane in X–Y; Z=0 (sin inclinación para simplicidad)
  return [x, 0, y];
}

function OrbitPath({ a, e, segments = 720 }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const E = (i / segments) * TWO_PI;
      const r = a * (1 - e * Math.cos(E));
      const nu = trueAnomaly(E, e);
      const x = r * Math.cos(nu) * SCALE;
      const z = r * Math.sin(nu) * SCALE;
      pts.push([x, 0, z]);
    }
    return pts;
  }, [a, e, segments]);

  return (
    <Line points={points} lineWidth={1} dashed dashScale={50} dashSize={0.5} gapSize={0.5} />
  );
}

function Earth({ timeRef }) {
  const mesh = useRef();
  useFrame(() => {
    const timeDays = timeRef.current;
    // Asegura que el módulo sea positivo
    const t = ((timeDays % T) + T) % T;
    const M = n * t;
    const [x, y, z] = heliocentricPosition(a, e, M);
    if (mesh.current) mesh.current.position.set(x * SCALE, y * SCALE, z * SCALE);
  });
  return (
    <mesh ref={mesh} castShadow>
      <sphereGeometry args={[EARTH_RADIUS, 32, 32]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

function Sun() {
  return (
    <mesh position={[0, 0, 0]} receiveShadow castShadow>
      <sphereGeometry args={[SUN_RADIUS, 48, 48]} />
      <meshStandardMaterial emissiveIntensity={2} emissive="#ffaa00" color="#ffcc33" roughness={0.4} />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      {/* Luz puntual simulando el Sol */}
      <pointLight position={[0, 0, 0]} intensity={3} distance={SCALE * 30} decay={2} />
      <ambientLight intensity={0.15} />
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
      <planeGeometry args={[SCALE * 6, SCALE * 6, 1, 1]} />
      <meshStandardMaterial color="#111" metalness={0.0} roughness={1} />
    </mesh>
  );
}

function Hud({ timeScale, setTimeScale, paused, setPaused }) {
  return (
    <div className="absolute top-3 left-3 z-10 rounded-2xl bg-black/60 text-white backdrop-blur px-4 py-3 shadow-lg flex items-center gap-3">
      <button
        className="rounded-xl px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20"
        onClick={() => setPaused(p => !p)}
      >
        {paused ? "▶ Reanudar" : "⏸ Pausar"}
      </button>
      <label className="text-sm font-medium">Velocidad (días/seg):</label>
      <input
        className="accent-white"
        type="range"
        min={0.1}
        max={50}
        step={0.1}
        value={timeScale}
        onChange={(e) => setTimeScale(parseFloat(e.target.value))}
      />
      <span className="w-14 text-right tabular-nums">{timeScale.toFixed(1)}</span>
    </div>
  );
}

// Componente silencioso que avanza el tiempo del simulador dentro del bucle de render
function TimeTicker({ timeRef, paused, timeScale }) {
  useFrame((_, delta) => {
    if (!paused) {
      timeRef.current += delta * timeScale; // delta en segundos -> días/seg
    }
  });
  return null;
}

function SceneWrapper() {
  const [timeScale, setTimeScale] = useState(5); // días por segundo
  const [paused, setPaused] = useState(false);
  const timeRef = useRef(0); // días transcurridos simulados

  return (
    <div className="relative w-full h-[70vh]">
      <Hud timeScale={timeScale} setTimeScale={setTimeScale} paused={paused} setPaused={setPaused} />
      <Canvas frameloop="always" shadows camera={{ position: [0, 5, SCALE * 2.2], fov: 45 }}>
        <color attach="background" args={["#0b1020"]} />
        <fog attach="fog" args={["#0b1020", SCALE * 1.2, SCALE * 5]} />
        <Lights />
        <Ground />
        <Sun />
        <OrbitPath a={a} e={e} />
        <Earth timeRef={timeRef} />
        <TimeTicker timeRef={timeRef} paused={paused} timeScale={timeScale} />
        <OrbitControls enableDamping dampingFactor={0.1} />
      </Canvas>
      {/* Leyenda */}
      <div className="absolute bottom-3 left-3 z-10 rounded-2xl bg-black/60 text-white backdrop-blur px-4 py-3 shadow-lg text-sm leading-tight">
        <div><span className="font-semibold">Escala:</span> 1 UA ≈ 10 unidades de escena</div>
        <div><span className="font-semibold">Parámetros:</span> a=1 UA, e=0.0167, T=365.256 días</div>
        <div>El Sol está en el foco de la elipse (origen). Órbita trazada con Kepler.</div>
      </div>
    </div>
  );
}

export default function EarthSunOrbit() {
  return (
    <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col items-center justify-start p-6 gap-4">
      <h1 className="text-2xl md:text-3xl font-semibold">Órbita Tierra–Sol (1 UA, elíptica realista)</h1>
      <p className="opacity-80 max-w-2xl text-center text-sm md:text-base">
        Visualización 3D en React + three/fiber. La Tierra orbita al Sol siguiendo una elipse con excentricidad 0.0167.
        Puedes pausar y ajustar la velocidad de la simulación en días por segundo.
      </p>
      <SceneWrapper />
      <div className="opacity-70 text-xs mt-2">Tip: arrastra para orbitar la cámara, rueda para hacer zoom.</div>
      <div className="opacity-70 text-xs">Nota: los radios de las esferas no están a escala física para mejorar la visibilidad.</div>
    </div>
  );
}
