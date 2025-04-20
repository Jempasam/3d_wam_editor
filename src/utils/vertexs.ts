import { AbstractMesh, Color4, FloatArray, Vector3, VertexBuffer } from "@babylonjs/core";

// https://www.webaudiomodules.com/community/plugins/burns-audio/envmod/screenshot.png

export function forEachBuffer(mesh: AbstractMesh, type:string, size:number, mapper:(array:FloatArray, i:number)=>void){
    const count = mesh.getTotalVertices()
    const buffer = mesh.getVerticesData(type)!!
    for(let i=0;i<count;i++){
        mapper(buffer,i*size)
    }
    mesh.setVerticesData(type, buffer)
}

export function colorizeMesh(mesh: AbstractMesh, from: Color4, to: Color4){
    const count = mesh.getTotalVertices()
    const colors = Array.from({length:count*4},()=>0)
    const positions = mesh.getVerticesData(VertexBuffer.PositionKind)!!
    const color = new Color4()
    const colorb = new Color4()
    for(let i=0;i<count;i++){
        const z = Math.max(0,Math.min(1,(positions[i*3+2]+.5)))
        color.copyFrom(from).scaleInPlace(1-z)
        colorb.copyFrom(to).scaleInPlace(z)
        color.addInPlace(colorb)
        
        colors[i*4] = color.r
        colors[i*4+1] = color.g
        colors[i*4+2] = color.b
        colors[i*4+3] = color.a
    }
    mesh.setVerticesData(VertexBuffer.ColorKind, colors)
}

export function uvFromDirection(mesh: AbstractMesh, u: Vector3, v: Vector3){
    const count = mesh.getTotalVertices()
    const uv = mesh.getVerticesData(VertexBuffer.UVKind)!!
    const positions = mesh.getVerticesData(VertexBuffer.PositionKind)!!
    for(let i=0;i<count;i++){
        const x = positions[i*3]+.5
        const y = positions[i*3+1]+.5
        const z = positions[i*3+2]+.5
        const uv0 = u.x*x + u.y*y + u.z*z
        const uv1 = v.x*x + v.y*y + v.z*z
        uv[i*2] = uv0
        uv[i*2+1] = uv1
    }
    mesh.setVerticesData(VertexBuffer.UVKind, uv)
}