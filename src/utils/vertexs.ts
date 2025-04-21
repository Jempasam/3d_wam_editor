import { AbstractMesh, Color4, FloatArray, Mesh, MeshBuilder, Scene, Vector2, Vector3, VertexBuffer, VertexData } from "@babylonjs/core";

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

export function createSurface(name:string, scene:Scene, points:Vector2[]){
    const indices = []
    const positions = []
    const normals = []
    const uvs = []
    const colors = []

    for(const point of points){
        positions.push(point.x,0,point.y)
        normals.push(0,1,0)
        uvs.push(point.x+.5,point.y+.5)
        colors.push(1,1,1,1)
    }

    for(let i=0; i<points.length-2; i++){
        indices.push(0,i+1,i+2)
    }

    
    const vertexData = new VertexData()
    vertexData.indices = indices
    vertexData.positions = positions
    vertexData.normals = normals
    vertexData.uvs = uvs
    vertexData.colors = colors
    
    const mesh = new Mesh(name, scene)
    vertexData.applyToMesh(mesh, true)

    return mesh
}

export function createVolume(name:string, scene:Scene, points:Vector2[]){
    const indices = []
    const positions = []
    const normals = []
    const uvs = []
    const colors = []


    for(const point of points){
        positions.push(point.x,.5,point.y)
        normals.push(0,1,0)
        uvs.push(point.x+.5, point.y+.5)
        colors.push(1,1,1,1)
    }

    for(let i=0; i<points.length-2; i++){
        indices.push(0,i+1,i+2)
    }
    

    let pt = positions.length/3

    for(const point of points){
        positions.push(point.x,-.5,point.y)
        normals.push(0,-1,0)
        uvs.push(point.x+.5, point.y+.5)
        colors.push(1,1,1,1)
    }

    for(let i=0; i<points.length-2; i++){
        indices.push(pt+0, pt+i+2, pt+i+1)
    }

    
    pt = positions.length/3

    for(let p=0; p<points.length; p++){
        const point1 = points[p]
        const point2 = points[(p+1)%points.length]

        let ox = point2.x-point1.x
        let oy = point2.y-point1.y
        let d = Math.sqrt(ox*ox+oy*oy)
        ox/=d
        oy/=d
        const nx = oy
        const ny = -ox 
        
        positions.push(
            point1.x, .5, point1.y,
            point2.x, .5, point2.y,
            point2.x, -.5, point2.y,

            point2.x, -.5, point2.y,
            point1.x, -.5, point1.y,
            point1.x, .5, point1.y,
        )
        normals.push(
            nx, 0, ny,
            nx, 0, ny,
            nx, 0, ny,

            nx, 0, ny,
            nx, 0, ny,
            nx, 0, ny,
        )
        uvs.push(
            point1.x+.5, point1.y+.5,
            point2.x+.5, point2.y+.5,
            point2.x+.5, point2.y+.5,

            point2.x+.5, point2.y+.5,
            point1.x+.5, point1.y+.5,
            point1.x+.5, point1.y+.5,
        )
        colors.push(
            1,1,1,1,
            1,1,1,1,
            1,1,1,1,

            1,1,1,1,
            1,1,1,1,
            1,1,1,1,
        )
    }

    for(let i=0; i<points.length; i++){
        let p = pt + i*6
        indices.push(
            p+0, p+2, p+1,
            p+3, p+5, p+4,
        )
    }
    
    

    const vertexData = new VertexData()
    vertexData.indices = indices
    vertexData.positions = positions
    vertexData.normals = normals
    vertexData.uvs = uvs
    vertexData.colors = colors
    
    const mesh = new Mesh(name, scene)
    vertexData.applyToMesh(mesh, true)

    return mesh
}