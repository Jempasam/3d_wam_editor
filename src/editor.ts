import { ArcRotateCamera, BackgroundMaterial, Color4, Engine, MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { WamParameterInfoMap, WebAudioModule } from "@webaudiomodules/api";
import { initializeWamHost } from "@webaudiomodules/sdk";
import { Control, ControlContext } from "./control/Control.ts";
import { ControlMap } from "./control/ControlMap.ts";
import controls from "./control/controls.ts";
import { ControlSettings, ControlSettingsGUI } from "./control/settings.ts";
import { Selector } from "./gui/Selector.ts";
import { MOValue } from "./observable/collections/OValue.ts";
import { html } from "./utils/doc.ts";
import { ControlLibrary, WamGUICode, WamGUIGenerator, WAMGuiInitCode, WamPadShape } from "./WamGUIGenerator.ts";
import examples from "./examples.json";

async function main(){
    
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

    const node_container = new TransformNode("node_container", scene)

    document.addEventListener("keypress",(event)=>{
        switch(event.key){
            case "z": node_container.position.x+=0.1; break
            case "s": node_container.position.x-=0.1; break
            case "q": node_container.position.z-=0.1; break
            case "d": node_container.position.z+=0.1; break
        }
    })

    const ground = MeshBuilder.CreateGround("ground", {width: 2, height: 2}, scene);
    ground.material = new BackgroundMaterial("ground_mat", scene);

    engine.runRenderLoop(()=>scene.render());


    /* 2D */


    //// INPUTS ////
    const iAspectRatio = document.querySelector<HTMLInputElement>("#aspect_ratio")!!
    const iSize = document.querySelector<HTMLInputElement>("#size")!!
    const iTopColor = document.querySelector<HTMLInputElement>("#top_color")!!
    const iBottomColor = document.querySelector<HTMLInputElement>("#bottom_color")!!
    const iFrontFace = document.querySelector<HTMLInputElement>("#front_face")!!
    const iAutoFrontFace = document.querySelector<HTMLInputElement>("#auto_front_face")!!
    const iControlList = document.querySelector<HTMLElement>("#controls_list")!!
    const iControlName = document.querySelector<HTMLInputElement>("#control_name")!!
    const gui_container = document.querySelector<HTMLElement>("#gui_container")!!
    const iAddControl = document.querySelector<HTMLButtonElement>("#add_control")!!
    const iReplaceControl = document.querySelector<HTMLButtonElement>("#replace_control")!!
    const iWamUrl = document.querySelector<HTMLTextAreaElement>("#wam_url")!!
    const original_ui = document.querySelector<HTMLElement>("#original_ui")!!
    const iGetFields = document.querySelector<HTMLInputElement>("#fields_get")!!
    const iExamples = document.querySelector<HTMLSelectElement>("#examples")!!
    const iShape = document.querySelector<HTMLSelectElement>("#shape")!!


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
    const current_wam_url = new MOValue("")

    current_wam_url.observable.add(async({to})=>{
        iWamUrl.value = to

        setIndicator("wait","Downloading the WAM")
        try{
            let type = (await import(to))?.default as typeof WebAudioModule
            let instance = await type.createInstance(host,audioContext)
            setIndicator("valid","WAM loaded")
            wam.value = instance
        }catch(e){
            setIndicator("invalid","Error loading the WAM")
            console.error(e)
        }
    })

    iWamUrl.onchange=()=>current_wam_url.value=iWamUrl.value


    //// CONTROL LIST ////
    let selected_control: {key:string, control:typeof Control}|null = null

    function setControl(key: string){
        let options = iControlList.querySelectorAll(":scope > *")
        if(controls[key]){
            const control = controls[key]
            selected_control = {key, control}
            options.forEach( it => it.classList.remove("selected"))
            iControlList.querySelector(`option[value="${key}"]`)!!.classList.add("selected")
            showSelectedControlSettings()
        }
    }

    function showSelectedControlSettings(){
        if(selected_control){
            control_values = selected_control.control.getDefaultValues()
            setControlSettings(
                selected_control.control.label,
                selected_control.control.getSettings(),
                (label) => control_values[label],
                (label,value) => control_values[label]=value
            )
        }
        else{
            setControlSettings("",null)
        }
    }

    for(let [key,control] of Object.entries(controls)){
        let example = new control({
            defineAnInput(settings) {},
            defineAnOutput(settings) {},
            defineAnEventInput(settings) {},
            defineAnEventOutput(settings) {},
            defineField(settings) {},
            defineDraggableField(settings) {},
        })
        let element = example.createElement()
        let option = iControlList.appendChild(html.a`<option value="${key}">${element}${control.label}</option>`)
        example.setDefaultValues()
        option.onclick=()=>setControl(key)
    }


    //// CONTROL SETTINGS ////
    const elem_settings = document.querySelector("#settings")!!
    let control_values: Record<string,string> = {}

    function setControlSettings(
        name: string,
        settings: ControlSettings|null, 
        getValue = (label:string)=>(undefined as string|undefined),
        setValue = (label:string, value:string)=>{}
    ){
        iControlName.textContent = name
        if(settings){
            let gui = new ControlSettingsGUI(settings,parameters_infos)
            for(let [label,value] of Object.entries(settings)){
                const value = getValue(label)
                if(value!=undefined) gui.setValue(label,value)
            }
            gui.on_value_change = (label,value)=> setValue(label,value)
            elem_settings.replaceChildren(gui.element)
        }
        else elem_settings.replaceChildren()
    }


    //// WAM BASE ////
    let fields = new MOValue<Parameters<ControlContext['defineField']>[0][]>([])
    let wam_gui_generator = new MOValue(await WamGUIGenerator.create({html:gui_container, babylonjs:node_container},{}))
    let parameters_infos: WamParameterInfoMap = {}
    const wam = new MOValue(null as WebAudioModule|null)

    wam.link(async({from,to})=>{
        try{
            setIndicator("wait","Destroying previous WAM")
            fields.set([])
            wam_gui_generator.value.dispose()
            if(from!=null){
                from.audioNode.destroy()
                from.destroyGui(original_ui.children[0])
            }
            setIndicator("wait","Loading the WAM")

            original_ui.replaceChildren()
            if(to!=null){
                parameters_infos = await to.audioNode.getParameterInfo()
                original_ui.replaceChildren(await to.createGui())
            }

            const new_fields: Parameters<ControlContext['defineField']>[0][] = []
            const new_generator = await WamGUIGenerator.create({html:gui_container, babylonjs:node_container}, {
                defineField(settings) {new_fields.push(settings)},
                defineAnInput(settings) {},
                defineAnOutput(settings) {},
                wam: to ?? undefined
            })
            fields.set(new_fields)
            
            new_generator.aspect_ratio.link(({to}) => iAspectRatio.value=to.toString())
            new_generator.size.link(({to}) => iSize.value=to.toString())
            new_generator.top_color.link(({to}) => iTopColor.value=to)
            new_generator.bottom_color.link(({to}) => iBottomColor.value=to)
            new_generator.front_face.link(({to}) => iFrontFace.value=to??"")
            new_generator.pad_shape.link(({to}) => iShape.value=to.toString())

            new_generator.controls.on_add.register((item)=>{
                const {container} = item
                if(container)container.onmousedown = (e: MouseEvent)=>{
                    e.stopPropagation()
                    if(e.shiftKey) selector.select({element:container, infos:item})
                    else selector.selecteds = [{element:container, infos:item}]
                    selector.transformer?.startMoving(e.pageX,e.pageY,()=>getTransformerLines([...selector.selecteds.values()]))
                }
            })

            new_generator.controls.on_remove.add((item)=>{
                for(const s of selector.selecteds) if(s.infos==item) selector.unselect(s)
            })

            new_generator.pad_element?.addEventListener("mousedown",unselectall)

            wam_gui_generator.value = new_generator

            setIndicator("valid","WAM Loaded")
        }catch(e){
            setIndicator("invalid","WAM Loading Failed")
        }
    })
    wam_gui_generator.link(({from,to})=>{
        //@ts-ignore
        globalThis.wam_gui_generator = to
    })

    iTopColor.oninput = ()=> wam_gui_generator.value.top_color.value = iTopColor.value
    iBottomColor.oninput = ()=> wam_gui_generator.value.bottom_color.value = iBottomColor.value
    iFrontFace.oninput = ()=> wam_gui_generator.value.front_face.value = iFrontFace.value=="" ? null : iFrontFace.value
    iShape.oninput = ()=> wam_gui_generator.value.pad_shape.value = iShape.value as WamPadShape
    iAutoFrontFace.onclick = async()=>{
        // Get thumbnail url
        const wam_url = current_wam_url.value; if(wam_url.length==0) return
        const thumbnail = wam.value?.descriptor?.thumbnail; if(thumbnail==undefined) return
        const url = new URL(thumbnail,wam_url).href
        wam_gui_generator.value.front_face.value = url
    }
    iAspectRatio.oninput = ()=> wam_gui_generator.value.aspect_ratio.value = parseFloat(iAspectRatio.value)
    iSize.oninput = ()=> wam_gui_generator.value.size.value = parseFloat(iSize.value)


    //// FIELDS DEBUG ////
    function showField(){
        const display = document.querySelector("#fields")!!
        display.replaceChildren()

        fields.value.forEach((settings)=>{
            display.appendChild(html.a`<div>${settings.getValue()}: ${settings.stringify(settings.getValue())}</div>`)
        })
    }

    fields.link(showField)

    iGetFields.onclick = () => showField()



    //// SAVE ////
    const save_text_area = (document.querySelector("#save_data") as HTMLTextAreaElement)
    save_text_area.onfocus = ()=>{
        const object = (wam_gui_generator.value.save(controls)??{}) as WAMGuiInitCode
        if(iWamUrl.value.length>0) object.wam_url = iWamUrl.value
        save_text_area.value = JSON.stringify(object)
    }
    save_text_area.onchange = ()=>{
        const wam_code = JSON.parse(save_text_area.value) as WAMGuiInitCode|WamGUICode
        if(Object.entries(wam_code).length>0){
            if("wam_url" in wam_code){
                function load(){
                    wam_gui_generator.value.load(wam_code, controls)
                    wam_gui_generator.observable.unregister(load)
                }
                wam_gui_generator.observable.add(load)
                current_wam_url.value = wam_code.wam_url
            }
            else{
                wam_gui_generator.value.load(wam_code, controls)
            }
            
        }
    }
    
    for(const [id,example] of Object.entries(examples)){
        const option = iExamples.appendChild(html.a`<option value="${id}">${id}</option>`)
        option.onclick=()=>{
            save_text_area.value = JSON.stringify(example)
            // @ts-ignore
            save_text_area.onchange()
        }

    }


    //// Selector and Transformer ////
    function getTransformerLines(selecteds: {element: HTMLElement, infos: ReturnType<ControlMap["get"]>}[]){
        const horizontal: number[] = []
        const vertical: number[] = []
        for(const selectable of wam_gui_generator.value.controls.values){
            if(selecteds.some(e=>e.infos==selectable)) continue
            horizontal.push(selectable.x)
            vertical.push(selectable.y)
            horizontal.push(selectable.x+selectable.width)
            vertical.push(selectable.y+selectable.height)
            
            horizontal.push(1.-selectable.x)
            vertical.push(1.-selectable.y)
            horizontal.push(1.-selectable.x-selectable.width)
            vertical.push(1.-selectable.y-selectable.height)
        }

        return {horizontal, vertical}
    }
    
    let selector = new Selector<{element:HTMLElement,infos:ReturnType<ControlMap['get']>}>(
        it=>it.infos,
        gui_container,
        getTransformerLines,
    )

    function unselectall(e: MouseEvent){
        if(e.target==e.currentTarget) selector.unselect_all()
    }
    gui_container.addEventListener("mousedown",unselectall)

    selector.on_move = (moved, x,y, width,height)=>{
        const controls = wam_gui_generator.value.controls; if(!controls)return
        const index = controls.values.indexOf(moved.infos)
        controls.move(index,x,y)
        controls.resize(index,width,height)
    }

    selector.on_select = selection=>{
        const controls = wam_gui_generator.value.controls; if(!controls)return
        const settings = selection.infos.control.factory.getSettings()
        setControlSettings(
            selection.infos.control.factory.label,
            settings,
            (label: string) => selection.infos.values[label],
            (label,value) => {
                for(const {infos:{control}} of selector.selecteds){
                    const index = controls.values.findIndex(it=>it.control==control)
                    controls.setValue(index,label,value)
                }
            }
        )
    }

    selector.on_unselect = (selection)=>{
        if(selector.selecteds.size==0){
            showSelectedControlSettings()
        }
    }


    iAddControl.onclick=()=>{
        const controls = wam_gui_generator.value.controls
        if(selected_control && controls){
            // @ts-ignore
            wam_gui_generator.value.addControl({control: selected_control.control, values:control_values, x:0, y:0, width:0.1, height:0.1})
        }
    }

    iReplaceControl.onclick=()=>{
        const selecteds = [...selector.selecteds]
        const control = selected_control?.control; if(control==null)return
        const gui = wam_gui_generator.value

        for(const s of selecteds){
            selector.unselect(s)
            gui.controls.splice(gui.controls.values.indexOf(s.infos),1)
        }
        
        for(const s of selecteds){
            const {infos:{x,y,width,height,values}} = s
            // @ts-ignore
            gui.addControl({x,y,width,height,values,control})
            const e = gui.controls.get(gui.controls.length-1)
            selector.select({element:e.container!!, infos:e})
        }
    }


    //// REMOVE, COPY, PASTE ////
    let copied: {x:number, y:number, width:number, height:number, control:ControlLibrary[0], values:Record<string,string>}[] = []
    document.addEventListener("keydown",e=>{
        if(document.activeElement!=document.body) return
        const controls = wam_gui_generator.value.controls

        switch(e.key){
            case "Delete":
            case "Backspace":
                if(controls){
                    for(const {infos} of [...selector.selecteds]){
                        const index = controls.values.indexOf(infos)
                        controls.splice(index,1)
                    }
                }
                break
            case "c":
                copied = [
                    ...[...selector.selecteds.values()]
                    .map(({infos})=>({x:infos.x+0.02, y:infos.y+0.02, width:infos.width, height:infos.height, values:{...infos.values}, control:infos.control.factory}))
                ]
                break
            case "v":
                if(controls){
                    let first = controls.length
                    let count = copied.length
                    for(const {x,y,width,height,values,control} of copied){
                        wam_gui_generator.value.addControl({control, values:structuredClone(values), x, y, width, height})
                    }
                    selector.selecteds = [...controls.values].slice(first,first+count).map(infos=>({element:infos.container!!, infos}))
                }
                break
        }
    })
}
main()