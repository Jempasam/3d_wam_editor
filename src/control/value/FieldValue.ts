import { WebAudioModule } from "@webaudiomodules/api"
import { ProgramFieldValue } from "./ProgramFieldValue.ts"
import { NoneFieldValue } from "./NoneFieldValue.ts"
import { ParameterFieldValue } from "./ParameterFieldValue.ts"
import { ControlEnv } from "../Control.ts"
import { AnalyzerFieldValue } from "./AnalyzerFieldValue.ts"

/**
 * A value that can be get and set by a control.
 * 
 */
export interface FieldValue{

    /** The display name of the value. */
    getLabel(): string


    /** The maximum value of the field, normalized between 0 and 1. */
    getMax(): number

    /** The minimum value of the field, normalized between 0 and 1. */
    getMin(): number

    /** The exponential factor of the value. 1 means linear. */
    getExponant(): number

    /** The discrete step size of the value. 0 means continuous. */
    getStepSize(): number
    

    /** The value of the field, normalized between 0 and 1. */
    getValue(): number

    /** Set the value of the field, normalized between 0 and 1. */
    setValue(value: number): void


    /** Stringify the value for display. */
    stringify(value: number): string

    /** Dispose of the value, releasing any resources. */
    dispose(): void
}

export namespace FieldValueUtils{
    /** Normalize a value between 0 and 1 based on the field's min and max. */
    export function normalize(value: number, field: FieldValue): number{
        const span = (field.getMax()-field.getMin())
        if(span==0) return 0
        return (value-field.getMin())/span
    }
    /** Get normalized step size based on the field's step size and min/max. */
    export function getNormalizedStepSize(field: FieldValue): number{
        const stepSize = field.getStepSize()
        if(stepSize==0) return 0
        const span = (field.getMax()-field.getMin())
        if(span==0) return 0
        return stepSize/span
    }
}

/**
 * A factory for creating FieldValue instances.
 */
export interface FieldValueFactory{
    /**
     * Create a new FieldValue instance.
     * @param onChange A callback function that is called when the value of the field changes.
     */
    create(
        onChange: (value: number)=> void
    ): Promise<FieldValue>
}

/**
 * Create a set of field value factories.
 */
export async function createFieldFactories(env: ControlEnv){
    const ret = {} as Record<string,FieldValueFactory>

    // No field
    ret["None"] = new NoneFieldValue.Factory()

    if(env.host.wam){
        // Program Change
        ret["Program Change"] = new ProgramFieldValue.Factory(env.host.wam)

        // Analyzer Node
        ret["Analyzed Decibel"] = new AnalyzerFieldValue.Factory(env, {
            name: "Analyzed Decibel",
            value: (node: AnalyserNode) =>{
                const array = new Float32Array(node.frequencyBinCount)
                node.getFloatTimeDomainData(array)
                return array[0]
            },
            min: 0,
            size: 1,
        })

        // Parameters
        const parameters = await env.host.wam.audioNode.getParameterInfo()
        for(const info of Object.values(parameters)){
            ret[info.id] = new ParameterFieldValue.Factory(env.host.wam, info)
        }
        
    }

    return ret
}