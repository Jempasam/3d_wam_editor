import { OSource } from "./source/OSource.js"

/**
 * An helper object for handling a listener registrer on multiple observables.
 * @template T
 */
class MultiListener{
    
    /**
     * Register multiple listeners and save them to be able to unregister them later.
     * @param  {OSource<T>[]} sources
     * @param {(T)=>void} listener 
     */
    constructor(sources, listener){
        this.listener = listener
        this.observables = sources
        for(let o of sources)o.register(this.listener)
    }

    /**
     * Unregister the listeners
     */
    free(){
        for(let o of this.observables)o.unregister(this.listener)
    }
}

/**
 * Register a listener on multiple observables.
 * Returns an object that can be used to unregister the listener.
 * @template T
 * @param  {OSource<T>[]} observables 
 * @param {(T)=>void} listener 
 */
export function listen_all(observables, listener){
    return new MultiListener(observables, listener)
}