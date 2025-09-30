import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { createEarth } from './bodies/Earth'
import { createStars } from './bodies/StarField'
import { createMoon } from './bodies/Moon'
import { createSun } from './bodies/Sun'
import { EarthOrbit, MoonOrbit } from './orbits/orbitList'
import { createOrbit } from './orbits/orbitUtils'
import { animateOrbit } from './animate/orbitAnimation'
import { rotate } from './animate/rotation'
import { adjustCamera } from './animate/cameraAnimation'
import { createLabelRenderer, addLabel, disposeLabelRenderer, onResize } from './bodies/Labels'
import { loadTiles, initTiles, getUpdateControls } from '../utils/initialLoader'
import { CONTROL_MIN_DISTANCE, NEAREST_DISTANCE, EARTH_INCLINATION} from '../constants'
import '../styles/mainCanvas.css'
import { createSunBloom } from './postprocess/bloom'

export default function MainCanvas({ timeMultiplier, setDate, date, isPaused}) {
    //states
    const mountRef = useRef(null)
    const timeMultiplierRef = useRef(timeMultiplier)
    const dateRef = useRef(date)
    const isPausedRef = useRef(false)

    //Scene objects
    const cameraAnchorRef = useRef(null)
    const labelsRef = useRef([])

    //Animation objects
    const lastDateUpdate = useRef(0) // seconds since last date update
    const orbitsAnomaliesRef = useRef(new Map()) // current mean anomalies for orbits
    const earthRotationAngleRef = useRef(0)
    
    const setOrbitAnomaly = (id, anomaly) => {
        orbitsAnomaliesRef.current.set(id, anomaly);
    };
    const getOrbitAnomaly = (id) => {
        return orbitsAnomaliesRef.current.get(id);
    };

    useEffect(() => {
        // Set orbits initial Mean Anomalies for orbiting bodies (position on the orbit)
        setOrbitAnomaly("earth", EarthOrbit.mean_anomaly)
        setOrbitAnomaly("moon", MoonOrbit.mean_anomaly)
    }, [])

    useEffect(() => {
        timeMultiplierRef.current = timeMultiplier;
    }, [timeMultiplier]);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        const currentMount = mountRef.current
        if (!currentMount) return

        const width = currentMount.clientWidth
        const height = currentMount.clientHeight

        // Scene
        const scene = new THREE.Scene()
        scene.background = 0xffffff

        // Camera
        const camera = new THREE.PerspectiveCamera(40, width / height, NEAREST_DISTANCE, 100000)
        camera.position.set(0, 0, 4)

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        currentMount.appendChild(renderer.domElement)

        // Postprocesado
        const composer = createSunBloom(renderer, scene, camera, width, height)

        // Labels
        const container = currentMount
        container.style.position = 'relative';
        const labelRenderer = createLabelRenderer(container, width, height);
        window.addEventListener('resize', onResize);
        onResize(container, camera, renderer, labelRenderer);

        // Orbit Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.enablePan = true
        controls.enableZoom = true
        controls.minDistance = CONTROL_MIN_DISTANCE
        controls.maxDistance = 200000;
        controls.rotateSpeed = 1
        controls.zoomSpeed = 1

        const updateControls = getUpdateControls(controls, camera);
        controls.addEventListener('change', updateControls);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
        scene.add(ambientLight)

        // Sun
        const sun = createSun()
        sun.position.set(0, 0, 0) 
        scene.add(sun)
        const sunLabel = addLabel(sun, 'Sun')
        labelsRef.current.push(sunLabel)

        // Starfield
        const starField = createStars(5000, 60000, 100000)
        scene.add(starField)

        // Moon
        const moon = createMoon()
        const moonLabel = addLabel(moon, 'Moon')
        labelsRef.current.push(moonLabel)

        // Earth (earthGroup)
        const earth = createEarth()
        initTiles(earth) //Initial textures 
        const earthAnchor  = earth.userData.anchor               
        const surface = earth.userData.surface
        cameraAnchorRef.current = earthAnchor //Initalization of cameraAnchorRef
        const earthLabel = addLabel(earth, 'Earth')
        labelsRef.current.push(earthLabel)

        //update tiles when user moves the camera (debounce)
        let tileUpdateTimeout = null
        const scheduleTileUpdate = () => {
            if (tileUpdateTimeout) clearTimeout(tileUpdateTimeout)
            tileUpdateTimeout = setTimeout(() => {
                loadTiles(earth, camera)
                tileUpdateTimeout = null
            }, 300) //delay after last movement
        }

        const onControlsChangeTiles = scheduleTileUpdate; // alias para poder quitarlo
        const onControlsEnd = () => { loadTiles(earth, camera) };

        controls.addEventListener('change', onControlsChangeTiles);
        controls.addEventListener('end', onControlsEnd);
        
        // === Orbits ===
        // Orbiting objects are part of the orbitPlane group, so they are NOT added directly to the scene
        // scene contains earthOrbitPlane, which contains earth, which contains moonOrbitPlane, which contains moon
        const earthOrbitPlane = createOrbit(EarthOrbit, earth, 0x87CEFA, 50000)
        scene.add(earthOrbitPlane)
        const moonOrbitPlane = createOrbit(MoonOrbit, moon, 0xffffff, 5000)
        earth.add(moonOrbitPlane)

        // Label click events
        const onLabelClick = (newAnchor) => {
            cameraAnchorRef.current = newAnchor
            adjustCamera(cameraAnchorRef.current, controls, camera, true)
        }
        // For every label add event listener
        for (const label of labelsRef.current) {
            const inner = label.element.firstChild
            inner.addEventListener("click", (e) => {
                e.stopPropagation();
                const labeledBody = label.userData.labeledBody
                if (labeledBody.userData.canFocus){
                    onLabelClick(labeledBody.userData.anchor)
                }
        });
        }

        const clock = new THREE.Clock();

        // Animation loop
        let animationId
        const animate = () => {
            animationId = requestAnimationFrame(animate)

            if (isPausedRef.current === false) {

                const deltaTime = clock.getDelta() //Seconds since last animation frame
                const simulatedDeltaTime = deltaTime * timeMultiplierRef.current //Seconds ellapsed in simulation since last animation
                
                // Update orbits
                let newMoonAnomaly = animateOrbit(getOrbitAnomaly("moon"), simulatedDeltaTime, moon, MoonOrbit, false)
                let newEarthAnomaly = animateOrbit(getOrbitAnomaly("earth"), simulatedDeltaTime, earth, EarthOrbit, false)
                setOrbitAnomaly("moon", newMoonAnomaly)
                setOrbitAnomaly("earth", newEarthAnomaly)

                // Earth rotation
                const earthTilt = THREE.MathUtils.degToRad(EARTH_INCLINATION);
                earthRotationAngleRef.current = rotate(surface, earthTilt, simulatedDeltaTime, earthRotationAngleRef.current)

                // Update date when lastDateUpdate greater than 0.5s
                dateRef.current = new Date(dateRef.current.getTime() + (simulatedDeltaTime * 1000))

                lastDateUpdate.current += deltaTime
                if (lastDateUpdate.current > 0.25){
                    setDate(dateRef.current)
                    lastDateUpdate.current = 0
                }
            }

            // Camara
            adjustCamera(cameraAnchorRef.current, controls, camera, false)
            
            composer.render()
            labelRenderer.render(scene, camera);

        }
        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', onResize);
            controls.removeEventListener('change', onControlsChangeTiles);
            controls.removeEventListener('change', updateControls);
            controls.removeEventListener('end', onControlsEnd);

            if (tileUpdateTimeout) clearTimeout(tileUpdateTimeout)
            controls.dispose()

             // DOM
            if (renderer.domElement?.parentElement === currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            disposeLabelRenderer()
            renderer.dispose()
        }
    }, [])

    return <div ref={mountRef} className="main-canvas" />
}