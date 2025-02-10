import { IFontData } from "@babylonjs/core"
import {html} from "../utils/doc.ts"


export type ControlSettings = {
    [label:string]:
        "color"
        | "text"
        | "font"
        | [number,number]
        | {min:number,max:number,step:number}
        | {"choice":string[]}
        | "value_parameter"
        | "choice_parameter"
}


/**
 * A GUI for control settings.
 */
export class ControlSettingsGUI{

    on_value_change = (label:string,value:any)=>{}

    declare element: DocumentFragment

    /** Generate the control settings html GUI. */
    constructor(settings: ControlSettings, wam_parameters_infos: {[id:string]:{label:string,id:string,type:string}}){
        let elements = []
        for(let [label,type] of Object.entries(settings)){
            let element: HTMLElement|null = null
            
            // Color input : String value
            if(type=="color"){
                element = html.a`<input type="color" value="#ffffff">`
                element.oninput = ()=> this.on_value_change(label,(element as HTMLInputElement).value)
            }
            // Text input : String value
            else if(type=="text"){
                element = html.a`<input type="text" value="Text">`
                element.oninput = ()=> this.on_value_change(label,(element as HTMLInputElement).value)
            }
            // Simple range input (min,max) : Number value
            else if(Array.isArray(type)){
                element = html.a`<input type="range" min="${type[0]}" step="${(type[1]-type[0])/100}" max="${type[1]}" value="${type[0]}">`
                element.oninput = ()=> this.on_value_change(label,Number.parseFloat((element as HTMLInputElement).value))
            }
            // Complex range input (min,max,step) : Number value
            else if(typeof type == "object" && "min" in type){
                element = html.a`<input type="range" min="${type.min}" step="${type.step}" max="${type.max}" value="${type.min}">`
                element.oninput = ()=> this.on_value_change(label,Number.parseFloat((element as HTMLInputElement).value))
            }
            // Choice input : String value
            else if(typeof type == "object" && "choice" in type){
                element = (html.a`<select>${type.choice.map(c=>html.a`<option value="${c}">${c}</option>`)}</select>`) as HTMLSelectElement
                (element as HTMLSelectElement).options[0].selected = true
                element.onchange = ()=> this.on_value_change(label,(element as HTMLInputElement).value)
            }
            else if(type == "font"){
                /** @type {HTMLSelectElement} */
                element =  html.a`<select></select>`
                for(let [name,{css}] of Object.entries(FONTS)){
                    let option = html.a`<option value="${name}">${name}</option>`
                    option.style.fontFamily = `'${css}'`
                    element.appendChild(option)
                }
                element.onchange = (event)=> {
                    this.on_value_change(label, (element as HTMLInputElement).value)
                    element!!.style.fontFamily = `'${(element as HTMLInputElement).value}'`
                }
            }
            // WAM Parameter input : String value
            else if(type=="choice_parameter" || type=="value_parameter"){
                element = html.a`<select><option selected="true" value="">None</option></select>`
                for(let [id,info] of Object.entries(wam_parameters_infos)){
                    if(type=="choice_parameter" && info.type!="choice") continue
                    if(type=="value_parameter" && info.type!="float") continue
                    let option = html.a`<option>${info.label??info.id}</option>`
                    option.onclick = ()=> this.on_value_change(label,id)
                    element.appendChild(option)
                }
            }
            // Unsupported setting type
            else element = html.a`<span style="color:red;">Unsupported Setting</span>`

            element.setAttribute("data-parameter-name",label)
            elements.push(html`<label>${label}</label>${element}`)
        }
        this.element = html`${elements}`
    }

    /** The the value of a setting */
    setValue(label: string, value: any){
        let element = /** @type {HTMLInputElement} */ (this.element.querySelector(`[data-parameter-name="${label}"]`))
        console.log(element)
        console.log(value)
        if(element) (element as HTMLInputElement).value= ""+value
    }
}

console.log(">")

export const FONTS: Record<string,{css:string, babylon:IFontData}> = {}
for(const [file, url] of Object.entries(import.meta.glob("../../media/fonts/*"))){
    const file_full_name = file.split("/").pop() ?? ""
    const [name,extension] = file_full_name.split(".")
    FONTS[name] ??= {css:"", babylon:{} as IFontData}
    if(extension=="ttf" || extension=="otf"){
        const font_url = ((await url()) as any).default as string
        console.log(font_url)
        document.fonts.add(await new FontFace(name, `url(${font_url})`).load())
        FONTS[name].css = name
        console.log(FONTS[name].css)
    }
    else{
        FONTS[name].babylon = (await url()) as IFontData
    }
}