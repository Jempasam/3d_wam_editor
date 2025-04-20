import { Color3, Color4, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, TransformNode, Vector3, VertexBuffer } from "@babylonjs/core"
import { MOValue } from "../../observable/collections/OValue.ts"
import { colorizeMesh, forEachBuffer, uvFromDirection } from "../vertexs.ts"

export type DecorationShape = "rectangle"
    | "circle"
    | "triangle"

export class Decoration{

    readonly top_color = new MOValue("#aaaaaa")
    readonly bottom_color = new MOValue("#ffffff")

    readonly front_face = new MOValue<string|null>(null)
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
            <circle cx="50" cy="50" r="50" fill="transparent"/>
            <circle cx="50" cy="50" r="50" fill="transparent"/>
            <circle cx="50" cy="50" r="50" fill="transparent"/>
            <circle cx="50" cy="50" r="50" fill="transparent"/>
            <circle cx="50" cy="50" r="50" fill="transparent"/>
        `
        let background = pad_element.children[0] as SVGElement
        let shape = pad_element.children[1] as SVGElement
        let shadows = Array.from({length:4}, (_,i)=>pad_element.children[1+i] as SVGElement)

        const updateBackground = ()=>{
            if(this.front_face.value){
                background.outerHTML=/*html*/`
                    <pattern id="${id}gradient" patternUnits="userSpaceOnUse" width="100" height="100">
                        <image preserveAspectRatio=none href="${this.front_face.value}" x="0" y="0" width="100" height="100" />
                    </pattern>
                `
            }
            else{
                background.outerHTML=/*html*/`
                    <linearGradient id="${id}gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-color="${this.top_color.value}" />
                        <stop offset="100%" stop-color="${this.bottom_color.value}" />
                    </linearGradient>
                `
            }
            background = pad_element.children[0] as SVGElement
        }

        const updateOutline = ()=>{
            if(this.outline_width.value>0){
                shape.setAttribute("stroke", this.outline_color.value)
                shape.setAttribute("stroke-width", Math.round(this.outline_width.value*100).toString())
            }
            else{
                shape.removeAttribute("stroke")
                shape.removeAttribute("stroke-width")
            }
        }

        const updateShape = ()=>{
            let shape_fn: (size:number, fill:string)=>string
            if(this.shape.value=="rectangle"){
                shape_fn = (padding,content)=>{
                    const tsize = 100-padding
                    const toffset = Math.round((100-tsize)/2)
                    return `<rect x="${toffset}" y="${toffset}" width="${tsize}" height="${tsize}" ${content} />`
                }
            }
            else if(this.shape.value=="circle"){
                shape_fn = (padding,content)=>{
                    const tsize = 100-padding
                    return `<circle cx="50" cy="50" r="${tsize/2}" ${content} />`
                }
            }
            else if(this.shape.value=="triangle"){
                shape_fn = (padding,content)=>{
                    const tsize = 100-padding
                    const toffset = Math.round((100-tsize)/2)
                    return `<polygon points="${toffset},${toffset+tsize} ${toffset+tsize},${toffset+tsize} ${toffset+tsize/2},${toffset}" ${content} />`
                }
            }
            else shape_fn = ()=>{return ""}
            shape.outerHTML = shape_fn(0, `fill="url(#${id}gradient)"`)
            ;[18,10,5,2].forEach((s,i)=>{
                shadows[i].outerHTML = shape_fn(s, `stroke="rgba(0,0,0,.1)" stroke-width="${s}" fill=transparent`)
            })
            shape = pad_element.children[1] as SVGElement
            shadows = Array.from({length:4}, (_,i)=>pad_element.children[1+i] as SVGElement)

            updateOutline()
        }

        const dispose = [
            this.top_color.observable.add(updateBackground),
            this.bottom_color.observable.add(updateBackground),
            this.front_face.observable.add(updateBackground),
            this.shape.observable.add(updateShape),
            this.outline_color.observable.add(updateOutline),
            this.outline_width.observable.add(updateOutline),
        ]
        updateShape()
        updateBackground()

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
                outline_mesh = mesh!!.clone("outline")
                outline_mesh.makeGeometryUnique()
                outline_mesh.parent = mesh
                outline_mesh.position.set(0,-0.25,0)
                outline_mesh.rotation.setAll(0)
                const width = 1+this.outline_width.value
                outline_mesh.scaling.set(width,0.5,width)
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
                if(this.shape.value=="rectangle"){
                    face =  MeshBuilder.CreatePlane("wampad face", {size: 1.}, scene)
                }
                else if(this.shape.value=="circle"){
                    face = MeshBuilder.CreateDisc("wampad", {radius:.5, sideOrientation:Math.PI}, scene)
                    face.bakeCurrentTransformIntoVertices()
                    forEachBuffer(face, VertexBuffer.UVKind, 2, (array,i)=>array[i+1]=1-array[i+1])
                }
                else if(this.shape.value=="triangle"){
                    face = MeshBuilder.CreateDisc("wampad", {radius:.5, tessellation:3}, scene)
                    face.rotation.z = -Math.PI/6
                    face.bakeCurrentTransformIntoVertices()
                    face.scaling.x = 1.1
                    face.scaling.y = 1.3
                    face.position.y = -.15
                    face.bakeCurrentTransformIntoVertices()
                    uvFromDirection(face, new Vector3(1,0,0), new Vector3(0,1,0))
                }
                face!!.parent = mesh
                face!!.position.y = 0.510
                face!!.rotation.x = Math.PI/2
                const faceMaterial = face!!.material = new StandardMaterial("wampad face mat", scene)
                const texture = new Texture(this.front_face.value)
                faceMaterial.diffuseTexture = texture
                faceMaterial.specularColor = new Color3(0, 0, 0)
            }
        }

        const updateShape = ()=>{
            mesh?.dispose()
            if(this.shape.value=="rectangle"){
                mesh =  MeshBuilder.CreateBox("wampad", {size: 1., height:1}, scene)
            }
            else if(this.shape.value=="circle"){
                mesh = MeshBuilder.CreateCylinder("wampad", {diameter:1, height:1}, scene)
            }
            else if(this.shape.value=="triangle"){
                mesh = MeshBuilder.CreateCylinder("wampad", {diameter:1, height:1, tessellation:3}, scene)
                mesh.rotation.y = Math.PI/6
                mesh.bakeCurrentTransformIntoVertices()
                mesh.scaling.x = 1.1
                mesh.scaling.z = 1.3
                mesh.position.z = -.15
                mesh.bakeCurrentTransformIntoVertices()
            }
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

}