import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { WamGUIGenerator } from "../WamGUIGenerator.ts";
import { OValue } from "../observable/collections/OValue.ts";

export class DebugPane implements IContentRenderer{

    readonly element = html.a`<div class=center_top_pane></div>`

    constructor(
        private gui_generator: OValue<WamGUIGenerator>,
    ){}

    init(_: GroupPanelPartInitParameters): void {
        const debug = this
        this.dispose = this.gui_generator.link(async()=>{
            
            const button = html.a`<button>Debug</button>`
            
            function fill(){
                debug.element.replaceChildren(html`
                    <span>Average Control Size: ${debug.gui_generator.value.calculateAverageControlSize()}</span>
                    ${button}
                `)
            }

            button.onclick = fill

            fill()
        })
    }

    declare dispose: ()=>void

}