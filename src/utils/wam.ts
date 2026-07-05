import { WamParameterInfo } from "@webaudiomodules/api";


export function stringifyWamParameter(parameter: WamParameterInfo, value: number): string {
    const p = parameter
    if(p.valueString) return p.valueString(value)
    else{
        if(p.choices.length) return p.choices[Math.round(value)]
        else{
            const {units} = p
            let rounded = 0
            if(value<10)rounded = Math.round(value*100)/100
            else if(value<100)rounded = Math.round(value*10)/10
            else rounded = Math.round(value)
            return rounded.toString()+units
        }
    }
}

export function normalizeWamParameter(parameter: WamParameterInfo, value: number): number {
    const p = parameter
    if(p.normalize) return p.normalize(value)
    const {minValue,maxValue} = p
    const discreteStep = p.discreteStep || 1/1000
    const stepped = Math.round(value/discreteStep)*discreteStep
    const normalized = (stepped-minValue)/(maxValue-minValue)
    return normalized
}

export function correctNormalizedWamParameter(parameter: WamParameterInfo, value: number): number {
    const p = parameter
    const {minValue,maxValue} = p
    const discreteStep = p.discreteStep || 1/1000
    const stepped = Math.round(value/discreteStep)*discreteStep
    return Math.max(minValue, Math.min(maxValue, stepped))
}





export function denormalizeWamParameter(parameter: WamParameterInfo, value: number): number {
    const p = parameter
    value = Math.max(0, Math.min(1, value))
    if(p.denormalize) return p.denormalize(value)
    const {minValue,maxValue} = p
    const discreteStep = p.discreteStep || 1/1000
    const denormalized = value*(maxValue-minValue)+minValue
    const stepped = Math.round(denormalized/discreteStep)*discreteStep
    return stepped
}