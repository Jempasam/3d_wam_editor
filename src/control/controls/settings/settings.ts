import {html} from "../../../utils/doc.ts"
import { SettingsField } from "./SettingsField.ts"
import { StringInputSField } from "./field/StringInputSField.ts"
import { CheckboxSField } from "./field/CheckboxSField.ts"
import { RangeSField } from "./field/RangeSField.ts"
import { SelectSField } from "./field/SelectSField.ts"
import { FontSField } from "./field/FontSField.ts"
import { SubSField } from "./field/SubSField.ts"
import { ErrorSField } from "./field/ErrorSField.ts"

export type CSettingsValue = string|number|boolean

export type CSettings = {
    [label:string]:
        "color"
        | "text"
        | "long_text"
        | "boolean"
        | "font"
        | [number,number]
        | {min:number,max:number,step:number}
        | {"choice":string[]}
        | {sub:CSettings}
}

export type CSettingsValues = {
    [label:string]: CSettingsValue
}

/**
 * A GUI for control settings.
 */
export class ControlSettingsGUI{

    on_value_change: (label:string, value:CSettingsValue)=>void = ()=>{}

    declare element: DocumentFragment

    private parameters: { [label:string]: SettingsField } = {}

    private addParameter(label: string, type: CSettings["a"]): DocumentFragment{
        let parameter: SettingsField|null = null
        
        // Color input : String value
        if(type=="color") parameter = new StringInputSField("color","#ffffff")

        // Text input : String value
        else if(type=="text") parameter = new StringInputSField("text","")

        // Boolean input : Boolean value
        else if(type=="boolean") parameter = new CheckboxSField()

        // Simple range input (min,max) : Number value
        else if(Array.isArray(type)) parameter = new RangeSField(type[0], type[1], (type[1]-type[0])/100)

        // Complex range input (min,max,step) : Number value
        else if(typeof type == "object" && "min" in type) parameter = new RangeSField(type.min, type.max, type.step)

        // Choice input : String value
        else if(typeof type == "object" && "choice" in type) parameter = new SelectSField(type.choice)
        
        // Font input : String value
        else if(type == "font") parameter = new FontSField()

        // Sub settings : ControlSettings value
        else if(typeof type == "object" && "sub" in type) parameter = new SubSField(type.sub)
            
        // Unsupported setting type
        else parameter = new ErrorSField()

        if(parameter){
            this.parameters[label] = parameter
            parameter.addOnChange((l,v)=>{
                this.on_value_change(`${label}${l}`,v)
            })
            return html`<label>${label}</label>${parameter.element}`
        }
        else return html``
        
    }

    /** Generate the control settings html GUI. */
    constructor(settings: CSettings){
        let elements = []
        for(let [label,type] of Object.entries(settings)){
            elements.push(this.addParameter(label,type))
        }
        this.element = html`${elements}`
    }

    /** Set the value of a setting */
    setValue(label: string, value: CSettingsValue){
        const [base,rest] = label.split("/",2)
        this.parameters[base]?.set(rest??"",value)
    }

    /** Get the value of a setting */
    getValue(label: string): CSettingsValue{
        const [base,rest] = label.split("/",2)
        return this.parameters[base]?.get(rest??"")
    }

    /** Set the values of multiple settings */
    setValues(values: CSettingsValues){
        for(let [label,value] of Object.entries(values)){
            this.setValue(label,value)
        }
    }

    /** Get the values of multiple settings */
    getValues(): CSettingsValues{
        const values: CSettingsValues = {}
        for(let label of Object.keys(this.parameters)){
            values[label] = this.getValue(label)
        }
        return values
    }
}

function flattenTo(from: CSettings, to: CSettings, prefix: String){
    for(let [label,type] of Object.entries(from)){
        if(typeof type == "object" && "sub" in type){
            flattenTo(type.sub, to, `${prefix}${label}/`)
        }
        else{
            to[`${prefix}${label}`] = type
        }
    }
}

export function flatternSettings(settings: CSettings){
    const flattened: CSettings = {}
    flattenTo(settings, flattened, "")
    return flattened
}