import { WebAudioModule } from "@webaudiomodules/api"
import { ControlSettings } from "./settings.js"
import { Scene, TransformNode } from "@babylonjs/core"
import { ControlLibrary } from "../WamGUIGenerator.js"


/**
 * @typedef {import("./settings.js").ControlSettings} ControlSettings
 * 
 * The superclass for custom elements controls.
 * They should be put in a div container that center them using flexboxes.
 */
export abstract class Control{


    /**
     * A factory for creating custom elements controls.
     * @param wam The wam associated to this controls, should be null if 
     * the parameters is just a display and not a fonctionnal parameter.
     */
    constructor(readonly wam: WebAudioModule|null){
    }
    

    // @ts-ignore
    get factory(): ControlLibrary[0] { return this.constructor }

    
    /** Get the list of parameters */
    static getSettings(): ControlSettings{ throw new Error("Not implemented") }
    
    /** The default values of the parameters. */
    static getDefaultValues(): {[label:string]:string}{ throw new Error("Not implemented") }

    /** Set a value of a parameter */
    abstract setValue(label: string, value: string): void

    /** Get a value of a parameter */
    abstract getValue(label: string): string|undefined

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
            this.setValue(label,value)
        }
    }

}