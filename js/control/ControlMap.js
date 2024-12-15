import { MOArray, OArray } from "../observable/collections/OArray.js";
import { html } from "../utils/doc.js";
import { FriendlyIterable } from "../utils/FriendlyIterable.js";
import { Control } from "./Control.js";


export class ControlMap{
    /** @typedef {{x:number, y:number, width:number, height:number, values:any, control:Control, container:HTMLElement}} Item */

    /** @type {Item[]} */
    #controls =  []

    /** @type {(event:Item)=>void} */
    on_add = ()=>{}

    /** @type {(event:Item)=>void} */
    on_remove = ()=>{}
    
    /**
     * @param {HTMLElement} gui_container
     */
    constructor(gui_container){
        this.gui_container = gui_container
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

            for(let [label,value] of Object.entries(values)) control.setValue(label,value)

            let container = html.a`<div class="control_container">${control}</div>`
            container.style.position="absolute"
            container.style.left = `${x*100}%`
            container.style.top = `${y*100}%`
            container.style.width = `${width*100}%`
            container.style.height = `${height*100}%`

            const item = {x,y,width,height,values,control,container}

            added_controls.push(item)
            this.gui_container.appendChild(container)

            this.on_add(item)
        }

        // Remove
        for(let i=0; i<deleteCount; i++){
            let control_info = this.#controls[index+i]
            this.on_remove(control_info)
            control_info.container.remove()
            control_info.control.destroy()
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
        control_info.container.style.left = `${x*100}%`
        control_info.container.style.top = `${y*100}%`
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
        control_info.container.style.width = `${width*100}%`
        control_info.container.style.height = `${height*100}%`
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