import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import './css/mainCanvas.css'

export default function MainCanvas({ timeSpeed }) {
    const mountRef = useRef(null)

    useEffect(() => {
        const currentMount = mountRef.current
        if (!currentMount) return

        const width = currentMount.clientWidth
        const height = currentMount.clientHeight

        // Scene
        const scene = new THREE.Scene()
        scene.background = 0xffffff

        // Camera THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
        camera.position.set(0, 0, 4)

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        currentMount.appendChild(renderer.domElement)

        return () => {
            currentMount.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, [timeSpeed])

    return <div ref={mountRef} className="main-canvas" />
}