import { WebAudioModule } from "@webaudiomodules/api"
import { ControlSettings } from "./settings.js"
import { AbstractMesh, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import { ControlLibrary } from "../WamGUIGenerator.js"

/**
 * The context of creation of the control.
 */
export interface ControlContext{

    /**
     * The web audio module associated to the control.
     * If null the control is just a display and not a functionnal parameter.
     */
    wam: WebAudioModule|null

    /**
     * A callback called when a field of the control is changed.
     * @param label The label of the field.
     * @param value The new value of the field. 
     */
    on_field_change: (label: string, value: string) => void

    /** A callback called on each output of the control. */
    init_output(mesh:AbstractMesh, setter:(isConnected:boolean)=>void): void

    /** A callback called on each input of the control. */
    init_input(mesh:AbstractMesh, setter:(isConnected:boolean) => void): void

    /** A callback called on each field of the control. */
    init_field(mesh:AbstractMesh, step: number, setter: (value:number)=>string): void

}

/**
 * @typedef {import("./settings.js").ControlSettings} ControlSettings
 * 
 * The superclass for custom elements controls.
 * They should be put in a div container that center them using flexboxes.
 */
export abstract class Control{

    static label: string = "Unnamed Control"

    wam: WebAudioModule|null

    /**
     * A factory for creating custom elements controls.
     * @param wam The wam associated to this controls, should be null if 
     * the parameters is just a display and not a fonctionnal parameter.
     */
    constructor(readonly context: ControlContext){
        this.wam = context.wam
    }
    

    // @ts-ignore
    get factory(): ControlLibrary[0] { return this.constructor }

    
    /** Get the list of parameters */
    static getSettings(): ControlSettings{ throw new Error("Not implemented") }
    
    /** The default values of the parameters. */
    static getDefaultValues(): {[label:string]:string}{ throw new Error("Not implemented") }

    /** Set a value of a parameter */
    abstract updateValue(label: string, value: string): void

    /** Free the resources used by the control */
    abstract destroy(): void

    /** Create the html element of the control. */
    abstract createElement(): HTMLElement

    /** Destroy the html element of the control. */
    abstract destroyElement(): void

    /** Create the babylonjs node of the control. */
    abstract createNode(scene: Scene): TransformNode

    /** Destroy the babylonjs node. */
    abstract destroyNode(): void


    /** Get the list of parameters names. */
    static getSettingsNames(){
        return Object.keys(this.getSettings())
    }

    /**
     * Reset the values of the parameters to the default values.
     * It is called in the constructor.
     */
    setDefaultValues(){
        for(let [label,value] of Object.entries(this.factory.getDefaultValues())){
            this.updateValue(label,value)
        }
    }

}