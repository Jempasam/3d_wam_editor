import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { MOValue, OValue } from "../observable/collections/OValue.ts";
import { ControlLibrary, WamGUICode, WamGUIGenerator, WAMGuiInitCode } from "../WamGUIGenerator.ts";
import examples from "../examples.json"

export class LoadSavePane implements IContentRenderer{

    textarea = html.a`<textarea></textarea>` as HTMLTextAreaElement

    presets = html.a`
        <select>
            <option>---Select and Example---</option>
        </select>
    ` as HTMLSelectElement

    element = html.a`
        <div class="menu _vertical _center _fill form_container">
            ${this.textarea}
            ${this.presets}
        </div>
    `

    load(code: WamGUICode|WAMGuiInitCode){
        const pane = this
        if("wam_url" in code){
            function load(){
                pane.gui.observable.unregister(load)
                pane.gui.value.load(code, pane.library)
            }
            pane.gui.observable.register(load)
            this.url.value = code.wam_url
        }
        else this.gui.value.load(code,this.library)
    }


    constructor(private gui: OValue<WamGUIGenerator>, private url: MOValue<string>, private library: ControlLibrary){
        for(const [key,example] of Object.entries(examples)){
            const option = html.a`<option value=${key}>${key}</option>` as HTMLOptionElement
            option.onclick = ()=>{
                this.textarea.value = JSON.stringify(example, null, 2)
                this.load(example as WamGUICode)
            }
            this.presets.appendChild(option)
        }

        this.textarea.onchange = ()=> this.load(JSON.parse(this.textarea.value) as WamGUICode)
        this.textarea.focus = ()=> this.textarea.value = JSON.stringify(this.gui.value.save(library))
    }

    init(_: GroupPanelPartInitParameters): void {
        
    }
    
}