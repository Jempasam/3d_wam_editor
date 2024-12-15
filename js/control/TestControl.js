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
        this.style.backgroundColor="#ff0000"
        this.style.borderColor="#0000ff"
        this.style.borderWidth=".2rem"
        this.style.borderStyle="solid"
        this.style.boxSizing="border-box";
    }

    /** @type {(typeof Control)['getSettings']} */
    static getSettings(){
        return {"Text":"text", "Center":"color", "Outline":"color", "Param": "value_parameter"}
    }

    /** @type {Control['setValue']} */
    setValue(label, value){
        switch(label){
            case "Text":
                this.textContent = value
                break
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
            case "Text":
                return this.textContent
            case "Center":
                return cssRgbToHex(this.style.backgroundColor)
            case "Outline":
                return cssRgbToHex(this.style.borderColor)
        }
    }

    /** @type {Control['destroy']} */
    destroy(){
    }
}

function cssRgbToHex(rgb){
    let rgba = rgb.match(/\d+/g)
    return "#" + rgba.map(v=>parseInt(v).toString(16).padStart(2,"0")).join("") 
}

customElements.define('wam3d-testcontrol', TestControl);