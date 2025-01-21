import { PointerDragBehavior } from "../../babylonjs/core/Behaviors/Meshes/pointerDragBehavior.js";
import { StandardMaterial } from "../../babylonjs/core/Materials/standardMaterial.js";
import { Color3 } from "../../babylonjs/core/Maths/math.color.js";
import { Vector3 } from "../../babylonjs/core/Maths/math.vector.js";
import { MeshBuilder } from "../../babylonjs/core/Meshes/meshBuilder.js";
import { TransformNode } from "../../babylonjs/core/Meshes/transformNode.js";
import { Control } from "../Control.js";
import { ParameterControl } from "./ParameterControl.js";

/**
 * A rotating control.
 */
export class CursorControl extends ParameterControl{

    static name = "Rotating Cursor Control"

    constructor(wam){
        super(wam)
    }

    /** @type {(typeof Control)['getSettings']} */
    static getSettings(){
        return {
            "Base Color":"color",
            "Cursor Color":"color",
            ...super.getSettings(),
        }
    }

    /** @type {(typeof Control)['getDefaultValues']} */
    static getDefaultValues(){
        return {
            "Base Color":"#222222",
            "Cursor Color":"#0000ff",
        }
    }

    /** @type {Control['setValue']} */
    setValue(label, value){
        switch(label){
            case "Base Color":
            case "Cursor Color":
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
            case "Base Color":
            case "Cursor Color":
                return this[label]?.toHexString()
            default:
                return super.getValue(label)
        }
    }

    updateColor(){
        if(this.#element){
            this.#element.style.backgroundColor = this["Base Color"]?.toHexString() ?? "#000000"
            this.#cursor.style.backgroundColor = this["Cursor Color"]?.toHexString() ?? "#000000"
        }
        if(this.cylinder_material){
            this.cylinder_material.diffuseColor = this["Base Color"] ?? Color3.White
            this.cursor_material.diffuseColor = this["Cursor Color"] ?? Color3.White
        }
    }

    /** @type {HTMLElement} */  #element
    /** @type {HTMLElement} */  #cursor
    /** @type {StandardMaterial} */  cylinder_material
    
    /** @type {Control['createElement']} */
    createElement(){
        this.#element = document.createElement("div")
        this.#element.style.display="block"
        this.#element.style.width="100%"
        this.#element.style.height="100%"
        this.#element.style.borderRadius="50%"
        this.#element.style.boxSizing="border-box";
        this.#element.style.position="relative"

        this.#cursor = document.createElement("div")
        this.#cursor.style.position="absolute"
        this.#cursor.style.display="block"
        this.#cursor.style.width="10%"
        this.#cursor.style.height="60%"
        this.#cursor.style.left="45%"
        this.#cursor.style.top="0%"
        this.#element.appendChild(this.#cursor)

        return this.#element
    }

    /** @type {Control['destroyElement']}  */
    destroyElement(){
        this.#element.remove()
        this.#element=null
    }

    /** @type {Control['createNode']} */
    createNode(scene){
        this.transform = new TransformNode("cusor_control_transform",scene)
        const cylinder = this.cylinder = MeshBuilder.CreateCylinder("cursor_control", {diameter:1,height:0.8}, scene)
        this.cylinder_material = cylinder.material = new StandardMaterial("cursor_control", scene)
        cylinder.setParent(this.transform)

        const cursor = this.cursor = MeshBuilder.CreateBox("cursor_control2", {width:0.1,height:1,depth:0.6}, scene)
        cursor.position.z=0.3
        this.cursor_material = cursor.material = new StandardMaterial("cursor_control2",scene)
        cursor.setParent(cylinder)

        const pointerDragBehavior = new PointerDragBehavior({ dragAxis: new Vector3(0, 1, 0) })
        pointerDragBehavior.moveAttached = false
        pointerDragBehavior.onDragObservable.add((eventData) => {
            const {dragDistance} = eventData
            this.value += dragDistance
            this.value = Math.max(0, Math.min(1, this.value))
            this.updateColor()
            this.updateParamValue()
        })
        this.transform.addBehavior(pointerDragBehavior)


        return this.transform
    }

    updateParamValue(){
        if(this.cylinder) this.cylinder.rotation.y = (this.value-0.5)*Math.PI
        if(this.#element) this.#element.style.rotate = `${Math.round((this.value-0.5)*180)}deg`
        super.updateParamValue()
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.transform?.dispose()
        this.cylinder?.dispose()
        this.cursor?.dispose()
        this.cylinder_material?.dispose()
        this.cursor_material?.dispose()
    }

    /** @type {Control['destroy']} */
    destroy(){
    }
}

function cssRgbToHex(rgb){
    let rgba = rgb.match(/\d+/g)
    return "#" + rgba.map(v=>parseInt(v).toString(16).padStart(2,"0")).join("") 
}

