import { OMap, OMapObservable } from "./OMap.js"


/**
 * A observable map that automaticcaly calculate his keys.
 * Can also automatically create his values from his keys when getted.
 * @template K The type of the keys 
 * @template T The type of the values
 * @extends {OMap<K,T>}
 */
export class MOAutoMap extends OMap{

    /**
     * @param {(value:T)=>K} key_factory
     * @param {(key:K)=>T=} value_factory
     * @param {Map<K,T>=} init 
     * @param {OMapObservable<K,T>=} parent
     */
    constructor(key_factory, value_factory, init, parent){
        super()
        this.observable = new OMapObservable(parent)
        this._content= init ?? /** @type {Map<K,T>} */ (new Map())
        this.key_factory = key_factory
        this.value_factory = value_factory
    }
    
    /**
     * Set or delete a value
     * @param {T} value 
     */
    set(value){
        const key = this.key_factory(value)
        const from = this._content.get(key) ?? null
        this._content.set(key,value)
        this.observable.on_change.notify({key, from,to:value})
    }

    /**
     * Get a value or create it if it does not exist
     * @param {K} key 
     */
    get_or_create(key){
        if(this.value_factory) return this.or_compute(key,()=>this.value_factory(key))
        else throw new Error("This auto map cannot auto create his values")
    }

    /**
     * Get a value
     * @param {K} key
     * @param {()=>T} computation 
     */
    or_compute(key,computation){
        let value = this._content.get(key)
        if(value===undefined){
            value = computation()
            this._content.set(key,value)
            this.observable.on_change.notify({key, from:null, to:value})
        }
        return value
    }

    /**
     * Delete a value if it exists
     * @param {K} key 
     */
    delete(key){
        const from = this._content.get(key) ?? null
        this._content.delete(key)
        this.observable.on_change.notify({key, from, to:null})
    }

}