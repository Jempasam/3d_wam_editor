import { FriendlyIterable } from "../../utils/FriendlyIterable.js"
import { OSource } from "../source/OSource.js"

/**
 * A observable array
 */
export class OArrayObservable<T>{

    readonly on_add: OSource<{value:T,index:number}>

    readonly on_remove: OSource<{value:T,index:number}>

    constructor(parent: OArrayObservable<T>|undefined){
        this.on_add = new OSource(parent?.on_add)
        this.on_remove = new OSource(parent?.on_remove)
    }
}

/**
 * A observable array 
 */
export abstract class OArray<T>{

    declare observable: OArrayObservable<T>
    protected declare content: T[]

    get length(){ return this.content.length }

    get(index: number): T{
        return this.content[index]
    }

    [Symbol.iterator](){ return this.content[Symbol.iterator]() }

    values(){ return new FriendlyIterable(this.content) }
}


/**
 * A observable array 
 */
export class MOArray<T> extends OArray<T>{

     constructor(init?: T[], parent?: OArrayObservable<T>){
        super()
        this.observable = new OArrayObservable(parent)
        this.content= init ?? []
    }

    /** Remove the given number of elements at the given index and add the given values at the same index */
    splice(start: number, deleteCount: number, ...added: T[]){
        const removed= this.content.splice(start,deleteCount,...added)
        removed.forEach((value, index) => this.observable.on_remove.notify({value, index: start+index}))
        added.forEach((value, index) => this.observable.on_add.notify({value, index: start+index}))
        return removed
    }

    /** Add the values at the end of the array */
    push(...added: T[]){ this.splice(this.length,0,...added) }

    /** Insert the value at the given index */
    insert(index: number, value: T){ this.splice(index,0,value) }

    /** Remove the element at the given index */
    remove(index: number): T{ return this.splice(index,1)[0] }

    /** Remove the last element */
    pop(): T{ return this.remove(this.length-1) }

}