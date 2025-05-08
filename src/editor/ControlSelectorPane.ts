import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { MOValue } from "../observable/collections/OValue.ts";
import { ControlFactory, ControlType } from "../control/Control.ts";
import { ControlLibrary, WamGUIGenerator } from "../WamGUIGenerator.ts";

export class ControlSelectorPane implements IContentRenderer{

    element = html.a`<div class=center_top_pane></div>`

    selected = new MOValue<{key:string, type:ControlType, factory:ControlFactory}|null>(null)

    constructor(
        private controls: ControlLibrary,
        private generator: MOValue<WamGUIGenerator>,
    ){

    }

    init(_: GroupPanelPartInitParameters): void {
        this.dispose_observable = this.generator.link(async()=>{
            const generator = this.generator.value

            // Reselect
            const selected_key = this.selected.value?.key
            let to_select: HTMLElement|null = null
            this.selected.value = null

            // Generate the list of controls
            const list = html.a`<ul class="item_selector _grid"></ul>`
            this.element.replaceChildren(list)
            
            const selector = this

            async function setControl(key: string){
                let options = list.querySelectorAll(":scope > *")
                if(selector.controls[key]){
                    const type = selector.controls[key]
                    const factory = await generator.getFactory(type)
                    selector.selected.value = {key, factory, type}
                    options.forEach( it => it.classList.remove("_selected"))
                    list.querySelector(`li[value="${key}"]`)!!.classList.add("_selected")
                }
            }
        
            for(let [key,control_type] of Object.entries(this.controls)){
                let factory = await generator.getFactory(control_type)
                let example = await factory.create()
                let element = example.createElement()
                let option = list.appendChild(html.a`
                    <li value="${key}" title="${factory.description}">
                        <div class="-icon">${element}</div>
                        <span class="-label">${factory.label}</span>
                    </li>
                `)
                if(key == selected_key)to_select = option
                example.setDefaultValues()
                option.onclick=()=>setControl(key)
            }

            to_select?.click()
        })
        
    }

    private declare dispose_observable: () => void

    dispose(): void {
        this.dispose_observable()
        this.element.replaceChildren()
    }

}