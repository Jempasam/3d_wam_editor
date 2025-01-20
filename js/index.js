import { Engine } from "./babylonjs/core/Engines/engine.js"
import { MeshBuilder } from "./babylonjs/core/Meshes/meshBuilder.js"
import { Scene } from "./babylonjs/core/scene.js"
import "./babylonjs/core/Helpers/sceneHelpers.js"
import { Control } from "./control/Control.js"
import { ControlMap } from "./control/ControlMap.js"
import controls from "./control/controls.js"
import { ControlSettingsGUI } from "./control/settings.js"
import { Selector } from "./gui/Selector.js"
import { html } from "./utils/doc.js"
import { StandardMaterial } from "./babylonjs/core/Materials/standardMaterial.js"
import { Color3 } from "./babylonjs/core/Maths/math.color.js"
import { Vector3 } from "./babylonjs/core/Maths/math.vector.js"
import { ArcRotateCamera } from "./babylonjs/core/Cameras/arcRotateCamera.js"
import { Color4 } from "./babylonjs/core/Maths/math.color.js"
import { BackgroundMaterial } from "./babylonjs/core/Materials/Background/backgroundMaterial.js"
import { TransformNode } from "./babylonjs/core/Meshes/transformNode.js"
import { MOValue, OValue } from "./observable/collections/OValue.js"
import { listen_all } from "./observable/MultiListener.js"
import { VertexBuffer } from "./babylonjs/core/index.js"


/* 3D */
let canvas= /** @type {HTMLCanvasElement} */ (document.getElementById("3d_display"));
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
let indicator = document.querySelector(".indicator")
/**
 * @param {"valid"|"invalid"|"wait"|"none"} state 
 * @param {string} text
 */
function setIndicator(state,text){
    indicator.classList.remove("_valid","_invalid","_waiting")
    if(state=="valid") indicator.classList.add("_valid")
    if(state=="invalid") indicator.classList.add("_invalid")
    if(state=="wait") indicator.classList.add("_waiting")
    indicator.textContent=text
}


//// CONTEXT ////
let audioContext
let host
document.onclick=async ()=>{
    setIndicator("wait","Creating audio context")
    try{
        const { default: initializeWamHost } = await import("https://www.webaudiomodules.com/sdk/2.0.0-alpha.6/src/initializeWamHost.js")
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
let elem_wam_url = /** @type {HTMLTextAreaElement} */ (document.querySelector("#wam_url"))
let current_wam = null
let current_wam_instance = null
let current_wam_ui = null
let current_wam_parameters = null
async function setWam(url){

    // Remove old WAM
    if(current_wam!=null){
        current_wam_ui.remove()
        current_wam_instance.destroyGui(current_wam_ui)
    }

    // Load new WAM
    setIndicator("wait","Loading the WAM")
    try{
        current_wam = (await import(url))?.default
        current_wam_instance = await current_wam.createInstance(host,audioContext)
        current_wam_ui = await current_wam_instance.createGui()
        document.querySelector("#wam_holder").replaceChildren(current_wam_ui)
        elem_wam_url.value=url
        setIndicator("valid","WAM loaded")
    }catch(e){
        setIndicator("invalid","Error loading the WAM")
        console.error(e)
    }

    // Load parameters
    current_wam_parameters = current_wam_instance==null ? {} : await current_wam_instance.audioNode.getParameterInfo();
    parameter_list.replaceChildren()
    for(let [id,info] of Object.entries(current_wam_parameters)){
        parameter_list.appendChild(html`<option value="${id}">${info.label??info.id}</option>`)
    }
    if(parameter_list.options.length>0)selectParam(parameter_list.options[0].value)
    
}
elem_wam_url.onchange= () => setWam(elem_wam_url.value) 


//// PARAMETER LIST ////
let parameter_list= /** @type {HTMLSelectElement} */ (document.querySelector("#parameters"))
async function selectParam(id){
    let value = (await current_wam_instance.audioNode.getParameterValues(false,id))[id]
    let info = (await current_wam_instance.audioNode.getParameterInfo(id))[id]
    console.log(value)
    if(info){
        console.log(info)
        for(let [key,value] of Object.entries(info)){
            console.log(key,value)
            const elem = document.querySelector(`#parameter_${key}`)
            if(elem) elem.textContent=value
        }
        document.querySelector("#parameter_value").textContent=value.value
    }
}
parameter_list.onchange=()=>selectParam(parameter_list.value)


//// WAM BASE ////
const aspect_ratio = new MOValue(1)
const top_color = new MOValue("#aa4444")
const bottom_color = new MOValue("#cc8888")
const wampad = /** @type {HTMLElement} */ (document.querySelector("#wampad"))


// Link inputs and visual to values
;(()=>{
    const aspect_ratio_input = /** @type {HTMLInputElement} */ (document.querySelector("#aspect_ratio"))
    const top_color_input = /** @type {HTMLInputElement} */ (document.querySelector("#top_color"))
    const bottom_color_input = /** @type {HTMLInputElement} */ (document.querySelector("#bottom_color"))
    
    aspect_ratio_input.oninput = ()=>{ aspect_ratio.value = parseFloat(document.querySelector("#aspect_ratio").value) ?? 1 }
    top_color_input.oninput = ()=>{ top_color.value = document.querySelector("#top_color").value }
    bottom_color_input.oninput = ()=>{ bottom_color.value = document.querySelector("#bottom_color").value }

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
const elem_control_list = document.querySelector("#controls_list")
/** @type {{key:string, control:typeof Control}|null} */  let selected_control = null

function setControl(key){
    let options = elem_control_list.querySelectorAll(":scope > *")
    if(controls[key]){
        const control = controls[key]
        selected_control = {key, control}
        options.forEach( it => it.classList.remove("selected"))
        elem_control_list.querySelector(`option[value="${key}"]`).classList.add("selected")
        showSelectedControlSettings()
        // TODO setControlSettings(controls[key].getSettings())
    }
}

function showSelectedControlSettings(){
    if(selected_control){
        control_values=selected_control.control.getDefaultValues()
        setControlSettings(
            selected_control.control.getSettings(),
            (label) => control_values[label],
            (label,value) => control_values[label]=value
        )
    }
    else setControlSettings(undefined)
}

for(let [key,control] of Object.entries(controls)){
    let example = new control(null)
    let element = example.createElement()
    let option = elem_control_list.appendChild(html.a`<option value="${key}">${element}</option>`)
    example.setDefaultValues()
    option.onclick=()=>setControl(key)
}


//// CONTROL SETTINGS ////
const elem_settings = document.querySelector("#settings")
let control_values = {}

/**
 * @param {import("./control/Control.js").ControlSettings|null} settings
 * @param {(label:string)=>string|undefined} getValue
 * @param {(label:string,value:string)=>void} setValue
 **/
function setControlSettings(settings, getValue= ()=>undefined, setValue = ()=>{}){
    if(settings){
        let gui = new ControlSettingsGUI(settings,current_wam_parameters??{})
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
const gui_container = /** @type {HTMLElement} */ (document.querySelector("#gui_container"))
const add_control = /** @type {HTMLButtonElement} */ (document.querySelector("#add_control"))
gui_container.style.position="relative"
const controls_map = new ControlMap(gui_container, node_container)
controls_map.on_add = function(item){
    const {control,container} = item
    container.onmousedown=/** @type {MouseEvent} */  (e)=>{
        e.stopPropagation()
        if(e.shiftKey) selector.select({element:container, infos:item})
        else selector.selecteds = [{element:container, infos:item}]
        selector.transformer?.startMoving(e.pageX,e.pageY)
    }
}
controls_map.on_remove = function(item){
    const {control,container} = item
    for(const s of selector.selecteds) if(s.infos==item) selector.unselect(s)
}


//// SAVE ////
const save_text_area = /** @type {HTMLTextAreaElement} */ (document.querySelector("#save_data"))
save_text_area.onfocus = ()=>{
    const wam_code = {
        top_color: top_color.value,
        bottom_color: bottom_color.value,
        aspect_ratio: aspect_ratio.value,
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
    for(let control_data of wam_code.controls??[]){
        const {control, values, x, y, width, height} = control_data
        const type = controls[control]
        if(control===undefined) continue
        controls_map.splice(controls_map.length,0,{
            control: new type(current_wam_instance),
            x: x??0, y: y??0, width: width??0.1, height: height??0.1,
            values: values??type.getDefaultValues()
        })
    }
}


//// Selector and Transformer ////
/** @type {Selector<{element:HTMLElement,infos:ReturnType<ControlMap['get']>}>} */
let selector = new Selector(it=>it.infos, gui_container)

function unselectall(e){
    console.log("aa")
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
    const settings = selection.infos.control.constructor.getSettings()
    setControlSettings(
        settings,
        (label) => selection.infos.control.getValue(label),
        (label,value) => {
            for(const {infos:{control}} of selector.selecteds){
                const index = controls_map.values.findIndex(it=>it.control==control)
                controls_map.setValue(index,label,value)
            }
        }
    )
}

selector.on_unselect = selection=>{
    if(selector.selecteds.size==0){
        showSelectedControlSettings()
    }
}


add_control.onclick=()=>{
    if(selected_control){
        const control = new selected_control.control(current_wam_instance)
        controls_map.splice(controls_map.length, 0, {control, values:control_values, x:0, y:0, width:0.1, height:0.1})
    }
}


//// REMOVE, COPY, PASTE ////
/** @type {{x:number,y:number,width:number,height:number,control:typeof Control,values:any}[]} */  let copied = []
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
                ...selector.selecteds.values()
                .map(({infos})=>({x:infos.x+0.02, y:infos.y+0.02, width:infos.width, height:infos.height, values:{...infos.values}, control:infos.control.constructor}))
            ]
            break
        case "v":
            let first = controls_map.length
            let count = copied.length
            for(const {x,y,width,height,values,control} of copied){
                console.log(copied,values)
                const control_instance = new control(current_wam_instance)
                controls_map.splice(controls_map.length, 0, {control:control_instance, values, x, y, width, height})
            }
            selector.selecteds = [...controls_map.values].slice(first,first+count).map(infos=>({element:infos.container, infos}))
            break
    }
})