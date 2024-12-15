import { Observable } from "../Observable.js";


/**
 * @template T
 * @extends {Observable<T>}
 */
export class OStartWith extends Observable{

    /**
     * 
     * @param {Observable<T>} decorated 
     * @param {(listener:(message:T)=>void)=>void} initalizer 
     */
    constructor(decorated, initalizer){
        super()
        this.decorated = decorated
        this.initalizer = initalizer
    }

    /** @type {Observable['notify']} @override */
    notify(event){
        this.decorated.notify(event)
    } 

    /** @type {Observable['register']} @override */
    register(observer){
        this.decorated.register(observer)
        this.initalizer(observer)
    }

    /** @type {Observable['unregister']} @override */
    unregister(observer){
        this.decorated.unregister(observer)
    }
}

/**
 * @template T
 * @param {Observable<T>} decorated
 * @param {Parameters<OStartWith['register']>[0]} initalizer
 * @returns {Observable<T>}
 */
export function startWith(decorated, initalizer){
    return new OStartWith(decorated, initalizer)
}