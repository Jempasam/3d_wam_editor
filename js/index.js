// import { Engine, MeshBuilder, Scene } from "./babylonjs/core/index.js";

import { Control } from "./control/Control.js"
import controls from "./control/controls.js"
import { html } from "./utils/doc.js"


// let canvas= /** @type {HTMLCanvasElement} */ (document.getElementById("game"));
// let ctx= canvas.getContext("webgl2");
// let engine= new Engine(ctx);
// let scene= new Scene(engine);
// scene.createDefaultLight();
// scene.createDefaultCamera(true, true, true);
// scene.createDefaultEnvironment();

// const box = MeshBuilder.CreateBox("box", {size: 2}, scene);
// box.rotation.x = Math.PI / 4;
// box.rotation.y = Math.PI / 4;

// engine.runRenderLoop(()=>scene.render());


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
    controls: []
}
function updateWamBase(){
    let [width,height] = wam_gui.aspect_ratio>1 ? [1,1/wam_gui.aspect_ratio] : [wam_gui.aspect_ratio,1]
    wampad.style.width = `${Math.floor(90*width)}%`
    wampad.style.height = `${Math.floor(90*height)}%`
    wampad.style.marginLeft = `${Math.floor(5+45*(1-width))}%`
    wampad.style.marginTop = `${Math.floor(5+45*(1-height))}%`
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
let selected_control = null
let selected_control_key = null

function setControl(key){
    let options = elem_control_list.querySelectorAll(":scope > *")
    if(controls[key]){
        selected_control = controls[key]
        selected_control_key = key
        options.forEach( it => it.classList.remove("selected"))
        elem_control_list.querySelector(`option[value="${key}"]`).classList.add("selected")
        setControlSettings(controls[key].getSettings())
    }
}

for(let [key,control] of Object.entries(controls)){
    let example = new control(null)
    let option = elem_control_list.appendChild(html.a`<option value="${key}">${example}</option>`)
    option.onclick=()=>setControl(key)
}


//// CONTROL SETTINGS ////
const elem_settings = document.querySelector("#settings")
let control_settings = {}
let control_values = {}

function setValue(label,value){
    control_values[label] = value
}

/** @param {import("./control/Control.js").ControlSettings|null} settings */
function setControlSettings(settings,default_values={}){
    elem_settings.replaceChildren()
    control_values = {}

    if(settings){
        for(let [label,type] of Object.entries(settings)){
            let element
            let value=""
            
            if(type=="color"){
                value = default_values[label]??"#ffffff"
                element = html.a`<input type="color" value="${value}">`
                element.oninput = ()=> setValue(label,element.value)
            }
            else if(type=="text"){
                value = default_values[label]??"Text"
                element = html.a`<input type="text" value="${value}">`
                element.oninput = ()=> setValue(label,element.value)
            }
            else if(Array.isArray(type)){
                value = default_values[label]??type[0]
                element = html.a`<input type="range" min="${type[0]}" step="${(type[1]-type[0])/100}" max="${type[1]}" value="${value}">`
                element.oninput = ()=> setValue(label,element.value)
            }
            else if(typeof type == "object" && "min" in type){
                value = default_values[label]??type.min
                element = html.a`<input type="range" min="${type.min}" step="${type.step}" max="${type.max}" value="${value}">`
                element.oninput = ()=> setValue(label,element.value)
            }
            else if(type=="choice_parameter" || type=="value_parameter"){
                if(current_wam_parameters){
                    value = default_values[label]??null
                    element = html.a`<select></select>`
                    for(let [id,info] of Object.entries(current_wam_parameters)){
                        if(value==null) value = id
                        console.log(info)
                        if(type=="choice_parameter" && info.type!="choice") continue
                        if(type=="value_parameter" && info.type!="float") continue
                        let option = html.a`<option>${info.label??info.id}</option>`
                        option.onchange = ()=> setValue(label,id)
                        element.appendChild(option)
                    }
                }
            }
            else element = html.a`<span style="color:red;">Unsupported Setting</span>`

            control_values[label] = value
            elem_settings.appendChild(html`<label>${label}</label>${element}`)
        }
    }
}


//// SAVE ////
const save_text_area = /** @type {HTMLTextAreaElement} */ (document.querySelector("#save_data"))
save_text_area.onchange=()=>{
    try{
        wam_gui = JSON.parse(save_text_area.value)
        updateControls()
    }catch(e){
        console.error(e)
    }
}



//// CONTROLS ////
const gui_container = /** @type {HTMLElement} */ (document.querySelector("#gui_container"))
const add_control = /** @type {HTMLButtonElement} */ (document.querySelector("#add_control"))
let added_controls = /** @type {Control[]} */ ([])
let added_containers = /** @type {HTMLElement[]} */ ([])
let selected_gui_control = null
gui_container.style.position="relative"

function updateControls(){
    // Cleanup
    for(let control of added_controls) control.destroy(current_wam_instance)
    while(gui_container.children.length>1) gui_container.lastChild.remove()

    // Controls
    save_text_area.innerText = JSON.stringify(wam_gui)
    for(let control_info of wam_gui.controls){
        let control_type= controls[control_info.key]
        let values = control_info.values
        let [x,y] = control_info.position
        let [width,height] = control_info.dimensions
        let control_element = new control_type(current_wam_instance)
        for(let [label,value] of Object.entries(values)){
            control_element.setValue(label,value)
        }
        let container = html.a`<div>${control_element}</div>`
        container.style.position="absolute"
        container.style.left = `${x*100}%`
        container.style.top = `${y*100}%`
        container.style.width = `${width*100}%`
        container.style.height = `${height*100}%`
        
        container.onmousedown=()=>{
            for(let control of added_containers) control.classList.remove("selected")
            container.classList.toggle("selected")
            selected_gui_control = control_info
        }
        container.draggable=true
        container.ondragstart=(e)=>{
            e.dataTransfer.effectAllowed = "move";
            let rect = gui_container.getBoundingClientRect()
            let x = e.clientX-rect.left
            let y = e.clientY-rect.top
            e.dataTransfer.setData("position", JSON.stringify([x,y]));
            e.dataTransfer.setData("text/plain", JSON.stringify(control_info));
        }
        container.ondragend = (e)=>{
            let rect = gui_container.getBoundingClientRect()
            let x = e.clientX-rect.left
            let y = e.clientY-rect.top
            let [xx,yy] = JSON.parse(e.dataTransfer.getData("position"))
            control_info.position[0] += (x-xx)/rect.width
            control_info.position[1] += (y-yy)/rect.height
            if (control_info.position[0]<0) control_info.position[0]=0
            if (control_info.position[1]<0) control_info.position[1]=0
            if (control_info.position[0]+control_info.dimensions[0]>1) control_info.position[0]=1-control_info.dimensions[0]
            if (control_info.position[1]+control_info.dimensions[1]>1) control_info.position[1]=1-control_info.dimensions[1]
            updateControls()
        }
        container.onwheel = (e)=>{
            e.preventDefault()
            if(e.deltaY<0){
                control_info.position[0] -= control_info.dimensions[0]*0.05
                control_info.position[1] -= control_info.dimensions[1]*0.05
                control_info.dimensions[0]*=1.1
                control_info.dimensions[1]*=1.1
            }
            else{
                control_info.position[0] += control_info.dimensions[0]*0.05
                control_info.position[1] += control_info.dimensions[1]*0.05
                control_info.dimensions[0]*=0.9
                control_info.dimensions[1]*=0.9
            }
            if (control_info.dimensions[0]<0.05) control_info.dimensions[0]=0.05
            if (control_info.dimensions[1]<0.05) control_info.dimensions[1]=0.05
            if (control_info.dimensions[0]>1) control_info.dimensions[0]=1
            if (control_info.dimensions[1]>1) control_info.dimensions[1]=1
            if (control_info.position[0]<0) control_info.position[0]=0
            if (control_info.position[1]<0) control_info.position[1]=0
            if (control_info.position[0]+control_info.dimensions[0]>1) control_info.position[0]=1-control_info.dimensions[0]
            if (control_info.position[1]+control_info.dimensions[1]>1) control_info.position[1]=1-control_info.dimensions[1]
            updateControls()
        }
        
        added_controls.push(control_element)
        added_containers.push(container)
        gui_container.appendChild(container)
    }
}

add_control.onclick=()=>{
    if(selected_control){
        wam_gui.controls.push({key:selected_control_key, values:control_values, position:[0,0], dimensions:[0.1,0.1]})
        updateControls()
    }
}

updateWamBase()
