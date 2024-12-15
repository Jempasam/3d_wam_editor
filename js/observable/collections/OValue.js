import { OSource } from "../source/OSource.js"


/**
 * @template T
 */
export class OValue{

    /** @type {T} */ _value
    /** @type {OSource<{from:T, to:T}>=} */ observable

    /** @protected */ constructor(){}

    /**
     * Get the value
     * @returns {T}
     */
    get(){ return this._value }

    /**
     * Get the value
     * @returns {T}
     */
    get value(){ return this.get() }

}

/**
 * @template T
 * @extends {OValue<T>}
 */
export class MOValue extends OValue{

    /**
     * 
     * @param {T} value 
     * @param {OSource<{from:T, to:T}>=} parent
     */
    constructor(value, parent){
        super()
        this.observable = new OSource(parent)
        this._value=value
    }

    /**
     * Set the value
     * @param {T} value 
     */
    set(value){
        let old = this._value
        this._value = value
        this.observable.notify({from:old, to:value})
    }

    /**
     * Set the value
     * @param {T} value 
     */
    set value(value){ this.set(value) }

    /**
     * Get the value
     * @returns {T}
     */
    get value(){ return this.get() }

}