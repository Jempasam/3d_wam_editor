import { FriendlyIterable } from "../../utils/FriendlyIterable.ts"
import { OSource } from "../source/OSource.ts"
import { MOArray, OArray } from "./OArray.ts"


/**
 * A observable array
 */
export class OMapObservable<K,T>{

    readonly on_change: OSource<{key:K, from:T|null, to:T|null}>

    constructor(parent?: OMapObservable<K,T>){
        this.on_change = new OSource(parent?.on_change)
    }
}


/**
 * A observable array
 * @template K The type of the keys 
 * @template T The type of the values
 */
export abstract class OMap<K,T>{

    declare observable: OMapObservable<K,T>
    protected declare content: Map<K,T>

    /** Test if a key exists */
    has(key: K): boolean{
        return this.content.has(key)
    }

    /** Get a value */
    get(key: K): T|null{
        return this.content.get(key) ?? null
    }

    /** Get the entries */
    entries(){ return new FriendlyIterable(this.content.entries()) }

    /** Get the entries */
    keys(){ return new FriendlyIterable(this.content.keys()) }

    /** Get the values */
    values(){ return new FriendlyIterable(this.content.values()) }

    /**
     * Create an observable array that is automatically updated when this observable map is updated.
     * It try to keep the same ordering through each update.
     * It need to be disposed when not used anymore.
     */
    observable_values(): OArray<T>&{dispose():void}{
        let keys: K[]= []
        let values= new MOArray<T>() as MOArray<T>&{dispose():void}
        for(let [_,value] of this.entries()) values.push(value)
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
 */
export class MOMap<K,T> extends OMap<K,T>{

    constructor(init?: Map<K,T>, parent?: OMapObservable<K,T>){
        super()
        this.observable = new OMapObservable(parent)
        this.content = init ?? new Map<K,T>()
    }

    /**
     * Set or delete a value
     * @param value the value to set, or null to delete  
     */
    set_or_delete(key: K, value: T|null){
        const from= this.content.get(key) ?? null
        if(value===null){
            this.content.delete(key)
        }else{
            this.content.set(key,value)
        }
        this.observable.on_change.notify({key, from, to: value})
    }
    
    /**
     * Set or delete a value
     */
    set(key: K, value: T){
        this.set_or_delete(key,value)
    }

    /**
     * Delete a value if it exists
     */
    delete(key: K){
        this.set_or_delete(key,null)
    }

}