import { Control, ControlContextTarget, ControlFactory, ControlEnv } from "../../Control.ts"
import { CSettings, CSettingsValue, CSettingsValues } from "../settings/settings.ts"
import { FieldValue } from "../../value/FieldValue.ts"
import { NoneFieldValue } from "../../value/NoneFieldValue.ts"
import { ControlShared } from "../../ControlShared.ts"

/**
 * A color coded controls that change a numeric value.
 */
export abstract class ParameterControl extends Control{

    declare fields: FieldValue[]

    promise = Promise.resolve()

    constructor(factory: ControlFactory){
        super(factory)
        this.fields = Array.from((factory as ParameterControlFactory).getParameterLabels(), ()=>NoneFieldValue.INSTANCE)
    }

    override updateValue(label: string, value: CSettingsValue){
        let i=0
        const fields = this.env.sharedTemp.get(ControlShared.FIELDS)!!
        for(const l of (this.factory as ParameterControlFactory).getParameterLabels()){
            if(label==l){
                const newfield = fields[value as string] ?? NoneFieldValue.Factory.INSTANCE
                this.fields[i].dispose()
                ;(async()=>{
                    this.fields[i] = await newfield.create(()=>{
                        console.log("Field value changed", this.fields[i].getValue())
                        this.onParamChange(i)
                    })
                })()
                break
            }
            i++
        }
    }

    abstract onParamChange(index:number): void

    declareField<C,T>(target: ControlContextTarget<C,T>, mesh: T|(T[]), index: number=0){
        const control = this
        target.defineField({
            target: Array.isArray(mesh) ? mesh : [mesh],
            getName() {
                return control.fields[index].getName()
            },
            getValue() {
                return control.fields[index].getValue()
            },
            setValue(value) {
                control.fields[index].setValue(value)
            },
            getStepCount() {
                return control.fields[index].getStepCount()
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