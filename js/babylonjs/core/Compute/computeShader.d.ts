import type { UniformBuffer } from "../Materials/uniformBuffer";
import type { Scene } from "../scene";
import type { Nullable } from "../types";
import type { ComputeEffect, IComputeShaderPath } from "./computeEffect.js";
import type { ComputeBindingMapping } from "../Engines/Extensions/engine.computeShader";
import type { BaseTexture } from "../Materials/Textures/baseTexture";
import type { StorageBuffer } from "../Buffers/storageBuffer";
import { TextureSampler } from "../Materials/Textures/textureSampler";
import type { DataBuffer } from "../Buffers/dataBuffer.js";
import type { ExternalTexture } from "../Materials/Textures/externalTexture.js";
import type { VideoTexture } from "../Materials/Textures/videoTexture.js";
import { WebGPUPerfCounter } from "../Engines/WebGPU/webgpuPerfCounter.js";
import type { AbstractEngine } from "../Engines/abstractEngine.js";
/**
 * Defines the options associated with the creation of a compute shader.
 */
export interface IComputeShaderOptions {
    /**
     * list of bindings mapping (key is property name, value is binding location)
     * Must be provided because browsers don't support reflection for wgsl shaders yet (so there's no way to query the binding/group from a variable name)
     * TODO: remove this when browsers support reflection for wgsl shaders
     */
    bindingsMapping: ComputeBindingMapping;
    /**
     * The list of defines used in the shader
     */
    defines?: string[];
    /**
     * The name of the entry point in the shader source (default: "main")
     */
    entryPoint?: string;
    /**
     * If provided, will be called with the shader code so that this code can be updated before it is compiled by the GPU
     */
    processFinalCode?: Nullable<(code: string) => string>;
}
/**
 * The ComputeShader object lets you execute a compute shader on your GPU (if supported by the engine)
 */
export declare class ComputeShader {
    private _engine;
    private _shaderPath;
    private _options;
    private _effect;
    private _cachedDefines;
    private _bindings;
    private _samplers;
    private _context;
    private _contextIsDirty;
    /**
     * Gets the unique id of the compute shader
     */
    readonly uniqueId: number;
    /**
     * The name of the shader
     */
    name: string;
    /**
     * The options used to create the shader
     */
    get options(): IComputeShaderOptions;
    /**
     * The shaderPath used to create the shader
     */
    get shaderPath(): string | IComputeShaderPath;
    /**
     * When set to true, dispatch won't call isReady anymore and won't check if the underlying GPU resources should be (re)created because of a change in the inputs (texture, uniform buffer, etc.)
     * If you know that your inputs did not change since last time dispatch was called and that isReady() returns true, set this flag to true to improve performance
     */
    fastMode: boolean;
    /**
     * Callback triggered when the shader is compiled
     */
    onCompiled: Nullable<(effect: ComputeEffect) => void>;
    /**
     * Callback triggered when an error occurs
     */
    onError: Nullable<(effect: ComputeEffect, errors: string) => void>;
    /**
     * Gets the GPU time spent running the compute shader for the last frame rendered (in nanoseconds).
     * You have to enable the "timestamp-query" extension in the engine constructor options and set engine.enableGPUTimingMeasurements = true.
     */
    readonly gpuTimeInFrame?: WebGPUPerfCounter;
    /**
     * Instantiates a new compute shader.
     * @param name Defines the name of the compute shader in the scene
     * @param engine Defines the engine the compute shader belongs to
     * @param shaderPath Defines the route to the shader code in one of three ways:
     *  * object: \{ compute: "custom" \}, used with ShaderStore.ShadersStoreWGSL["customComputeShader"]
     *  * object: \{ computeElement: "HTMLElementId" \}, used with shader code in script tags
     *  * object: \{ computeSource: "compute shader code string" \}, where the string contains the shader code
     *  * string: try first to find the code in ShaderStore.ShadersStoreWGSL[shaderPath + "ComputeShader"]. If not, assumes it is a file with name shaderPath.compute.fx in index.html folder.
     * @param options Define the options used to create the shader
     */
    constructor(name: string, engine: AbstractEngine, shaderPath: IComputeShaderPath | string, options?: Partial<IComputeShaderOptions>);
    /**
     * Gets the current class name of the material e.g. "ComputeShader"
     * Mainly use in serialization.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Binds a texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     * @param bindSampler Bind the sampler corresponding to the texture (default: true). The sampler will be bound just before the binding index of the texture
     */
    setTexture(name: string, texture: BaseTexture, bindSampler?: boolean): void;
    /**
     * Binds a storage texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     */
    setStorageTexture(name: string, texture: BaseTexture): void;
    /**
     * Binds an external texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     */
    setExternalTexture(name: string, texture: ExternalTexture): void;
    /**
     * Binds a video texture to the shader (by binding the external texture attached to this video)
     * @param name Binding name of the texture
     * @param texture Texture to bind
     * @returns true if the video texture was successfully bound, else false. false will be returned if the current engine does not support external textures
     */
    setVideoTexture(name: string, texture: VideoTexture): boolean;
    /**
     * Binds a uniform buffer to the shader
     * @param name Binding name of the buffer
     * @param buffer Buffer to bind
     */
    setUniformBuffer(name: string, buffer: UniformBuffer | DataBuffer): void;
    /**
     * Binds a storage buffer to the shader
     * @param name Binding name of the buffer
     * @param buffer Buffer to bind
     */
    setStorageBuffer(name: string, buffer: StorageBuffer | DataBuffer): void;
    /**
     * Binds a texture sampler to the shader
     * @param name Binding name of the sampler
     * @param sampler Sampler to bind
     */
    setTextureSampler(name: string, sampler: TextureSampler): void;
    /**
     * Specifies that the compute shader is ready to be executed (the compute effect and all the resources are ready)
     * @returns true if the compute shader is ready to be executed
     */
    isReady(): boolean;
    /**
     * Dispatches (executes) the compute shader
     * @param x Number of workgroups to execute on the X dimension
     * @param y Number of workgroups to execute on the Y dimension (default: 1)
     * @param z Number of workgroups to execute on the Z dimension (default: 1)
     * @returns True if the dispatch could be done, else false (meaning either the compute effect or at least one of the bound resources was not ready)
     */
    dispatch(x: number, y?: number, z?: number): boolean;
    /**
     * Dispatches (executes) the compute shader.
     * @param buffer Buffer containing the number of workgroups to execute on the X, Y and Z dimensions
     * @param offset Offset in the buffer where the workgroup counts are stored (default: 0)
     * @returns True if the dispatch could be done, else false (meaning either the compute effect or at least one of the bound resources was not ready)
     */
    dispatchIndirect(buffer: StorageBuffer | DataBuffer, offset?: number): boolean;
    private _checkContext;
    /**
     * Waits for the compute shader to be ready and executes it
     * @param x Number of workgroups to execute on the X dimension
     * @param y Number of workgroups to execute on the Y dimension (default: 1)
     * @param z Number of workgroups to execute on the Z dimension (default: 1)
     * @param delay Delay between the retries while the shader is not ready (in milliseconds - 10 by default)
     * @returns A promise that is resolved once the shader has been sent to the GPU. Note that it does not mean that the shader execution itself is finished!
     */
    dispatchWhenReady(x: number, y?: number, z?: number, delay?: number): Promise<void>;
    /**
     * Serializes this compute shader in a JSON representation
     * @returns the serialized compute shader object
     */
    serialize(): any;
    /**
     * Creates a compute shader from parsed compute shader data
     * @param source defines the JSON representation of the compute shader
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a new compute shader
     */
    static Parse(source: any, scene: Scene, rootUrl: string): ComputeShader;
    protected static _BufferIsDataBuffer(buffer: UniformBuffer | StorageBuffer | DataBuffer): buffer is DataBuffer;
}
