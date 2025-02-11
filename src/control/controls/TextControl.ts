import { Color3, IFontData, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import { Control } from "../Control.ts";
import { WebAudioModule } from "@webaudiomodules/api";
import { ControlSettings, FONTS } from "../settings.ts";

//@ts-ignore
window.earcut = (await import("earcut")).default

/**
 * A text display control
 */
export class TextControl extends Control{

    static name = "Text Control"

    constructor(wam: WebAudioModule|null){
        super(wam)
    }

    static getSettings(): ControlSettings{
        return {
            Text: "text", 
            Color: "color", 
            Font: "font", 
        }
    }

    static getDefaultValues = ()=>({
        Text: "Text", 
        Color: "#000000", 
        Font: Object.entries(FONTS)[0][0], 
    })

    setValue(label: string, value: string){
        if(this.element)switch(label){
            case "Text": this.element.textContent = value; break
            case "Color": this.element.style.color = value; break
            case "Font": this.element.style.fontFamily = value; break
        }
        if(this.mesh)switch(label){
            case "Text": this.text = value; this.generateTextMesh(); break
            case "Font": this.font = value; this.generateTextMesh(); break
            case "Color": (this.mesh.material as StandardMaterial).diffuseColor = Color3.FromHexString(value); break
        }
    }

    getValue(label: string){
        switch(label){
            case "Text": return this.element?.textContent ?? undefined
            case "Color": return cssRgbToHex(this.element?.style.color??"") ?? undefined
            case "Font": return this.element?.style.fontFamily ?? undefined
        }
    }

    private element?: HTMLElement
    
    createElement(){
        this.element = document.createElement("div")
        this.element.style.display="flex"
        this.element.style.width="100%"
        this.element.style.height="100%"
        this.element.style.boxSizing="border-box";
        this.element.style.justifyContent="center"
        this.element.style.alignItems="center"
        const onresize = new ResizeObserver((entries)=>this.element!!.style.fontSize=this.element!!.clientHeight+"px")
        onresize.observe(this.element)
        return this.element
    }

    destroyElement(){
        this.element?.remove()
        this.element=undefined
    }
    
    scene: Scene|null = null
    transform: TransformNode|null = null
    mesh: Mesh|null = null

    private text = "_"
    private font = Object.entries(FONTS)[0][0]
    override createNode(scene: Scene){
        const transform = new TransformNode("text_transform",scene)
        this.transform = transform
        this.generateTextMesh()
        return transform
    }

    private generateTextMesh(){
        if(this.transform){
            const old_material= this.mesh?.material
            const old_scaling= this.mesh?.scaling
            if(this.mesh) this.mesh.dispose()
            const ret = MeshBuilder.CreateText("Text", this.text, FONTS[this.font].babylon, {size:.6, depth:.15}, this.transform.getScene())!!
            ret.rotation.set(Math.PI/2,0,0)
            ret.position.set(0,-.37,-.25)
            ret.parent = this.transform
            if(old_material)ret.material = old_material
            else{
                const mat = ret.material = new StandardMaterial("text_material", this.transform.getScene())
                mat.specularColor.set(0,0,0)
            } 
            if(old_scaling)ret.scaling.copyFrom(old_scaling)
            this.mesh = ret
        }
    }

    override destroyNode(){
        this.transform?.dispose()
    }

    override destroy(){}
}

function cssRgbToHex(rgb: string){
    let rgba = rgb.match(/\d+/g) ?? []
    return "#" + rgba.map(v=>parseInt(v).toString(16).padStart(2,"0")).join("") 
}