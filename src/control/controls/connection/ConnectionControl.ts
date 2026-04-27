import { Color3, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core"
import { Control, ControlEnv, ControlFactory } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"


/**
 * An event and audio input control that changes a numeric value.
 */
export class ConnectionControl extends Control{

    override updateValue(label: string, value: CSettingsValue){ }

    private element?: HTMLElement
    private  material?: StandardMaterial
    
    override createElement(){
        const element = this.element = document.createElement("div")
        this.element.style.display="block"
        this.element.style.width="100%"
        this.element.style.height="100%"
        if((this.factory as any).config.shape=="circle") this.element.style.borderRadius="50%"
        this.element.style.boxSizing="border-box";
        this.element.style.backgroundColor = (this.factory as any).config.color

        const wam = this.wam
        if(wam)((this.host.html as any)[(this.factory as any).config.callbackName])({
            target: [this.element],
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
        const mesh = (this.factory as any).config.shape=="circle" 
            ? MeshBuilder.CreateIcoSphere("input", {radius:0.5}, scene)
            : MeshBuilder.CreateBox("input", {size:1}, scene)

        mesh.setParent(transform)
        this.material = new StandardMaterial("input", scene)
        this.transform = transform
        mesh.material = this.material
        this.material.diffuseColor = Color3.FromHexString((this.factory as any).config.color)
        mesh.position.y = -0.5
        
        const wam = this.wam
        if(wam)((this.host.babylonjs as any)[(this.factory as any).config.callbackName])({
            target: [mesh],
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
                color: string,
                shape: "rect"|"circle",
                callbackName: string,
            }
        ){
            this.label = config.label
            this.description = config.description
        }
        
        label
        description

        getSettings(): CSettings{ return {} }
    
        getDefaultValues(){ return {} }

        async create(): Promise<Control> {
            return new ConnectionControl(this)
        }

    }

    static InputSettings = {
        label: "Input",
        description: "An audio signal input",
        color: "#00FF00",
        shape: "rect" as "rect",
        callbackName: "defineAnInput",
    }
    static Input = async (env: ControlEnv) => new this.Factory(env, this.InputSettings)

    static OutputSettings = {
        label: "Output",
        description: "An audio signal output",
        color: "#00FF00",
        shape: "circle" as "circle",
        callbackName: "defineAnOutput",
    }
    static Output = async (env: ControlEnv) => new this.Factory(env, this.OutputSettings)

    static MidiInputSettings = {
        label: "MIDI Input",
        description: "A MIDI signal input",
        color: "#33BB88",
        shape: "rect" as "rect",
        callbackName: "defineAnEventInput",
    }
    static MidiInput = async (env: ControlEnv) => new this.Factory(env, this.MidiInputSettings)

    static MidiOutputSettings = {
        label: "MIDI Output",
        description: "A MIDI signal output",
        color: "#33BB88",
        shape: "circle" as "circle",
        callbackName: "defineAnEventOutput",
    }
    static MidiOutput = async (env: ControlEnv) => new this.Factory(env, this.MidiOutputSettings)
}