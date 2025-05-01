import { MOValue } from "./collections/OValue.ts";

export function linkInput<T>(element: HTMLInputElement|HTMLSelectElement, value: MOValue<T>, parse: (value:string)=>T, stringify: (value:T)=>string){
    const oninput = ()=>value.value = parse(element.value)
    const onvalue = ()=>element.value = stringify(value.value)
    element.addEventListener("input", oninput)
    value.observable.register(onvalue)
    onvalue()
    return ()=>{
        element.removeEventListener("input", oninput)
        value.observable.unregister(onvalue)
    }
}