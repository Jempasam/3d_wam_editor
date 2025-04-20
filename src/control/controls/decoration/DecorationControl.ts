import { AbstractMesh, Color3, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core"
import { Control, ControlContext } from "../../Control.ts"
import { ControlSettings } from "../../settings.ts"
import { Decoration } from "../../../utils/visual/Decoration.ts"
import { MOValue } from "../../../observable/collections/OValue.ts"


/**
 * An event and audio input control that changes a numeric value.
 */
export abstract class DecorationControl extends Control{

    static override label = "Decoration"

    private decoration = new Decoration()

    private height = new MOValue(.5)

    private rotation = new MOValue(0)

    constructor(context: ControlContext){
        super(context)
    }

    static override getSettings(): ControlSettings{
        return {
            "Shape": {choice:["rectangle","triangle","circle"]},
            "Top Color": "color",
            "Bottom Color": "color",
            "Height": [0.1,1.0],
            "Rotation": {min:0,max:360,step:1},
            "Outline Color": "color",
            "Outline Width": [0,1],
            "Front Face Image": "text",
        }
    }

    static override getDefaultValues(){
        return {
            "Shape": "rectangle",
            "Top Color": "#FFFFFF",
            "Bottom Color": "#AAAAAA",
            "Height": "0.5",
            "Rotation": "0",
            "Outline Color": "#000000",
            "Outline Width": "0",
            "Front Face Image": "",
        }
    }

    override updateValue(label: string, value: string){
        switch(label){
            case "Shape":
                this.decoration.shape.value = value as "rectangle"|"triangle"|"circle"
                break
            case "Top Color":
                this.decoration.top_color.value = value
                break
            case "Bottom Color":
                this.decoration.bottom_color.value = value
                break
            case "Border Color":
                this.decoration.front_face
                break
            case "Height":
                this.height.value = parseFloat(value)
                break
            case "Rotation":
                this.rotation.value = parseFloat(value)
                break
            case "Outline Width":
                this.decoration.outline_width.value = parseFloat(value)
                break
            case "Outline Color":
                this.decoration.outline_color.value = value
                break
            case "Front Face Image":
                this.decoration.front_face.value = value.length==0 ? null : value
                break
                
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