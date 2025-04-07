import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core"
import { MOValue } from "../observable/collections/OValue.ts"
import { WebAudioModule } from "@webaudiomodules/api"
import { html } from "../utils/doc.ts"

export class WamLoaderComponent implements IContentRenderer{

    url = new MOValue("")

    wam = new MOValue(null as WebAudioModule|null)

    gui = new MOValue(null as HTMLElement|null)

    element = document.createElement("div")

    init(parameters: GroupPanelPartInitParameters): void {
        const label = html.a`<label>WAM URL</label>`
        const input = html.a`<input type="text" />`
        this.element.replaceChildren(label, input)
    }
    
}