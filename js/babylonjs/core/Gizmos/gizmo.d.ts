import type { Observer } from "../Misc/observable";
import type { Nullable } from "../types";
import type { Scene, IDisposable } from "../scene";
import { Quaternion, Matrix } from "../Maths/math.vector";
import type { AbstractMesh } from "../Meshes/abstractMesh";
import { Mesh } from "../Meshes/mesh";
import type { Node } from "../node";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer";
import type { TransformNode } from "../Meshes/transformNode";
import type { StandardMaterial } from "../Materials/standardMaterial";
import type { PointerInfo } from "../Events/pointerEvents";
import type { PointerDragBehavior } from "../Behaviors/Meshes/pointerDragBehavior";
/**
 * Cache built by each axis. Used for managing state between all elements of gizmo for enhanced UI
 */
export interface GizmoAxisCache {
    /** Mesh used to render the Gizmo */
    gizmoMeshes: Mesh[];
    /** Mesh used to detect user interaction with Gizmo */
    colliderMeshes: Mesh[];
    /** Material used to indicate color of gizmo mesh */
    material: StandardMaterial;
    /** Material used to indicate hover state of the Gizmo */
    hoverMaterial: StandardMaterial;
    /** Material used to indicate disabled state of the Gizmo */
    disableMaterial: StandardMaterial;
    /** Used to indicate Active state of the Gizmo */
    active: boolean;
    /** DragBehavior */
    dragBehavior: PointerDragBehavior;
}
/**
 * Anchor options where the Gizmo can be positioned in relation to its anchored node
 */
export declare enum GizmoAnchorPoint {
    /** The origin of the attached node */
    Origin = 0,
    /** The pivot point of the attached node*/
    Pivot = 1
}
/**
 * Coordinates mode: Local or World. Defines how axis is aligned: either on world axis or transform local axis
 */
export declare enum GizmoCoordinatesMode {
    World = 0,
    Local = 1
}
/**
 * Interface for basic gizmo
 */
export interface IGizmo extends IDisposable {
    /** True when the mouse pointer is hovered a gizmo mesh */
    readonly isHovered: boolean;
    /** The root mesh of the gizmo */
    _rootMesh: Mesh;
    /** Ratio for the scale of the gizmo */
    scaleRatio: number;
    /**
     * Mesh that the gizmo will be attached to. (eg. on a drag gizmo the mesh that will be dragged)
     * * When set, interactions will be enabled
     */
    attachedMesh: Nullable<AbstractMesh>;
    /**
     * Node that the gizmo will be attached to. (eg. on a drag gizmo the mesh, bone or NodeTransform that will be dragged)
     * * When set, interactions will be enabled
     */
    attachedNode: Nullable<Node>;
    /**
     * If set the gizmo's rotation will be updated to match the attached mesh each frame (Default: true)
     */
    updateGizmoRotationToMatchAttachedMesh: boolean;
    /** The utility layer the gizmo will be added to */
    gizmoLayer: UtilityLayerRenderer;
    /**
     * If set the gizmo's position will be updated to match the attached mesh each frame (Default: true)
     */
    updateGizmoPositionToMatchAttachedMesh: boolean;
    /**
     * Defines where the gizmo will be positioned if `updateGizmoPositionToMatchAttachedMesh` is enabled.
     * (Default: GizmoAnchorPoint.Origin)
     */
    anchorPoint: GizmoAnchorPoint;
    /**
     * Set the coordinate mode to use. By default it's local.
     */
    coordinatesMode: GizmoCoordinatesMode;
    /**
     * When set, the gizmo will always appear the same size no matter where the camera is (default: true)
     */
    updateScale: boolean;
    /**
     * posture that the gizmo will be display
     * When set null, default value will be used (Quaternion(0, 0, 0, 1))
     */
    customRotationQuaternion: Nullable<Quaternion>;
    /**
     * Disposes and replaces the current meshes in the gizmo with the specified mesh
     * @param mesh The mesh to replace the default mesh of the gizmo
     */
    setCustomMesh(mesh: Mesh): void;
    /**
     * Additional transform applied to the gizmo.
     * It's useful when the gizmo is attached to a bone: if the bone is part of a skeleton attached to a mesh, you should define the mesh as additionalTransformNode if you want the gizmo to be displayed at the bone's correct location.
     * Otherwise, as the gizmo is relative to the skeleton root, the mesh transformation will not be taken into account.
     */
    additionalTransformNode?: TransformNode | undefined;
}
/**
 * Renders gizmos on top of an existing scene which provide controls for position, rotation, etc.
 */
export declare class Gizmo implements IGizmo {
    /** The utility layer the gizmo will be added to */
    gizmoLayer: UtilityLayerRenderer;
    /**
     * The root mesh of the gizmo
     */
    _rootMesh: Mesh;
    protected _attachedMesh: Nullable<AbstractMesh>;
    protected _attachedNode: Nullable<Node>;
    protected _customRotationQuaternion: Nullable<Quaternion>;
    protected _additionalTransformNode?: TransformNode;
    /**
     * Ratio for the scale of the gizmo (Default: 1)
     */
    protected _scaleRatio: number;
    /**
     * boolean updated by pointermove when a gizmo mesh is hovered
     */
    protected _isHovered: boolean;
    /**
     * When enabled, any gizmo operation will perserve scaling sign. Default is off.
     * Only valid for TransformNode derived classes (Mesh, AbstractMesh, ...)
     */
    static PreserveScaling: boolean;
    /**
     * There are 2 ways to preserve scaling: using mesh scaling or absolute scaling. Depending of hierarchy, non uniform scaling and LH or RH coordinates. One is preferable than the other.
     * If the scaling to be preserved is the local scaling, then set this value to false.
     * Default is true which means scaling to be preserved is absolute one (with hierarchy applied)
     */
    static UseAbsoluteScaling: boolean;
    /**
     * Ratio for the scale of the gizmo (Default: 1)
     */
    set scaleRatio(value: number);
    get scaleRatio(): number;
    /**
     * True when the mouse pointer is hovered a gizmo mesh
     */
    get isHovered(): boolean;
    /**
     * If a custom mesh has been set (Default: false)
     */
    protected _customMeshSet: boolean;
    /**
     * Mesh that the gizmo will be attached to. (eg. on a drag gizmo the mesh that will be dragged)
     * * When set, interactions will be enabled
     */
    get attachedMesh(): Nullable<AbstractMesh>;
    set attachedMesh(value: Nullable<AbstractMesh>);
    /**
     * Node that the gizmo will be attached to. (eg. on a drag gizmo the mesh, bone or NodeTransform that will be dragged)
     * * When set, interactions will be enabled
     */
    get attachedNode(): Nullable<Node>;
    set attachedNode(value: Nullable<Node>);
    /**
     * Disposes and replaces the current meshes in the gizmo with the specified mesh
     * @param mesh The mesh to replace the default mesh of the gizmo
     */
    setCustomMesh(mesh: Mesh): void;
    /**
     * Additional transform applied to the gizmo.
     * It's useful when the gizmo is attached to a bone: if the bone is part of a skeleton attached to a mesh, you should define the mesh as additionalTransformNode if you want the gizmo to be displayed at the bone's correct location.
     * Otherwise, as the gizmo is relative to the skeleton root, the mesh transformation will not be taken into account.
     */
    get additionalTransformNode(): TransformNode | undefined;
    set additionalTransformNode(value: TransformNode | undefined);
    protected _updateGizmoRotationToMatchAttachedMesh: boolean;
    protected _updateGizmoPositionToMatchAttachedMesh: boolean;
    protected _anchorPoint: GizmoAnchorPoint;
    protected _updateScale: boolean;
    protected _coordinatesMode: GizmoCoordinatesMode;
    /**
     * If set the gizmo's rotation will be updated to match the attached mesh each frame (Default: true)
     * NOTE: This is only possible for meshes with uniform scaling, as otherwise it's not possible to decompose the rotation
     */
    set updateGizmoRotationToMatchAttachedMesh(value: boolean);
    get updateGizmoRotationToMatchAttachedMesh(): boolean;
    /**
     * If set the gizmo's position will be updated to match the attached mesh each frame (Default: true)
     */
    set updateGizmoPositionToMatchAttachedMesh(value: boolean);
    get updateGizmoPositionToMatchAttachedMesh(): boolean;
    /**
     * Defines where the gizmo will be positioned if `updateGizmoPositionToMatchAttachedMesh` is enabled.
     * (Default: GizmoAnchorPoint.Origin)
     */
    set anchorPoint(value: GizmoAnchorPoint);
    get anchorPoint(): GizmoAnchorPoint;
    /**
     * Set the coordinate system to use. By default it's local.
     * But it's possible for a user to tweak so its local for translation and world for rotation.
     * In that case, setting the coordinate system will change `updateGizmoRotationToMatchAttachedMesh` and `updateGizmoPositionToMatchAttachedMesh`
     */
    set coordinatesMode(coordinatesMode: GizmoCoordinatesMode);
    get coordinatesMode(): GizmoCoordinatesMode;
    /**
     * When set, the gizmo will always appear the same size no matter where the camera is (default: true)
     */
    set updateScale(value: boolean);
    get updateScale(): boolean;
    protected _interactionsEnabled: boolean;
    protected _attachedNodeChanged(value: Nullable<Node>): void;
    protected _beforeRenderObserver: Nullable<Observer<Scene>>;
    private _rightHandtoLeftHandMatrix;
    /**
     * Creates a gizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     */
    constructor(
    /** The utility layer the gizmo will be added to */
    gizmoLayer?: UtilityLayerRenderer);
    /**
     * posture that the gizmo will be display
     * When set null, default value will be used (Quaternion(0, 0, 0, 1))
     */
    get customRotationQuaternion(): Nullable<Quaternion>;
    set customRotationQuaternion(customRotationQuaternion: Nullable<Quaternion>);
    /**
     * Updates the gizmo to match the attached mesh's position/rotation
     */
    protected _update(): void;
    /**
     * if transform has a pivot and is not using PostMultiplyPivotMatrix, then the worldMatrix contains the pivot matrix (it's not cancelled at the end)
     * so, when extracting the world matrix component, the translation (and other components) is containing the pivot translation.
     * And the pivot is applied each frame. Removing it anyway here makes it applied only in computeWorldMatrix.
     * @param transform local transform that needs to be transform by the pivot inverse matrix
     * @param localMatrix local matrix that needs to be transform by the pivot inverse matrix
     * @param result resulting matrix transformed by pivot inverse if the transform node is using pivot without using post Multiply Pivot Matrix
     */
    protected _handlePivotMatrixInverse(transform: TransformNode, localMatrix: Matrix, result: Matrix): void;
    /**
     * computes the rotation/scaling/position of the transform once the Node world matrix has changed.
     */
    protected _matrixChanged(): void;
    /**
     * refresh gizmo mesh material
     * @param gizmoMeshes
     * @param material material to apply
     */
    protected _setGizmoMeshMaterial(gizmoMeshes: Mesh[], material: StandardMaterial): void;
    /**
     * Subscribes to pointer up, down, and hover events. Used for responsive gizmos.
     * @param gizmoLayer The utility layer the gizmo will be added to
     * @param gizmoAxisCache Gizmo axis definition used for reactive gizmo UI
     * @returns {Observer<PointerInfo>} pointerObserver
     */
    static GizmoAxisPointerObserver(gizmoLayer: UtilityLayerRenderer, gizmoAxisCache: Map<Mesh, GizmoAxisCache>): Observer<PointerInfo>;
    /**
     * Disposes of the gizmo
     */
    dispose(): void;
}
