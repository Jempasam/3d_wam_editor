import { WamParameterInfo, WebAudioModule } from "@webaudiomodules/api";
import { FieldValue, FieldValueFactory } from "./FieldValue.ts";
import { stringifyWamParameter } from "../../utils/wam.ts";


export class ParameterFieldValue implements FieldValue{

    private value = 0

    private timeout: any

    constructor(
        private wam: WebAudioModule,
        private info: WamParameterInfo,
        private onChange: (value: number) => void,
    ){
        const control = this
        this.timeout = setTimeout(async function timeout(){
            const newvalues = (await wam.audioNode.getParameterValues(false, info.id))
            const newvalue = newvalues[info.id]?.value
            if(newvalue!=control.value){
                control.value = newvalue??0
                control.onChange(newvalue)
            }
            if(control.timeout!=undefined)control.timeout = setTimeout(timeout,100)
        },100)
    }

    async init(){
        const values = await this.wam.audioNode.getParameterValues(false, this.info.id)
        this.value = values[this.info.id]?.value ?? 0
        return this
    }

    getLabel(): string { return this.info.label }

    getMax(): number { return this.info.maxValue }

    getMin(): number { return this.info.minValue }

    getExponant(): number { return this.info.exponent }

    getStepSize(): number { return this.info.discreteStep }

    getValue(): number {
        return this.value
    }

    setValue(value: number): void {
        const {id} = this.info
        this.wam.audioNode.setParameterValues({[id]:{id, value, normalized:false}})
        this.value = value
        this.onChange(value)
    }

    stringify(value: number): string {
        return stringifyWamParameter(this.info, value)
    }

    dispose(): void {
        clearTimeout(this.timeout)
        this.timeout = undefined
    }

    static Factory = class _ implements FieldValueFactory{

        constructor(private wam: WebAudioModule, private info: WamParameterInfo){}

        async create(onChange: (value: number) => void) {
            return await new ParameterFieldValue(this.wam, this.info, onChange)?.init()
        }

    }
}