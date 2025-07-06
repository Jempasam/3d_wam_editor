import { WamParameterInfoMap } from "@webaudiomodules/api";
import { html } from "../../../../utils/doc.ts";
import { ControlSettingsGUI, CSettings, CSettingsValue } from "../settings.ts";
import { SettingsField } from "../SettingsField.ts";

export class EitherSField implements SettingsField{

    element: HTMLElement

    container: HTMLElement
    
    subs: ControlSettingsGUI[] = []

    constructor(choices: CSettings[], wam_parameters_infos?: WamParameterInfoMap){
        const subs = choices.map((sub,i) => new ControlSettingsGUI(choices[i]))

        this.container = html.a`<div></div>`

        this.element = html.a`
            <div class="either">
                <button>⇄</button>
                ${this.container}
            </div>
        `
    }

    get(label: string): CSettingsValue {
        return ""
    }

    set(label: string, value: CSettingsValue): void {
    }

    addOnChange(on_change: (label: string, value: CSettingsValue) => void): void {
    }
}