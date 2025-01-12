import type { ProcessingOptions, ShaderCustomProcessingFunction, ShaderProcessingContext } from "../Engines/Processors/shaderProcessingOptions.js";
import type { Nullable } from "../types.js";
import { ShaderLanguage } from "./shaderLanguage.js";
import type { WebGLContext } from "../Engines/thinEngine.functions.js";
import type { AbstractEngine } from "../Engines/abstractEngine.js";
import type { Effect, IShaderPath } from "./effect";
import type { IPipelineContext } from "../Engines/IPipelineContext.js";
/**
 * Options to be used when creating a pipeline
 */
export interface IPipelineGenerationOptions {
    /**
     * The definition of the shader content.
     * Can be either a unified name, name per vertex and frament or the shader code content itself
     */
    shaderNameOrContent: string | IShaderPath;
    /**
     * Unique key to identify the pipeline.
     * Note that though not mandatory, it's recommended to provide a key to be able to use the automated pipeline loading system.
     */
    key?: string;
    /**
     * The list of defines to be used in the shader
     */
    defines?: string[];
    /**
     * If true, the global defines will be added to the defines array
     */
    addGlobalDefines?: boolean;
    /**
     * The shader language.
     * Defaults to the language suiting the platform name (GLSL for WEBGL2, WGSL for WEBGPU)
     */
    shaderLanguage?: ShaderLanguage;
    /**
     * The name of the platform to be used when processing the shader
     * defaults to WEBGL2
     */
    platformName?: string;
    /**
     * extend the processing options when running code processing
     */
    extendedProcessingOptions?: Partial<ProcessingOptions>;
    /**
     * extend the pipeline generation options
     */
    extendedCreatePipelineOptions?: Partial<ICreateAndPreparePipelineContextOptions>;
}
/**
 * @internal
 */
export interface ICreateAndPreparePipelineContextOptions {
    parallelShaderCompile?: {
        COMPLETION_STATUS_KHR: number;
    };
    shaderProcessingContext: Nullable<ShaderProcessingContext>;
    existingPipelineContext?: Nullable<IPipelineContext>;
    name?: string;
    rebuildRebind?: (vertexSourceCode: string, fragmentSourceCode: string, onCompiled: (pipelineContext: IPipelineContext) => void, onError: (message: string) => void) => void;
    onRenderingStateCompiled?: (pipelineContext?: IPipelineContext) => void;
    context?: WebGL2RenderingContext | WebGLRenderingContext;
    createAsRaw?: boolean;
    vertex: string;
    fragment: string;
    defines: Nullable<string>;
    transformFeedbackVaryings: Nullable<string[]>;
}
/**
 * Get a cached pipeline context
 * @param name the pipeline name
 * @param context the context to be used when creating the pipeline
 * @returns the cached pipeline context if it exists
 * @internal
 */
export declare function getCachedPipeline(name: string, context: WebGLContext): IPipelineContext | undefined;
/**
 * @internal
 */
export declare function resetCachedPipeline(pipeline: IPipelineContext): void;
/** @internal */
export declare function _processShaderCode(processorOptions: ProcessingOptions, baseName: any, processFinalCode?: Nullable<ShaderCustomProcessingFunction>, onFinalCodeReady?: (vertexCode: string, fragmentCode: string) => void, shaderLanguage?: ShaderLanguage, engine?: AbstractEngine, effectContext?: Effect): void;
/**
 * Creates and prepares a pipeline context
 * @internal
 */
export declare const createAndPreparePipelineContext: (options: ICreateAndPreparePipelineContextOptions, createPipelineContext: (shaderProcessingContext: Nullable<ShaderProcessingContext>) => IPipelineContext, _preparePipelineContext: (pipelineContext: IPipelineContext, vertexSourceCode: string, fragmentSourceCode: string, createAsRaw: boolean, rawVertexSourceCode: string, rawFragmentSourceCode: string, rebuildRebind: any, defines: Nullable<string>, transformFeedbackVaryings: Nullable<string[]>, key: string) => void) => IPipelineContext;
