import { FriendlyIterable } from "../../utils/FriendlyIterable.js"
import { MOArray, OArray, OArrayObservable } from "./OArray.js"
import { OSource } from "../source/OSource.js"


/**
 * A observable array
 * @template K
 * @template T
 */
export class OMapObservable{

    /** @type {OSource<{key:K, from:T|null, to:T|null}>} */ on_change

    /**
     * @param {OMapObservable<K,T>=} parent 
     */
    constructor(parent){
        this.on_change = new OSource(parent?.on_change)
    }
}


/**
 * A observable array
 * @template K The type of the keys 
 * @template T The type of the values
 */
export class OMap{

    /** @type {OMapObservable<K,T>} */ observable
    /** @type {Map<K,T>} @protected */ _content

    /** @protected */ constructor(){}

    /**
     * Test if a key exists
     * @param {K} key
     * @returns {boolean}
     */
    has(key){
        return this._content.has(key)
    }

    /**
     * Get a value
     * @param {K} key
     * @returns {T|null}
     */
    get(key){
        return this._content.get(key) ?? null
    }

    /** Get the entries */
    entries(){ return new FriendlyIterable(this._content.entries()) }

    /** Get the entries */
    keys(){ return new FriendlyIterable(this._content.keys()) }

    /** Get the values */
    values(){ return new FriendlyIterable(this._content.values()) }

    /**
     * Create an observable array that is automatically updated when this observable map is updated.
     * It try to keep the same ordering through each update.
     * It need to be disposed when not used anymore.
     * @returns {OArray<T>&{dispose():void}}
     */
    observable_values(){
        let keys= []
        /** @type {MOArray<T>&{dispose():void}} */
        // @ts-ignore
        let values= new MOArray()
        for(let [key,value] of this.entries()) values.push(value)
        values.dispose = this.observable.on_change.register( ({key, from, to}) => {
            if(from!=null){
                if(to!=null){
                    const index = keys.indexOf(key)
                    values.splice(index,1,to)
                }
                else{
                    const index = keys.indexOf(key)
                    keys.splice(index,1)
                    values.splice(index,1)
                }
            }
            else if(to!=null){
                keys.push(key)
                values.push(to)
            }
        })
        return values
    }
}


/**
 * A observable array
 * @template K The type of the keys 
 * @template T The type of the values
 * @extends {OMap<K,T>}
 */
export class MOMap extends OMap{

    /**
     * @param {Map<K,T>=} init 
     * @param {OMapObservable<K,T>=} parent
     */
    constructor(init,parent){
        super()
        this.observable = new OMapObservable(parent)
        this._content= init ?? /** @type {Map<K,T>} */ (new Map())
    }

    /**
     * Set or delete a value
     * @param  {K} key
     * @param {T|null} value the value to set, or null to delete  
     */
    set_or_delete(key,value){
        const from= this._content.get(key) ?? null
        if(value===null){
            this._content.delete(key)
        }else{
            this._content.set(key,value)
        }
        this.observable.on_change.notify({key, from, to: value})
    }
    
    /**
     * Set or delete a value
     * @param {K} key 
     * @param {T} value 
     */
    set(key,value){
        this.set_or_delete(key,value)
    }

    /**
     * Delete a value if it exists
     * @param {K} key 
     */
    delete(key){
        this.set_or_delete(key,null)
    }

}