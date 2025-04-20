import { Color3, Color4, Material, Mesh, MeshBuilder, Size, StandardMaterial, Texture, TransformNode, Vector3, VertexBuffer } from "@babylonjs/core";
import { WebAudioModule } from "@webaudiomodules/api";
import { ControlMap } from "./control/ControlMap.ts";
import { MOValue } from "./observable/collections/OValue.ts";
import { Control, ControlContext } from "./control/Control.ts";
import { parallel, parallelFor } from "./utils/async.ts";
import { colorizeMesh, forEachBuffer, uvFromDirection } from "./utils/vertexs.ts";

export interface ControlLibrary{
    [id:string]: (new(context:ControlContext)=>Control) & (typeof Control)
}

export interface WamGUITarget{
    html?: HTMLElement,
    babylonjs?: TransformNode,
}

export type WamPadShape = "rectangle"
    | "circle"
    | "triangle"

/**
 * Allow to generated a 3d wam gui from a WamGUICode.
 * It can be used to create a Wam GUI from a WAM GUI code.
 */
export class WamGUIGenerator{
    
    readonly controls: ControlMap
    readonly aspect_ratio = new MOValue(1)
    readonly size = new MOValue(.8)
    readonly top_color = new MOValue("#aa4444")
    readonly bottom_color = new MOValue("#cc8888")
    readonly pad_shape = new MOValue<WamPadShape>("rectangle")
    readonly front_face = new MOValue<string|null>(null)

    pad_element?: SVGSVGElement
    pad_mesh?: Mesh

    readonly context: ControlContext
    
    private constructor(
        context: Partial<ControlContext>,
        readonly gui_target: WamGUITarget = {},
    ){
        this.context = {
            defineAnInput: ()=>{},
            defineAnOutput: ()=>{},
            defineField: ()=>{},
            defineAnEventInput: ()=>{},
            defineAnEventOutput: ()=>{},
            defineDraggableField: ()=>{},
            ...context,
        }


        if(gui_target.babylonjs){
            const root = gui_target.babylonjs
            const material = new StandardMaterial("mat", gui_target.babylonjs.getScene())
            material.diffuseColor = new Color3(1, 1, 1)
            material.specularColor = new Color3(0, 0, 0)

            const updateSize = ()=>{
                const aspect_ratio = this.aspect_ratio.value
                const size = this.size.value
                let [width,height] = aspect_ratio>1 ? [1,1/aspect_ratio] : [aspect_ratio,1]
                width*=size
                height*=size
                this.pad_mesh!!.scaling.set(width,1,height)
            }

            const updateColor = ()=>{
                const bottom = Color4.FromHexString(this.bottom_color.value)
                const top = Color4.FromHexString(this.top_color.value)
               colorizeMesh(this.pad_mesh!!, bottom, top)
            }

            let face = null as Mesh|null
            const updateFace = ()=>{
                if(face!=null){
                    const mat = face.material as StandardMaterial
                    mat.diffuseTexture?.dispose()
                    mat.dispose()
                    face.dispose()
                    face = null
                }
                if(this.front_face.value!=null){
                    if(this.pad_shape.value=="rectangle"){
                        face =  MeshBuilder.CreatePlane("wampad face", {size: 1.}, root.getScene())
                    }
                    else if(this.pad_shape.value=="circle"){
                        face = MeshBuilder.CreateDisc("wampad", {radius:.5, sideOrientation:Math.PI}, root.getScene())
                        face.bakeCurrentTransformIntoVertices()
                        forEachBuffer(face, VertexBuffer.UVKind, 2, (array,i)=>array[i+1]=1-array[i+1])
                    }
                    else if(this.pad_shape.value=="triangle"){
                        face = MeshBuilder.CreateDisc("wampad", {radius:.5, tessellation:3}, root.getScene())
                        face.rotation.z = -Math.PI/6
                        face.bakeCurrentTransformIntoVertices()
                        face.scaling.x = 1.1
                        face.scaling.y = 1.3
                        face.position.y = -.15
                        face.bakeCurrentTransformIntoVertices()
                        uvFromDirection(face, new Vector3(1,0,0), new Vector3(0,1,0))
                    }
                    face!!.parent = this.pad_mesh!!
                    face!!.position.y = .051
                    face!!.rotation.x = Math.PI/2
                    const faceMaterial = face!!.material = new StandardMaterial("wampad face mat", root.getScene())
                    const texture = new Texture(this.front_face.value)
                    faceMaterial.diffuseTexture = texture
                    faceMaterial.specularColor = new Color3(0, 0, 0)
                }
            }

            const updateShape = ()=>{
                if(this.pad_mesh)this.pad_mesh.dispose()
                if(this.pad_shape.value=="rectangle"){
                    this.pad_mesh =  MeshBuilder.CreateBox("wampad", {size: 1., height:.1}, root.getScene())
                }
                else if(this.pad_shape.value=="circle"){
                    this.pad_mesh = MeshBuilder.CreateCylinder("wampad", {diameter:1, height:.1}, root.getScene())
                }
                else if(this.pad_shape.value=="triangle"){
                    this.pad_mesh = MeshBuilder.CreateCylinder("wampad", {diameter:1, height:.1, tessellation:3}, root.getScene())
                    this.pad_mesh.rotation.y = Math.PI/6
                    this.pad_mesh.bakeCurrentTransformIntoVertices()
                    this.pad_mesh.scaling.x = 1.1
                    this.pad_mesh.scaling.z = 1.3
                    this.pad_mesh.position.z = -.15
                    this.pad_mesh.bakeCurrentTransformIntoVertices()
                }
                this.pad_mesh!!.material = material
                this.pad_mesh!!.setParent(root)
                updateSize()
                updateColor()
                updateFace()
            }

            this.top_color.observable.add(updateColor)
            this.bottom_color.observable.add(updateColor)
            this.front_face.observable.add(updateFace)
            this.pad_shape.observable.add(updateShape)
            this.size.observable.add(updateSize)
            this.aspect_ratio.observable.add(updateSize)
            updateShape()
            updateFace()
        }


        if(gui_target.html){
            const root = gui_target.html
            const id = `${Math.random().toString(16)}${Math.random().toString(16)}${Math.random().toString(16)}`

            const pad_element = this.pad_element = document.createElementNS("http://www.w3.org/2000/svg","svg")
            pad_element.setAttribute("viewBox", "0 0 100 100")
            pad_element.setAttribute("preserveAspectRatio","none")
            pad_element.innerHTML = /*html*/`
                <linearGradient id="${id}gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="red" />
                    <stop offset="100%" stop-color="blue" />
                </linearGradient>
                <circle cx="50" cy="50" r="50" fill="transparent"/>
                <circle cx="50" cy="50" r="50" fill="transparent"/>
                <circle cx="50" cy="50" r="50" fill="transparent"/>
                <circle cx="50" cy="50" r="50" fill="transparent"/>
                <circle cx="50" cy="50" r="50" fill="transparent"/>
            `
            let background = pad_element.children[0] as SVGElement
            let shape = pad_element.children[1] as SVGElement
            let shadows = Array.from({length:4}, (_,i)=>pad_element.children[1+i] as SVGElement)

            root.style.contain = "content"
            root.replaceChildren(pad_element)

            const updateBackground = ()=>{
                console.log(this.front_face.value)
                if(this.front_face.value){
                    background.outerHTML=/*html*/`
                        <pattern id="${id}gradient" patternUnits="userSpaceOnUse" width="100" height="100">
                            <image preserveAspectRatio=none href="${this.front_face.value}" x="0" y="0" width="100" height="100" />
                        </pattern>
                    `
                }
                else{
                    background.outerHTML=/*html*/`
                        <linearGradient id="${id}gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="${this.top_color.value}" />
                            <stop offset="100%" stop-color="${this.bottom_color.value}" />
                        </linearGradient>
                    `
                }
                background = pad_element.children[0] as SVGElement
            }

            const updateShape = ()=>{
                let shape_fn: (size:number, fill:string)=>string
                if(this.pad_shape.value=="rectangle"){
                    shape_fn = (padding,content)=>{
                        const tsize = 100-padding
                        const toffset = Math.round((100-tsize)/2)
                        return `<rect x="${toffset}" y="${toffset}" width="${tsize}" height="${tsize}" ${content} />`
                    }
                }
                else if(this.pad_shape.value=="circle"){
                    shape_fn = (padding,content)=>{
                        const tsize = 100-padding
                        return `<circle cx="50" cy="50" r="${tsize/2}" ${content} />`
                    }
                }
                else if(this.pad_shape.value=="triangle"){
                    shape_fn = (padding,content)=>{
                        const tsize = 100-padding
                        const toffset = Math.round((100-tsize)/2)
                        return `<polygon points="${toffset},${toffset+tsize} ${toffset+tsize},${toffset+tsize} ${toffset+tsize/2},${toffset}" ${content} />`
                    }
                }
                else shape_fn = ()=>{return ""}
                shape.outerHTML = shape_fn(0, `fill="url(#${id}gradient)"`)
                ;[18,10,5,2].forEach((s,i)=>{
                    shadows[i].outerHTML = shape_fn(s, `stroke="rgba(0,0,0,.1)" stroke-width="${s}" fill=transparent`)
                })
                shape = pad_element.children[1] as SVGElement
                shadows = Array.from({length:4}, (_,i)=>pad_element.children[1+i] as SVGElement)
            }
    
            const updateSize = ()=>{
                const aspect_ratio = this.aspect_ratio.value
                const size = this.size.value
                let [w,h] = aspect_ratio>1 ? [1,1/aspect_ratio] : [aspect_ratio,1]
                let width=size*w
                let height=size*h
                pad_element.style.width = `${Math.round(100*width)}%`
                pad_element.style.height = `${Math.round(100*height)}%`
                pad_element.style.marginLeft = `${Math.round((1-width)*50)}%`
                pad_element.style.marginTop = `${Math.round((1-height)*50)}%`
                //pad_element.setAttribute("viewBox", `${viewPortX} ${viewPortY} ${viewPortWidth} ${viewPortHeight}`)
            }
    
            this.top_color.observable.add(updateBackground)
            this.bottom_color.observable.add(updateBackground)
            this.front_face.observable.add(updateBackground)
            this.pad_shape.observable.add(updateShape)
            this.size.observable.add(updateSize)
            this.aspect_ratio.observable.add(updateSize)
            updateShape()
            updateSize()
            updateBackground()
        }


        //// CONTROLS ////
        this.controls = new ControlMap(gui_target.html, gui_target.babylonjs)

    }

    /**
     * Create a WAM GUI from a WAM GUI code.
     * @param context The context to use for the WAM GUI.
     * @param gui_target The target of the WAM GUI (An HTML GUI or a 3D GUI ror both)
     * @param init_code The gui code to load.
     * @param library The control library to use for loading the controls.
     * @param audioContext The audio context to use for the WAM GUI.
     * @param groupId The groupd id of the web audio module host.
     * @returns 
     */
    static async create_and_init(context: Partial<ControlContext>, gui_target: WamGUITarget, init_code: WAMGuiInitCode, library: ControlLibrary, audioContext: BaseAudioContext, groupId: string): Promise<WamGUIGenerator>{
        const wam_type = (await import(init_code.wam_url))?.default as typeof WebAudioModule
        const wam_instance = await wam_type.createInstance(groupId, audioContext)
        context={...context, wam:wam_instance}
        const generator = new WamGUIGenerator(context, gui_target)
        generator.load(init_code, library)
        return generator
    }

    /**
     * Create a WAM GUI Generator.
     * You can then load a WAM GUI descriptor using the load method.
     * @param gui_target 
     * @param context 
     * @returns 
     */
    static create(gui_target: WamGUITarget, context: Partial<ControlContext>): WamGUIGenerator{
        return new WamGUIGenerator(context, gui_target)
    }

    dispose(){
        this.pad_element?.remove()
        this.pad_mesh?.dispose()
        this.controls.splice(0,this.controls.length)
    }

    addControl(added: {control:ControlLibrary[0], values:Record<string,string>, x:number, y:number, width:number, height:number}){
        const control = new added.control(this.context)
        this.controls.splice(this.controls.length, 0, {control, x:added.x, y:added.y, height:added.height, width:added.width, values:added.values})
    }

    /**
     * Load the 3DWam GUI descriptor.
     * @param code the 3DWam GUI descriptor
     * @param library The control library to use for loading the controls
     */
    load(code: WamGUICode, library: ControlLibrary){
        this.aspect_ratio.value = code.aspect_ratio
        this.size.value = code.size ?? 1
        this.pad_shape.value = code.shape as WamPadShape ?? "rectangle"
        this.top_color.value = code.top_color
        this.bottom_color.value = code.bottom_color
        this.front_face.value = code.face??null
        this.controls.splice(0,this.controls.length)
        for(let {control,values,x,y,width,height} of code.controls){
            const instance = new library[control](this.context)
            this.controls.splice(this.controls.length, 0, {control:instance, values, x, y, width, height})
        }
    }

    /**
     * Save the 3DWam GUI descriptor.
     * @param library The control library to use for saving the controls
     * @returns the 3DWam GUI descriptor
     */
    save(library: ControlLibrary): WamGUICode{
        return {
            aspect_ratio: this.aspect_ratio.value,
            size: this.size.value,
            bottom_color: this.bottom_color.value,
            top_color: this.top_color.value,
            face: this.front_face.value??undefined,
            shape: this.pad_shape.value,
            controls: this.controls.values.map(({control,values,x,y,width,height})=>{
                const factory_id = Object.entries(library).find(([_,c])=>c===control.constructor)?.[0]
                if(factory_id) return {x, y, width, height, values, control:factory_id}
                else return null
            }).filter(it=>it!=null)
        }
    }

    /**
     * Get the state of the Wam GUI.
     * @param includeWAM if true, the WAM state will be included in the result.
     */
    async getState(includeWAM: boolean = true): Promise<any> {
        const state = {} as any
        await parallel(
            async()=>{
                if(includeWAM && this.context.wam){
                    state.wam = await this.context.wam.audioNode?.getState()
                }
                
            },
            async()=>{
                state.controls = await Promise.all(this.controls.values.map(it=>it.control.getState()))
            }
        )
        return state
    }

    /**
     * Set the state of the Wam GUI.
     * @param state the state to set
     */
    async setState(state: any): Promise<void> {
        if(state==null)return
        await parallel(
            async()=>{
                if("wam" in state){
                    await this.context.wam?.audioNode?.setState(state.wam)
                }
            },
            async()=>{
                await parallelFor(0, this.controls.length, async i => {
                    if(state.controls[i])this.controls.get(i)?.control.setState(state.controls[i])
                })
            }
        )
    }

    /**
     * Get the average maximum of height and width of the second and third quartiles of the controls sizes.
     * Can be used to determine how the wam has to be scaled.
     */
    calculateAverageControlSize(): number{
        const controls = Array.from({length: this.controls.length}, (_,i)=>this.controls.get(i))
            .map(it=>Math.max(it.width, it.height))
            .sort((a,b)=>a-b)

        const from = Math.floor(controls.length/4)
        const to = Math.ceil(controls.length*3/4)
        let accumulator = 0
        let count = 0
        for(let i=from; i<to; i++){
            accumulator += controls[i]
            count++
        }
        return accumulator/count
    }
}

export interface WamGUICode{
    top_color: string,
    bottom_color: string,
    aspect_ratio: number,
    size: number,
    face?: string,
    shape?: string,
    controls: {
        control: string,
        values: Record<string,string>,
        x: number,
        y: number,
        width: number,
        height: number
    }[]
}

export interface WAMGuiInitCode extends WamGUICode{
    wam_url: string,
}