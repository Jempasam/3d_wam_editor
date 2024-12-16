import { Control } from "../Control.js";

/**
 * A text display control
 */
export class TextControl extends Control{

    static name = "Test Control"

    constructor(wam){
        super()
        this.style.display="block"
        this.style.textAlign="center"
        this.style.verticalAlign="middle"
        this.style.width="100%"
        this.style.height="100%"
        this.style.boxSizing="border-box";
    }

    /** @type {(typeof Control)['getSettings']} */
    static getSettings = ()=>({
        Text: "text", 
        Color: "color", 
        Font: "font", 
        Size: {min:0.1, max:10, step:0.1},
        Weight: {min:100, max:900, step:100},
    })

    /** @type {(typeof Control)['getDefaultValues']} */
    static getDefaultValues = ()=>({
        Text: "Text", 
        Color: "#000000", 
        Font: "Arial", 
        Size: "1",
        Weight: "400",
    })

    /** @type {Control['setValue']} */
    setValue(label, value){
        switch(label){
            case "Text": this.textContent = value; break
            case "Color": this.style.color = value; break
            case "Font": this.style.fontFamily = value; break
            case "Size": this.style.fontSize = value+"rem"; break
            case "Weight": this.style.fontWeight = value; break
        }
    }

    /** @type {Control['getValue']} */
    getValue(label){
        switch(label){
            case "Text": return this.textContent
            case "Color": return cssRgbToHex(this.style.color)
            case "Font": return this.style.fontFamily
            case "Size": return this.style.fontSize.replace("rem","")
            case "Weight": return this.style.fontWeight
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

customElements.define('wam3d-textcontrol', TextControl);