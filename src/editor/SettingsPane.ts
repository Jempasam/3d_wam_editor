import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { MOValue } from "../observable/collections/OValue.ts";
import { ControlSettings, ControlSettingsGUI } from "../control/settings.ts";
import { WamParameterInfoMap } from "@webaudiomodules/api";

export class SettingsPane implements IContentRenderer{

    settings = new MOValue<{
        title: string,
        settings: ControlSettings,
        setValue(label:string,value:string):void,
        getValue(label:string):string|undefined,
    }|null>(null)

    values: Record<string,string> = {}

    private title = html.a`<h3></h3>`
    private settings_container = html.a`<div class="menu _vertical _scrollable form_container"></div>`
    element = html.a`<div class="menu _vertical">${this.title}${this.settings_container}</div>`

    constructor(
        private parameters_infos?: ()=>WamParameterInfoMap
    ){}

    init(_: GroupPanelPartInitParameters): void {
        this.settings.link(({to:config})=>{
            if(config){
                const {title, settings, getValue, setValue} = config
                this.title.textContent = title

                let gui = new ControlSettingsGUI(settings,this.parameters_infos?.())
                for(let [label,_] of Object.entries(settings)){
                    const value = getValue(label)
                    if(value!=undefined) gui.setValue(label,value)
                }

                gui.on_value_change = (label,value)=> setValue(label,value)
                this.settings_container.replaceChildren(gui.element)
            }
            else{
                this.title.textContent = ""
                this.settings_container.replaceChildren()
                return
            }
            
        })
            
    }

}