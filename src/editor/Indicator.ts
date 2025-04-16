import { MOValue } from "../observable/collections/OValue.ts";
import { html } from "../utils/doc.ts";


export class Indicator{

    element: HTMLElement

    state = new MOValue<"valid"|"invalid"|"wait"|"none">("none")
    text = new MOValue("")

    constructor(){
        const element = this.element = html.a`<div class="indicator">Attente</div>`
        this.state.observable.add(({to:state}) =>{
            element.classList.remove("_valid","_invalid","_waiting")
            if(state=="valid") element.classList.add("_valid")
            if(state=="invalid") element.classList.add("_invalid")
            if(state=="wait") element.classList.add("_waiting")
        })
        this.text.observable.add(({to}) => this.element.textContent = to)
    }

    set(state: "valid"|"invalid"|"wait"|"none", text: string){
        this.state.value = state
        this.text.value = text
    }
}