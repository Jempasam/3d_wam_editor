
/** @typedef {{[label:string]: "color"|"text"|[number,number]|{min:number,max:number,step:number}|{"choice":string[]}|"value_parameter"|"choice_parameter" }} ControlSettings */

import { html } from "../utils/doc.js"

/**
 * A GUI for control settings.
 */
export class ControlSettingsGUI{

    /** @type {(label:string,value:any)=>void} */
    on_value_change = ()=>{}

    /**
     * Generate the control settings html GUI.
     * @param {ControlSettings} settings
     * @param {{[id:string]:{label:string,id:string,type:string}}} wam_parameters_infos
     */
    constructor(settings, wam_parameters_infos){
        let elements = []
        for(let [label,type] of Object.entries(settings)){
            let element
            
            // Color input : String value
            if(type=="color"){
                element = html.a`<input type="color" value="#ffffff">`
                element.oninput = ()=> this.on_value_change(label,element.value)
            }
            // Text input : String value
            else if(type=="text"){
                element = html.a`<input type="text" value="Text">`
                element.oninput = ()=> this.on_value_change(label,element.value)
            }
            // Simple range input (min,max) : Number value
            else if(Array.isArray(type)){
                element = html.a`<input type="range" min="${type[0]}" step="${(type[1]-type[0])/100}" max="${type[1]}" value="${type[0]}">`
                element.oninput = ()=> this.on_value_change(label,Number.parseFloat(element.value))
            }
            // Complex range input (min,max,step) : Number value
            else if(typeof type == "object" && "min" in type){
                element = html.a`<input type="range" min="${type.min}" step="${type.step}" max="${type.max}" value="${type.min}">`
                element.oninput = ()=> this.on_value_change(label,Number.parseFloat(element.value))
            }
            // Choice input : String value
            else if(typeof type == "object" && "choice" in type){
                element = /** @type {HTMLSelectElement} */ (html.a`<select>${type.choice.map(c=>html.a`<option value="${c}">${c}</option>`)}</select>`)
                element.options[0].selected = true
                element.onchange = ()=> this.on_value_change(label,element.value)
            }
            // WAM Parameter input : String value
            else if(type=="choice_parameter" || type=="value_parameter"){
                element = html.a`<select><option selected="true" value="">None</option></select>`
                for(let [id,info] of Object.entries(wam_parameters_infos)){
                    if(type=="choice_parameter" && info.type!="choice") continue
                    if(type=="value_parameter" && info.type!="float") continue
                    let option = html.a`<option>${info.label??info.id}</option>`
                    option.onchange = ()=> this.on_value_change(label,id)
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

    /**
     * The the value of a setting
     * @param {string} label 
     * @param {any} value 
     */
    setValue(label, value){
        let element = /** @type {HTMLInputElement} */ (this.element.querySelector(`[data-parameter-name="${label}"]`))
        console.log(element)
        console.log(value)
        if(element) element.value= ""+value
    }
}