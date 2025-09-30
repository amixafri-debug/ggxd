import { SECONDS_PER_DAY } from "../../constants";

export function animateOrbit(M, deltaTime, orbitingObject, orbit, clockwise=false) {
    const direction = clockwise ? 1 : -1
    const deltaDays = deltaTime / SECONDS_PER_DAY
    const deltaRadAnomaly = orbit.getRadPerDay() * deltaDays // M is an anomaly given in radian
    
    M = (M + (deltaRadAnomaly * direction)) % (2 * Math.PI)
    
    // Resolver Kepler: E - e sin(E) = M
    let E = M;
    for (let i = 0; i < 3; i++) {
        E = E - (E - orbit.e * Math.sin(E) - M) / (1 - orbit.e * Math.cos(E));
    }

    // Posición elíptica en el plano eclíptico
    const a = orbit.a;
    const b = a * Math.sqrt(1 - orbit.e * orbit.e);
    const x = a * (Math.cos(E) - orbit.e);
    const z = b * Math.sin(E);

    // Fijar posición de la Tierra
    orbitingObject.position.set(x, 0, z);
    return M;
}