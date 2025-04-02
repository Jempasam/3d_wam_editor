import { AbstractMesh, Color3, MeshBuilder, PointerDragBehavior, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import { ControlContext } from "../Control.ts"
import { ControlSettings } from "../settings.ts"
import { ParameterControl } from "./ParameterControl.ts"


/**
 * A color coded controls that change a numeric value.
 */
export class ColorControl extends ParameterControl{

    static label = "Color Changing"

    constructor(context: ControlContext){
        super(context)
    }

    static override getSettings(): ControlSettings{
        return {"Low Color":"color", "High Color":"color", ...super.getSettings()}
    }

    static getDefaultValues(){
        return {"Low Color":"#222222", "High Color":"#0000ff"}
    }

    ;["Low Color"]: Color3 = Color3.White()
    ;["High Color"]: Color3 = Color3.White()

    override updateValue(label: string, value: string){
        switch(label){
            case "Low Color":
            case "High Color":
                this[label] = Color3.FromHexString(value)
                this.updateColor()
                break
            default:
                super.updateValue(label,value)
        }
    }

    updateColor(){
        const color = Color3.Lerp(this["Low Color"]??Color3.White, this["High Color"]??Color3.White, this.normalized)
        if(this.element) this.element.style.backgroundColor = color.toHexString()
        if(this.material) this.material.diffuseColor = color
    }

    onParamChange(): void {
        this.updateColor()
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

    mesh?: AbstractMesh

    override createNode(scene: Scene){
        const ret = MeshBuilder.CreateIcoSphere("color_control", {radius:0.5}, scene)
        this.material = new StandardMaterial("color_control", scene)
        this.mesh = ret
        ret.material = this.material
        this.declareField(ret)
        return ret
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.mesh?.dispose()
        this.material?.dispose()
    }
}

