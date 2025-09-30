import * as THREE from 'three'
import Orbit from './Orbit.js'
import * as constants from '../../constants'

export const EarthOrbit = new Orbit(
        constants.EARTH_A,
        constants.EARTH_EXCENT,
        constants.EARTH_PERIOD,
        0,
        0
    )

export const MoonOrbit = new Orbit(
        constants.MOON_A,
        constants.MOON_EXCENT,
        constants.MOON_PERIOD,
        THREE.MathUtils.degToRad(constants.MOON_INCLINATION),
        0
    )