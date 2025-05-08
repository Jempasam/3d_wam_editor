import { WamParameterInfo, WebAudioModule } from "@webaudiomodules/api";
import { FieldValue, FieldValueFactory } from "./FieldValue.ts";
import { normalizeWamParameter, stringifyWamParameter } from "../../utils/wam.ts";


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
        const {minValue,maxValue,id} = this.info
        let value = Math.round(normalized*(maxValue-minValue)+minValue)
        value = Math.max(minValue, Math.min(maxValue, value))
        this.wam.audioNode.setParameterValues({[id]:{value, normalized:false, id:id}})
        this.value = value
        this.normalized = (value-minValue)/(maxValue-minValue)
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
            return new ParameterFieldValue(this.wam, this.info, onChange)
        }

    }
}