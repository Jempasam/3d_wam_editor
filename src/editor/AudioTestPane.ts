import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { WebAudioModule } from "@webaudiomodules/api";
import { OValue } from "../observable/collections/OValue.ts";

export class AudioTestPane implements IContentRenderer{

    element = html.a`<div class=center_top_pane></div>`

    constructor(
        private audioContext: AudioContext,
        private target_wam: OValue<WebAudioModule|null>,
    ){}

    private chain: Promise<any> = Promise.resolve()
    private disposeof?: () => void
    private mediaSource?: MediaElementAudioSourceNode

    init(_: GroupPanelPartInitParameters): void {
        this.chain = this.chain.then(async()=>{

            const mediaPlayer = document.createElement("audio")
            mediaPlayer.controls = true
            // TODO replace by sound
            mediaPlayer.src = (await import("../assets/ash-planks.mp3?url").then(m=>m.default)) as string

            this.element.replaceChildren(mediaPlayer)

            const mediaSource = this.mediaSource = this.audioContext.createMediaElementSource(mediaPlayer)

            this.disposeof = this.target_wam.link(()=>{
                mediaSource.disconnect()
                if(this.target_wam.value!=null){
                    mediaSource.connect(this.target_wam.value.audioNode)
                }
                else mediaSource.connect(this.audioContext.destination)
            })   
        })    
    }

    dispose(): void {
        this.chain = this.chain.then(async()=>{
            this.disposeof?.()
            this.mediaSource?.disconnect()
        })
    }

}