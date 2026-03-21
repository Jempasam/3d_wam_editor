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

const oldFonts = structuredClone(jsons)
for(const json of jsons) for(let i=0; i<1; i++) simplifyFont(json,2,.5,.1,8)

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

title.textContent = ""
for(const [json,y] of [[oldFonts,6], [jsons,-6]] as [IFontData[],number][]){
    const textMesh = CreateText("test", "Hello World", json[0],{size:8,resolution:1})!!
    const textMat  = textMesh.material = new StandardMaterial("textMat", scene)
    title.textContent += ` Vertex Count : ${textMesh?.getTotalVertices()}`
    textMesh.position.y = y
}

engine.runRenderLoop(() => {
    scene.render()
})

window.onkeydown = (e) => {
    if(e.key == 'Escape')textMat.wireframe = !textMat.wireframe
}

// Lib
/*
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
}*/
type Cmd = { type: string; values: number[] };
type Point = [number, number];

function simplifyFont(
  data: IFontData,
  windowSize: number,
  curveThreshold: number,
  lineThreshold: number,
  samplesPerSeg = 8
) {
  for (const key in data.glyphs) {
    const glyph = data.glyphs[key];
    const cmds = parsePath(glyph.o);
    const out: Cmd[] = [];
    const buffer: Cmd[] = [];

    const flushBuffer = () => {
      while (buffer.length) out.push(buffer.shift()!);
    };

    for (let idx = 0; idx < cmds.length; idx++) {
      const cmd = cmds[idx];
      const t = cmd.type;

      // m ou z : rupture, on flush et on émet direct
      if (t === 'm' || t === 'z') {
        flushBuffer();
        out.push(cmd);
        continue;
      }

      // push dans le buffer
      buffer.push(cmd);
      if (buffer.length > windowSize) buffer.shift();

      // on n'essaie de simplifier que si on a au moins 2 commandes dans le buffer
      if (buffer.length < 2) continue;

      // on génère les points de la séquence
      const pts = flattenSequence(buffer, samplesPerSeg);

      // essai ligne
      const lineErr = fitLineError(pts);
      if (lineErr <= lineThreshold) {
        const last = pts[pts.length - 1];
        buffer.length = 0;
        out.push({ type: 'l', values: [last[0], last[1]] });
        continue;
      }

      // essai quad Bézier
      const { ctrl, err: curveErr } = fitQuadraticBezier(pts);
      if (curveErr <= curveThreshold) {
        const P2 = pts[pts.length - 1];
        buffer.length = 0;
        out.push({ type: 'q', values: [ctrl[0], ctrl[1], P2[0], P2[1]] });
        continue;
      }

      // sinon, si buffer plein, on émet plus ancien
      if (buffer.length === windowSize) {
        out.push(buffer.shift()!);
      }
    }

    // flush final
    flushBuffer();
    glyph.o = serializePath(out);
  }

  // — Helpers —  

  function parsePath(path: string): Cmd[] {
    const re = /([mlqcz])([^mlqcz]*)/g;
    const res: Cmd[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(path))) {
      const type = m[1];
      const vals = m[2]
        .trim()
        .replace(/0$/, '')
        .split(/[\s,]+/)
        .filter(s => s.length > 0)
        .map(Number);
      res.push({ type, values: vals });
    }
    return res;
  }

  function serializePath(cmds: Cmd[]): string {
    return cmds
      .map(c =>
        c.type === 'z' ? 'z' : `${c.type} ${c.values.join(' ')}`
      )
      .join(' ')
      .trim();
  }

  function flattenSequence(seq: Cmd[], samples: number): Point[] {
    const pts: Point[] = [];
    let cur: Point = [0, 0];
    for (const c of seq) {
      const t = c.type, v = c.values;
      if (t === 'm' || t === 'l') {
        for (let i = 0; i < v.length; i += 2) {
          cur = [v[i], v[i + 1]];
          pts.push(cur);
        }
      } else if (t === 'q') {
        const [cx, cy, x2, y2] = v;
        const P0 = cur, C: Point = [cx, cy], P2: Point = [x2, y2];
        for (let j = 1; j <= samples; j++) {
          const u = 1 - j / samples, t2 = j / samples;
          pts.push([
            u * u * P0[0] + 2 * u * t2 * C[0] + t2 * t2 * P2[0],
            u * u * P0[1] + 2 * u * t2 * C[1] + t2 * t2 * P2[1],
          ]);
        }
        cur = P2;
      } else if (t === 'c') {
        const [c1x, c1y, c2x, c2y, x2, y2] = v;
        const P0 = cur, C1: Point = [c1x, c1y], C2: Point = [c2x, c2y], P2: Point = [x2, y2];
        for (let j = 1; j <= samples; j++) {
          const u = 1 - j / samples, t2 = j / samples;
          pts.push([
            u * u * u * P0[0] + 3 * u * u * t2 * C1[0] + 3 * u * t2 * t2 * C2[0] + t2 * t2 * t2 * P2[0],
            u * u * u * P0[1] + 3 * u * u * t2 * C1[1] + 3 * u * t2 * t2 * C2[1] + t2 * t2 * t2 * P2[1],
          ]);
        }
        cur = P2;
      }
      // z on ne l'échantillonne pas
    }
    return pts;
  }

  function fitLineError(pts: Point[]): number {
    const [x0, y0] = pts[0], [x1, y1] = pts[pts.length - 1];
    const dx = x1 - x0, dy = y1 - y0;
    let max = 0;
    for (const [x, y] of pts) {
      const dist = Math.abs(dy * x - dx * y + x1 * y0 - y1 * x0) / Math.hypot(dy, dx);
      max = Math.max(max, dist);
    }
    return max;
  }

  function fitQuadraticBezier(pts: Point[]): { ctrl: Point; err: number } {
    const n = pts.length;
    const P0 = pts[0], P2 = pts[n - 1];
    let numX = 0, numY = 0, den = 0;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), u = 1 - t, b = 2 * u * t;
      numX += b * (pts[i][0] - (u * u * P0[0] + t * t * P2[0]));
      numY += b * (pts[i][1] - (u * u * P0[1] + t * t * P2[1]));
      den += b * b;
    }
    const Cx = numX / den, Cy = numY / den;
    const ctrl: Point = [Cx, Cy];
    let err = 0;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), u = 1 - t;
      const bx = u * u * P0[0] + 2 * u * t * ctrl[0] + t * t * P2[0];
      const by = u * u * P0[1] + 2 * u * t * ctrl[1] + t * t * P2[1];
      err = Math.max(err, Math.hypot(bx - pts[i][0], by - pts[i][1]));
    }
    return { ctrl, err };
  }
}





function find(str: string, start: number, regex: RegExp){
    for(let i = start; i < str.length; i++){
        if(regex.test(str[i])) return i
    }
    return -1
}