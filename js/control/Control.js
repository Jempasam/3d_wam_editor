

/**
 * @typedef {{ [label:string]: "color"|"text"|[number,number]|{min:number,max:number,step:number}|"value_parameter"|"choice_parameter" }} ControlSettings
 * 
 * The superclass for custom elements controls.
 * They should be put in a div container that center them using flexboxes.
 */
export class Control extends HTMLElement{

    /**
     * A factory for creating custom elements controls.
     * @param {any|null} wam The WAM instance. If null, the control is disabled and serve just a display purpose.
     */
    constructor(wam){super()}
    

    /**
     * Get the list of parameters
     * @return {ControlSettings} settings
     */
    static getSettings(){
        return {}
    }

    /**
     * Set a value of a parameter
     * @param {string} label 
     * @param {string} value 
     */
    setValue(label, value){
        this[label] = value
    }

    /**
     * Get a value of a parameter
     * @param {string} label
     * @returns {string} 
     */
    getValue(label){
        return ""
    }

    /**
     * Free the resources used by the control
     * @param {any} wam
     */
    destroy(wam){
        throw new Error("Not implemented")
    }

    static name = "Unnamed Control"
    
}

