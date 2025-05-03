import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { MOValue } from "../observable/collections/OValue.ts";
import { Control } from "../control/Control.ts";
import { ControlLibrary } from "../WamGUIGenerator.ts";

export class ControlSelectorPane implements IContentRenderer{

    element = html.a`<div class=center_top_pane></div>`

    selected = new MOValue<{key:string, control:typeof Control}|null>(null)

    constructor(
        private controls: ControlLibrary
    ){

    }

    init(parameters: GroupPanelPartInitParameters): void {
        const list = html.a`<ul class="item_selector _grid"></ul>`
        this.element.replaceChildren(list)
        
        const selector = this

        function setControl(key: string){
            let options = list.querySelectorAll(":scope > *")
            if(selector.controls[key]){
                const control = selector.controls[key]
                selector.selected.value = {key, control}
                options.forEach( it => it.classList.remove("_selected"))
                list.querySelector(`li[value="${key}"]`)!!.classList.add("_selected")
                //showSelectedControlSettings()
            }
        }
    
        for(let [key,control] of Object.entries(this.controls)){
            let example = new control({
                defineAnInput(settings) {},
                defineAnOutput(settings) {},
                defineAnEventInput(settings) {},
                defineAnEventOutput(settings) {},
                defineField(settings) {},
                defineDraggableField(settings) {},
            })
            let element = example.createElement()
            let option = list.appendChild(html.a`
                <li value="${key}" title="${control.description}">
                    <div class="-icon">${element}</div>
                    <span class="-label">${control.label}</span>
                </li>
            `)
            example.setDefaultValues()
            option.onclick=()=>setControl(key)
        }
    }

}