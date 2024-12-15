
/**
 * A observable object.
 * @template T
 * @abstract
 */
export class Observable{

    /**
     * Register an observer
     * @param {function(T):void} observer The function to call on notification.
     * @abstract
     */
    register(observer){
        throw new Error("Not implemented")
    }

    /**
     * Unregister an observer
     * @param {function(T):void} observer The function to call on notification.
     * @abstract
     */
    unregister(observer){
        throw new Error("Not implemented")
    }

    /**
     * Send a notification to the observers
     * @param {T} notification
     * @abstract
     */
    notify(notification){
        throw new Error("Not implemented")
    }

    /**
     * Register an observer and return a function to unregister it.
     * @param {function(T):void} observer The function to call on notification.
     * @returns {function():void} A function to call to unregister the observer.
     */
    add(observer){
        this.register(observer)
        return ()=>this.unregister(observer)
    }

}