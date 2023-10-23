import * as THREE from "three"
import Camera from "./Camera.js"
import Renderer from "./Renderer.js"
import Resources from "./Utils/Resources.js"
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import World from "./World/World.js"
import sources from "./sources.js"
import Debug from "./Utils/Debug.js"

// Convert the Experience to singleton
let instance = null

export default class Experience
{
    constructor(canvas)
    {
        // Singleton process
        // If the instance already exists, return it and do not instanciate a new one
        if (instance) {
            return instance
        }

        instance = this
        // Global access
        // We allow access to the experience from the outside, like in the console
        window.experience = this

        /**
         * Options
         */
        this.canvas = canvas

        /**
         * Setup
         */

        // Instanciate the classes that will be used
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // Listen to resize event from Sizes class
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Listen to tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    /**
     * Handle resize
     */
    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    /**
     * Handle update
     */
    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    // Destroy the experience
    // Doc here https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
    destroy()
    {
        // When we destroy the experience, we stop listening to sizes and tick events
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it is a mesh
            if (child instanceof THREE.Mesh)
            {
                // Remove the geometry
                child.geometry.dispose()

                // Remove the material
                for (const key in child.material)
                {
                    const value = child.material[key]
                    
                    // Test if a value exists and if it has a dispose method
                    if (value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        // Destroy the orbit controls
        this.camera.controls.dispose()

        // Destroy the renderer
        this.renderer.instance.dispose()

        // Destroy the debug
        if (this.debug.active)
        {
            this.debug.ui.destroy()
        }
    }
}