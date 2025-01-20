import { Observable } from "../Observable.js"

/**
 * A set of function.
 * @template T
 * @extends {Observable<T>}
 */
export class OSource extends Observable{

    #observers = new Set()

    /**
     * @param {Observable<T>=} parent 
     */
    constructor(parent){
        super()
        this.parent = parent
    }
    
    /**
     * Register an observer
     * @param {function(T):void} observer
     * @returns {function():void}
     * @override
     */
    register(observer){
        this.#observers.add(observer)
        return ()=> this.#observers.delete(observer)
    }

    /**
     * Unregister an observer
     * @param {function(T):void} observer
     * @override
     */
    unregister(observer){
        this.#observers.delete(observer)
    }

    /**
     * Send a notification to the observers
     * @param {T} notification
     * @override
     */
    notify(notification){
        this.#depth++
        if(this.#depth==1){
            for(let o of this.#observers)o(notification)
            if(this.parent)this.parent.notify(notification)
        }
        this.#depth=0
    }

    #depth=0
    
}