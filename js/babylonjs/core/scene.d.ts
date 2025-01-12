import type { Nullable } from "./types";
import type { IAnimatable } from "./Animations/animatable.interface";
import { Observable } from "./Misc/observable";
import type { ISmartArrayLike } from "./Misc/smartArray";
import { SmartArrayNoDuplicate, SmartArray } from "./Misc/smartArray";
import type { Vector2, Vector4 } from "./Maths/math.vector";
import { Vector3, Matrix } from "./Maths/math.vector";
import type { IParticleSystem } from "./Particles/IParticleSystem";
import { AbstractScene } from "./abstractScene";
import { ImageProcessingConfiguration } from "./Materials/imageProcessingConfiguration";
import { UniformBuffer } from "./Materials/uniformBuffer";
import { PickingInfo } from "./Collisions/pickingInfo";
import type { ICollisionCoordinator } from "./Collisions/collisionCoordinator";
import type { PointerEventTypes, PointerInfoPre, PointerInfo } from "./Events/pointerEvents";
import type { KeyboardInfoPre, KeyboardInfo } from "./Events/keyboardEvents";
import { PostProcessManager } from "./PostProcesses/postProcessManager";
import type { IOfflineProvider } from "./Offline/IOfflineProvider";
import type { RenderingGroupInfo, IRenderingManagerAutoClearSetup } from "./Rendering/renderingManager";
import { RenderingManager } from "./Rendering/renderingManager";
import type { ISceneComponent, ISceneSerializableComponent, SimpleStageAction, RenderTargetsStageAction, RenderTargetStageAction, MeshStageAction, EvaluateSubMeshStageAction, PreActiveMeshStageAction, CameraStageAction, RenderingGroupStageAction, RenderingMeshStageAction, PointerMoveStageAction, PointerUpDownStageAction, CameraStageFrameBufferAction } from "./sceneComponent";
import { Stage } from "./sceneComponent";
import type { AbstractActionManager } from "./Actions/abstractActionManager";
import type { WebRequest } from "./Misc/webRequest";
import { InputManager } from "./Inputs/scene.inputManager";
import { PerfCounter } from "./Misc/perfCounter";
import type { IFileRequest } from "./Misc/fileRequest";
import { Color4, Color3 } from "./Maths/math.color";
import type { Plane } from "./Maths/math.plane";
import type { LoadFileError, RequestFileError, ReadFileError } from "./Misc/fileTools";
import type { IClipPlanesHolder } from "./Misc/interfaces/iClipPlanesHolder";
import type { IPointerEvent } from "./Events/deviceInputEvents";
import type { AnimationPropertiesOverride } from "./Animations/animationPropertiesOverride";
import type { AnimationGroup } from "./Animations/animationGroup";
import type { Skeleton } from "./Bones/skeleton";
import type { Bone } from "./Bones/bone";
import type { Camera } from "./Cameras/camera";
import type { Collider } from "./Collisions/collider";
import type { Ray, TrianglePickingPredicate } from "./Culling/ray";
import type { Light } from "./Lights/light";
import type { PerformanceViewerCollector } from "./Misc/PerformanceViewer/performanceViewerCollector";
import type { MorphTarget } from "./Morph/morphTarget";
import type { MorphTargetManager } from "./Morph/morphTargetManager";
import type { PostProcess } from "./PostProcesses/postProcess";
import type { Material } from "./Materials/material";
import type { BaseTexture } from "./Materials/Textures/baseTexture";
import type { Geometry } from "./Meshes/geometry";
import type { TransformNode } from "./Meshes/transformNode";
import type { AbstractMesh } from "./Meshes/abstractMesh";
import type { MultiMaterial } from "./Materials/multiMaterial";
import type { Effect } from "./Materials/effect";
import type { RenderTargetTexture } from "./Materials/Textures/renderTargetTexture";
import type { SubMesh } from "./Meshes/subMesh";
import type { Node } from "./node";
import type { Animation } from "./Animations/animation";
import type { Animatable } from "./Animations/animatable";
import type { AbstractEngine } from "./Engines/abstractEngine";
/**
 * Define an interface for all classes that will hold resources
 */
export interface IDisposable {
    /**
     * Releases all held resources
     */
    dispose(): void;
}
/** Interface defining initialization parameters for Scene class */
export interface SceneOptions {
    /**
     * Defines that scene should keep up-to-date a map of geometry to enable fast look-up by uniqueId
     * It will improve performance when the number of geometries becomes important.
     */
    useGeometryUniqueIdsMap?: boolean;
    /**
     * Defines that each material of the scene should keep up-to-date a map of referencing meshes for fast disposing
     * It will improve performance when the number of mesh becomes important, but might consume a bit more memory
     */
    useMaterialMeshMap?: boolean;
    /**
     * Defines that each mesh of the scene should keep up-to-date a map of referencing cloned meshes for fast disposing
     * It will improve performance when the number of mesh becomes important, but might consume a bit more memory
     */
    useClonedMeshMap?: boolean;
    /** Defines if the creation of the scene should impact the engine (Eg. UtilityLayer's scene) */
    virtual?: boolean;
}
/**
 * Define how the scene should favor performance over ease of use
 */
export declare enum ScenePerformancePriority {
    /** Default mode. No change. Performance will be treated as less important than backward compatibility */
    BackwardCompatible = 0,
    /** Some performance options will be turned on trying to strike a balance between perf and ease of use */
    Intermediate = 1,
    /** Performance will be top priority */
    Aggressive = 2
}
/**
 * Represents a scene to be rendered by the engine.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/scene
 */
export declare class Scene extends AbstractScene implements IAnimatable, IClipPlanesHolder {
    /** The fog is deactivated */
    static readonly FOGMODE_NONE: number;
    /** The fog density is following an exponential function */
    static readonly FOGMODE_EXP: number;
    /** The fog density is following an exponential function faster than FOGMODE_EXP */
    static readonly FOGMODE_EXP2: number;
    /** The fog density is following a linear function. */
    static readonly FOGMODE_LINEAR: number;
    /**
     * Gets or sets the minimum deltatime when deterministic lock step is enabled
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep
     */
    static MinDeltaTime: number;
    /**
     * Gets or sets the maximum deltatime when deterministic lock step is enabled
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep
     */
    static MaxDeltaTime: number;
    /**
     * Factory used to create the default material.
     * @param scene The scene to create the material for
     * @returns The default material
     */
    static DefaultMaterialFactory(scene: Scene): Material;
    /**
     * Factory used to create the a collision coordinator.
     * @returns The collision coordinator
     */
    static CollisionCoordinatorFactory(): ICollisionCoordinator;
    /** @internal */
    _inputManager: InputManager;
    /** Define this parameter if you are using multiple cameras and you want to specify which one should be used for pointer position */
    cameraToUseForPointers: Nullable<Camera>;
    /** @internal */
    readonly _isScene = true;
    /** @internal */
    _blockEntityCollection: boolean;
    /**
     * Gets or sets a boolean that indicates if the scene must clear the render buffer before rendering a frame
     */
    autoClear: boolean;
    /**
     * Gets or sets a boolean that indicates if the scene must clear the depth and stencil buffers before rendering a frame
     */
    autoClearDepthAndStencil: boolean;
    /**
     * Defines the color used to clear the render buffer (Default is (0.2, 0.2, 0.3, 1.0))
     */
    clearColor: Color4;
    /**
     * Defines the color used to simulate the ambient color (Default is (0, 0, 0))
     */
    ambientColor: Color3;
    /**
     * This is use to store the default BRDF lookup for PBR materials in your scene.
     * It should only be one of the following (if not the default embedded one):
     * * For uncorrelated BRDF (pbr.brdf.useEnergyConservation = false and pbr.brdf.useSmithVisibilityHeightCorrelated = false) : https://assets.babylonjs.com/environments/uncorrelatedBRDF.dds
     * * For correlated BRDF (pbr.brdf.useEnergyConservation = false and pbr.brdf.useSmithVisibilityHeightCorrelated = true) : https://assets.babylonjs.com/environments/correlatedBRDF.dds
     * * For correlated multi scattering BRDF (pbr.brdf.useEnergyConservation = true and pbr.brdf.useSmithVisibilityHeightCorrelated = true) : https://assets.babylonjs.com/environments/correlatedMSBRDF.dds
     * The material properties need to be setup according to the type of texture in use.
     */
    environmentBRDFTexture: BaseTexture;
    /**
     * Texture used in all pbr material as the reflection texture.
     * As in the majority of the scene they are the same (exception for multi room and so on),
     * this is easier to reference from here than from all the materials.
     */
    get environmentTexture(): Nullable<BaseTexture>;
    /**
     * Texture used in all pbr material as the reflection texture.
     * As in the majority of the scene they are the same (exception for multi room and so on),
     * this is easier to set here than in all the materials.
     */
    set environmentTexture(value: Nullable<BaseTexture>);
    /**
     * Intensity of the environment in all pbr material.
     * This dims or reinforces the IBL lighting overall (reflection and diffuse).
     * As in the majority of the scene they are the same (exception for multi room and so on),
     * this is easier to reference from here than from all the materials.
     */
    environmentIntensity: number;
    /** @internal */
    protected _imageProcessingConfiguration: ImageProcessingConfiguration;
    /**
     * Default image processing configuration used either in the rendering
     * Forward main pass or through the imageProcessingPostProcess if present.
     * As in the majority of the scene they are the same (exception for multi camera),
     * this is easier to reference from here than from all the materials and post process.
     *
     * No setter as we it is a shared configuration, you can set the values instead.
     */
    get imageProcessingConfiguration(): ImageProcessingConfiguration;
    private _performancePriority;
    /**
     * Observable triggered when the performance priority is changed
     */
    onScenePerformancePriorityChangedObservable: Observable<ScenePerformancePriority>;
    /**
     * Gets or sets a value indicating how to treat performance relatively to ease of use and backward compatibility
     */
    get performancePriority(): ScenePerformancePriority;
    set performancePriority(value: ScenePerformancePriority);
    private _forceWireframe;
    /**
     * Gets or sets a boolean indicating if all rendering must be done in wireframe
     */
    set forceWireframe(value: boolean);
    get forceWireframe(): boolean;
    private _skipFrustumClipping;
    /**
     * Gets or sets a boolean indicating if we should skip the frustum clipping part of the active meshes selection
     */
    set skipFrustumClipping(value: boolean);
    get skipFrustumClipping(): boolean;
    private _forcePointsCloud;
    /**
     * Gets or sets a boolean indicating if all rendering must be done in point cloud
     */
    set forcePointsCloud(value: boolean);
    get forcePointsCloud(): boolean;
    /**
     * Gets or sets the active clipplane 1
     */
    clipPlane: Nullable<Plane>;
    /**
     * Gets or sets the active clipplane 2
     */
    clipPlane2: Nullable<Plane>;
    /**
     * Gets or sets the active clipplane 3
     */
    clipPlane3: Nullable<Plane>;
    /**
     * Gets or sets the active clipplane 4
     */
    clipPlane4: Nullable<Plane>;
    /**
     * Gets or sets the active clipplane 5
     */
    clipPlane5: Nullable<Plane>;
    /**
     * Gets or sets the active clipplane 6
     */
    clipPlane6: Nullable<Plane>;
    /**
     * Gets or sets a boolean indicating if animations are enabled
     */
    animationsEnabled: boolean;
    private _animationPropertiesOverride;
    /**
     * Gets or sets the animation properties override
     */
    get animationPropertiesOverride(): Nullable<AnimationPropertiesOverride>;
    set animationPropertiesOverride(value: Nullable<AnimationPropertiesOverride>);
    /**
     * Gets or sets a boolean indicating if a constant deltatime has to be used
     * This is mostly useful for testing purposes when you do not want the animations to scale with the framerate
     */
    useConstantAnimationDeltaTime: boolean;
    /**
     * Gets or sets a boolean indicating if the scene must keep the meshUnderPointer property updated
     * Please note that it requires to run a ray cast through the scene on every frame
     */
    constantlyUpdateMeshUnderPointer: boolean;
    /**
     * Defines the HTML cursor to use when hovering over interactive elements
     */
    hoverCursor: string;
    /**
     * Defines the HTML default cursor to use (empty by default)
     */
    defaultCursor: string;
    /**
     * Defines whether cursors are handled by the scene.
     */
    doNotHandleCursors: boolean;
    /**
     * This is used to call preventDefault() on pointer down
     * in order to block unwanted artifacts like system double clicks
     */
    preventDefaultOnPointerDown: boolean;
    /**
     * This is used to call preventDefault() on pointer up
     * in order to block unwanted artifacts like system double clicks
     */
    preventDefaultOnPointerUp: boolean;
    /**
     * Gets or sets user defined metadata
     */
    metadata: any;
    /**
     * For internal use only. Please do not use.
     */
    reservedDataStore: any;
    /**
     * Gets the name of the plugin used to load this scene (null by default)
     */
    loadingPluginName: string;
    /**
     * Use this array to add regular expressions used to disable offline support for specific urls
     */
    disableOfflineSupportExceptionRules: RegExp[];
    /**
     * An event triggered when the scene is disposed.
     */
    onDisposeObservable: Observable<Scene>;
    private _onDisposeObserver;
    /** Sets a function to be executed when this scene is disposed. */
    set onDispose(callback: () => void);
    /**
     * An event triggered before rendering the scene (right after animations and physics)
     */
    onBeforeRenderObservable: Observable<Scene>;
    private _onBeforeRenderObserver;
    /** Sets a function to be executed before rendering this scene */
    set beforeRender(callback: Nullable<() => void>);
    /**
     * An event triggered after rendering the scene
     */
    onAfterRenderObservable: Observable<Scene>;
    /**
     * An event triggered after rendering the scene for an active camera (When scene.render is called this will be called after each camera)
     * This is triggered for each "sub" camera in a Camera Rig unlike onAfterCameraRenderObservable
     */
    onAfterRenderCameraObservable: Observable<Camera>;
    private _onAfterRenderObserver;
    /** Sets a function to be executed after rendering this scene */
    set afterRender(callback: Nullable<() => void>);
    /**
     * An event triggered before animating the scene
     */
    onBeforeAnimationsObservable: Observable<Scene>;
    /**
     * An event triggered after animations processing
     */
    onAfterAnimationsObservable: Observable<Scene>;
    /**
     * An event triggered before draw calls are ready to be sent
     */
    onBeforeDrawPhaseObservable: Observable<Scene>;
    /**
     * An event triggered after draw calls have been sent
     */
    onAfterDrawPhaseObservable: Observable<Scene>;
    /**
     * An event triggered when the scene is ready
     */
    onReadyObservable: Observable<Scene>;
    /**
     * An event triggered before rendering a camera
     */
    onBeforeCameraRenderObservable: Observable<Camera>;
    private _onBeforeCameraRenderObserver;
    /** Sets a function to be executed before rendering a camera*/
    set beforeCameraRender(callback: () => void);
    /**
     * An event triggered after rendering a camera
     * This is triggered for the full rig Camera only unlike onAfterRenderCameraObservable
     */
    onAfterCameraRenderObservable: Observable<Camera>;
    private _onAfterCameraRenderObserver;
    /** Sets a function to be executed after rendering a camera*/
    set afterCameraRender(callback: () => void);
    /**
     * An event triggered when active meshes evaluation is about to start
     */
    onBeforeActiveMeshesEvaluationObservable: Observable<Scene>;
    /**
     * An event triggered when active meshes evaluation is done
     */
    onAfterActiveMeshesEvaluationObservable: Observable<Scene>;
    /**
     * An event triggered when particles rendering is about to start
     * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
     */
    onBeforeParticlesRenderingObservable: Observable<Scene>;
    /**
     * An event triggered when particles rendering is done
     * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
     */
    onAfterParticlesRenderingObservable: Observable<Scene>;
    /**
     * An event triggered when SceneLoader.Append or SceneLoader.Load or SceneLoader.ImportMesh were successfully executed
     */
    onDataLoadedObservable: Observable<Scene>;
    /**
     * An event triggered when a camera is created
     */
    onNewCameraAddedObservable: Observable<Camera>;
    /**
     * An event triggered when a camera is removed
     */
    onCameraRemovedObservable: Observable<Camera>;
    /**
     * An event triggered when a light is created
     */
    onNewLightAddedObservable: Observable<Light>;
    /**
     * An event triggered when a light is removed
     */
    onLightRemovedObservable: Observable<Light>;
    /**
     * An event triggered when a geometry is created
     */
    onNewGeometryAddedObservable: Observable<Geometry>;
    /**
     * An event triggered when a geometry is removed
     */
    onGeometryRemovedObservable: Observable<Geometry>;
    /**
     * An event triggered when a transform node is created
     */
    onNewTransformNodeAddedObservable: Observable<TransformNode>;
    /**
     * An event triggered when a transform node is removed
     */
    onTransformNodeRemovedObservable: Observable<TransformNode>;
    /**
     * An event triggered when a mesh is created
     */
    onNewMeshAddedObservable: Observable<AbstractMesh>;
    /**
     * An event triggered when a mesh is removed
     */
    onMeshRemovedObservable: Observable<AbstractMesh>;
    /**
     * An event triggered when a skeleton is created
     */
    onNewSkeletonAddedObservable: Observable<Skeleton>;
    /**
     * An event triggered when a skeleton is removed
     */
    onSkeletonRemovedObservable: Observable<Skeleton>;
    /**
     * An event triggered when a material is created
     */
    onNewMaterialAddedObservable: Observable<Material>;
    /**
     * An event triggered when a multi material is created
     */
    onNewMultiMaterialAddedObservable: Observable<MultiMaterial>;
    /**
     * An event triggered when a material is removed
     */
    onMaterialRemovedObservable: Observable<Material>;
    /**
     * An event triggered when a multi material is removed
     */
    onMultiMaterialRemovedObservable: Observable<MultiMaterial>;
    /**
     * An event triggered when a texture is created
     */
    onNewTextureAddedObservable: Observable<BaseTexture>;
    /**
     * An event triggered when a texture is removed
     */
    onTextureRemovedObservable: Observable<BaseTexture>;
    /**
     * An event triggered when render targets are about to be rendered
     * Can happen multiple times per frame.
     */
    onBeforeRenderTargetsRenderObservable: Observable<Scene>;
    /**
     * An event triggered when render targets were rendered.
     * Can happen multiple times per frame.
     */
    onAfterRenderTargetsRenderObservable: Observable<Scene>;
    /**
     * An event triggered before calculating deterministic simulation step
     */
    onBeforeStepObservable: Observable<Scene>;
    /**
     * An event triggered after calculating deterministic simulation step
     */
    onAfterStepObservable: Observable<Scene>;
    /**
     * An event triggered when the activeCamera property is updated
     */
    onActiveCameraChanged: Observable<Scene>;
    /**
     * An event triggered when the activeCameras property is updated
     */
    onActiveCamerasChanged: Observable<Scene>;
    /**
     * This Observable will be triggered before rendering each renderingGroup of each rendered camera.
     * The RenderingGroupInfo class contains all the information about the context in which the observable is called
     * If you wish to register an Observer only for a given set of renderingGroup, use the mask with a combination of the renderingGroup index elevated to the power of two (1 for renderingGroup 0, 2 for renderingrOup1, 4 for 2 and 8 for 3)
     */
    onBeforeRenderingGroupObservable: Observable<RenderingGroupInfo>;
    /**
     * This Observable will be triggered after rendering each renderingGroup of each rendered camera.
     * The RenderingGroupInfo class contains all the information about the context in which the observable is called
     * If you wish to register an Observer only for a given set of renderingGroup, use the mask with a combination of the renderingGroup index elevated to the power of two (1 for renderingGroup 0, 2 for renderingrOup1, 4 for 2 and 8 for 3)
     */
    onAfterRenderingGroupObservable: Observable<RenderingGroupInfo>;
    /**
     * This Observable will when a mesh has been imported into the scene.
     */
    onMeshImportedObservable: Observable<AbstractMesh>;
    /**
     * This Observable will when an animation file has been imported into the scene.
     */
    onAnimationFileImportedObservable: Observable<Scene>;
    /**
     * Gets or sets a user defined funtion to select LOD from a mesh and a camera.
     * By default this function is undefined and Babylon.js will select LOD based on distance to camera
     */
    customLODSelector: (mesh: AbstractMesh, camera: Camera) => Nullable<AbstractMesh>;
    /** @internal */
    _registeredForLateAnimationBindings: SmartArrayNoDuplicate<any>;
    private _pointerPickingConfiguration;
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer down event
     */
    get pointerDownPredicate(): (Mesh: AbstractMesh) => boolean;
    set pointerDownPredicate(value: (Mesh: AbstractMesh) => boolean);
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer up event
     */
    get pointerUpPredicate(): (Mesh: AbstractMesh) => boolean;
    set pointerUpPredicate(value: (Mesh: AbstractMesh) => boolean);
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer move event
     */
    get pointerMovePredicate(): (Mesh: AbstractMesh) => boolean;
    set pointerMovePredicate(value: (Mesh: AbstractMesh) => boolean);
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer down event
     */
    get pointerDownFastCheck(): boolean;
    set pointerDownFastCheck(value: boolean);
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer up event
     */
    get pointerUpFastCheck(): boolean;
    set pointerUpFastCheck(value: boolean);
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer move event
     */
    get pointerMoveFastCheck(): boolean;
    set pointerMoveFastCheck(value: boolean);
    /**
     * Gets or sets a boolean indicating if the user want to entirely skip the picking phase when a pointer move event occurs.
     */
    get skipPointerMovePicking(): boolean;
    set skipPointerMovePicking(value: boolean);
    /**
     * Gets or sets a boolean indicating if the user want to entirely skip the picking phase when a pointer down event occurs.
     */
    get skipPointerDownPicking(): boolean;
    set skipPointerDownPicking(value: boolean);
    /**
     * Gets or sets a boolean indicating if the user want to entirely skip the picking phase when a pointer up event occurs.  Off by default.
     */
    get skipPointerUpPicking(): boolean;
    set skipPointerUpPicking(value: boolean);
    /** Callback called when a pointer move is detected */
    onPointerMove?: (evt: IPointerEvent, pickInfo: PickingInfo, type: PointerEventTypes) => void;
    /** Callback called when a pointer down is detected  */
    onPointerDown?: (evt: IPointerEvent, pickInfo: PickingInfo, type: PointerEventTypes) => void;
    /** Callback called when a pointer up is detected  */
    onPointerUp?: (evt: IPointerEvent, pickInfo: Nullable<PickingInfo>, type: PointerEventTypes) => void;
    /** Callback called when a pointer pick is detected */
    onPointerPick?: (evt: IPointerEvent, pickInfo: PickingInfo) => void;
    /**
     * Gets or sets a predicate used to select candidate faces for a pointer move event
     */
    pointerMoveTrianglePredicate: ((p0: Vector3, p1: Vector3, p2: Vector3, ray: Ray) => boolean) | undefined;
    /**
     * Gets or sets a predicate used to select candidate faces for a pointer down event
     */
    pointerDownTrianglePredicate: ((p0: Vector3, p1: Vector3, p2: Vector3, ray: Ray) => boolean) | undefined;
    /**
     * Gets or sets a predicate used to select candidate faces for a pointer up event
     */
    pointerUpTrianglePredicate: ((p0: Vector3, p1: Vector3, p2: Vector3, ray: Ray) => boolean) | undefined;
    /**
     * This observable event is triggered when any ponter event is triggered. It is registered during Scene.attachControl() and it is called BEFORE the 3D engine process anything (mesh/sprite picking for instance).
     * You have the possibility to skip the process and the call to onPointerObservable by setting PointerInfoPre.skipOnPointerObservable to true
     */
    onPrePointerObservable: Observable<PointerInfoPre>;
    /**
     * Observable event triggered each time an input event is received from the rendering canvas
     */
    onPointerObservable: Observable<PointerInfo>;
    /**
     * Gets the pointer coordinates without any translation (ie. straight out of the pointer event)
     */
    get unTranslatedPointer(): Vector2;
    /**
     * Gets or sets the distance in pixel that you have to move to prevent some events. Default is 10 pixels
     */
    static get DragMovementThreshold(): number;
    static set DragMovementThreshold(value: number);
    /**
     * Time in milliseconds to wait to raise long press events if button is still pressed. Default is 500 ms
     */
    static get LongPressDelay(): number;
    static set LongPressDelay(value: number);
    /**
     * Time in milliseconds to wait to raise long press events if button is still pressed. Default is 300 ms
     */
    static get DoubleClickDelay(): number;
    static set DoubleClickDelay(value: number);
    /** If you need to check double click without raising a single click at first click, enable this flag */
    static get ExclusiveDoubleClickMode(): boolean;
    static set ExclusiveDoubleClickMode(value: boolean);
    /**
     * Bind the current view position to an effect.
     * @param effect The effect to be bound
     * @param variableName name of the shader variable that will hold the eye position
     * @param isVector3 true to indicates that variableName is a Vector3 and not a Vector4
     * @returns the computed eye position
     */
    bindEyePosition(effect: Nullable<Effect>, variableName?: string, isVector3?: boolean): Vector4;
    /**
     * Update the scene ubo before it can be used in rendering processing
     * @returns the scene UniformBuffer
     */
    finalizeSceneUbo(): UniformBuffer;
    /** @internal */
    _mirroredCameraPosition: Nullable<Vector3>;
    /**
     * This observable event is triggered when any keyboard event si raised and registered during Scene.attachControl()
     * You have the possibility to skip the process and the call to onKeyboardObservable by setting KeyboardInfoPre.skipOnPointerObservable to true
     */
    onPreKeyboardObservable: Observable<KeyboardInfoPre>;
    /**
     * Observable event triggered each time an keyboard event is received from the hosting window
     */
    onKeyboardObservable: Observable<KeyboardInfo>;
    private _useRightHandedSystem;
    /**
     * Gets or sets a boolean indicating if the scene must use right-handed coordinates system
     */
    set useRightHandedSystem(value: boolean);
    get useRightHandedSystem(): boolean;
    private _timeAccumulator;
    private _currentStepId;
    private _currentInternalStep;
    /**
     * Sets the step Id used by deterministic lock step
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep
     * @param newStepId defines the step Id
     */
    setStepId(newStepId: number): void;
    /**
     * Gets the step Id used by deterministic lock step
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep
     * @returns the step Id
     */
    getStepId(): number;
    /**
     * Gets the internal step used by deterministic lock step
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep
     * @returns the internal step
     */
    getInternalStep(): number;
    private _fogEnabled;
    /**
     * Gets or sets a boolean indicating if fog is enabled on this scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction#fog
     * (Default is true)
     */
    set fogEnabled(value: boolean);
    get fogEnabled(): boolean;
    private _fogMode;
    /**
     * Gets or sets the fog mode to use
     * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction#fog
     * | mode | value |
     * | --- | --- |
     * | FOGMODE_NONE | 0 |
     * | FOGMODE_EXP | 1 |
     * | FOGMODE_EXP2 | 2 |
     * | FOGMODE_LINEAR | 3 |
     */
    set fogMode(value: number);
    get fogMode(): number;
    /**
     * Gets or sets the fog color to use
     * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction#fog
     * (Default is Color3(0.2, 0.2, 0.3))
     */
    fogColor: Color3;
    /**
     * Gets or sets the fog density to use
     * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction#fog
     * (Default is 0.1)
     */
    fogDensity: number;
    /**
     * Gets or sets the fog start distance to use
     * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction#fog
     * (Default is 0)
     */
    fogStart: number;
    /**
     * Gets or sets the fog end distance to use
     * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction#fog
     * (Default is 1000)
     */
    fogEnd: number;
    /**
     * Flag indicating that the frame buffer binding is handled by another component
     */
    get prePass(): boolean;
    /**
     * Flag indicating if we need to store previous matrices when rendering
     */
    needsPreviousWorldMatrices: boolean;
    private _shadowsEnabled;
    /**
     * Gets or sets a boolean indicating if shadows are enabled on this scene
     */
    set shadowsEnabled(value: boolean);
    get shadowsEnabled(): boolean;
    private _lightsEnabled;
    /**
     * Gets or sets a boolean indicating if lights are enabled on this scene
     */
    set lightsEnabled(value: boolean);
    get lightsEnabled(): boolean;
    private _activeCameras;
    private _unObserveActiveCameras;
    /** All of the active cameras added to this scene. */
    get activeCameras(): Nullable<Camera[]>;
    set activeCameras(cameras: Nullable<Camera[]>);
    /** @internal */
    _activeCamera: Nullable<Camera>;
    /** Gets or sets the current active camera */
    get activeCamera(): Nullable<Camera>;
    set activeCamera(value: Nullable<Camera>);
    private _defaultMaterial;
    /** The default material used on meshes when no material is affected */
    get defaultMaterial(): Material;
    /** The default material used on meshes when no material is affected */
    set defaultMaterial(value: Material);
    private _texturesEnabled;
    /**
     * Gets or sets a boolean indicating if textures are enabled on this scene
     */
    set texturesEnabled(value: boolean);
    get texturesEnabled(): boolean;
    /**
     * Gets or sets a boolean indicating if physic engines are enabled on this scene
     */
    physicsEnabled: boolean;
    /**
     * Gets or sets a boolean indicating if particles are enabled on this scene
     */
    particlesEnabled: boolean;
    /**
     * Gets or sets a boolean indicating if sprites are enabled on this scene
     */
    spritesEnabled: boolean;
    private _skeletonsEnabled;
    /**
     * Gets or sets a boolean indicating if skeletons are enabled on this scene
     */
    set skeletonsEnabled(value: boolean);
    get skeletonsEnabled(): boolean;
    /**
     * Gets or sets a boolean indicating if lens flares are enabled on this scene
     */
    lensFlaresEnabled: boolean;
    /**
     * Gets or sets a boolean indicating if collisions are enabled on this scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
     */
    collisionsEnabled: boolean;
    private _collisionCoordinator;
    /** @internal */
    get collisionCoordinator(): ICollisionCoordinator;
    /**
     * Defines the gravity applied to this scene (used only for collisions)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
     */
    gravity: Vector3;
    /**
     * Gets or sets a boolean indicating if postprocesses are enabled on this scene
     */
    postProcessesEnabled: boolean;
    /**
     * Gets the current postprocess manager
     */
    postProcessManager: PostProcessManager;
    /**
     * Gets or sets a boolean indicating if render targets are enabled on this scene
     */
    renderTargetsEnabled: boolean;
    /**
     * Gets or sets a boolean indicating if next render targets must be dumped as image for debugging purposes
     * We recommend not using it and instead rely on Spector.js: http://spector.babylonjs.com
     */
    dumpNextRenderTargets: boolean;
    /**
     * The list of user defined render targets added to the scene
     */
    customRenderTargets: RenderTargetTexture[];
    /**
     * Defines if texture loading must be delayed
     * If true, textures will only be loaded when they need to be rendered
     */
    useDelayedTextureLoading: boolean;
    /**
     * Gets the list of meshes imported to the scene through SceneLoader
     */
    importedMeshesFiles: string[];
    /**
     * Gets or sets a boolean indicating if probes are enabled on this scene
     */
    probesEnabled: boolean;
    /**
     * Gets or sets the current offline provider to use to store scene data
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimizeCached
     */
    offlineProvider: IOfflineProvider;
    /**
     * Gets or sets the action manager associated with the scene
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions
     */
    actionManager: AbstractActionManager;
    private _meshesForIntersections;
    /**
     * Gets or sets a boolean indicating if procedural textures are enabled on this scene
     */
    proceduralTexturesEnabled: boolean;
    private _engine;
    private _totalVertices;
    /** @internal */
    _activeIndices: PerfCounter;
    /** @internal */
    _activeParticles: PerfCounter;
    /** @internal */
    _activeBones: PerfCounter;
    private _animationRatio;
    /** @internal */
    _animationTimeLast: number;
    /** @internal */
    _animationTime: number;
    /**
     * Gets or sets a general scale for animation speed
     * @see https://www.babylonjs-playground.com/#IBU2W7#3
     */
    animationTimeScale: number;
    /** @internal */
    _cachedMaterial: Nullable<Material>;
    /** @internal */
    _cachedEffect: Nullable<Effect>;
    /** @internal */
    _cachedVisibility: Nullable<number>;
    private _renderId;
    private _frameId;
    private _executeWhenReadyTimeoutId;
    private _intermediateRendering;
    private _defaultFrameBufferCleared;
    private _viewUpdateFlag;
    private _projectionUpdateFlag;
    /** @internal */
    _toBeDisposed: Nullable<IDisposable>[];
    private _activeRequests;
    /** @internal */
    _pendingData: any[];
    private _isDisposed;
    /**
     * Gets or sets a boolean indicating that all submeshes of active meshes must be rendered
     * Use this boolean to avoid computing frustum clipping on submeshes (This could help when you are CPU bound)
     */
    dispatchAllSubMeshesOfActiveMeshes: boolean;
    private _activeMeshes;
    private _processedMaterials;
    private _renderTargets;
    private _materialsRenderTargets;
    /** @internal */
    _activeParticleSystems: SmartArray<IParticleSystem>;
    private _activeSkeletons;
    private _softwareSkinnedMeshes;
    private _renderingManager;
    /**
     * Gets the scene's rendering manager
     */
    get renderingManager(): RenderingManager;
    /** @internal */
    _activeAnimatables: Animatable[];
    private _transformMatrix;
    private _sceneUbo;
    /** @internal */
    _viewMatrix: Matrix;
    /** @internal */
    _projectionMatrix: Matrix;
    /** @internal */
    _forcedViewPosition: Nullable<Vector3>;
    /** @internal */
    _frustumPlanes: Plane[];
    /**
     * Gets the list of frustum planes (built from the active camera)
     */
    get frustumPlanes(): Plane[];
    /**
     * Gets or sets a boolean indicating if lights must be sorted by priority (off by default)
     * This is useful if there are more lights that the maximum simulteanous authorized
     */
    requireLightSorting: boolean;
    /** @internal */
    readonly useMaterialMeshMap: boolean;
    /** @internal */
    readonly useClonedMeshMap: boolean;
    private _externalData;
    private _uid;
    /**
     * @internal
     * Backing store of defined scene components.
     */
    _components: ISceneComponent[];
    /**
     * @internal
     * Backing store of defined scene components.
     */
    _serializableComponents: ISceneSerializableComponent[];
    /**
     * List of components to register on the next registration step.
     */
    private _transientComponents;
    /**
     * Registers the transient components if needed.
     */
    private _registerTransientComponents;
    /**
     * @internal
     * Add a component to the scene.
     * Note that the ccomponent could be registered on th next frame if this is called after
     * the register component stage.
     * @param component Defines the component to add to the scene
     */
    _addComponent(component: ISceneComponent): void;
    /**
     * @internal
     * Gets a component from the scene.
     * @param name defines the name of the component to retrieve
     * @returns the component or null if not present
     */
    _getComponent(name: string): Nullable<ISceneComponent>;
    /**
     * @internal
     * Defines the actions happening before camera updates.
     */
    _beforeCameraUpdateStage: Stage<SimpleStageAction>;
    /**
     * @internal
     * Defines the actions happening before clear the canvas.
     */
    _beforeClearStage: Stage<SimpleStageAction>;
    /**
     * @internal
     * Defines the actions happening before clear the canvas.
     */
    _beforeRenderTargetClearStage: Stage<RenderTargetStageAction>;
    /**
     * @internal
     * Defines the actions when collecting render targets for the frame.
     */
    _gatherRenderTargetsStage: Stage<RenderTargetsStageAction>;
    /**
     * @internal
     * Defines the actions happening for one camera in the frame.
     */
    _gatherActiveCameraRenderTargetsStage: Stage<RenderTargetsStageAction>;
    /**
     * @internal
     * Defines the actions happening during the per mesh ready checks.
     */
    _isReadyForMeshStage: Stage<MeshStageAction>;
    /**
     * @internal
     * Defines the actions happening before evaluate active mesh checks.
     */
    _beforeEvaluateActiveMeshStage: Stage<SimpleStageAction>;
    /**
     * @internal
     * Defines the actions happening during the evaluate sub mesh checks.
     */
    _evaluateSubMeshStage: Stage<EvaluateSubMeshStageAction>;
    /**
     * @internal
     * Defines the actions happening during the active mesh stage.
     */
    _preActiveMeshStage: Stage<PreActiveMeshStageAction>;
    /**
     * @internal
     * Defines the actions happening during the per camera render target step.
     */
    _cameraDrawRenderTargetStage: Stage<CameraStageFrameBufferAction>;
    /**
     * @internal
     * Defines the actions happening just before the active camera is drawing.
     */
    _beforeCameraDrawStage: Stage<CameraStageAction>;
    /**
     * @internal
     * Defines the actions happening just before a render target is drawing.
     */
    _beforeRenderTargetDrawStage: Stage<RenderTargetStageAction>;
    /**
     * @internal
     * Defines the actions happening just before a rendering group is drawing.
     */
    _beforeRenderingGroupDrawStage: Stage<RenderingGroupStageAction>;
    /**
     * @internal
     * Defines the actions happening just before a mesh is drawing.
     */
    _beforeRenderingMeshStage: Stage<RenderingMeshStageAction>;
    /**
     * @internal
     * Defines the actions happening just after a mesh has been drawn.
     */
    _afterRenderingMeshStage: Stage<RenderingMeshStageAction>;
    /**
     * @internal
     * Defines the actions happening just after a rendering group has been drawn.
     */
    _afterRenderingGroupDrawStage: Stage<RenderingGroupStageAction>;
    /**
     * @internal
     * Defines the actions happening just after the active camera has been drawn.
     */
    _afterCameraDrawStage: Stage<CameraStageAction>;
    /**
     * @internal
     * Defines the actions happening just after the post processing
     */
    _afterCameraPostProcessStage: Stage<CameraStageAction>;
    /**
     * @internal
     * Defines the actions happening just after a render target has been drawn.
     */
    _afterRenderTargetDrawStage: Stage<RenderTargetStageAction>;
    /**
     * Defines the actions happening just after the post processing on a render target
     */
    _afterRenderTargetPostProcessStage: Stage<RenderTargetStageAction>;
    /**
     * @internal
     * Defines the actions happening just after rendering all cameras and computing intersections.
     */
    _afterRenderStage: Stage<SimpleStageAction>;
    /**
     * @internal
     * Defines the actions happening when a pointer move event happens.
     */
    _pointerMoveStage: Stage<PointerMoveStageAction>;
    /**
     * @internal
     * Defines the actions happening when a pointer down event happens.
     */
    _pointerDownStage: Stage<PointerUpDownStageAction>;
    /**
     * @internal
     * Defines the actions happening when a pointer up event happens.
     */
    _pointerUpStage: Stage<PointerUpDownStageAction>;
    /**
     * an optional map from Geometry Id to Geometry index in the 'geometries' array
     */
    private _geometriesByUniqueId;
    /**
     * Creates a new Scene
     * @param engine defines the engine to use to render this scene
     * @param options defines the scene options
     */
    constructor(engine: AbstractEngine, options?: SceneOptions);
    /**
     * Gets a string identifying the name of the class
     * @returns "Scene" string
     */
    getClassName(): string;
    private _defaultMeshCandidates;
    /**
     * @internal
     */
    _getDefaultMeshCandidates(): ISmartArrayLike<AbstractMesh>;
    private _defaultSubMeshCandidates;
    /**
     * @internal
     */
    _getDefaultSubMeshCandidates(mesh: AbstractMesh): ISmartArrayLike<SubMesh>;
    /**
     * Sets the default candidate providers for the scene.
     * This sets the getActiveMeshCandidates, getActiveSubMeshCandidates, getIntersectingSubMeshCandidates
     * and getCollidingSubMeshCandidates to their default function
     */
    setDefaultCandidateProviders(): void;
    /**
     * Gets the mesh that is currently under the pointer
     */
    get meshUnderPointer(): Nullable<AbstractMesh>;
    /**
     * Gets or sets the current on-screen X position of the pointer
     */
    get pointerX(): number;
    set pointerX(value: number);
    /**
     * Gets or sets the current on-screen Y position of the pointer
     */
    get pointerY(): number;
    set pointerY(value: number);
    /**
     * Gets the cached material (ie. the latest rendered one)
     * @returns the cached material
     */
    getCachedMaterial(): Nullable<Material>;
    /**
     * Gets the cached effect (ie. the latest rendered one)
     * @returns the cached effect
     */
    getCachedEffect(): Nullable<Effect>;
    /**
     * Gets the cached visibility state (ie. the latest rendered one)
     * @returns the cached visibility state
     */
    getCachedVisibility(): Nullable<number>;
    /**
     * Gets a boolean indicating if the current material / effect / visibility must be bind again
     * @param material defines the current material
     * @param effect defines the current effect
     * @param visibility defines the current visibility state
     * @returns true if one parameter is not cached
     */
    isCachedMaterialInvalid(material: Material, effect: Effect, visibility?: number): boolean;
    /**
     * Gets the engine associated with the scene
     * @returns an Engine
     */
    getEngine(): AbstractEngine;
    /**
     * Gets the total number of vertices rendered per frame
     * @returns the total number of vertices rendered per frame
     */
    getTotalVertices(): number;
    /**
     * Gets the performance counter for total vertices
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#instrumentation
     */
    get totalVerticesPerfCounter(): PerfCounter;
    /**
     * Gets the total number of active indices rendered per frame (You can deduce the number of rendered triangles by dividing this number by 3)
     * @returns the total number of active indices rendered per frame
     */
    getActiveIndices(): number;
    /**
     * Gets the performance counter for active indices
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#instrumentation
     */
    get totalActiveIndicesPerfCounter(): PerfCounter;
    /**
     * Gets the total number of active particles rendered per frame
     * @returns the total number of active particles rendered per frame
     */
    getActiveParticles(): number;
    /**
     * Gets the performance counter for active particles
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#instrumentation
     */
    get activeParticlesPerfCounter(): PerfCounter;
    /**
     * Gets the total number of active bones rendered per frame
     * @returns the total number of active bones rendered per frame
     */
    getActiveBones(): number;
    /**
     * Gets the performance counter for active bones
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#instrumentation
     */
    get activeBonesPerfCounter(): PerfCounter;
    /**
     * Gets the array of active meshes
     * @returns an array of AbstractMesh
     */
    getActiveMeshes(): SmartArray<AbstractMesh>;
    /**
     * Gets the animation ratio (which is 1.0 is the scene renders at 60fps and 2 if the scene renders at 30fps, etc.)
     * @returns a number
     */
    getAnimationRatio(): number;
    /**
     * Gets an unique Id for the current render phase
     * @returns a number
     */
    getRenderId(): number;
    /**
     * Gets an unique Id for the current frame
     * @returns a number
     */
    getFrameId(): number;
    /** Call this function if you want to manually increment the render Id*/
    incrementRenderId(): void;
    private _createUbo;
    /**
     * Use this method to simulate a pointer move on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     * @returns the current scene
     */
    simulatePointerMove(pickResult: PickingInfo, pointerEventInit?: PointerEventInit): Scene;
    /**
     * Use this method to simulate a pointer down on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     * @returns the current scene
     */
    simulatePointerDown(pickResult: PickingInfo, pointerEventInit?: PointerEventInit): Scene;
    /**
     * Use this method to simulate a pointer up on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     * @param doubleTap indicates that the pointer up event should be considered as part of a double click (false by default)
     * @returns the current scene
     */
    simulatePointerUp(pickResult: PickingInfo, pointerEventInit?: PointerEventInit, doubleTap?: boolean): Scene;
    /**
     * Gets a boolean indicating if the current pointer event is captured (meaning that the scene has already handled the pointer down)
     * @param pointerId defines the pointer id to use in a multi-touch scenario (0 by default)
     * @returns true if the pointer was captured
     */
    isPointerCaptured(pointerId?: number): boolean;
    /**
     * Attach events to the canvas (To handle actionManagers triggers and raise onPointerMove, onPointerDown and onPointerUp
     * @param attachUp defines if you want to attach events to pointerup
     * @param attachDown defines if you want to attach events to pointerdown
     * @param attachMove defines if you want to attach events to pointermove
     */
    attachControl(attachUp?: boolean, attachDown?: boolean, attachMove?: boolean): void;
    /** Detaches all event handlers*/
    detachControl(): void;
    /**
     * This function will check if the scene can be rendered (textures are loaded, shaders are compiled)
     * Delay loaded resources are not taking in account
     * @param checkRenderTargets true to also check that the meshes rendered as part of a render target are ready (default: true)
     * @returns true if all required resources are ready
     */
    isReady(checkRenderTargets?: boolean): boolean;
    /** Resets all cached information relative to material (including effect and visibility) */
    resetCachedMaterial(): void;
    /**
     * Registers a function to be called before every frame render
     * @param func defines the function to register
     */
    registerBeforeRender(func: () => void): void;
    /**
     * Unregisters a function called before every frame render
     * @param func defines the function to unregister
     */
    unregisterBeforeRender(func: () => void): void;
    /**
     * Registers a function to be called after every frame render
     * @param func defines the function to register
     */
    registerAfterRender(func: () => void): void;
    /**
     * Unregisters a function called after every frame render
     * @param func defines the function to unregister
     */
    unregisterAfterRender(func: () => void): void;
    private _executeOnceBeforeRender;
    /**
     * The provided function will run before render once and will be disposed afterwards.
     * A timeout delay can be provided so that the function will be executed in N ms.
     * The timeout is using the browser's native setTimeout so time percision cannot be guaranteed.
     * @param func The function to be executed.
     * @param timeout optional delay in ms
     */
    executeOnceBeforeRender(func: () => void, timeout?: number): void;
    /**
     * This function can help adding any object to the list of data awaited to be ready in order to check for a complete scene loading.
     * @param data defines the object to wait for
     */
    addPendingData(data: any): void;
    /**
     * Remove a pending data from the loading list which has previously been added with addPendingData.
     * @param data defines the object to remove from the pending list
     */
    removePendingData(data: any): void;
    /**
     * Returns the number of items waiting to be loaded
     * @returns the number of items waiting to be loaded
     */
    getWaitingItemsCount(): number;
    /**
     * Returns a boolean indicating if the scene is still loading data
     */
    get isLoading(): boolean;
    /**
     * Registers a function to be executed when the scene is ready
     * @param func - the function to be executed
     * @param checkRenderTargets true to also check that the meshes rendered as part of a render target are ready (default: false)
     */
    executeWhenReady(func: () => void, checkRenderTargets?: boolean): void;
    /**
     * Returns a promise that resolves when the scene is ready
     * @param checkRenderTargets true to also check that the meshes rendered as part of a render target are ready (default: false)
     * @returns A promise that resolves when the scene is ready
     */
    whenReadyAsync(checkRenderTargets?: boolean): Promise<void>;
    /**
     * @internal
     */
    _checkIsReady(checkRenderTargets?: boolean): void;
    /**
     * Gets all animatable attached to the scene
     */
    get animatables(): Animatable[];
    /**
     * Resets the last animation time frame.
     * Useful to override when animations start running when loading a scene for the first time.
     */
    resetLastAnimationTimeFrame(): void;
    /**
     * Gets the current view matrix
     * @returns a Matrix
     */
    getViewMatrix(): Matrix;
    /**
     * Gets the current projection matrix
     * @returns a Matrix
     */
    getProjectionMatrix(): Matrix;
    /**
     * Gets the current transform matrix
     * @returns a Matrix made of View * Projection
     */
    getTransformMatrix(): Matrix;
    /**
     * Sets the current transform matrix
     * @param viewL defines the View matrix to use
     * @param projectionL defines the Projection matrix to use
     * @param viewR defines the right View matrix to use (if provided)
     * @param projectionR defines the right Projection matrix to use (if provided)
     */
    setTransformMatrix(viewL: Matrix, projectionL: Matrix, viewR?: Matrix, projectionR?: Matrix): void;
    /**
     * Gets the uniform buffer used to store scene data
     * @returns a UniformBuffer
     */
    getSceneUniformBuffer(): UniformBuffer;
    /**
     * Creates a scene UBO
     * @param name name of the uniform buffer (optional, for debugging purpose only)
     * @returns a new ubo
     */
    createSceneUniformBuffer(name?: string): UniformBuffer;
    /**
     * Sets the scene ubo
     * @param ubo the ubo to set for the scene
     */
    setSceneUniformBuffer(ubo: UniformBuffer): void;
    /**
     * Gets an unique (relatively to the current scene) Id
     * @returns an unique number for the scene
     */
    getUniqueId(): number;
    /**
     * Add a mesh to the list of scene's meshes
     * @param newMesh defines the mesh to add
     * @param recursive if all child meshes should also be added to the scene
     */
    addMesh(newMesh: AbstractMesh, recursive?: boolean): void;
    /**
     * Remove a mesh for the list of scene's meshes
     * @param toRemove defines the mesh to remove
     * @param recursive if all child meshes should also be removed from the scene
     * @returns the index where the mesh was in the mesh list
     */
    removeMesh(toRemove: AbstractMesh, recursive?: boolean): number;
    /**
     * Add a transform node to the list of scene's transform nodes
     * @param newTransformNode defines the transform node to add
     */
    addTransformNode(newTransformNode: TransformNode): void;
    /**
     * Remove a transform node for the list of scene's transform nodes
     * @param toRemove defines the transform node to remove
     * @returns the index where the transform node was in the transform node list
     */
    removeTransformNode(toRemove: TransformNode): number;
    /**
     * Remove a skeleton for the list of scene's skeletons
     * @param toRemove defines the skeleton to remove
     * @returns the index where the skeleton was in the skeleton list
     */
    removeSkeleton(toRemove: Skeleton): number;
    /**
     * Remove a morph target for the list of scene's morph targets
     * @param toRemove defines the morph target to remove
     * @returns the index where the morph target was in the morph target list
     */
    removeMorphTargetManager(toRemove: MorphTargetManager): number;
    /**
     * Remove a light for the list of scene's lights
     * @param toRemove defines the light to remove
     * @returns the index where the light was in the light list
     */
    removeLight(toRemove: Light): number;
    /**
     * Remove a camera for the list of scene's cameras
     * @param toRemove defines the camera to remove
     * @returns the index where the camera was in the camera list
     */
    removeCamera(toRemove: Camera): number;
    /**
     * Remove a particle system for the list of scene's particle systems
     * @param toRemove defines the particle system to remove
     * @returns the index where the particle system was in the particle system list
     */
    removeParticleSystem(toRemove: IParticleSystem): number;
    /**
     * Remove a animation for the list of scene's animations
     * @param toRemove defines the animation to remove
     * @returns the index where the animation was in the animation list
     */
    removeAnimation(toRemove: Animation): number;
    /**
     * Will stop the animation of the given target
     * @param target - the target
     * @param animationName - the name of the animation to stop (all animations will be stopped if both this and targetMask are empty)
     * @param targetMask - a function that determines if the animation should be stopped based on its target (all animations will be stopped if both this and animationName are empty)
     */
    stopAnimation(target: any, animationName?: string, targetMask?: (target: any) => boolean): void;
    /**
     * Removes the given animation group from this scene.
     * @param toRemove The animation group to remove
     * @returns The index of the removed animation group
     */
    removeAnimationGroup(toRemove: AnimationGroup): number;
    /**
     * Removes the given multi-material from this scene.
     * @param toRemove The multi-material to remove
     * @returns The index of the removed multi-material
     */
    removeMultiMaterial(toRemove: MultiMaterial): number;
    /**
     * Removes the given material from this scene.
     * @param toRemove The material to remove
     * @returns The index of the removed material
     */
    removeMaterial(toRemove: Material): number;
    /**
     * Removes the given action manager from this scene.
     * @deprecated
     * @param toRemove The action manager to remove
     * @returns The index of the removed action manager
     */
    removeActionManager(toRemove: AbstractActionManager): number;
    /**
     * Removes the given texture from this scene.
     * @param toRemove The texture to remove
     * @returns The index of the removed texture
     */
    removeTexture(toRemove: BaseTexture): number;
    /**
     * Adds the given light to this scene
     * @param newLight The light to add
     */
    addLight(newLight: Light): void;
    /**
     * Sorts the list list based on light priorities
     */
    sortLightsByPriority(): void;
    /**
     * Adds the given camera to this scene
     * @param newCamera The camera to add
     */
    addCamera(newCamera: Camera): void;
    /**
     * Adds the given skeleton to this scene
     * @param newSkeleton The skeleton to add
     */
    addSkeleton(newSkeleton: Skeleton): void;
    /**
     * Adds the given particle system to this scene
     * @param newParticleSystem The particle system to add
     */
    addParticleSystem(newParticleSystem: IParticleSystem): void;
    /**
     * Adds the given animation to this scene
     * @param newAnimation The animation to add
     */
    addAnimation(newAnimation: Animation): void;
    /**
     * Adds the given animation group to this scene.
     * @param newAnimationGroup The animation group to add
     */
    addAnimationGroup(newAnimationGroup: AnimationGroup): void;
    /**
     * Adds the given multi-material to this scene
     * @param newMultiMaterial The multi-material to add
     */
    addMultiMaterial(newMultiMaterial: MultiMaterial): void;
    /**
     * Adds the given material to this scene
     * @param newMaterial The material to add
     */
    addMaterial(newMaterial: Material): void;
    /**
     * Adds the given morph target to this scene
     * @param newMorphTargetManager The morph target to add
     */
    addMorphTargetManager(newMorphTargetManager: MorphTargetManager): void;
    /**
     * Adds the given geometry to this scene
     * @param newGeometry The geometry to add
     */
    addGeometry(newGeometry: Geometry): void;
    /**
     * Adds the given action manager to this scene
     * @deprecated
     * @param newActionManager The action manager to add
     */
    addActionManager(newActionManager: AbstractActionManager): void;
    /**
     * Adds the given texture to this scene.
     * @param newTexture The texture to add
     */
    addTexture(newTexture: BaseTexture): void;
    /**
     * Switch active camera
     * @param newCamera defines the new active camera
     * @param attachControl defines if attachControl must be called for the new active camera (default: true)
     */
    switchActiveCamera(newCamera: Camera, attachControl?: boolean): void;
    /**
     * sets the active camera of the scene using its Id
     * @param id defines the camera's Id
     * @returns the new active camera or null if none found.
     */
    setActiveCameraById(id: string): Nullable<Camera>;
    /**
     * sets the active camera of the scene using its name
     * @param name defines the camera's name
     * @returns the new active camera or null if none found.
     */
    setActiveCameraByName(name: string): Nullable<Camera>;
    /**
     * get an animation group using its name
     * @param name defines the material's name
     * @returns the animation group or null if none found.
     */
    getAnimationGroupByName(name: string): Nullable<AnimationGroup>;
    private _getMaterial;
    /**
     * Get a material using its unique id
     * @param uniqueId defines the material's unique id
     * @param allowMultiMaterials determines whether multimaterials should be considered
     * @returns the material or null if none found.
     */
    getMaterialByUniqueID(uniqueId: number, allowMultiMaterials?: boolean): Nullable<Material>;
    /**
     * get a material using its id
     * @param id defines the material's Id
     * @param allowMultiMaterials determines whether multimaterials should be considered
     * @returns the material or null if none found.
     */
    getMaterialById(id: string, allowMultiMaterials?: boolean): Nullable<Material>;
    /**
     * Gets a material using its name
     * @param name defines the material's name
     * @param allowMultiMaterials determines whether multimaterials should be considered
     * @returns the material or null if none found.
     */
    getMaterialByName(name: string, allowMultiMaterials?: boolean): Nullable<Material>;
    /**
     * Gets a last added material using a given id
     * @param id defines the material's id
     * @param allowMultiMaterials determines whether multimaterials should be considered
     * @returns the last material with the given id or null if none found.
     */
    getLastMaterialById(id: string, allowMultiMaterials?: boolean): Nullable<Material>;
    /**
     * Get a texture using its unique id
     * @param uniqueId defines the texture's unique id
     * @returns the texture or null if none found.
     */
    getTextureByUniqueId(uniqueId: number): Nullable<BaseTexture>;
    /**
     * Gets a texture using its name
     * @param name defines the texture's name
     * @returns the texture or null if none found.
     */
    getTextureByName(name: string): Nullable<BaseTexture>;
    /**
     * Gets a camera using its Id
     * @param id defines the Id to look for
     * @returns the camera or null if not found
     */
    getCameraById(id: string): Nullable<Camera>;
    /**
     * Gets a camera using its unique Id
     * @param uniqueId defines the unique Id to look for
     * @returns the camera or null if not found
     */
    getCameraByUniqueId(uniqueId: number): Nullable<Camera>;
    /**
     * Gets a camera using its name
     * @param name defines the camera's name
     * @returns the camera or null if none found.
     */
    getCameraByName(name: string): Nullable<Camera>;
    /**
     * Gets a bone using its Id
     * @param id defines the bone's Id
     * @returns the bone or null if not found
     */
    getBoneById(id: string): Nullable<Bone>;
    /**
     * Gets a bone using its id
     * @param name defines the bone's name
     * @returns the bone or null if not found
     */
    getBoneByName(name: string): Nullable<Bone>;
    /**
     * Gets a light node using its name
     * @param name defines the light's name
     * @returns the light or null if none found.
     */
    getLightByName(name: string): Nullable<Light>;
    /**
     * Gets a light node using its Id
     * @param id defines the light's Id
     * @returns the light or null if none found.
     */
    getLightById(id: string): Nullable<Light>;
    /**
     * Gets a light node using its scene-generated unique Id
     * @param uniqueId defines the light's unique Id
     * @returns the light or null if none found.
     */
    getLightByUniqueId(uniqueId: number): Nullable<Light>;
    /**
     * Gets a particle system by Id
     * @param id defines the particle system Id
     * @returns the corresponding system or null if none found
     */
    getParticleSystemById(id: string): Nullable<IParticleSystem>;
    /**
     * Gets a geometry using its Id
     * @param id defines the geometry's Id
     * @returns the geometry or null if none found.
     */
    getGeometryById(id: string): Nullable<Geometry>;
    private _getGeometryByUniqueId;
    /**
     * Add a new geometry to this scene
     * @param geometry defines the geometry to be added to the scene.
     * @param force defines if the geometry must be pushed even if a geometry with this id already exists
     * @returns a boolean defining if the geometry was added or not
     */
    pushGeometry(geometry: Geometry, force?: boolean): boolean;
    /**
     * Removes an existing geometry
     * @param geometry defines the geometry to be removed from the scene
     * @returns a boolean defining if the geometry was removed or not
     */
    removeGeometry(geometry: Geometry): boolean;
    /**
     * Gets the list of geometries attached to the scene
     * @returns an array of Geometry
     */
    getGeometries(): Geometry[];
    /**
     * Gets the first added mesh found of a given Id
     * @param id defines the Id to search for
     * @returns the mesh found or null if not found at all
     */
    getMeshById(id: string): Nullable<AbstractMesh>;
    /**
     * Gets a list of meshes using their Id
     * @param id defines the Id to search for
     * @returns a list of meshes
     */
    getMeshesById(id: string): Array<AbstractMesh>;
    /**
     * Gets the first added transform node found of a given Id
     * @param id defines the Id to search for
     * @returns the found transform node or null if not found at all.
     */
    getTransformNodeById(id: string): Nullable<TransformNode>;
    /**
     * Gets a transform node with its auto-generated unique Id
     * @param uniqueId defines the unique Id to search for
     * @returns the found transform node or null if not found at all.
     */
    getTransformNodeByUniqueId(uniqueId: number): Nullable<TransformNode>;
    /**
     * Gets a list of transform nodes using their Id
     * @param id defines the Id to search for
     * @returns a list of transform nodes
     */
    getTransformNodesById(id: string): Array<TransformNode>;
    /**
     * Gets a mesh with its auto-generated unique Id
     * @param uniqueId defines the unique Id to search for
     * @returns the found mesh or null if not found at all.
     */
    getMeshByUniqueId(uniqueId: number): Nullable<AbstractMesh>;
    /**
     * Gets a the last added mesh using a given Id
     * @param id defines the Id to search for
     * @returns the found mesh or null if not found at all.
     */
    getLastMeshById(id: string): Nullable<AbstractMesh>;
    /**
     * Gets a the last transform node using a given Id
     * @param id defines the Id to search for
     * @returns the found mesh or null if not found at all.
     */
    getLastTransformNodeById(id: string): Nullable<TransformNode>;
    /**
     * Gets a the last added node (Mesh, Camera, Light) using a given Id
     * @param id defines the Id to search for
     * @returns the found node or null if not found at all
     */
    getLastEntryById(id: string): Nullable<Node>;
    /**
     * Gets a node (Mesh, Camera, Light) using a given Id
     * @param id defines the Id to search for
     * @returns the found node or null if not found at all
     */
    getNodeById(id: string): Nullable<Node>;
    /**
     * Gets a node (Mesh, Camera, Light) using a given name
     * @param name defines the name to search for
     * @returns the found node or null if not found at all.
     */
    getNodeByName(name: string): Nullable<Node>;
    /**
     * Gets a mesh using a given name
     * @param name defines the name to search for
     * @returns the found mesh or null if not found at all.
     */
    getMeshByName(name: string): Nullable<AbstractMesh>;
    /**
     * Gets a transform node using a given name
     * @param name defines the name to search for
     * @returns the found transform node or null if not found at all.
     */
    getTransformNodeByName(name: string): Nullable<TransformNode>;
    /**
     * Gets a skeleton using a given Id (if many are found, this function will pick the last one)
     * @param id defines the Id to search for
     * @returns the found skeleton or null if not found at all.
     */
    getLastSkeletonById(id: string): Nullable<Skeleton>;
    /**
     * Gets a skeleton using a given auto generated unique id
     * @param  uniqueId defines the unique id to search for
     * @returns the found skeleton or null if not found at all.
     */
    getSkeletonByUniqueId(uniqueId: number): Nullable<Skeleton>;
    /**
     * Gets a skeleton using a given id (if many are found, this function will pick the first one)
     * @param id defines the id to search for
     * @returns the found skeleton or null if not found at all.
     */
    getSkeletonById(id: string): Nullable<Skeleton>;
    /**
     * Gets a skeleton using a given name
     * @param name defines the name to search for
     * @returns the found skeleton or null if not found at all.
     */
    getSkeletonByName(name: string): Nullable<Skeleton>;
    /**
     * Gets a morph target manager  using a given id (if many are found, this function will pick the last one)
     * @param id defines the id to search for
     * @returns the found morph target manager or null if not found at all.
     */
    getMorphTargetManagerById(id: number): Nullable<MorphTargetManager>;
    /**
     * Gets a morph target using a given id (if many are found, this function will pick the first one)
     * @param id defines the id to search for
     * @returns the found morph target or null if not found at all.
     */
    getMorphTargetById(id: string): Nullable<MorphTarget>;
    /**
     * Gets a morph target using a given name (if many are found, this function will pick the first one)
     * @param name defines the name to search for
     * @returns the found morph target or null if not found at all.
     */
    getMorphTargetByName(name: string): Nullable<MorphTarget>;
    /**
     * Gets a post process using a given name (if many are found, this function will pick the first one)
     * @param name defines the name to search for
     * @returns the found post process or null if not found at all.
     */
    getPostProcessByName(name: string): Nullable<PostProcess>;
    /**
     * Gets a boolean indicating if the given mesh is active
     * @param mesh defines the mesh to look for
     * @returns true if the mesh is in the active list
     */
    isActiveMesh(mesh: AbstractMesh): boolean;
    /**
     * Return a unique id as a string which can serve as an identifier for the scene
     */
    get uid(): string;
    /**
     * Add an externally attached data from its key.
     * This method call will fail and return false, if such key already exists.
     * If you don't care and just want to get the data no matter what, use the more convenient getOrAddExternalDataWithFactory() method.
     * @param key the unique key that identifies the data
     * @param data the data object to associate to the key for this Engine instance
     * @returns true if no such key were already present and the data was added successfully, false otherwise
     */
    addExternalData<T extends Object>(key: string, data: T): boolean;
    /**
     * Get an externally attached data from its key
     * @param key the unique key that identifies the data
     * @returns the associated data, if present (can be null), or undefined if not present
     */
    getExternalData<T>(key: string): Nullable<T>;
    /**
     * Get an externally attached data from its key, create it using a factory if it's not already present
     * @param key the unique key that identifies the data
     * @param factory the factory that will be called to create the instance if and only if it doesn't exists
     * @returns the associated data, can be null if the factory returned null.
     */
    getOrAddExternalDataWithFactory<T extends Object>(key: string, factory: (k: string) => T): T;
    /**
     * Remove an externally attached data from the Engine instance
     * @param key the unique key that identifies the data
     * @returns true if the data was successfully removed, false if it doesn't exist
     */
    removeExternalData(key: string): boolean;
    private _evaluateSubMesh;
    /**
     * Clear the processed materials smart array preventing retention point in material dispose.
     */
    freeProcessedMaterials(): void;
    private _preventFreeActiveMeshesAndRenderingGroups;
    /** Gets or sets a boolean blocking all the calls to freeActiveMeshes and freeRenderingGroups
     * It can be used in order to prevent going through methods freeRenderingGroups and freeActiveMeshes several times to improve performance
     * when disposing several meshes in a row or a hierarchy of meshes.
     * When used, it is the responsibility of the user to blockfreeActiveMeshesAndRenderingGroups back to false.
     */
    get blockfreeActiveMeshesAndRenderingGroups(): boolean;
    set blockfreeActiveMeshesAndRenderingGroups(value: boolean);
    /**
     * Clear the active meshes smart array preventing retention point in mesh dispose.
     */
    freeActiveMeshes(): void;
    /**
     * Clear the info related to rendering groups preventing retention points during dispose.
     */
    freeRenderingGroups(): void;
    /** @internal */
    _isInIntermediateRendering(): boolean;
    /**
     * Lambda returning the list of potentially active meshes.
     */
    getActiveMeshCandidates: () => ISmartArrayLike<AbstractMesh>;
    /**
     * Lambda returning the list of potentially active sub meshes.
     */
    getActiveSubMeshCandidates: (mesh: AbstractMesh) => ISmartArrayLike<SubMesh>;
    /**
     * Lambda returning the list of potentially intersecting sub meshes.
     */
    getIntersectingSubMeshCandidates: (mesh: AbstractMesh, localRay: Ray) => ISmartArrayLike<SubMesh>;
    /**
     * Lambda returning the list of potentially colliding sub meshes.
     */
    getCollidingSubMeshCandidates: (mesh: AbstractMesh, collider: Collider) => ISmartArrayLike<SubMesh>;
    /** @internal */
    _activeMeshesFrozen: boolean;
    /** @internal */
    _activeMeshesFrozenButKeepClipping: boolean;
    private _skipEvaluateActiveMeshesCompletely;
    /**
     * Use this function to stop evaluating active meshes. The current list will be keep alive between frames
     * @param skipEvaluateActiveMeshes defines an optional boolean indicating that the evaluate active meshes step must be completely skipped
     * @param onSuccess optional success callback
     * @param onError optional error callback
     * @param freezeMeshes defines if meshes should be frozen (true by default)
     * @param keepFrustumCulling defines if you want to keep running the frustum clipping (false by default)
     * @returns the current scene
     */
    freezeActiveMeshes(skipEvaluateActiveMeshes?: boolean, onSuccess?: () => void, onError?: (message: string) => void, freezeMeshes?: boolean, keepFrustumCulling?: boolean): Scene;
    /**
     * Use this function to restart evaluating active meshes on every frame
     * @returns the current scene
     */
    unfreezeActiveMeshes(): Scene;
    private _executeActiveContainerCleanup;
    private _evaluateActiveMeshes;
    private _activeMesh;
    /**
     * Update the transform matrix to update from the current active camera
     * @param force defines a boolean used to force the update even if cache is up to date
     */
    updateTransformMatrix(force?: boolean): void;
    private _bindFrameBuffer;
    private _clearFrameBuffer;
    /** @internal */
    _allowPostProcessClearColor: boolean;
    /**
     * @internal
     */
    _renderForCamera(camera: Camera, rigParent?: Camera, bindFrameBuffer?: boolean): void;
    private _processSubCameras;
    private _checkIntersections;
    /**
     * @internal
     */
    _advancePhysicsEngineStep(step: number): void;
    /**
     * User updatable function that will return a deterministic frame time when engine is in deterministic lock step mode
     * @returns the frame time
     */
    getDeterministicFrameTime: () => number;
    /** @internal */
    _animate(customDeltaTime?: number): void;
    /** Execute all animations (for a frame) */
    animate(): void;
    private _clear;
    private _checkCameraRenderTarget;
    /**
     * Resets the draw wrappers cache of all meshes
     * @param passId If provided, releases only the draw wrapper corresponding to this render pass id
     */
    resetDrawCache(passId?: number): void;
    /**
     * Render the scene
     * @param updateCameras defines a boolean indicating if cameras must update according to their inputs (true by default)
     * @param ignoreAnimations defines a boolean indicating if animations should not be executed (false by default)
     */
    render(updateCameras?: boolean, ignoreAnimations?: boolean): void;
    /**
     * Freeze all materials
     * A frozen material will not be updatable but should be faster to render
     * Note: multimaterials will not be frozen, but their submaterials will
     */
    freezeMaterials(): void;
    /**
     * Unfreeze all materials
     * A frozen material will not be updatable but should be faster to render
     */
    unfreezeMaterials(): void;
    /**
     * Releases all held resources
     */
    dispose(): void;
    private _disposeList;
    /**
     * Gets if the scene is already disposed
     */
    get isDisposed(): boolean;
    /**
     * Call this function to reduce memory footprint of the scene.
     * Vertex buffers will not store CPU data anymore (this will prevent picking, collisions or physics to work correctly)
     */
    clearCachedVertexData(): void;
    /**
     * This function will remove the local cached buffer data from texture.
     * It will save memory but will prevent the texture from being rebuilt
     */
    cleanCachedTextureBuffer(): void;
    /**
     * Get the world extend vectors with an optional filter
     *
     * @param filterPredicate the predicate - which meshes should be included when calculating the world size
     * @returns {{ min: Vector3; max: Vector3 }} min and max vectors
     */
    getWorldExtends(filterPredicate?: (mesh: AbstractMesh) => boolean): {
        min: Vector3;
        max: Vector3;
    };
    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param world defines the world matrix to use if you want to pick in object space (instead of world space)
     * @param camera defines the camera to use for the picking
     * @param cameraViewSpace defines if picking will be done in view space (false by default)
     * @returns a Ray
     */
    createPickingRay(x: number, y: number, world: Nullable<Matrix>, camera: Nullable<Camera>, cameraViewSpace?: boolean): Ray;
    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param world defines the world matrix to use if you want to pick in object space (instead of world space)
     * @param result defines the ray where to store the picking ray
     * @param camera defines the camera to use for the picking
     * @param cameraViewSpace defines if picking will be done in view space (false by default)
     * @param enableDistantPicking defines if picking should handle large values for mesh position/scaling (false by default)
     * @returns the current scene
     */
    createPickingRayToRef(x: number, y: number, world: Nullable<Matrix>, result: Ray, camera: Nullable<Camera>, cameraViewSpace?: boolean, enableDistantPicking?: boolean): Scene;
    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param camera defines the camera to use for the picking
     * @returns a Ray
     */
    createPickingRayInCameraSpace(x: number, y: number, camera?: Camera): Ray;
    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param result defines the ray where to store the picking ray
     * @param camera defines the camera to use for the picking
     * @returns the current scene
     */
    createPickingRayInCameraSpaceToRef(x: number, y: number, result: Ray, camera?: Camera): Scene;
    /** @internal */
    get _pickingAvailable(): boolean;
    /** @internal */
    _registeredActions: number;
    /** Launch a ray to try to pick a mesh in the scene
     * @param x position on screen
     * @param y position on screen
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns a PickingInfo
     */
    pick(x: number, y: number, predicate?: (mesh: AbstractMesh) => boolean, fastCheck?: boolean, camera?: Nullable<Camera>, trianglePredicate?: TrianglePickingPredicate): PickingInfo;
    /** Launch a ray to try to pick a mesh in the scene using only bounding information of the main mesh (not using submeshes)
     * @param x position on screen
     * @param y position on screen
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
     * @returns a PickingInfo (Please note that some info will not be set like distance, bv, bu and everything that cannot be capture by only using bounding infos)
     */
    pickWithBoundingInfo(x: number, y: number, predicate?: (mesh: AbstractMesh) => boolean, fastCheck?: boolean, camera?: Nullable<Camera>): Nullable<PickingInfo>;
    /**
     * Use the given ray to pick a mesh in the scene. A mesh triangle can be picked both from its front and back sides,
     * irrespective of orientation.
     * @param ray The ray to use to pick meshes
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must have isPickable set to true
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns a PickingInfo
     */
    pickWithRay(ray: Ray, predicate?: (mesh: AbstractMesh) => boolean, fastCheck?: boolean, trianglePredicate?: TrianglePickingPredicate): Nullable<PickingInfo>;
    /**
     * Launch a ray to try to pick a mesh in the scene. A mesh triangle can be picked both from its front and back sides,
     * irrespective of orientation.
     * @param x X position on screen
     * @param y Y position on screen
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param camera camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns an array of PickingInfo
     */
    multiPick(x: number, y: number, predicate?: (mesh: AbstractMesh) => boolean, camera?: Camera, trianglePredicate?: TrianglePickingPredicate): Nullable<PickingInfo[]>;
    /**
     * Launch a ray to try to pick a mesh in the scene
     * @param ray Ray to use
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns an array of PickingInfo
     */
    multiPickWithRay(ray: Ray, predicate?: (mesh: AbstractMesh) => boolean, trianglePredicate?: TrianglePickingPredicate): Nullable<PickingInfo[]>;
    /**
     * Force the value of meshUnderPointer
     * @param mesh defines the mesh to use
     * @param pointerId optional pointer id when using more than one pointer
     * @param pickResult optional pickingInfo data used to find mesh
     */
    setPointerOverMesh(mesh: Nullable<AbstractMesh>, pointerId?: number, pickResult?: Nullable<PickingInfo>): void;
    /**
     * Gets the mesh under the pointer
     * @returns a Mesh or null if no mesh is under the pointer
     */
    getPointerOverMesh(): Nullable<AbstractMesh>;
    /** @internal */
    _rebuildGeometries(): void;
    /** @internal */
    _rebuildTextures(): void;
    /**
     * Get from a list of objects by tags
     * @param list the list of objects to use
     * @param tagsQuery the query to use
     * @param filter a predicate to filter for tags
     * @returns
     */
    private _getByTags;
    /**
     * Get a list of meshes by tags
     * @param tagsQuery defines the tags query to use
     * @param filter defines a predicate used to filter results
     * @returns an array of Mesh
     */
    getMeshesByTags(tagsQuery: string, filter?: (mesh: AbstractMesh) => boolean): AbstractMesh[];
    /**
     * Get a list of cameras by tags
     * @param tagsQuery defines the tags query to use
     * @param filter defines a predicate used to filter results
     * @returns an array of Camera
     */
    getCamerasByTags(tagsQuery: string, filter?: (camera: Camera) => boolean): Camera[];
    /**
     * Get a list of lights by tags
     * @param tagsQuery defines the tags query to use
     * @param filter defines a predicate used to filter results
     * @returns an array of Light
     */
    getLightsByTags(tagsQuery: string, filter?: (light: Light) => boolean): Light[];
    /**
     * Get a list of materials by tags
     * @param tagsQuery defines the tags query to use
     * @param filter defines a predicate used to filter results
     * @returns an array of Material
     */
    getMaterialByTags(tagsQuery: string, filter?: (material: Material) => boolean): Material[];
    /**
     * Get a list of transform nodes by tags
     * @param tagsQuery defines the tags query to use
     * @param filter defines a predicate used to filter results
     * @returns an array of TransformNode
     */
    getTransformNodesByTags(tagsQuery: string, filter?: (transform: TransformNode) => boolean): TransformNode[];
    /**
     * Overrides the default sort function applied in the rendering group to prepare the meshes.
     * This allowed control for front to back rendering or reversly depending of the special needs.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param opaqueSortCompareFn The opaque queue comparison function use to sort.
     * @param alphaTestSortCompareFn The alpha test queue comparison function use to sort.
     * @param transparentSortCompareFn The transparent queue comparison function use to sort.
     */
    setRenderingOrder(renderingGroupId: number, opaqueSortCompareFn?: Nullable<(a: SubMesh, b: SubMesh) => number>, alphaTestSortCompareFn?: Nullable<(a: SubMesh, b: SubMesh) => number>, transparentSortCompareFn?: Nullable<(a: SubMesh, b: SubMesh) => number>): void;
    /**
     * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
     * @param depth Automatically clears depth between groups if true and autoClear is true.
     * @param stencil Automatically clears stencil between groups if true and autoClear is true.
     */
    setRenderingAutoClearDepthStencil(renderingGroupId: number, autoClearDepthStencil: boolean, depth?: boolean, stencil?: boolean): void;
    /**
     * Gets the current auto clear configuration for one rendering group of the rendering
     * manager.
     * @param index the rendering group index to get the information for
     * @returns The auto clear setup for the requested rendering group
     */
    getAutoClearDepthStencilSetup(index: number): IRenderingManagerAutoClearSetup;
    private _blockMaterialDirtyMechanism;
    /** @internal */
    _forceBlockMaterialDirtyMechanism(value: boolean): void;
    /** Gets or sets a boolean blocking all the calls to markAllMaterialsAsDirty (ie. the materials won't be updated if they are out of sync) */
    get blockMaterialDirtyMechanism(): boolean;
    set blockMaterialDirtyMechanism(value: boolean);
    /**
     * Will flag all materials as dirty to trigger new shader compilation
     * @param flag defines the flag used to specify which material part must be marked as dirty
     * @param predicate If not null, it will be used to specify if a material has to be marked as dirty
     */
    markAllMaterialsAsDirty(flag: number, predicate?: (mat: Material) => boolean): void;
    /**
     * @internal
     */
    _loadFile(fileOrUrl: File | string, onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void, onProgress?: (ev: ProgressEvent) => void, useOfflineSupport?: boolean, useArrayBuffer?: boolean, onError?: (request?: WebRequest, exception?: LoadFileError) => void, onOpened?: (request: WebRequest) => void): IFileRequest;
    _loadFileAsync(fileOrUrl: File | string, onProgress?: (data: any) => void, useOfflineSupport?: boolean, useArrayBuffer?: false, onOpened?: (request: WebRequest) => void): Promise<string>;
    _loadFileAsync(fileOrUrl: File | string, onProgress?: (data: any) => void, useOfflineSupport?: boolean, useArrayBuffer?: true, onOpened?: (request: WebRequest) => void): Promise<ArrayBuffer>;
    /**
     * @internal
     */
    _requestFile(url: string, onSuccess: (data: string | ArrayBuffer, request?: WebRequest) => void, onProgress?: (ev: ProgressEvent) => void, useOfflineSupport?: boolean, useArrayBuffer?: boolean, onError?: (error: RequestFileError) => void, onOpened?: (request: WebRequest) => void): IFileRequest;
    /**
     * @internal
     */
    _requestFileAsync(url: string, onProgress?: (ev: ProgressEvent) => void, useOfflineSupport?: boolean, useArrayBuffer?: boolean, onOpened?: (request: WebRequest) => void): Promise<string | ArrayBuffer>;
    /**
     * @internal
     */
    _readFile(file: File, onSuccess: (data: string | ArrayBuffer) => void, onProgress?: (ev: ProgressEvent) => any, useArrayBuffer?: boolean, onError?: (error: ReadFileError) => void): IFileRequest;
    /**
     * @internal
     */
    _readFileAsync(file: File, onProgress?: (ev: ProgressEvent) => any, useArrayBuffer?: boolean): Promise<string | ArrayBuffer>;
    /**
     * Internal perfCollector instance used for sharing between inspector and playground.
     * Marked as protected to allow sharing between prototype extensions, but disallow access at toplevel.
     */
    protected _perfCollector: Nullable<PerformanceViewerCollector>;
    /**
     * This method gets the performance collector belonging to the scene, which is generally shared with the inspector.
     * @returns the perf collector belonging to the scene.
     */
    getPerfCollector(): PerformanceViewerCollector;
    /**
     * Sets the active camera of the scene using its Id
     * @param id defines the camera's Id
     * @returns the new active camera or null if none found.
     * @deprecated Please use setActiveCameraById instead
     */
    setActiveCameraByID(id: string): Nullable<Camera>;
    /**
     * Get a material using its id
     * @param id defines the material's Id
     * @returns the material or null if none found.
     * @deprecated Please use getMaterialById instead
     */
    getMaterialByID(id: string): Nullable<Material>;
    /**
     * Gets a the last added material using a given id
     * @param id defines the material's Id
     * @returns the last material with the given id or null if none found.
     * @deprecated Please use getLastMaterialById instead
     */
    getLastMaterialByID(id: string): Nullable<Material>;
    /**
     * Get a texture using its unique id
     * @param uniqueId defines the texture's unique id
     * @returns the texture or null if none found.
     * @deprecated Please use getTextureByUniqueId instead
     */
    getTextureByUniqueID(uniqueId: number): Nullable<BaseTexture>;
    /**
     * Gets a camera using its Id
     * @param id defines the Id to look for
     * @returns the camera or null if not found
     * @deprecated Please use getCameraById instead
     */
    getCameraByID(id: string): Nullable<Camera>;
    /**
     * Gets a camera using its unique Id
     * @param uniqueId defines the unique Id to look for
     * @returns the camera or null if not found
     * @deprecated Please use getCameraByUniqueId instead
     */
    getCameraByUniqueID(uniqueId: number): Nullable<Camera>;
    /**
     * Gets a bone using its Id
     * @param id defines the bone's Id
     * @returns the bone or null if not found
     * @deprecated Please use getBoneById instead
     */
    getBoneByID(id: string): Nullable<Bone>;
    /**
     * Gets a light node using its Id
     * @param id defines the light's Id
     * @returns the light or null if none found.
     * @deprecated Please use getLightById instead
     */
    getLightByID(id: string): Nullable<Light>;
    /**
     * Gets a light node using its scene-generated unique Id
     * @param uniqueId defines the light's unique Id
     * @returns the light or null if none found.
     * @deprecated Please use getLightByUniqueId instead
     */
    getLightByUniqueID(uniqueId: number): Nullable<Light>;
    /**
     * Gets a particle system by Id
     * @param id defines the particle system Id
     * @returns the corresponding system or null if none found
     * @deprecated Please use getParticleSystemById instead
     */
    getParticleSystemByID(id: string): Nullable<IParticleSystem>;
    /**
     * Gets a geometry using its Id
     * @param id defines the geometry's Id
     * @returns the geometry or null if none found.
     * @deprecated Please use getGeometryById instead
     */
    getGeometryByID(id: string): Nullable<Geometry>;
    /**
     * Gets the first added mesh found of a given Id
     * @param id defines the Id to search for
     * @returns the mesh found or null if not found at all
     * @deprecated Please use getMeshById instead
     */
    getMeshByID(id: string): Nullable<AbstractMesh>;
    /**
     * Gets a mesh with its auto-generated unique Id
     * @param uniqueId defines the unique Id to search for
     * @returns the found mesh or null if not found at all.
     * @deprecated Please use getMeshByUniqueId instead
     */
    getMeshByUniqueID(uniqueId: number): Nullable<AbstractMesh>;
    /**
     * Gets a the last added mesh using a given Id
     * @param id defines the Id to search for
     * @returns the found mesh or null if not found at all.
     * @deprecated Please use getLastMeshById instead
     */
    getLastMeshByID(id: string): Nullable<AbstractMesh>;
    /**
     * Gets a list of meshes using their Id
     * @param id defines the Id to search for
     * @returns a list of meshes
     * @deprecated Please use getMeshesById instead
     */
    getMeshesByID(id: string): Array<AbstractMesh>;
    /**
     * Gets the first added transform node found of a given Id
     * @param id defines the Id to search for
     * @returns the found transform node or null if not found at all.
     * @deprecated Please use getTransformNodeById instead
     */
    getTransformNodeByID(id: string): Nullable<TransformNode>;
    /**
     * Gets a transform node with its auto-generated unique Id
     * @param uniqueId defines the unique Id to search for
     * @returns the found transform node or null if not found at all.
     * @deprecated Please use getTransformNodeByUniqueId instead
     */
    getTransformNodeByUniqueID(uniqueId: number): Nullable<TransformNode>;
    /**
     * Gets a list of transform nodes using their Id
     * @param id defines the Id to search for
     * @returns a list of transform nodes
     * @deprecated Please use getTransformNodesById instead
     */
    getTransformNodesByID(id: string): Array<TransformNode>;
    /**
     * Gets a node (Mesh, Camera, Light) using a given Id
     * @param id defines the Id to search for
     * @returns the found node or null if not found at all
     * @deprecated Please use getNodeById instead
     */
    getNodeByID(id: string): Nullable<Node>;
    /**
     * Gets a the last added node (Mesh, Camera, Light) using a given Id
     * @param id defines the Id to search for
     * @returns the found node or null if not found at all
     * @deprecated Please use getLastEntryById instead
     */
    getLastEntryByID(id: string): Nullable<Node>;
    /**
     * Gets a skeleton using a given Id (if many are found, this function will pick the last one)
     * @param id defines the Id to search for
     * @returns the found skeleton or null if not found at all.
     * @deprecated Please use getLastSkeletonById instead
     */
    getLastSkeletonByID(id: string): Nullable<Skeleton>;
}
