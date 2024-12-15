import { OSource } from "./source/OSource.js"

/**
 * An helper object for handling a listener registrer on multiple observables.
 * @template T
 */
class MultiListener{
    
    /**
     * Register multiple listeners and save them to be able to unregister them later.
     * @param {(T)=>void} listener 
     * @param  {...OSource<T>} sources 
     */
    constructor(listener, ...sources){
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
 * @param {(T)=>void} listener 
 * @param  {...OSource<T>} observables 
 */
export function listen_all(listener, ...observables){
    return new MultiListener(listener, ...observables)
}