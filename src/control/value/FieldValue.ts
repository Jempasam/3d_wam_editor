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

    /**
     * The display name of the value.
     */
    getName(): string

    /**
     * The value of the field, normalized between 0 and 1.
     */
    getValue(): number

    /**
     * The number of discrete steps of the value.
     * 0 means continuous.
     */
    getStepCount(): number

    /**
     * Set the value of the field, normalized between 0 and 1.
     */
    setValue(value: number): void

    /**
     * Stringify the value for display.
     */
    stringify(value: number): string

    /**
     * Dispose of the value, releasing any resources.
     */
    dispose(): void
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