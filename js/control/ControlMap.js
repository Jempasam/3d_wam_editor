import { Vector3 } from "../babylonjs/core/Maths/math.vector.js";
import { TransformNode } from "../babylonjs/core/Meshes/transformNode.js";
import { Node } from "../babylonjs/core/node.js";
import { Scene } from "../babylonjs/core/scene.js";
import { MOArray, OArray } from "../observable/collections/OArray.js";
import { html } from "../utils/doc.js";
import { FriendlyIterable } from "../utils/FriendlyIterable.js";
import { Control } from "./Control.js";

export class ControlMap{
    /** @typedef {{x:number, y:number, width:number, height:number, values:any, control:Control, container:HTMLElement|null, node:TransformNode|null}} Item */

    /** @type {Item[]} */
    #controls =  []

    /** @type {(event:Item)=>void} */
    on_add = ()=>{}

    /** @type {(event:Item)=>void} */
    on_remove = ()=>{}
    
    /**
     * @param {HTMLElement=} gui_container
     * @param {Node=} node_container 
     */
    constructor(gui_container, node_container){
        this.gui_container = gui_container
        this.node_container = node_container
    }

    /**
     * Splice on the control array
     * @param {number} index
     * @param {number} deleteCount
     * @param  {...{x:number,y:number,width:number,height:number,values:any,control:Control}} items
     */
    splice(index, deleteCount, ...items){

        // Addeds
        let added_controls = []
        for(let {x,y,width,height,control,values} of items){

            /** ADD AN HTML ELEMENT */
            let container = /** @type {HTMLElement|null} */ (null)
            if(this.gui_container!=undefined){
                container = html.a`<div class="control_container">${control.createElement()}</div>`
                container.style.position="absolute"
                container.style.left = `${x*100}%`
                container.style.top = `${y*100}%`
                container.style.width = `${width*100}%`
                container.style.height = `${height*100}%`
                this.gui_container.appendChild(container)
            }

            /** ADD A BABYLONJS NODE */
            let node = /** @type {TransformNode|null} */ (null)
            if(this.node_container!=undefined){
                node = control.createNode(this.node_container.getScene())
                node.parent=this.node_container
                node.setPivotPoint(new Vector3(-.5,-.5,.5))
                node.scaling.set(width,Math.min(width,height),height)
                node.position.set(x,.53,-y)
            }

            control.setDefaultValues()
            for(let [label,value] of Object.entries(values)) control.setValue(label,value)

            const item = {x,y,width,height,values,control,container,node}
            added_controls.push(item)
            this.on_add(item)
        }

        // Remove
        for(let i=0; i<deleteCount; i++){
            let control_info = this.#controls[index+i]
            this.on_remove(control_info)
            control_info.container.remove()
            control_info.control.destroy()
            control_info.control.destroyElement()
            control_info.control.destroyNode()
        }

        this.#controls.splice(index,deleteCount,...added_controls)
    }

    /** @type {number} */
    get length(){ return this.#controls.length }
    
    /**
     * Get the control at the index
     * @param {number} index
     * @returns {Readonly<Item>}
     */
    get(index){
        return this.#controls[index]
    }

    /**
     * Move a control to a new position
     * @param {number} index 
     * @param {number} y 
     * @param {number} y 
     */
    move(index, x, y){
        let control_info = this.#controls[index]
        control_info.x = x
        control_info.y = y
        if(control_info.container){
            control_info.container.style.left = `${x*100}%`
            control_info.container.style.top = `${y*100}%`
        }
        if(control_info.node){
            control_info.node.position.set(x,.53,-y)
        }
    }

    /**
     * Resize a control
     * @param {number} index
     * @param {number} width
     * @param {number} height
     */
    resize(index, width, height){
        let control_info = this.#controls[index]
        control_info.width = width
        control_info.height = height
        if(control_info.container){
            control_info.container.style.width = `${width*100}%`
            control_info.container.style.height = `${height*100}%`
        }
        if(control_info.node){
            control_info.node.scaling.set(width,Math.min(width,height),height)
        }
    }

    /**
     * Set a value of a parameter
     * @param {number} index
     * @param {string} label
     * @param {string} value
     */
    setValue(index, label, value){
        let control_info = this.#controls[index]
        control_info.values[label] = value
        control_info.control.setValue(label,value)
    }

    /** @type {FriendlyIterable<Readonly<Item>>} */
    values = new FriendlyIterable(this.#controls)
}