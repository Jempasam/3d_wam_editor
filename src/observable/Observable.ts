
/**
 * A observable object.
 */
export abstract class Observable<T>{

    /**
     * Register an observer
     * @param observer The function to call on notification.
     */
    abstract register(observer: (event:T)=>void): void

    /**
     * Unregister an observer
     * @param observer The function to call on notification.
     */
    abstract unregister(observer: (event:T)=>void): void

    /**
     * Send a notification to the observers
     */
    abstract notify(notification: T): void

    /**
     * Register an observer and return a function to unregister it.
     * @param observer The function to call on notification.
     * @returns A function to call to unregister the observer.
     */
    add(observer: (event:T)=>void): ()=>void{
        this.register(observer)
        return ()=>this.unregister(observer)
    }

}