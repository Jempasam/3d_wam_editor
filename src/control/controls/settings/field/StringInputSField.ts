import { html } from "../../../../utils/doc.ts";
import { CSettingsValue } from "../settings.ts";
import { SettingsField } from "../SettingsField.ts";

export class StringInputSField implements SettingsField{

    element: HTMLInputElement

    constructor(type: string, value: string){
        this.element = html.a`<input type="${type}" value="${value}">` as HTMLInputElement
    }

    get(_: string): CSettingsValue {
        return this.element.value
    }

    set(_: string, value: CSettingsValue): void {
        this.element.value = value?.toString() ?? ""
    }

    addOnChange(on_change: (label: string, value: CSettingsValue) => void): void {
        this.element.oninput = () => on_change("", this.element.value)
    }
}