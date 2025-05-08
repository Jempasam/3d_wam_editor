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

export function normalizeWamParameter(parameter: WamParameterInfo, value: number): number {
    const p = parameter
    if(p.normalize) return p.normalize(value)
    const {minValue,maxValue} = p
    return (value-minValue)/(maxValue-minValue)
}

export function denormalizeWamParameter(parameter: WamParameterInfo, value: number): number {
    const p = parameter
    value = Math.max(0, Math.min(1, value))
    if(p.denormalize) return p.denormalize(value)
    const {minValue,maxValue} = p
    return value*(maxValue-minValue)+minValue
}