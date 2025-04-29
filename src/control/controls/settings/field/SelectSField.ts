import { html } from "../../../../utils/doc.ts";
import { CSettingsValue } from "../../../settings.ts";
import { SettingsField } from "../SettingsField.ts";

export class SelectSField implements SettingsField{

    element: HTMLSelectElement

    constructor(options: string[], ids: string[] = options){
        const opts = options.map((c,i)=>html.a`<option value="${ids[i]}">${c}</option>`)
        this.element = (html.a`<select>${opts}</select>`) as HTMLSelectElement
        this.element.options[0].selected = true
    }

    get(_: string): CSettingsValue {
        return this.element.value
    }

    set(_: string, value: CSettingsValue): void {
        this.element.value = value?.toString() ?? ""
    }

    addOnChange(on_change: (label: string, value: CSettingsValue) => void): void {
        this.element.onchange = ()=> on_change("",this.element.value)
    }
}