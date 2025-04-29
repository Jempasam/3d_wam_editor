import { AbstractMesh, Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import { ControlContext } from "../../Control.ts"
import { CSettings, CSettingsValue } from "../../settings.ts"
import { ParameterControl } from "./ParameterControl.ts"


/**
 * A color coded controls that change a numeric value.
 */
export class Joystick3DControl extends ParameterControl{

    static label = "Joystick 3D"

    constructor(context: ControlContext){
        super(context)
    }

    protected static override getParameterLabels(){ return ["Target X", "Target Y", "Target Z"] }

    static override getSettings(): CSettings{
        return {
            "Zone Color":"color",
            "Cursor Color":"color",
            "Cursor Size": [0.05,1],
            ...super.getSettings()
        }
    }

    static getDefaultValues(){
        return {
            "Zone Color": "#aaaaff",
            "Cursor Color": "#ff0000",
            "Cursor Size": 0.1,
        }
    }

    override updateValue(label: string, value: CSettingsValue){
        switch(label){
            case "Zone Color":
                if(this.zoneElement) this.zoneElement.style.backgroundColor = value as string
                if(this.zoneMesh) (this.zoneMesh.material as StandardMaterial).diffuseColor = Color3.FromHexString(value as string)
                break
            case "Cursor Color":
                if(this.cursorElement) this.cursorElement.style.backgroundColor = value as string
                if(this.cursorMesh) (this.cursorMesh.material as StandardMaterial).diffuseColor = Color3.FromHexString(value as string)
                break
            case "Cursor Size":
                const size = value as number
                if(this.cursorMesh){
                    this.cursorMesh.scaling.setAll(size)
                    this.xLine!!.scaling.setAll(size/3).y = 1
                    this.yLine!!.scaling.setAll(size/3).y = 1
                    this.zLine!!.scaling.setAll(size/3).y = 1
                }
                if(this.cursorElement){
                    this.cursorElement.style.width = `${size*100}%`
                    this.cursorElement.style.height = `${size*100}%`
                }
                break
            default:
                super.updateValue(label,value)
        }
        this.updatePosition()
        if(this.xLine)this.xLine.isVisible = !!this.parameter[0]
        if(this.yLine)this.yLine.isVisible = !!this.parameter[1]
        if(this.zLine)this.zLine.isVisible = !!this.parameter[2]
    }



    updatePosition(){
        const [x,y,z] = this.normalized
        if(this.cursorElement && this.zoneElement){
            const bounds = this.zoneElement.getBoundingClientRect()
            const myself = this.cursorElement.getBoundingClientRect()
            const remainingWidth = (bounds.width - myself.width)/bounds.width
            const remainingHeight = (bounds.height - myself.height)/bounds.height
            this.cursorElement.style.left = `${Math.round(x*remainingWidth*100)}%`
            this.cursorElement.style.bottom = `${Math.round(y*remainingHeight*100)}%`
        }
        if(this.cursorMesh && this.zoneMesh){
            const initial = this.cursorMesh.scaling.scale(.5)
            const remaining = Vector3.One().subtractInPlace(this.cursorMesh.scaling)
            this.cursorMesh.position.setAll(-.5)
                .addInPlace(initial)
                .addInPlace(remaining.multiplyByFloats(x,z,y))
            this.xLine!!.position.copyFrom(this.cursorMesh.position).x = 0
            this.yLine!!.position.copyFrom(this.cursorMesh.position).z = 0
            this.zLine!!.position.copyFrom(this.cursorMesh.position).y = 0
        }
    }

    onParamChange(): void {
        this.updatePosition()
    }



    private zoneElement?: HTMLElement
    private cursorElement?: HTMLElement

    override createElement(){
        this.zoneElement = document.createElement("div")
        this.cursorElement = document.createElement("div")
        this.zoneElement.appendChild(this.cursorElement)

        this.zoneElement.style.position="absolute"
        this.zoneElement.style.width="100%"
        this.zoneElement.style.height="100%"
        
        this.cursorElement.style.position="absolute"
        this.cursorElement.style.borderRadius="50%"
        return this.zoneElement
    }

    override destroyElement(){
        this.zoneElement?.remove()
        this.cursorElement?.remove()
    }

    

    private zoneMesh?: AbstractMesh
    private cursorMesh?: AbstractMesh
    private xLine?: AbstractMesh
    private yLine?: AbstractMesh
    private zLine?: AbstractMesh

    override createNode(scene: Scene){
        this.zoneMesh = MeshBuilder.CreateBox("zone", {size:1}, scene)
        const m = this.zoneMesh.material = new StandardMaterial("zone", scene)
        m.alpha = 0.5

        this.cursorMesh = MeshBuilder.CreateSphere("cursor", {diameter:1}, scene)
        this.cursorMesh.material = new StandardMaterial("cursor", scene)

        this.xLine = MeshBuilder.CreateCylinder("xLine", {diameter:1, height:.99, subdivisions:6}, scene)
        this.xLine.material = this.cursorMesh.material
        this.xLine.parent = this.zoneMesh
        this.xLine.rotation.z = Math.PI/2

        this.yLine = MeshBuilder.CreateCylinder("yLine", {diameter:1, height:.99, subdivisions:6}, scene)
        this.yLine.material = this.cursorMesh.material
        this.yLine.parent = this.zoneMesh
        this.yLine.rotation.x = Math.PI/2

        this.zLine = MeshBuilder.CreateCylinder("zLine", {diameter:1, height:.99, subdivisions:6}, scene)
        this.zLine.material = this.cursorMesh.material
        this.zLine.parent = this.zoneMesh

        this.cursorMesh.parent = this.zoneMesh

        const control = this
        this.context.defineDraggableField({
            target: this.zoneMesh,
            getName() {
                return control.parameter
                    .map(p=> p==null ? null : p.label)
                    .filter(it=>it!=null)
                    .join(", ")
            },
            getValue() {
                return control.parameter
                    .map((p,i)=>{
                        if(!p)return null
                        const v = control.normalized[i]
                        const {minValue, maxValue} = p
                        const unnormalized = v*(maxValue-minValue)+minValue
                        if(p.valueString) return p.valueString(unnormalized)
                        else{
                            if(p.choices.length) return p.choices[Math.round(unnormalized)]
                            else{
                                const {units} = p
                                return unnormalized.toPrecision(3)+units
                            }
                        }
                    })
                    .filter(it=>it!=null)
                    .join(", ")
            },
            drag(x, y, z) {
                let i =0
                for(const offset of [x,y,z]){
                    const nvalue = control.value[i] + offset
                    control.setParamValue(nvalue,i)
                    i++
                }
            },
        })

        return this.zoneMesh
    }

    destroyNode(){
        this.zoneMesh?.material?.dispose()
        this.cursorMesh?.material?.dispose()
        this.zoneMesh?.dispose()
        this.cursorMesh?.dispose()
        this.xLine?.dispose()
        this.yLine?.dispose()
        this.zLine?.dispose()
    }
}

