import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core"
import { html } from "../utils/doc.ts"
import { OValue } from "../observable/collections/OValue.ts"
import { WamGUIGenerator } from "../WamGUIGenerator.ts"
import { WebAudioModule } from "@webaudiomodules/api"

export class WamPadPane implements IContentRenderer{

    private aspect_ratio = html.a`<input id="aspect_ratio" type="number" min="0.1" max="10" step="0.1" value="1"/>` as HTMLInputElement
    private size = html.a`<input id="size" type="number" min="0.1" max="1" step="0.1" value=".8"/>` as HTMLInputElement
    private top_color = html.a`<input id="top_color" type="color" value="#555555"/>` as HTMLInputElement
    private bottom_color = html.a`<input id="bottom_color" type="color" value="#222222"/>` as HTMLInputElement
    private front_face = html.a`<input id="front_face" type="text" value=""/>` as HTMLInputElement
    private auto_front_face = html.a`<button id="auto_front_face">frontface from thumbnail</button>` as HTMLButtonElement

    element = html.a/*html*/`
        <div class="menu _vertical _scrollable form_container">
            <label>Pad Aspect Ratio</label> ${this.aspect_ratio}
            <label>Pad Size</label> ${this.size}
            <label>Top Color</label> ${this.top_color}
            <label>Bottom Color</label> ${this.bottom_color}
            <label>Front face image</label> ${this.front_face}
            ${this.auto_front_face}
        </div>
    `

    constructor(gui_generator: OValue<WamGUIGenerator>, wam_value: OValue<WebAudioModule|null>, wam_url_value: OValue<string>){
        const pane = this

        gui_generator.link(({to:gui})=>{
            gui.aspect_ratio.link(({to}) => pane.aspect_ratio.value=to.toString())
            gui.size.link(({to}) => pane.size.value=to.toString())
            gui.top_color.link(({to}) => pane.top_color.value=to)
            gui.bottom_color.link(({to}) => pane.bottom_color.value=to)
            gui.front_face.link(({to}) => pane.front_face.value=to??"")
        })
        
        this.top_color.oninput = ()=> gui_generator.value.top_color.value = this.top_color.value
        this.bottom_color.oninput = ()=> gui_generator.value.bottom_color.value = this.bottom_color.value
        this.front_face.oninput = ()=> gui_generator.value.front_face.value = this.front_face.value=="" ? null : this.front_face.value
        this.auto_front_face.onclick = async()=>{
            const wam_url = wam_url_value.value; if(wam_url.length==0) return
            const thumbnail = wam_value.value?.descriptor?.thumbnail; if(thumbnail==undefined) return
            const url = new URL(thumbnail,wam_url).href
            gui_generator.value.front_face.value = url
        }
        this.aspect_ratio.oninput = ()=> gui_generator.value.aspect_ratio.value = parseFloat(this.aspect_ratio.value)
        this.size.oninput = ()=> gui_generator.value.size.value = parseFloat(this.size.value)
    }

    init(_: GroupPanelPartInitParameters): void {
    }

}