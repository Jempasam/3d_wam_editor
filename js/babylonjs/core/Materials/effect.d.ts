import { Observable } from "../Misc/observable";
import type { FloatArray, Nullable } from "../types";
import type { IDisposable } from "../scene";
import type { IPipelineContext } from "../Engines/IPipelineContext";
import type { DataBuffer } from "../Buffers/dataBuffer";
import type { IShaderProcessor } from "../Engines/Processors/iShaderProcessor";
import type { ShaderCustomProcessingFunction } from "../Engines/Processors/shaderProcessingOptions";
import type { IMatrixLike, IVector2Like, IVector3Like, IVector4Like, IColor3Like, IColor4Like, IQuaternionLike } from "../Maths/math.like";
import type { AbstractEngine } from "../Engines/abstractEngine";
import type { IEffectFallbacks } from "./iEffectFallbacks";
import { ShaderLanguage } from "./shaderLanguage";
import type { InternalTexture } from "./Textures/internalTexture";
import type { ThinTexture } from "./Textures/thinTexture";
import type { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import type { PostProcess } from "../PostProcesses/postProcess";
import type { IPipelineGenerationOptions } from "./effect.functions";
/**
 * Defines the route to the shader code. The priority is as follows:
 *  * object: `{ vertexSource: "vertex shader code string", fragmentSource: "fragment shader code string" }` for directly passing the shader code
 *  * object: `{ vertexElement: "vertexShaderCode", fragmentElement: "fragmentShaderCode" }`, used with shader code in script tags
 *  * object: `{ vertex: "custom", fragment: "custom" }`, used with `Effect.ShadersStore["customVertexShader"]` and `Effect.ShadersStore["customFragmentShader"]`
 *  * string: `"./COMMON_NAME"`, used with external files COMMON_NAME.vertex.fx and COMMON_NAME.fragment.fx in index.html folder.
 */
export type IShaderPath = {
    /**
     * Directly pass the shader code
     */
    vertexSource?: string;
    /**
     * Directly pass the shader code
     */
    fragmentSource?: string;
    /**
     * Used with Effect.ShadersStore. If the `vertex` is set to `"custom`, then
     * Babylon.js will read from Effect.ShadersStore["customVertexShader"]
     */
    vertex?: string;
    /**
     * Used with Effect.ShadersStore. If the `fragment` is set to `"custom`, then
     * Babylon.js will read from Effect.ShadersStore["customFragmentShader"]
     */
    fragment?: string;
    /**
     * Used with shader code in script tags
     */
    vertexElement?: string;
    /**
     * Used with shader code in script tags
     */
    fragmentElement?: string;
    /**
     * Defines the name appearing in spector when framgent/vertex...source are being used
     */
    spectorName?: string;
};
/**
 * Options to be used when creating an effect.
 */
export interface IEffectCreationOptions {
    /**
     * Attributes that will be used in the shader.
     */
    attributes: string[];
    /**
     * Uniform variable names that will be set in the shader.
     */
    uniformsNames: string[];
    /**
     * Uniform buffer variable names that will be set in the shader.
     */
    uniformBuffersNames: string[];
    /**
     * Sampler texture variable names that will be set in the shader.
     */
    samplers: string[];
    /**
     * Define statements that will be set in the shader.
     */
    defines: any;
    /**
     * Possible fallbacks for this effect to improve performance when needed.
     */
    fallbacks: Nullable<IEffectFallbacks>;
    /**
     * Callback that will be called when the shader is compiled.
     */
    onCompiled: Nullable<(effect: Effect) => void>;
    /**
     * Callback that will be called if an error occurs during shader compilation.
     */
    onError: Nullable<(effect: Effect, errors: string) => void>;
    /**
     * Parameters to be used with Babylons include syntax to iterate over an array (eg. \{lights: 10\})
     */
    indexParameters?: any;
    /**
     * Max number of lights that can be used in the shader.
     */
    maxSimultaneousLights?: number;
    /**
     * See https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/transformFeedbackVaryings
     */
    transformFeedbackVaryings?: Nullable<string[]>;
    /**
     * If provided, will be called two times with the vertex and fragment code so that this code can be updated before it is compiled by the GPU
     */
    processFinalCode?: Nullable<ShaderCustomProcessingFunction>;
    /**
     * If provided, will be called two times with the vertex and fragment code so that this code can be updated after the #include have been processed
     */
    processCodeAfterIncludes?: Nullable<ShaderCustomProcessingFunction>;
    /**
     * Is this effect rendering to several color attachments ?
     */
    multiTarget?: boolean;
    /**
     * The language the shader is written in (default: GLSL)
     */
    shaderLanguage?: ShaderLanguage;
    /**
     * Provide an existing pipeline context to avoid creating a new one
     */
    existingPipelineContext?: IPipelineContext;
}
/**
 * Effect containing vertex and fragment shader that can be executed on an object.
 */
export declare class Effect implements IDisposable {
    /**
     * Gets or sets the relative url used to load shaders if using the engine in non-minified mode
     */
    static get ShadersRepository(): string;
    static set ShadersRepository(repo: string);
    /**
     * Enable logging of the shader code when a compilation error occurs
     */
    static LogShaderCodeOnCompilationError: boolean;
    /**
     * Name of the effect.
     */
    name: IShaderPath | string;
    /**
     * String container all the define statements that should be set on the shader.
     */
    defines: string;
    /**
     * Callback that will be called when the shader is compiled.
     */
    onCompiled: Nullable<(effect: Effect) => void>;
    /**
     * Callback that will be called if an error occurs during shader compilation.
     */
    onError: Nullable<(effect: Effect, errors: string) => void>;
    /**
     * Callback that will be called when effect is bound.
     */
    onBind: Nullable<(effect: Effect) => void>;
    /**
     * Unique ID of the effect.
     */
    uniqueId: number;
    /**
     * Observable that will be called when the shader is compiled.
     * It is recommended to use executeWhenCompile() or to make sure that scene.isReady() is called to get this observable raised.
     */
    onCompileObservable: Observable<Effect>;
    /**
     * Observable that will be called if an error occurs during shader compilation.
     */
    onErrorObservable: Observable<Effect>;
    /** @internal */
    _onBindObservable: Nullable<Observable<Effect>>;
    private _isDisposed;
    /**
     * Observable that will be called when effect is bound.
     */
    get onBindObservable(): Observable<Effect>;
    /** @internal */
    _bonesComputationForcedToCPU: boolean;
    /** @internal */
    _uniformBuffersNames: {
        [key: string]: number;
    };
    /** @internal */
    _samplerList: string[];
    /** @internal */
    _multiTarget: boolean;
    private static _UniqueIdSeed;
    /** @internal */
    _engine: AbstractEngine;
    private _uniformBuffersNamesList;
    private _uniformsNames;
    private _samplers;
    private _isReady;
    private _compilationError;
    private _allFallbacksProcessed;
    private _attributesNames;
    private _attributes;
    private _attributeLocationByName;
    private _uniforms;
    /**
     * Key for the effect.
     * @internal
     */
    _key: string;
    private _indexParameters;
    private _fallbacks;
    private _vertexSourceCodeOverride;
    private _fragmentSourceCodeOverride;
    private _transformFeedbackVaryings;
    private _shaderLanguage;
    /**
     * Compiled shader to webGL program.
     * @internal
     */
    _pipelineContext: Nullable<IPipelineContext>;
    /** @internal */
    _vertexSourceCode: string;
    /** @internal */
    _fragmentSourceCode: string;
    /** @internal */
    _vertexSourceCodeBeforeMigration: string;
    /** @internal */
    _fragmentSourceCodeBeforeMigration: string;
    /** @internal */
    _rawVertexSourceCode: string;
    /** @internal */
    _rawFragmentSourceCode: string;
    private static _BaseCache;
    private _processingContext;
    private _processCodeAfterIncludes;
    private _processFinalCode;
    /**
     * Gets the shader language type used to write vertex and fragment source code.
     */
    get shaderLanguage(): ShaderLanguage;
    /**
     * Instantiates an effect.
     * An effect can be used to create/manage/execute vertex and fragment shaders.
     * @param baseName Name of the effect.
     * @param attributesNamesOrOptions List of attribute names that will be passed to the shader or set of all options to create the effect.
     * @param uniformsNamesOrEngine List of uniform variable names that will be passed to the shader or the engine that will be used to render effect.
     * @param samplers List of sampler variables that will be passed to the shader.
     * @param engine Engine to be used to render the effect
     * @param defines Define statements to be added to the shader.
     * @param fallbacks Possible fallbacks for this effect to improve performance when needed.
     * @param onCompiled Callback that will be called when the shader is compiled.
     * @param onError Callback that will be called if an error occurs during shader compilation.
     * @param indexParameters Parameters to be used with Babylons include syntax to iterate over an array (eg. \{lights: 10\})
     * @param key Effect Key identifying uniquely compiled shader variants
     * @param shaderLanguage the language the shader is written in (default: GLSL)
     */
    constructor(baseName: IShaderPath | string, attributesNamesOrOptions: string[] | IEffectCreationOptions, uniformsNamesOrEngine: string[] | AbstractEngine, samplers?: Nullable<string[]>, engine?: AbstractEngine, defines?: Nullable<string>, fallbacks?: Nullable<IEffectFallbacks>, onCompiled?: Nullable<(effect: Effect) => void>, onError?: Nullable<(effect: Effect, errors: string) => void>, indexParameters?: any, key?: string, shaderLanguage?: ShaderLanguage);
    /** @internal */
    _processShaderCode(shaderProcessor?: Nullable<IShaderProcessor>, keepExistingPipelineContext?: boolean): void;
    /**
     * Unique key for this effect
     */
    get key(): string;
    /**
     * If the effect has been compiled and prepared.
     * @returns if the effect is compiled and prepared.
     */
    isReady(): boolean;
    private _isReadyInternal;
    /**
     * The engine the effect was initialized with.
     * @returns the engine.
     */
    getEngine(): AbstractEngine;
    /**
     * The pipeline context for this effect
     * @returns the associated pipeline context
     */
    getPipelineContext(): Nullable<IPipelineContext>;
    /**
     * The set of names of attribute variables for the shader.
     * @returns An array of attribute names.
     */
    getAttributesNames(): string[];
    /**
     * Returns the attribute at the given index.
     * @param index The index of the attribute.
     * @returns The location of the attribute.
     */
    getAttributeLocation(index: number): number;
    /**
     * Returns the attribute based on the name of the variable.
     * @param name of the attribute to look up.
     * @returns the attribute location.
     */
    getAttributeLocationByName(name: string): number;
    /**
     * The number of attributes.
     * @returns the number of attributes.
     */
    getAttributesCount(): number;
    /**
     * Gets the index of a uniform variable.
     * @param uniformName of the uniform to look up.
     * @returns the index.
     */
    getUniformIndex(uniformName: string): number;
    /**
     * Returns the attribute based on the name of the variable.
     * @param uniformName of the uniform to look up.
     * @returns the location of the uniform.
     */
    getUniform(uniformName: string): Nullable<WebGLUniformLocation>;
    /**
     * Returns an array of sampler variable names
     * @returns The array of sampler variable names.
     */
    getSamplers(): string[];
    /**
     * Returns an array of uniform variable names
     * @returns The array of uniform variable names.
     */
    getUniformNames(): string[];
    /**
     * Returns an array of uniform buffer variable names
     * @returns The array of uniform buffer variable names.
     */
    getUniformBuffersNames(): string[];
    /**
     * Returns the index parameters used to create the effect
     * @returns The index parameters object
     */
    getIndexParameters(): any;
    /**
     * The error from the last compilation.
     * @returns the error string.
     */
    getCompilationError(): string;
    /**
     * Gets a boolean indicating that all fallbacks were used during compilation
     * @returns true if all fallbacks were used
     */
    allFallbacksProcessed(): boolean;
    /**
     * Adds a callback to the onCompiled observable and call the callback immediately if already ready.
     * @param func The callback to be used.
     */
    executeWhenCompiled(func: (effect: Effect) => void): void;
    private _checkIsReady;
    /**
     * Gets the vertex shader source code of this effect
     * This is the final source code that will be compiled, after all the processing has been done (pre-processing applied, code injection/replacement, etc)
     */
    get vertexSourceCode(): string;
    /**
     * Gets the fragment shader source code of this effect
     * This is the final source code that will be compiled, after all the processing has been done (pre-processing applied, code injection/replacement, etc)
     */
    get fragmentSourceCode(): string;
    /**
     * Gets the vertex shader source code before migration.
     * This is the source code after the include directives have been replaced by their contents but before the code is migrated, i.e. before ShaderProcess._ProcessShaderConversion is executed.
     * This method is, among other things, responsible for parsing #if/#define directives as well as converting GLES2 syntax to GLES3 (in the case of WebGL).
     */
    get vertexSourceCodeBeforeMigration(): string;
    /**
     * Gets the fragment shader source code before migration.
     * This is the source code after the include directives have been replaced by their contents but before the code is migrated, i.e. before ShaderProcess._ProcessShaderConversion is executed.
     * This method is, among other things, responsible for parsing #if/#define directives as well as converting GLES2 syntax to GLES3 (in the case of WebGL).
     */
    get fragmentSourceCodeBeforeMigration(): string;
    /**
     * Gets the vertex shader source code before it has been modified by any processing
     */
    get rawVertexSourceCode(): string;
    /**
     * Gets the fragment shader source code before it has been modified by any processing
     */
    get rawFragmentSourceCode(): string;
    getPipelineGenerationOptions(): IPipelineGenerationOptions;
    /**
     * Recompiles the webGL program
     * @param vertexSourceCode The source code for the vertex shader.
     * @param fragmentSourceCode The source code for the fragment shader.
     * @param onCompiled Callback called when completed.
     * @param onError Callback called on error.
     * @internal
     */
    _rebuildProgram(vertexSourceCode: string, fragmentSourceCode: string, onCompiled: (pipelineContext: IPipelineContext) => void, onError: (message: string) => void): void;
    private _onRenderingStateCompiled;
    /**
     * Prepares the effect
     * @internal
     */
    _prepareEffect(keepExistingPipelineContext?: boolean): void;
    private _getShaderCodeAndErrorLine;
    private _processCompilationErrors;
    /**
     * Checks if the effect is supported. (Must be called after compilation)
     */
    get isSupported(): boolean;
    /**
     * Binds a texture to the engine to be used as output of the shader.
     * @param channel Name of the output variable.
     * @param texture Texture to bind.
     * @internal
     */
    _bindTexture(channel: string, texture: Nullable<InternalTexture>): void;
    /**
     * Sets a texture on the engine to be used in the shader.
     * @param channel Name of the sampler variable.
     * @param texture Texture to set.
     */
    setTexture(channel: string, texture: Nullable<ThinTexture>): void;
    /**
     * Sets a depth stencil texture from a render target on the engine to be used in the shader.
     * @param channel Name of the sampler variable.
     * @param texture Texture to set.
     */
    setDepthStencilTexture(channel: string, texture: Nullable<RenderTargetTexture>): void;
    /**
     * Sets an array of textures on the engine to be used in the shader.
     * @param channel Name of the variable.
     * @param textures Textures to set.
     */
    setTextureArray(channel: string, textures: ThinTexture[]): void;
    /**
     * Sets a texture to be the input of the specified post process. (To use the output, pass in the next post process in the pipeline)
     * @param channel Name of the sampler variable.
     * @param postProcess Post process to get the input texture from.
     */
    setTextureFromPostProcess(channel: string, postProcess: Nullable<PostProcess>): void;
    /**
     * (Warning! setTextureFromPostProcessOutput may be desired instead)
     * Sets the input texture of the passed in post process to be input of this effect. (To use the output of the passed in post process use setTextureFromPostProcessOutput)
     * @param channel Name of the sampler variable.
     * @param postProcess Post process to get the output texture from.
     */
    setTextureFromPostProcessOutput(channel: string, postProcess: Nullable<PostProcess>): void;
    /**
     * Binds a buffer to a uniform.
     * @param buffer Buffer to bind.
     * @param name Name of the uniform variable to bind to.
     */
    bindUniformBuffer(buffer: DataBuffer, name: string): void;
    /**
     * Binds block to a uniform.
     * @param blockName Name of the block to bind.
     * @param index Index to bind.
     */
    bindUniformBlock(blockName: string, index: number): void;
    /**
     * Sets an integer value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param value Value to be set.
     * @returns this effect.
     */
    setInt(uniformName: string, value: number): Effect;
    /**
     * Sets an int2 value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First int in int2.
     * @param y Second int in int2.
     * @returns this effect.
     */
    setInt2(uniformName: string, x: number, y: number): Effect;
    /**
     * Sets an int3 value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First int in int3.
     * @param y Second int in int3.
     * @param z Third int in int3.
     * @returns this effect.
     */
    setInt3(uniformName: string, x: number, y: number, z: number): Effect;
    /**
     * Sets an int4 value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First int in int4.
     * @param y Second int in int4.
     * @param z Third int in int4.
     * @param w Fourth int in int4.
     * @returns this effect.
     */
    setInt4(uniformName: string, x: number, y: number, z: number, w: number): Effect;
    /**
     * Sets an int array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setIntArray(uniformName: string, array: Int32Array): Effect;
    /**
     * Sets an int array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setIntArray2(uniformName: string, array: Int32Array): Effect;
    /**
     * Sets an int array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setIntArray3(uniformName: string, array: Int32Array): Effect;
    /**
     * Sets an int array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setIntArray4(uniformName: string, array: Int32Array): Effect;
    /**
     * Sets an unsigned integer value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param value Value to be set.
     * @returns this effect.
     */
    setUInt(uniformName: string, value: number): Effect;
    /**
     * Sets an unsigned int2 value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First unsigned int in uint2.
     * @param y Second unsigned int in uint2.
     * @returns this effect.
     */
    setUInt2(uniformName: string, x: number, y: number): Effect;
    /**
     * Sets an unsigned int3 value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First unsigned int in uint3.
     * @param y Second unsigned int in uint3.
     * @param z Third unsigned int in uint3.
     * @returns this effect.
     */
    setUInt3(uniformName: string, x: number, y: number, z: number): Effect;
    /**
     * Sets an unsigned int4 value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First unsigned int in uint4.
     * @param y Second unsigned int in uint4.
     * @param z Third unsigned int in uint4.
     * @param w Fourth unsigned int in uint4.
     * @returns this effect.
     */
    setUInt4(uniformName: string, x: number, y: number, z: number, w: number): Effect;
    /**
     * Sets an unsigned int array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setUIntArray(uniformName: string, array: Uint32Array): Effect;
    /**
     * Sets an unsigned int array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setUIntArray2(uniformName: string, array: Uint32Array): Effect;
    /**
     * Sets an unsigned int array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setUIntArray3(uniformName: string, array: Uint32Array): Effect;
    /**
     * Sets an unsigned int array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setUIntArray4(uniformName: string, array: Uint32Array): Effect;
    /**
     * Sets an float array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setFloatArray(uniformName: string, array: FloatArray): Effect;
    /**
     * Sets an float array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setFloatArray2(uniformName: string, array: FloatArray): Effect;
    /**
     * Sets an float array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setFloatArray3(uniformName: string, array: FloatArray): Effect;
    /**
     * Sets an float array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setFloatArray4(uniformName: string, array: FloatArray): Effect;
    /**
     * Sets an array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setArray(uniformName: string, array: number[]): Effect;
    /**
     * Sets an array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setArray2(uniformName: string, array: number[]): Effect;
    /**
     * Sets an array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setArray3(uniformName: string, array: number[]): Effect;
    /**
     * Sets an array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    setArray4(uniformName: string, array: number[]): Effect;
    /**
     * Sets matrices on a uniform variable.
     * @param uniformName Name of the variable.
     * @param matrices matrices to be set.
     * @returns this effect.
     */
    setMatrices(uniformName: string, matrices: Float32Array | Array<number>): Effect;
    /**
     * Sets matrix on a uniform variable.
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     * @returns this effect.
     */
    setMatrix(uniformName: string, matrix: IMatrixLike): Effect;
    /**
     * Sets a 3x3 matrix on a uniform variable. (Specified as [1,2,3,4,5,6,7,8,9] will result in [1,2,3][4,5,6][7,8,9] matrix)
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     * @returns this effect.
     */
    setMatrix3x3(uniformName: string, matrix: Float32Array | Array<number>): Effect;
    /**
     * Sets a 2x2 matrix on a uniform variable. (Specified as [1,2,3,4] will result in [1,2][3,4] matrix)
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     * @returns this effect.
     */
    setMatrix2x2(uniformName: string, matrix: Float32Array | Array<number>): Effect;
    /**
     * Sets a float on a uniform variable.
     * @param uniformName Name of the variable.
     * @param value value to be set.
     * @returns this effect.
     */
    setFloat(uniformName: string, value: number): Effect;
    /**
     * Sets a boolean on a uniform variable.
     * @param uniformName Name of the variable.
     * @param bool value to be set.
     * @returns this effect.
     */
    setBool(uniformName: string, bool: boolean): Effect;
    /**
     * Sets a Vector2 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector2 vector2 to be set.
     * @returns this effect.
     */
    setVector2(uniformName: string, vector2: IVector2Like): Effect;
    /**
     * Sets a float2 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First float in float2.
     * @param y Second float in float2.
     * @returns this effect.
     */
    setFloat2(uniformName: string, x: number, y: number): Effect;
    /**
     * Sets a Vector3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector3 Value to be set.
     * @returns this effect.
     */
    setVector3(uniformName: string, vector3: IVector3Like): Effect;
    /**
     * Sets a float3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First float in float3.
     * @param y Second float in float3.
     * @param z Third float in float3.
     * @returns this effect.
     */
    setFloat3(uniformName: string, x: number, y: number, z: number): Effect;
    /**
     * Sets a Vector4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector4 Value to be set.
     * @returns this effect.
     */
    setVector4(uniformName: string, vector4: IVector4Like): Effect;
    /**
     * Sets a Quaternion on a uniform variable.
     * @param uniformName Name of the variable.
     * @param quaternion Value to be set.
     * @returns this effect.
     */
    setQuaternion(uniformName: string, quaternion: IQuaternionLike): Effect;
    /**
     * Sets a float4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First float in float4.
     * @param y Second float in float4.
     * @param z Third float in float4.
     * @param w Fourth float in float4.
     * @returns this effect.
     */
    setFloat4(uniformName: string, x: number, y: number, z: number, w: number): Effect;
    /**
     * Sets a Color3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param color3 Value to be set.
     * @returns this effect.
     */
    setColor3(uniformName: string, color3: IColor3Like): Effect;
    /**
     * Sets a Color4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param color3 Value to be set.
     * @param alpha Alpha value to be set.
     * @returns this effect.
     */
    setColor4(uniformName: string, color3: IColor3Like, alpha: number): Effect;
    /**
     * Sets a Color4 on a uniform variable
     * @param uniformName defines the name of the variable
     * @param color4 defines the value to be set
     * @returns this effect.
     */
    setDirectColor4(uniformName: string, color4: IColor4Like): Effect;
    /**
     * Release all associated resources.
     **/
    dispose(): void;
    /**
     * This function will add a new shader to the shader store
     * @param name the name of the shader
     * @param pixelShader optional pixel shader content
     * @param vertexShader optional vertex shader content
     * @param shaderLanguage the language the shader is written in (default: GLSL)
     */
    static RegisterShader(name: string, pixelShader?: string, vertexShader?: string, shaderLanguage?: ShaderLanguage): void;
    /**
     * Store of each shader (The can be looked up using effect.key)
     */
    static ShadersStore: {
        [key: string]: string;
    };
    /**
     * Store of each included file for a shader (The can be looked up using effect.key)
     */
    static IncludesShadersStore: {
        [key: string]: string;
    };
    /**
     * Resets the cache of effects.
     */
    static ResetCache(): void;
}
