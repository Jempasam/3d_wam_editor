import { WamParameterInfo } from "@webaudiomodules/api";


export function stringifyWamParameter(parameter: WamParameterInfo, value: number): string {
    const p = parameter
    const {minValue, maxValue} = p
    const unnormalized = value*(maxValue-minValue)+minValue
    if(p.valueString) return p.valueString(unnormalized)
    else{
        if(p.choices.length) return p.choices[Math.round(unnormalized)]
        else{
            const {units} = p
            return unnormalized.toPrecision(3)+units
        }
    }
}