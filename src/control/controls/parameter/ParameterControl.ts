import { WamParameterInfo } from "@webaudiomodules/api"
import { Control, ControlContext } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../settings/settings.ts"
import { AbstractMesh } from "@babylonjs/core"
import { stringifyWamParameter } from "../../../utils/wam.ts"

/**
 * A color coded controls that change a numeric value.
 */
export abstract class ParameterControl extends Control{

    timeout?: any

    constructor(context: ControlContext){
        super(context)

        if(this.wam){
            const control = this
            this.timeout = setTimeout(async function timeout(){
                const param_ids = [] as string[]
                const param_map = {} as {[id:string]:number}
                let i=0
                for(const p of control.parameter){
                    if(p){
                        param_ids.push(p.id)
                        param_map[p.id] = i
                    }
                    i++
                }
                let newvalues = (await control.wam!!.audioNode.getParameterValues(false, ...param_ids))
                let changed = []
                for(const [id,{value}] of Object.entries(newvalues)){
                    const param_index = param_map[id]
                    if(param_index===undefined) continue
                    if(value!=control.value[param_index]){
                        const {minValue, maxValue} = control.parameter[param_index]!!
                        control.value[param_index]=value
                        control.normalized[param_index] = (control.value[param_index]-minValue)/(maxValue-minValue)
                        changed.push(param_index)
                    }
                }
                if(changed.length) control.onParamChange(changed)
                if(control.timeout!=undefined)control.timeout = setTimeout(timeout,100)
            },100)
        }

        this.parameter = Array.from((this.constructor as typeof ParameterControl).getParameterLabels(), ()=>null)
        this.value = Array.from(this.parameter, ()=>0)
        this.normalized = Array.from(this.parameter, ()=>0)
    }

    protected static getParameterLabels(){ return ["Target"] }

    static override getSettings(): CSettings{
        const settings: CSettings = {}
        for(const label of this.getParameterLabels()){
            settings[label] = "parameter"
        }
        return settings
    }

    parameter: (WamParameterInfo|null)[]
    value: number[]
    normalized: number[]

    override updateValue(label: string, value: CSettingsValue){
        let i=0
        for(const l of (this.constructor as typeof ParameterControl).getParameterLabels()){
            if(label==l){
                this.wam?.audioNode?.getParameterInfo(value as string)?.then(it=>{
                    this.parameter[i]=it[value as string]
                })
                break
            }
            i++
        }
    }

    onParamChange(index:number[]){

    }

    declareField(mesh: AbstractMesh, index: number=0){
        const control = this
        this.context.defineField({
            target: mesh,
            getName() {
                if(!control.parameter[index]) return "none"
                return control.parameter[index].label
            },
            getValue() {
                return control.normalized[index]
            },
            setValue(value) {
                if(!control.parameter[index]) return
                const {minValue, maxValue} = control.parameter[index]
                control.setParamValue(value*(maxValue-minValue)+minValue)
            },
            getStepSize() {
                if(!control.parameter[index]) return 0
                const {minValue, maxValue, discreteStep} = control.parameter[index]
                return discreteStep/(maxValue-minValue)
            },
            stringify(value) {
                const p = control.parameter[index]; if(!p) return "none"
                return stringifyWamParameter(p, value)
            },
        })
    }

    setParamValue(value: number, index: number=0){
        const p = this.parameter[index]; if(!p) return
        value = Math.max(p.minValue, Math.min(p.maxValue, value))
        if(this.wam){
            this.wam.audioNode.setParameterValues({[p.id]:{value, normalized:false, id:p.id}})
            this.value[index] = value
            this.normalized[index] = (value-p.minValue)/(p.maxValue-p.minValue)
            this.onParamChange([index])
        }
    }

    destroy(): void {
        if(this.timeout!=undefined){
            clearInterval(this.timeout)
            this.timeout=undefined
        }
    }
}