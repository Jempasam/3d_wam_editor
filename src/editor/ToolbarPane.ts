import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core"
import { html } from "../utils/doc.ts"

export class ToolbarPane implements IContentRenderer{

    element = html.a`<ul class="toolbar"></ul>` as HTMLUListElement

    private buttons: Record<string,{ctrl?: boolean, shift?: boolean, alt?: boolean, index:number, action:(index:number)=>void}> = {}

    constructor(
        ...buttons: {
            icon: string, 
            label: string,
            shortcut?: {key:string, ctrl?: boolean, shift?: boolean, alt?: boolean}[],
            disabled?: boolean,
            description?: string,
            action: (index:number)=>void}[]
    ){
        let i=0
        for(let {icon,label,action,disabled,shortcut,description} of buttons){
            const shortcuts = (shortcut??[])
                .map(it=>{
                    let shortcut = ""
                    if(it.ctrl)shortcut += "Ctrl "
                    if(it.shift)shortcut += "Shift "
                    if(it.alt)shortcut += "Alt "
                    shortcut += it.key.length==1 ? it.key.toUpperCase() : it.key
                    return shortcut
                })
                .join(" or ")
            const button = html.a`
                <button class=tooltip_holder>
                    ${icon}
                    <div class="-tooltip">
                        ${label}
                        <span class="-shortcut">${shortcuts}</span>
                        <span class="-description">${description??""}</span>
                    </div>
                </button>
            `
            const li = html.a`<li>${button}</li>`
            li.classList.toggle("_disabled",!!disabled)
            button.addEventListener("click",()=>action(i))
            this.element.appendChild(li)
            i++
        }

        this.buttons = {}
        i=0
        for(const {action,shortcut} of buttons){
            for(let {key,alt,ctrl,shift} of shortcut??[]){
                this.buttons[key] = {ctrl,alt,shift,action,index:i}
            }
            i++
        }
    }

    setDisabled(index:number, isDisabled:boolean){
        this.element.children[index].classList.toggle("_disabled",isDisabled)
    }

    on_input = (event: KeyboardEvent)=>{
        const binding = this.buttons[event.key]
        if(!binding)return

        const {action,index,alt,ctrl,shift} = binding

        if(this.element.children[index].classList.contains("_disabled")) return

        if(ctrl && !event.ctrlKey) return
        if(shift && !event.shiftKey) return
        if(alt && !event.altKey) return

        action(index)
    }

    init(_: GroupPanelPartInitParameters): void {
        document.addEventListener("keydown",this.on_input)
    }

    dispose(): void {
        document.removeEventListener("keydown",this.on_input)
    }

}