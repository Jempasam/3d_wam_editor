import { PATH, PathCmd } from "../font/path_parsing.ts"
import { PATH_OPT } from "../font/path_simplifier.ts"
import { html } from "../utils/doc.ts"


const width = 300
const height = 300

// Container
const container = document.createElement('div')
container.style.width = `${width}px`
container.style.height = `${height}px`
container.style.position = 'relative'
container.style.border = '1px solid black'

// Création du canvas pour dessiner les points calculés
const canvas = document.createElement('canvas')
canvas.width = width
canvas.height = height
canvas.style.position = 'absolute'
container.appendChild(canvas)

// Création d'un conteneur SVG pour afficher la vraie courbe SVG
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
svg.setAttribute("width", width.toString())
svg.setAttribute("height", height.toString())
svg.style.position = 'absolute'
container.appendChild(svg)

// Saisie command svg
const textarea = document.createElement('textarea')
textarea.style.width = '600px'
textarea.style.height = '100px'
textarea.value = 'h 100'  // valeur initiale

// Saisie zoom 
const zoomInput = html.a`<input type=number value=1 min=0.10 max=2 step=0.1 />` as HTMLInputElement
zoomInput.style.width = '100px'
zoomInput.style.marginLeft = '10px'

document.body.replaceChildren(container, textarea, zoomInput)

const ctx = canvas.getContext('2d')!!
if (!ctx) throw new Error("Impossible d'obtenir le contexte 2D du canvas")

function drawPath() {
    const zoom = parseFloat(zoomInput.value)

    // Get path
    const pathStr = textarea.value.trim()
    const path = PATH.parse(pathStr)
    if (path.length === 0) return

    // Apply zoom and offset
    for (const cmd of path) {
        cmd.values = cmd.values.map((v: number) => Math.floor(v * zoom))
    }

    // Draw svg path
    svg.innerHTML = `
        <path d="${PATH.serialize(path).toUpperCase()}" stroke="black" stroke-width="2" fill="none"/>
    `

    console.log(PATH.serialize(path))
    // Draw graphics path
    

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'red'

    let xx=0
    let yy=0
    for(const cmd of path) {
        // Move
        if(cmd.type === 'm') {
            xx = cmd.values[0]
            yy = cmd.values[1]
            continue
        }

        // Curve
        const pointFn = PATH_OPT.getFn(cmd, [xx, yy])
        if (!pointFn) continue

        for (let t = 0; t <= 1; t += 0.05) {
            const [x, y] = pointFn(t)
            ctx.fillRect(x - 2, y - 2, 4, 4)
        }
        let last = pointFn(1)
        xx= last[0]
        yy= last[1]
    }
}

textarea.addEventListener('input', () => {
  drawPath()
})

zoomInput.addEventListener('input', () => {
    drawPath()
})

// Dessine la courbe initiale
drawPath()
