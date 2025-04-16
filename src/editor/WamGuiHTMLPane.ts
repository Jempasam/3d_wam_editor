import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";

export class WamGuiHTMLPane implements IContentRenderer{

    container = html.a`<div></div>`
    element = html.a`<div>${this.container}</div>`

    init(parameters: GroupPanelPartInitParameters): void {
        
    }

}