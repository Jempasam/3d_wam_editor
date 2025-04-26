import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";

export class ImagesPane implements IContentRenderer{

    element = html.a`<div class=center_top_pane></div>`

    constructor(
        private images: Record<string,string>
    ){}

    init(_: GroupPanelPartInitParameters): void {
        const list = html.a`<ul class="item_selector _grid"></ul>`
        this.element.replaceChildren(list)
        
        for(let [key,url] of Object.entries(this.images)){
            let entry = list.appendChild(html.a`
                <li value="${key}">
                    <img class="-icon" src="${url}"/>
                    <span class="-label">${key}</span>
                </li>
            `)
            list.appendChild(entry)
        }
    }

}