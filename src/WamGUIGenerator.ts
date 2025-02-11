import { Color3, Color4, Mesh, MeshBuilder, StandardMaterial, TransformNode, VertexBuffer } from "@babylonjs/core";
import { WebAudioModule } from "@webaudiomodules/api";
import { ControlMap } from "./control/ControlMap.ts";
import { MOValue } from "./observable/collections/OValue.ts";
import { Control } from "./control/Control.ts";

export interface ControlLibrary{
    [id:string]: (new(wam:WebAudioModule|null)=>Control) & (typeof Control)
}

export interface WamGUITarget{
    html?: HTMLElement,
    babylonjs?: TransformNode,
}

export class WamGUIGenerator{
    
    readonly controls: ControlMap
    readonly aspect_ratio = new MOValue(1)
    readonly top_color = new MOValue("#aa4444")
    readonly bottom_color = new MOValue("#cc8888")

    readonly pad_element?: HTMLElement
    readonly pad_mesh?: Mesh
    
    private constructor(
        readonly instance?: WebAudioModule,
        readonly gui_target: WamGUITarget = {},
    ){
        
        //// TARGETS / CONTAINERS ////
        if(gui_target.html){
            const pad_element = this.pad_element = document.createElement("div")
            pad_element.style.borderRadius = "10%"
            pad_element.style.boxShadow = "inset -.1rem -.1rem 1.5rem black"
            gui_target.html.style.contain = "content"
            gui_target.html.replaceChildren(pad_element)
        }

        if(gui_target.babylonjs){
            const pad_transform = this.pad_mesh = MeshBuilder.CreateBox("box", {size: 1., height:.1}, gui_target.babylonjs.getScene())
            const wampad3dMaterial = pad_transform.material = new StandardMaterial("mat", gui_target.babylonjs.getScene())
            wampad3dMaterial.diffuseColor = new Color3(1, 1, 1)
            wampad3dMaterial.specularColor = new Color3(0, 0, 0)
            pad_transform.setParent(gui_target.babylonjs)
        }


        //// WAM PAD ////
        this.aspect_ratio.link(({to})=>{
            let [width,height] = to>1 ? [1,1/to] : [to,1]
            if(this.pad_element){
                this.pad_element.style.width = `${Math.floor(100*width)}%`
                this.pad_element.style.height = `${Math.floor(100*height)}%`
                this.pad_element.style.marginLeft = `${Math.floor(50*(1-width))}%`
                this.pad_element.style.marginTop = `${Math.floor(50*(1-height))}%`
            }
            if(this.pad_mesh){
                this.pad_mesh.scaling.set(width,1,height)
            }
        })

        const updateGradient = ()=>{
            if(this.pad_element){
                this.pad_element.style.backgroundImage = `linear-gradient(${this.top_color.value},${this.bottom_color.value})`
            }
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
        this.top_color.observable.add(updateGradient)
        this.bottom_color.observable.add(updateGradient)
        updateGradient()


        //// CONTROLS ////
        this.controls = new ControlMap(gui_target.html, gui_target.babylonjs)

    }

    static async create(gui_target: WamGUITarget, wam?: WebAudioModule): Promise<WamGUIGenerator>{
        if(wam){
            return new WamGUIGenerator(wam, gui_target)
        }
        else{
            return new WamGUIGenerator(undefined, gui_target)
        }
    }

    dispose(){
        this.pad_element?.remove()
        this.pad_mesh?.dispose()
        this.controls.splice(0,this.controls.length)
    }

    addControl(added: {control:ControlLibrary[0], values:Record<string,string>, x:number, y:number, width:number, height:number}){
        const control = new added.control(this.instance??null)
        this.controls.splice(this.controls.length, 0, {control, x:added.x, y:added.y, height:added.height, width:added.width, values:added.values})
    }

    load(code: WamGUICode, library: ControlLibrary){
        this.aspect_ratio.value = code.aspect_ratio
        this.top_color.value = code.top_color
        this.bottom_color.value = code.bottom_color
        this.controls.splice(0,this.controls.length)
        for(let {control,values,x,y,width,height} of code.controls){
            const instance = new library[control](this.instance??null)
            this.controls.splice(this.controls.length, 0, {control:instance, values, x, y, width, height})
        }
    }

    save(library: ControlLibrary): WamGUICode{
        return {
            aspect_ratio: this.aspect_ratio.value,
            bottom_color: this.bottom_color.value,
            top_color: this.top_color.value,
            controls: this.controls.values.map(({control,values,x,y,width,height})=>{
                const factory_id = Object.entries(library).find(([_,c])=>c===control.constructor)?.[0]
                if(factory_id) return {x, y, width, height, values, control:factory_id}
                else return null
            }).filter(it=>it!=null)
        }
    }
}

export interface WamGUICode{
    top_color: string,
    bottom_color: string,
    aspect_ratio: number,
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