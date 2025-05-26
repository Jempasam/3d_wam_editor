import { WamNode, WebAudioModule } from "@webaudiomodules/api"
import { CSettings, CSettingsValue, CSettingsValues } from "./controls/settings/settings.js"
import { AbstractMesh, Scene, TransformNode } from "@babylonjs/core"
import { flatten } from "../utils/serializable.js";
import { ShareMap } from "./ShareMap.js";

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

export interface ControlContextTarget<C,T>{
    root: C

    /** A callback called on each output of the control. */
    defineAnOutput(settings:{
        target: T[],
        node: AudioNode,
        setConnected(connected:boolean): void,
    }): void

    /** A callback called on each input of the control. */
    defineAnInput(settings:{
        target: T[],
        node: AudioNode,
        setConnected(connected:boolean): void,
    }): void

    /** A callback called on each midi/event output of the control. */
    defineAnEventInput(settings:{
        target: T[],
        node: WamNode,
        setConnected(connected:boolean): void,
    }): void

    /** A callback called on each midi/event input of the control. */
    defineAnEventOutput(settings:{
        target: T[],
        node: WamNode,
        setConnected(connected:boolean): void,
    }): void

    /** A callback called on each field of the control. */
    defineField(settings:{
        target: T[],
        getName(): string,
        getStepCount(): number,
        setValue(value:number): void,
        getValue(): number,
        stringify(value:number): string,
    }): void

    /** A callback called on each field of the control that can be dragged in all 3 dimension. */
    defineDraggableField(settings:{
        target: T[],
        getName(): string,
        getValue(): string,
        drag(x: number, y: number, z: number): void,
    }): void
}

export const DEFAULT_CONTROL_CONTEXT_TARGET = {
    defineAnEventInput(_: any) {},
    defineAnEventOutput(_: any) {},
    defineAnInput(_: any) {},
    defineAnOutput(_: any) {},
    defineDraggableField(_: any) {},
    defineField(_: any) {},
}

/**
 * The context of creation of the controls.
 * Also given when a GUI is created so it can be used to create the controls of the GUI.
 */
export interface ControlHost{

    /**
     * The web audio module associated to the control.
     * If null the control is just a display and not a functionnal parameter.
     */
    wam?: WebAudioModule

    /** The 3d context */
    babylonjs?: ControlContextTarget<TransformNode,AbstractMesh>

    /** The html context */
    html?: ControlContextTarget<HTMLElement,HTMLElement>
}

/**
 * The environment of the control.
 */
export interface ControlEnv{

    /** The host of the control. */
    host: ControlHost

    /** The data shared between the controls. */
    shared: ShareMap

    /** The data shared between the controls that is disposed off when the gui is freezed and no longer modifiable. */
    sharedTemp: ShareMap

}


/**
 * @typedef {import("./settings.js").ControlSettings} ControlSettings
 * 
 * The superclass for custom elements controls.
 * They should be put in a div container that center them using flexboxes.
 */
export abstract class Control{

    wam?: WebAudioModule

    env: ControlEnv

    host: ControlHost

    /**
     * A factory for creating custom elements controls.
     * @param wam The wam associated to this controls, should be null if 
     * the parameters is just a display and not a fonctionnal parameter.
     */
    constructor(
        readonly factory: ControlFactory
    ){
        this.env = factory.env
        this.host = this.env.host
        this.wam = this.host.wam
    }

    /** Set a value of a parameter */
    abstract updateValue(label: string, value: CSettingsValue): void


    // Lifetime
    /** Free the resources used by the control */
    abstract destroy(): void

    /** Free the resources needed to edit the control. */
    freeze():void{ }


    /** Create the html element of the control. */
    abstract createElement(): HTMLElement

    /** Destroy the html element of the control. */
    abstract destroyElement(): void


    /** Create the babylonjs node of the control. */
    abstract createNode(scene: Scene): TransformNode

    /** Destroy the babylonjs node. */
    abstract destroyNode(): void


    /** Get the state of the control */
    getState?(): Promise<ControlState>

    /** Set the state of the control */
    setState?(state: ControlState): Promise<void>

    /** Get the name of the control state */
    getStateName?(): string

    /** Called when the state change */
    onStateChange?: ()=>void



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

/** A factory for creating controls. */
export interface ControlFactory{

    /** Control environment. */
    readonly env: ControlEnv

    /** The name of the control. */
    label: string

    /** The name of the control. */
    description: string

    /** Get the settings of the control. */
    getSettings(): CSettings

    /** The default values of the settings. */
    getDefaultValues(): CSettingsValues

    /** Create the control. */
    create(): Promise<Control>
    
}

/** A type of control. */
export type ControlType = (env: ControlEnv) => Promise<ControlFactory>