import { OSource } from "./OSource.js";


export class CancellableOSource<T>{

    readonly before: OSource<T&{cancel:boolean}> = new OSource()

    readonly after: OSource<T> = new OSource()

    readonly cancel: OSource<T> = new OSource()

    /**
     * Notify the observer and return false if the notification was cancelled
     * @param value 
     * @param action An action to perform if the notification is not cancelled and before the after event
     * @param postaction An action to perform after the after event
     */
    notify<Y>(value: T, action: ((cancel:()=>void)=>Y)|undefined, postaction: ((it:Y)=>void)|undefined){
        let event={...value, cancel:false}
        this.before.notify(event)
        if(event.cancel){
            this.cancel.notify(value)
            return false
        }else{
            let cancelled=false
            let it=action?.(()=>cancelled=true)
            if(!cancelled){
                this.after.notify(value)
                postaction?.(it as Y)
            }
            return true
        }
    }
    
}