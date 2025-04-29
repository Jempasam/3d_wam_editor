import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core"
import { html } from "../utils/doc.ts"
import { OValue } from "../observable/collections/OValue.ts"
import { WamGUIGenerator } from "../WamGUIGenerator.ts"
import { WebAudioModule } from "@webaudiomodules/api"
import { DECORATION_SHAPE_MODIFIER, DECORATION_SHAPE_POINTS } from "../utils/visual/Decoration.ts"

export class WamPadPane implements IContentRenderer{

    private shape = html.a`
        <select>
            ${
                Object.keys(DECORATION_SHAPE_POINTS)
                    .map(it=>html.a`<option value=${it}>${it[0].toUpperCase()+it.substring(1)}</option>`)
            }
        </select>
    ` as HTMLSelectElement
    private aspect_ratio = html.a`<input type="number" min="0.1" max="10" step="0.1" value="1"/>` as HTMLInputElement
    private size = html.a`<input type="number" min="0.1" max="1" step="0.1" value=".8"/>` as HTMLInputElement
    private top_color = html.a`<input type="color" value="#555555"/>` as HTMLInputElement
    private bottom_color = html.a`<input type="color" value="#222222"/>` as HTMLInputElement
    private face_color = html.a`<input type="color" value="#ffffff"/>` as HTMLInputElement
    private front_face = html.a`<input type="text" value=""/>` as HTMLInputElement
    private auto_front_face = html.a`<button>frontface from thumbnail</button>` as HTMLButtonElement
    private outline_width = html.a`<input type="range" min="0" max="0.5" step="0.01" value="0"/>` as HTMLInputElement
    private outline_color = html.a`<input type="color" value="#000000"/>` as HTMLInputElement
    private modifier = html.a`<select>${Object.keys(DECORATION_SHAPE_MODIFIER).map(it=>html.a`<option value="${it}">${it}</option>`)}<select/>` as HTMLInputElement
    private modifier_strength = html.a`<input type="range" min="0" max="1" step="0.01" value="0"/>` as HTMLInputElement

    element = html.a/*html*/`
        <div class="menu _vertical _scrollable form_container">
            <label>Shape</label> ${this.shape}
            <label>Modifier</label> ${this.modifier} ${this.modifier_strength}
            <label>Pad Aspect Ratio</label> ${this.aspect_ratio}
            <label>Pad Size</label> ${this.size}
            <label>Pad Gradient</label> ${this.top_color} ${this.bottom_color}
            <label>Outline</label> ${this.outline_color} ${this.outline_width}
            <label>Front face image</label> ${this.front_face} ${this.face_color}
            <label>
            ${this.auto_front_face}
        </div>
    `

    constructor(gui_generator: OValue<WamGUIGenerator>, wam_value: OValue<WebAudioModule|null>, wam_url_value: OValue<string>){
        const pane = this

        gui_generator.link(({to:gui})=>{
            gui.pad_shape.link(({to}) => pane.shape.value=to)
            gui.aspect_ratio.link(({to}) => pane.aspect_ratio.value=to.toString())
            gui.size.link(({to}) => pane.size.value=to.toString())
            gui.top_color.link(({to}) => pane.top_color.value=to)
            gui.bottom_color.link(({to}) => pane.bottom_color.value=to)
            gui.front_face.link(({to}) => pane.front_face.value=to??"")
            gui.pad_outline_color.link(({to}) => pane.outline_color.value=to)
            gui.pad_outline_width.link(({to}) => pane.outline_width.value=to.toString())
            gui.front_face_color.link(({to}) => pane.face_color.value=to)
            gui.modifier.link(({to}) => pane.modifier.value=to)
            gui.modifier_strength.link(({to}) => pane.modifier_strength.value=to.toString())
        })
        
        this.shape.oninput = ()=> gui_generator.value.pad_shape.value = this.shape.value as "rectangle"|"circle"|"triangle"
        this.top_color.oninput = ()=> gui_generator.value.top_color.value = this.top_color.value
        this.bottom_color.oninput = ()=> gui_generator.value.bottom_color.value = this.bottom_color.value
        this.face_color.oninput = ()=> gui_generator.value.front_face_color.value = this.face_color.value
        this.front_face.oninput = ()=> gui_generator.value.front_face.value = this.front_face.value=="" ? null : this.front_face.value
        this.auto_front_face.onclick = async()=>{
            const wam_url = wam_url_value.value; if(wam_url.length==0) return
            const thumbnail = wam_value.value?.descriptor?.thumbnail; if(thumbnail==undefined) return
            const url = new URL(thumbnail,wam_url).href
            gui_generator.value.front_face.value = url
        }
        this.aspect_ratio.oninput = ()=> gui_generator.value.aspect_ratio.value = parseFloat(this.aspect_ratio.value)
        this.size.oninput = ()=> gui_generator.value.size.value = parseFloat(this.size.value)
        this.outline_color.oninput = ()=> gui_generator.value.pad_outline_color.value = this.outline_color.value
        this.outline_width.oninput = ()=> gui_generator.value.pad_outline_width.value = parseFloat(this.outline_width.value)
        this.modifier.oninput = ()=> gui_generator.value.modifier.value = this.modifier.value as string
        this.modifier_strength.oninput = ()=> gui_generator.value.modifier_strength.value = parseFloat(this.modifier_strength.value)
    }

    init(_: GroupPanelPartInitParameters): void {
    }

}