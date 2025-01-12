import { Matrix } from "../Maths/math.vector";
import type { SubMesh } from "../Meshes/subMesh";
import type { InternalTexture } from "../Materials/Textures/internalTexture";
import { MultiRenderTarget } from "../Materials/Textures/multiRenderTarget";
import type { PrePassRenderer } from "./prePassRenderer";
import type { Scene } from "../scene";
import type { AbstractMesh } from "../Meshes/abstractMesh";
import type { Nullable } from "../types";
import "../Shaders/geometry.fragment";
import "../Shaders/geometry.vertex";
/** @internal */
interface ISavedTransformationMatrix {
    world: Matrix;
    viewProjection: Matrix;
}
/**
 * This renderer is helpful to fill one of the render target with a geometry buffer.
 */
export declare class GeometryBufferRenderer {
    /**
     * Constant used to retrieve the depth texture index in the G-Buffer textures array
     * using getIndex(GeometryBufferRenderer.DEPTH_TEXTURE_INDEX)
     */
    static readonly DEPTH_TEXTURE_TYPE = 0;
    /**
     * Constant used to retrieve the normal texture index in the G-Buffer textures array
     * using getIndex(GeometryBufferRenderer.NORMAL_TEXTURE_INDEX)
     */
    static readonly NORMAL_TEXTURE_TYPE = 1;
    /**
     * Constant used to retrieve the position texture index in the G-Buffer textures array
     * using getIndex(GeometryBufferRenderer.POSITION_TEXTURE_INDEX)
     */
    static readonly POSITION_TEXTURE_TYPE = 2;
    /**
     * Constant used to retrieve the velocity texture index in the G-Buffer textures array
     * using getIndex(GeometryBufferRenderer.VELOCITY_TEXTURE_INDEX)
     */
    static readonly VELOCITY_TEXTURE_TYPE = 3;
    /**
     * Constant used to retrieve the reflectivity texture index in the G-Buffer textures array
     * using the getIndex(GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE)
     */
    static readonly REFLECTIVITY_TEXTURE_TYPE = 4;
    /**
     * Dictionary used to store the previous transformation matrices of each rendered mesh
     * in order to compute objects velocities when enableVelocity is set to "true"
     * @internal
     */
    _previousTransformationMatrices: {
        [index: number]: ISavedTransformationMatrix;
    };
    /**
     * Dictionary used to store the previous bones transformation matrices of each rendered mesh
     * in order to compute objects velocities when enableVelocity is set to "true"
     * @internal
     */
    _previousBonesTransformationMatrices: {
        [index: number]: Float32Array;
    };
    /**
     * Array used to store the ignored skinned meshes while computing velocity map (typically used by the motion blur post-process).
     * Avoids computing bones velocities and computes only mesh's velocity itself (position, rotation, scaling).
     */
    excludedSkinnedMeshesFromVelocity: AbstractMesh[];
    /** Gets or sets a boolean indicating if transparent meshes should be rendered */
    renderTransparentMeshes: boolean;
    /**
     * Gets or sets a boolean indicating if normals should be generated in world space (default: false, meaning normals are generated in view space)
     */
    generateNormalsInWorldSpace: boolean;
    private _normalsAreUnsigned;
    /**
     * Gets a boolean indicating if normals are encoded in the [0,1] range in the render target. If true, you should do `normal = normal_rt * 2.0 - 1.0` to get the right normal
     */
    get normalsAreUnsigned(): boolean;
    private _scene;
    private _resizeObserver;
    private _multiRenderTarget;
    private _textureTypesAndFormats;
    private _ratioOrDimensions;
    private _enablePosition;
    private _enableVelocity;
    private _enableReflectivity;
    private _depthFormat;
    private _clearColor;
    private _clearDepthColor;
    private _positionIndex;
    private _velocityIndex;
    private _reflectivityIndex;
    private _depthIndex;
    private _normalIndex;
    private _linkedWithPrePass;
    private _prePassRenderer;
    private _attachmentsFromPrePass;
    private _useUbo;
    protected _cachedDefines: string;
    /**
     * @internal
     * Sets up internal structures to share outputs with PrePassRenderer
     * This method should only be called by the PrePassRenderer itself
     */
    _linkPrePassRenderer(prePassRenderer: PrePassRenderer): void;
    /**
     * @internal
     * Separates internal structures from PrePassRenderer so the geometry buffer can now operate by itself.
     * This method should only be called by the PrePassRenderer itself
     */
    _unlinkPrePassRenderer(): void;
    /**
     * @internal
     * Resets the geometry buffer layout
     */
    _resetLayout(): void;
    /**
     * @internal
     * Replaces a texture in the geometry buffer renderer
     * Useful when linking textures of the prepass renderer
     */
    _forceTextureType(geometryBufferType: number, index: number): void;
    /**
     * @internal
     * Sets texture attachments
     * Useful when linking textures of the prepass renderer
     */
    _setAttachments(attachments: number[]): void;
    /**
     * @internal
     * Replaces the first texture which is hard coded as a depth texture in the geometry buffer
     * Useful when linking textures of the prepass renderer
     */
    _linkInternalTexture(internalTexture: InternalTexture): void;
    /**
     * Gets the render list (meshes to be rendered) used in the G buffer.
     */
    get renderList(): Nullable<AbstractMesh[]>;
    /**
     * Set the render list (meshes to be rendered) used in the G buffer.
     */
    set renderList(meshes: Nullable<AbstractMesh[]>);
    /**
     * Gets whether or not G buffer are supported by the running hardware.
     * This requires draw buffer supports
     */
    get isSupported(): boolean;
    /**
     * Returns the index of the given texture type in the G-Buffer textures array
     * @param textureType The texture type constant. For example GeometryBufferRenderer.POSITION_TEXTURE_INDEX
     * @returns the index of the given texture type in the G-Buffer textures array
     */
    getTextureIndex(textureType: number): number;
    /**
     * @returns a boolean indicating if objects positions are enabled for the G buffer.
     */
    get enablePosition(): boolean;
    /**
     * Sets whether or not objects positions are enabled for the G buffer.
     */
    set enablePosition(enable: boolean);
    /**
     * @returns a boolean indicating if objects velocities are enabled for the G buffer.
     */
    get enableVelocity(): boolean;
    /**
     * Sets whether or not objects velocities are enabled for the G buffer.
     */
    set enableVelocity(enable: boolean);
    /**
     * Gets a boolean indicating if objects reflectivity are enabled in the G buffer.
     */
    get enableReflectivity(): boolean;
    /**
     * Sets whether or not objects reflectivity are enabled for the G buffer.
     * For Metallic-Roughness workflow with ORM texture, we assume that ORM texture is defined according to the default layout:
     * pbr.useRoughnessFromMetallicTextureAlpha = false;
     * pbr.useRoughnessFromMetallicTextureGreen = true;
     * pbr.useMetallnessFromMetallicTextureBlue = true;
     */
    set enableReflectivity(enable: boolean);
    /**
     * If set to true (default: false), the depth texture will be cleared with the depth value corresponding to the far plane (1 in normal mode, 0 in reverse depth buffer mode)
     * If set to false, the depth texture is always cleared with 0.
     */
    useSpecificClearForDepthTexture: boolean;
    /**
     * Gets the scene associated with the buffer.
     */
    get scene(): Scene;
    /**
     * Gets the ratio used by the buffer during its creation.
     * How big is the buffer related to the main canvas.
     */
    get ratio(): number;
    /**
     * @internal
     */
    static _SceneComponentInitialization: (scene: Scene) => void;
    /**
     * Creates a new G Buffer for the scene
     * @param scene The scene the buffer belongs to
     * @param ratioOrDimensions How big is the buffer related to the main canvas (default: 1). You can also directly pass a width and height for the generated textures
     * @param depthFormat Format of the depth texture (default: Constants.TEXTUREFORMAT_DEPTH16)
     * @param textureTypesAndFormats The types and formats of textures to create as render targets. If not provided, all textures will be RGBA and float or half float, depending on the engine capabilities.
     */
    constructor(scene: Scene, ratioOrDimensions?: number | {
        width: number;
        height: number;
    }, depthFormat?: number, textureTypesAndFormats?: {
        [key: number]: {
            textureType: number;
            textureFormat: number;
        };
    });
    /**
     * Checks whether everything is ready to render a submesh to the G buffer.
     * @param subMesh the submesh to check readiness for
     * @param useInstances is the mesh drawn using instance or not
     * @returns true if ready otherwise false
     */
    isReady(subMesh: SubMesh, useInstances: boolean): boolean;
    /**
     * Gets the current underlying G Buffer.
     * @returns the buffer
     */
    getGBuffer(): MultiRenderTarget;
    /**
     * Gets the number of samples used to render the buffer (anti aliasing).
     */
    get samples(): number;
    /**
     * Sets the number of samples used to render the buffer (anti aliasing).
     */
    set samples(value: number);
    /**
     * Disposes the renderer and frees up associated resources.
     */
    dispose(): void;
    private _assignRenderTargetIndices;
    protected _createRenderTargets(): void;
    private _copyBonesTransformationMatrices;
}
export {};
