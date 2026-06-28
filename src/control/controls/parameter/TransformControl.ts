import { Scene, TransformNode } from "@babylonjs/core"
import { Control, ControlEnv, flattenCDefault } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"
import { ParameterControl, ParameterControlFactory } from "./ParameterControl.ts"
import { Decoration } from "../../../utils/visual/Decoration.ts"
import { animate } from "../../../utils/visual/animate.ts"

// TODO: Finish this

function lerp(a:number, b:number, t:number){
    return a + (b-a)*t
}

/**
 * A transformation based controls that change a numeric value.
 */
export class TransformControl extends ParameterControl{

    private from: any = {}
    private decoration = new Decoration()
    
    private min_width = .5
    private max_width = 1

    private min_height = 1
    private max_height = 1

    private min_depth = 1
    private max_depth = 1

    private min_rotation = 0
    private max_rotation = 0

    override updateValue(label: string, value: CSettingsValue){
        if(label.startsWith("Shape/")){
            const sublabel = label.substring("Shape/".length)
            Decoration.SETTINGS_SETTERS[sublabel]?.(this.decoration, value)
        }
        else if(label==="Min Width") this.min_width = value as number
        else if(label==="Max Width") this.max_width = value as number
        else if(label==="Min Height") this.min_height = value as number
        else if(label==="Max Height") this.max_height = value as number
        else if(label==="Min Depth") this.min_depth = value as number
        else if(label==="Max Depth") this.max_depth = value as number
        else if(label==="Min Rotation") this.min_rotation = value as number
        else if(label==="Max Rotation") this.max_rotation = value as number
        else super.updateValue(label, value)

        this.updateShape()
    }

    updateShape(){
        
    }

    onParamChange(): void {
        this.updateShape()
    }


    private html_gui?: {element:Element,dispose():void}
    
    override createElement(){
        this.html_gui = this.decoration.createElement()
        this.html_gui.element.setAttribute("width", "100%")
        this.html_gui.element.setAttribute("height", "100%")

        this.declareField(this.host.html!!, this.html_gui.element)

        return this.html_gui.element as HTMLElement
    }

    override destroyElement(){
        this.html_gui?.dispose()
        this.html_gui = undefined
    }


    private node_gui?: {node:TransformNode,dispose():void}

    override createNode(scene: Scene){
        this.node_gui = this.decoration.createScene(scene)
        this.declareField(this.host.babylonjs!!, this.node_gui.node)
        return this.node_gui.node
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.node_gui?.dispose()
        this.node_gui = undefined
    }

    static Factory = class _ extends ParameterControlFactory {

        constructor(readonly env: ControlEnv){super()}
        
        label = "Transform"

        description = "A control that work like a decoration whose transformation change based on its value."

        getSettings(): CSettings{
            return {
                ...super.getSettings(),
                "Low Shape": {sub:Decoration.SETTINGS},
                "High Shape": {sub:Decoration.SETTINGS},
            }
        }

        getDefaultValues(){
            const sub = {...Decoration.SETTINGS_DEFAULTS, "Shape":"circle"}
            return flattenCDefault({
                "Low Shape": sub,
                "High Shape": sub,
            })
        }

        async create(): Promise<Control> {
            await this.init()
            return new TransformControl(this)
        }

    }

    static Type = async (env: ControlEnv) => new this.Factory(env)
    
}

