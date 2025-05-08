import { DockviewApi } from "dockview-core"
import { html } from "../utils/doc.ts"

export type MenuBarConfig = {
    [label:string]: (()=>void)|MenuBarConfig
}

export class MenuBar{

    element

    constructor(
        config: MenuBarConfig,
    ){
        this.element = this.createMenu(config)
        this.element.classList.add("menubar")
    }

    createMenu(config: MenuBarConfig){
        const menu = document.createElement("ul")
        for(const key in config){
            const value = config[key]
            const li = html.a`<li><span>${key}</span></li>` as HTMLLIElement
            if(typeof value=="function"){
                li.onclick = (e)=>{
                    e.stopPropagation()
                    value()
                }
            }else{
                li.appendChild(this.createMenu(value))
            }
            menu.appendChild(li)
        }
        return menu
    }
}

export function menubarViewport(
    config: MenuBarConfig,
    dockview: DockviewApi,
    ids: string[],
    default_layout: any,
){
    const view_menu = {} as MenuBarConfig
    const save_layout_menu = {} as MenuBarConfig
    const load_layout_menu = {} as MenuBarConfig
    const layout_menu = {
        "Save": save_layout_menu,
        "Load": load_layout_menu,
    }

    for(const id of ids){
        let label = id
        label = label.replaceAll("_"," ") // Space
        label = label.charAt(0).toUpperCase() + label.slice(1) // Capitalize first letter
        label = label.replace(/ [a-z]/g,it=>it.toUpperCase())
        view_menu[label] = ()=>{
            dockview.addPanel({
                id,
                title: label,
                component: id,
            })
        }
    }

    const icons = "🔎 🖼️ ➕ 📜 🎛️ 🐽 👁️ ⚡".split(" ")
    for(const layout_icon of icons){
        save_layout_menu[`Save as ${layout_icon}`] = ()=>{
            localStorage.setItem(`3dwambuilder-layout-${layout_icon}`, JSON.stringify(dockview.toJSON()))
        }
    }

    load_layout_menu[`Load Default`] = ()=>{
        dockview.fromJSON(default_layout)
    }
    for(const layout_icon of icons){
        load_layout_menu[`Load ${layout_icon}`] = ()=>{
            const layout = JSON.parse(localStorage.getItem(`3dwambuilder-layout-${layout_icon}`)??"{}")
            if(layout){
                dockview.fromJSON(layout)
            }else{
                dockview.fromJSON(default_layout)
            }
        }
    }
    config["View"] = view_menu
    config["Layout"] = layout_menu
}