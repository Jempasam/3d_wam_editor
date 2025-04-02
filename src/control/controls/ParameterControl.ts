import { WamParameterInfo } from "@webaudiomodules/api"
import { Control, ControlContext, ControlState } from "../Control.ts"
import { ControlSettings } from "../settings.ts"
import { AbstractMesh } from "@babylonjs/core"

/**
 * A color coded controls that change a numeric value.
 */
export abstract class ParameterControl extends Control{


    timeout?: any
    value: number
    normalized: number

    constructor(context: ControlContext){
        super(context)
        this.value = 0
        this.normalized = 0
        if(this.wam){
            const control = this
            this.timeout = setTimeout(async function timeout(){
                if(control.parameter){
                    let newvalue = (await control.wam!!.audioNode.getParameterValues(false, control.parameter.id))[control.parameter.id]?.value ?? 0
                    if(newvalue!=control.value){
                        const {minValue, maxValue} = control.parameter
                        control.value=newvalue
                        control.normalized = (control.value-minValue)/(maxValue-minValue)
                        control.onParamChange()
                    }
                }
                if(control.timeout!=undefined)control.timeout = setTimeout(timeout,100)
            },100)
        }
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
                })
                break
        }
    }

    onParamChange(){

    }

    declareField(mesh: AbstractMesh){
        const control = this
        this.context.defineField({
            target: mesh,
            getValue() {
                return control.normalized
            },
            setValue(value) {
                if(!control.parameter) return
                const {minValue, maxValue} = control.parameter
                control.setParamValue(value*(maxValue-minValue)+minValue)
            },
            getStepSize() {
                if(!control.parameter) return 0
                const {minValue, maxValue, discreteStep} = control.parameter
                return discreteStep/(maxValue-minValue)
            },
            stringify(value) {
                if(!control.parameter) return "none"
                const {minValue, maxValue} = control.parameter
                const unnormalized = value*(maxValue-minValue)+minValue
                if(control.parameter){
                    if(control.parameter.valueString) return control.parameter.valueString(unnormalized)
                    else{
                        if(control.parameter.choices.length) return control.parameter.choices[Math.round(unnormalized)]
                        else{
                            const {units} = control.parameter
                            return unnormalized.toPrecision(3)+units
                        }
                    }
                }
                return "none"
            },
        })
    }

    setParamValue(value: number){
        if(this.wam && this.parameter){
            this.wam.audioNode.setParameterValues({[this.parameter.id]:{value, normalized:false, id:this.parameter.id}})
            this.value = value
            this.normalized = (value-this.parameter.minValue)/(this.parameter.maxValue-this.parameter.minValue)
            this.onParamChange()
        }
    }

    destroy(): void {
        if(this.timeout!=undefined){
            clearInterval(this.timeout)
            this.timeout=undefined
        }
    }
}