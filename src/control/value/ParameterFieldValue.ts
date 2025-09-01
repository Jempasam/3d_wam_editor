import { WamParameterInfo, WebAudioModule } from "@webaudiomodules/api";
import { FieldValue, FieldValueFactory } from "./FieldValue.ts";
import { denormalizeWamParameter, normalizeWamParameter, stringifyWamParameter } from "../../utils/wam.ts";


export class ParameterFieldValue implements FieldValue{

    private value = 0
    private normalized = 0

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
                const normalized = normalizeWamParameter(info, newvalue??0)
                control.value = newvalue??0
                control.normalized = normalized
                control.onChange(normalized)
            }
            if(control.timeout!=undefined)control.timeout = setTimeout(timeout,100)
        },100)
    }

    async init(){
        const values = await this.wam.audioNode.getParameterValues(false, this.info.id)
        this.value = values[this.info.id]?.value ?? 0
        this.normalized = normalizeWamParameter(this.info, this.value)
        return this
    }

    getName(): string {
        return this.info.label
    }

    getStepCount(): number {
        const {minValue,maxValue,discreteStep} = this.info
        if(discreteStep==0) return 0
        return Math.floor((maxValue-minValue)/discreteStep)+1
    }

    getValue(): number {
        return this.normalized
    }

    setValue(normalized: number): void {
        const {id} = this.info
        let value = denormalizeWamParameter(this.info, normalized)
        this.wam.audioNode.setParameterValues({[id]:{value, normalized:false, id:id}})
        this.value = value
        this.normalized = normalizeWamParameter(this.info, value)
        this.onChange(this.normalized)
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