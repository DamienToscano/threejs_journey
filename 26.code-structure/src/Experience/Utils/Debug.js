import * as dat from 'lil-gui'

export default class Debug
{
    constructor()
    {
        // We get the value after # in the url to activate debug mode with #debug
        this.active = window.location.hash === '#debug'

        if (this.active)
        {
            this.ui = new dat.GUI()
        }
    }
}