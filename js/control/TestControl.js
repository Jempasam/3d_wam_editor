import { Control } from "./Control.js";

/**
 * A test control
 */
export class TestControl extends Control{

    static name = "Test Control"

    constructor(wam){
        super()
        this.style.display="block"
        this.style.width="100%"
        this.style.height="100%"
        this.style.backgroundColor="red"
        this.style.borderColor="yellow"
        this.style.borderWidth=".2rem"
        this.style.borderStyle="solid"
        this.style.boxSizing="border-box";
    }

    /** @type {(typeof Control)['getSettings']} */
    static getSettings(){
        return {"Center":"color", "Outline":"color", "Param": "value_parameter"}
    }

    /** @type {Control['setValue']} */
    setValue(label, value){
        switch(label){
            case "Center":
                this.style.backgroundColor = value
                break
            case "Outline":
                this.style.borderColor = value
                break
        }
    }

    /** @type {Control['getValue']} */
    getValue(label){
        switch(label){
            case "Center":
                return this.style.backgroundColor
            case "Outline":
                return this.style.borderColor
        }
    }

    /** @type {Control['destroy']} */
    destroy(wam){
    }
}


customElements.define('wam3d-testcontrol', TestControl);