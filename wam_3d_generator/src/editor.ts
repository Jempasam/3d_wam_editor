import { ArcRotateCamera, BackgroundMaterial, Color3, Color4, Engine, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3, VertexBuffer } from "@babylonjs/core";
import { initializeWamHost } from "@webaudiomodules/sdk";
import { MOValue } from "./observable/collections/OValue.ts";
import { WamParameterInfoMap, WebAudioModule } from "@webaudiomodules/api";
import { html } from "./utils/doc.ts";
import { ControlMap } from "./control/ControlMap.ts";
import { Selector } from "./gui/Selector.ts";
import { ControlSettings, ControlSettingsGUI } from "./control/settings.ts";
import controls from "./control/controls.ts";
import { Control } from "./control/Control.ts";

/* 3D */
let canvas= (document.getElementById("3d_display") as HTMLCanvasElement);
let ctx= canvas.getContext("webgl2");
let engine= new Engine(ctx);
let scene= new Scene(engine);
scene.createDefaultLight();
scene.clearColor = new Color4(0,0,0,0)

const camera = new ArcRotateCamera("camera", -Math.PI/2, 0, 1.7, new Vector3(0,0,0),scene);
camera.wheelPrecision = 100
camera.attachControl()
camera.setTarget(Vector3.Zero())

const wampad3d = MeshBuilder.CreateBox("box", {size: 1., height:.1}, scene)
const wampad3dMaterial = wampad3d.material = new StandardMaterial("mat", scene)
wampad3dMaterial.diffuseColor = new Color3(1, 1, 1)
wampad3dMaterial.specularColor = new Color3(0, 0, 0)

const node_container = new TransformNode("node_container", scene)

document.addEventListener("keypress",(event)=>{
    console.log("lala",event.key)
    switch(event.key){
        case "z": node_container.position.x+=0.1; break
        case "s": node_container.position.x-=0.1; break
        case "q": node_container.position.z-=0.1; break
        case "d": node_container.position.z+=0.1; break
    }
})

const ground = MeshBuilder.CreateGround("ground", {width: 2, height: 2}, scene);
ground.material = new BackgroundMaterial("ground_mat", scene);
//MeshBuilder.CreatePlane("plane",{size:100},scene)

engine.runRenderLoop(()=>scene.render());


//// INDICATOR ////
let indicator = document.querySelector(".indicator")!!
function setIndicator(state: "valid"|"invalid"|"wait"|"none", text: string){
    indicator.classList.remove("_valid","_invalid","_waiting")
    if(state=="valid") indicator.classList.add("_valid")
    if(state=="invalid") indicator.classList.add("_invalid")
    if(state=="wait") indicator.classList.add("_waiting")
    indicator.textContent=text
}


//// CONTEXT ////
let audioContext: AudioContext
let host: string
document.onclick=async ()=>{
    setIndicator("wait","Creating audio context")
    try{
        audioContext = new AudioContext()
        ;[host] = await initializeWamHost(audioContext)
        setIndicator("valid","Audio context created")
    }catch(e){
        setIndicator("invalid","Failed to create audio context")
        console.error(e)
    }
    document.onclick=null
}


//// CURRENT WAM ////
let current_wam: {
    type: typeof WebAudioModule,
    instance: WebAudioModule,
    gui: Element,
    parameters: WamParameterInfoMap,
}|null = null

const current_wam_url = new MOValue("")

let current_wam_url_element = document.querySelector<HTMLTextAreaElement>("#wam_url")!!
current_wam_url.observable.add(async({to})=>{
    current_wam_url_element.value = to

    // Remove old WAM
    if(current_wam!=null){
        current_wam.gui.remove()
        current_wam.instance.destroyGui(current_wam.gui)
    }

    // Load new WAM
    setIndicator("wait","Loading the WAM")
    try{
        let type = (await import(to))?.default as typeof WebAudioModule
        let instance = await type.createInstance(host,audioContext)
        let gui = await instance.createGui()

        let parameters = await instance.audioNode.getParameterInfo()
        parameter_list.replaceChildren()
        for(let [id,info] of Object.entries(parameters)){
            parameter_list.appendChild(html`<option value="${id}">${info.label??info.id}</option>`)
        }
        if(parameter_list.options.length>0)selectParam(parameter_list.options[0].value)

        document.querySelector("#wam_holder")?.replaceChildren(gui)
        current_wam = {type, instance, gui, parameters}
        setIndicator("valid","WAM loaded")
    }catch(e){
        setIndicator("invalid","Error loading the WAM")
        console.error(e)
    }
})

current_wam_url_element.onchange= () => current_wam_url.value = current_wam_url_element.value


//// PARAMETER LIST ////
let parameter_list= (document.querySelector("#parameters") as HTMLSelectElement)
async function selectParam(id: string){
    if(current_wam==null) return
    let value = (await current_wam.instance.audioNode.getParameterValues(false,id))[id]
    let info = (await current_wam.instance.audioNode.getParameterInfo(id))[id]
    console.log(value)
    if(info){
        console.log(info)
        for(let [key,value] of Object.entries(info)){
            console.log(key,value)
            const elem = document.querySelector(`#parameter_${key}`)
            if(elem) elem.textContent=value
        }
        document.querySelector("#parameter_value")!!.textContent = value.value.toString()
    }
}
parameter_list.onchange=()=>selectParam(parameter_list.value)


//// WAM BASE ////
const aspect_ratio = new MOValue(1)
const top_color = new MOValue("#aa4444")
const bottom_color = new MOValue("#cc8888")
const wampad = (document.querySelector("#wampad") as HTMLElement)


// Link inputs and visual to values
;(()=>{
    const aspect_ratio_input = (document.querySelector("#aspect_ratio") as HTMLInputElement)
    const top_color_input = (document.querySelector("#top_color") as HTMLInputElement)
    const bottom_color_input = (document.querySelector("#bottom_color") as HTMLInputElement)
    
    aspect_ratio_input.oninput = ()=>{ aspect_ratio.value = parseFloat(document.querySelector<HTMLInputElement>("#aspect_ratio")!!.value) ?? 1 }
    top_color_input.oninput = ()=>{ top_color.value = document.querySelector<HTMLInputElement>("#top_color")!!.value }
    bottom_color_input.oninput = ()=>{ bottom_color.value = document.querySelector<HTMLInputElement>("#bottom_color")!!.value }

    aspect_ratio.link(({to})=>{
        let [width,height] = to>1 ? [1,1/to] : [to,1]
        wampad.style.width = `${Math.floor(100*width)}%`
        wampad.style.height = `${Math.floor(100*height)}%`
        wampad.style.marginLeft = `${Math.floor(50*(1-width))}%`
        wampad.style.marginTop = `${Math.floor(50*(1-height))}%`
        wampad3d.scaling = new Vector3(width,1,height)
        aspect_ratio_input.value = to.toString()
    })
    
    for(const it of [top_color,bottom_color]) it.link(()=>{
        wampad.style.backgroundImage = `linear-gradient(${top_color.value},${bottom_color.value})`
        const bottom = Color4.FromHexString(bottom_color.value).asArray()
        const top = Color4.FromHexString(top_color.value).asArray()
        wampad3d.setVerticesData(VertexBuffer.ColorKind,[
            ...top, ...top, ...top, ...top,
            ...bottom, ...bottom, ...bottom, ...bottom,
            ...bottom, ...bottom, ...top, ...top,
            ...top, ...top, ...bottom, ...bottom,
            ...top, ...bottom, ...bottom, ...top,
            ...bottom, ...top, ...top, ...bottom
        ])
        top_color_input.value = top_color.value
        bottom_color_input.value = bottom_color.value
    })
    
})()


//// CONTROL LIST ////
const elem_control_list = document.querySelector("#controls_list")!!
let selected_control: {key:string, control:typeof Control}|null = null

function setControl(key: string){
    let options = elem_control_list.querySelectorAll(":scope > *")
    if(controls[key]){
        const control = controls[key]
        selected_control = {key, control}
        options.forEach( it => it.classList.remove("selected"))
        elem_control_list.querySelector(`option[value="${key}"]`)!!.classList.add("selected")
        showSelectedControlSettings()
        // TODO setControlSettings(controls[key].getSettings())
    }
}

function showSelectedControlSettings(){
    if(selected_control){
        control_values = selected_control.control.getDefaultValues()
        setControlSettings(
            selected_control.control.getSettings(),
            (label) => control_values[label],
            (label,value) => control_values[label]=value
        )
    }
    else setControlSettings(null)
}

for(let [key,control] of Object.entries(controls)){
    let example = new control(null)
    let element = example.createElement()
    let option = elem_control_list.appendChild(html.a`<option value="${key}">${element}</option>`)
    example.setDefaultValues()
    option.onclick=()=>setControl(key)
}


//// CONTROL SETTINGS ////
const elem_settings = document.querySelector("#settings")!!
let control_values: Record<string,string> = {}

function setControlSettings(
    settings: ControlSettings|null, 
    getValue = (label:string)=>(undefined as string|undefined),
    setValue = (label:string, value:string)=>{}
){
    if(settings){
        let gui = new ControlSettingsGUI(settings,current_wam?.parameters??{})
        for(let [label,value] of Object.entries(settings)){
            const value = getValue(label)
            if(value!=undefined) gui.setValue(label,value)
        }
        gui.on_value_change = (label,value)=> setValue(label,value)
        elem_settings.replaceChildren(gui.element)
    }
    else elem_settings.replaceChildren()
}



//// CONTROLS ////
const gui_container = (document.querySelector("#gui_container") as HTMLElement)
const add_control = (document.querySelector("#add_control") as HTMLButtonElement)
gui_container.style.position="relative"
const controls_map = new ControlMap(gui_container, node_container)
controls_map.on_add = function(item){
    const {control,container} = item
    if(!container)return
    container.onmousedown = (e: MouseEvent)=>{
        e.stopPropagation()
        if(e.shiftKey) selector.select({element:container, infos:item})
        else selector.selecteds = [{element:container, infos:item}]
        selector.transformer?.startMoving(e.pageX,e.pageY)
    }
}
controls_map.on_remove = function(item){
    for(const s of selector.selecteds) if(s.infos==item) selector.unselect(s)
}


//// SAVE ////
const save_text_area = (document.querySelector("#save_data") as HTMLTextAreaElement)
save_text_area.onfocus = ()=>{
    const wam_code = {
        top_color: top_color.value,
        bottom_color: bottom_color.value,
        aspect_ratio: aspect_ratio.value,
        wam_url: current_wam_url.value,
        controls: controls_map.values.map(({control,values,x,y,width,height})=>({
            control: Object.keys(controls).find(key=>controls[key]==control.constructor),
            values, x, y, width, height
        }))
    }
    save_text_area.value = JSON.stringify(wam_code)
}
save_text_area.onchange = ()=>{
    const wam_code = JSON.parse(save_text_area.value)
    top_color.value = wam_code.top_color
    bottom_color.value = wam_code.bottom_color
    aspect_ratio.value = wam_code.aspect_ratio
    current_wam_url.value = wam_code.wam_url
    for(let control_data of wam_code.controls??[]){
        const {control, values, x, y, width, height} = control_data
        const type = controls[control]
        if(control===undefined) continue
        controls_map.splice(controls_map.length,0,{
            control: new type(current_wam?.instance??null),
            x: x??0, y: y??0, width: width??0.1, height: height??0.1,
            values: values??type.getDefaultValues()
        })
    }
}


//// Selector and Transformer ////
let selector = new Selector<{element:HTMLElement,infos:ReturnType<ControlMap['get']>}>(it=>it.infos, gui_container)

function unselectall(e: MouseEvent){
    if(e.target==e.currentTarget) selector.unselect_all()
}
gui_container.addEventListener("mousedown",unselectall)
wampad.addEventListener("mousedown",unselectall)

selector.on_move = (moved, x,y, width,height)=>{
    const index = controls_map.values.indexOf(moved.infos)
    controls_map.move(index,x,y)
    controls_map.resize(index,width,height)
}

selector.on_select = selection=>{
    const settings = selection.infos.control.factory.getSettings()
    setControlSettings(
        settings,
        (label: string) => selection.infos.control.getValue(label),
        (label,value) => {
            for(const {infos:{control}} of selector.selecteds){
                const index = controls_map.values.findIndex(it=>it.control==control)
                controls_map.setValue(index,label,value)
            }
        }
    )
}

selector.on_unselect = (selection)=>{
    if(selector.selecteds.size==0){
        showSelectedControlSettings()
    }
}


add_control.onclick=()=>{
    if(selected_control){
        //@ts-ignore
        const control = new selected_control.control(current_wam?.instance) as Control
        controls_map.splice(controls_map.length, 0, {control, values:control_values, x:0, y:0, width:0.1, height:0.1})
    }
}


//// REMOVE, COPY, PASTE ////
let copied: {x:number, y:number, width:number, height:number, control:typeof Control, values:Record<string,string>}[] = []
document.addEventListener("keydown",e=>{
    if(document.activeElement!=document.body) return
    console.log(e.key)
    switch(e.key){
        case "Delete":
        case "Backspace":
            for(const {infos} of [...selector.selecteds]){
                const index = controls_map.values.indexOf(infos)
                controls_map.splice(index,1)
            }
            break
        case "c":
            copied = [
                ...[...selector.selecteds.values()]
                .map(({infos})=>({x:infos.x+0.02, y:infos.y+0.02, width:infos.width, height:infos.height, values:{...infos.values}, control:infos.control.factory}))
            ]
            break
        case "v":
            let first = controls_map.length
            let count = copied.length
            for(const {x,y,width,height,values,control} of copied){
                console.log(copied,values)
                // @ts-ignore
                const control_instance = new control(current_wam.instance)
                controls_map.splice(controls_map.length, 0, {control:control_instance, values, x, y, width, height})
            }
            selector.selecteds = [...controls_map.values].slice(first,first+count).map(infos=>({element:infos.container!!, infos}))
            break
    }
})