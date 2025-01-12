import type { Observer } from "../Misc/observable";
import { Observable } from "../Misc/observable";
import type { Nullable } from "../types";
import type { PointerInfo } from "../Events/pointerEvents";
import type { Scene } from "../scene";
import { Vector3 } from "../Maths/math.vector";
import { AbstractMesh } from "../Meshes/abstractMesh";
import type { Mesh } from "../Meshes/mesh";
import { PointerDragBehavior } from "../Behaviors/Meshes/pointerDragBehavior";
import type { IGizmo } from "./gizmo";
import { Gizmo } from "./gizmo";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer";
import { StandardMaterial } from "../Materials/standardMaterial";
import { Color3 } from "../Maths/math.color";
/**
 * Interface for bounding box gizmo
 */
export interface IBoundingBoxGizmo extends IGizmo {
    /**
     * If child meshes should be ignored when calculating the bounding box. This should be set to true to avoid perf hits with heavily nested meshes.
     */
    ignoreChildren: boolean;
    /**
     * Returns true if a descendant should be included when computing the bounding box. When null, all descendants are included. If ignoreChildren is set this will be ignored.
     */
    includeChildPredicate: Nullable<(abstractMesh: AbstractMesh) => boolean>;
    /** The size of the rotation spheres attached to the bounding box */
    rotationSphereSize: number;
    /** The size of the scale boxes attached to the bounding box */
    scaleBoxSize: number;
    /**
     * If set, the rotation spheres and scale boxes will increase in size based on the distance away from the camera to have a consistent screen size
     * Note : fixedDragMeshScreenSize takes precedence over fixedDragMeshBoundsSize if both are true
     */
    fixedDragMeshScreenSize: boolean;
    /**
     * If set, the rotation spheres and scale boxes will increase in size based on the size of the bounding box
     * Note : fixedDragMeshScreenSize takes precedence over fixedDragMeshBoundsSize if both are true
     */
    fixedDragMeshBoundsSize: boolean;
    /**
     * The distance away from the object which the draggable meshes should appear world sized when fixedDragMeshScreenSize is set to true
     */
    fixedDragMeshScreenSizeDistanceFactor: number;
    /** True when a rotation sphere or scale box or a attached mesh is dragged */
    readonly isDragging: boolean;
    /** Fired when a rotation sphere or scale box is dragged */
    onDragStartObservable: Observable<{}>;
    /** Fired when a scale box is dragged */
    onScaleBoxDragObservable: Observable<{}>;
    /** Fired when a scale box drag is ended */
    onScaleBoxDragEndObservable: Observable<{}>;
    /** Fired when a rotation sphere is dragged */
    onRotationSphereDragObservable: Observable<{}>;
    /** Fired when a rotation sphere drag is ended */
    onRotationSphereDragEndObservable: Observable<{}>;
    /** Relative bounding box pivot used when scaling the attached node. */
    scalePivot: Nullable<Vector3>;
    /** Scale factor vector used for masking some axis */
    axisFactor: Vector3;
    /** Scale factor scalar affecting all axes' drag speed */
    scaleDragSpeed: number;
    /**
     * Sets the color of the bounding box gizmo
     * @param color the color to set
     */
    setColor(color: Color3): void;
    /** Returns an array containing all boxes used for scaling (in increasing x, y and z orders) */
    getScaleBoxes(): AbstractMesh[];
    /** Updates the bounding box information for the Gizmo */
    updateBoundingBox(): void;
    /**
     * Enables rotation on the specified axis and disables rotation on the others
     * @param axis The list of axis that should be enabled (eg. "xy" or "xyz")
     */
    setEnabledRotationAxis(axis: string): void;
    /**
     * Enables/disables scaling
     * @param enable if scaling should be enabled
     * @param homogeneousScaling defines if scaling should only be homogeneous
     */
    setEnabledScaling(enable: boolean, homogeneousScaling?: boolean): void;
    /** Enables a pointer drag behavior on the bounding box of the gizmo */
    enableDragBehavior(): void;
    /**
     * Force release the drag action by code
     */
    releaseDrag(): void;
    /** Default material used to render when gizmo is not disabled or hovered */
    coloredMaterial: StandardMaterial;
    /** Material used to render when gizmo is hovered with mouse*/
    hoverMaterial: StandardMaterial;
    /** Drag distance in babylon units that the gizmo will snap scaling to when dragged */
    scalingSnapDistance: number;
    /** Drag distance in babylon units that the gizmo will snap rotation to when dragged */
    rotationSnapDistance: number;
}
/**
 * Bounding box gizmo
 */
export declare class BoundingBoxGizmo extends Gizmo implements IBoundingBoxGizmo {
    protected _lineBoundingBox: AbstractMesh;
    protected _rotateSpheresParent: AbstractMesh;
    protected _scaleBoxesParent: AbstractMesh;
    protected _boundingDimensions: Vector3;
    protected _renderObserver: Nullable<Observer<Scene>>;
    protected _pointerObserver: Nullable<Observer<PointerInfo>>;
    protected _scaleDragSpeed: number;
    protected _rotateSpheresDragBehaviors: Array<PointerDragBehavior>;
    protected _scaleBoxesDragBehaviors: Array<PointerDragBehavior>;
    /**
     * boolean updated when a rotation sphere or scale box is dragged
     */
    protected _dragging: boolean;
    private _tmpQuaternion;
    private _tmpVector;
    private _tmpRotationMatrix;
    private _incrementalStartupValue;
    private _incrementalAnchorStartupValue;
    /**
     * If child meshes should be ignored when calculating the bounding box. This should be set to true to avoid perf hits with heavily nested meshes (Default: false)
     */
    ignoreChildren: boolean;
    /**
     * Returns true if a descendant should be included when computing the bounding box. When null, all descendants are included. If ignoreChildren is set this will be ignored. (Default: null)
     */
    includeChildPredicate: Nullable<(abstractMesh: AbstractMesh) => boolean>;
    /**
     * The size of the rotation spheres attached to the bounding box (Default: 0.1)
     */
    rotationSphereSize: number;
    /**
     * The size of the scale boxes attached to the bounding box (Default: 0.1)
     */
    scaleBoxSize: number;
    /**
     * If set, the rotation spheres and scale boxes will increase in size based on the distance away from the camera to have a consistent screen size (Default: false)
     * Note : fixedDragMeshScreenSize takes precedence over fixedDragMeshBoundsSize if both are true
     */
    fixedDragMeshScreenSize: boolean;
    /**
     * If set, the rotation spheres and scale boxes will increase in size based on the size of the bounding box
     * Note : fixedDragMeshScreenSize takes precedence over fixedDragMeshBoundsSize if both are true
     */
    fixedDragMeshBoundsSize: boolean;
    /**
     * The distance away from the object which the draggable meshes should appear world sized when fixedDragMeshScreenSize is set to true (default: 10)
     */
    fixedDragMeshScreenSizeDistanceFactor: number;
    /**
     * Drag distance in babylon units that the gizmo will snap scaling to when dragged
     */
    scalingSnapDistance: number;
    /**
     * Drag distance in babylon units that the gizmo will snap rotation to when dragged
     */
    rotationSnapDistance: number;
    /**
     * Fired when a rotation sphere or scale box is dragged
     */
    onDragStartObservable: Observable<{}>;
    /**
     * Fired when a scale box is dragged
     */
    onScaleBoxDragObservable: Observable<{}>;
    /**
     * Fired when a scale box drag is ended
     */
    onScaleBoxDragEndObservable: Observable<{}>;
    /**
     * Fired when a rotation sphere is dragged
     */
    onRotationSphereDragObservable: Observable<{}>;
    /**
     * Fired when a rotation sphere drag is ended
     */
    onRotationSphereDragEndObservable: Observable<{}>;
    /**
     * Relative bounding box pivot used when scaling the attached node. When null object with scale from the opposite corner. 0.5,0.5,0.5 for center and 0.5,0,0.5 for bottom (Default: null)
     */
    scalePivot: Nullable<Vector3>;
    /**
     * Scale factor used for masking some axis
     */
    protected _axisFactor: Vector3;
    /**
     * Incremental snap scaling (default is false). When true, with a snapDistance of 0.1, scaling will be 1.1,1.2,1.3 instead of, when false: 1.1,1.21,1.33,...
     */
    incrementalSnap: boolean;
    /**
     * Sets the axis factor
     * @param factor the Vector3 value
     */
    set axisFactor(factor: Vector3);
    /**
     * Gets the axis factor
     * @returns the Vector3 factor value
     */
    get axisFactor(): Vector3;
    /**
     * Sets scale drag speed value
     * @param value the new speed value
     */
    set scaleDragSpeed(value: number);
    /**
     * Gets scale drag speed
     * @returns the scale speed number
     */
    get scaleDragSpeed(): number;
    /**
     * Mesh used as a pivot to rotate the attached node
     */
    protected _anchorMesh: AbstractMesh;
    protected _existingMeshScale: Vector3;
    protected _dragMesh: Nullable<Mesh>;
    protected _pointerDragBehavior: PointerDragBehavior;
    protected _coloredMaterial: StandardMaterial;
    protected _hoverColoredMaterial: StandardMaterial;
    /** Default material used to render when gizmo is not disabled or hovered */
    get coloredMaterial(): StandardMaterial;
    /** Material used to render when gizmo is hovered with mouse*/
    get hoverMaterial(): StandardMaterial;
    /**
     * Get the pointerDragBehavior
     */
    get pointerDragBehavior(): PointerDragBehavior;
    /** True when a rotation sphere or scale box or a attached mesh is dragged */
    get isDragging(): boolean;
    /**
     * Sets the color of the bounding box gizmo
     * @param color the color to set
     */
    setColor(color: Color3): void;
    /**
     * Creates an BoundingBoxGizmo
     * @param color The color of the gizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     */
    constructor(color?: Color3, gizmoLayer?: UtilityLayerRenderer);
    protected _attachedNodeChanged(value: Nullable<AbstractMesh>): void;
    protected _selectNode(selectedMesh: Nullable<Mesh>): void;
    protected _unhoverMeshOnTouchUp(pointerInfo: Nullable<PointerInfo>, selectedMesh: AbstractMesh): void;
    /**
     * returns an array containing all boxes used for scaling (in increasing x, y and z orders)
     * @returns array of scaling boxes
     */
    getScaleBoxes(): AbstractMesh[];
    /**
     * Updates the bounding box information for the Gizmo
     */
    updateBoundingBox(): void;
    protected _updateRotationSpheres(): void;
    protected _updateScaleBoxes(): void;
    /**
     * Enables rotation on the specified axis and disables rotation on the others
     * @param axis The list of axis that should be enabled (eg. "xy" or "xyz")
     */
    setEnabledRotationAxis(axis: string): void;
    /**
     * Enables/disables scaling
     * @param enable if scaling should be enabled
     * @param homogeneousScaling defines if scaling should only be homogeneous
     */
    setEnabledScaling(enable: boolean, homogeneousScaling?: boolean): void;
    protected _updateDummy(): void;
    /**
     * Enables a pointer drag behavior on the bounding box of the gizmo
     */
    enableDragBehavior(): void;
    /**
     * Force release the drag action by code
     */
    releaseDrag(): void;
    /**
     * Disposes of the gizmo
     */
    dispose(): void;
    /**
     * Makes a mesh not pickable and wraps the mesh inside of a bounding box mesh that is pickable. (This is useful to avoid picking within complex geometry)
     * @param mesh the mesh to wrap in the bounding box mesh and make not pickable
     * @returns the bounding box mesh with the passed in mesh as a child
     */
    static MakeNotPickableAndWrapInBoundingBox(mesh: Mesh): Mesh;
    /**
     * CustomMeshes are not supported by this gizmo
     */
    setCustomMesh(): void;
}
