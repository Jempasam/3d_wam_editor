import { TransformNode } from "../babylonjs/core/Meshes/transformNode.js"
import { Node } from "../babylonjs/core/node.js"
import { Scene } from "../babylonjs/core/scene.js"


/**
 * @typedef {import("./settings.js").ControlSettings} ControlSettings
 * 
 * The superclass for custom elements controls.
 * They should be put in a div container that center them using flexboxes.
 */
export class Control{



    /**
     * A factory for creating custom elements controls.
     * @param {any|null} wam The WAM instance. If null, the control is disabled and serve just a display purpose.
     */
    constructor(wam){
        /** @type {typeof Control} */ 
        this.constructor
    }
    

    
    /**
     * Get the list of parameters
     * @abstract
     * @return {ControlSettings} settings
     */
    static getSettings(){ throw new Error("Not implemented") }
    
    /**
     * The default values of the parameters.
     * @abstract
     * @returns {{[label:string]:string}}
     */
    static getDefaultValues(){ throw new Error("Not implemented") }

    /**
     * Set a value of a parameter
     * @abstract
     * @param {string} label 
     * @param {string} value 
     */
    setValue(label, value){ throw new Error("Not implemented") }

    /**
     * Get a value of a parameter
     * @abstract
     * @param {string} label
     * @returns {string} 
     */
    getValue(label){ throw new Error("Not implemented") }

    /**
     * Free the resources used by the control
     */
    destroy(){ throw new Error("Not implemented") }



    /** Create the html element of the control. @returns {HTMLElement} */
    createElement(){ throw new Error("Not implemented") }

    /** Destroy the html element of the control. */
    destroyElement(){ throw new Error("Not implemented") }

    /** Create the babylonjs node of the control. @param {Scene} scene @returns {TransformNode} */
    createNode(scene){ throw new Error("Not implemented") }

    /** Destroy the babylonjs node. */
    destroyNode(){ throw new Error("Not implemented") }



    /**
     * Get the list of parameters names.
     * @returns {string[]}
     */
    static getSettingsNames(){
        return Object.keys(this.getSettings())
    }

    /**
     * Reset the values of the parameters to the default values.
     * It is called in the constructor.
     */
    setDefaultValues(){
        for(let [label,value] of Object.entries(this.constructor.getDefaultValues())){
            this.setValue(label,value)
        }
    }

}