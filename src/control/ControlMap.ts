import { Node, TransformNode, Vector3 } from "@babylonjs/core"
import { Control } from "./Control.ts"
import { FriendlyIterable } from "../utils/FriendlyIterable.ts"
import { html } from "../utils/doc.ts"
import { OSource } from "../observable/source/OSource.ts"


export interface Item{
    x: number
    y: number
    width: number
    height: number
    values: any
    control: Control
    container: HTMLElement|null
    node: TransformNode|null
}

export class ControlMap{

    #controls: Item[] =  []

    readonly on_add = new OSource<Item>() 

    readonly on_remove = new OSource<Item>()
    
    constructor(
        private gui_container?: HTMLElement, 
        private node_container?: Node,
    ){ }

    /** Splice on the control array */
    splice(index: number, deleteCount: number, ...items: {x:number,y:number,width:number,height:number,values:Record<string,string>,control:Control}[]){

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
            this.on_add.notify(item)
        }

        // Remove
        for(let i=0; i<deleteCount; i++){
            let control_info = this.#controls[index+i]
            this.on_remove.notify(control_info)
            control_info.container?.remove()
            control_info.control.destroy()
            control_info.control.destroyElement()
            control_info.control.destroyNode()
        }

        this.#controls.splice(index,deleteCount,...added_controls)
    }

    /** @type {number} */
    get length(){ return this.#controls.length }
    
    /** Get the control at the index */
    get(index: number): Readonly<Item>{
        return this.#controls[index]
    }

    /** Move a control to a new position */
    move(index: number, x: number, y: number){
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

    /** Resize a control */
    resize(index: number, width: number, height: number){
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

    /** Set a value of a parameter */
    setValue(index: number, label: string, value: string){
        let control_info = this.#controls[index]
        control_info.values[label] = value
        control_info.control.setValue(label,value)
    }

    values = new FriendlyIterable<Readonly<Item>>(this.#controls)
}