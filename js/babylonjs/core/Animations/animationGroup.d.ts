import type { Animatable } from "./animatable";
import { Animation } from "./animation";
import type { IMakeAnimationAdditiveOptions } from "./animation";
import type { Scene, IDisposable } from "../scene";
import { Observable } from "../Misc/observable";
import type { Nullable } from "../types";
import type { AbstractScene } from "../abstractScene";
import type { AnimationGroupMask } from "./animationGroupMask";
/**
 * This class defines the direct association between an animation and a target
 */
export declare class TargetedAnimation {
    /**
     * Animation to perform
     */
    animation: Animation;
    /**
     * Target to animate
     */
    target: any;
    /**
     * Returns the string "TargetedAnimation"
     * @returns "TargetedAnimation"
     */
    getClassName(): string;
    /**
     * Serialize the object
     * @returns the JSON object representing the current entity
     */
    serialize(): any;
}
/**
 * Options to be used when creating an additive group animation
 */
export interface IMakeAnimationGroupAdditiveOptions extends IMakeAnimationAdditiveOptions {
    /**
     * Defines if the animation group should be cloned or not (default is false)
     */
    cloneOriginalAnimationGroup?: boolean;
    /**
     * The name of the cloned animation group if cloneOriginalAnimationGroup is true
     */
    clonedAnimationGroupName?: string;
}
/**
 * Use this class to create coordinated animations on multiple targets
 */
export declare class AnimationGroup implements IDisposable {
    /** The name of the animation group */
    name: string;
    private _scene;
    private _targetedAnimations;
    private _animatables;
    private _from;
    private _to;
    private _isStarted;
    private _isPaused;
    private _speedRatio;
    private _loopAnimation;
    private _isAdditive;
    private _weight;
    private _playOrder;
    private _enableBlending;
    private _blendingSpeed;
    private _numActiveAnimatables;
    /** @internal */
    _parentContainer: Nullable<AbstractScene>;
    /**
     * Gets or sets the unique id of the node
     */
    uniqueId: number;
    /**
     * This observable will notify when one animation have ended
     */
    onAnimationEndObservable: Observable<TargetedAnimation>;
    /**
     * Observer raised when one animation loops
     */
    onAnimationLoopObservable: Observable<TargetedAnimation>;
    /**
     * Observer raised when all animations have looped
     */
    onAnimationGroupLoopObservable: Observable<AnimationGroup>;
    /**
     * This observable will notify when all animations have ended.
     */
    onAnimationGroupEndObservable: Observable<AnimationGroup>;
    /**
     * This observable will notify when all animations have paused.
     */
    onAnimationGroupPauseObservable: Observable<AnimationGroup>;
    /**
     * This observable will notify when all animations are playing.
     */
    onAnimationGroupPlayObservable: Observable<AnimationGroup>;
    /**
     * Gets or sets an object used to store user defined information for the node
     */
    metadata: any;
    private _mask;
    /**
     * Gets or sets the mask associated with this animation group. This mask is used to filter which objects should be animated.
     */
    get mask(): Nullable<AnimationGroupMask>;
    set mask(value: Nullable<AnimationGroupMask>);
    /**
     * Makes sure that the animations are either played or stopped according to the animation group mask.
     * Note however that the call won't have any effect if the animation group has not been started yet.
     * @param forceUpdate If true, forces to loop over the animatables even if no mask is defined (used internally, you shouldn't need to use it). Default: false.
     */
    syncWithMask(forceUpdate?: boolean): void;
    /**
     * Removes all animations for the targets not retained by the animation group mask.
     * Use this function if you know you won't need those animations anymore and if you want to free memory.
     */
    removeUnmaskedAnimations(): void;
    /**
     * Gets or sets the first frame
     */
    get from(): number;
    set from(value: number);
    /**
     * Gets or sets the last frame
     */
    get to(): number;
    set to(value: number);
    /**
     * Define if the animations are started
     */
    get isStarted(): boolean;
    /**
     * Gets a value indicating that the current group is playing
     */
    get isPlaying(): boolean;
    /**
     * Gets or sets the speed ratio to use for all animations
     */
    get speedRatio(): number;
    /**
     * Gets or sets the speed ratio to use for all animations
     */
    set speedRatio(value: number);
    /**
     * Gets or sets if all animations should loop or not
     */
    get loopAnimation(): boolean;
    set loopAnimation(value: boolean);
    /**
     * Gets or sets if all animations should be evaluated additively
     */
    get isAdditive(): boolean;
    set isAdditive(value: boolean);
    /**
     * Gets or sets the weight to apply to all animations of the group
     */
    get weight(): number;
    set weight(value: number);
    /**
     * Gets the targeted animations for this animation group
     */
    get targetedAnimations(): Array<TargetedAnimation>;
    /**
     * returning the list of animatables controlled by this animation group.
     */
    get animatables(): Array<Animatable>;
    /**
     * Gets the list of target animations
     */
    get children(): TargetedAnimation[];
    /**
     * Gets or sets the order of play of the animation group (default: 0)
     */
    get playOrder(): number;
    set playOrder(value: number);
    /**
     * Allows the animations of the animation group to blend with current running animations
     * Note that a null value means that each animation will use their own existing blending configuration (Animation.enableBlending)
     */
    get enableBlending(): Nullable<boolean>;
    set enableBlending(value: Nullable<boolean>);
    /**
     * Gets or sets the animation blending speed
     * Note that a null value means that each animation will use their own existing blending configuration (Animation.blendingSpeed)
     */
    get blendingSpeed(): Nullable<number>;
    set blendingSpeed(value: Nullable<number>);
    /**
     * Gets the length (in seconds) of the animation group
     * This function assumes that all animations are played at the same framePerSecond speed!
     * Note: you can only call this method after you've added at least one targeted animation!
     * @param from Starting frame range (default is AnimationGroup.from)
     * @param to Ending frame range (default is AnimationGroup.to)
     * @returns The length in seconds
     */
    getLength(from?: number, to?: number): number;
    /**
     * Merge the array of animation groups into a new animation group
     * @param animationGroups List of animation groups to merge
     * @param disposeSource If true, animation groups will be disposed after being merged (default: true)
     * @param normalize If true, animation groups will be normalized before being merged, so that all animations have the same "from" and "to" frame (default: false)
     * @param weight Weight for the new animation group. If not provided, it will inherit the weight from the first animation group of the array
     * @returns The new animation group or null if no animation groups were passed
     */
    static MergeAnimationGroups(animationGroups: Array<AnimationGroup>, disposeSource?: boolean, normalize?: boolean, weight?: number): Nullable<AnimationGroup>;
    /**
     * Instantiates a new Animation Group.
     * This helps managing several animations at once.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/groupAnimations
     * @param name Defines the name of the group
     * @param scene Defines the scene the group belongs to
     * @param weight Defines the weight to use for animations in the group (-1.0 by default, meaning "no weight")
     * @param playOrder Defines the order of play of the animation group (default is 0)
     */
    constructor(
    /** The name of the animation group */
    name: string, scene?: Nullable<Scene>, weight?: number, playOrder?: number);
    /**
     * Add an animation (with its target) in the group
     * @param animation defines the animation we want to add
     * @param target defines the target of the animation
     * @returns the TargetedAnimation object
     */
    addTargetedAnimation(animation: Animation, target: any): TargetedAnimation;
    /**
     * Remove an animation from the group
     * @param animation defines the animation we want to remove
     */
    removeTargetedAnimation(animation: Animation): void;
    /**
     * This function will normalize every animation in the group to make sure they all go from beginFrame to endFrame
     * It can add constant keys at begin or end
     * @param beginFrame defines the new begin frame for all animations or the smallest begin frame of all animations if null (defaults to null)
     * @param endFrame defines the new end frame for all animations or the largest end frame of all animations if null (defaults to null)
     * @returns the animation group
     */
    normalize(beginFrame?: Nullable<number>, endFrame?: Nullable<number>): AnimationGroup;
    private _animationLoopCount;
    private _animationLoopFlags;
    private _processLoop;
    /**
     * Start all animations on given targets
     * @param loop defines if animations must loop
     * @param speedRatio defines the ratio to apply to animation speed (1 by default)
     * @param from defines the from key (optional)
     * @param to defines the to key (optional)
     * @param isAdditive defines the additive state for the resulting animatables (optional)
     * @returns the current animation group
     */
    start(loop?: boolean, speedRatio?: number, from?: number, to?: number, isAdditive?: boolean): AnimationGroup;
    /**
     * Pause all animations
     * @returns the animation group
     */
    pause(): AnimationGroup;
    /**
     * Play all animations to initial state
     * This function will start() the animations if they were not started or will restart() them if they were paused
     * @param loop defines if animations must loop
     * @returns the animation group
     */
    play(loop?: boolean): AnimationGroup;
    /**
     * Reset all animations to initial state
     * @returns the animation group
     */
    reset(): AnimationGroup;
    /**
     * Restart animations from key 0
     * @returns the animation group
     */
    restart(): AnimationGroup;
    /**
     * Stop all animations
     * @returns the animation group
     */
    stop(): AnimationGroup;
    /**
     * Set animation weight for all animatables
     *
     * @since 6.12.4
     *  You can pass the weight to the AnimationGroup constructor, or use the weight property to set it after the group has been created,
     *  making it easier to define the overall animation weight than calling setWeightForAllAnimatables() after the animation group has been started
     * @param weight defines the weight to use
     * @returns the animationGroup
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#animation-weights
     */
    setWeightForAllAnimatables(weight: number): AnimationGroup;
    /**
     * Synchronize and normalize all animatables with a source animatable
     * @param root defines the root animatable to synchronize with (null to stop synchronizing)
     * @returns the animationGroup
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#animation-weights
     */
    syncAllAnimationsWith(root: Nullable<Animatable>): AnimationGroup;
    /**
     * Goes to a specific frame in this animation group. Note that the animation group must be in playing or paused status
     * @param frame the frame number to go to
     * @returns the animationGroup
     */
    goToFrame(frame: number): AnimationGroup;
    /**
     * Dispose all associated resources
     */
    dispose(): void;
    private _checkAnimationGroupEnded;
    /**
     * Clone the current animation group and returns a copy
     * @param newName defines the name of the new group
     * @param targetConverter defines an optional function used to convert current animation targets to new ones
     * @param cloneAnimations defines if the animations should be cloned or referenced
     * @returns the new animation group
     */
    clone(newName: string, targetConverter?: (oldTarget: any) => any, cloneAnimations?: boolean): AnimationGroup;
    /**
     * Serializes the animationGroup to an object
     * @returns Serialized object
     */
    serialize(): any;
    /**
     * Returns a new AnimationGroup object parsed from the source provided.
     * @param parsedAnimationGroup defines the source
     * @param scene defines the scene that will receive the animationGroup
     * @returns a new AnimationGroup
     */
    static Parse(parsedAnimationGroup: any, scene: Scene): AnimationGroup;
    /**
     * Convert the keyframes for all animations belonging to the group to be relative to a given reference frame.
     * @param sourceAnimationGroup defines the AnimationGroup containing animations to convert
     * @param referenceFrame defines the frame that keyframes in the range will be relative to (default: 0)
     * @param range defines the name of the AnimationRange belonging to the animations in the group to convert
     * @param cloneOriginal defines whether or not to clone the group and convert the clone or convert the original group (default is false)
     * @param clonedName defines the name of the resulting cloned AnimationGroup if cloneOriginal is true
     * @returns a new AnimationGroup if cloneOriginal is true or the original AnimationGroup if cloneOriginal is false
     */
    static MakeAnimationAdditive(sourceAnimationGroup: AnimationGroup, referenceFrame: number, range?: string, cloneOriginal?: boolean, clonedName?: string): AnimationGroup;
    /**
     * Convert the keyframes for all animations belonging to the group to be relative to a given reference frame.
     * @param sourceAnimationGroup defines the AnimationGroup containing animations to convert
     * @param options defines the options to use when converting keyframes
     * @returns a new AnimationGroup if options.cloneOriginalAnimationGroup is true or the original AnimationGroup if options.cloneOriginalAnimationGroup is false
     */
    static MakeAnimationAdditive(sourceAnimationGroup: AnimationGroup, options?: IMakeAnimationGroupAdditiveOptions): AnimationGroup;
    /**
     * Creates a new animation, keeping only the keys that are inside a given key range
     * @param sourceAnimationGroup defines the animation group on which to operate
     * @param fromKey defines the lower bound of the range
     * @param toKey defines the upper bound of the range
     * @param name defines the name of the new animation group. If not provided, use the same name as animationGroup
     * @param dontCloneAnimations defines whether or not the animations should be cloned before clipping the keys. Default is false, so animations will be cloned
     * @returns a new animation group stripped from all the keys outside the given range
     */
    static ClipKeys(sourceAnimationGroup: AnimationGroup, fromKey: number, toKey: number, name?: string, dontCloneAnimations?: boolean): AnimationGroup;
    /**
     * Updates an existing animation, keeping only the keys that are inside a given key range
     * @param animationGroup defines the animation group on which to operate
     * @param fromKey defines the lower bound of the range
     * @param toKey defines the upper bound of the range
     * @param dontCloneAnimations defines whether or not the animations should be cloned before clipping the keys. Default is false, so animations will be cloned
     * @returns the animationGroup stripped from all the keys outside the given range
     */
    static ClipKeysInPlace(animationGroup: AnimationGroup, fromKey: number, toKey: number, dontCloneAnimations?: boolean): AnimationGroup;
    /**
     * Creates a new animation, keeping only the frames that are inside a given frame range
     * @param sourceAnimationGroup defines the animation group on which to operate
     * @param fromFrame defines the lower bound of the range
     * @param toFrame defines the upper bound of the range
     * @param name defines the name of the new animation group. If not provided, use the same name as animationGroup
     * @param dontCloneAnimations defines whether or not the animations should be cloned before clipping the frames. Default is false, so animations will be cloned
     * @returns a new animation group stripped from all the frames outside the given range
     */
    static ClipFrames(sourceAnimationGroup: AnimationGroup, fromFrame: number, toFrame: number, name?: string, dontCloneAnimations?: boolean): AnimationGroup;
    /**
     * Updates an existing animation, keeping only the frames that are inside a given frame range
     * @param animationGroup defines the animation group on which to operate
     * @param fromFrame defines the lower bound of the range
     * @param toFrame defines the upper bound of the range
     * @param dontCloneAnimations defines whether or not the animations should be cloned before clipping the frames. Default is false, so animations will be cloned
     * @returns the animationGroup stripped from all the frames outside the given range
     */
    static ClipFramesInPlace(animationGroup: AnimationGroup, fromFrame: number, toFrame: number, dontCloneAnimations?: boolean): AnimationGroup;
    /**
     * Updates an existing animation, keeping only the keys that are inside a given key or frame range
     * @param animationGroup defines the animation group on which to operate
     * @param start defines the lower bound of the range
     * @param end defines the upper bound of the range
     * @param dontCloneAnimations defines whether or not the animations should be cloned before clipping the keys. Default is false, so animations will be cloned
     * @param useFrame defines if the range is defined by frame numbers or key indices (default is false which means use key indices)
     * @returns the animationGroup stripped from all the keys outside the given range
     */
    static ClipInPlace(animationGroup: AnimationGroup, start: number, end: number, dontCloneAnimations?: boolean, useFrame?: boolean): AnimationGroup;
    /**
     * Returns the string "AnimationGroup"
     * @returns "AnimationGroup"
     */
    getClassName(): string;
    /**
     * Creates a detailed string about the object
     * @param fullDetails defines if the output string will support multiple levels of logging within scene loading
     * @returns a string representing the object
     */
    toString(fullDetails?: boolean): string;
}
