import type { NodeMaterialBlock } from "./nodeMaterialBlock";
import { PushMaterial } from "../pushMaterial";
import type { Scene } from "../../scene";
import { AbstractMesh } from "../../Meshes/abstractMesh";
import { Matrix } from "../../Maths/math.vector";
import { Color4 } from "../../Maths/math.color";
import type { Mesh } from "../../Meshes/mesh";
import { Effect } from "../effect";
import type { BaseTexture } from "../../Materials/Textures/baseTexture";
import { Observable } from "../../Misc/observable";
import type { SubMesh } from "../../Meshes/subMesh";
import { MaterialDefines } from "../materialDefines";
import type { NodeMaterialOptimizer } from "./Optimizers/nodeMaterialOptimizer";
import type { ImageProcessingConfiguration } from "../imageProcessingConfiguration";
import type { Nullable } from "../../types";
import { InputBlock } from "./Blocks/Input/inputBlock";
import type { TextureBlock } from "./Blocks/Dual/textureBlock";
import type { ReflectionTextureBaseBlock } from "./Blocks/Dual/reflectionTextureBaseBlock";
import type { RefractionBlock } from "./Blocks/PBR/refractionBlock";
import { CurrentScreenBlock } from "./Blocks/Dual/currentScreenBlock";
import { ParticleTextureBlock } from "./Blocks/Particle/particleTextureBlock";
import type { PostProcessOptions } from "../../PostProcesses/postProcess";
import { PostProcess } from "../../PostProcesses/postProcess";
import type { Camera } from "../../Cameras/camera";
import { NodeMaterialModes } from "./Enums/nodeMaterialModes";
import type { IParticleSystem } from "../../Particles/IParticleSystem";
import { ProceduralTexture } from "../Textures/Procedurals/proceduralTexture";
import type { ImageSourceBlock } from "./Blocks/Dual/imageSourceBlock";
import type { Material } from "../material";
import type { TriPlanarBlock } from "./Blocks/triPlanarBlock";
import type { BiPlanarBlock } from "./Blocks/biPlanarBlock";
import type { PrePassRenderer } from "../../Rendering/prePassRenderer";
import type { PrePassTextureBlock } from "./Blocks/Input/prePassTextureBlock";
import type { IImageProcessingConfigurationDefines } from "../imageProcessingConfiguration.defines";
import { ShaderLanguage } from "../shaderLanguage";
import { AbstractEngine } from "../../Engines/abstractEngine";
/**
 * Interface used to configure the node material editor
 */
export interface INodeMaterialEditorOptions {
    /** Define the URL to load node editor script from */
    editorURL?: string;
    /** Additional configuration for the NME */
    nodeEditorConfig?: {
        backgroundColor?: Color4;
    };
}
/** @internal */
export declare class NodeMaterialDefines extends MaterialDefines implements IImageProcessingConfigurationDefines {
    /** Normal */
    NORMAL: boolean;
    /** Tangent */
    TANGENT: boolean;
    /** Vertex color */
    VERTEXCOLOR_NME: boolean;
    /**  Uv1 **/
    UV1: boolean;
    /** Uv2 **/
    UV2: boolean;
    /** Uv3 **/
    UV3: boolean;
    /** Uv4 **/
    UV4: boolean;
    /** Uv5 **/
    UV5: boolean;
    /** Uv6 **/
    UV6: boolean;
    /** Prepass **/
    PREPASS: boolean;
    /** Prepass normal */
    PREPASS_NORMAL: boolean;
    /** Prepass normal index */
    PREPASS_NORMAL_INDEX: number;
    /** Prepass position */
    PREPASS_POSITION: boolean;
    /** Prepass position index */
    PREPASS_POSITION_INDEX: number;
    /** Prepass depth */
    PREPASS_DEPTH: boolean;
    /** Prepass depth index */
    PREPASS_DEPTH_INDEX: number;
    /** Scene MRT count */
    SCENE_MRT_COUNT: number;
    /** BONES */
    NUM_BONE_INFLUENCERS: number;
    /** Bones per mesh */
    BonesPerMesh: number;
    /** Using texture for bone storage */
    BONETEXTURE: boolean;
    /** MORPH TARGETS */
    MORPHTARGETS: boolean;
    /** Morph target normal */
    MORPHTARGETS_NORMAL: boolean;
    /** Morph target tangent */
    MORPHTARGETS_TANGENT: boolean;
    /** Morph target uv */
    MORPHTARGETS_UV: boolean;
    /** Number of morph influencers */
    NUM_MORPH_INFLUENCERS: number;
    /** Using a texture to store morph target data */
    MORPHTARGETS_TEXTURE: boolean;
    /** IMAGE PROCESSING */
    IMAGEPROCESSING: boolean;
    /** Vignette */
    VIGNETTE: boolean;
    /** Multiply blend mode for vignette */
    VIGNETTEBLENDMODEMULTIPLY: boolean;
    /** Opaque blend mode for vignette */
    VIGNETTEBLENDMODEOPAQUE: boolean;
    /** Tone mapping */
    TONEMAPPING: number;
    /** Contrast */
    CONTRAST: boolean;
    /** Exposure */
    EXPOSURE: boolean;
    /** Color curves */
    COLORCURVES: boolean;
    /** Color grading */
    COLORGRADING: boolean;
    /** 3D color grading */
    COLORGRADING3D: boolean;
    /** Sampler green depth */
    SAMPLER3DGREENDEPTH: boolean;
    /** Sampler for BGR map */
    SAMPLER3DBGRMAP: boolean;
    /** Dithering */
    DITHER: boolean;
    /** Using post process for image processing */
    IMAGEPROCESSINGPOSTPROCESS: boolean;
    /** Skip color clamp */
    SKIPFINALCOLORCLAMP: boolean;
    /** MISC. */
    BUMPDIRECTUV: number;
    /** Camera is orthographic */
    CAMERA_ORTHOGRAPHIC: boolean;
    /** Camera is perspective */
    CAMERA_PERSPECTIVE: boolean;
    /**
     * Creates a new NodeMaterialDefines
     */
    constructor();
    /**
     * Set the value of a specific key
     * @param name defines the name of the key to set
     * @param value defines the value to set
     * @param markAsUnprocessedIfDirty Flag to indicate to the cache that this value needs processing
     */
    setValue(name: string, value: any, markAsUnprocessedIfDirty?: boolean): void;
}
/**
 * Class used to configure NodeMaterial
 */
export interface INodeMaterialOptions {
    /**
     * Defines if blocks should emit comments
     */
    emitComments: boolean;
    /** Defines shader language to use (default to GLSL) */
    shaderLanguage: ShaderLanguage;
}
/**
 * Blocks that manage a texture
 */
export type NodeMaterialTextureBlocks = TextureBlock | ReflectionTextureBaseBlock | RefractionBlock | CurrentScreenBlock | ParticleTextureBlock | ImageSourceBlock | TriPlanarBlock | BiPlanarBlock | PrePassTextureBlock;
/**
 * Class used to create a node based material built by assembling shader blocks
 */
export declare class NodeMaterial extends PushMaterial {
    private static _BuildIdGenerator;
    private _options;
    private _vertexCompilationState;
    private _fragmentCompilationState;
    private _sharedData;
    private _buildId;
    private _buildWasSuccessful;
    private _cachedWorldViewMatrix;
    private _cachedWorldViewProjectionMatrix;
    private _optimizers;
    private _animationFrame;
    /** Define the Url to load node editor script */
    static EditorURL: string;
    /** Define the Url to load snippets */
    static SnippetUrl: string;
    /** Gets or sets a boolean indicating that node materials should not deserialize textures from json / snippet content */
    static IgnoreTexturesAtLoadTime: boolean;
    /**
     * Checks if a block is a texture block
     * @param block The block to check
     * @returns True if the block is a texture block
     */
    static _BlockIsTextureBlock(block: NodeMaterialBlock): block is NodeMaterialTextureBlocks;
    private BJSNODEMATERIALEDITOR;
    /** Get the inspector from bundle or global
     * @returns the global NME
     */
    private _getGlobalNodeMaterialEditor;
    /** Get the active shader language */
    get shaderLanguage(): ShaderLanguage;
    /**
     * Snippet ID if the material was created from the snippet server
     */
    snippetId: string;
    /**
     * Gets or sets data used by visual editor
     * @see https://nme.babylonjs.com
     */
    editorData: any;
    /**
     * Gets or sets a boolean indicating that alpha value must be ignored (This will turn alpha blending off even if an alpha value is produced by the material)
     */
    ignoreAlpha: boolean;
    /**
     * Defines the maximum number of lights that can be used in the material
     */
    maxSimultaneousLights: number;
    /**
     * Observable raised when the material is built
     */
    onBuildObservable: Observable<NodeMaterial>;
    /**
     * Gets or sets the root nodes of the material vertex shader
     */
    _vertexOutputNodes: NodeMaterialBlock[];
    /**
     * Gets or sets the root nodes of the material fragment (pixel) shader
     */
    _fragmentOutputNodes: NodeMaterialBlock[];
    /** Gets or sets options to control the node material overall behavior */
    get options(): INodeMaterialOptions;
    set options(options: INodeMaterialOptions);
    /**
     * Default configuration related to image processing available in the standard Material.
     */
    protected _imageProcessingConfiguration: ImageProcessingConfiguration;
    /**
     * Gets the image processing configuration used either in this material.
     */
    get imageProcessingConfiguration(): ImageProcessingConfiguration;
    /**
     * Sets the Default image processing configuration used either in the this material.
     *
     * If sets to null, the scene one is in use.
     */
    set imageProcessingConfiguration(value: ImageProcessingConfiguration);
    /**
     * Gets an array of blocks that needs to be serialized even if they are not yet connected
     */
    attachedBlocks: NodeMaterialBlock[];
    /**
     * Specifies the mode of the node material
     * @internal
     */
    _mode: NodeMaterialModes;
    /**
     * Gets or sets the mode property
     */
    get mode(): NodeMaterialModes;
    set mode(value: NodeMaterialModes);
    /** Gets or sets the unique identifier used to identified the effect associated with the material */
    get buildId(): number;
    set buildId(value: number);
    /**
     * A free comment about the material
     */
    comment: string;
    /**
     * Create a new node based material
     * @param name defines the material name
     * @param scene defines the hosting scene
     * @param options defines creation option
     */
    constructor(name: string, scene?: Scene, options?: Partial<INodeMaterialOptions>);
    /**
     * Gets the current class name of the material e.g. "NodeMaterial"
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Keep track of the image processing observer to allow dispose and replace.
     */
    private _imageProcessingObserver;
    /**
     * Attaches a new image processing configuration to the Standard Material.
     * @param configuration
     */
    protected _attachImageProcessingConfiguration(configuration: Nullable<ImageProcessingConfiguration>): void;
    /**
     * Get a block by its name
     * @param name defines the name of the block to retrieve
     * @returns the required block or null if not found
     */
    getBlockByName(name: string): NodeMaterialBlock | null;
    /**
     * Get a block using a predicate
     * @param predicate defines the predicate used to find the good candidate
     * @returns the required block or null if not found
     */
    getBlockByPredicate(predicate: (block: NodeMaterialBlock) => boolean): NodeMaterialBlock | null;
    /**
     * Get an input block using a predicate
     * @param predicate defines the predicate used to find the good candidate
     * @returns the required input block or null if not found
     */
    getInputBlockByPredicate(predicate: (block: InputBlock) => boolean): Nullable<InputBlock>;
    /**
     * Gets the list of input blocks attached to this material
     * @returns an array of InputBlocks
     */
    getInputBlocks(): InputBlock[];
    /**
     * Adds a new optimizer to the list of optimizers
     * @param optimizer defines the optimizers to add
     * @returns the current material
     */
    registerOptimizer(optimizer: NodeMaterialOptimizer): this | undefined;
    /**
     * Remove an optimizer from the list of optimizers
     * @param optimizer defines the optimizers to remove
     * @returns the current material
     */
    unregisterOptimizer(optimizer: NodeMaterialOptimizer): this | undefined;
    /**
     * Add a new block to the list of output nodes
     * @param node defines the node to add
     * @returns the current material
     */
    addOutputNode(node: NodeMaterialBlock): this;
    /**
     * Remove a block from the list of root nodes
     * @param node defines the node to remove
     * @returns the current material
     */
    removeOutputNode(node: NodeMaterialBlock): this;
    private _addVertexOutputNode;
    private _removeVertexOutputNode;
    private _addFragmentOutputNode;
    private _removeFragmentOutputNode;
    /**
     * Gets or sets a boolean indicating that alpha blending must be enabled no matter what alpha value or alpha channel of the FragmentBlock are
     */
    forceAlphaBlending: boolean;
    /**
     * Specifies if the material will require alpha blending
     * @returns a boolean specifying if alpha blending is needed
     */
    needAlphaBlending(): boolean;
    /**
     * Specifies if this material should be rendered in alpha test mode
     * @returns a boolean specifying if an alpha test is needed.
     */
    needAlphaTesting(): boolean;
    private _processInitializeOnLink;
    private _initializeBlock;
    private _resetDualBlocks;
    /**
     * Remove a block from the current node material
     * @param block defines the block to remove
     */
    removeBlock(block: NodeMaterialBlock): void;
    /**
     * Build the material and generates the inner effect
     * @param verbose defines if the build should log activity
     * @param updateBuildId defines if the internal build Id should be updated (default is true)
     * @param autoConfigure defines if the autoConfigure method should be called when initializing blocks (default is false)
     */
    build(verbose?: boolean, updateBuildId?: boolean, autoConfigure?: boolean): void;
    /**
     * Runs an otpimization phase to try to improve the shader code
     */
    optimize(): void;
    private _prepareDefinesForAttributes;
    /**
     * Can this material render to prepass
     */
    get isPrePassCapable(): boolean;
    /**
     * Outputs written to the prepass
     */
    get prePassTextureOutputs(): number[];
    /**
     * Gets the list of prepass texture required
     */
    get prePassTextureInputs(): number[];
    /**
     * Sets the required values to the prepass renderer.
     * @param prePassRenderer defines the prepass renderer to set
     * @returns true if the pre pass is needed
     */
    setPrePassRenderer(prePassRenderer: PrePassRenderer): boolean;
    /**
     * Create a post process from the material
     * @param camera The camera to apply the render pass to.
     * @param options The required width/height ratio to downsize to before computing the render pass. (Use 1.0 for full size)
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param textureFormat Format of textures used when performing the post process. (default: TEXTUREFORMAT_RGBA)
     * @returns the post process created
     */
    createPostProcess(camera: Nullable<Camera>, options?: number | PostProcessOptions, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number, textureFormat?: number): Nullable<PostProcess>;
    /**
     * Create the post process effect from the material
     * @param postProcess The post process to create the effect for
     */
    createEffectForPostProcess(postProcess: PostProcess): void;
    private _createEffectForPostProcess;
    /**
     * Create a new procedural texture based on this node material
     * @param size defines the size of the texture
     * @param scene defines the hosting scene
     * @returns the new procedural texture attached to this node material
     */
    createProceduralTexture(size: number | {
        width: number;
        height: number;
        layers?: number;
    }, scene: Scene): Nullable<ProceduralTexture>;
    private _createEffectForParticles;
    private _checkInternals;
    /**
     * Create the effect to be used as the custom effect for a particle system
     * @param particleSystem Particle system to create the effect for
     * @param onCompiled defines a function to call when the effect creation is successful
     * @param onError defines a function to call when the effect creation has failed
     */
    createEffectForParticles(particleSystem: IParticleSystem, onCompiled?: (effect: Effect) => void, onError?: (effect: Effect, errors: string) => void): void;
    /**
     * Use this material as the shadow depth wrapper of a target material
     * @param targetMaterial defines the target material
     */
    createAsShadowDepthWrapper(targetMaterial: Material): void;
    private _processDefines;
    /**
     * Get if the submesh is ready to be used and all its information available.
     * Child classes can use it to update shaders
     * @param mesh defines the mesh to check
     * @param subMesh defines which submesh to check
     * @param useInstances specifies that instances should be used
     * @returns a boolean indicating that the submesh is ready or not
     */
    isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean;
    /**
     * Get a string representing the shaders built by the current node graph
     */
    get compiledShaders(): string;
    /**
     * Binds the world matrix to the material
     * @param world defines the world transformation matrix
     */
    bindOnlyWorldMatrix(world: Matrix): void;
    /**
     * Binds the submesh to this material by preparing the effect and shader to draw
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    bindForSubMesh(world: Matrix, mesh: Mesh, subMesh: SubMesh): void;
    /**
     * Gets the active textures from the material
     * @returns an array of textures
     */
    getActiveTextures(): BaseTexture[];
    /**
     * Gets the list of texture blocks
     * Note that this method will only return blocks that are reachable from the final block(s) and only after the material has been built!
     * @returns an array of texture blocks
     */
    getTextureBlocks(): NodeMaterialTextureBlocks[];
    /**
     * Gets the list of all texture blocks
     * Note that this method will scan all attachedBlocks and return blocks that are texture blocks
     * @returns
     */
    getAllTextureBlocks(): NodeMaterialTextureBlocks[];
    /**
     * Specifies if the material uses a texture
     * @param texture defines the texture to check against the material
     * @returns a boolean specifying if the material uses the texture
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Disposes the material
     * @param forceDisposeEffect specifies if effects should be forcefully disposed
     * @param forceDisposeTextures specifies if textures should be forcefully disposed
     * @param notBoundToMesh specifies if the material that is being disposed is known to be not bound to any mesh
     */
    dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean, notBoundToMesh?: boolean): void;
    /** Creates the node editor window.
     * @param additionalConfig Define the configuration of the editor
     */
    private _createNodeEditor;
    /**
     * Launch the node material editor
     * @param config Define the configuration of the editor
     * @returns a promise fulfilled when the node editor is visible
     */
    edit(config?: INodeMaterialEditorOptions): Promise<void>;
    /**
     * Clear the current material
     */
    clear(): void;
    /**
     * Clear the current material and set it to a default state
     */
    setToDefault(): void;
    /**
     * Clear the current material and set it to a default state for post process
     */
    setToDefaultPostProcess(): void;
    /**
     * Clear the current material and set it to a default state for procedural texture
     */
    setToDefaultProceduralTexture(): void;
    /**
     * Clear the current material and set it to a default state for particle
     */
    setToDefaultParticle(): void;
    /**
     * Loads the current Node Material from a url pointing to a file save by the Node Material Editor
     * @deprecated Please use NodeMaterial.ParseFromFileAsync instead
     * @param url defines the url to load from
     * @param rootUrl defines the root URL for nested url in the node material
     * @returns a promise that will fulfil when the material is fully loaded
     */
    loadAsync(url: string, rootUrl?: string): Promise<NodeMaterial>;
    private _gatherBlocks;
    /**
     * Generate a string containing the code declaration required to create an equivalent of this material
     * @returns a string
     */
    generateCode(): string;
    /**
     * Serializes this material in a JSON representation
     * @param selectedBlocks defines an optional list of blocks to serialize
     * @returns the serialized material object
     */
    serialize(selectedBlocks?: NodeMaterialBlock[]): any;
    private _restoreConnections;
    /**
     * Clear the current graph and load a new one from a serialization object
     * @param source defines the JSON representation of the material
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @param merge defines whether or not the source must be merged or replace the current content
     */
    parseSerializedObject(source: any, rootUrl?: string, merge?: boolean): void;
    /**
     * Clear the current graph and load a new one from a serialization object
     * @param source defines the JSON representation of the material
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @param merge defines whether or not the source must be merged or replace the current content
     * @deprecated Please use the parseSerializedObject method instead
     */
    loadFromSerialization(source: any, rootUrl?: string, merge?: boolean): void;
    /**
     * Makes a duplicate of the current material.
     * @param name defines the name to use for the new material
     * @param shareEffect defines if the clone material should share the same effect (default is false)
     * @returns the cloned material
     */
    clone(name: string, shareEffect?: boolean): NodeMaterial;
    /**
     * Awaits for all the material textures to be ready before resolving the returned promise.
     * @returns A promise that resolves when the textures are ready.
     */
    whenTexturesReadyAsync(): Promise<void[]>;
    /**
     * Creates a node material from parsed material data
     * @param source defines the JSON representation of the material
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @param shaderLanguage defines the language to use (GLSL by default)
     * @returns a new node material
     */
    static Parse(source: any, scene: Scene, rootUrl?: string, shaderLanguage?: ShaderLanguage): NodeMaterial;
    /**
     * Creates a node material from a snippet saved in a remote file
     * @param name defines the name of the material to create
     * @param url defines the url to load from
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL for nested url in the node material
     * @param skipBuild defines whether to build the node material
     * @param targetMaterial defines a material to use instead of creating a new one
     * @returns a promise that will resolve to the new node material
     */
    static ParseFromFileAsync(name: string, url: string, scene: Scene, rootUrl?: string, skipBuild?: boolean, targetMaterial?: NodeMaterial): Promise<NodeMaterial>;
    /**
     * Creates a node material from a snippet saved by the node material editor
     * @param snippetId defines the snippet to load
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @param nodeMaterial defines a node material to update (instead of creating a new one)
     * @param skipBuild defines whether to build the node material
     * @param waitForTextureReadyness defines whether to wait for texture readiness resolving the promise (default: false)
     * @returns a promise that will resolve to the new node material
     */
    static ParseFromSnippetAsync(snippetId: string, scene?: Scene, rootUrl?: string, nodeMaterial?: NodeMaterial, skipBuild?: boolean, waitForTextureReadyness?: boolean): Promise<NodeMaterial>;
    /**
     * Creates a new node material set to default basic configuration
     * @param name defines the name of the material
     * @param scene defines the hosting scene
     * @returns a new NodeMaterial
     */
    static CreateDefault(name: string, scene?: Scene): NodeMaterial;
}
