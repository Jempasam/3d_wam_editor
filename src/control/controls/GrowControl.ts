
import { AbstractMesh, Color3, MeshBuilder, PointerDragBehavior, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import { ControlContext } from "../Control.js";
import { ControlSettings } from "../settings.js";
import { ParameterControl } from "./ParameterControl.js";

/**
 * A control that grow and shrink
 */
export class GrowControl extends ParameterControl{

    static label = "Size Changing Control"

    constructor(context: ControlContext){
        super(context)
    }

    static override getSettings(): ControlSettings{
        return {"Color":"color", "Base Color":"color", ...super.getSettings()}
    }

    static override getDefaultValues(){
        return {"Color":"#ff0000", "Base Color":"#666666"}
    }

    ;["Color"]: Color3 = Color3.White()
    ;["Base Color"]: Color3 = Color3.White()

    override updateValue(label: string, value: string){
        switch(label){
            case "Color":
            case "Base Color":
                this[label] = Color3.FromHexString(value)
                this.updateColor()
                break
            default:
                super.updateValue(label,value)
        }
    }

    updateColor(){
        if(this.element){
            this.element.style.backgroundColor = this["Color"]?.toHexString() ?? "#ffffff"
            this.element.style.borderColor = this["Base Color"]?.toHexString() ?? "#ffffff"
        }
        if(this.material){
            this.material.diffuseColor = this["Color"] ?? Color3.White()
        }
        if(this.base_material) this.base_material.diffuseColor = this["Base Color"] ?? Color3.White()
    }

    element?: HTMLElement
    material?: StandardMaterial
    base_material?: StandardMaterial
    
    /** @type {Control['createElement']} */
    override createElement(){
        this.element = document.createElement("div")
        this.element.style.display="block"
        this.element.style.width="100%"
        this.element.style.height="100%"
        this.element.style.boxSizing="border-box";
        this.element.style.borderWidth="10%"
        this.element.style.borderStyle="solid"
        return this.element
    }

    override destroyElement(){
        this.element?.remove()
        this.element=undefined
    }

    mesh?: AbstractMesh
    base?: AbstractMesh
    transform?: TransformNode

    createNode(scene: Scene){
        this.transform = new TransformNode("grow_control",scene)

        this.base = MeshBuilder.CreateBox("grow_control_base", {height:0.15,depth:1,width:1}, scene)
        this.base_material = new StandardMaterial("grow_control_base", scene)
        this.base.material = this.base_material
        this.base.setParent(this.transform)
        this.base.position.y=-0.35

        this.mesh = MeshBuilder.CreateBox("grow_control", {height:1,depth:0.8,width:0.8}, scene)
        this.material = new StandardMaterial("grow_control", scene)
        this.material.specularColor.set(0,0,0)
        this.mesh.material = this.material
        this.mesh.setParent(this.transform)

        this.declareField(this.mesh)

        return this.transform
    }

    onParamChange(): void {
        if(this.mesh){
            this.mesh.scaling.y=0.2+this.value*0.8
            this.mesh.position.y=this.value*0.4-0.3
        }
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.transform?.dispose()
        this.mesh?.dispose()
        this.base?.dispose()
        this.material?.dispose()
        this.base_material?.dispose()
    }

}

