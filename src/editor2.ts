import { createDockview, DockviewComponentOptions, IContentRenderer, themeAbyss } from "dockview-core"
import { WamLoaderPane } from "./editor/WamLoaderPane.ts"
import { initializeWamHost } from "@webaudiomodules/sdk"
import { WamGui3DPane } from "./editor/WamGui3DPane.ts"
import { WamEditorPane } from "./editor/WamEditorPane.ts"
import { ControlSelectorPane } from "./editor/ControlSelectorPane.ts"
import controls from "./control/controls.ts"
import { SettingsPane } from "./editor/SettingsPane.ts"
import { ToolbarPane } from "./editor/ToolbarPane.ts"
import { WamPadPane } from "./editor/WamPadPane.ts"
import { LoadSavePane } from "./editor/LoadSavePane.ts"
import { ControlLibrary } from "./WamGUIGenerator.ts"
import { MOValue } from "./observable/collections/OValue.ts"
import { Item } from "./control/ControlMap.ts"
import { ImagesPane } from "./editor/ImagesPane.ts"
import { DECORATION_IMAGES } from "./utils/visual/Decoration.ts"
import { CSettingsValues } from "./control/settings.ts"

let audioContext: AudioContext
let host: string

try{
    audioContext = new AudioContext()
    ;[host] = await initializeWamHost(audioContext)
}catch(e){
    console.error(e)
}

const wam_loader = new WamLoaderPane(host!!,audioContext!!)
const view_3d = new WamGui3DPane()
const editor = new WamEditorPane(wam_loader.wam, view_3d.container)
const selector = new ControlSelectorPane(controls)
const wampad = new WamPadPane(editor.gui_generator, wam_loader.wam, wam_loader.url)
const load_save = new LoadSavePane(editor.gui_generator, wam_loader.url, controls)
const images = new ImagesPane(DECORATION_IMAGES)


/* Settings */
const settings = new SettingsPane(()=>wam_loader.parameters_info)

let parameter_values = {} as CSettingsValues

selector.selected.observable.register(({to:selected})=>{
    if(selected){
        parameter_values = selected.control.getDefaultValues()
        settings.settings.value = {
            title: selected.control.label,
            settings: selected.control.getSettings(),
            getValue(label) {
                return parameter_values[label]
            },
            setValue(label, value) {
                parameter_values[label] = value
            },
        }
    }
})

editor.on_select.register(({infos})=>{
    const {control,values} = infos
    settings.settings.value = {
        title: control.factory.label,
        settings: control.factory.getSettings(),
        getValue(label) {
            return values[label]
        },    
        setValue(label, value) {
            const selecteds = [...editor.selector.selecteds].map(it=>editor.gui_generator.value.controls.values.indexOf(it.infos))
            for(const i of selecteds){
                editor.gui_generator.value.controls.setValue(i,label,value)
            }
        },
    }
})



function removeSelecteds(){
    const gui = editor.gui_generator.value

    for(const s of editor.selector.selecteds){
        const index = gui.controls.values.indexOf(s.infos)
        editor.gui_generator.value.controls.splice(index,1)
    }
}

function replaceSelecteds(){
    const control = selector.selected.value?.control; if(control==null)return
    const gui = editor.gui_generator.value
    const selecteds = [...editor.selector.selecteds]

    for(const s of selecteds){
        editor.selector.unselect(s)
        gui.controls.splice(gui.controls.values.indexOf(s.infos),1)
    }
    
    for(const s of selecteds){
        const {infos:{x,y,width,height,values}} = s
        gui.addControl({x,y,width,height,values,control})
        const e = gui.controls.get(gui.controls.length-1)
        editor.selector.select({element:e.container!!, infos:e})
    }
}

function rearrage(xl: keyof Readonly<Item>, yl:keyof Readonly<Item>, wl:keyof Readonly<Item>, hl:keyof Readonly<Item>){
    const gui = editor.gui_generator.value
    const selecteds = [...editor.selector.selecteds].sort((a,b)=>a.infos[xl]-b.infos[xl])
    const minx = Math.min(...selecteds .map(it=>it.infos[xl]))
    const maxx = Math.max(...selecteds .map(it=>it.infos[xl]+it.infos[wl]))
    const centery = selecteds .map(it=>it.infos[yl]+it.infos[hl]/2) .reduce((a,b)=>a+b,0) / selecteds.length
    const total_width = selecteds.map(it=>it.infos[wl]).reduce((a,b)=>a+b,0)
    const spacing = (maxx-minx-total_width)/(selecteds.length-1)

    let x = minx
    for(const s of selecteds){
        const index = gui.controls.values.indexOf(s.infos)
        const y = centery-s.infos[hl]/2
        const position = {x:0,y:0} as Item
        position[xl] = x
        position[yl] = y
        gui.controls.move(index, position.x, position.y)
        x += spacing + s.infos[wl]
    }
}

let clipboard = new MOValue<{x:number, y:number, width:number, height:number, values:any, control:ControlLibrary['key']}[]>([])
function copySelecteds(){
    clipboard.value = [...editor.selector.selecteds.values()]
        .map(({infos:{x,y,width,height,values,control}}) =>({
            x,y,width,height,
            values: structuredClone(values),
            control: control.factory
        }))
}

function pasteSelecteds(){
    editor.selector.selecteds = []
    for(const {x,y,width,height,values,control} of clipboard.value){
        editor.gui_generator.value.addControl({
            x,y,width,height,control,
            values: structuredClone(values)
        })
    }
}


/* Editor Toolbar */
const editor_toolbar = new ToolbarPane(
    {
        id:"add", icon:"+", label:"Add Control", description: "from the palette",
        shortcut: [{key:"a",ctrl:true}],
        action: (index)=>{
            const gui = editor.gui_generator.value
            const control = selector.selected.value?.control; if(!control) return
            gui.addControl({control, values:parameter_values, x:0, y:0, width:0.1, height:0.1})
        }
    },
    {
        id:"remove", icon:"×", label:"Remove Controls", description: "selecteds",
        shortcut: [{key:"Delete"},{key:"Backspace"},{key:"x",ctrl:true}],
        action:removeSelecteds
    },
    {
        id:"replace", icon:"R", label:"Replace Controls", description: "selecteds by ones from the palette",
        shortcut: [{key:"r",ctrl:true}],
        action:replaceSelecteds
    },
    {
        id:"copy", icon:"⿻", label:"Copy Controls",  description: "selecteds to the clipboard",
        shortcut: [{key:"c",ctrl:true}],
        action(){
            copySelecteds()
        }
    },
    {
        id:"cut", icon:"✂", label:"Cut Controls",  description: "selecteds to the clipboard",
        shortcut: [{key:"x",ctrl:true}],
        action(){
            copySelecteds()
            removeSelecteds()
        }
    },
    {
        id:"paste", icon:"📋︎", label:"Paste Controls",  description: "from the clipboard",
        shortcut: [{key:"v",ctrl:true}],
        action(){
            pasteSelecteds()
        }
    },
    "separator",
    {
        id:"rearrange_x", icon:"┉", label:"Realign horizontally", description:"selecteds",
        action(){ rearrage("x","y","width","height")}
    },
    {
        id:"rearrange_y", icon:"┋", label:"Realign vertically", description:"selecteds",
        action(){ rearrage("y","x","height","width")}
    }
)

selector.selected.link(({to:selected})=>{
    editor_toolbar.setDisabled("add", selected==null)
    editor_toolbar.setDisabled("replace", selected==null || editor.selector.selecteds.size==0)
    
})

function updateSelectionTargetButton(){
    const isDisabled = editor.selector.selecteds.size==0
    editor_toolbar.setDisabled("remove",isDisabled)
    editor_toolbar.setDisabled("cut",isDisabled)
    editor_toolbar.setDisabled("copy",isDisabled)
    editor_toolbar.setDisabled("replace", selector.selected.value==null || editor.selector.selecteds.size==0)

    const isDisabledMultitarget = editor.selector.selecteds.size<2
    editor_toolbar.setDisabled("rearrange_x",isDisabledMultitarget)
    editor_toolbar.setDisabled("rearrange_y",isDisabledMultitarget)
}
editor.on_select.register(updateSelectionTargetButton)
editor.on_unselect.register(updateSelectionTargetButton)
updateSelectionTargetButton()

clipboard.link(({to})=>{
    editor_toolbar.setDisabled("paste",to.length==0)
})

const components: Record<string,IContentRenderer> = {
    wam_loader, editor, view_3d, selector,
    settings, editor_toolbar, wampad, load_save,
    images
}

/* */
const container = document.getElementById("container")!!

const options: DockviewComponentOptions = {
    theme: themeAbyss,
    createComponent(options) {
        const c = components[options.name]
        if(!c)throw new Error(`Unknown component ${options.id}`)
        return c
    },
}

const api = createDockview(container, options)
/* */

const left = api.addGroup({ id:"left", direction: "right" })
const center = api.addGroup({ id:"center", direction:"right" })
const right = api.addGroup({ id:"right", direction:"right" })

api.addPanel({
    id: "selector",
    title: "Controls",
    component: "selector",
    position: {referenceGroup:"left"},
})

api.addPanel({
    id: "settings",
    title: "Settings",
    component: "settings",
    position: {referenceGroup:"left", direction:"below"},
    
})


api.addPanel({
    id: "editor_toolbar",
    title: "Editor Toolbar",
    component: "editor_toolbar",
    maximumHeight: 50,
    position: {referenceGroup:"center"},
})

api.addPanel({
    id: "editor",
    title: "Editor",
    component: "editor",
    position: {referenceGroup:"center", direction:"below"},
})


api.addPanel({
    id: "wam",
    title: "Web Audio Module",
    component: "wam_loader",
    position: {referenceGroup:"right"},
})

api.addPanel({
    id: "3d",
    title: "3D View",
    component: "view_3d",
    position: {referenceGroup:"right", direction:"below"},
})

api.addPanel({
    id: "wampad",
    title: "Pad",
    component: "wampad",
    position: {referencePanel:"wam", direction:"right"},
})

api.addPanel({
    id: "load_save",
    title: "Load/Save",
    component: "load_save",
    position: {referencePanel:"wam",direction:"within"},
})

api.addPanel({
    id: "images",
    title: "Images",
    component: "images",
    position: {referencePanel:"settings",direction:"within"},
})

api.fromJSON({"grid":{"root":{"type":"branch","data":[{"type":"branch","data":[{"type":"leaf","data":{"views":["selector"],"activeView":"selector","id":"left"},"size":386},{"type":"leaf","data":{"views":["settings","images"],"activeView":"settings","id":"1"},"size":385.20001220703125}],"size":384},{"type":"branch","data":[{"type":"leaf","data":{"views":["editor_toolbar"],"activeView":"editor_toolbar","id":"center"},"size":100},{"type":"leaf","data":{"views":["editor"],"activeView":"editor","id":"2"},"size":671.2000122070312}],"size":693.5999755859375},{"type":"branch","data":[{"type":"branch","data":[{"type":"branch","data":[{"type":"leaf","data":{"views":["wam"],"activeView":"wam","id":"right"},"size":193},{"type":"leaf","data":{"views":["load_save"],"activeView":"load_save","id":"5"},"size":193}],"size":225},{"type":"leaf","data":{"views":["wampad"],"activeView":"wampad","id":"4"},"size":233.4000244140625}],"size":386},{"type":"leaf","data":{"views":["3d"],"activeView":"3d","id":"3"},"size":385.20001220703125}],"size":458.4000244140625}],"size":771.2000122070312},"width":1536,"height":771.2000122070312,"orientation":"HORIZONTAL"},"panels":{"selector":{"id":"selector","contentComponent":"selector","title":"Controls"},"editor_toolbar":{"id":"editor_toolbar","contentComponent":"editor_toolbar","title":"Editor Toolbar","maximumHeight":50},"wam":{"id":"wam","contentComponent":"wam_loader","title":"Web Audio Module"},"settings":{"id":"settings","contentComponent":"settings","title":"Settings"},"images":{"id":"images","contentComponent":"images","title":"Images"},"editor":{"id":"editor","contentComponent":"editor","title":"Editor"},"3d":{"id":"3d","contentComponent":"view_3d","title":"3D View"},"wampad":{"id":"wampad","contentComponent":"wampad","title":"Pad"},"load_save":{"id":"load_save","contentComponent":"load_save","title":"Load/Save"}},"activeGroup":"center"})
document.addEventListener("keypress", event=>{
    console.log(event.key)
    if(event.key=="e"){
        console.log(JSON.stringify(api.toJSON()))
    }
})