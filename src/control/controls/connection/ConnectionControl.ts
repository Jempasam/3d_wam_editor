import { Color3, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core"
import { Control, ControlEnv, ControlFactory } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"


/**
 * An event and audio input control that changes a numeric value.
 */
export class ConnectionControl extends Control{

    override updateValue(label: string, value: CSettingsValue){
        switch(label){
            case "Color":
                if(this.element) this.element.style.backgroundColor = value as string
                if(this.material) this.material.diffuseColor = Color3.FromHexString(value as string)
                break
        }
    }

    private element?: HTMLElement
    private  material?: StandardMaterial
    
    override createElement(){
        const element = this.element = document.createElement("div")
        this.element.style.display="block"
        this.element.style.width="100%"
        this.element.style.height="100%"
        this.element.style.borderRadius="50%"
        this.element.style.boxSizing="border-box";
        this.element.style.backgroundColor = "#00FF00"

        const wam = this.wam
        if(wam)((this.host.html as any)[(this.factory as any).config.callbackName])({
            target: this.element,
            node: wam.audioNode,
            setConnected(connected: boolean) {
                if(connected) element.style.scale = "0.5"
                else element.style.scale = "1"
            },
        })
        
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
        if(wam)((this.host.babylonjs as any)[(this.factory as any).config.callbackName])({
            target: mesh,
            node: wam.audioNode,
            setConnected(connected: boolean) {
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

    static Factory = class _ implements ControlFactory {
    
        constructor(
            readonly env: ControlEnv,
            readonly config: {
                label: string,
                description: string,
                defaultColor: string,
                callbackName: string,
            }
        ){
            this.label = config.label
            this.description = config.description
        }
        
        label
        description

        getSettings(): CSettings{
            return {"Color":"color"}
        }
    
        getDefaultValues(){
            return {"Color":this.config.defaultColor}
        }

        async create(): Promise<Control> {
            return new ConnectionControl(this)
        }

    }

    static InputSettings = {
        label: "Input",
        description: "An audio signal input",
        defaultColor: "#00FF00",
        callbackName: "defineAnInput",
    }
    static Input = async (env: ControlEnv) => new this.Factory(env, this.InputSettings)

    static OutputSettings = {
        label: "Output",
        description: "An audio signal output",
        defaultColor: "#FF0000",
        callbackName: "defineAnOutput",
    }
    static Output = async (env: ControlEnv) => new this.Factory(env, this.OutputSettings)

    static MidiInputSettings = {
        label: "MIDI Input",
        description: "A MIDI signal input",
        defaultColor: "#33BB88",
        callbackName: "defineAnEventInput",
    }
    static MidiInput = async (env: ControlEnv) => new this.Factory(env, this.MidiInputSettings)

    static MidiOutputSettings = {
        label: "MIDI Output",
        description: "A MIDI signal output",
        defaultColor: "#BB3388",
        callbackName: "defineAnEventOutput",
    }
    static MidiOutput = async (env: ControlEnv) => new this.Factory(env, this.MidiOutputSettings)
}