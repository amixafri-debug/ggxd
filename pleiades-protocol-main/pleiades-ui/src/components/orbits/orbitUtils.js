import * as THREE from 'three'

export function createOrbit(orbit, orbitingObject, orbitColor, segs = 50000) {
    // orbit must be of Orbit class, contains the info of the orbit
    // orbitingObject is the object which travels through the orbit
    // focus of the elipsis
    
    const eclipticPlane = new THREE.Group()

    // set orbit tilt from orbit information object
    eclipticPlane.rotation.x = orbit.incl
    // add orbiting object to orbit
    eclipticPlane.add(orbitingObject)

    // visible orbit
    const a = orbit.a;
    const b = a * Math.sqrt(1 - orbit.e * orbit.e);

    const orbitPoints = [];
    for (let i = 0; i <= segs; i++) {
        const th = (i / segs) * 2 * Math.PI;
        const x = a * (Math.cos(th) - orbit.e);
        const z = b * Math.sin(th);
        orbitPoints.push(new THREE.Vector3(x, 0, z));
    }

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const earthOrbitMat  = new THREE.LineBasicMaterial({ 
        color: orbitColor,
        transparent: true,
        opacity: 0.6
    });
    const earthOrbitLine = new THREE.Line(orbitGeometry, earthOrbitMat);

    eclipticPlane.add(earthOrbitLine)
    return eclipticPlane
}