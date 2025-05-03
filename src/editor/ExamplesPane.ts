import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { ControlLibrary, WamGUICode, WamGUIGenerator, WAMGuiInitCode } from "../WamGUIGenerator.ts";
import controls from "../control/controls.ts";
import { html } from "../utils/doc.ts";
import { MOValue, OValue } from "../observable/collections/OValue.ts";
import { DEFAULT_CONTROL_CONTEXT_TARGET } from "../control/Control.ts";

export class ExamplesPane implements IContentRenderer{

    element = html.a`<div class=center_top_pane></div>`

    constructor(
        private examples: Record<string,WAMGuiInitCode>,
        private gui: OValue<WamGUIGenerator>,
        private url: MOValue<string>,
        private library: ControlLibrary
    ){}

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

    init(_: GroupPanelPartInitParameters): void {
        const list = html.a`<ul class="item_selector _grid"></ul>`
        this.element.replaceChildren(list)
        
        for(let [key,code] of Object.entries(this.examples)){
            ;(async()=>{
                const icon = html.a`<div class="-icon"></div>`
                icon.style.contain="strict"
                const gui = await WamGUIGenerator.create({html:{
                    root: icon,
                    ...DEFAULT_CONTROL_CONTEXT_TARGET,
                }})
                await gui.load(code as WamGUICode,controls)
                let entry = list.appendChild(html.a`
                    <li value="${key}">
                        ${icon}
                        <span class="-label">${key}</span>
                    </li>
                `)
                entry.onclick = ()=> this.load(code as WamGUICode)
                list.appendChild(entry)
            })()
        }
    }

    dispose(): void {
        this.element.replaceChildren()
    }

}