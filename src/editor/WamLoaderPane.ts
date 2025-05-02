import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core"
import { MOValue } from "../observable/collections/OValue.ts"
import { WamParameterInfoMap, WebAudioModule } from "@webaudiomodules/api"
import { html } from "../utils/doc.ts"
import { Indicator } from "./Indicator.ts"

export class WamLoaderPane implements IContentRenderer{

    url = new MOValue("")

    wam = new MOValue(null as WebAudioModule|null)

    gui = new MOValue(null as HTMLElement|null)

    parameters_info = {} as WamParameterInfoMap

    element = html.a`<div class="menu _vertical"></div>`

    indicator = new Indicator()

    constructor(
        private host: string,
        private audioContext: AudioContext,
    ){
        const label = html.a`<label>WAM URL</label>`

        const input = html.a`<input type="text" />` as HTMLInputElement
        input.onchange = ()=> this.url.value=input.value

        const container = html.a`<div class="container"></div>`
        this.element.replaceChildren(label, input, container, this.indicator.element)

        // Url to Wam
        this.url.observable.register(async({to})=>{
            input.value = to
            
            this.indicator.set("wait","Loading the WAM")
            try{
                let type = (await import(to))?.default as typeof WebAudioModule
                let instance = await type.createInstance(this.host, this.audioContext)
                this.parameters_info = await instance.audioNode.getParameterInfo()
                this.indicator.set("valid","WAM loaded")
                this.wam.value = instance
            }catch(e){
                this.indicator.set("invalid","Error loading the WAM")
                console.error(e)
            }
        })

        // Wam to GUI
        this.wam.observable.register(async({from:oldwam, to:wam})=>{
            console.log("new gui")
            this.indicator.set("wait","Loading the GUI")
            if(oldwam){
                oldwam.destroyGui(this.gui.value!!)
            }
            try{
                if(wam){
                    const gui = await wam.createGui() as HTMLElement
                    container.replaceChildren(gui)
                    this.gui.value = gui
                }
                else{
                    container.replaceChildren()
                }
                this.indicator.set("valid","GUI loaded")
            }catch(e){
                this.indicator.set("invalid","Error loading the GUI")
                console.error(e)
            }
        })
    }

    init(parameters: GroupPanelPartInitParameters): void {
    }
    
}