import type { Observer } from "../Misc/observable";
import { Observable } from "../Misc/observable";
import type { Nullable } from "../types";
import type { Quaternion } from "../Maths/math.vector";
import type { AbstractMesh } from "../Meshes/abstractMesh";
import type { Node } from "../node";
import type { Mesh } from "../Meshes/mesh";
import type { GizmoAnchorPoint, GizmoCoordinatesMode, GizmoAxisCache, IGizmo } from "./gizmo";
import { Gizmo } from "./gizmo";
import type { IAxisDragGizmo } from "./axisDragGizmo";
import type { IPlaneDragGizmo } from "./planeDragGizmo";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer";
import type { PointerInfo } from "../Events/pointerEvents";
import type { GizmoManager } from "./gizmoManager";
import type { TransformNode } from "../Meshes/transformNode";
/**
 * Interface for position gizmo
 */
export interface IPositionGizmo extends IGizmo {
    /** Internal gizmo used for interactions on the x axis */
    xGizmo: IAxisDragGizmo;
    /** Internal gizmo used for interactions on the y axis */
    yGizmo: IAxisDragGizmo;
    /** Internal gizmo used for interactions on the z axis */
    zGizmo: IAxisDragGizmo;
    /** Internal gizmo used for interactions on the yz plane */
    xPlaneGizmo: IPlaneDragGizmo;
    /** Internal gizmo used for interactions on the xz plane */
    yPlaneGizmo: IPlaneDragGizmo;
    /** Internal gizmo used for interactions on the xy plane */
    zPlaneGizmo: IPlaneDragGizmo;
    /** True when the mouse pointer is dragging a gizmo mesh */
    readonly isDragging: boolean;
    /** Fires an event when any of it's sub gizmos are dragged */
    onDragStartObservable: Observable<unknown>;
    /** Fires an event when any of it's sub gizmos are being dragged */
    onDragObservable: Observable<unknown>;
    /** Fires an event when any of it's sub gizmos are released from dragging */
    onDragEndObservable: Observable<unknown>;
    /**
     * If the planar drag gizmo is enabled
     * setting this will enable/disable XY, XZ and YZ planes regardless of individual gizmo settings.
     */
    planarGizmoEnabled: boolean;
    /** Drag distance in babylon units that the gizmo will snap to when dragged */
    snapDistance: number;
    /**
     * Builds Gizmo Axis Cache to enable features such as hover state preservation and graying out other axis during manipulation
     * @param mesh Axis gizmo mesh
     * @param cache Gizmo axis definition used for reactive gizmo UI
     */
    addToAxisCache(mesh: Mesh, cache: GizmoAxisCache): void;
    /**
     * Force release the drag action by code
     */
    releaseDrag(): void;
}
/**
 * Additional options for the position gizmo
 */
export interface PositionGizmoOptions {
    /**
     * Additional transform applied to the gizmo.
     * @See Gizmo.additionalTransformNode for more detail
     */
    additionalTransformNode?: TransformNode;
}
/**
 * Gizmo that enables dragging a mesh along 3 axis
 */
export declare class PositionGizmo extends Gizmo implements IPositionGizmo {
    /**
     * Internal gizmo used for interactions on the x axis
     */
    xGizmo: IAxisDragGizmo;
    /**
     * Internal gizmo used for interactions on the y axis
     */
    yGizmo: IAxisDragGizmo;
    /**
     * Internal gizmo used for interactions on the z axis
     */
    zGizmo: IAxisDragGizmo;
    /**
     * Internal gizmo used for interactions on the yz plane
     */
    xPlaneGizmo: IPlaneDragGizmo;
    /**
     * Internal gizmo used for interactions on the xz plane
     */
    yPlaneGizmo: IPlaneDragGizmo;
    /**
     * Internal gizmo used for interactions on the xy plane
     */
    zPlaneGizmo: IPlaneDragGizmo;
    /**
     * protected variables
     */
    protected _meshAttached: Nullable<AbstractMesh>;
    protected _nodeAttached: Nullable<Node>;
    protected _snapDistance: number;
    protected _observables: Observer<PointerInfo>[];
    /** Node Caching for quick lookup */
    protected _gizmoAxisCache: Map<Mesh, GizmoAxisCache>;
    /** Fires an event when any of it's sub gizmos are dragged */
    onDragStartObservable: Observable<unknown>;
    /** Fires an event when any of it's sub gizmos are being dragged */
    onDragObservable: Observable<unknown>;
    /** Fires an event when any of it's sub gizmos are released from dragging */
    onDragEndObservable: Observable<unknown>;
    /**
     * If set to true, planar drag is enabled
     */
    protected _planarGizmoEnabled: boolean;
    get attachedMesh(): Nullable<AbstractMesh>;
    set attachedMesh(mesh: Nullable<AbstractMesh>);
    get attachedNode(): Nullable<Node>;
    set attachedNode(node: Nullable<Node>);
    /**
     * True when the mouse pointer is hovering a gizmo mesh
     */
    get isHovered(): boolean;
    get isDragging(): boolean;
    get additionalTransformNode(): TransformNode | undefined;
    set additionalTransformNode(transformNode: TransformNode | undefined);
    /**
     * Creates a PositionGizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     * @param thickness display gizmo axis thickness
     * @param gizmoManager
     * @param options More options
     */
    constructor(gizmoLayer?: UtilityLayerRenderer, thickness?: number, gizmoManager?: GizmoManager, options?: PositionGizmoOptions);
    /**
     * If the planar drag gizmo is enabled
     * setting this will enable/disable XY, XZ and YZ planes regardless of individual gizmo settings.
     */
    set planarGizmoEnabled(value: boolean);
    get planarGizmoEnabled(): boolean;
    /**
     * posture that the gizmo will be display
     * When set null, default value will be used (Quaternion(0, 0, 0, 1))
     */
    get customRotationQuaternion(): Nullable<Quaternion>;
    set customRotationQuaternion(customRotationQuaternion: Nullable<Quaternion>);
    /**
     * If set the gizmo's rotation will be updated to match the attached mesh each frame (Default: true)
     * NOTE: This is only possible for meshes with uniform scaling, as otherwise it's not possible to decompose the rotation
     */
    set updateGizmoRotationToMatchAttachedMesh(value: boolean);
    get updateGizmoRotationToMatchAttachedMesh(): boolean;
    set updateGizmoPositionToMatchAttachedMesh(value: boolean);
    get updateGizmoPositionToMatchAttachedMesh(): boolean;
    set anchorPoint(value: GizmoAnchorPoint);
    get anchorPoint(): GizmoAnchorPoint;
    /**
     * Set the coordinate system to use. By default it's local.
     * But it's possible for a user to tweak so its local for translation and world for rotation.
     * In that case, setting the coordinate system will change `updateGizmoRotationToMatchAttachedMesh` and `updateGizmoPositionToMatchAttachedMesh`
     */
    set coordinatesMode(coordinatesMode: GizmoCoordinatesMode);
    set updateScale(value: boolean);
    get updateScale(): boolean;
    /**
     * Drag distance in babylon units that the gizmo will snap to when dragged (Default: 0)
     */
    set snapDistance(value: number);
    get snapDistance(): number;
    /**
     * Ratio for the scale of the gizmo (Default: 1)
     */
    set scaleRatio(value: number);
    get scaleRatio(): number;
    /**
     * Builds Gizmo Axis Cache to enable features such as hover state preservation and graying out other axis during manipulation
     * @param mesh Axis gizmo mesh
     * @param cache Gizmo axis definition used for reactive gizmo UI
     */
    addToAxisCache(mesh: Mesh, cache: GizmoAxisCache): void;
    /**
     * Force release the drag action by code
     */
    releaseDrag(): void;
    /**
     * Disposes of the gizmo
     */
    dispose(): void;
    /**
     * CustomMeshes are not supported by this gizmo
     */
    setCustomMesh(): void;
}
