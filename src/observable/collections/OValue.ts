import { OSource } from "../source/OSource.js"

export abstract class OValue<T>{

    declare protected _value: T

    declare observable: OSource<{from:T, to:T}>

    /** Get the value */
    get(){ return this._value }

    /** Get the value */
    get value(){ return this.get() }

}

export class MOValue<T> extends OValue<T>{

    constructor(value: T, parent?: OSource<{from:T, to:T}>){
        super()
        this.observable = new OSource(parent)
        this._value = value
    }

    /** Set the value */
    set(value: T){
        let old = this._value
        this._value = value
        this.observable.notify({from:old, to:value})
    }

    /** Set the value */
    set value(value: T){ this.set(value) }

    /** Get the value */
    get value(){ return this.get() }

    /** Register a listener and call it immediately with the current value. */
    link(listener: (event:{from:T, to:T})=>void){
        listener({from:this._value,to:this._value})
        return this.observable.add(listener)
    }

}