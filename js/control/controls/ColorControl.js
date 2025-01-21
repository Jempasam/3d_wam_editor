import { PointerDragBehavior } from "../../babylonjs/core/Behaviors/Meshes/pointerDragBehavior.js";
import { StandardMaterial } from "../../babylonjs/core/Materials/standardMaterial.js";
import { Color3 } from "../../babylonjs/core/Maths/math.color.js";
import { Vector3 } from "../../babylonjs/core/Maths/math.vector.js";
import { MeshBuilder } from "../../babylonjs/core/Meshes/meshBuilder.js";
import { Control } from "../Control.js";
import { ParameterControl } from "./ParameterControl.js";

/**
 * A color coded controls that change a numeric value.
 */
export class ColorControl extends ParameterControl{

    static name = "Color Changing Control"

    constructor(wam){
        super(wam)
    }

    /** @type {(typeof Control)['getSettings']} */
    static getSettings(){
        return {"Low Color":"color", "High Color":"color", ...super.getSettings()}
    }

    /** @type {(typeof Control)['getDefaultValues']} */
    static getDefaultValues(){
        return {"Low Color":"#222222", "High Color":"#0000ff"}
    }

    /** @type {Control['setValue']} */
    setValue(label, value){
        switch(label){
            case "Low Color":
            case "High Color":
                this[label] = Color3.FromHexString(value)
                this.updateColor()
                break
            default:
                super.setValue(label,value)
        }
    }

    /** @type {Control['getValue']} */
    getValue(label){
        switch(label){
            case "Low Color":
            case "High Color":
                return this[label]?.toHexString()
            default:
                return super.getValue(label)
        }
    }

    updateColor(){
        const color = Color3.Lerp(this["Low Color"]??Color3.White, this["High Color"]??Color3.White, this.value)
        if(this.#element) this.#element.style.backgroundColor = color.toHexString()
        if(this.material) this.material.diffuseColor = color
    }

    /** @type {HTMLElement} */  #element
    /** @type {StandardMaterial} */  material
    
    /** @type {Control['createElement']} */
    createElement(){
        this.#element = document.createElement("div")
        this.#element.style.display="block"
        this.#element.style.width="100%"
        this.#element.style.height="100%"
        this.#element.style.borderRadius="50%"
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
        const ret = MeshBuilder.CreateIcoSphere("color_control", {radius:0.5}, scene)
        this.material = new StandardMaterial("color_control", scene)
        this.mesh = ret
        ret.material = this.material

        const pointerDragBehavior = new PointerDragBehavior({ dragAxis: new Vector3(0, 1, 0) })
        pointerDragBehavior.moveAttached = false
        pointerDragBehavior.onDragObservable.add((eventData) => {
            const {dragDistance} = eventData
            this.value += dragDistance
            this.value = Math.max(0, Math.min(1, this.value))
            this.updateColor()
            this.updateParamValue()
        })
        ret.addBehavior(pointerDragBehavior)


        return ret
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.mesh?.dispose()
        this.material?.dispose()
    }

    /** @type {Control['destroy']} */
    destroy(){
    }
}

function cssRgbToHex(rgb){
    let rgba = rgb.match(/\d+/g)
    return "#" + rgba.map(v=>parseInt(v).toString(16).padStart(2,"0")).join("") 
}

