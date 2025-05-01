import { Scene, TransformNode } from "@babylonjs/core"
import { Control, ControlContext, flattenCDefault } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"
import { Decoration } from "../../../utils/visual/Decoration.ts"
import { MOValue } from "../../../observable/collections/OValue.ts"


/**
 * An event and audio input control that changes a numeric value.
 */
export class DecorationControl extends Control{

    static override label = "Decoration"

    private decoration = new Decoration()

    private height = new MOValue(.5)

    private rotation = new MOValue(0)

    constructor(context: ControlContext){
        super(context)
    }

    static override getSettings(): CSettings{
        return {
            "Height": [0.1,1.0],
            "Rotation": {min:0,max:360,step:1},
            "Shape": {sub:Decoration.getSettings()},
        }
    }

    static override getDefaultValues(){
        return flattenCDefault({
            "Height": 0.5,
            "Rotation": 0,
            "Shape": Decoration.getDefaultValues(),
        })
    }

    override updateValue(label: string, value: CSettingsValue){
        switch(label){
            case "Height":
                this.height.value = value as number
                break
            case "Rotation":
                this.rotation.value = value as number
                break
            default:
                if(label.startsWith("Shape/")) this.decoration.updateValue(label.split("/",2)[1], value)
                
        }
    }

    private html_gui?: {element:Element,dispose():void}
    private on_change_rotation2 = ()=>{
        this.html_gui!!.element.setAttribute("transform", `rotate(${this.rotation.value})`)
    }

    
    override createElement(){
        this.html_gui = this.decoration.createElement()
        this.html_gui.element.setAttribute("width", "100%")
        this.html_gui.element.setAttribute("height", "100%")
        this.rotation.observable.register(this.on_change_rotation2)
        this.on_change_rotation2()
        return this.html_gui.element as HTMLElement
    }

    override destroyElement(){
        this.html_gui?.dispose()
        this.rotation.observable.unregister(this.on_change_rotation2)
        this.html_gui = undefined
    }

    private node_gui?: {node:TransformNode,dispose():void}
    private transform?: TransformNode
    private on_change_height = ()=>{
        this.node_gui!!.node.scaling.y = this.height.value
        this.node_gui!!.node.position.y = -(1-this.height.value)/2
    }
    private on_change_rotation = ()=>{
        this.node_gui!!.node.rotation.y = this.rotation.value*Math.PI/180
    }


    override createNode(scene: Scene){
        this.node_gui = this.decoration.createScene(scene)
        this.transform = new TransformNode("decoration", scene)
        this.node_gui.node.parent = this.transform
        this.height.observable.register(this.on_change_height)
        this.rotation.observable.register(this.on_change_rotation)
        this.on_change_height()
        this.on_change_rotation()
        return this.transform
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.node_gui?.dispose()
        this.node_gui = undefined
        this.transform?.dispose()
        this.height.observable.unregister(this.on_change_height)
        this.rotation.observable.unregister(this.on_change_rotation)
    }

    /** @type {Control['destroy']} */
    destroy(){
    }

}