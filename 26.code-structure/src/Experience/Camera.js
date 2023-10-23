import Experience from "./Experience.js"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        // We can access the experience from global variable
        // this.experience = window.experience
        // But it is better to access it from the singleton class
        // Every time we instaciate it, we get the same instance as the first time
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setOrbitControls()
    }

    // Instanciate the camera
    setInstance()
    {
        // Set the camera
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )

        // Move it
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    // Set the orbit controls
    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    // Handle resize, called from Experience
    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    // Handle update, called from Experience
    update()
    {
        this.controls.update()
    }
}