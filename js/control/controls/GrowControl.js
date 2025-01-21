import { PointerDragBehavior } from "../../babylonjs/core/Behaviors/Meshes/pointerDragBehavior.js";
import { StandardMaterial } from "../../babylonjs/core/Materials/standardMaterial.js";
import { Color3 } from "../../babylonjs/core/Maths/math.color.js";
import { Vector3 } from "../../babylonjs/core/Maths/math.vector.js";
import { MeshBuilder } from "../../babylonjs/core/Meshes/meshBuilder.js";
import { TransformNode } from "../../babylonjs/core/Meshes/transformNode.js";
import { Control } from "../Control.js";
import { ParameterControl } from "./ParameterControl.js";

/**
 * A control that grow and shrink
 */
export class GrowControl extends ParameterControl{

    static name = "Size Changing Control"

    constructor(wam){
        super(wam)
    }

    /** @type {(typeof Control)['getSettings']} */
    static getSettings(){
        return {"Color":"color", "Base Color":"color", ...super.getSettings()}
    }

    /** @type {(typeof Control)['getDefaultValues']} */
    static getDefaultValues(){
        return {"Color":"#ff0000", "Base Color":"#666666"}
    }

    /** @type {Control['setValue']} */
    setValue(label, value){
        switch(label){
            case "Color":
            case "Base Color":
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
            case "Color":
            case "Base Color":
                return this[label]?.toHexString()
            default:
                return super.getValue(label)
        }
    }

    updateColor(){
        if(this.#element){
            this.#element.style.backgroundColor = this["Color"]?.toHexString() ?? "#ffffff"
            this.#element.style.borderColor = this["Base Color"]?.toHexString() ?? "#ffffff"
        }
        if(this.material){
            this.material.diffuseColor = this["Color"] ?? Color3.White()
            this.base_material.diffuseColor = this["Base Color"] ?? Color3.White()
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
        this.#element.style.boxSizing="border-box";
        this.#element.style.borderWidth="10%"
        this.#element.style.borderStyle="solid"
        return this.#element
    }

    /** @type {Control['destroyElement']}  */
    destroyElement(){
        this.#element.remove()
        this.#element=null
    }

    /** @type {Control['createNode']} */
    createNode(scene){
        this.transform = new TransformNode("grow_control",scene)

        this.base = MeshBuilder.CreateBox("grow_control_base", {height:0.15,depth:1,width:1}, scene)
        this.base_material = new StandardMaterial("grow_control_base", scene)
        this.base.material = this.base_material
        this.base.setParent(this.transform)
        this.base.position.y=-0.35

        this.mesh = MeshBuilder.CreateBox("grow_control", {height:1,depth:0.8,width:0.8}, scene)
        this.material = new StandardMaterial("grow_control", scene)
        this.mesh.material = this.material
        this.mesh.setParent(this.transform)

        const pointerDragBehavior = new PointerDragBehavior({ dragAxis: new Vector3(0, 1, 0) })
        pointerDragBehavior.moveAttached = false
        pointerDragBehavior.onDragObservable.add((eventData) => {
            const {dragDistance} = eventData
            this.value += dragDistance
            this.value = Math.max(0, Math.min(1, this.value))
            this.updateColor()
            this.updateParamValue()
        })
        this.mesh.addBehavior(pointerDragBehavior)


        return this.transform
    }

    updateParamValue(){
        if(this.mesh){
            this.mesh.scaling.y=0.2+this.value*0.8
            this.mesh.position.y=this.value*0.4-0.3
        }
        super.updateParamValue()
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.transform?.dispose()
        this.mesh?.dispose()
        this.base?.dispose()
        this.material?.dispose()
        this.base_material?.dispose()
    }

    /** @type {Control['destroy']} */
    destroy(){
    }
}

function cssRgbToHex(rgb){
    let rgba = rgb.match(/\d+/g)
    return "#" + rgba.map(v=>parseInt(v).toString(16).padStart(2,"0")).join("") 
}

