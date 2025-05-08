import { Scene, TransformNode } from "@babylonjs/core"
import { Control, ControlEnv, flattenCDefault } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"
import { ParameterControl, ParameterControlFactory } from "./ParameterControl.ts"
import { Decoration } from "../../../utils/visual/Decoration.ts"
import { MOValue } from "../../../observable/collections/OValue.ts"


/**
 * A control in a shape of a jauge.
 */
export class JaugeControl extends ParameterControl{

    private unfilled = new Decoration()
    private filled = new Decoration()
    private direction = new MOValue<"+x"|"+y"|"-x"|"-y">("+x")
    private filling = new MOValue<number>(0)


    override updateValue(label: string, value: CSettingsValue){
        if(label.startsWith("Unfilled/")){
            const sublabel = label.substring("Unfilled/".length)
            Decoration.SETTINGS_SETTERS[sublabel]?.(this.unfilled, value)
        }
        else if(label.startsWith("Filled/")){
            const sublabel = label.substring("Filled/".length)
            Decoration.SETTINGS_SETTERS[sublabel]?.(this.filled, value)
        }
        else if(label=="Direction"){
            this.direction.value = value as "+x"|"+y"|"-x"|"-y"
        }
        else super.updateValue(label, value)
    }

    getDim():{x:number,y:number,w:number,h:number}[]{
        const v = this.fields[0].getValue()
        switch(this.direction.value){
            case "+x":
                return [{x:0, y:0, w:v, h:1}, {x:v, y:0, w:1-v, h:1}]
            case "-x":
                return [{x:1-v, y:0, w:v, h:1}, {x:0, y:0, w:1-v, h:1}]
            case "+y":
                return [{x:0, y:0, w:1, h:v}, {x:0, y:v, w:1, h:1-v}]
            default:
                return [{x:0, y:1-v, w:1, h:v}, {x:0, y:0, w:1, h:1-v}]
        }

    }

    onParamChange(): void {
        this.filling.value = this.fields[0].getValue()
    }


    private filled_html?: {element:HTMLElement,dispose():void}
    private unfilled_html?: {element:HTMLElement,dispose():void}
    private container_html?: HTMLElement
    
    override createElement(){
        const filled_html = this.filled_html = this.filled.createElement()
        const unfilled_html = this.unfilled_html = this.unfilled.createElement()

        const container_html = this.container_html = document.createElement("div")
        container_html.style.width = "100%"
        container_html.style.height = "100%"
        container_html.style.position = "relative"
        container_html.replaceChildren(filled_html.element, unfilled_html.element)

        const resize = ()=>{
            const [filled,unfilled] = this.getDim()
            filled_html.element.style.width = `${filled.w*100}%`
            filled_html.element.style.height = `${filled.h*100}%`
            filled_html.element.style.position = "absolute"
            filled_html.element.style.left = `${filled.x*100}%`
            filled_html.element.style.top = `${(1-filled.y-filled.h)*100}%`
            unfilled_html.element.style.width = `${unfilled.w*100}%`
            unfilled_html.element.style.height = `${unfilled.h*100}%`
            unfilled_html.element.style.position = "absolute"
            unfilled_html.element.style.left = `${unfilled.x*100}%`
            unfilled_html.element.style.top = `${(1-unfilled.y-unfilled.h)*100}%`
            
        }

        this.declareField(this.host.html!!, [filled_html.element, unfilled_html.element])

        this.filling.link(resize)
        this.direction.link(resize)

        return container_html
    }

    override destroyElement(){
        this.filled_html?.dispose()
        this.unfilled_html?.dispose()
        this.container_html?.remove()
    }


    private filled_node?: {node:TransformNode,dispose():void}
    private unfilled_node?: {node:TransformNode,dispose():void}
    private container_node?: TransformNode

    override createNode(scene: Scene){
        const container_node = this.container_node = new TransformNode("jauge_control", scene)

        const filled_node = this.filled_node = this.filled.createScene(scene)
        filled_node.node.setParent(container_node)

        const unfilled_node = this.unfilled_node = this.unfilled.createScene(scene)
        unfilled_node.node.setParent(container_node)

        const resize=()=>{
            const [filled,unfilled] = this.getDim()
            filled_node.node.scaling.x = filled.w
            filled_node.node.scaling.z = filled.h
            filled_node.node.position.x = filled.x+filled.w/2 -.5
            filled_node.node.position.z = filled.y+filled.h/2 -.5
            unfilled_node.node.scaling.x = unfilled.w
            unfilled_node.node.scaling.z = unfilled.h
            unfilled_node.node.position.x = unfilled.x+unfilled.w/2 -.5
            unfilled_node.node.position.z = unfilled.y+unfilled.h/2 -.5
        }
        this.filling.link(resize)
        this.direction.link(resize)

        this.declareField(this.host.babylonjs!!, [filled_node.node, unfilled_node.node])

        return container_node
    }

    /** @type {Control['destroyNode']}  */
    destroyNode(){
        this.filled_node?.dispose()
        this.unfilled_node?.dispose()
        this.container_node?.dispose(true)
    }

    static Factory = class _ extends ParameterControlFactory {

        constructor(readonly env: ControlEnv){super()}
        
        label = "Jauge"

        description = "A control in a shape of a jauge."

        getSettings(): CSettings{
            return {
                ...super.getSettings(),
                "Direction":{choice:["+x","+y","-x","-y"]},
                "Unfilled": {sub:Decoration.SETTINGS},
                "Filled": {sub:Decoration.SETTINGS},
            }
        }

        getDefaultValues(){
            const sub = {...Decoration.SETTINGS_DEFAULTS, "Height": .2}
            return flattenCDefault({
                "Unfilled": {...sub, "Top Color":"#000000", "Bottom Color": "#000000"},
                "Filled": {...sub, "Top Color":"#ff0000", "Bottom Color": "#ff8888"},
                "Direction": "+x",
            })
        }

        async create(): Promise<Control> {
            await this.init()
            return new JaugeControl(this)
        }

    }

    static Type = async (env: ControlEnv) => new this.Factory(env)
    
}

