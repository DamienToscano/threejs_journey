import * as THREE from "three"
import Experience from "../Experience.js";

export default class Fox
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        // Add folder Fox in debug bar if debug is active
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Fox')
        }

        // Setup
        this.resource = this.resources.items.foxModel

        this.setModel()
        this.setAnimation()
    }

    // Put model on the scene
    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if (child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    // Animate the fox
    setAnimation()
    {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        // Prepare all animations
        this.animation.actions = {}
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])

        // Set the default animation and play it
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Set a method to play animation
        // We can test it directly in the console with window.experience.world.fox.animation.play('idle')
        // Because experience has been passed as a global variable
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            // We need to reset and play the new action and cross fade between them
            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if (this.debug.active) {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }

            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    // Update on each frame
    update()
    {
        // Update the animation
        // Passing the delta from our time class, in milliseconds
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}