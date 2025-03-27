import { WamParameterInfo } from "@webaudiomodules/api"
import { Control, ControlContext } from "../Control.ts"
import { ControlSettings } from "../settings.ts"
import { AbstractMesh } from "@babylonjs/core"

/**
 * A color coded controls that change a numeric value.
 */
export abstract class ParameterControl extends Control{


    interval?: any
    value: number

    constructor(context: ControlContext){
        super(context)
        this.value = 0
        if(this.wam){
            this.interval = setInterval(async()=>{
                if(this.parameter){
                    let newvalue = (await this.wam!!.audioNode.getParameterValues(true, this.parameter.id))[this.parameter.id]?.value ?? 0
                    if(newvalue!=this.value){
                        this.value=newvalue
                        this.onParamChange()
                    }

                }
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
            getValue() { return control.value },
            setValue(value) { control.setParamValue(value) },
            getStepCount() {
                if(control.parameter){
                    if(control.parameter.discreteStep!=0)return (control.parameter.maxValue-control.parameter.minValue)/control.parameter.discreteStep
                }
                return 0
            },
            stringify(value) {
                if(control.parameter){
                    if(control.parameter.valueString) return control.parameter.valueString(value)
                    else{
                        if(control.parameter.choices) return control.parameter.choices[Math.round(value)]
                        else{
                            const {minValue,maxValue,units} = control.parameter
                            return (value*(maxValue-minValue)+minValue)+units
                        }
                    }
                }
                return "none"
            },
        })
    }

    setParamValue(normalized: number){
        if(this.wam && this.parameter){
            this.wam.audioNode.setParameterValues({[this.parameter.id]:{value:normalized,normalized:true,id:this.parameter.id}})
            this.value = normalized
            this.onParamChange()
        }
    }

    destroy(): void {
        if(this.interval!=undefined)clearInterval(this.interval)
    }
}