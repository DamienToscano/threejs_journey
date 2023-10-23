import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Fox from "./Fox.js";

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Listen when the resources are loaded
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }

    // Update on each frame
    update()
    {
        // If there is a fox, we update it
        if (this.fox) {
            this.fox.update()
        }
    }
}