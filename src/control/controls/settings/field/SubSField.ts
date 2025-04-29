import { WamParameterInfoMap } from "@webaudiomodules/api";
import { html } from "../../../../utils/doc.ts";
import { ControlSettingsGUI, CSettings, CSettingsValue } from "../../../settings.ts";
import { SettingsField } from "../SettingsField.ts";

export class SubSField implements SettingsField{

    private sub: ControlSettingsGUI
    element: HTMLElement

    constructor(settings: CSettings, wam_parameters_infos?: WamParameterInfoMap){
        this.element = html.a`<input type="checkbox"/>` as HTMLInputElement

        this.sub = new ControlSettingsGUI(settings, wam_parameters_infos)
        this.element = html.a`<div class="menu _inner _vertical">${this.sub.element}</div>`
    }

    get(label: string): CSettingsValue {
        return this.sub.getValue(label)
    }

    set(label: string, value: CSettingsValue): void {
        return this.sub.setValue(label, value)
    }

    addOnChange(on_change: (label: string, value: CSettingsValue) => void): void {
        this.sub.on_value_change = (L,V) => on_change(`/${L}`, V)
    }
}