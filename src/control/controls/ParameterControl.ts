import { WamParameterInfo } from "@webaudiomodules/api"
import { Control, ControlContext } from "../Control.ts"
import { ControlSettings } from "../settings.ts"

/**
 * A color coded controls that change a numeric value.
 */
export abstract class ParameterControl extends Control{

    value: number

    constructor(context: ControlContext){
        super(context)
        this.value = 0
    }

    static override getSettings(): ControlSettings{
        return {"Target": "value_parameter"}
    }

    parameter: WamParameterInfo|null = null

    override updateValue(label: string, value: string){
        switch(label){
            case "Target":
                this.wam?.audioNode?.getParameterInfo(value)?.then(it=>{
                    this.parameter=it[value]
                    this.updateParamValue()
                })
                break
        }
    }

    updateParamValue(){
        if(this.wam && this.parameter){
            const {minValue,maxValue,discreteStep} = this.parameter
            let computed_value = (minValue+(maxValue-minValue)*this.value)
            if(discreteStep) computed_value = Math.round(computed_value/discreteStep)*discreteStep
            // @ts-ignore
            this.wam.audioNode.setParameterValues({[this.parameter.id]:{value:computed_value}})
        }
    }
}