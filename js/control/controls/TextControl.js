import { MeshBuilder } from "../../babylonjs/core/Meshes/meshBuilder.js";
import { Control } from "../Control.js";

const droidSansBold = await (await fetch("ressources/droid_sans_bold.json")).json();


/**
 * A text display control
 */
export class TextControl extends Control{

    static name = "Test Control"

    constructor(wam){
        super()
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
            case "Text": this.#element.textContent = value; break
            case "Color": this.#element.style.color = value; break
            case "Font": this.#element.style.fontFamily = value; break
            case "Size": this.#element.style.fontSize = value+"rem"; break
            case "Weight": this.#element.style.fontWeight = value; break
        }
    }

    /** @type {Control['getValue']} */
    getValue(label){
        switch(label){
            case "Text": return this.#element.textContent
            case "Color": return cssRgbToHex(this.#element.style.color)
            case "Font": return this.#element.style.fontFamily
            case "Size": return this.#element.style.fontSize.replace("rem","")
            case "Weight": return this.#element.style.fontWeight
        }
    }

    /** @type {HTMLElement} */  #element
    
    /** @type {Control['createElement']} */
    createElement(){
        this.#element = document.createElement("div")
        this.#element.style.display="block"
        this.#element.style.width="100%"
        this.#element.style.height="100%"
        this.#element.style.boxSizing="border-box";
        this.#element.style.textAlign="center"
        this.#element.style.verticalAlign="middle"
        return this.#element
    }

    /** @type {Control['destroyElement']}  */
    destroyElement(){
        this.#element.remove()
        this.#element=null
    }

    /** @type {Control['createNode']} */
    createNode(scene){
        const ret = MeshBuilder.CreateText("test", "Salade", droidSansBold, {size:1}, scene)
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