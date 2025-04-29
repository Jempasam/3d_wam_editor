import { html } from "../../../../utils/doc.ts";
import { CSettingsValue } from "../../../settings.ts";
import { SettingsField } from "../SettingsField.ts";

export class CheckboxSField implements SettingsField{

    element: HTMLInputElement

    constructor(){
        this.element = html.a`<input type="checkbox"/>` as HTMLInputElement
    }

    get(_: string): CSettingsValue {
        return this.element.checked
    }

    set(_: string, value: CSettingsValue): void {
        this.element.checked = !!value
    }

    addOnChange(on_change: (label: string, value: CSettingsValue) => void): void {
        this.element.oninput = () => on_change("", this.element.checked)
    }
}