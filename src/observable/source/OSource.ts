import { Observable } from "../Observable.js"

/** A set of function. */
export class OSource<T> extends Observable<T>{

    private observers = new Set<(event:T)=>void>()

    constructor(private parent: Observable<T>|undefined=undefined){
        super()
    }
    
    /** Register an observer */
    override register(observer: (event:T)=>void){
        this.observers.add(observer)
        return ()=> this.observers.delete(observer)
    }

    /** Unregister an observer */
    override unregister(observer: (event:T)=>void){
        this.observers.delete(observer)
    }

    /** Send a notification to the observers */
    override notify(notification: T){
        this.depth++
        if(this.depth==1){
            for(let o of this.observers)o(notification)
            if(this.parent)this.parent.notify(notification)
        }
        this.depth=0
    }

    private depth=0
    
}