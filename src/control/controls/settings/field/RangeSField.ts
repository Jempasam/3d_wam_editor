import { html } from "../../../../utils/doc.ts";
import { CSettingsValue } from "../settings.ts";
import { SettingsField } from "../SettingsField.ts";

export class RangeSField implements SettingsField{

    element: HTMLInputElement

    constructor(min: number, max: number, step: number){
        this.element = html.a`<input type="range" min="${min}" step="${step}" max="${max}" value="${min}">` as HTMLInputElement
    }

    get(_: string): CSettingsValue {
        return this.element.valueAsNumber
    }

    set(_: string, value: CSettingsValue): void {
        this.element.value = value?.toString() ?? "0"
    }

    addOnChange(on_change: (label: string, value: CSettingsValue) => void): void {
        this.element.onchange = ()=> on_change("",this.element.valueAsNumber)
    }
}