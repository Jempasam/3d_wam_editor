import { Observable } from "../Observable.js";


export class OStartWith<T> extends Observable<T>{


    constructor(private decorated: Observable<T>, private initalizer: (listener:(message:T)=>void)=>void){
        super()
        this.decorated = decorated
        this.initalizer = initalizer
    }

    notify(event: T){
        this.decorated.notify(event)
    } 

    register(observer: (event:T)=>void){
        this.decorated.register(observer)
        this.initalizer(observer)
    }

    unregister(observer: (event:T)=>void){
        this.decorated.unregister(observer)
    }
}

export function startWith<T>(decorated: Observable<T>, initalizer: (listener:(message:T)=>void)=>void){
    return new OStartWith(decorated, initalizer)
}