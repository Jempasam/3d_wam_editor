import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { WebAudioModule } from "@webaudiomodules/api";
import { OValue } from "../observable/collections/OValue.ts";

export class OneWamPane implements IContentRenderer{

    element = html.a`<div class=center_top_pane></div>`

    constructor(
        private audioContext: BaseAudioContext,
        private groupId: string,
        private url: string,
        private target_wam: OValue<WebAudioModule|null>,
    ){}

    private chain: Promise<any> = Promise.resolve()
    private gui?: Element
    private wam?: WebAudioModule
    private disposeof?: () => void

    init(_: GroupPanelPartInitParameters): void {
        this.chain = this.chain.then(async()=>{
            if(this.wam && this.gui){
                this.wam.destroyGui(this.gui)
                this.wam.audioNode.destroy()
                this.wam = undefined
                this.gui = undefined
                this.element.replaceChildren()
            }
            const factory = (await import(this.url) as any).default as typeof WebAudioModule
            const wam = await factory.createInstance(this.groupId, this.audioContext)
            const gui = await wam.createGui()

            this.element.replaceChildren(gui)

            this.wam = wam
            this.gui = gui

            this.disposeof = this.target_wam.link(()=>{
                if(this.target_wam.value!=null){
                    this.wam!!.audioNode.connect(this.target_wam.value.audioNode)
                    this.wam!!.audioNode.connectEvents(this.target_wam.value.instanceId)
                }
            })   
        })    
    }

    dispose(): void {
        this.chain = this.chain.then(async()=>{
            this.disposeof?.()
            if(this.wam && this.gui){
                this.wam.destroyGui(this.gui)
                this.wam.audioNode.destroy()
                this.wam = undefined
                this.gui = undefined
                this.element.replaceChildren()
            }
        })
    }

}