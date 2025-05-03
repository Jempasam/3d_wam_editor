import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core";
import { html } from "../utils/doc.ts";
import { ArcRotateCamera, Color4, Engine, Scene, TransformNode, Vector3 } from "@babylonjs/core";


export class WamGui3DPane implements IContentRenderer{
    
    element = html.a`<div class="center_pane _contain"></div>`
    container: TransformNode
    engine: Engine
    scene: Scene
    declare key_handler: (e:KeyboardEvent)=>void

    constructor(){
        let canvas= html.a`<canvas width=500 height=500></canvas>` as HTMLCanvasElement
        this.element.appendChild(canvas)

        canvas.classList.add("container")
        canvas.style = `
            display: flex;
            aspect-ratio: 1/1;
            width: 100%;
        `
        
        let ctx= canvas.getContext("webgl2");
        this.engine= new Engine(ctx);
        this.scene= new Scene(this.engine);
        this.scene.createDefaultLight();
        this.scene.clearColor = new Color4(0,0,0,0)
    
        const camera = new ArcRotateCamera("camera", -Math.PI/2, 0, 1.7, new Vector3(0,0,0), this.scene);
        camera.wheelPrecision = 100
        camera.attachControl()
        camera.setTarget(Vector3.Zero())
    
        this.container = new TransformNode("node_container", this.scene)
    }

    init(_: GroupPanelPartInitParameters): void {
        //this.key_handler = (event)=>{
        //    switch(event.key){
        //        case "z": this.container.position.x+=0.1; break
        //        case "s": this.container.position.x-=0.1; break
        //        case "q": this.container.position.z-=0.1; break
        //        case "d": this.container.position.z+=0.1; break
        //    }
        //}
        //document.addEventListener("keypress", this.key_handler)

        this.engine.runRenderLoop(()=>this.scene.render())
    }

    dispose(): void {
        document.removeEventListener("keypress", this.key_handler)
        this.engine.stopRenderLoop()
    }

}