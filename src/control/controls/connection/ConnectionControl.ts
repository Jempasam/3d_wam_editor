import { Color3, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core"
import { Control, ControlContext } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"


/**
 * An event and audio input control that changes a numeric value.
 */
export abstract class ConnectionControl extends Control{

    constructor(context: ControlContext){
        super(context)
    }

    static override getSettings(): CSettings{
        return {"Color":"color"}
    }

    static override getDefaultValues(){
        return {"Color":this.defaultColor}
    }

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
        if(wam)((this.context.html as any)[this.getCallbackName()])({
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
        if(wam)((this.context.babylonjs as any)[this.getCallbackName()])({
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
    
    protected static defaultColor = "#00FF00"

    protected getCallbackName(): string { return "defineAnInput" }

    static Input = class extends ConnectionControl{
        static label = "Input"
        static description = "An audio signal input"
        protected static defaultColor = "#00FF00"
        protected override getCallbackName(): string { return "defineAnInput" }
    }

    static Output = class extends ConnectionControl{
        static label = "Output"
        static description = "An audio signal output"
        protected static defaultColor = "#FF0000"
        protected override getCallbackName(): string { return "defineAnOutput" }
    }

    static MidiInput = class extends ConnectionControl{
        static label = "MIDI Input"
        static description = "A MIDI signal input"
        protected static defaultColor = "#33BB88"
        protected override getCallbackName(): string { return "defineAnEventInput" }
    }

    static MidiOutput = class extends ConnectionControl{
        static label = "MIDI Output"
        static description = "A MIDI signal output"
        protected static defaultColor = "#BB3388"
        protected override getCallbackName(): string { return "defineAnEventOutput" }
    }
}