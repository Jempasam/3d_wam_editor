import { IFontData, Mesh, MeshBuilder, Scene } from "@babylonjs/core";
import { Control } from "../Control.ts";
import { WebAudioModule } from "@webaudiomodules/api";
import { ControlSettings } from "../settings.ts";


/**
 * A text display control
 */
export class TextControl extends Control{

    static name = "Test Control"

    constructor(wam: WebAudioModule|null){
        super(wam)
    }

    static getSettings(): ControlSettings{
        return {
            Text: "text", 
            Color: "color", 
            Font: "font", 
            Size: {min:0.1, max:10, step:0.1},
            Weight: {min:100, max:900, step:100},
        }
    }

    static getDefaultValues = ()=>({
        Text: "Text", 
        Color: "#000000", 
        Font: "Arial", 
        Size: "1",
        Weight: "400",
    })

    setValue(label: string, value: string){
        if(this.element)switch(label){
            case "Text": this.element.textContent = value; break
            case "Color": this.element.style.color = value; break
            case "Font": this.element.style.fontFamily = value; break
            case "Size": this.element.style.fontSize = value+"rem"; break
            case "Weight": this.element.style.fontWeight = value; break
        }
    }

    getValue(label: string){
        switch(label){
            case "Text": return this.element?.textContent ?? undefined
            case "Color": return cssRgbToHex(this.element?.style.color??"") ?? undefined
            case "Font": return this.element?.style.fontFamily ?? undefined
            case "Size": return this.element?.style.fontSize.replace("rem","") ?? undefined
            case "Weight": return this.element?.style.fontWeight ?? undefined
        }
    }

    private element?: HTMLElement
    
    createElement(){
        this.element = document.createElement("div")
        this.element.style.display="block"
        this.element.style.width="100%"
        this.element.style.height="100%"
        this.element.style.boxSizing="border-box";
        this.element.style.textAlign="center"
        this.element.style.verticalAlign="middle"
        return this.element
    }

    destroyElement(){
        this.element?.remove()
        this.element=undefined
    }

    override createNode(scene: Scene){
        const ret = MeshBuilder.CreateText("test", "Salade", {} as IFontData, {size:1}, scene)
        return ret as Mesh
    }

    override destroyNode(){}

    override destroy(){}
}

function cssRgbToHex(rgb: string){
    let rgba = rgb.match(/\d+/g) ?? []
    return "#" + rgba.map(v=>parseInt(v).toString(16).padStart(2,"0")).join("") 
}