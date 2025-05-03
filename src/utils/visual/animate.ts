import { Color3 } from "@babylonjs/core"

export function animate(from:any, to:any, progression: number): any{
    if(typeof from==typeof to)switch (typeof from) {
        case 'number':
            return from + (to - from) * progression
        case 'string':
            if(from.startsWith("#") && to.startsWith("#") && from.length==7 && to.length==7){
                const from_rgb = Color3.FromHexString(from).scaleInPlace(1-progression)
                const to_rgb = Color3.FromHexString(to).scaleInPlace(progression)
                return from_rgb.add(to_rgb).toHexString()
            }
    }
    return progression < 0.5 ? from : to
}