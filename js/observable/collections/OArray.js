import { FriendlyIterable } from "../../utils/FriendlyIterable.js"
import { OSource } from "../source/OSource.js"

/**
 * A observable array
 * @template T
 */
export class OArrayObservable{

    /** @type {OSource<{value:T,index:number}>} */ on_add

    /** @type {OSource<{value:T,index:number}>} */ on_remove

    /**
     * @param {OArrayObservable<T>=} parent
     */
    constructor(parent){
        this.on_add = new OSource(parent?.on_add)
        this.on_remove = new OSource(parent?.on_remove)
    }
}

/**
 * A observable array 
 * @template T
 */
export class OArray{

    /** @type {OArrayObservable<T>} */ observable
    /** @type {T[]} @protected */_content

    /** @protected */ constructor(){}

    get length(){ return this._content.length }

    /** @param {number} index */
    get(index){
        return this._content[index]
    }

    [Symbol.iterator](){ return this._content[Symbol.iterator]() }

    values(){ return new FriendlyIterable(this._content) }
}


/**
 * A observable array 
 * @template T
 * @extends {OArray<T>}
 */
export class MOArray extends OArray{

     /**
     * @param {T[]=} init 
     * @param {OArrayObservable<T>=} parent
     */
     constructor(init,parent){
        super()
        this.observable = new OArrayObservable(parent)
        this._content= init ?? []
    }

    /**
     * Remove the given number of elements at the given index and add the given values at the same index
     * @param {number} start
     * @param {number} deleteCount
     * @param {T[]} added 
     */
    splice(start, deleteCount, ...added){
        const removed= this._content.splice(start,deleteCount,...added)
        removed.forEach((value, index) => this.observable.on_remove.notify({value, index: start+index}))
        added.forEach((value, index) => this.observable.on_add.notify({value, index: start+index}))
        return removed
    }

    /**
     * Add the values at the end of the array
     * @param  {...T} added 
     */
    push(...added){ this.splice(this.length,0,...added) }

    /**
     * Insert the value at the given index
     * @param {number} index 
     * @param {T} value 
     */
    insert(index,value){ this.splice(index,0,value) }

    /**
     * Remove the element at the given index
     * @param {number} index 
     * @returns {T}
     */
    remove(index){ return this.splice(index,1)[0] }

    /**
     * Remove the last element
     * @returns {T}
     */
    pop(){ return this.remove(this.length-1) }

}