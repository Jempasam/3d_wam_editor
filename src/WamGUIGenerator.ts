import { TransformNode } from "@babylonjs/core";
import { WebAudioModule } from "@webaudiomodules/api";
import { ControlMap } from "./control/ControlMap.ts";
import { MOValue } from "./observable/collections/OValue.ts";
import { Control, ControlContext } from "./control/Control.ts";
import { parallel, parallelFor } from "./utils/async.ts";
import { Decoration } from "./utils/visual/Decoration.ts";

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

    pad_element?: Element
    pad_node?: TransformNode

    readonly context: ControlContext

    private pad_decoration = new Decoration()
    private disposables = [] as (() => void)[]

    readonly top_color = this.pad_decoration.top_color
    readonly bottom_color = this.pad_decoration.bottom_color
    readonly pad_shape = this.pad_decoration.shape
    readonly front_face = this.pad_decoration.front_face
    readonly size = new MOValue(.8)
    readonly aspect_ratio = new MOValue(1)
    readonly pad_outline_width = this.pad_decoration.outline_width
    readonly pad_outline_color = this.pad_decoration.outline_color
    
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

            const visual = this.pad_decoration.createScene(root.getScene())
            const pad_node = this.pad_node = visual.node
            this.disposables.push(visual.dispose)

            const updateSize = ()=>{
                const aspect_ratio = this.aspect_ratio.value
                const size = this.size.value
                let [width,height] = aspect_ratio>1 ? [1,1/aspect_ratio] : [aspect_ratio,1]
                width*=size
                height*=size
                pad_node.scaling.set(width,0.1,height)
            }

            this.size.observable.add(updateSize)
            this.aspect_ratio.observable.add(updateSize)
            updateSize()
        }


        if(gui_target.html){
            const root = gui_target.html

            const visual = this.pad_decoration.createElement()
            const pad_element = this.pad_element = visual.element as HTMLElement
            this.disposables.push(visual.dispose)

            root.style.contain = "content"
            root.replaceChildren(pad_element)
    
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
            }
            this.size.observable.add(updateSize)
            this.aspect_ratio.observable.add(updateSize)
            updateSize()
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
        this.pad_node?.dispose()
        this.disposables.forEach(it=>it())
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
        this.pad_outline_width.value = code.outline_width ?? 0
        this.pad_outline_color.value = code.outline_color ?? "#000000"
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
            outline_color: this.pad_outline_color.value,
            outline_width: this.pad_outline_width.value,
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
    outline_width?: number,
    outline_color?: string,
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