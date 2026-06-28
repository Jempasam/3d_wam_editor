import { Control, ControlContextTarget, ControlFactory, ControlEnv, ControlState } from "../../Control.ts"
import { CSettings, CSettingsValue, CSettingsValues } from "../settings/settings.ts"
import { FieldValue, FieldValueUtils } from "../../value/FieldValue.ts"
import { NoneFieldValue } from "../../value/NoneFieldValue.ts"
import { ControlShared } from "../../ControlShared.ts"

/**
 * A color coded controls that change a numeric value.
 */
export abstract class ParameterControl extends Control{

    declare fields: FieldValue[]
    declare fields_ids: string[]

    promise = Promise.resolve()

    constructor(factory: ControlFactory){
        super(factory)
        this.fields = Array.from((factory as ParameterControlFactory).getParameterLabels(), ()=>NoneFieldValue.INSTANCE)
        this.fields_ids = Array.from((factory as ParameterControlFactory).getParameterLabels(), ()=>"none")
    }

    override updateValue(label: string, value: CSettingsValue){
        let i=0
        const fields = this.env.sharedTemp.get(ControlShared.FIELDS)!!
        for(const l of (this.factory as ParameterControlFactory).getParameterLabels()){
            if(label==l){
                const newfield = fields[value as string] ?? NoneFieldValue.Factory.INSTANCE
                this.fields[i].dispose()
                this.fields_ids[i] = value as string
                ;(async()=>{
                    this.fields[i] = await newfield.create(()=>{
                        this.onParamChange(i)
                    })
                    this.onParamChange(i)
                })()
                break
            }
            i++
        }
    }

    abstract onParamChange(index:number): void

    getNormalizedValue(index: number=0): number {
        const field = this.fields[index]
        if(!field) return 0
        const value = field.getValue()
        const normalized = FieldValueUtils.normalize(value, field)
        return normalized
    }

    getNormalizedStepSize(index: number=0): number {
        const field = this.fields[index]
        if(!field) return 0
        return FieldValueUtils.getNormalizedStepSize(field)
    }

    declareField<C,T>(target: ControlContextTarget<C,T>, mesh: T|(T[]), index: number=0){
        const control = this
        target.defineField({
            id: control.fields_ids[index],
            target: Array.isArray(mesh) ? mesh : [mesh],

            getLabel() { return control.fields[index].getLabel() },
            
            getMin() { return control.fields[index].getMin() },
            getMax() { return control.fields[index].getMax() },
            getStepSize() { return control.fields[index].getStepSize() },
            getExponant() { return control.fields[index].getExponant() },
            
            getValue() {
                return control.fields[index].getValue()
            },
            setValue(value) {
                control.onStateChange?.()
                control.fields[index].setValue(value)
            },
            
            stringify(value) {
                return control.fields[index].stringify(value) ?? "none"
            },
        })
    }

    setValue(value: number, index: number=0){
        this.fields[index]?.setValue(value)
    }

    getValue(index: number=0): number {
        return this.fields[index]?.getValue()??0
    }

    destroy(): void {
        this.fields.forEach(f=>f?.dispose())
        this.env.sharedTemp.free(ControlShared.FIELDS)
    }

    async getState(): Promise<ControlState> {
        return this.fields.map(f=>f.getValue())
    }

    async setState(state: ControlState): Promise<void> {
        if(Array.isArray(state)) state.forEach((value, i) => this.fields[i]?.setValue(value as number))
    }

    getStateName(): string {
        return this.fields.map(f=>f.getLabel()).join(", ")
    }

}

export abstract class ParameterControlFactory implements ControlFactory {
    
    abstract label: string
    
    abstract description: string

    abstract env: ControlEnv
    
    abstract  getDefaultValues(): CSettingsValues

    abstract create(): Promise<Control>

    getParameterLabels(){ return ["Target"] }

    declare names: string[]

    getSettings(){
        const settings: CSettings = {}
        for(const label of this.getParameterLabels()){
            settings[label] = {choice:this.names}
        }
        return settings
    }

    async init(){
        const fields = await this.env.sharedTemp.allocate_async(ControlShared.FIELDS)
        this.names = Object.keys(fields)
    }

}