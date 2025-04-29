import { IFontData } from "@babylonjs/core";
import { html } from "../../../../utils/doc.ts";
import { CSettingsValue } from "../../../settings.ts";
import { SettingsField } from "../SettingsField.ts";

export class FontSField implements SettingsField{

    element: HTMLSelectElement

    constructor(){
        this.element =  html.a`<select></select>` as HTMLSelectElement
        for(let [name,{css}] of Object.entries(FONTS)){
            let option = html.a`<option value="${name}">${name}</option>`
            option.style.fontFamily = `'${css}'`
            this.element.appendChild(option)
        }
        this.element.style.fontFamily = `'${this.element.value}'`
    }

    get(_: string): CSettingsValue {
        return this.element.value
    }

    set(_: string, value: CSettingsValue): void {
        this.element.value = value?.toString() ?? Object.keys(FONTS)[0]
    }

    addOnChange(on_change: (label: string, value: CSettingsValue) => void): void {
        this.element.onchange = ()=>{
            on_change("",this.element.value)
            this.element.style.fontFamily = `'${this.element.value}'`
        }
    }
}



export const FONTS: Record<string,{css:string, babylon:IFontData}> = {}
for(const [file, url] of Object.entries(import.meta.glob("../../../../../media/fonts/*"))){
    const file_full_name = file.split("/").pop() ?? ""
    const [name,extension] = file_full_name.split(".")
    FONTS[name] ??= {css:"", babylon:{} as IFontData}
    if(extension=="ttf" || extension=="otf"){
        const font_url = ((await url()) as any).default as string
        document.fonts.add(await new FontFace(name, `url(${font_url})`).load())
        FONTS[name].css = name
    }
    else{
        FONTS[name].babylon = (await url()) as IFontData
    }
}
