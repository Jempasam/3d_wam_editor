import { OMap, OMapObservable } from "./OMap.ts"


/**
 * A observable map that automaticcaly calculate his keys.
 * Can also automatically create his values from his keys when getted.
 * @template K The type of the keys 
 * @template T The type of the values
 */
export class MOAutoMap<K,T> extends OMap<K,T>{

    observable: OMapObservable<K,T>
    content: Map<K,T>

    constructor(
        private key_factory: (value:T)=>K,
        private value_factory?: (key:K)=>T,
        init?: Map<K,T>,
        parent?: OMapObservable<K,T>
    ){
        super()
        this.observable = new OMapObservable<K,T>(parent)
        this.content= init ?? new Map<K,T>()
    }
    
    /** Set or delete a value */
    set(value: T){
        const key = this.key_factory(value)
        const from = this.content.get(key) ?? null
        this.content.set(key,value)
        this.observable.on_change.notify({key, from,to:value})
    }

    /** Get a value or create it if it does not exist */
    get_or_create(key: K){
        const factory = this.value_factory
        if(factory) return this.or_compute(key,()=>factory(key))
        else throw new Error("This auto map cannot auto create his values")
    }

    /** Get a value */
    or_compute(key: K, computation: ()=>T){
        let value = this.content.get(key)
        if(value===undefined){
            value = computation()
            this.content.set(key,value)
            this.observable.on_change.notify({key, from:null, to:value})
        }
        return value
    }

    /** Delete a value if it exists */
    delete(key: K){
        const from = this.content.get(key) ?? null
        this.content.delete(key)
        this.observable.on_change.notify({key, from, to:null})
    }

}