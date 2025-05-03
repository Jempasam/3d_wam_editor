import { AbstractMesh, Color3, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core";
import { ControlContext } from "../../Control.js";
import { CSettings, CSettingsValue } from "../settings/settings.js";
import { ParameterControl } from "./ParameterControl.js";

/**
 * A rotating control.
 */
export class CursorControl extends ParameterControl{

    static label = "Rotating Cursor"

    static description = "A control that rotate a cursor depending on its value."

    constructor(context: ControlContext){
        super(context)
    }

    static override getSettings(): CSettings{
        return {
            "Base Color":"color",
            "Cursor Color":"color",
            ...super.getSettings(),
        }
    }

    static override getDefaultValues(){
        return {
            "Base Color":"#222222",
            "Cursor Color":"#0000ff",
        }
    }

    ;["Base Color"]: Color3 = Color3.White()
    ;["Cursor Color"]: Color3 = Color3.White()

    override updateValue(label: string, value: CSettingsValue){
        switch(label){
            case "Base Color":
            case "Cursor Color":
                this[label] = Color3.FromHexString(value as string)
                this.updateColor()
                break
            default:
                super.updateValue(label,value)
        }
    }
    
    updateColor(){
        if(this.element && this.cursor){
            this.element.style.backgroundColor = this["Base Color"]?.toHexString() ?? "#000000"
            this.cursor.style.backgroundColor = this["Cursor Color"]?.toHexString() ?? "#000000"
        }
        if(this.cylinder_material && this.cursor_material){
            this.cylinder_material.diffuseColor = this["Base Color"] ?? Color3.White
            this.cursor_material.diffuseColor = this["Cursor Color"] ?? Color3.White
        }
    }

    element?: HTMLElement
    cursor?: HTMLElement
    cylinder_material?: StandardMaterial
    
    override createElement(){
        this.element = document.createElement("div")
        this.element.style.display="block"
        this.element.style.width="100%"
        this.element.style.height="100%"
        this.element.style.borderRadius="50%"
        this.element.style.boxSizing="border-box";
        this.element.style.position="relative"

        this.cursor = document.createElement("div")
        this.cursor.style.position="absolute"
        this.cursor.style.display="block"
        this.cursor.style.width="10%"
        this.cursor.style.height="60%"
        this.cursor.style.left="45%"
        this.cursor.style.top="0%"
        this.element.appendChild(this.cursor)

        return this.element
    }


    override destroyElement(){
        this.element?.remove()
        this.element=undefined
    }

    transform?: TransformNode
    cylinder?: AbstractMesh
    cursor_mesh?: AbstractMesh
    cursor_material?: StandardMaterial

    override createNode(scene: Scene){
        this.transform = new TransformNode("cusor_control_transform",scene)
        const cylinder = this.cylinder = MeshBuilder.CreateCylinder("cursor_control", {diameter:1,height:0.9}, scene)
        this.cylinder_material = cylinder.material = new StandardMaterial("cursor_control", scene)
        this.cylinder_material.specularColor.set(0,0,0)
        cylinder.setParent(this.transform)
        cylinder.position.y=-0.05

        const cursor = this.cursor_mesh = MeshBuilder.CreateBox("cursor_control2", {width:0.1,height:1,depth:0.6}, scene)
        cursor.position.z=0.3
        this.cursor_material = cursor.material = new StandardMaterial("cursor_control2",scene)
        this.cursor_material.specularColor.set(0,0,0)
        cursor.setParent(cylinder)
        
        this.declareField(cylinder)

        return this.transform
    }

    onParamChange(): void {
        if(this.cylinder) this.cylinder.rotation.y = (this.normalized[0]-0.5)*Math.PI
        if(this.element) this.element.style.rotate = `${Math.round((this.normalized[0]-0.5)*180)}deg`
    }

    override destroyNode(){
        this.transform?.dispose()
        this.cylinder?.dispose()
        this.cursor_mesh?.dispose()
        this.cylinder_material?.dispose()
        this.cursor_material?.dispose()
    }

}
