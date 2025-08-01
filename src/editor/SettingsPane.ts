import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { MOValue } from "../observable/collections/OValue.ts";
import { CSettings, CSettingsValue, ControlSettingsGUI, flatternSettings } from "../control/controls/settings/settings.ts";
import { WamParameterInfoMap } from "@webaudiomodules/api";

export class SettingsPane implements IContentRenderer{

    settings = new MOValue<{
        title: string,
        description: string,
        settings: CSettings,
        setValue(label:string, value:CSettingsValue):void,
        getValue(label:string): CSettingsValue|null,
    }|null>(null)

    values: Record<string,string> = {}

    private title = html.a`<h3></h3>`
    private description = html.a`<p></p>`
    private settings_container = html.a`<div class="menu _vertical _scrollable _inner form_container"></div>`
    element = html.a`<div class="menu _vertical">${this.title}${this.description}${this.settings_container}</div>`

    constructor(
        private parameters_infos?: ()=>WamParameterInfoMap
    ){}

    init(_: GroupPanelPartInitParameters): void {
        this.settings.link(({to:config})=>{
            if(config){
                const {title, settings, getValue, setValue} = config
                this.title.textContent = title
                this.description.textContent = config.description

                let gui = new ControlSettingsGUI(settings)
                for(let [label,_] of Object.entries(flatternSettings(settings))){
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