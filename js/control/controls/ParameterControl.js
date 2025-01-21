import { PointerDragBehavior } from "../../babylonjs/core/Behaviors/Meshes/pointerDragBehavior.js";
import { StandardMaterial } from "../../babylonjs/core/Materials/standardMaterial.js";
import { Color3 } from "../../babylonjs/core/Maths/math.color.js";
import { Vector3 } from "../../babylonjs/core/Maths/math.vector.js";
import { MeshBuilder } from "../../babylonjs/core/Meshes/meshBuilder.js";
import { Control } from "../Control.js";

/**
 * A color coded controls that change a numeric value.
 */
export class ParameterControl extends Control{

    constructor(wam){
        super()
        this.wam = wam
        this.value = 0
    }

    /** @type {(typeof Control)['getSettings']} */
    static getSettings(){
        return {"Target": "value_parameter"}
    }

    /** @type {Control['setValue']} */
    setValue(label, value){
        switch(label){
            case "Target":
                this.wam?.audioNode?.getParameterInfo(value)?.then(it=>{
                    this.parameter=it[value]
                    this.updateParamValue()
                })
                break
        }
    }

    /** @type {Control['getValue']} */
    getValue(label){
        switch(label){
            case "Target":
                return this.parameter?.id
        }
    }

    updateParamValue(){
        if(this.wam && this.parameter){
            const {minValue,maxValue,discreteStep} = this.parameter
            let computed_value = (minValue+(maxValue-minValue)*this.value)
            if(discreteStep) computed_value = Math.round(computed_value/discreteStep)*discreteStep
            this.wam.audioNode.setParameterValues({[this.parameter.id]:{value:computed_value}})
        }
    }
}

function cssRgbToHex(rgb){
    let rgba = rgb.match(/\d+/g)
    return "#" + rgba.map(v=>parseInt(v).toString(16).padStart(2,"0")).join("") 
}

