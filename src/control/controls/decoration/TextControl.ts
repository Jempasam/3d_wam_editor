import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core";
import { Control, ControlEnv, ControlFactory } from "../../Control.ts";
import { CSettings, CSettingsValue } from "../settings/settings.ts";
import { FONTS } from "../settings/field/FontSField.ts";
//@ts-ignore
import earcut from "earcut"
//@ts-ignore
window.earcut = earcut


/**
 * A text display control
 */
export class TextControl extends Control{

    updateValue(label: string, value: CSettingsValue){
        if(this.element)switch(label){
            case "Text": this.element.textContent = value as string; break
            case "Color": this.element.style.color = value as string; break
            case "Font": this.element.style.fontFamily = value as string; break
        }
        if(this.mesh)switch(label){
            case "Text": this.text = value as string; this.generateTextMesh(); break
            case "Font": this.font = value as string; this.generateTextMesh(); break
            case "Color": this.material!!.diffuseColor = Color3.FromHexString(value as string); break
            case "Outline Color": this.outlineMaterial!!.diffuseColor = Color3.FromHexString(value as string); break
            case "Outline Width": this.outlineWidth = value as number; this.generateTextMesh(); break
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
        this.element.style.textWrap="noWrap"
        const onresize = new ResizeObserver(()=>this.element!!.style.fontSize=this.element!!.clientHeight+"px")
        onresize.observe(this.element)
        return this.element
    }

    destroyElement(){
        this.element?.remove()
        this.element=undefined
    }
    
    scene: Scene|null = null
    transform: TransformNode|null = null
    material: StandardMaterial|null = null
    outlineMaterial: StandardMaterial|null = null

    override createNode(scene: Scene){
        const transform = new TransformNode("text_transform",scene)

        this.material = new StandardMaterial("text_material", scene)
        this.material.specularColor.set(0,0,0)

        this.outlineMaterial = new StandardMaterial("text_outline_material", scene)
        this.outlineMaterial.specularColor.set(0,0,0)

        this.transform = transform
        this.generateTextMesh()
        return transform
    }

    private text = "_"
    private outlineWidth = 0
    private font = Object.entries(FONTS)[0][0]
    
    private mesh: Mesh|null = null
    private outlineMesh: Mesh|null = null

    private generateTextMesh(){
        // Text Mesh
        if(this.mesh) this.mesh.dispose()

        const textMesh = MeshBuilder.CreateText("Text", this.text, FONTS[this.font].babylon, {size:.6, depth:.15, resolution:2}, this.transform!!.getScene())!!
        console.log(textMesh.getTotalIndices())
        textMesh.parent = this.transform
        textMesh.material = this.material!!
        textMesh.rotation.set(Math.PI/2,0,0)
        textMesh.position.set(0,-.37,-.25)
        this.mesh = textMesh

        // Outline Mesh
        if(this.outlineMesh){
            this.outlineMesh.dispose()
            this.outlineMesh = null
        }
        
        if(this.outlineWidth>0.001){
            const w = this.outlineWidth

            const outlineMesh1 = textMesh.clone()
            outlineMesh1.parent = null
            outlineMesh1.scaling.setAll(1)
            outlineMesh1.scaling.z=.8
            outlineMesh1.rotation.setAll(0)
            outlineMesh1.position.set(w,w,0)

            const outlineMesh2 = outlineMesh1.clone()
            outlineMesh2.position.set(-w,w,0)

            const outlineMesh3 = outlineMesh1.clone()
            outlineMesh3.position.set(0,-w,0)

            const outlineMesh = Mesh.MergeMeshes([outlineMesh1, outlineMesh2, outlineMesh3], true, false)!!
            ;[outlineMesh1, outlineMesh2, outlineMesh3].forEach(m=>m.dispose())
            outlineMesh.material = this.outlineMaterial!!
            outlineMesh.parent = this.transform
            outlineMesh.rotation.set(Math.PI/2,0,0)
            outlineMesh.position.set(0,-.37,-.25)
            this.outlineMesh = outlineMesh
        }
    }

    override destroyNode(){
        this.transform?.dispose()
        this.mesh?.dispose()
        this.outlineMesh?.dispose()
        this.material?.dispose()
        this.outlineMaterial?.dispose()
    }

    override destroy(){}

    static Factory = class _ implements ControlFactory {

        constructor(public env: ControlEnv){}
        
        label = "Text"
        
        description = "A text display."

        getSettings(): CSettings{
            return {
                Text: "text", 
                Color: "color", 
                Font: "font",
                "Outline Color": "color",
                "Outline Width": [0,.1],
            }
        }
    
        getDefaultValues = ()=>({
            Text: "Text", 
            Color: "#000000",
            "Outline Color": "#ffffff",
            "Outline Width": 0,
            Font: Object.entries(FONTS)[0][0], 
        })

        async create(): Promise<Control> {
            return new TextControl(this)
        }

    }

    static Type = async (env: ControlEnv) => new this.Factory(env)
}