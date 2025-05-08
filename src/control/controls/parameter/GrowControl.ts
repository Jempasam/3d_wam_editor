
import { AbstractMesh, Color3, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core";
import { Control, ControlEnv } from "../../Control.js";
import { CSettings, CSettingsValue } from "../settings/settings.js";
import { ParameterControl, ParameterControlFactory } from "./ParameterControl.js";

/**
 * A control that grow and shrink
 */
export class GrowControl extends ParameterControl{

    ;["Color"]: Color3 = Color3.White()
    ;["Base Color"]: Color3 = Color3.White()

    override updateValue(label: string, value: CSettingsValue){
        switch(label){
            case "Color":
            case "Base Color":
                this[label] = Color3.FromHexString(value as string)
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

        this.declareField(this.host.html!!, this.element)

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
        this.base.position.y=-0.425

        this.mesh = MeshBuilder.CreateBox("grow_control", {height:1,depth:0.8,width:0.8}, scene)
        this.material = new StandardMaterial("grow_control", scene)
        this.material.specularColor.set(0,0,0)
        this.mesh.material = this.material
        this.mesh.setParent(this.transform)

        this.declareField(this.host.babylonjs!!, this.mesh)

        return this.transform
    }

    onParamChange(): void {
        if(this.mesh){
            this.mesh.scaling.y=0.2+this.fields[0].getValue()*0.8
            this.mesh.position.y=this.fields[0].getValue()*0.4-0.3
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

    static Factory = class _ extends ParameterControlFactory {

        constructor(readonly env: ControlEnv){super()}
            
        label = "Size Changing"

        description = "A control that grow and shrink depending on its value."

        getSettings(): CSettings{
            return {"Color":"color", "Base Color":"color", ...super.getSettings()}
        }

        getDefaultValues(){
            return {"Color":"#ff0000", "Base Color":"#666666"}
        }

        async create(): Promise<Control> {
            await this.init()
            return new GrowControl(this)
        }

    }

    static Type = async (env: ControlEnv) => new this.Factory(env)

}

