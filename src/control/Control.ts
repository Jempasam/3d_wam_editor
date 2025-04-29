import { WamNode, WebAudioModule } from "@webaudiomodules/api"
import { CSettings, CSettingsValue, CSettingsValues } from "./settings.js"
import { AbstractMesh, Scene, TransformNode } from "@babylonjs/core"
import { ControlLibrary } from "../WamGUIGenerator.js"
import { flatten } from "../utils/serializable.js";

export type ControlState =
  | string
  | number
  | boolean
  | null
  | { [property: string]: ControlState }
  | ControlState[];

export type DefaultCSettingsValues = {[label:string] : string|number|boolean|DefaultCSettingsValues}

export function flattenCDefault(from: DefaultCSettingsValues){
    return flatten(from,"/") as CSettingsValues
}

/**
 * The context of creation of the controls.
 * Also given when a GUI is created so it can be used to create the controls of the GUI.
 */
export interface ControlContext{

    /**
     * The web audio module associated to the control.
     * If null the control is just a display and not a functionnal parameter.
     */
    wam?: WebAudioModule

    /** A callback called on each output of the control. */
    defineAnOutput(settings:{
        target: AbstractMesh,
        node: AudioNode,
        setConnected(connected:boolean): void,
    }): void

    /** A callback called on each input of the control. */
    defineAnInput(settings:{
        target: AbstractMesh,
        node: AudioNode,
        setConnected(connected:boolean): void,
    }): void

    /** A callback called on each midi/event output of the control. */
    defineAnEventInput(settings:{
        target: AbstractMesh,
        node: WamNode,
        setConnected(connected:boolean): void,
    }): void

    /** A callback called on each midi/event input of the control. */
    defineAnEventOutput(settings:{
        target: AbstractMesh,
        node: WamNode,
        setConnected(connected:boolean): void,
    }): void

    /** A callback called on each field of the control. */
    defineField(settings:{
        target: AbstractMesh,
        getName(): string,
        getStepSize(): number,
        setValue(value:number): void,
        getValue(): number,
        stringify(value:number): string,
    }): void

    /** A callback called on each field of the control that can be dragged in all 3 dimension. */
    defineDraggableField(settings:{
        target: AbstractMesh,
        getName(): string,
        getValue(): string,
        drag(x: number, y: number, z: number): void,
    }): void
}


/**
 * @typedef {import("./settings.js").ControlSettings} ControlSettings
 * 
 * The superclass for custom elements controls.
 * They should be put in a div container that center them using flexboxes.
 */
export abstract class Control{

    static label: string = "Unnamed Control"

    wam?: WebAudioModule

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
    static getSettings(): CSettings{ throw new Error("Not implemented") }
    
    /** The default values of the parameters. */
    static getDefaultValues(): CSettingsValues{ throw new Error("Not implemented") }

    /** Set a value of a parameter */
    abstract updateValue(label: string, value: CSettingsValue): void

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

    /** Get the state of the control */
    async getState(): Promise<ControlState> {
        return null
    }

    /** Set the state of the control */
    async setState(state: ControlState){ }

    /** Get the list of parameters names. */
    static getSettingsNames(){
        return Object.keys(this.getSettings())
    }

    /**
     * Reset the values of the parameters to the default values.
     * It is called in the constructor.
     */
    setDefaultValues(){
        const flattened = this.factory.getDefaultValues()
        for(let [label,value] of Object.entries(flattened)){
            this.updateValue(label,value)
        }
    }

}