import EventEmitter from "./EventEmitter.js";

// Class to manage time values
export default class Time extends EventEmitter
{
    constructor()
    {
        super()
        
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        // Delta is not instanciated at 0 to avoid a bug when the experience is started
        this.delta = 16

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick()
    {
        // Update time values
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        // Call tick on next frame
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}