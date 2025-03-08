import { Color3, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core"
import { Control, ControlContext } from "../Control.ts"
import { ControlSettings } from "../settings.ts"


/**
 * An event and audio output control that changes a numeric value.
 */
export class OutputControl extends Control{

    static label = "Output Control"

    constructor(context: ControlContext){
        super(context)
    }

    static override getSettings(): ControlSettings{
        return {"Color":"color"}
    }

    static getDefaultValues(){
        return {"Color":"#FF0000"}
    }

    override updateValue(label: string, value: string){
        switch(label){
            case "Color":
                if(this.element) this.element.style.backgroundColor = value
                if(this.material) this.material.diffuseColor = Color3.FromHexString(value)
                break
        }
    }

    private element?: HTMLElement
    private  material?: StandardMaterial
    
    override createElement(){
        this.element = document.createElement("div")
        this.element.style.display="block"
        this.element.style.width="100%"
        this.element.style.height="100%"
        this.element.style.borderRadius="50%"
        this.element.style.boxSizing="border-box";
        
        return this.element
    }

    override destroyElement(){
        this.element?.remove()
        this.element=undefined
    }

    transform?: TransformNode

    override createNode(scene: Scene){
        const transform = new TransformNode("input", scene)
        const mesh = MeshBuilder.CreateIcoSphere("input", {radius:0.5}, scene)

        mesh.setParent(transform)
        this.material = new StandardMaterial("input", scene)
        this.transform = transform
        mesh.material = this.material
        mesh.position.y = -0.5
        

        const wam = this.wam
        if(this.wam)this.context.defineAnOutput({
            target: mesh,
            node: this.wam.audioNode,
            setConnected(connected) {
                if(connected) mesh.scaling.setAll(0.5)
                else mesh.scaling.setAll(1)
            },
        })
        return transform
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.transform?.dispose()
        this.material?.dispose()
    }

    /** @type {Control['destroy']} */
    destroy(){
    }
}

