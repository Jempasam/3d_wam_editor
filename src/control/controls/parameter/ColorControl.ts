import { AbstractMesh, Color3, CreateHemisphere, Scene, StandardMaterial } from "@babylonjs/core"
import { Control, ControlEnv } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"
import { ParameterControl, ParameterControlFactory } from "./ParameterControl.ts"


/**
 * A color coded controls that change a numeric value.
 */
export class ColorControl extends ParameterControl{

    ;["Low Color"]: Color3 = Color3.White()
    ;["High Color"]: Color3 = Color3.White()

    override updateValue(label: string, value: CSettingsValue){
        switch(label){
            case "Low Color":
            case "High Color":
                this[label] = Color3.FromHexString(value as string)
                this.updateColor()
                break
            default:
                super.updateValue(label,value)
        }
    }

    updateColor(){
        const color = Color3.Lerp(this["Low Color"]??Color3.White, this["High Color"]??Color3.White, this.fields[0].getValue())
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

        this.declareField(this.host.html!!, this.element)
        
        return this.element
    }

    override destroyElement(){
        this.element?.remove()
        this.element=undefined
    }

    mesh?: AbstractMesh

    override createNode(scene: Scene){
        const ret = CreateHemisphere("color_control", {diameter:1,segments:8}, scene)
        ret.scaling.y = 2
        ret.position.y = -.5
        ret.bakeCurrentTransformIntoVertices()
        this.material = new StandardMaterial("color_control", scene)
        this.mesh = ret
        ret.material = this.material
        this.declareField(this.host.babylonjs!!, ret)
        return ret
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.mesh?.dispose()
        this.material?.dispose()
    }

    static Factory = class _ extends ParameterControlFactory {

        constructor(readonly env: ControlEnv){super()}
            
        label = "Color Changing"

        description = "A control that change between two colors depending on its value."
        
        getSettings(){
            return {"Low Color":"color", "High Color":"color", ...super.getSettings()} as CSettings
        }

        getDefaultValues(){
            return {"Low Color":"#222222", "High Color":"#0000ff"}
        }

        async create(): Promise<Control> {
            await this.init()
            return new ColorControl(this)
        }

    }

    static Type = async (env: ControlEnv) => new this.Factory(env)
}

