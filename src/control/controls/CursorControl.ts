import { WebAudioModule } from "@webaudiomodules/api";
import { ParameterControl } from "./ParameterControl.js";
import { AbstractMesh, Color3, MeshBuilder, PointerDragBehavior, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import { ControlSettings } from "../settings.js";

/**
 * A rotating control.
 */
export class CursorControl extends ParameterControl{

    static name = "Rotating Cursor Control"

    constructor(wam: WebAudioModule|null){
        super(wam)
    }

    static override getSettings(): ControlSettings{
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

    override setValue(label: string, value: string){
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

    override getValue(label: string){
        switch(label){
            case "Base Color":
            case "Cursor Color":
                return this[label]?.toHexString()
            default:
                return super.getValue(label)
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
        const cylinder = this.cylinder = MeshBuilder.CreateCylinder("cursor_control", {diameter:1,height:0.8}, scene)
        this.cylinder_material = cylinder.material = new StandardMaterial("cursor_control", scene)
        cylinder.setParent(this.transform)

        const cursor = this.cursor_mesh = MeshBuilder.CreateBox("cursor_control2", {width:0.1,height:1,depth:0.6}, scene)
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
        if(this.element) this.element.style.rotate = `${Math.round((this.value-0.5)*180)}deg`
        super.updateParamValue()
    }

    override destroyNode(){
        this.transform?.dispose()
        this.cylinder?.dispose()
        this.cursor_mesh?.dispose()
        this.cylinder_material?.dispose()
        this.cursor_material?.dispose()
    }

    /** @type {Control['destroy']} */
    destroy(){
    }
}
