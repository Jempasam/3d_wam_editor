import type { Nullable } from "../types";
/**
 * A class serves as a medium between the observable and its observers
 */
export declare class EventState {
    /**
     * Create a new EventState
     * @param mask defines the mask associated with this state
     * @param skipNextObservers defines a flag which will instruct the observable to skip following observers when set to true
     * @param target defines the original target of the state
     * @param currentTarget defines the current target of the state
     */
    constructor(mask: number, skipNextObservers?: boolean, target?: any, currentTarget?: any);
    /**
     * Initialize the current event state
     * @param mask defines the mask associated with this state
     * @param skipNextObservers defines a flag which will instruct the observable to skip following observers when set to true
     * @param target defines the original target of the state
     * @param currentTarget defines the current target of the state
     * @returns the current event state
     */
    initialize(mask: number, skipNextObservers?: boolean, target?: any, currentTarget?: any): EventState;
    /**
     * An Observer can set this property to true to prevent subsequent observers of being notified
     */
    skipNextObservers: boolean;
    /**
     * Get the mask value that were used to trigger the event corresponding to this EventState object
     */
    mask: number;
    /**
     * The object that originally notified the event
     */
    target?: any;
    /**
     * The current object in the bubbling phase
     */
    currentTarget?: any;
    /**
     * This will be populated with the return value of the last function that was executed.
     * If it is the first function in the callback chain it will be the event data.
     */
    lastReturnValue?: any;
    /**
     * User defined information that will be sent to observers
     */
    userInfo?: any;
}
/**
 * Represent an Observer registered to a given Observable object.
 */
export declare class Observer<T> {
    /**
     * Defines the callback to call when the observer is notified
     */
    callback: (eventData: T, eventState: EventState) => void;
    /**
     * Defines the mask of the observer (used to filter notifications)
     */
    mask: number;
    /**
     * Defines the current scope used to restore the JS context
     */
    scope: any;
    /** @internal */
    _willBeUnregistered: boolean;
    /**
     * Gets or sets a property defining that the observer as to be unregistered after the next notification
     */
    unregisterOnNextCall: boolean;
    /**
     * this function can be used to remove the observer from the observable.
     * It will be set by the observable that the observer belongs to.
     * @internal
     */
    _remove: Nullable<() => void>;
    /**
     * Creates a new observer
     * @param callback defines the callback to call when the observer is notified
     * @param mask defines the mask of the observer (used to filter notifications)
     * @param scope defines the current scope used to restore the JS context
     */
    constructor(
    /**
     * Defines the callback to call when the observer is notified
     */
    callback: (eventData: T, eventState: EventState) => void, 
    /**
     * Defines the mask of the observer (used to filter notifications)
     */
    mask: number, 
    /**
     * Defines the current scope used to restore the JS context
     */
    scope?: any);
    /**
     * Remove the observer from its observable
     * This can be used instead of using the observable's remove function.
     */
    remove(): void;
}
/**
 * The Observable class is a simple implementation of the Observable pattern.
 *
 * There's one slight particularity though: a given Observable can notify its observer using a particular mask value, only the Observers registered with this mask value will be notified.
 * This enable a more fine grained execution without having to rely on multiple different Observable objects.
 * For instance you may have a given Observable that have four different types of notifications: Move (mask = 0x01), Stop (mask = 0x02), Turn Right (mask = 0X04), Turn Left (mask = 0X08).
 * A given observer can register itself with only Move and Stop (mask = 0x03), then it will only be notified when one of these two occurs and will never be for Turn Left/Right.
 */
export declare class Observable<T> {
    /**
     * If set to true the observable will notify when an observer was added if the observable was already triggered.
     * This is helpful to single-state observables like the scene onReady or the dispose observable.
     */
    notifyIfTriggered: boolean;
    private _observers;
    private _numObserversMarkedAsDeleted;
    private _hasNotified;
    private _lastNotifiedValue?;
    /**
     * @internal
     */
    _eventState: EventState;
    private _onObserverAdded;
    /**
     * Create an observable from a Promise.
     * @param promise a promise to observe for fulfillment.
     * @param onErrorObservable an observable to notify if a promise was rejected.
     * @returns the new Observable
     */
    static FromPromise<T, E = Error>(promise: Promise<T>, onErrorObservable?: Observable<E>): Observable<T>;
    /**
     * Gets the list of observers
     * Note that observers that were recently deleted may still be present in the list because they are only really deleted on the next javascript tick!
     */
    get observers(): Array<Observer<T>>;
    /**
     * Creates a new observable
     * @param onObserverAdded defines a callback to call when a new observer is added
     * @param notifyIfTriggered If set to true the observable will notify when an observer was added if the observable was already triggered.
     */
    constructor(onObserverAdded?: (observer: Observer<T>) => void, 
    /**
     * If set to true the observable will notify when an observer was added if the observable was already triggered.
     * This is helpful to single-state observables like the scene onReady or the dispose observable.
     */
    notifyIfTriggered?: boolean);
    /**
     * Create a new Observer with the specified callback
     * @param callback the callback that will be executed for that Observer
     * @param mask the mask used to filter observers
     * @param insertFirst if true the callback will be inserted at the first position, hence executed before the others ones. If false (default behavior) the callback will be inserted at the last position, executed after all the others already present.
     * @param scope optional scope for the callback to be called from
     * @param unregisterOnFirstCall defines if the observer as to be unregistered after the next notification
     * @returns the new observer created for the callback
     */
    add(callback?: null | undefined, mask?: number, insertFirst?: boolean, scope?: any, unregisterOnFirstCall?: boolean): null;
    add(callback: (eventData: T, eventState: EventState) => void, mask?: number, insertFirst?: boolean, scope?: any, unregisterOnFirstCall?: boolean): Observer<T>;
    add(callback?: ((eventData: T, eventState: EventState) => void) | null | undefined, mask?: number, insertFirst?: boolean, scope?: any, unregisterOnFirstCall?: boolean): Nullable<Observer<T>>;
    /**
     * Create a new Observer with the specified callback and unregisters after the next notification
     * @param callback the callback that will be executed for that Observer
     * @returns the new observer created for the callback
     */
    addOnce(callback?: null | undefined): null;
    addOnce(callback: (eventData: T, eventState: EventState) => void): Observer<T>;
    addOnce(callback?: ((eventData: T, eventState: EventState) => void) | null | undefined): Nullable<Observer<T>>;
    /**
     * Remove an Observer from the Observable object
     * @param observer the instance of the Observer to remove
     * @returns false if it doesn't belong to this Observable
     */
    remove(observer: Nullable<Observer<T>>): boolean;
    /**
     * Remove a callback from the Observable object
     * @param callback the callback to remove
     * @param scope optional scope. If used only the callbacks with this scope will be removed
     * @returns false if it doesn't belong to this Observable
     */
    removeCallback(callback: (eventData: T, eventState: EventState) => void, scope?: any): boolean;
    /**
     * @internal
     */
    _deferUnregister(observer: Observer<T>): void;
    private _remove;
    /**
     * Moves the observable to the top of the observer list making it get called first when notified
     * @param observer the observer to move
     */
    makeObserverTopPriority(observer: Observer<T>): void;
    /**
     * Moves the observable to the bottom of the observer list making it get called last when notified
     * @param observer the observer to move
     */
    makeObserverBottomPriority(observer: Observer<T>): void;
    /**
     * Notify all Observers by calling their respective callback with the given data
     * Will return true if all observers were executed, false if an observer set skipNextObservers to true, then prevent the subsequent ones to execute
     * @param eventData defines the data to send to all observers
     * @param mask defines the mask of the current notification (observers with incompatible mask (ie mask & observer.mask === 0) will not be notified)
     * @param target defines the original target of the state
     * @param currentTarget defines the current target of the state
     * @param userInfo defines any user info to send to observers
     * @returns false if the complete observer chain was not processed (because one observer set the skipNextObservers to true)
     */
    notifyObservers(eventData: T, mask?: number, target?: any, currentTarget?: any, userInfo?: any): boolean;
    /**
     * Notify a specific observer
     * @param observer defines the observer to notify
     * @param eventData defines the data to be sent to each callback
     * @param mask is used to filter observers defaults to -1
     */
    notifyObserver(observer: Observer<T>, eventData: T, mask?: number): void;
    /**
     * Gets a boolean indicating if the observable has at least one observer
     * @returns true is the Observable has at least one Observer registered
     */
    hasObservers(): boolean;
    /**
     * Clear the list of observers
     */
    clear(): void;
    /**
     * Clean the last notified state - both the internal last value and the has-notified flag
     */
    cleanLastNotifiedState(): void;
    /**
     * Clone the current observable
     * @returns a new observable
     */
    clone(): Observable<T>;
    /**
     * Does this observable handles observer registered with a given mask
     * @param mask defines the mask to be tested
     * @returns whether or not one observer registered with the given mask is handled
     **/
    hasSpecificMask(mask?: number): boolean;
}
