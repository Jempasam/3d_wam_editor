import { GroupPanelPartInitParameters, IContentRenderer } from "dockview-core"
import { MOValue, OValue } from "../observable/collections/OValue.ts"
import { WamGUIGenerator } from "../WamGUIGenerator.ts"
import { html } from "../utils/doc.ts"
import { DEFAULT_CONTROL_CONTEXT_TARGET } from "../control/Control.ts"
import controls from "../control/controls.ts"

export class Test2DPane implements IContentRenderer{

    element = html.a`<div class="menu _center _fill _vertical _scrollable form_container"></div>`

    example = new MOValue(WamGUIGenerator.create({}))

    constructor(
        private generator: OValue<WamGUIGenerator>,
    ){
    }

    init(_: GroupPanelPartInitParameters): void {        
        const button = html.a`<button>Refresh</button>`
        const text = html.a`<p>...</p>`
        const display = html.a`<div class="display"></div>`
        this.element.replaceChildren(button,text,display)

        const regenerate = ()=>{
            this.example.value.dispose()


            function treatConnection(config: {target:HTMLElement[], setConnected:(it:boolean)=>void}, name:string){
                for(const target of config.target){
                    target.addEventListener("mouseenter", ()=>{
                        text.innerText = name
                        config.setConnected(true)
                    })
                    target.addEventListener("mouseleave", ()=>{
                        text.innerText = `...`
                        config.setConnected(false)
                    })
                }
            }

            this.example.value = WamGUIGenerator.create({
                wam: this.generator.value.host.wam,
                html: {
                    root:display,
                    ...DEFAULT_CONTROL_CONTEXT_TARGET,
                    defineAnEventInput(config){ treatConnection(config,"MIDI Input") },
                    defineAnEventOutput(config){ treatConnection(config,"MIDI Output") },
                    defineAnInput(config){ treatConnection(config,"Audio Input") },
                    defineAnOutput(config){ treatConnection(config,"Audio Output") },
                    defineField(config) {
                        for(const target of config.target){
                            target.style.cursor = "pointer"
                            target.addEventListener("mouseenter", () => {
                                text.innerText = `${config.getName()}: ${config.stringify(config.getValue())}`
                            })
                            target.addEventListener("mouseleave", () => {
                                text.innerText = `...`
                            })
                            target.addEventListener("mousedown", (e) => {
                                const startingValue = config.getValue()
                                const stepSize = 1/(config.getStepCount()||1000000)
                                const speed = 3/(config.getStepCount()||10)
                                const startY = e.clientY
                                const drag = (e: MouseEvent) => {
                                    e.preventDefault()
                                    const offset  = (startY - e.clientY) * speed
                                    let newvalue = startingValue + offset/100
                                    newvalue = Math.round(newvalue/stepSize)*stepSize
                                    newvalue = Math.max(0, Math.min(1, newvalue))
                                    config.setValue(newvalue)
                                    text.innerText = `${config.getName()}: ${config.stringify(newvalue)}`
                                }
                                document.addEventListener("mousemove", drag)
                                document.addEventListener("mouseup", () => {
                                    document.removeEventListener("mousemove", drag)
                                }, { once: true })
                            })
                        }
                    },
                }
            })
            this.example.value.load(this.generator.value.save(controls),controls)
        }

        button.onclick = () => regenerate()

        regenerate()

        const disposes: (()=>void)[] = [
            this.generator.observable.register(regenerate),
        ]

        this.dispose = () => {
            disposes.forEach((dispose) => dispose())
            this.example.value.dispose()
        }
    }

    declare dispose: ()=>void

}