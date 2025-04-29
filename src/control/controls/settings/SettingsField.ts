import { CSettingsValue } from "../../settings.ts"

export interface SettingsField{

    element: Node

    set(label:string, value:CSettingsValue): void
    
    get(label:string): CSettingsValue

    addOnChange(on_change:(label:string, value:CSettingsValue)=>void): void
}