import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { AbstractMesh, TransformNode } from "@babylonjs/core";
import { MOValue, OValue } from "../observable/collections/OValue.ts";
import { WamGUIGenerator } from "../WamGUIGenerator.ts";
import { Selector } from "../gui/Selector.ts";
import { ControlMap } from "../control/ControlMap.ts";
import { OSource } from "../observable/source/OSource.ts";
import { WebAudioModule } from "@webaudiomodules/api";
import { ControlContextTarget, DEFAULT_CONTROL_CONTEXT_TARGET } from "../control/Control.ts";

export class WamEditorPane implements IContentRenderer{

    container = html.a`<div class=container></div>`
    element = html.a`<div class="editor_pane center_pane _contain">${this.container}</div>`
    gui_generator: MOValue<WamGUIGenerator>
    selector: Selector<{element:HTMLElement,infos:ReturnType<ControlMap['get']>}>
    on_select = new OSource<Parameters<WamEditorPane['selector']['on_select']>[0]>()
    on_unselect = new OSource<Parameters<WamEditorPane['selector']['on_select']>[0]>()

    constructor(
        wam: OValue<WebAudioModule|null>,
        node_container?: TransformNode,
    ){
        this.container.style = `
            display: flex;
            aspect-ratio: 1/1;
            width: 100%;
        `

        const html: ControlContextTarget<HTMLElement,HTMLElement> = {
            root: this.container,
            ...DEFAULT_CONTROL_CONTEXT_TARGET,
        }

        const babylonjs: ControlContextTarget<TransformNode,AbstractMesh>|undefined = node_container ? {
            root: node_container,
            ...DEFAULT_CONTROL_CONTEXT_TARGET,
        } : undefined 

        this.gui_generator = new MOValue(WamGUIGenerator.create({wam:wam.value??undefined, html, babylonjs}))

        wam.observable.register(({})=>{
            console.trace()
            this.gui_generator.value.dispose()
            this.gui_generator.value = WamGUIGenerator.create({wam:wam.value??undefined, html, babylonjs})
        })
        
        this.selector = new Selector<{element:HTMLElement,infos:ReturnType<ControlMap['get']>}>(
            it=>it.infos,
            this.container,
            this.getTransformerLines.bind(this),
        )

        this.selector.on_move = (moved, x,y, width,height)=>{
            const controls = this.gui_generator.value.controls; if(!controls)return
            const index = controls.values.indexOf(moved.infos)
            controls.move(index,x,y)
            controls.resize(index,width,height)
        }

        this.selector.on_select = it => this.on_select.notify(it)
        this.selector.on_unselect = it => this.on_unselect.notify(it)

        this.gui_generator.link(({to:gen})=>{
            gen.controls.on_add.register((item)=>{
                const {container} = item
                if(container)container.onmousedown = (e: MouseEvent)=>{
                    e.stopPropagation()
                    if(e.shiftKey) this.selector.select({element:container, infos:item})
                    else this.selector.selecteds = [{element:container, infos:item}]
                    this.selector.transformer?.startMoving(e.pageX,e.pageY,()=>this.getTransformerLines([...this.selector.selecteds.values()]))
                }
            })

            gen.controls.on_remove.add((item)=>{
                for(const s of this.selector.selecteds) if(s.infos==item) this.selector.unselect(s)
            })
        })

        this.container.addEventListener("mousedown",e=>{
            if(e.target==this.container || e.target==this.gui_generator.value.pad_element){
                this.selector.unselect_all()
            }
        })
    }

    getTransformerLines(selecteds: {element: HTMLElement, infos: ReturnType<ControlMap["get"]>}[]){
        const horizontal: number[] = []
        const vertical: number[] = []
        for(const selectable of this.gui_generator.value.controls.values){
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

    init(_: GroupPanelPartInitParameters): void {
    }

}