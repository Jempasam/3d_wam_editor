import { createDockview, DockviewComponentOptions, GroupPanelPartInitParameters, IContentRenderer, PanelUpdateEvent, Parameters, themeAbyss } from "dockview-core"
import { WamLoaderComponent } from "./editor/WamLoader.ts"

class Text implements IContentRenderer{

    element = document.createElement("div")

    init(parameters: GroupPanelPartInitParameters): void {
        this.element.innerHTML = "Hello World"
    }
    
}

const container = document.getElementById("container")!!
const options: DockviewComponentOptions = {
    theme: themeAbyss,
    createComponent(options) {
        switch(options.name){
            case "test": return new Text()
            case "wam": return new WamLoaderComponent()
            default:
                throw new Error(`Unknown component ${options.id}`)
        }
    },
}

const api = createDockview(container, options)

api.addPanel({
    id: "salade",
    component: "test",
})

api.addPanel({
    id: "wam",
    component: "wam",
    
})