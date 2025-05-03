import { Scene, TransformNode } from "@babylonjs/core"
import { ControlContext, flattenCDefault } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"
import { ParameterControl } from "./ParameterControl.ts"
import { Decoration } from "../../../utils/visual/Decoration.ts"
import { animate } from "../../../utils/visual/animate.ts"


/**
 * A color coded controls that change a numeric value.
 */
export class MorphControl extends ParameterControl{

    static label = "Morph"

    static description = "A control that work like a decoration whose settings change based on its value."

    private decoration = new Decoration()

    constructor(context: ControlContext){
        super(context)
    }

    private from: any = {}
    private to: any = {}

    static override getSettings(): CSettings{
        return {
            ...super.getSettings(),
            "Low Shape": {sub:Decoration.SETTINGS},
            "High Shape": {sub:Decoration.SETTINGS},
        }
    }

    static getDefaultValues(){
        return flattenCDefault({
            "Low Shape": Decoration.SETTINGS_DEFAULTS,
            "High Shape": Decoration.SETTINGS_DEFAULTS,
        })
    }

    override updateValue(label: string, value: CSettingsValue){
        if(label.startsWith("Low Shape/")){
            const sublabel = label.substring("Low Shape/".length)
            if(Decoration.SETTINGS_SETTERS[sublabel]) this.from[sublabel] = value
            this.updateShape()
        }
        else if(label.startsWith("High Shape/")){
            const sublabel = label.substring("High Shape/".length)
            if(Decoration.SETTINGS_SETTERS[sublabel]) this.to[sublabel] = value
            this.updateShape()
        }
        else super.updateValue(label, value)
    }

    updateShape(){
        // It try to not change too much values because some parameters of a decoration can trigger an entire mesh reconstruction.
        for(const [key, from_value] of Object.entries(this.from)){
            const to_value = this.to[key]
            let value = from_value==to_value ? from_value : animate(from_value,to_value,this.normalized[0])
            if(Decoration.SETTINGS_GETTERS[key]?.(this.decoration)!=value){
                Decoration.SETTINGS_SETTERS[key] ?.(this.decoration, value)
            }
        }
    }

    onParamChange(): void {
        this.updateShape()
    }


    private html_gui?: {element:Element,dispose():void}
    
    override createElement(){
        this.html_gui = this.decoration.createElement()
        this.html_gui.element.setAttribute("width", "100%")
        this.html_gui.element.setAttribute("height", "100%")
        return this.html_gui.element as HTMLElement
    }

    override destroyElement(){
        this.html_gui?.dispose()
        this.html_gui = undefined
    }


    private node_gui?: {node:TransformNode,dispose():void}

    override createNode(scene: Scene){
        this.node_gui = this.decoration.createScene(scene)
        return this.node_gui.node
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.node_gui?.dispose()
        this.node_gui = undefined
    }
}

