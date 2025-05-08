import { TransformNode } from "@babylonjs/core";
import { WebAudioModule } from "@webaudiomodules/api";
import { ControlMap } from "./control/ControlMap.ts";
import { MOValue } from "./observable/collections/OValue.ts";
import { ControlEnv, ControlFactory, ControlHost, ControlType } from "./control/Control.ts";
import { parallel, parallelFor } from "./utils/async.ts";
import { Decoration } from "./utils/visual/Decoration.ts";
import { CSettingsValues } from "./control/controls/settings/settings.ts";
import { ShareMap } from "./control/ShareMap.ts";

export interface ControlLibrary{
    [id:string]: ControlType
}

export type WamPadShape = "rectangle"
    | "circle"
    | "triangle"

/**
 * Allow to generated a 3d wam gui from a WamGUICode.
 * It can be used to create a Wam GUI from a WAM GUI code.
 */
export class WamGUIGenerator{
    
    private env
    private controls_factories = new Map<ControlType, ControlFactory>()
    private controls_factories_reverse = new Map<ControlFactory, ControlType>()

    readonly controls: ControlMap

    pad_element?: Element
    pad_node?: TransformNode

    readonly host: ControlHost

    private pad_decoration = new Decoration()
    private disposables = [] as (() => void)[]

    readonly top_color = this.pad_decoration.top_color
    readonly bottom_color = this.pad_decoration.bottom_color
    readonly front_face_color = this.pad_decoration.face_color
    readonly pad_shape = this.pad_decoration.shape
    readonly front_face = this.pad_decoration.front_face
    readonly size = new MOValue(.8)
    readonly aspect_ratio = new MOValue(1)
    readonly pad_outline_width = this.pad_decoration.outline_width
    readonly pad_outline_color = this.pad_decoration.outline_color
    readonly modifier = this.pad_decoration.modifier
    readonly modifier_strength = this.pad_decoration.modifier_strength
    
    private constructor(
        host: Partial<ControlHost>,
    ){
        this.host = {
            ...host,
        }

        this.env = {} as ControlEnv
        this.env.host = host
        this.env.shared = new ShareMap(this.env)
        this.env.sharedTemp = new ShareMap(this.env)


        if(this.host.babylonjs){
            const {root} = this.host.babylonjs

            const visual = this.pad_decoration.createScene(root.getScene())
            const pad_node = this.pad_node = visual.node
            pad_node.parent = root
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


        if(this.host.html){
            const {root} = this.host.html

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
        this.controls = new ControlMap(this.host.html?.root, this.host.babylonjs?.root)

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
    static async create_and_init(context: Partial<ControlHost>, init_code: WAMGuiInitCode, library: ControlLibrary, audioContext: BaseAudioContext, groupId: string): Promise<WamGUIGenerator>{
        const wam_type = (await import(init_code.wam_url))?.default as typeof WebAudioModule
        const wam_instance = await wam_type.createInstance(groupId, audioContext)
        context={...context, wam:wam_instance}
        const generator = new WamGUIGenerator(context)
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
    static create(context: Partial<ControlHost>): WamGUIGenerator{
        return new WamGUIGenerator(context)
    }

    dispose(){
        this.pad_element?.remove()
        this.pad_node?.dispose()
        this.disposables.forEach(it=>it())
        this.controls.splice(0,this.controls.length)
    }

    async addControl(added: {control:ControlType, values:CSettingsValues, x:number, y:number, width:number, height:number}){
        const factory = await this.getFactory(added.control)
        const control = await factory.create()
        this.controls.splice(this.controls.length, 0, {control, x:added.x, y:added.y, height:added.height, width:added.width, values:added.values})
    }

    async getFactory(control_type: ControlType): Promise<ControlFactory>{
        if(this.controls_factories.has(control_type)) return this.controls_factories.get(control_type)!!
        const factory = await control_type(this.env)
        this.controls_factories.set(control_type, factory)
        this.controls_factories_reverse.set(factory, control_type)
        return factory
    }

    getType(factory: ControlFactory): ControlType | undefined{
        return this.controls_factories_reverse.get(factory)
    }

    /**
     * Load the 3DWam GUI descriptor.
     * @param code the 3DWam GUI descriptor
     * @param library The control library to use for loading the controls
     */
    async load(code: WamGUICode, library: ControlLibrary){
        this.aspect_ratio.value = code.aspect_ratio
        this.size.value = code.size ?? 1
        this.pad_shape.value = code.shape as WamPadShape ?? "rectangle"
        this.top_color.value = code.top_color
        this.bottom_color.value = code.bottom_color
        this.front_face.value = code.face??null
        this.front_face_color.value = code.face_color??"#FFFFFF"
        this.pad_outline_width.value = code.outline_width ?? 0
        this.pad_outline_color.value = code.outline_color ?? "#000000"
        this.modifier.value = code.modifier ?? "normal"
        this.modifier_strength.value = code.modifier_strength ?? 0
        this.controls.splice(0,this.controls.length)
        for(let {control,values,x,y,width,height} of code.controls){
            const instance = await (await this.getFactory(library[control])).create()
            this.controls.splice(this.controls.length, 0, {control:instance, values, x, y, width, height})
        }
    }

    /**
     * Free the resource useful for editing the GUI.
     * The controls should not be modified after this call.
     */
    freeze(){
        this.controls.values.forEach(it=>it.control.freeze())
        for(const k of this.env.sharedTemp.keys)this.env.sharedTemp.free(k,9999)
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
            face_color: this.front_face.value==null ? undefined : this.front_face_color.value,
            outline_color: this.pad_outline_color.value,
            outline_width: this.pad_outline_width.value,
            shape: this.pad_shape.value,
            modifier: this.modifier.value,
            modifier_strength: this.modifier_strength.value,
            controls: this.controls.values.map(({control,values,x,y,width,height})=>{
                const factory = control.factory
                const type = this.controls_factories_reverse.get(factory)
                const type_id = Object.entries(library).find(([_,c])=>c===type)?.[0]
                if(type_id) return {x, y, width, height, values, control:type_id}
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
                if(includeWAM && this.host.wam){
                    state.wam = await this.host.wam.audioNode?.getState()
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
                    await this.host.wam?.audioNode?.setState(state.wam)
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
    face_color?: string,
    shape?: string,
    outline_width?: number,
    outline_color?: string,
    modifier?: string,
    modifier_strength?: number,
    controls: {
        control: string,
        values: CSettingsValues,
        x: number,
        y: number,
        width: number,
        height: number
    }[]
}

export interface WAMGuiInitCode extends WamGUICode{
    wam_url: string,
}