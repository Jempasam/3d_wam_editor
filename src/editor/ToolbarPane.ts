import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core"
import { html } from "../utils/doc.ts"

export type ToolbarItem = 
    {
        id: string,
        icon: string, 
        label: string,
        shortcut?: {
            key:string,
            ctrl?: boolean,
            shift?: boolean,
            alt?: boolean
        }[],
        disabled?: boolean,
        description?: string,
        action: (index:string)=>void
    }
    | "separator"

export class ToolbarPane implements IContentRenderer{

    element = html.a`<ul class="toolbar"></ul>` as HTMLUListElement

    private button_elements = {} as Record<string,HTMLElement>

    private buttons: Record<string,{ctrl?: boolean, shift?: boolean, alt?: boolean, id:string, action:(index:string)=>void}> = {}

    constructor(
        ...items: ToolbarItem[]
    ){
        let i=0
        for(const item of items){
            if(item=="separator"){
                this.element.appendChild(html.a`<li><hr/></li>`)
            }
            else{
                const {id,icon,label,action,disabled,shortcut,description} = item
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
                button.addEventListener("click",()=>action(id))
                this.button_elements[id]=li
                this.element.appendChild(li)
            }
            i++
        }

        this.buttons = {}
        i=0
        for(const {action,shortcut,id} of items.filter(it=>typeof it == "object" && "action" in it)){
            for(let {key,alt,ctrl,shift} of shortcut??[]){
                this.buttons[key] = {ctrl,alt,shift,action,id}
            }
            i++
        }
    }

    setDisabled(id:string, isDisabled:boolean){
        this.button_elements[id].classList.toggle("_disabled",isDisabled)
    }

    on_input = (event: KeyboardEvent)=>{
        const binding = this.buttons[event.key]
        if(!binding)return

        const {action,id,alt,ctrl,shift} = binding

        if(this.button_elements[id].classList.contains("_disabled")) return

        if(ctrl && !event.ctrlKey) return
        if(shift && !event.shiftKey) return
        if(alt && !event.altKey) return

        action(id)
    }

    init(_: GroupPanelPartInitParameters): void {
        document.addEventListener("keydown",this.on_input)
    }

    dispose(): void {
        document.removeEventListener("keydown",this.on_input)
    }

}