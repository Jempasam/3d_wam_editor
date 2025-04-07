import { Color3, Color4, Mesh, MeshBuilder, StandardMaterial, Texture, TransformNode, VertexBuffer } from "@babylonjs/core";
import { WebAudioModule } from "@webaudiomodules/api";
import { ControlMap } from "./control/ControlMap.ts";
import { MOValue } from "./observable/collections/OValue.ts";
import { Control, ControlContext, ControlState } from "./control/Control.ts";
import { stat } from "fs";
import { parallel, parallelFor } from "./utils/async.ts";

export interface ControlLibrary{
    [id:string]: (new(context:ControlContext)=>Control) & (typeof Control)
}

export interface WamGUITarget{
    html?: HTMLElement,
    babylonjs?: TransformNode,
}

export class WamGUIGenerator{
    
    readonly controls: ControlMap
    readonly aspect_ratio = new MOValue(1)
    readonly size = new MOValue(.8)
    readonly top_color = new MOValue("#aa4444")
    readonly bottom_color = new MOValue("#cc8888")
    readonly front_face = new MOValue<string|null>(null)

    readonly pad_element?: HTMLElement
    readonly pad_mesh?: Mesh

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
            ...context,
        }
        
        //// TARGETS / CONTAINERS ////
        if(gui_target.html){
            const pad_element = this.pad_element = document.createElement("div")
            pad_element.style.borderRadius = "10%"
            pad_element.style.boxShadow = "inset -.1rem -.1rem 1.5rem black"
            gui_target.html.style.contain = "content"
            gui_target.html.replaceChildren(pad_element)
        }

        if(gui_target.babylonjs){
            const pad_transform = this.pad_mesh = MeshBuilder.CreateBox("wampad", {size: 1., height:.1}, gui_target.babylonjs.getScene())
            const wampad3dMaterial = pad_transform.material = new StandardMaterial("mat", gui_target.babylonjs.getScene())
            wampad3dMaterial.diffuseColor = new Color3(1, 1, 1)
            wampad3dMaterial.specularColor = new Color3(0, 0, 0)
            pad_transform.setParent(gui_target.babylonjs)
        }


        //// WAM PAD ////
        const updateSize = ()=>{
            const aspect_ratio = this.aspect_ratio.value
            const size = this.size.value
            let [width,height] = aspect_ratio>1 ? [1,1/aspect_ratio] : [aspect_ratio,1]
            if(this.pad_element){
                width*=size
                height*=size
                this.pad_element.style.width = `${Math.round(100*width)}%`
                this.pad_element.style.height = `${Math.round(100*height)}%`
                this.pad_element.style.marginLeft = `${Math.round((1-width)*50)}%`
                this.pad_element.style.marginTop = `${Math.round((1-height)*50)}%`
            }
            if(this.pad_mesh){
                this.pad_mesh.scaling.set(width*size,1,height*size)
            }
        }
        this.aspect_ratio.observable.add(updateSize)
        this.size.observable.add(updateSize)
        updateSize()

        const update3dGradient = ()=>{
            if(this.pad_mesh){
                const bottom = Color4.FromHexString(this.bottom_color.value).asArray()
                const top = Color4.FromHexString(this.top_color.value).asArray()
                this.pad_mesh.setVerticesData(VertexBuffer.ColorKind,[
                    ...top, ...top, ...top, ...top,
                    ...bottom, ...bottom, ...bottom, ...bottom,
                    ...bottom, ...bottom, ...top, ...top,
                    ...top, ...top, ...bottom, ...bottom,
                    ...top, ...bottom, ...bottom, ...top,
                    ...bottom, ...top, ...top, ...bottom
                ])
            }
        }
        this.top_color.observable.add(update3dGradient)
        this.bottom_color.observable.add(update3dGradient)
        update3dGradient()


        //// FRONT FACE ////
        let face = null as Mesh|null
        this.front_face.link(({from,to})=>{
            if(gui_target.babylonjs){
                if(face!=null){
                    const mat = face.material as StandardMaterial
                    mat.diffuseTexture?.dispose()
                    mat.dispose()
                    face.dispose()
                }
                if(this.front_face.value!=null){
                    face = MeshBuilder.CreatePlane("wampad face", {size:1}, gui_target.babylonjs.getScene())
                    face.parent = this.pad_mesh!!
                    face.position.y = .051
                    face.rotation.x = Math.PI/2
                    const faceMaterial = face.material = new StandardMaterial("wampad face mat", gui_target.babylonjs.getScene())
                    const texture = new Texture(to)
                    faceMaterial.diffuseTexture = texture
                    faceMaterial.specularColor = new Color3(0, 0, 0)
                }
            }
        })


        //// FRONT FACE AND GRADIENT ////
        const updateElementBackground = ()=>{
            if(this.pad_element){
                this.pad_element!!.style.backgroundSize = "100% 100%"
                if(this.front_face.value){
                    this.pad_element!!.style.backgroundImage = `url(${this.front_face.value})`
                }
                else{
                    this.pad_element.style.backgroundImage = `linear-gradient(${this.top_color.value},${this.bottom_color.value})`
                }
            }
        }
        this.front_face.observable.add(updateElementBackground)
        this.top_color.observable.add(updateElementBackground)
        this.bottom_color.observable.add(updateElementBackground)
        updateElementBackground()

        //// CONTROLS ////
        this.controls = new ControlMap(gui_target.html, gui_target.babylonjs)

    }

    static async create_and_init(context: Partial<ControlContext>, gui_target: WamGUITarget, init_code: WAMGuiInitCode, library: ControlLibrary, audioContext: BaseAudioContext, groupId: string): Promise<WamGUIGenerator>{
        const wam_type = (await import(init_code.wam_url))?.default as typeof WebAudioModule
        const wam_instance = await wam_type.createInstance(groupId, audioContext)
        context={...context, wam:wam_instance}
        const generator = new WamGUIGenerator(context, gui_target)
        generator.load(init_code, library)
        return generator
    }

    static async create(gui_target: WamGUITarget, context: Partial<ControlContext>): Promise<WamGUIGenerator>{
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