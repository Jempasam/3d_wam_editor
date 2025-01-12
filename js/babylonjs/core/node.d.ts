import type { Scene } from "./scene";
import type { Nullable } from "./types";
import { Matrix, Vector3 } from "./Maths/math.vector";
import type { AbstractEngine } from "./Engines/abstractEngine";
import type { IBehaviorAware, Behavior } from "./Behaviors/behavior";
import { Observable } from "./Misc/observable";
import type { AbstractActionManager } from "./Actions/abstractActionManager";
import type { IInspectable } from "./Misc/iInspectable";
import type { AbstractScene } from "./abstractScene";
import type { IAccessibilityTag } from "./IAccessibilityTag";
import type { AnimationRange } from "./Animations/animationRange";
import type { AnimationPropertiesOverride } from "./Animations/animationPropertiesOverride";
import type { AbstractMesh } from "./Meshes/abstractMesh";
import type { Animation } from "./Animations/animation";
import type { Animatable } from "./Animations/animatable";
/**
 * Defines how a node can be built from a string name.
 */
export type NodeConstructor = (name: string, scene: Scene, options?: any) => () => Node;
/**
 * Node is the basic class for all scene objects (Mesh, Light, Camera.)
 */
export declare class Node implements IBehaviorAware<Node> {
    protected _isDirty: boolean;
    /**
     * @internal
     */
    static _AnimationRangeFactory: (_name: string, _from: number, _to: number) => AnimationRange;
    private static _NodeConstructors;
    /**
     * Add a new node constructor
     * @param type defines the type name of the node to construct
     * @param constructorFunc defines the constructor function
     */
    static AddNodeConstructor(type: string, constructorFunc: NodeConstructor): void;
    /**
     * Returns a node constructor based on type name
     * @param type defines the type name
     * @param name defines the new node name
     * @param scene defines the hosting scene
     * @param options defines optional options to transmit to constructors
     * @returns the new constructor or null
     */
    static Construct(type: string, name: string, scene: Scene, options?: any): Nullable<() => Node>;
    private _nodeDataStorage;
    /**
     * Gets or sets the name of the node
     */
    name: string;
    /**
     * Gets or sets the id of the node
     */
    id: string;
    /**
     * Gets or sets the unique id of the node
     */
    uniqueId: number;
    /**
     * Gets or sets a string used to store user defined state for the node
     */
    state: string;
    /**
     * Gets or sets an object used to store user defined information for the node
     */
    metadata: any;
    /** @internal */
    _internalMetadata: any;
    /**
     * For internal use only. Please do not use.
     */
    reservedDataStore: any;
    /**
     * List of inspectable custom properties (used by the Inspector)
     * @see https://doc.babylonjs.com/toolsAndResources/inspector#extensibility
     */
    inspectableCustomProperties: IInspectable[];
    /**
     * Gets or sets the accessibility tag to describe the node for accessibility purpose.
     */
    set accessibilityTag(value: Nullable<IAccessibilityTag>);
    get accessibilityTag(): Nullable<IAccessibilityTag>;
    protected _accessibilityTag: Nullable<IAccessibilityTag>;
    /**
     * Observable fired when an accessibility tag is changed
     */
    onAccessibilityTagChangedObservable: Observable<Nullable<IAccessibilityTag>>;
    /**
     * Gets or sets a boolean used to define if the node must be serialized
     */
    get doNotSerialize(): boolean;
    set doNotSerialize(value: boolean);
    /** @internal */
    _parentContainer: Nullable<AbstractScene>;
    /**
     * Gets a list of Animations associated with the node
     */
    animations: Animation[];
    protected _ranges: {
        [name: string]: Nullable<AnimationRange>;
    };
    /**
     * Callback raised when the node is ready to be used
     */
    onReady: Nullable<(node: Node) => void>;
    /** @internal */
    _currentRenderId: number;
    private _parentUpdateId;
    /** @internal */
    _childUpdateId: number;
    /** @internal */
    _waitingParentId: Nullable<string>;
    /** @internal */
    _waitingParentInstanceIndex: Nullable<string>;
    /** @internal */
    _waitingParsedUniqueId: Nullable<number>;
    /** @internal */
    _scene: Scene;
    /** @internal */
    _cache: any;
    protected _parentNode: Nullable<Node>;
    /** @internal */
    protected _children: Nullable<Node[]>;
    /** @internal */
    _worldMatrix: Matrix;
    /** @internal */
    _worldMatrixDeterminant: number;
    /** @internal */
    _worldMatrixDeterminantIsDirty: boolean;
    /**
     * Gets a boolean indicating if the node has been disposed
     * @returns true if the node was disposed
     */
    isDisposed(): boolean;
    /**
     * Gets or sets the parent of the node (without keeping the current position in the scene)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/parent_pivot/parent
     */
    set parent(parent: Nullable<Node>);
    get parent(): Nullable<Node>;
    /**
     * @internal
     */
    _serializeAsParent(serializationObject: any): void;
    /** @internal */
    _addToSceneRootNodes(): void;
    /** @internal */
    _removeFromSceneRootNodes(): void;
    private _animationPropertiesOverride;
    /**
     * Gets or sets the animation properties override
     */
    get animationPropertiesOverride(): Nullable<AnimationPropertiesOverride>;
    set animationPropertiesOverride(value: Nullable<AnimationPropertiesOverride>);
    /**
     * Gets a string identifying the name of the class
     * @returns "Node" string
     */
    getClassName(): string;
    /** @internal */
    readonly _isNode = true;
    /**
     * An event triggered when the mesh is disposed
     */
    onDisposeObservable: Observable<Node>;
    private _onDisposeObserver;
    /**
     * Sets a callback that will be raised when the node will be disposed
     */
    set onDispose(callback: () => void);
    /**
     * An event triggered when the enabled state of the node changes
     */
    get onEnabledStateChangedObservable(): Observable<boolean>;
    /**
     * An event triggered when the node is cloned
     */
    get onClonedObservable(): Observable<Node>;
    /**
     * Creates a new Node
     * @param name the name and id to be given to this node
     * @param scene the scene this node will be added to
     */
    constructor(name: string, scene?: Nullable<Scene>);
    /**
     * Gets the scene of the node
     * @returns a scene
     */
    getScene(): Scene;
    /**
     * Gets the engine of the node
     * @returns a Engine
     */
    getEngine(): AbstractEngine;
    private _behaviors;
    /**
     * Attach a behavior to the node
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors
     * @param behavior defines the behavior to attach
     * @param attachImmediately defines that the behavior must be attached even if the scene is still loading
     * @returns the current Node
     */
    addBehavior(behavior: Behavior<Node>, attachImmediately?: boolean): Node;
    /**
     * Remove an attached behavior
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors
     * @param behavior defines the behavior to attach
     * @returns the current Node
     */
    removeBehavior(behavior: Behavior<Node>): Node;
    /**
     * Gets the list of attached behaviors
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors
     */
    get behaviors(): Behavior<Node>[];
    /**
     * Gets an attached behavior by name
     * @param name defines the name of the behavior to look for
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors
     * @returns null if behavior was not found else the requested behavior
     */
    getBehaviorByName(name: string): Nullable<Behavior<Node>>;
    /**
     * Returns the latest update of the World matrix
     * @returns a Matrix
     */
    getWorldMatrix(): Matrix;
    /** @internal */
    _getWorldMatrixDeterminant(): number;
    /**
     * Returns directly the latest state of the mesh World matrix.
     * A Matrix is returned.
     */
    get worldMatrixFromCache(): Matrix;
    /** @internal */
    _initCache(): void;
    /**
     * @internal
     */
    updateCache(force?: boolean): void;
    /**
     * @internal
     */
    _getActionManagerForTrigger(trigger?: number, _initialCall?: boolean): Nullable<AbstractActionManager>;
    /**
     * @internal
     */
    _updateCache(_ignoreParentClass?: boolean): void;
    /** @internal */
    _isSynchronized(): boolean;
    /** @internal */
    _markSyncedWithParent(): void;
    /** @internal */
    isSynchronizedWithParent(): boolean;
    /** @internal */
    isSynchronized(): boolean;
    /**
     * Is this node ready to be used/rendered
     * @param _completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
     * @returns true if the node is ready
     */
    isReady(_completeCheck?: boolean): boolean;
    /**
     * Flag the  node as dirty (Forcing it to update everything)
     * @param _property helps children apply precise "dirtyfication"
     * @returns this node
     */
    markAsDirty(_property?: string): Node;
    /**
     * Is this node enabled?
     * If the node has a parent, all ancestors will be checked and false will be returned if any are false (not enabled), otherwise will return true
     * @param checkAncestors indicates if this method should check the ancestors. The default is to check the ancestors. If set to false, the method will return the value of this node without checking ancestors
     * @returns whether this node (and its parent) is enabled
     */
    isEnabled(checkAncestors?: boolean): boolean;
    /** @internal */
    protected _syncParentEnabledState(): void;
    /**
     * Set the enabled state of this node
     * @param value defines the new enabled state
     */
    setEnabled(value: boolean): void;
    /**
     * Is this node a descendant of the given node?
     * The function will iterate up the hierarchy until the ancestor was found or no more parents defined
     * @param ancestor defines the parent node to inspect
     * @returns a boolean indicating if this node is a descendant of the given node
     */
    isDescendantOf(ancestor: Node): boolean;
    /**
     * @internal
     */
    _getDescendants(results: Node[], directDescendantsOnly?: boolean, predicate?: (node: Node) => boolean): void;
    /**
     * Will return all nodes that have this node as ascendant
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @returns all children nodes of all types
     */
    getDescendants<T extends Node>(directDescendantsOnly?: boolean, predicate?: (node: Node) => node is T): T[];
    /**
     * Will return all nodes that have this node as ascendant
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @returns all children nodes of all types
     */
    getDescendants(directDescendantsOnly?: boolean, predicate?: (node: Node) => boolean): Node[];
    /**
     * Get all child-meshes of this node
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered (Default: false)
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @returns an array of AbstractMesh
     */
    getChildMeshes<T extends AbstractMesh>(directDescendantsOnly?: boolean, predicate?: (node: Node) => node is T): T[];
    /**
     * Get all child-meshes of this node
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered (Default: false)
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @returns an array of AbstractMesh
     */
    getChildMeshes(directDescendantsOnly?: boolean, predicate?: (node: Node) => boolean): AbstractMesh[];
    /**
     * Get all direct children of this node
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered (Default: true)
     * @returns an array of Node
     */
    getChildren<T extends Node>(predicate?: (node: Node) => node is T, directDescendantsOnly?: boolean): T[];
    /**
     * Get all direct children of this node
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered (Default: true)
     * @returns an array of Node
     */
    getChildren(predicate?: (node: Node) => boolean, directDescendantsOnly?: boolean): Node[];
    /**
     * @internal
     */
    _setReady(state: boolean): void;
    /**
     * Get an animation by name
     * @param name defines the name of the animation to look for
     * @returns null if not found else the requested animation
     */
    getAnimationByName(name: string): Nullable<Animation>;
    /**
     * Creates an animation range for this node
     * @param name defines the name of the range
     * @param from defines the starting key
     * @param to defines the end key
     */
    createAnimationRange(name: string, from: number, to: number): void;
    /**
     * Delete a specific animation range
     * @param name defines the name of the range to delete
     * @param deleteFrames defines if animation frames from the range must be deleted as well
     */
    deleteAnimationRange(name: string, deleteFrames?: boolean): void;
    /**
     * Get an animation range by name
     * @param name defines the name of the animation range to look for
     * @returns null if not found else the requested animation range
     */
    getAnimationRange(name: string): Nullable<AnimationRange>;
    /**
     * Clone the current node
     * @param name Name of the new clone
     * @param newParent New parent for the clone
     * @param doNotCloneChildren Do not clone children hierarchy
     * @returns the new transform node
     */
    clone(name: string, newParent: Nullable<Node>, doNotCloneChildren?: boolean): Nullable<Node>;
    /**
     * Gets the list of all animation ranges defined on this node
     * @returns an array
     */
    getAnimationRanges(): Nullable<AnimationRange>[];
    /**
     * Will start the animation sequence
     * @param name defines the range frames for animation sequence
     * @param loop defines if the animation should loop (false by default)
     * @param speedRatio defines the speed factor in which to run the animation (1 by default)
     * @param onAnimationEnd defines a function to be executed when the animation ended (undefined by default)
     * @returns the object created for this animation. If range does not exist, it will return null
     */
    beginAnimation(name: string, loop?: boolean, speedRatio?: number, onAnimationEnd?: () => void): Nullable<Animatable>;
    /**
     * Serialize animation ranges into a JSON compatible object
     * @returns serialization object
     */
    serializeAnimationRanges(): any;
    /**
     * Computes the world matrix of the node
     * @param _force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
     * @returns the world matrix
     */
    computeWorldMatrix(_force?: boolean): Matrix;
    /**
     * Releases resources associated with this node.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
     */
    dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void;
    /**
     * Parse animation range data from a serialization object and store them into a given node
     * @param node defines where to store the animation ranges
     * @param parsedNode defines the serialization object to read data from
     * @param _scene defines the hosting scene
     */
    static ParseAnimationRanges(node: Node, parsedNode: any, _scene: Scene): void;
    /**
     * Return the minimum and maximum world vectors of the entire hierarchy under current node
     * @param includeDescendants Include bounding info from descendants as well (true by default)
     * @param predicate defines a callback function that can be customize to filter what meshes should be included in the list used to compute the bounding vectors
     * @returns the new bounding vectors
     */
    getHierarchyBoundingVectors(includeDescendants?: boolean, predicate?: Nullable<(abstractMesh: AbstractMesh) => boolean>): {
        min: Vector3;
        max: Vector3;
    };
}
