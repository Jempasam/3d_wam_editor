import { Color3, Color4, Mesh, Scene, StandardMaterial, Texture, TransformNode, Vector2 } from "@babylonjs/core"
import { MOValue } from "../../observable/collections/OValue.ts"
import { colorizeMesh, createSurface, createVolume } from "../vertexs.ts"
import { CSettings, CSettingsValue, CSettingsValues } from "../../control/controls/settings/settings.ts"

function createCircle(corner: number, offset: number=0){
    const points = []
    for(let i=0; i<corner; i++){
        const x = Math.cos(i*Math.PI*2/corner + offset)/2
        const y = Math.sin(i*Math.PI*2/corner + offset)/2
        points.push(new Vector2(x,y))
    }
    return points
}

function subdivide(points: Vector2[]): Vector2[]{
    const new_points = []
    for(let i=0; i<points.length; i++){
        const p1 = points[i]
        const p2 = points[(i+1)%points.length]
        const mid = p1.add(p2).scaleInPlace(0.5)
        new_points.push(p1, mid)
    }
    return new_points
}

export const DECORATION_SHAPE_POINTS = {
    "rectangle": subdivide([new Vector2(-.5,-.5), new Vector2(.5,-.5), new Vector2(.5,.5), new Vector2(-.5,.5)]),
    "triangle": subdivide([new Vector2(0,.5), new Vector2(-.5,-.5), new Vector2(.5,-.5)]),
    "circle": createCircle(32),
    "pentagon": subdivide(createCircle(5,Math.PI/2)),
    "hexagon": subdivide(createCircle(6)),
    "octagon": subdivide(createCircle(8,Math.PI/8)),
}

const noise = Array.from({length:100}, ()=>Math.random())

export const DECORATION_SHAPE_MODIFIER: Record<string,(from:Vector2, i: number)=>Vector2> = {
    "normal": it=>it.clone(),
    "up_wide": it=>new Vector2(it.x*((it.y+.5)*.8+.2), it.y),
    "down_wide": it=>new Vector2(it.x*((.5-it.y)*.8+.2), it.y),
    "right_wide": it=>new Vector2(it.x, it.y*((it.x+.5)*.8+.2)),
    "left_wide": it=>new Vector2(it.x, it.y*((.5-it.x)*.8+.2)),
    "noise": (it,i)=>new Vector2(it.x*(noise[i*2]*.3+.7), it.y*(noise[i*2+1]*.3+.7)),
    "thin": it=>new Vector2(it.x*(Math.abs(it.y)*2*.8+.2), it.y),
    "skew_right": it=>new Vector2(it.x+(it.y), it.y),
    "skew_left": it=>new Vector2(it.x+(it.y), it.y),
    "v": it=>new Vector2(it.x, it.y-.5+Math.abs(it.x)),
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
    readonly modifier = new MOValue<keyof typeof DECORATION_SHAPE_MODIFIER>("normal")
    readonly modifier_strength = new MOValue(.5)
    
    readonly outline_color = new MOValue("#000000")
    readonly outline_width = new MOValue(0)

    readonly height = new MOValue(1)
    readonly rotation = new MOValue(0)

    get current_shape(): Vector2[]{
        const points = DECORATION_SHAPE_POINTS[this.shape.value]
        const modifier = DECORATION_SHAPE_MODIFIER[this.modifier.value]
        const modified = points .map((it,i)=>modifier(it,i))
        const strength = this.modifier_strength.value
        const merged = Array.from({length:modified.length}, (_,i) => points[i].scale(1-strength).add(modified[i].scaleInPlace(strength)))
        return merged
    }

    createElement(): {element:HTMLElement, dispose():void}{
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
            const points = this.current_shape

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
            this.modifier.observable.add(updateShape),
            this.modifier_strength.observable.add(updateShape),
            this.outline_color.observable.add(updateOutline),
            this.outline_width.observable.add(updateOutline),
        ]
        updateShape()
        updateBackground()
        updateGradient()

        return {
            dispose: ()=> dispose.forEach(it=>it()),
            element: pad_element as any as HTMLElement,
        }
    }

    createScene(scene:Scene): {node:TransformNode, dispose():void}{
        const material = new StandardMaterial("mat", scene)
        material.diffuseColor = new Color3(1, 1, 1)
        material.specularColor = new Color3(0, 0, 0)

        let root = new TransformNode("decoration root",scene)
        let transform = new TransformNode("decoration transform",scene)
        transform.parent = root
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
                outline_mesh.position.set(0,-0.10,0)
                outline_mesh.rotation.setAll(0)
                const width = 1+this.outline_width.value
                outline_mesh.scaling.set(width,0.78,width)
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
                const points = this.current_shape
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
            const points = this.current_shape
            mesh = createVolume("decoration",scene,points)
 
            mesh!!.material = material
            mesh!!.setParent(transform)
            mesh!!.position.setAll(0)
            mesh!!.scaling.setAll(1)
            mesh!!.rotation.setAll(0)

            updateColor()
            updateFace()
            updateOutline()
            updateRotation()
        }

        const updateHeight = ()=>{
            transform.scaling.y = this.height.value
            transform.position.y = -(1-this.height.value)/2
        }

        const updateRotation = ()=>{
            mesh!!.rotation.y = this.rotation.value*Math.PI/180
        }


        const dispose = [
            this.top_color.observable.add(updateColor),
            this.bottom_color.observable.add(updateColor),
            this.face_color.observable.add(updateFaceColor),
            this.front_face.observable.add(updateFace),
            this.shape.observable.add(updateShape),
            this.modifier.observable.add(updateShape),
            this.modifier_strength.observable.add(updateShape),
            this.outline_color.observable.add(updateOutlineColor),
            this.outline_width.observable.add(updateOutline),
            this.height.observable.add(updateHeight),
            this.rotation.observable.add(updateRotation),
        ]

        updateShape()
        updateFace()
        updateHeight()
        updateRotation()

        return {
            node:root,
            dispose(){
                dispose.forEach(it=>it())
                material.dispose()
                transform.dispose()
                mesh?.dispose()
            }
        }
    }

    static SETTINGS: CSettings = {
        "Shape": {choice:Object.keys(DECORATION_SHAPE_POINTS)},
        "Top Color": "color",
        "Bottom Color": "color",
        "Outline Color": "color",
        "Outline Width": [0,1],
        "Front Face Image": "text",
        "Front Face Color": "color",
        "Modifier": {choice:Object.keys(DECORATION_SHAPE_MODIFIER)},
        "Modifier Strength": [0,1],
        "Height": [0.1,1],
        "Rotation": {min:0,max:360,step:1},
    }

    static SETTINGS_DEFAULTS: CSettingsValues = {
        "Shape": "rectangle",
        "Top Color": "#FFFFFF",
        "Bottom Color": "#AAAAAA",
        "Outline Color": "#000000",
        "Outline Width": 0,
        "Front Face Image": "",
        "Front Face Color": "#FFFFFF",
        "Modifier": "normal",
        "Modifier Strength": 0.5,
        "Height": 1,
        "Rotation": 0,
    }

    static SETTINGS_GETTERS: Record<string,(decoration:Decoration)=>CSettingsValue> = {
        "Shape" : it => it.shape.value,
        "Top Color": it => it.top_color.value,
        "Bottom Color": it => it.bottom_color.value,
        "Outline Color": it => it.outline_color.value,
        "Outline Width": it => it.outline_width.value,
        "Front Face Image": it => it.front_face.value ?? "",
        "Front Face Color": it => it.face_color.value,
        "Modifier": it => it.modifier.value,
        "Modifier Strength": it => it.modifier_strength.value,
        "Height": it => it.height.value,
        "Rotation": it => it.rotation.value,
    }

    static SETTINGS_SETTERS: Record<string,(decoration:Decoration, value:CSettingsValue)=>void> = {
        "Shape" : (it,value) => it.shape.value = value as DecorationShape,
        "Top Color": (it,value) => it.top_color.value = value as string,
        "Bottom Color": (it,value) => it.bottom_color.value = value as string,
        "Outline Color": (it,value) => it.outline_color.value = value as string,
        "Outline Width": (it,value) => it.outline_width.value = value as number,
        "Front Face Image": (it,value) => {
            const str = value as string
            it.front_face.value = str.length==0 ? null : str
        },
        "Front Face Color": (it,value) => it.face_color.value = value as string,
        "Modifier": (it,value) => it.modifier.value = value as keyof typeof DECORATION_SHAPE_MODIFIER,
        "Modifier Strength": (it,value) => it.modifier_strength.value = value as number,
        "Height": (it,value) => it.height.value = value as number,
        "Rotation": (it,value) => it.rotation.value = value as number,
    }

}