import { CreateText, Engine, IFontData, Scene, StandardMaterial } from "@babylonjs/core"

// @ts-ignore
window.earcut = (await import('earcut')).default

// Open a font from file prompt
const fileInput = document.createElement('input')
fileInput.type = 'file'
fileInput.accept = '.json'
fileInput.multiple = true
document.body.replaceChildren(fileInput)

const files = [...(await new Promise<FileList|null>((resolve) => fileInput.addEventListener('change', ()=>resolve(fileInput.files), {once:true})))??[]]

const jsons = await Promise.all(files.map(it=>it.text().then(JSON.parse))) as IFontData[]

for(const json of jsons) for(let i=0; i<0; i++) simplifyFont(json)

const text = JSON.stringify(jsons[0], null)
window.open(URL.createObjectURL(new Blob([text], {type: 'application/json'})), '_blank')
console.log(text.length)

// Show
const title = document.createElement('h1')
const canvas = document.createElement('canvas')
canvas.style.width = '100%'
canvas.style.height = '100%'
document.body.replaceChildren(title, canvas)

const engine = new Engine(canvas, true)
const scene = new Scene(engine)
scene.createDefaultEnvironment()

scene.createDefaultCamera(true)

const textMesh = CreateText("test", "Hello World", jsons[0],{size:8,resolution:2})!!
const textMat  = textMesh.material = new StandardMaterial("textMat", scene)
title.innerHTML = `Vertex Count : ${textMesh?.getTotalVertices()}`

engine.runRenderLoop(() => {
    scene.render()
})

window.onkeydown = (e) => {
    if(e.key == 'Escape')textMat.wireframe = !textMat.wireframe
}

// Lib
function simplifyFont(data: IFontData, leaveness = 1){
    for(const glyph in data.glyphs){
        data.glyphs[glyph].o = simplify(data.glyphs[glyph].o, leaveness)
    }
}

function simplify(curve: string, leaveness = 1): string{
    let ret = ""
    let last_is_curve = 0
    let i = 0
    while(i < curve.length){
        const char = curve[i]
        let after = find(curve, i+1, /[a-z]/)
        after = after == -1 ? curve.length : after
        if(char=='q'||char=="c"||char=="b"||char=="l"){
            if(last_is_curve<leaveness){
                ret += curve.substring(i, after)
                last_is_curve++
            }
            else last_is_curve = 0
        }
        else {
            ret += curve.substring(i, after)
            last_is_curve = 0
        }
        i = after
    }
    return ret
}

function find(str: string, start: number, regex: RegExp){
    for(let i = start; i < str.length; i++){
        if(regex.test(str[i])) return i
    }
    return -1
}