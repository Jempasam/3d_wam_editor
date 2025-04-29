import { html } from "../../../../utils/doc.ts";
import { CSettingsValue } from "../../../settings.ts";
import { SettingsField } from "../SettingsField.ts";

export class ErrorSField implements SettingsField{

    element = html.a`<span style="color:red;">Unsupported Setting</span>`

    get(_: string): CSettingsValue { return "" }

    set(_: string, _2: CSettingsValue): void { }

    addOnChange(_: (label: string, value: CSettingsValue) => void): void { }
}