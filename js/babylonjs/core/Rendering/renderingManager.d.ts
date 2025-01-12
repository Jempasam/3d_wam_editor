import type { Nullable } from "../types";
import type { SmartArray } from "../Misc/smartArray";
import type { ISpriteManager } from "../Sprites/spriteManager";
import type { IParticleSystem } from "../Particles/IParticleSystem";
import { RenderingGroup } from "./renderingGroup";
import type { Scene } from "../scene";
import type { Camera } from "../Cameras/camera";
import type { Material } from "../Materials/material";
import type { SubMesh } from "../Meshes/subMesh";
import type { AbstractMesh } from "../Meshes/abstractMesh";
/**
 * Interface describing the different options available in the rendering manager
 * regarding Auto Clear between groups.
 */
export interface IRenderingManagerAutoClearSetup {
    /**
     * Defines whether or not autoclear is enable.
     */
    autoClear: boolean;
    /**
     * Defines whether or not to autoclear the depth buffer.
     */
    depth: boolean;
    /**
     * Defines whether or not to autoclear the stencil buffer.
     */
    stencil: boolean;
}
/**
 * This class is used by the onRenderingGroupObservable
 */
export declare class RenderingGroupInfo {
    /**
     * The Scene that being rendered
     */
    scene: Scene;
    /**
     * The camera currently used for the rendering pass
     */
    camera: Nullable<Camera>;
    /**
     * The ID of the renderingGroup being processed
     */
    renderingGroupId: number;
}
/**
 * This is the manager responsible of all the rendering for meshes sprites and particles.
 * It is enable to manage the different groups as well as the different necessary sort functions.
 * This should not be used directly aside of the few static configurations
 */
export declare class RenderingManager {
    /**
     * The max id used for rendering groups (not included)
     */
    static MAX_RENDERINGGROUPS: number;
    /**
     * The min id used for rendering groups (included)
     */
    static MIN_RENDERINGGROUPS: number;
    /**
     * Used to globally prevent autoclearing scenes.
     */
    static AUTOCLEAR: boolean;
    /**
     * @internal
     */
    _useSceneAutoClearSetup: boolean;
    private _scene;
    private _renderingGroups;
    private _depthStencilBufferAlreadyCleaned;
    private _autoClearDepthStencil;
    private _customOpaqueSortCompareFn;
    private _customAlphaTestSortCompareFn;
    private _customTransparentSortCompareFn;
    private _renderingGroupInfo;
    private _maintainStateBetweenFrames;
    /**
     * Gets or sets a boolean indicating that the manager will not reset between frames.
     * This means that if a mesh becomes invisible or transparent it will not be visible until this boolean is set to false again.
     * By default, the rendering manager will dispatch all active meshes per frame (moving them to the transparent, opaque or alpha testing lists).
     * By turning this property on, you will accelerate the rendering by keeping all these lists unchanged between frames.
     */
    get maintainStateBetweenFrames(): boolean;
    set maintainStateBetweenFrames(value: boolean);
    /**
     * Restore wasDispatched flags on the lists of elements to render.
     */
    restoreDispachedFlags(): void;
    /**
     * Instantiates a new rendering group for a particular scene
     * @param scene Defines the scene the groups belongs to
     */
    constructor(scene: Scene);
    /**
     * @returns the rendering group with the specified id.
     * @param id the id of the rendering group (0 by default)
     */
    getRenderingGroup(id: number): RenderingGroup;
    private _clearDepthStencilBuffer;
    /**
     * Renders the entire managed groups. This is used by the scene or the different render targets.
     * @internal
     */
    render(customRenderFunction: Nullable<(opaqueSubMeshes: SmartArray<SubMesh>, transparentSubMeshes: SmartArray<SubMesh>, alphaTestSubMeshes: SmartArray<SubMesh>, depthOnlySubMeshes: SmartArray<SubMesh>) => void>, activeMeshes: Nullable<AbstractMesh[]>, renderParticles: boolean, renderSprites: boolean): void;
    /**
     * Resets the different information of the group to prepare a new frame
     * @internal
     */
    reset(): void;
    /**
     * Resets the sprites information of the group to prepare a new frame
     * @internal
     */
    resetSprites(): void;
    /**
     * Dispose and release the group and its associated resources.
     * @internal
     */
    dispose(): void;
    /**
     * Clear the info related to rendering groups preventing retention points during dispose.
     */
    freeRenderingGroups(): void;
    private _prepareRenderingGroup;
    /**
     * Add a sprite manager to the rendering manager in order to render it this frame.
     * @param spriteManager Define the sprite manager to render
     */
    dispatchSprites(spriteManager: ISpriteManager): void;
    /**
     * Add a particle system to the rendering manager in order to render it this frame.
     * @param particleSystem Define the particle system to render
     */
    dispatchParticles(particleSystem: IParticleSystem): void;
    /**
     * Add a submesh to the manager in order to render it this frame
     * @param subMesh The submesh to dispatch
     * @param mesh Optional reference to the submeshes's mesh. Provide if you have an exiting reference to improve performance.
     * @param material Optional reference to the submeshes's material. Provide if you have an exiting reference to improve performance.
     */
    dispatch(subMesh: SubMesh, mesh?: AbstractMesh, material?: Nullable<Material>): void;
    /**
     * Overrides the default sort function applied in the rendering group to prepare the meshes.
     * This allowed control for front to back rendering or reversely depending of the special needs.
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
}
