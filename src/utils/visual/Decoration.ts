import { Color3, Color4, Mesh, Scene, StandardMaterial, Texture, TransformNode, Vector2 } from "@babylonjs/core"
import { MOValue } from "../../observable/collections/OValue.ts"
import { colorizeMesh, createSurface, createVolume } from "../vertexs.ts"
import { CSettings, CSettingsValue } from "../../control/controls/settings/settings.ts"
import { DefaultCSettingsValues } from "../../control/Control.ts"

function createCircle(corner: number, offset: number=0){
    const points = []
    for(let i=0; i<corner; i++){
        const x = Math.cos(i*Math.PI*2/corner + offset)/2
        const y = Math.sin(i*Math.PI*2/corner + offset)/2
        points.push(new Vector2(x,y))
    }
    return points
}

export const DECORATION_SHAPE_POINTS = {
    "rectangle": [new Vector2(-.5,-.5), new Vector2(.5,-.5), new Vector2(.5,.5), new Vector2(-.5,.5)],
    "triangle": [new Vector2(0,.5), new Vector2(-.5,-.5), new Vector2(.5,-.5)],
    "circle": createCircle(32),
    "pentagon": createCircle(5,Math.PI/2),
    "hexagon": createCircle(6),
    "octagon": createCircle(8,Math.PI/8),
}

export const DECORATION_IMAGES = {} as Record<string,string>
for(const [file, url] of Object.entries(import.meta.glob<any>("../../../media/images/*.png"))){
    const file_full_name = file.split("/").pop() ?? ""
    const [name,_] = file_full_name.split(".")
    DECORATION_IMAGES[name] = (await url()).default  as string
}

export type DecorationShape = keyof typeof DECORATION_SHAPE_POINTS

export type DecorationImage = (keyof typeof DECORATION_IMAGES)|string

export class Decoration{

    readonly top_color = new MOValue("#aaaaaa")
    readonly bottom_color = new MOValue("#ffffff")
    readonly face_color = new MOValue("#ffffff")

    readonly front_face = new MOValue<DecorationImage|null>(null)
    readonly shape = new MOValue<DecorationShape>("rectangle")
    
    readonly outline_color = new MOValue("#000000")
    readonly outline_width = new MOValue(0)

    createElement(): {element:Element, dispose():void}{
        const id = `${Math.random().toString(16)}${Math.random().toString(16)}${Math.random().toString(16)}`

        const pad_element = document.createElementNS("http://www.w3.org/2000/svg","svg")
        pad_element.setAttribute("viewBox", "0 0 100 100")
        pad_element.setAttribute("preserveAspectRatio","none")
        pad_element.innerHTML = /*html*/`
            <linearGradient id="${id}gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="red" />
                <stop offset="100%" stop-color="blue" />
            </linearGradient>
            <pattern id="${id}pattern" patternUnits="userSpaceOnUse" width="100" height="100">
                <rect preserveAspectRatio=none x="0" y="0" width="100" height="100" fill="url(#${id}gradient)" />
                <image preserveAspectRatio=none href="" x="0" y="0" width="100" height="100" />
            </pattern>
            <circle cx="50" cy="50" r="50" fill="transparent"/>
            <circle cx="50" cy="50" r="50" fill="transparent"/>
            <circle cx="50" cy="50" r="50" fill="transparent"/>
            <circle cx="50" cy="50" r="50" fill="transparent"/>
            <circle cx="50" cy="50" r="50" fill="transparent"/>
        `
        const gradient = pad_element.children[0] as SVGGradientElement
        const pattern = pad_element.children[1] as SVGPatternElement 
        const image = pattern.children[1] as SVGImageElement
        let shape = pad_element.children[2] as SVGElement
        let shadows = Array.from({length:4}, (_,i)=>pad_element.children[3+i] as SVGElement)

        const updateGradient = ()=>{
            gradient.innerHTML = /*html*/`
                <stop offset="0%" stop-color="${this.top_color.value}" />
                <stop offset="100%" stop-color="${this.bottom_color.value}" />
            `
        }

        const updateBackground = ()=>{
            if(this.front_face.value){
                const url = DECORATION_IMAGES[this.front_face.value] ?? this.front_face.value
                image.setAttribute("href", url)
                pattern.appendChild(image)
            }
            else{
                image.remove()
            }
        }

        const updateOutline = ()=>{
            if(this.outline_width.value>0){
                shape.setAttribute("stroke", this.outline_color.value)
                shape.setAttribute("stroke-width", Math.round(this.outline_width.value*50).toString())
            }
            else{
                shape.removeAttribute("stroke")
                shape.removeAttribute("stroke-width")
            }
        }

        const updateShape = ()=>{
            let shape_fn: (size:number, fill:string)=>string
            const points = DECORATION_SHAPE_POINTS[this.shape.value]

            shape_fn = (padding,content)=>{
                const tsize = 100-padding
                const pts = points
                    .map(({x,y})=>[50+x*tsize, 50-y*tsize])
                    .map(([x,y])=>`${x},${y}`)
                    .join(" ")
                return  `<polygon points="${pts}" ${content} />`
            }

            shape.outerHTML = shape_fn(0, `fill="url(#${id}pattern)"`)
            ;[18,10,5,2].forEach((s,i)=>{
                shadows[i].outerHTML = shape_fn(s, `stroke="rgba(0,0,0,.1)" stroke-width="${s}" fill=transparent`)
            })
            shape = pad_element.children[2] as SVGElement
            shadows = Array.from({length:4}, (_,i)=>pad_element.children[3+i] as SVGElement)

            updateOutline()
        }

        const dispose = [
            this.top_color.observable.add(updateGradient),
            this.bottom_color.observable.add(updateGradient),
            this.front_face.observable.add(updateBackground),
            this.shape.observable.add(updateShape),
            this.outline_color.observable.add(updateOutline),
            this.outline_width.observable.add(updateOutline),
        ]
        updateShape()
        updateBackground()
        updateGradient()

        return {
            dispose: ()=> dispose.forEach(it=>it()),
            element: pad_element as Element,
        }
    }

    createScene(scene:Scene): {node:TransformNode, dispose():void}{
        const material = new StandardMaterial("mat", scene)
        material.diffuseColor = new Color3(1, 1, 1)
        material.specularColor = new Color3(0, 0, 0)

        let transform = new TransformNode("decoration",scene)
        let mesh = null as Mesh|null
        let outline_mesh = null as Mesh|null

        const updateColor = ()=>{
            const bottom = Color4.FromHexString(this.bottom_color.value)
            const top = Color4.FromHexString(this.top_color.value)
            colorizeMesh(mesh!!, bottom, top)
        }

        const updateOutlineColor = ()=>{
            if(outline_mesh!=null){
                const color = Color4.FromHexString(this.outline_color.value)
                colorizeMesh(outline_mesh,color,color)
            }
        }

        const updateOutline = ()=>{
            outline_mesh?.dispose()
            outline_mesh = null
            if(this.outline_width.value>0){
                outline_mesh = mesh!!.clone("outline", undefined, true)
                outline_mesh.makeGeometryUnique()
                outline_mesh.parent = mesh
                outline_mesh.position.set(0,-0.25,0)
                outline_mesh.rotation.setAll(0)
                const width = 1+this.outline_width.value
                outline_mesh.scaling.set(width,0.48,width)
            }
            updateOutlineColor()
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
                const url = DECORATION_IMAGES[this.front_face.value] ?? this.front_face.value
                const points = DECORATION_SHAPE_POINTS[this.shape.value]
                face = createSurface("wampad face",scene,points)
                face!!.parent = mesh
                face!!.position.y = 0.510
                const faceMaterial = face!!.material = new StandardMaterial("wampad face mat", scene)
                const texture = new Texture(url)
                texture.hasAlpha = true
                faceMaterial.diffuseTexture = texture
                faceMaterial.specularColor = new Color3(0, 0, 0)
                updateFaceColor()
            }
        }

        const updateFaceColor = ()=>{
            if(face!=null){
                const color = Color4.FromHexString(this.face_color.value)
                colorizeMesh(face, color, color)
            }
        }

        const updateShape = ()=>{
            mesh?.dispose()
            const points = DECORATION_SHAPE_POINTS[this.shape.value]
            mesh = createVolume("decoration",scene,points)
 
            mesh!!.material = material
            mesh!!.setParent(transform)
            mesh!!.position.setAll(0)
            mesh!!.scaling.setAll(1)
            mesh!!.rotation.setAll(0)

            updateColor()
            updateFace()
            updateOutline()
        }

        const dispose = [
            this.top_color.observable.add(updateColor),
            this.bottom_color.observable.add(updateColor),
            this.face_color.observable.add(updateFaceColor),
            this.front_face.observable.add(updateFace),
            this.shape.observable.add(updateShape),
            this.outline_color.observable.add(updateOutlineColor),
            this.outline_width.observable.add(updateOutline),
        ]

        updateShape()
        updateFace()

        return {
            node:transform,
            dispose(){
                dispose.forEach(it=>it())
                material.dispose()
                transform.dispose()
                mesh?.dispose()
            }
        }
    }

    static getSettings(): CSettings{
        return {
            "Shape": {choice:Object.keys(DECORATION_SHAPE_POINTS)},
            "Top Color": "color",
            "Bottom Color": "color",
            "Outline Color": "color",
            "Outline Width": [0,1],
            "Front Face Image": "text",
            "Front Face Color": "color",
        }
    }

    static getDefaultValues(): DefaultCSettingsValues{
        return {
            "Shape": "rectangle",
            "Top Color": "#FFFFFF",
            "Bottom Color": "#AAAAAA",
            "Outline Color": "#000000",
            "Outline Width": 0,
            "Front Face Image": "",
            "Front Face Color": "#FFFFFF",
        }
    }

    updateValue(label: string, value: CSettingsValue){
        switch(label){
            case "Shape":
                this.shape.value = value as "rectangle"|"triangle"|"circle"
                break
            case "Top Color":
                this.top_color.value = value as string
                break
            case "Bottom Color":
                this.bottom_color.value = value as string
                break
            case "Border Color":
                this.front_face.value = value as string
                break
            case "Outline Width":
                this.outline_width.value = value as number
                break
            case "Outline Color":
                this.outline_color.value = value as string
                break
            case "Front Face Image":
                const str = value as string
                this.front_face.value = str.length==0 ? null : str
                break
            case "Front Face Color":
                this.face_color.value = value as string
                break
                
        }
    }

}