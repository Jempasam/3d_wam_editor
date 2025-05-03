import { Scene, TransformNode } from "@babylonjs/core"
import { Control, ControlContext, flattenCDefault } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"
import { Decoration } from "../../../utils/visual/Decoration.ts"


/**
 * An event and audio input control that changes a numeric value.
 */
export class DecorationControl extends Control{

    static override label = "Decoration"

    static override description = "A simple decoration."

    private decoration = new Decoration()

    constructor(context: ControlContext){
        super(context)
    }

    static override getSettings(): CSettings{
        return {
            "Shape": {sub:Decoration.SETTINGS},
        }
    }

    static override getDefaultValues(){
        return flattenCDefault({
            "Shape": Decoration.SETTINGS_DEFAULTS,
        })
    }

    override updateValue(label: string, value: CSettingsValue){
        switch(label){
            default:
                if(label.startsWith("Shape/"))
                    Decoration.SETTINGS_SETTERS[label.substring("Shape/".length)] ?.(this.decoration, value as string)
        }
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

    /** @type {Control['destroy']} */
    destroy(){
    }

}