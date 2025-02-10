import { OSource } from "./source/OSource.ts"

/**
 * An helper object for handling a listener registrer on multiple observables.
 */
export class MultiListener<T>{
    
    /**
     * Register multiple listeners and save them to be able to unregister them later.
     */
    constructor(private sources: OSource<T>[], private listener: (event:T)=>void){
        for(let o of sources)o.register(this.listener)
    }

    /**
     * Unregister the listeners
     */
    free(){
        for(let o of this.sources)o.unregister(this.listener)
    }
}

/**
 * Register a listener on multiple observables.
 * Returns an object that can be used to unregister the listener.
 */
export function listen_all<T>(sources: OSource<T>[], listener: (event:T)=>void){
    return new MultiListener(sources, listener)
}