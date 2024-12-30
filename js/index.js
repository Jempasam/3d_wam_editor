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
wampad3d.material = new StandardMaterial("mat", scene)
wampad3d.material.diffuseColor = new Color3(1, 0, 0)
wampad3d.material.specularColor = new Color3(0, 0, 0)

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
const wampad = /** @type {HTMLElement} */ (document.querySelector("#wampad"))
let wam_gui={
    aspect_ratio: 1,
    top_color: "#000000",
    bottom_color: "#ffffff",
}
function updateWamBase(){
    let [width,height] = wam_gui.aspect_ratio>1 ? [1,1/wam_gui.aspect_ratio] : [wam_gui.aspect_ratio,1]
    wampad.style.width = `${Math.floor(100*width)}%`
    wampad.style.height = `${Math.floor(100*height)}%`
    wampad.style.marginLeft = `${Math.floor(50*(1-width))}%`
    wampad.style.marginTop = `${Math.floor(50*(1-height))}%`
    wampad.style.backgroundImage = `linear-gradient(${wam_gui.top_color},${wam_gui.bottom_color})`
    save_text_area.value = JSON.stringify(wam_gui)
}

document.querySelector("#aspect_ratio").oninput=()=>{
    wam_gui.aspect_ratio = parseFloat(document.querySelector("#aspect_ratio").value) ?? 1
    updateWamBase()
}
document.querySelector("#top_color").oninput=()=>{
    wam_gui.top_color = document.querySelector("#top_color").value
    updateWamBase()
}

document.querySelector("#bottom_color").oninput=()=>{
    wam_gui.bottom_color = document.querySelector("#bottom_color").value
    updateWamBase()
}


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


//// SAVE ////
const save_text_area = /** @type {HTMLTextAreaElement} */ (document.querySelector("#save_data"))
save_text_area.onchange=()=>{
    try{
        wam_gui = JSON.parse(save_text_area.value)
    }catch(e){
        console.error(e)
    }
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


updateWamBase()