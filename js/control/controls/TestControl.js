import { StandardMaterial } from "../../babylonjs/core/Materials/standardMaterial.js";
import { Color3 } from "../../babylonjs/core/Maths/math.color.js";
import { MeshBuilder } from "../../babylonjs/core/Meshes/meshBuilder.js";
import { Node } from "../../babylonjs/core/node.js";
import { Control } from "../Control.js";

/**
 * A test control
 */
export class TestControl extends Control{

    static name = "Test Control"

    constructor(wam){
        super()
    }

    /** @type {(typeof Control)['getSettings']} */
    static getSettings(){
        return {"Text":"text", "Center":"color", "Outline":"color", "Param": "value_parameter"}
    }

    /** @type {(typeof Control)['getDefaultValues']} */
    static getDefaultValues(){
        return {"Text":"tarte", "Center":"#ff0000", "Outline":"#0000ff"}
    }

    /** @type {Control['setValue']} */
    setValue(label, value){
        switch(label){
            case "Text":
                this.#element.textContent = value
                break
            case "Center":
                this.#element.style.backgroundColor = value
                if(this.material) this.material.diffuseColor = Color3.FromHexString(value)
            case "Outline":
                this.#element.style.borderColor = value
                break
        }
    }

    /** @type {Control['getValue']} */
    getValue(label){
        switch(label){
            case "Text": return this.#element.textContent
            case "Center": return cssRgbToHex(this.#element.style.backgroundColor)
            case "Outline": return cssRgbToHex(this.#element.style.borderColor)
        }
    }

    /** @type {HTMLElement} */  #element
    /** @type {StandardMaterial} */  material
    
    /** @type {Control['createElement']} */
    createElement(){
        this.#element = document.createElement("div")
        this.#element.style.display="block"
        this.#element.style.width="100%"
        this.#element.style.height="100%"
        this.#element.style.borderWidth=".2rem"
        this.#element.style.borderStyle="solid"
        this.#element.style.boxSizing="border-box";
        return this.#element
    }

    /** @type {Control['destroyElement']}  */
    destroyElement(){
        this.#element.remove()
        this.#element=null
    }

    /** @type {Control['createNode']} */
    createNode(scene){
        const ret = MeshBuilder.CreateBox("test", {size:1}, scene)
        this.material = new StandardMaterial("test", scene)
        ret.material = this.material
        return ret
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){

    }

    /** @type {Control['destroy']} */
    destroy(){
    }
}

function cssRgbToHex(rgb){
    let rgba = rgb.match(/\d+/g)
    return "#" + rgba.map(v=>parseInt(v).toString(16).padStart(2,"0")).join("") 
}

