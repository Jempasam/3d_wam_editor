import { AbstractMesh, Color3, CreateHemisphere, Scene, StandardMaterial } from "@babylonjs/core"
import { Control, ControlEnv } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"
import { ParameterControl, ParameterControlFactory } from "./ParameterControl.ts"


/**
 * A color coded controls that change a numeric value.
 */
export class HashControl extends ParameterControl{

    seed = 0

    filter = Color3.White()

    override updateValue(label: string, value: CSettingsValue){
        switch(label){
            case "Seed":
                this.seed = value as number
                this.updateColor()
                break
            case "Base Color":
                this.filter = Color3.FromHexString(value as string)
                this.updateColor()
                break
            default:
                super.updateValue(label,value)
        }
    }

    updateColor(){
        let v = this.fields[0].getValue()*(this.fields[0].getStepCount()||100)
        let hash = (v+this.seed)*10*(this.seed+1) + 100
        hash ^= (hash << 13);
        hash ^= (hash >>> 17);        
        hash ^= (hash << 5);
        hash = Math.abs(hash)
        hash = hash%360;
        hash = Math.round(hash)
        let color =Color3.FromHSV(hash,1,1)
        
        color.multiplyInPlace(this.filter)
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
        const ret = CreateHemisphere("hash_control", {diameter:1,segments:8}, scene)
        ret.scaling.y = 2
        ret.position.y = -.5
        ret.bakeCurrentTransformIntoVertices()
        this.material = new StandardMaterial("hash_control", scene)
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
            
        label = "Hash Color"

        description = "A control that changes color based on a hash of the value. Useful for visualizing non continuous values like presets."
        
        getSettings(){
            return {"Seed":{min:0,max:1000,step:1}, "Base Color":"color", ...super.getSettings()} as CSettings
        }

        getDefaultValues(){
            return {"Seed":0, "Base Color":"#ffffff"}
        }

        async create(): Promise<Control> {
            await this.init()
            return new HashControl(this)
        }

    }

    static Type = async (env: ControlEnv) => new this.Factory(env)
}

