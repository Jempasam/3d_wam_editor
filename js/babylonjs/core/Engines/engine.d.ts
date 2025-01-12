
import type { Nullable } from "../types";
import type { Scene } from "../scene";
import { InternalTexture } from "../Materials/Textures/internalTexture";
import type { IOfflineProvider } from "../Offline/IOfflineProvider";
import type { ILoadingScreen } from "../Loading/loadingScreen";
import type { WebGLPipelineContext } from "./WebGL/webGLPipelineContext";
import type { IPipelineContext } from "./IPipelineContext";
import type { ICustomAnimationFrameRequester } from "../Misc/customAnimationFrameRequester";
import type { EngineOptions } from "./thinEngine";
import { ThinEngine } from "./thinEngine";
import type { IViewportLike, IColor4Like } from "../Maths/math.like";
import type { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import { PerformanceMonitor } from "../Misc/performanceMonitor";
import type { DataBuffer } from "../Buffers/dataBuffer";
import type { RenderTargetWrapper } from "./renderTargetWrapper";
import "./Extensions/engine.alpha";
import "./Extensions/engine.readTexture";
import "./Extensions/engine.dynamicBuffer";
import "./AbstractEngine/abstractEngine.loadingScreen";
import "./AbstractEngine/abstractEngine.dom";
import "./AbstractEngine/abstractEngine.states";
import "./AbstractEngine/abstractEngine.renderPass";
import "./AbstractEngine/abstractEngine.texture";
import type { Material } from "../Materials/material";
import type { PostProcess } from "../PostProcesses/postProcess";
import { AbstractEngine } from "./abstractEngine";
import "../Audio/audioEngine";
/**
 * The engine class is responsible for interfacing with all lower-level APIs such as WebGL and Audio
 */
export declare class Engine extends ThinEngine {
    /** Defines that alpha blending is disabled */
    static readonly ALPHA_DISABLE = 0;
    /** Defines that alpha blending to SRC ALPHA * SRC + DEST */
    static readonly ALPHA_ADD = 1;
    /** Defines that alpha blending to SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
    static readonly ALPHA_COMBINE = 2;
    /** Defines that alpha blending to DEST - SRC * DEST */
    static readonly ALPHA_SUBTRACT = 3;
    /** Defines that alpha blending to SRC * DEST */
    static readonly ALPHA_MULTIPLY = 4;
    /** Defines that alpha blending to SRC ALPHA * SRC + (1 - SRC) * DEST */
    static readonly ALPHA_MAXIMIZED = 5;
    /** Defines that alpha blending to SRC + DEST */
    static readonly ALPHA_ONEONE = 6;
    /** Defines that alpha blending to SRC + (1 - SRC ALPHA) * DEST */
    static readonly ALPHA_PREMULTIPLIED = 7;
    /**
     * Defines that alpha blending to SRC + (1 - SRC ALPHA) * DEST
     * Alpha will be set to (1 - SRC ALPHA) * DEST ALPHA
     */
    static readonly ALPHA_PREMULTIPLIED_PORTERDUFF = 8;
    /** Defines that alpha blending to CST * SRC + (1 - CST) * DEST */
    static readonly ALPHA_INTERPOLATE = 9;
    /**
     * Defines that alpha blending to SRC + (1 - SRC) * DEST
     * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DEST ALPHA
     */
    static readonly ALPHA_SCREENMODE = 10;
    /** Defines that the resource is not delayed*/
    static readonly DELAYLOADSTATE_NONE = 0;
    /** Defines that the resource was successfully delay loaded */
    static readonly DELAYLOADSTATE_LOADED = 1;
    /** Defines that the resource is currently delay loading */
    static readonly DELAYLOADSTATE_LOADING = 2;
    /** Defines that the resource is delayed and has not started loading */
    static readonly DELAYLOADSTATE_NOTLOADED = 4;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn */
    static readonly NEVER = 512;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn */
    static readonly ALWAYS = 519;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value */
    static readonly LESS = 513;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value */
    static readonly EQUAL = 514;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value */
    static readonly LEQUAL = 515;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value */
    static readonly GREATER = 516;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value */
    static readonly GEQUAL = 518;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value */
    static readonly NOTEQUAL = 517;
    /** Passed to stencilOperation to specify that stencil value must be kept */
    static readonly KEEP = 7680;
    /** Passed to stencilOperation to specify that stencil value must be replaced */
    static readonly REPLACE = 7681;
    /** Passed to stencilOperation to specify that stencil value must be incremented */
    static readonly INCR = 7682;
    /** Passed to stencilOperation to specify that stencil value must be decremented */
    static readonly DECR = 7683;
    /** Passed to stencilOperation to specify that stencil value must be inverted */
    static readonly INVERT = 5386;
    /** Passed to stencilOperation to specify that stencil value must be incremented with wrapping */
    static readonly INCR_WRAP = 34055;
    /** Passed to stencilOperation to specify that stencil value must be decremented with wrapping */
    static readonly DECR_WRAP = 34056;
    /** Texture is not repeating outside of 0..1 UVs */
    static readonly TEXTURE_CLAMP_ADDRESSMODE = 0;
    /** Texture is repeating outside of 0..1 UVs */
    static readonly TEXTURE_WRAP_ADDRESSMODE = 1;
    /** Texture is repeating and mirrored */
    static readonly TEXTURE_MIRROR_ADDRESSMODE = 2;
    /** ALPHA */
    static readonly TEXTUREFORMAT_ALPHA = 0;
    /** LUMINANCE */
    static readonly TEXTUREFORMAT_LUMINANCE = 1;
    /** LUMINANCE_ALPHA */
    static readonly TEXTUREFORMAT_LUMINANCE_ALPHA = 2;
    /** RGB */
    static readonly TEXTUREFORMAT_RGB = 4;
    /** RGBA */
    static readonly TEXTUREFORMAT_RGBA = 5;
    /** RED */
    static readonly TEXTUREFORMAT_RED = 6;
    /** RED (2nd reference) */
    static readonly TEXTUREFORMAT_R = 6;
    /** RG */
    static readonly TEXTUREFORMAT_RG = 7;
    /** RED_INTEGER */
    static readonly TEXTUREFORMAT_RED_INTEGER = 8;
    /** RED_INTEGER (2nd reference) */
    static readonly TEXTUREFORMAT_R_INTEGER = 8;
    /** RG_INTEGER */
    static readonly TEXTUREFORMAT_RG_INTEGER = 9;
    /** RGB_INTEGER */
    static readonly TEXTUREFORMAT_RGB_INTEGER = 10;
    /** RGBA_INTEGER */
    static readonly TEXTUREFORMAT_RGBA_INTEGER = 11;
    /** UNSIGNED_BYTE */
    static readonly TEXTURETYPE_UNSIGNED_BYTE = 0;
    /** UNSIGNED_BYTE (2nd reference) */
    static readonly TEXTURETYPE_UNSIGNED_INT = 0;
    /** FLOAT */
    static readonly TEXTURETYPE_FLOAT = 1;
    /** HALF_FLOAT */
    static readonly TEXTURETYPE_HALF_FLOAT = 2;
    /** BYTE */
    static readonly TEXTURETYPE_BYTE = 3;
    /** SHORT */
    static readonly TEXTURETYPE_SHORT = 4;
    /** UNSIGNED_SHORT */
    static readonly TEXTURETYPE_UNSIGNED_SHORT = 5;
    /** INT */
    static readonly TEXTURETYPE_INT = 6;
    /** UNSIGNED_INT */
    static readonly TEXTURETYPE_UNSIGNED_INTEGER = 7;
    /** UNSIGNED_SHORT_4_4_4_4 */
    static readonly TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4 = 8;
    /** UNSIGNED_SHORT_5_5_5_1 */
    static readonly TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1 = 9;
    /** UNSIGNED_SHORT_5_6_5 */
    static readonly TEXTURETYPE_UNSIGNED_SHORT_5_6_5 = 10;
    /** UNSIGNED_INT_2_10_10_10_REV */
    static readonly TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV = 11;
    /** UNSIGNED_INT_24_8 */
    static readonly TEXTURETYPE_UNSIGNED_INT_24_8 = 12;
    /** UNSIGNED_INT_10F_11F_11F_REV */
    static readonly TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV = 13;
    /** UNSIGNED_INT_5_9_9_9_REV */
    static readonly TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV = 14;
    /** FLOAT_32_UNSIGNED_INT_24_8_REV */
    static readonly TEXTURETYPE_FLOAT_32_UNSIGNED_INT_24_8_REV = 15;
    /** nearest is mag = nearest and min = nearest and mip = none */
    static readonly TEXTURE_NEAREST_SAMPLINGMODE = 1;
    /** Bilinear is mag = linear and min = linear and mip = nearest */
    static readonly TEXTURE_BILINEAR_SAMPLINGMODE = 2;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    static readonly TEXTURE_TRILINEAR_SAMPLINGMODE = 3;
    /** nearest is mag = nearest and min = nearest and mip = linear */
    static readonly TEXTURE_NEAREST_NEAREST_MIPLINEAR = 8;
    /** Bilinear is mag = linear and min = linear and mip = nearest */
    static readonly TEXTURE_LINEAR_LINEAR_MIPNEAREST = 11;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    static readonly TEXTURE_LINEAR_LINEAR_MIPLINEAR = 3;
    /** mag = nearest and min = nearest and mip = nearest */
    static readonly TEXTURE_NEAREST_NEAREST_MIPNEAREST = 4;
    /** mag = nearest and min = linear and mip = nearest */
    static readonly TEXTURE_NEAREST_LINEAR_MIPNEAREST = 5;
    /** mag = nearest and min = linear and mip = linear */
    static readonly TEXTURE_NEAREST_LINEAR_MIPLINEAR = 6;
    /** mag = nearest and min = linear and mip = none */
    static readonly TEXTURE_NEAREST_LINEAR = 7;
    /** mag = nearest and min = nearest and mip = none */
    static readonly TEXTURE_NEAREST_NEAREST = 1;
    /** mag = linear and min = nearest and mip = nearest */
    static readonly TEXTURE_LINEAR_NEAREST_MIPNEAREST = 9;
    /** mag = linear and min = nearest and mip = linear */
    static readonly TEXTURE_LINEAR_NEAREST_MIPLINEAR = 10;
    /** mag = linear and min = linear and mip = none */
    static readonly TEXTURE_LINEAR_LINEAR = 2;
    /** mag = linear and min = nearest and mip = none */
    static readonly TEXTURE_LINEAR_NEAREST = 12;
    /** Explicit coordinates mode */
    static readonly TEXTURE_EXPLICIT_MODE = 0;
    /** Spherical coordinates mode */
    static readonly TEXTURE_SPHERICAL_MODE = 1;
    /** Planar coordinates mode */
    static readonly TEXTURE_PLANAR_MODE = 2;
    /** Cubic coordinates mode */
    static readonly TEXTURE_CUBIC_MODE = 3;
    /** Projection coordinates mode */
    static readonly TEXTURE_PROJECTION_MODE = 4;
    /** Skybox coordinates mode */
    static readonly TEXTURE_SKYBOX_MODE = 5;
    /** Inverse Cubic coordinates mode */
    static readonly TEXTURE_INVCUBIC_MODE = 6;
    /** Equirectangular coordinates mode */
    static readonly TEXTURE_EQUIRECTANGULAR_MODE = 7;
    /** Equirectangular Fixed coordinates mode */
    static readonly TEXTURE_FIXED_EQUIRECTANGULAR_MODE = 8;
    /** Equirectangular Fixed Mirrored coordinates mode */
    static readonly TEXTURE_FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
    /** Defines that texture rescaling will use a floor to find the closer power of 2 size */
    static readonly SCALEMODE_FLOOR = 1;
    /** Defines that texture rescaling will look for the nearest power of 2 size */
    static readonly SCALEMODE_NEAREST = 2;
    /** Defines that texture rescaling will use a ceil to find the closer power of 2 size */
    static readonly SCALEMODE_CEILING = 3;
    /**
     * Returns the current npm package of the sdk
     */
    static get NpmPackage(): string;
    /**
     * Returns the current version of the framework
     */
    static get Version(): string;
    /** Gets the list of created engines */
    static get Instances(): AbstractEngine[];
    /**
     * Gets the latest created engine
     */
    static get LastCreatedEngine(): Nullable<AbstractEngine>;
    /**
     * Gets the latest created scene
     */
    static get LastCreatedScene(): Nullable<Scene>;
    /** @internal */
    /**
     * Will flag all materials in all scenes in all engines as dirty to trigger new shader compilation
     * @param flag defines which part of the materials must be marked as dirty
     * @param predicate defines a predicate used to filter which materials should be affected
     */
    static MarkAllMaterialsAsDirty(flag: number, predicate?: (mat: Material) => boolean): void;
    /**
     * Method called to create the default loading screen.
     * This can be overridden in your own app.
     * @param canvas The rendering canvas element
     * @returns The loading screen
     */
    static DefaultLoadingScreenFactory(canvas: HTMLCanvasElement): ILoadingScreen;
    /**
     * If set, will be used to request the next animation frame for the render loop
     */
    customAnimationFrameRequester: Nullable<ICustomAnimationFrameRequester>;
    private _rescalePostProcess;
    protected get _supportsHardwareTextureRescaling(): boolean;
    private _measureFps;
    private _performanceMonitor;
    /**
     * Gets the performance monitor attached to this engine
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#engineinstrumentation
     */
    get performanceMonitor(): PerformanceMonitor;
    /**
     * Creates a new engine
     * @param canvasOrContext defines the canvas or WebGL context to use for rendering. If you provide a WebGL context, Babylon.js will not hook events on the canvas (like pointers, keyboards, etc...) so no event observables will be available. This is mostly used when Babylon.js is used as a plugin on a system which already used the WebGL context
     * @param antialias defines enable antialiasing (default: false)
     * @param options defines further options to be sent to the getContext() function
     * @param adaptToDeviceRatio defines whether to adapt to the device's viewport characteristics (default: false)
     */
    constructor(canvasOrContext: Nullable<HTMLCanvasElement | OffscreenCanvas | WebGLRenderingContext | WebGL2RenderingContext>, antialias?: boolean, options?: EngineOptions, adaptToDeviceRatio?: boolean);
    protected _initGLContext(): void;
    /**
     * Shared initialization across engines types.
     * @param canvas The canvas associated with this instance of the engine.
     */
    protected _sharedInit(canvas: HTMLCanvasElement): void;
    /**
     * Resize an image and returns the image data as an uint8array
     * @param image image to resize
     * @param bufferWidth destination buffer width
     * @param bufferHeight destination buffer height
     * @returns an uint8array containing RGBA values of bufferWidth * bufferHeight size
     */
    resizeImageBitmap(image: HTMLImageElement | ImageBitmap, bufferWidth: number, bufferHeight: number): Uint8Array;
    /**
     * Engine abstraction for loading and creating an image bitmap from a given source string.
     * @param imageSource source to load the image from.
     * @param options An object that sets options for the image's extraction.
     * @returns ImageBitmap
     */
    _createImageBitmapFromSource(imageSource: string, options?: ImageBitmapOptions): Promise<ImageBitmap>;
    /**
     * Toggle full screen mode
     * @param requestPointerLock defines if a pointer lock should be requested from the user
     */
    switchFullscreen(requestPointerLock: boolean): void;
    /**
     * Enters full screen mode
     * @param requestPointerLock defines if a pointer lock should be requested from the user
     */
    enterFullscreen(requestPointerLock: boolean): void;
    /**
     * Exits full screen mode
     */
    exitFullscreen(): void;
    generateMipMapsForCubemap(texture: InternalTexture, unbind?: boolean): void;
    /** States */
    /**
     * Sets a boolean indicating if the dithering state is enabled or disabled
     * @param value defines the dithering state
     */
    setDitheringState(value: boolean): void;
    /**
     * Sets a boolean indicating if the rasterizer state is enabled or disabled
     * @param value defines the rasterizer state
     */
    setRasterizerState(value: boolean): void;
    /**
     * Directly set the WebGL Viewport
     * @param x defines the x coordinate of the viewport (in screen space)
     * @param y defines the y coordinate of the viewport (in screen space)
     * @param width defines the width of the viewport (in screen space)
     * @param height defines the height of the viewport (in screen space)
     * @returns the current viewport Object (if any) that is being replaced by this call. You can restore this viewport later on to go back to the original state
     */
    setDirectViewport(x: number, y: number, width: number, height: number): Nullable<IViewportLike>;
    /**
     * Executes a scissor clear (ie. a clear on a specific portion of the screen)
     * @param x defines the x-coordinate of the bottom left corner of the clear rectangle
     * @param y defines the y-coordinate of the corner of the clear rectangle
     * @param width defines the width of the clear rectangle
     * @param height defines the height of the clear rectangle
     * @param clearColor defines the clear color
     */
    scissorClear(x: number, y: number, width: number, height: number, clearColor: IColor4Like): void;
    /**
     * Enable scissor test on a specific rectangle (ie. render will only be executed on a specific portion of the screen)
     * @param x defines the x-coordinate of the bottom left corner of the clear rectangle
     * @param y defines the y-coordinate of the corner of the clear rectangle
     * @param width defines the width of the clear rectangle
     * @param height defines the height of the clear rectangle
     */
    enableScissor(x: number, y: number, width: number, height: number): void;
    /**
     * Disable previously set scissor test rectangle
     */
    disableScissor(): void;
    /**
     * @internal
     */
    _loadFileAsync(url: string, offlineProvider?: IOfflineProvider, useArrayBuffer?: false): Promise<string>;
    _loadFileAsync(url: string, offlineProvider?: IOfflineProvider, useArrayBuffer?: true): Promise<ArrayBuffer>;
    /**
     * Gets the source code of the vertex shader associated with a specific webGL program
     * @param program defines the program to use
     * @returns a string containing the source code of the vertex shader associated with the program
     */
    getVertexShaderSource(program: WebGLProgram): Nullable<string>;
    /**
     * Gets the source code of the fragment shader associated with a specific webGL program
     * @param program defines the program to use
     * @returns a string containing the source code of the fragment shader associated with the program
     */
    getFragmentShaderSource(program: WebGLProgram): Nullable<string>;
    /**
     * Sets a depth stencil texture from a render target to the according uniform.
     * @param channel The texture channel
     * @param uniform The uniform to set
     * @param texture The render target texture containing the depth stencil texture to apply
     * @param name The texture name
     */
    setDepthStencilTexture(channel: number, uniform: Nullable<WebGLUniformLocation>, texture: Nullable<RenderTargetTexture>, name?: string): void;
    /**
     * Sets a texture to the context from a postprocess
     * @param channel defines the channel to use
     * @param postProcess defines the source postprocess
     * @param name name of the channel
     */
    setTextureFromPostProcess(channel: number, postProcess: Nullable<PostProcess>, name: string): void;
    /**
     * Binds the output of the passed in post process to the texture channel specified
     * @param channel The channel the texture should be bound to
     * @param postProcess The post process which's output should be bound
     * @param name name of the channel
     */
    setTextureFromPostProcessOutput(channel: number, postProcess: Nullable<PostProcess>, name: string): void;
    /**
     * sets the object from which width and height will be taken from when getting render width and height
     * Will fallback to the gl object
     * @param dimensions the framebuffer width and height that will be used.
     */
    set framebufferDimensionsObject(dimensions: Nullable<{
        framebufferWidth: number;
        framebufferHeight: number;
    }>);
    protected _rebuildBuffers(): void;
    /**
     * Get Font size information
     * @param font font name
     * @returns an object containing ascent, height and descent
     */
    getFontOffset(font: string): {
        ascent: number;
        height: number;
        descent: number;
    };
    /** @internal */
    _renderFrame(): void;
    protected _cancelFrame(): void;
    _renderLoop(): void;
    /** @internal */
    _renderViews(): boolean;
    /**
     * Enters Pointerlock mode
     */
    enterPointerlock(): void;
    /**
     * Exits Pointerlock mode
     */
    exitPointerlock(): void;
    /**
     * Begin a new frame
     */
    beginFrame(): void;
    _deletePipelineContext(pipelineContext: IPipelineContext): void;
    createShaderProgram(pipelineContext: IPipelineContext, vertexCode: string, fragmentCode: string, defines: Nullable<string>, context?: WebGLRenderingContext, transformFeedbackVaryings?: Nullable<string[]>): WebGLProgram;
    protected _createShaderProgram(pipelineContext: WebGLPipelineContext, vertexShader: WebGLShader, fragmentShader: WebGLShader, context: WebGLRenderingContext, transformFeedbackVaryings?: Nullable<string[]>): WebGLProgram;
    /**
     * @internal
     */
    _releaseTexture(texture: InternalTexture): void;
    /**
     * @internal
     */
    _releaseRenderTargetWrapper(rtWrapper: RenderTargetWrapper): void;
    /**
     * @internal
     * Rescales a texture
     * @param source input texture
     * @param destination destination texture
     * @param scene scene to use to render the resize
     * @param internalFormat format to use when resizing
     * @param onComplete callback to be called when resize has completed
     */
    _rescaleTexture(source: InternalTexture, destination: InternalTexture, scene: Nullable<any>, internalFormat: number, onComplete: () => void): void;
    /**
     * Wraps an external web gl texture in a Babylon texture.
     * @param texture defines the external texture
     * @param hasMipMaps defines whether the external texture has mip maps (default: false)
     * @param samplingMode defines the sampling mode for the external texture (default: Constants.TEXTURE_TRILINEAR_SAMPLINGMODE)
     * @param width defines the width for the external texture (default: 0)
     * @param height defines the height for the external texture (default: 0)
     * @returns the babylon internal texture
     */
    wrapWebGLTexture(texture: WebGLTexture, hasMipMaps?: boolean, samplingMode?: number, width?: number, height?: number): InternalTexture;
    /**
     * @internal
     */
    _uploadImageToTexture(texture: InternalTexture, image: HTMLImageElement | ImageBitmap, faceIndex?: number, lod?: number): void;
    /**
     * Updates a depth texture Comparison Mode and Function.
     * If the comparison Function is equal to 0, the mode will be set to none.
     * Otherwise, this only works in webgl 2 and requires a shadow sampler in the shader.
     * @param texture The texture to set the comparison function for
     * @param comparisonFunction The comparison function to set, 0 if no comparison required
     */
    updateTextureComparisonFunction(texture: InternalTexture, comparisonFunction: number): void;
    /**
     * Creates a webGL buffer to use with instantiation
     * @param capacity defines the size of the buffer
     * @returns the webGL buffer
     */
    createInstancesBuffer(capacity: number): DataBuffer;
    /**
     * Delete a webGL buffer used with instantiation
     * @param buffer defines the webGL buffer to delete
     */
    deleteInstancesBuffer(buffer: WebGLBuffer): void;
    private _clientWaitAsync;
    /**
     * @internal
     */
    _readPixelsAsync(x: number, y: number, w: number, h: number, format: number, type: number, outputBuffer: ArrayBufferView): Promise<ArrayBufferView> | null;
    dispose(): void;
}

// Mixins
declare global{
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
// Mixins
interface Window {
    mozIndexedDB: IDBFactory;
    webkitIndexedDB: IDBFactory;
    msIndexedDB: IDBFactory;
    webkitURL: typeof URL;
    mozRequestAnimationFrame(callback: FrameRequestCallback): number;
    oRequestAnimationFrame(callback: FrameRequestCallback): number;
    WebGLRenderingContext: WebGLRenderingContext;
    CANNON: any;
    AudioContext: AudioContext;
    webkitAudioContext: AudioContext;
    PointerEvent: any;
    Math: Math;
    Uint8Array: Uint8ArrayConstructor;
    Float32Array: Float32ArrayConstructor;
    mozURL: typeof URL;
    msURL: typeof URL;
    DracoDecoderModule: any;
    setImmediate(handler: (...args: any[]) => void): number;
}

interface WorkerGlobalScope {
    importScripts: (...args: string[]) => void;
}

type WorkerSelf = WindowOrWorkerGlobalScope & WorkerGlobalScope;

interface HTMLCanvasElement {
    requestPointerLock(): void;
    msRequestPointerLock?(): void;
    mozRequestPointerLock?(): void;
    webkitRequestPointerLock?(): void;

    /** Track whether a record is in progress */
    isRecording: boolean;
    /** Capture Stream method defined by some browsers */
    captureStream(fps?: number): MediaStream;
}

interface CanvasRenderingContext2D {
    msImageSmoothingEnabled: boolean;
}

// Babylon Extension to enable UIEvents to work with our IUIEvents
interface UIEvent {
    inputIndex: number;
}

interface MouseEvent {
    mozMovementX: number;
    mozMovementY: number;
    webkitMovementX: number;
    webkitMovementY: number;
    msMovementX: number;
    msMovementY: number;
}

interface Navigator {
    mozGetVRDevices: (any: any) => any;
    webkitGetUserMedia(constraints: MediaStreamConstraints, successCallback: any, errorCallback: any): void;
    mozGetUserMedia(constraints: MediaStreamConstraints, successCallback: any, errorCallback: any): void;
    msGetUserMedia(constraints: MediaStreamConstraints, successCallback: any, errorCallback: any): void;

    webkitGetGamepads(): Gamepad[];
    msGetGamepads(): Gamepad[];
    webkitGamepads(): Gamepad[];
}

interface HTMLVideoElement {
    mozSrcObject: any;
}

interface Math {
    fround(x: number): number;
    imul(a: number, b: number): number;
    log2(x: number): number;
}

interface OffscreenCanvas extends EventTarget {
    width: number;
    height: number;
}

var OffscreenCanvas: {
    prototype: OffscreenCanvas;
    new (width: number, height: number): OffscreenCanvas;
};

// Experimental Pressure API https://wicg.github.io/compute-pressure/
type PressureSource = "cpu";

type PressureState = "nominal" | "fair" | "serious" | "critical";

type PressureFactor = "thermal" | "power-supply";

interface PressureRecord {
    source: PressureSource;
    state: PressureState;
    factors: ReadonlyArray<PressureFactor>;
    time: number;
}

interface PressureObserver {
    observe(source: PressureSource): void;
    unobserve(source: PressureSource): void;
    disconnect(): void;
    takeRecords(): Array<PressureRecord>;
}

interface PressureObserverOptions {
    sampleRate?: number;
}

type PressureUpdateCallback = (changes: Array<PressureRecord>, observer: PressureObserver) => void;

const PressureObserver: {
    prototype: PressureObserver;
    new (callback: PressureUpdateCallback, options?: PressureObserverOptions): PressureObserver;

    supportedSources: ReadonlyArray<PressureSource>;
};

/**
 * TODO: remove this file when we upgrade to TypeScript 5.0
 */

/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
interface OffscreenCanvasEventMap {
    contextlost: Event;
    contextrestored: Event;
}

interface OffscreenCanvas extends EventTarget {
    /**
     * These attributes return the dimensions of the OffscreenCanvas object's bitmap.
     *
     * They can be set, to replace the bitmap with a new, transparent black bitmap of the specified dimensions (effectively resizing it).
     */
    height: number;
    oncontextlost: ((this: OffscreenCanvas, ev: Event) => any) | null;
    oncontextrestored: ((this: OffscreenCanvas, ev: Event) => any) | null;
    /**
     * These attributes return the dimensions of the OffscreenCanvas object's bitmap.
     *
     * They can be set, to replace the bitmap with a new, transparent black bitmap of the specified dimensions (effectively resizing it).
     */
    width: number;
    /**
     * Returns a promise that will fulfill with a new Blob object representing a file containing the image in the OffscreenCanvas object.
     *
     * The argument, if provided, is a dictionary that controls the encoding options of the image file to be created. The type field specifies the file format and has a default value of "image/png"; that type is also used if the requested type isn't supported. If the image format supports variable quality (such as "image/jpeg"), then the quality field is a number in the range 0.0 to 1.0 inclusive indicating the desired quality level for the resulting image.
     */
    convertToBlob(options?: ImageEncodeOptions): Promise<Blob>;
    /**
     * Returns an object that exposes an API for drawing on the OffscreenCanvas object. contextId specifies the desired API: "2d", "bitmaprenderer", "webgl", or "webgl2". options is handled by that API.
     *
     * This specification defines the "2d" context below, which is similar but distinct from the "2d" context that is created from a canvas element. The WebGL specifications define the "webgl" and "webgl2" contexts. [WEBGL]
     *
     * Returns null if the canvas has already been initialized with another context type (e.g., trying to get a "2d" context after getting a "webgl" context).
     */
    getContext(contextId: "2d", options?: any): OffscreenCanvasRenderingContext2D | null;
    getContext(contextId: "bitmaprenderer", options?: any): ImageBitmapRenderingContext | null;
    getContext(contextId: "webgl", options?: any): WebGLRenderingContext | null;
    getContext(contextId: "webgl2", options?: any): WebGL2RenderingContext | null;
    getContext(contextId: OffscreenRenderingContextId, options?: any): OffscreenRenderingContext | null;
    /** Returns a newly created ImageBitmap object with the image in the OffscreenCanvas object. The image in the OffscreenCanvas object is replaced with a new blank image. */
    transferToImageBitmap(): ImageBitmap;
    addEventListener<K extends keyof OffscreenCanvasEventMap>(
        type: K,
        listener: (this: OffscreenCanvas, ev: OffscreenCanvasEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof OffscreenCanvasEventMap>(
        type: K,
        listener: (this: OffscreenCanvas, ev: OffscreenCanvasEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

var OffscreenCanvas: {
    prototype: OffscreenCanvas;
    new (width: number, height: number): OffscreenCanvas;
};

interface OffscreenCanvasRenderingContext2D
    extends CanvasCompositing,
        CanvasDrawImage,
        CanvasDrawPath,
        CanvasFillStrokeStyles,
        CanvasFilters,
        CanvasImageData,
        CanvasImageSmoothing,
        CanvasPath,
        CanvasPathDrawingStyles,
        CanvasRect,
        CanvasShadowStyles,
        CanvasState,
        CanvasText,
        CanvasTextDrawingStyles,
        CanvasTransform {
    readonly canvas: OffscreenCanvas;
    commit(): void;
}

var OffscreenCanvasRenderingContext2D: {
    prototype: OffscreenCanvasRenderingContext2D;
    new (): OffscreenCanvasRenderingContext2D;
};

/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
// Type definitions for WebGL 2 extended with Babylon specific types

interface WebGL2RenderingContext extends WebGL2RenderingContextBase {
    HALF_FLOAT_OES: number;
    RGBA16F: typeof WebGL2RenderingContext.RGBA16F;
    RGBA32F: typeof WebGL2RenderingContext.RGBA32F;
    DEPTH24_STENCIL8: typeof WebGL2RenderingContext.DEPTH24_STENCIL8;
    COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR: number;
    COMPRESSED_SRGB_S3TC_DXT1_EXT: number;
    COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: number;
    COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: number;
    COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT: number;
    COMPRESSED_SRGB8_ETC2: number;
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: number;
    DRAW_FRAMEBUFFER: typeof WebGL2RenderingContext.DRAW_FRAMEBUFFER;
    UNSIGNED_INT_24_8: typeof WebGL2RenderingContext.UNSIGNED_INT_24_8;
    MIN: typeof WebGL2RenderingContext.MIN;
    MAX: typeof WebGL2RenderingContext.MAX;
}

interface EXT_disjoint_timer_query {
    QUERY_COUNTER_BITS_EXT: number;
    TIME_ELAPSED_EXT: number;
    TIMESTAMP_EXT: number;
    GPU_DISJOINT_EXT: number;
    QUERY_RESULT_EXT: number;
    QUERY_RESULT_AVAILABLE_EXT: number;
    queryCounterEXT(query: WebGLQuery, target: number): void;
    createQueryEXT(): WebGLQuery;
    beginQueryEXT(target: number, query: WebGLQuery): void;
    endQueryEXT(target: number): void;
    getQueryObjectEXT(query: WebGLQuery, target: number): any;
    deleteQueryEXT(query: WebGLQuery): void;
}

interface WebGLProgram {
    __SPECTOR_rebuildProgram?:
        | ((vertexSourceCode: string, fragmentSourceCode: string, onCompiled: (program: WebGLProgram) => void, onError: (message: string) => void) => void)
        | null;
}

interface WebGLUniformLocation {
    _currentState: any;
}

/* eslint-disable babylonjs/available */
/* eslint-disable @typescript-eslint/naming-convention */
interface GPUObjectBase {
    label: string | undefined;
}

interface GPUObjectDescriptorBase {
    label?: string;
}

interface GPUSupportedLimits {
    [name: string]: number;

    readonly maxTextureDimension1D: number;
    readonly maxTextureDimension2D: number;
    readonly maxTextureDimension3D: number;
    readonly maxTextureArrayLayers: number;
    readonly maxBindGroups: number;
    readonly maxBindGroupsPlusVertexBuffers: number;
    readonly maxBindingsPerBindGroup: number;
    readonly maxDynamicUniformBuffersPerPipelineLayout: number;
    readonly maxDynamicStorageBuffersPerPipelineLayout: number;
    readonly maxSampledTexturesPerShaderStage: number;
    readonly maxSamplersPerShaderStage: number;
    readonly maxStorageBuffersPerShaderStage: number;
    readonly maxStorageTexturesPerShaderStage: number;
    readonly maxUniformBuffersPerShaderStage: number;
    readonly maxUniformBufferBindingSize: number;
    readonly maxStorageBufferBindingSize: number;
    readonly minUniformBufferOffsetAlignment: number;
    readonly minStorageBufferOffsetAlignment: number;
    readonly maxVertexBuffers: number;
    readonly maxBufferSize: number;
    readonly maxVertexAttributes: number;
    readonly maxVertexBufferArrayStride: number;
    readonly maxInterStageShaderComponents: number;
    readonly maxInterStageShaderVariables: number;
    readonly maxColorAttachments: number;
    readonly maxColorAttachmentBytesPerSample: number;
    readonly maxComputeWorkgroupStorageSize: number;
    readonly maxComputeInvocationsPerWorkgroup: number;
    readonly maxComputeWorkgroupSizeX: number;
    readonly maxComputeWorkgroupSizeY: number;
    readonly maxComputeWorkgroupSizeZ: number;
    readonly maxComputeWorkgroupsPerDimension: number;
}

type GPUSupportedFeatures = ReadonlySet<string>;

type WGSLLanguageFeatures = ReadonlySet<string>;

interface GPUAdapterInfo {
    readonly vendor: string;
    readonly architecture: string;
    readonly device: string;
    readonly description: string;
}

interface Navigator {
    readonly gpu: GPU | undefined;
}

interface WorkerNavigator {
    readonly gpu: GPU | undefined;
}

class GPU {
    requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | undefined>;
    getPreferredCanvasFormat(): GPUTextureFormat;

    readonly wgslLanguageFeatures: WGSLLanguageFeatures;
}

interface GPURequestAdapterOptions {
    powerPreference?: GPUPowerPreference;
    forceFallbackAdapter?: boolean /* default=false */;
}

type GPUPowerPreference = "low-power" | "high-performance";

class GPUAdapter {
    // https://michalzalecki.com/nominal-typing-in-typescript/#approach-1-class-with-a-private-property
    readonly name: string;
    readonly features: GPUSupportedFeatures;
    readonly limits: GPUSupportedLimits;
    readonly isFallbackAdapter: boolean;

    requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
    requestAdapterInfo(unmaskHints?: string[]): Promise<GPUAdapterInfo>;
}

interface GPUDeviceDescriptor extends GPUObjectDescriptorBase {
    requiredFeatures?: GPUFeatureName[] /* default=[] */;
    requiredLimits?: { [name: string]: GPUSize64 } /* default={} */;
    defaultQueue?: GPUQueueDescriptor /* default={} */;
}

type GPUFeatureName =
    | "depth-clip-control"
    | "depth32float-stencil8"
    | "texture-compression-bc"
    | "texture-compression-etc2"
    | "texture-compression-astc"
    | "timestamp-query"
    | "indirect-first-instance"
    | "shader-f16"
    | "rg11b10ufloat-renderable"
    | "bgra8unorm-storage"
    | "float32-filterable";

class GPUDevice extends EventTarget implements GPUObjectBase {
    label: string | undefined;

    readonly features: GPUSupportedFeatures;
    readonly limits: GPUSupportedLimits;

    readonly queue: GPUQueue;

    destroy(): void;

    createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
    createTexture(descriptor: GPUTextureDescriptor): GPUTexture;
    createSampler(descriptor?: GPUSamplerDescriptor): GPUSampler;
    importExternalTexture(descriptor: GPUExternalTextureDescriptor): GPUExternalTexture;

    createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout;
    createPipelineLayout(descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout;
    createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup;

    createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule;

    createComputePipeline(descriptor: GPUComputePipelineDescriptor): GPUComputePipeline;
    createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline;
    createComputePipelineAsync(descriptor: GPUComputePipelineDescriptor): Promise<GPUComputePipeline>;
    createRenderPipelineAsync(descriptor: GPURenderPipelineDescriptor): Promise<GPURenderPipeline>;

    createCommandEncoder(descriptor?: GPUCommandEncoderDescriptor): GPUCommandEncoder;
    createRenderBundleEncoder(descriptor: GPURenderBundleEncoderDescriptor): GPURenderBundleEncoder;

    createQuerySet(descriptor: GPUQuerySetDescriptor): GPUQuerySet;

    readonly lost: Promise<GPUDeviceLostInfo>;
    pushErrorScope(filter: GPUErrorFilter): void;
    popErrorScope(): Promise<GPUError | undefined>;
    onuncapturederror: Event | undefined;
}

class GPUBuffer implements GPUObjectBase {
    label: string | undefined;

    readonly size: GPUSize64Out;
    readonly usage: GPUFlagsConstant;
    readonly mapState: GPUBufferMapState;

    mapAsync(mode: GPUMapModeFlags, offset?: GPUSize64 /*default=0*/, size?: GPUSize64): Promise<void>;
    getMappedRange(offset?: GPUSize64 /*default=0*/, size?: GPUSize64): ArrayBuffer;
    unmap(): void;

    destroy(): void;
}

type GPUBufferMapState = "unmapped" | "pending" | "mapped";

interface GPUBufferDescriptor extends GPUObjectDescriptorBase {
    size: GPUSize64;
    usage: GPUBufferUsageFlags;
    mappedAtCreation: boolean /* default=false */;
}

type GPUBufferUsageFlags = number;

type GPUMapModeFlags = number;

class GPUTexture implements GPUObjectBase {
    label: string | undefined;

    createView(descriptor?: GPUTextureViewDescriptor): GPUTextureView;
    destroy(): void;

    readonly width: GPUIntegerCoordinateOut;
    readonly height: GPUIntegerCoordinateOut;
    readonly depthOrArrayLayers: GPUIntegerCoordinateOut;
    readonly mipLevelCount: GPUIntegerCoordinateOut;
    readonly sampleCount: GPUSize32Out;
    readonly dimension: GPUTextureDimension;
    readonly format: GPUTextureFormat;
    readonly usage: GPUFlagsConstant;
}

interface GPUTextureDescriptor extends GPUObjectDescriptorBase {
    size: GPUExtent3D;
    mipLevelCount?: GPUIntegerCoordinate /* default=1 */;
    sampleCount?: GPUSize32 /* default=1 */;
    dimension?: GPUTextureDimension /* default="2d" */;
    format: GPUTextureFormat;
    usage: GPUTextureUsageFlags;
    viewFormats?: GPUTextureFormat[] /* default=[] */;
}

type GPUTextureDimension = "1d" | "2d" | "3d";

type GPUTextureUsageFlags = number;

class GPUTextureView implements GPUObjectBase {
    label: string | undefined;
}

interface GPUTextureViewDescriptor extends GPUObjectDescriptorBase {
    format: GPUTextureFormat;
    dimension: GPUTextureViewDimension;
    aspect?: GPUTextureAspect /* default="all" */;
    baseMipLevel?: GPUIntegerCoordinate /* default=0 */;
    mipLevelCount: GPUIntegerCoordinate;
    baseArrayLayer?: GPUIntegerCoordinate /* default=0*/;
    arrayLayerCount: GPUIntegerCoordinate;
}

type GPUTextureViewDimension = "1d" | "2d" | "2d-array" | "cube" | "cube-array" | "3d";

type GPUTextureAspect = "all" | "stencil-only" | "depth-only";

type GPUTextureFormat =
    // 8-bit formats
    | "r8unorm"
    | "r8snorm"
    | "r8uint"
    | "r8sint"

    // 16-bit formats
    | "r16uint"
    | "r16sint"
    | "r16float"
    | "rg8unorm"
    | "rg8snorm"
    | "rg8uint"
    | "rg8sint"

    // 32-bit formats
    | "r32uint"
    | "r32sint"
    | "r32float"
    | "rg16uint"
    | "rg16sint"
    | "rg16float"
    | "rgba8unorm"
    | "rgba8unorm-srgb"
    | "rgba8snorm"
    | "rgba8uint"
    | "rgba8sint"
    | "bgra8unorm"
    | "bgra8unorm-srgb"
    // Packed 32-bit formats
    | "rgb9e5ufloat"
    | "rgb10a2uint"
    | "rgb10a2unorm"
    | "rg11b10ufloat"

    // 64-bit formats
    | "rg32uint"
    | "rg32sint"
    | "rg32float"
    | "rgba16uint"
    | "rgba16sint"
    | "rgba16float"

    // 128-bit formats
    | "rgba32uint"
    | "rgba32sint"
    | "rgba32float"

    // Depth and stencil formats
    | "stencil8"
    | "depth16unorm"
    | "depth24plus"
    | "depth24plus-stencil8"
    | "depth32float"

    // "depth32float-stencil8" feature
    | "depth32float-stencil8"

    // BC compressed formats usable if "texture-compression-bc" is both
    // supported by the device/user agent and enabled in requestDevice.
    | "bc1-rgba-unorm"
    | "bc1-rgba-unorm-srgb"
    | "bc2-rgba-unorm"
    | "bc2-rgba-unorm-srgb"
    | "bc3-rgba-unorm"
    | "bc3-rgba-unorm-srgb"
    | "bc4-r-unorm"
    | "bc4-r-snorm"
    | "bc5-rg-unorm"
    | "bc5-rg-snorm"
    | "bc6h-rgb-ufloat"
    | "bc6h-rgb-float"
    | "bc7-rgba-unorm"
    | "bc7-rgba-unorm-srgb"

    // ETC2 compressed formats usable if "texture-compression-etc2" is both
    // supported by the device/user agent and enabled in requestDevice.
    | "etc2-rgb8unorm"
    | "etc2-rgb8unorm-srgb"
    | "etc2-rgb8a1unorm"
    | "etc2-rgb8a1unorm-srgb"
    | "etc2-rgba8unorm"
    | "etc2-rgba8unorm-srgb"
    | "eac-r11unorm"
    | "eac-r11snorm"
    | "eac-rg11unorm"
    | "eac-rg11snorm"

    // ASTC compressed formats usable if "texture-compression-astc" is both
    // supported by the device/user agent and enabled in requestDevice.
    | "astc-4x4-unorm"
    | "astc-4x4-unorm-srgb"
    | "astc-5x4-unorm"
    | "astc-5x4-unorm-srgb"
    | "astc-5x5-unorm"
    | "astc-5x5-unorm-srgb"
    | "astc-6x5-unorm"
    | "astc-6x5-unorm-srgb"
    | "astc-6x6-unorm"
    | "astc-6x6-unorm-srgb"
    | "astc-8x5-unorm"
    | "astc-8x5-unorm-srgb"
    | "astc-8x6-unorm"
    | "astc-8x6-unorm-srgb"
    | "astc-8x8-unorm"
    | "astc-8x8-unorm-srgb"
    | "astc-10x5-unorm"
    | "astc-10x5-unorm-srgb"
    | "astc-10x6-unorm"
    | "astc-10x6-unorm-srgb"
    | "astc-10x8-unorm"
    | "astc-10x8-unorm-srgb"
    | "astc-10x10-unorm"
    | "astc-10x10-unorm-srgb"
    | "astc-12x10-unorm"
    | "astc-12x10-unorm-srgb"
    | "astc-12x12-unorm"
    | "astc-12x12-unorm-srgb";

class GPUExternalTexture implements GPUObjectBase {
    label: string | undefined;
}

interface GPUExternalTextureDescriptor extends GPUObjectDescriptorBase {
    source: HTMLVideoElement | VideoFrame;
    colorSpace?: PredefinedColorSpace /* default="srgb" */;
}

class GPUSampler implements GPUObjectBase {
    label: string | undefined;
}

interface GPUSamplerDescriptor extends GPUObjectDescriptorBase {
    addressModeU?: GPUAddressMode /* default="clamp-to-edge" */;
    addressModeV?: GPUAddressMode /* default="clamp-to-edge" */;
    addressModeW?: GPUAddressMode /* default="clamp-to-edge" */;
    magFilter?: GPUFilterMode /* default="nearest" */;
    minFilter?: GPUFilterMode /* default="nearest" */;
    mipmapFilter?: GPUMipmapFilterMode /* default="nearest" */;
    lodMinClamp?: number /* default=0 */;
    lodMaxClamp?: number /* default=32 */;
    compare?: GPUCompareFunction;
    maxAnisotropy?: number /* default=1 */;
}

type GPUAddressMode = "clamp-to-edge" | "repeat" | "mirror-repeat";

type GPUFilterMode = "nearest" | "linear";

type GPUMipmapFilterMode = "nearest" | "linear";

type GPUCompareFunction = "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always";

class GPUBindGroupLayout implements GPUObjectBase {
    label: string | undefined;
}

interface GPUBindGroupLayoutDescriptor extends GPUObjectDescriptorBase {
    entries: GPUBindGroupLayoutEntry[];
}

interface GPUBindGroupLayoutEntry {
    binding: GPUIndex32;
    visibility: GPUShaderStageFlags;

    buffer?: GPUBufferBindingLayout;
    sampler?: GPUSamplerBindingLayout;
    texture?: GPUTextureBindingLayout;
    storageTexture?: GPUStorageTextureBindingLayout;
    externalTexture?: GPUExternalTextureBindingLayout;
}

type GPUShaderStageFlags = number;

type GPUBufferBindingType = "uniform" | "storage" | "read-only-storage";

interface GPUBufferBindingLayout {
    type?: GPUBufferBindingType /* default="uniform" */;
    hasDynamicOffset?: boolean /* default=false */;
    minBindingSize?: GPUSize64 /* default=0 */;
}

type GPUSamplerBindingType = "filtering" | "non-filtering" | "comparison";

interface GPUSamplerBindingLayout {
    type?: GPUSamplerBindingType /* default="filtering" */;
}

type GPUTextureSampleType = "float" | "unfilterable-float" | "depth" | "sint" | "uint";

interface GPUTextureBindingLayout {
    sampleType?: GPUTextureSampleType /* default="float" */;
    viewDimension?: GPUTextureViewDimension /* default="2d" */;
    multisampled?: boolean /* default=false */;
}

type GPUStorageTextureAccess = "write-only" | "read-only" | "read-write";

interface GPUStorageTextureBindingLayout {
    access?: GPUStorageTextureAccess /* default=write-only */;
    format: GPUTextureFormat;
    viewDimension?: GPUTextureViewDimension /* default="2d" */;
}

interface GPUExternalTextureBindingLayout {}

class GPUBindGroup implements GPUObjectBase {
    label: string | undefined;
}

interface GPUBindGroupDescriptor extends GPUObjectDescriptorBase {
    layout: GPUBindGroupLayout;
    entries: GPUBindGroupEntry[];
}

type GPUBindingResource = GPUSampler | GPUTextureView | GPUBufferBinding | GPUExternalTexture;

interface GPUBindGroupEntry {
    binding: GPUIndex32;
    resource: GPUBindingResource;
}

interface GPUBufferBinding {
    buffer: GPUBuffer;
    offset?: GPUSize64 /* default=0 */;
    size?: GPUSize64 /* default=size_of_buffer - offset */;
}

class GPUPipelineLayout implements GPUObjectBase {
    label: string | undefined;
}

interface GPUPipelineLayoutDescriptor extends GPUObjectDescriptorBase {
    bindGroupLayouts: GPUBindGroupLayout[];
}

class GPUShaderModule implements GPUObjectBase {
    label: string | undefined;

    getCompilationInfo(): Promise<GPUCompilationInfo>;
}

interface GPUShaderModuleDescriptor extends GPUObjectDescriptorBase {
    code: string | Uint32Array;
    sourceMap?: object;
    compilationHints?: GPUShaderModuleCompilationHint[] /* default=[] */;
}

interface GPUShaderModuleCompilationHint {
    entryPoint: string | Uint32Array;
    layout: GPUPipelineLayout | GPUAutoLayoutMode;
}

type GPUCompilationMessageType = "error" | "warning" | "info";

interface GPUCompilationMessage {
    readonly message: string;
    readonly type: GPUCompilationMessageType;
    readonly lineNum: number;
    readonly linePos: number;
    readonly offset: number;
    readonly length: number;
}

interface GPUCompilationInfo {
    readonly messages: readonly GPUCompilationMessage[];
}

class GPUPipelineError extends DOMException {
    constructor(message: string | undefined, options: GPUPipelineErrorInit);
    readonly reason: GPUPipelineErrorReason;
}

interface GPUPipelineErrorInit {
    reason: GPUPipelineErrorReason;
}

type GPUPipelineErrorReason = "validation" | "internal";

type GPUAutoLayoutMode = "auto";

interface GPUPipelineDescriptorBase extends GPUObjectDescriptorBase {
    layout: GPUPipelineLayout | GPUAutoLayoutMode;
}

interface GPUPipelineBase {
    getBindGroupLayout(index: number): GPUBindGroupLayout;
}

interface GPUProgrammableStage {
    module: GPUShaderModule;
    entryPoint: string | Uint32Array;
    constants?: { [name: string]: GPUPipelineConstantValue };
}

type GPUPipelineConstantValue = number; // May represent WGSL’s bool, f32, i32, u32, and f16 if enabled.

class GPUComputePipeline implements GPUObjectBase, GPUPipelineBase {
    label: string | undefined;

    getBindGroupLayout(index: number): GPUBindGroupLayout;
}

interface GPUComputePipelineDescriptor extends GPUPipelineDescriptorBase {
    compute: GPUProgrammableStage;
}

class GPURenderPipeline implements GPUObjectBase, GPUPipelineBase {
    label: string | undefined;

    getBindGroupLayout(index: number): GPUBindGroupLayout;
}

interface GPURenderPipelineDescriptor extends GPUPipelineDescriptorBase {
    vertex: GPUVertexState;
    primitive?: GPUPrimitiveState /* default={} */;
    depthStencil?: GPUDepthStencilState;
    multisample?: GPUMultisampleState /* default={} */;
    fragment?: GPUFragmentState;
}

interface GPUPrimitiveState {
    topology?: GPUPrimitiveTopology /* default="triangle-list" */;
    stripIndexFormat?: GPUIndexFormat;
    frontFace?: GPUFrontFace /* default="ccw" */;
    cullMode?: GPUCullMode /* default="none" */;

    // Requires "depth-clip-control" feature.
    unclippedDepth?: boolean /* default=false */;
}

type GPUPrimitiveTopology = "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";

type GPUFrontFace = "ccw" | "cw";

type GPUCullMode = "none" | "front" | "back";

interface GPUMultisampleState {
    count?: GPUSize32 /* default=1 */;
    mask?: GPUSampleMask /* default=0xFFFFFFFF */;
    alphaToCoverageEnabled?: boolean /* default=false */;
}

interface GPUFragmentState extends GPUProgrammableStage {
    targets: (GPUColorTargetState | null)[];
}

interface GPUColorTargetState {
    format: GPUTextureFormat;

    blend?: GPUBlendState;
    writeMask?: GPUColorWriteFlags /* default=0xF - GPUColorWrite.ALL */;
}

interface GPUBlendState {
    color: GPUBlendComponent;
    alpha: GPUBlendComponent;
}

type GPUColorWriteFlags = number;

interface GPUBlendComponent {
    operation?: GPUBlendOperation /* default="add" */;
    srcFactor?: GPUBlendFactor /* default="one" */;
    dstFactor?: GPUBlendFactor /* default="zero" */;
}

type GPUBlendFactor =
    | "zero"
    | "one"
    | "src"
    | "one-minus-src"
    | "src-alpha"
    | "one-minus-src-alpha"
    | "dst"
    | "one-minus-dst"
    | "dst-alpha"
    | "one-minus-dst-alpha"
    | "src-alpha-saturated"
    | "constant"
    | "one-minus-constant";

type GPUBlendOperation = "add" | "subtract" | "reverse-subtract" | "min" | "max";

interface GPUDepthStencilState {
    format: GPUTextureFormat;

    depthWriteEnabled?: boolean /* default=false */;
    depthCompare?: GPUCompareFunction /* default="always" */;

    stencilFront?: GPUStencilFaceState /* default={} */;
    stencilBack?: GPUStencilFaceState /* default={} */;

    stencilReadMask?: GPUStencilValue /* default=0xFFFFFFFF */;
    stencilWriteMask?: GPUStencilValue /* default=0xFFFFFFFF */;

    depthBias?: GPUDepthBias /* default=0 */;
    depthBiasSlopeScale?: number /* default= 0 */;
    depthBiasClamp?: number /* default=0 */;
}

interface GPUStencilFaceState {
    compare?: GPUCompareFunction /* default="always" */;
    failOp?: GPUStencilOperation /* default="keep" */;
    depthFailOp?: GPUStencilOperation /* default="keep" */;
    passOp?: GPUStencilOperation /* default="keep" */;
}

type GPUStencilOperation = "keep" | "zero" | "replace" | "invert" | "increment-clamp" | "decrement-clamp" | "increment-wrap" | "decrement-wrap";

type GPUIndexFormat = "uint16" | "uint32";

type GPUVertexFormat =
    | "uint8x2"
    | "uint8x4"
    | "sint8x2"
    | "sint8x4"
    | "unorm8x2"
    | "unorm8x4"
    | "snorm8x2"
    | "snorm8x4"
    | "uint16x2"
    | "uint16x4"
    | "sint16x2"
    | "sint16x4"
    | "unorm16x2"
    | "unorm16x4"
    | "snorm16x2"
    | "snorm16x4"
    | "float16x2"
    | "float16x4"
    | "float32"
    | "float32x2"
    | "float32x3"
    | "float32x4"
    | "uint32"
    | "uint32x2"
    | "uint32x3"
    | "uint32x4"
    | "sint32"
    | "sint32x2"
    | "sint32x3"
    | "sint32x4"
    | "unorm10-10-10-2";

type GPUVertexStepMode = "vertex" | "instance";

interface GPUVertexState extends GPUProgrammableStage {
    buffers?: GPUVertexBufferLayout[] /* default=[] */;
}

interface GPUVertexBufferLayout {
    arrayStride: GPUSize64;
    stepMode?: GPUVertexStepMode /* default="vertex" */;
    attributes: GPUVertexAttribute[];
}

interface GPUVertexAttribute {
    format: GPUVertexFormat;
    offset: GPUSize64;
    shaderLocation: GPUIndex32;
}

interface GPUImageDataLayout {
    offset?: GPUSize64 /* default=0 */;
    bytesPerRow: GPUSize32;
    rowsPerImage?: GPUSize32;
}

interface GPUImageCopyBuffer extends GPUImageDataLayout {
    buffer: GPUBuffer;
}

interface GPUImageCopyTexture {
    texture: GPUTexture;
    mipLevel?: GPUIntegerCoordinate /* default=0 */;
    origin?: GPUOrigin3D /* default={} */;
    aspect?: GPUTextureAspect /* default="all" */;
}

interface GPUImageCopyTextureTagged extends GPUImageCopyTexture {
    colorSpace?: PredefinedColorSpace /* default="srgb" */;
    premultipliedAlpha?: boolean /* default=false */;
}

type GPUImageCopyExternalImageSource = ImageBitmap | ImageData | HTMLImageElement | HTMLVideoElement | VideoFrame | HTMLCanvasElement | OffscreenCanvas;

interface GPUImageCopyExternalImage {
    source: GPUImageCopyExternalImageSource;
    origin?: GPUOrigin2D /* default={} */;
    flipY?: boolean /* default=false */;
}

class GPUCommandBuffer implements GPUObjectBase {
    label: string | undefined;
}

interface GPUCommandBufferDescriptor extends GPUObjectDescriptorBase {}

interface GPUCommandsMixin {}

class GPUCommandEncoder implements GPUObjectBase, GPUCommandsMixin, GPUDebugCommandsMixin {
    label: string | undefined;

    beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder;
    beginComputePass(descriptor?: GPUComputePassDescriptor): GPUComputePassEncoder;

    copyBufferToBuffer(source: GPUBuffer, sourceOffset: GPUSize64, destination: GPUBuffer, destinationOffset: GPUSize64, size: GPUSize64): void;
    copyBufferToTexture(source: GPUImageCopyBuffer, destination: GPUImageCopyTexture, copySize: GPUExtent3D): void;
    copyTextureToBuffer(source: GPUImageCopyTexture, destination: GPUImageCopyBuffer, copySize: GPUExtent3D): void;
    copyTextureToTexture(source: GPUImageCopyTexture, destination: GPUImageCopyTexture, copySize: GPUExtent3D): void;
    clearBuffer(buffer: GPUBuffer, offset?: GPUSize64 /* default=0 */, size?: GPUSize64): void;

    writeTimestamp?(querySet: GPUQuerySet, queryIndex: GPUSize32): void; // not in the spec anymore, but may come back later, so keep it here for now

    resolveQuerySet(querySet: GPUQuerySet, firstQuery: GPUSize32, queryCount: GPUSize32, destination: GPUBuffer, destinationOffset: GPUSize64): void;

    finish(descriptor?: GPUCommandBufferDescriptor): GPUCommandBuffer;

    pushDebugGroup(groupLabel: string): void;
    popDebugGroup(): void;
    insertDebugMarker(markerLabel: string): void;
}

interface GPUCommandEncoderDescriptor extends GPUObjectDescriptorBase {}

interface GPUBindingCommandsMixin {
    setBindGroup(index: GPUIndex32, bindGroup: GPUBindGroup, dynamicOffsets?: GPUBufferDynamicOffset[]): void;
    setBindGroup(index: GPUIndex32, bindGroup: GPUBindGroup, dynamicOffsetData: Uint32Array, dynamicOffsetsDataStart: GPUSize64, dynamicOffsetsDataLength: GPUSize32): void;
}

interface GPUDebugCommandsMixin {
    pushDebugGroup(groupLabel: string): void;
    popDebugGroup(): void;
    insertDebugMarker(markerLabel: string): void;
}

class GPUComputePassEncoder implements GPUObjectBase, GPUCommandsMixin, GPUDebugCommandsMixin, GPUBindingCommandsMixin {
    label: string | undefined;

    setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: GPUBufferDynamicOffset[]): void;
    setBindGroup(index: GPUIndex32, bindGroup: GPUBindGroup, dynamicOffsetData: Uint32Array, dynamicOffsetsDataStart: GPUSize64, dynamicOffsetsDataLength: GPUSize32): void;

    pushDebugGroup(groupLabel: string): void;
    popDebugGroup(): void;
    insertDebugMarker(markerLabel: string): void;

    setPipeline(pipeline: GPUComputePipeline): void;
    dispatchWorkgroups(workgroupCountX: GPUSize32, workgroupCountY?: GPUSize32 /* default=1 */, workgroupCountZ?: GPUSize32 /* default=1 */): void;
    dispatchWorkgroupsIndirect(indirectBuffer: GPUBuffer, indirectOffset: GPUSize64): void;

    end(): void;
}

interface GPUComputePassTimestampWrites {
    querySet: GPUQuerySet;
    beginningOfPassWriteIndex: GPUSize32;
    endOfPassWriteIndex: GPUSize32;
}

interface GPUComputePassDescriptor extends GPUObjectDescriptorBase {
    timestampWrites?: GPUComputePassTimestampWrites;
}

class GPURenderPassEncoder implements GPUObjectBase, GPUCommandsMixin, GPUDebugCommandsMixin, GPUBindingCommandsMixin, GPURenderCommandsMixin {
    label: string | undefined;

    setBindGroup(index: GPUIndex32, bindGroup: GPUBindGroup, dynamicOffsets?: GPUBufferDynamicOffset[]): void;
    setBindGroup(index: GPUIndex32, bindGroup: GPUBindGroup, dynamicOffsetData: Uint32Array, dynamicOffsetsDataStart: GPUSize64, dynamicOffsetsDataLength: GPUSize32): void;

    pushDebugGroup(groupLabel: string): void;
    popDebugGroup(): void;
    insertDebugMarker(markerLabel: string): void;

    setPipeline(pipeline: GPURenderPipeline): void;

    setIndexBuffer(buffer: GPUBuffer, indexFormat: GPUIndexFormat, offset?: GPUSize64 /* default=0 */, size?: GPUSize64 /* default=0 */): void;
    setVertexBuffer(slot: GPUIndex32, buffer: GPUBuffer, offset?: GPUSize64 /* default=0 */, size?: GPUSize64 /* default=0 */): void;

    draw(vertexCount: GPUSize32, instanceCount?: GPUSize32 /* default=1 */, firstVertex?: GPUSize32 /* default=0 */, firstInstance?: GPUSize32 /* default=0 */): void;
    drawIndexed(
        indexCount: GPUSize32,
        instanceCount?: GPUSize32 /* default=1 */,
        firstIndex?: GPUSize32 /* default=0 */,
        baseVertex?: GPUSignedOffset32 /* default=0 */,
        firstInstance?: GPUSize32 /* default=0 */
    ): void;

    drawIndirect(indirectBuffer: GPUBuffer, indirectOffset: GPUSize64): void;
    drawIndexedIndirect(indirectBuffer: GPUBuffer, indirectOffset: GPUSize64): void;

    setViewport(x: number, y: number, width: number, height: number, minDepth: number, maxDepth: number): void;

    setScissorRect(x: GPUIntegerCoordinate, y: GPUIntegerCoordinate, width: GPUIntegerCoordinate, height: GPUIntegerCoordinate): void;

    setBlendConstant(color: GPUColor): void;
    setStencilReference(reference: GPUStencilValue): void;

    beginOcclusionQuery(queryIndex: GPUSize32): void;
    endOcclusionQuery(): void;

    executeBundles(bundles: GPURenderBundle[]): void;
    end(): void;
}

interface GPURenderPassTimestampWrites {
    querySet: GPUQuerySet;
    beginningOfPassWriteIndex: GPUSize32;
    endOfPassWriteIndex: GPUSize32;
}

interface GPURenderPassDescriptor extends GPUObjectDescriptorBase {
    colorAttachments: (GPURenderPassColorAttachment | null)[];
    depthStencilAttachment?: GPURenderPassDepthStencilAttachment;
    occlusionQuerySet?: GPUQuerySet;
    timestampWrites?: GPURenderPassTimestampWrites;
    maxDrawCount?: GPUSize64 /* default=50000000 */;
}

interface GPURenderPassColorAttachment {
    view: GPUTextureView;
    depthSlice?: GPUIntegerCoordinate;
    resolveTarget?: GPUTextureView;

    clearValue?: GPUColor;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;
}

interface GPURenderPassDepthStencilAttachment {
    view: GPUTextureView;

    depthClearValue?: number /* default=0 */;
    depthLoadOp: GPULoadOp;
    depthStoreOp: GPUStoreOp;
    depthReadOnly?: boolean /* default=false */;

    stencilClearValue?: GPUStencilValue /* default=0 */;
    stencilLoadOp?: GPULoadOp;
    stencilStoreOp?: GPUStoreOp;
    stencilReadOnly?: boolean /* default=false */;
}

type GPULoadOp = "load" | "clear";

type GPUStoreOp = "store" | "discard";

interface GPURenderPassLayout extends GPUObjectDescriptorBase {
    colorFormats: (GPUTextureFormat | null)[];
    depthStencilFormat?: GPUTextureFormat;
    sampleCount?: GPUSize32 /* default=1 */;
}

interface GPURenderCommandsMixin {
    setPipeline(pipeline: GPURenderPipeline): void;

    setIndexBuffer(buffer: GPUBuffer, indexFormat: GPUIndexFormat, offset?: GPUSize64 /* default=0 */, size?: GPUSize64 /* default=0 */): void;
    setVertexBuffer(slot: GPUIndex32, buffer: GPUBuffer, offset?: GPUSize64 /* default=0 */, size?: GPUSize64): void;

    draw(vertexCount: GPUSize32, instanceCount?: GPUSize32 /* default=1 */, firstVertex?: GPUSize32 /* default=0 */, firstInstance?: GPUSize32 /* default=0 */): void;
    drawIndexed(
        indexCount: GPUSize32,
        instanceCount?: GPUSize32 /* default=1 */,
        firstIndex?: GPUSize32 /* default=0 */,
        baseVertex?: GPUSignedOffset32 /* default=0 */,
        firstInstance?: GPUSize32 /* default=0 */
    ): void;

    drawIndirect(indirectBuffer: GPUBuffer, indirectOffset: GPUSize64): void;
    drawIndexedIndirect(indirectBuffer: GPUBuffer, indirectOffset: GPUSize64): void;
}

class GPURenderBundle implements GPUObjectBase {
    label: string | undefined;
}

interface GPURenderBundleDescriptor extends GPUObjectDescriptorBase {}

class GPURenderBundleEncoder implements GPUObjectBase, GPUCommandsMixin, GPUDebugCommandsMixin, GPUBindingCommandsMixin, GPURenderCommandsMixin {
    label: string | undefined;

    setBindGroup(index: GPUIndex32, bindGroup: GPUBindGroup, dynamicOffsets?: GPUBufferDynamicOffset[]): void;
    setBindGroup(index: GPUIndex32, bindGroup: GPUBindGroup, dynamicOffsetData: Uint32Array, dynamicOffsetsDataStart: GPUSize64, dynamicOffsetsDataLength: GPUSize32): void;

    pushDebugGroup(groupLabel: string): void;
    popDebugGroup(): void;
    insertDebugMarker(markerLabel: string): void;

    setPipeline(pipeline: GPURenderPipeline): void;

    setIndexBuffer(buffer: GPUBuffer, indexFormat: GPUIndexFormat, offset?: GPUSize64 /* default=0 */, size?: GPUSize64 /* default=0 */): void;
    setVertexBuffer(slot: GPUIndex32, buffer: GPUBuffer, offset?: GPUSize64 /* default=0 */, size?: GPUSize64 /* default=0 */): void;

    draw(vertexCount: GPUSize32, instanceCount?: GPUSize32 /* default=1 */, firstVertex?: GPUSize32 /* default=0 */, firstInstance?: GPUSize32 /* default=0 */): void;
    drawIndexed(
        indexCount: GPUSize32,
        instanceCount?: GPUSize32 /* default=1 */,
        firstIndex?: GPUSize32 /* default=0 */,
        baseVertex?: GPUSignedOffset32 /* default=0 */,
        firstInstance?: GPUSize32 /* default=0 */
    ): void;

    drawIndirect(indirectBuffer: GPUBuffer, indirectOffset: GPUSize64): void;
    drawIndexedIndirect(indirectBuffer: GPUBuffer, indirectOffset: GPUSize64): void;

    finish(descriptor?: GPURenderBundleDescriptor): GPURenderBundle;
}

interface GPURenderBundleEncoderDescriptor extends GPURenderPassLayout {
    depthReadOnly?: boolean /* default=false */;
    stencilReadOnly?: boolean /* default=false */;
}

interface GPUQueueDescriptor extends GPUObjectDescriptorBase {}

class GPUQueue implements GPUObjectBase {
    label: string | undefined;

    submit(commandBuffers: GPUCommandBuffer[]): void;

    onSubmittedWorkDone(): Promise<void>;

    writeBuffer(buffer: GPUBuffer, bufferOffset: GPUSize64, data: BufferSource, dataOffset?: GPUSize64 /* default=0 */, size?: GPUSize64): void;

    writeTexture(destination: GPUImageCopyTexture, data: BufferSource, dataLayout: GPUImageDataLayout, size: GPUExtent3D): void;

    copyExternalImageToTexture(source: GPUImageCopyExternalImage, destination: GPUImageCopyTextureTagged, copySize: GPUExtent3D): void;
}

class GPUQuerySet implements GPUObjectBase {
    label: string | undefined;

    destroy(): void;

    readonly type: GPUQueryType;
    readonly count: GPUSize32Out;
}

interface GPUQuerySetDescriptor extends GPUObjectDescriptorBase {
    type: GPUQueryType;
    count: GPUSize32;
}

type GPUQueryType = "occlusion" | "timestamp";

class GPUCanvasContext {
    readonly canvas: HTMLCanvasElement | OffscreenCanvas;

    configure(configuration?: GPUCanvasConfiguration): void;
    unconfigure(): void;

    getCurrentTexture(): GPUTexture;
}

type GPUCanvasAlphaMode = "opaque" | "premultiplied";

interface GPUCanvasConfiguration extends GPUObjectDescriptorBase {
    device: GPUDevice;
    format: GPUTextureFormat;
    usage?: GPUTextureUsageFlags /* default=0x10 - GPUTextureUsage.RENDER_ATTACHMENT */;
    viewFormats?: GPUTextureFormat[] /* default=[] */;
    colorSpace?: PredefinedColorSpace /* default="srgb" */;
    alphaMode?: GPUCanvasAlphaMode /* default="opaque" */;
}

type GPUDeviceLostReason = "unknown" | "destroyed";

class GPUDeviceLostInfo {
    readonly reason?: GPUDeviceLostReason;
    readonly message: string;
}

class GPUError {
    readonly message: string;
}

class GPUValidationError extends GPUError {
    constructor(message: string);
    readonly message: string;
}

class GPUOutOfMemoryError extends GPUError {
    constructor(message: string);
    readonly message: string;
}

class GPUInternalError extends GPUError {
    constructor(message: string);
    readonly message: string;
}

type GPUErrorFilter = "validation" | "out-of-memory" | "internal";

class GPUUncapturedErrorEvent extends Event {
    constructor(type: string, gpuUncapturedErrorEventInitDict: GPUUncapturedErrorEventInit);
    readonly error: GPUError;
}

interface GPUUncapturedErrorEventInit extends EventInit {
    error: GPUError;
}

type GPUBufferDynamicOffset = number; /* unsigned long */
type GPUStencilValue = number; /* unsigned long */
type GPUSampleMask = number; /* unsigned long */
type GPUDepthBias = number; /* long */

type GPUSize64 = number; /* unsigned long long */
type GPUIntegerCoordinate = number; /* unsigned long */
type GPUIndex32 = number; /* unsigned long */
type GPUSize32 = number; /* unsigned long */
type GPUSignedOffset32 = number; /* long */

type GPUSize64Out = number; /* unsigned long long */
type GPUIntegerCoordinateOut = number; /* unsigned long */
type GPUSize32Out = number; /* unsigned long */

type GPUFlagsConstant = number; /* unsigned long */

interface GPUColorDict {
    r: number;
    g: number;
    b: number;
    a: number;
}
type GPUColor = [number, number, number, number] | GPUColorDict;

interface GPUOrigin2DDict {
    x?: GPUIntegerCoordinate /* default=0 */;
    y?: GPUIntegerCoordinate /* default=0 */;
}
type GPUOrigin2D = [GPUIntegerCoordinate, GPUIntegerCoordinate] | GPUOrigin2DDict;

interface GPUOrigin3DDict {
    x?: GPUIntegerCoordinate /* default=0 */;
    y?: GPUIntegerCoordinate /* default=0 */;
    z?: GPUIntegerCoordinate /* default=0 */;
}
type GPUOrigin3D = [GPUIntegerCoordinate, GPUIntegerCoordinate, GPUIntegerCoordinate] | GPUOrigin3DDict;

interface GPUExtent3DDict {
    width: GPUIntegerCoordinate;
    height?: GPUIntegerCoordinate /* default=1 */;
    depthOrArrayLayers?: GPUIntegerCoordinate /* default=1 */;
}
type GPUExtent3D = [GPUIntegerCoordinate, GPUIntegerCoordinate, GPUIntegerCoordinate] | GPUExtent3DDict;

/* eslint-disable @typescript-eslint/naming-convention */
// Type definitions for non-npm package webxr 0.5
// Project: https://www.w3.org/TR/webxr/
// Definitions by: Rob Rohan <https://github.com/robrohan>
//                 Raanan Weber <https://github.com/RaananW>
//                 Sean T. McBeth <https://github.com/capnmidnight>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 3.7

// Most of this was hand written and... more or less copied from the following
// sites:
//  https://www.w3.org/TR/webxr/
//  https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API
//  https://www.w3.org/immersive-web/
//  https://github.com/immersive-web
//

/**
 * ref: https://immersive-web.github.io/webxr/#navigator-xr-attribute
 */
interface Navigator {
    /**
     * An XRSystem object is the entry point to the API, used to query for XR features
     * available to the user agent and initiate communication with XR hardware via the
     * creation of XRSessions.
     */
    xr?: XRSystem | undefined;
}

/**
 * WebGL Context Compatability
 *
 * ref: https://immersive-web.github.io/webxr/#contextcompatibility
 */
interface WebGLContextAttributes {
    xrCompatible?: boolean | undefined;
}

interface WebGLRenderingContextBase {
    makeXRCompatible(): Promise<void>;
}

/**
 * Available session modes
 *
 * ref: https://immersive-web.github.io/webxr/#xrsessionmode-enum
 */
type XRSessionMode = "inline" | "immersive-vr" | "immersive-ar";

/**
 * Reference space types
 */
type XRReferenceSpaceType = "viewer" | "local" | "local-floor" | "bounded-floor" | "unbounded";

type XREnvironmentBlendMode = "opaque" | "additive" | "alpha-blend";

/**
 * ref: https://immersive-web.github.io/webxr/#xrsession-interface
 */
type XRVisibilityState = "visible" | "visible-blurred" | "hidden";

/**
 * Handedness types
 */
type XRHandedness = "none" | "left" | "right";

/**
 * InputSource target ray modes
 */
type XRTargetRayMode = "gaze" | "tracked-pointer" | "screen" | "transient-pointer";

/**
 * Eye types
 */
type XREye = "none" | "left" | "right";

type XRFrameRequestCallback = (time: DOMHighResTimeStamp, frame: XRFrame) => void;

interface XRSystemDeviceChangeEvent extends Event {
    type: "devicechange";
}

interface XRSystemDeviceChangeEventHandler {
    (event: XRSystemDeviceChangeEvent): any;
}

interface XRSystemEventMap {
    devicechange: XRSystemDeviceChangeEvent;
}

/**
 * An XRSystem object is the entry point to the API, used to query for XR features available
 * to the user agent and initiate communication with XR hardware via the creation of
 * XRSessions.
 *
 * ref: https://immersive-web.github.io/webxr/#xrsystem-interface
 */
interface XRSystem extends EventTarget {
    /**
     * Attempts to initialize an XRSession for the given mode if possible, entering immersive
     * mode if necessary.
     * @param mode
     * @param options
     */
    requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession>;

    /**
     * Queries if a given mode may be supported by the user agent and device capabilities.
     * @param mode
     */
    isSessionSupported(mode: XRSessionMode): Promise<boolean>;

    ondevicechange: XRSystemDeviceChangeEventHandler | null;

    addEventListener<K extends keyof XRSystemEventMap>(type: K, listener: (this: XRSystem, ev: XRSystemEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XRSystemEventMap>(type: K, listener: (this: XRSystem, ev: XRSystemEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

abstract class XRSystem implements XRSystem {}

/**
 * Describes a viewport, or rectangular region, of a graphics surface.
 *
 * ref: https://immersive-web.github.io/webxr/#xrviewport-interface
 */
interface XRViewport {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

abstract class XRViewport implements XRViewport {}

/**
 * Represents a virtual coordinate system with an origin that corresponds to a physical location.
 * Spatial data that is requested from the API or given to the API is always expressed in relation
 * to a specific XRSpace at the time of a specific XRFrame. Numeric values such as pose positions
 * are coordinates in that space relative to its origin. The interface is intentionally opaque.
 *
 * ref: https://immersive-web.github.io/webxr/#xrspace-interface
 */
// tslint:disable-next-line no-empty-interface
interface XRSpace extends EventTarget {}

abstract class XRSpace implements XRSpace {}

interface XRRenderStateInit {
    baseLayer?: XRWebGLLayer | undefined;
    depthFar?: number | undefined;
    depthNear?: number | undefined;
    inlineVerticalFieldOfView?: number | undefined;
}

interface XRRenderState {
    readonly baseLayer?: XRWebGLLayer | undefined;
    readonly depthFar: number;
    readonly depthNear: number;
    readonly inlineVerticalFieldOfView?: number | undefined;
}

abstract class XRRenderState implements XRRenderState {}

interface XRReferenceSpaceEventInit extends EventInit {
    referenceSpace?: XRReferenceSpace | undefined;
    transform?: XRRigidTransform | undefined;
}

/**
 * XRReferenceSpaceEvents are fired to indicate changes to the state of an XRReferenceSpace.
 *
 * ref: https://immersive-web.github.io/webxr/#xrreferencespaceevent-interface
 */
interface XRReferenceSpaceEvent extends Event {
    readonly type: "reset";
    readonly referenceSpace: XRReferenceSpace;
    readonly transform?: XRRigidTransform | undefined;
}

// tslint:disable-next-line no-unnecessary-class
class XRReferenceSpaceEvent implements XRReferenceSpaceEvent {
    constructor(type: "reset", eventInitDict?: XRReferenceSpaceEventInit);
}

interface XRReferenceSpaceEventHandler {
    (event: XRReferenceSpaceEvent): any;
}

interface XRReferenceSpaceEventMap {
    reset: XRReferenceSpaceEvent;
}

/**
 * One of several common XRSpaces that applications can use to establish a spatial relationship
 * with the user's physical environment.
 *
 * ref: https://immersive-web.github.io/webxr/#xrreferencespace-interface
 */
interface XRReferenceSpace extends XRSpace {
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
    onreset: XRReferenceSpaceEventHandler;

    addEventListener<K extends keyof XRReferenceSpaceEventMap>(
        type: K,
        listener: (this: XRReferenceSpace, ev: XRReferenceSpaceEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XRReferenceSpaceEventMap>(
        type: K,
        listener: (this: XRReferenceSpace, ev: XRReferenceSpaceEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

abstract class XRReferenceSpace implements XRReferenceSpace {}

/**
 * Extends XRReferenceSpace to include boundsGeometry, indicating the pre-configured boundaries
 * of the user's space.
 *
 * ref: https://immersive-web.github.io/webxr/#xrboundedreferencespace-interface
 */
interface XRBoundedReferenceSpace extends XRReferenceSpace {
    readonly boundsGeometry: DOMPointReadOnly[];
}

abstract class XRBoundedReferenceSpace implements XRBoundedReferenceSpace {}

/**
 * Represents an XR input source, which is any input mechanism which allows the user to perform
 * targeted actions in the same virtual space as the viewer. Example XR input sources include,
 * but are not limited to, handheld controllers, optically tracked hands, and gaze-based input
 * methods that operate on the viewer's pose. Input mechanisms which are not explicitly associated
 * with the XR device, such as traditional gamepads, mice, or keyboards SHOULD NOT be considered
 * XR input sources.
 * ref: https://immersive-web.github.io/webxr/#xrinputsource-interface
 */
interface XRInputSource {
    readonly handedness: XRHandedness;
    readonly targetRayMode: XRTargetRayMode;
    readonly targetRaySpace: XRSpace;
    readonly gripSpace?: XRSpace | undefined;
    readonly gamepad?: Gamepad | undefined;
    readonly profiles: string[];
    readonly hand?: XRHand;
}

abstract class XRInputSource implements XRInputSource {}

/**
 * Represents a list of XRInputSources. It is used in favor of a frozen array type when the contents
 * of the list are expected to change over time, such as with the XRSession inputSources attribute.
 * ref: https://immersive-web.github.io/webxr/#xrinputsourcearray-interface
 */
interface XRInputSourceArray {
    [Symbol.iterator](): IterableIterator<XRInputSource>;
    [n: number]: XRInputSource;

    length: number;

    entries(): IterableIterator<[number, XRInputSource]>;
    keys(): IterableIterator<number>;
    values(): IterableIterator<XRInputSource>;

    forEach(callbackfn: (value: XRInputSource, index: number, array: XRInputSource[]) => void, thisArg?: any): void;
}

abstract class XRInputSourceArray implements XRInputSourceArray {}

/**
 * Describes a position and orientation in space relative to an XRSpace.
 *
 * ref: https://immersive-web.github.io/webxr/#xrpose-interface
 */
interface XRPose {
    readonly transform: XRRigidTransform;
    readonly emulatedPosition: boolean;
}

abstract class XRPose implements XRPose {}

/**
 * Represents a snapshot of the state of all of the tracked objects for an XRSession. Applications
 * can acquire an XRFrame by calling requestAnimationFrame() on an XRSession with an
 * XRFrameRequestCallback. When the callback is called it will be passed an XRFrame.
 * Events which need to communicate tracking state, such as the select event, will also provide an
 * XRFrame.
 *
 * ref: https://immersive-web.github.io/webxr/#xrframe-interface
 */
interface XRFrame {
    readonly session: XRSession;
    // BABYLON CHANGE - switched to optional
    readonly predictedDisplayTime?: DOMHighResTimeStamp;

    /**
     * Provides the pose of space relative to baseSpace as an XRPose, at the time represented by
     * the XRFrame.
     *
     * @param space
     * @param baseSpace
     */
    getPose(space: XRSpace, baseSpace: XRSpace): XRPose | undefined;

    /**
     * Provides the pose of the viewer relative to referenceSpace as an XRViewerPose, at the
     * XRFrame's time.
     *
     * @param referenceSpace
     */
    getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | undefined;
}

abstract class XRFrame implements XRFrame {}

/**
 * Type of XR events available
 */
type XRInputSourceEventType = "select" | "selectend" | "selectstart" | "squeeze" | "squeezeend" | "squeezestart";

interface XRInputSourceEventInit extends EventInit {
    frame?: XRFrame | undefined;
    inputSource?: XRInputSource | undefined;
}

/**
 * XRInputSourceEvents are fired to indicate changes to the state of an XRInputSource.
 * ref: https://immersive-web.github.io/webxr/#xrinputsourceevent-interface
 */
class XRInputSourceEvent extends Event {
    readonly type: XRInputSourceEventType;
    readonly frame: XRFrame;
    readonly inputSource: XRInputSource;

    constructor(type: XRInputSourceEventType, eventInitDict?: XRInputSourceEventInit);
}

interface XRInputSourceEventHandler {
    (evt: XRInputSourceEvent): any;
}

type XRSessionEventType = "end" | "visibilitychange" | "frameratechange";

interface XRSessionEventInit extends EventInit {
    session: XRSession;
}

/**
 * XRSessionEvents are fired to indicate changes to the state of an XRSession.
 * ref: https://immersive-web.github.io/webxr/#xrsessionevent-interface
 */
class XRSessionEvent extends Event {
    readonly session: XRSession;
    constructor(type: XRSessionEventType, eventInitDict?: XRSessionEventInit);
}

interface XRSessionEventHandler {
    (evt: XRSessionEvent): any;
}

/**
 * ref: https://immersive-web.github.io/webxr/#feature-dependencies
 */
interface XRSessionInit {
    optionalFeatures?: string[] | undefined;
    requiredFeatures?: string[] | undefined;
}

interface XRSessionEventMap {
    inputsourceschange: XRInputSourceChangeEvent;
    end: XRSessionEvent;
    visibilitychange: XRSessionEvent;
    frameratechange: XRSessionEvent;
    select: XRInputSourceEvent;
    selectstart: XRInputSourceEvent;
    selectend: XRInputSourceEvent;
    squeeze: XRInputSourceEvent;
    squeezestart: XRInputSourceEvent;
    squeezeend: XRInputSourceEvent;
    eyetrackingstart: XREyeTrackingSourceEvent;
    eyetrackingend: XREyeTrackingSourceEvent;
}

/**
 * Any interaction with XR hardware is done via an XRSession object, which can only be
 * retrieved by calling requestSession() on the XRSystem object. Once a session has been
 * successfully acquired, it can be used to poll the viewer pose, query information about
 * the user's environment, and present imagery to the user.
 *
 * ref: https://immersive-web.github.io/webxr/#xrsession-interface
 */
interface XRSession extends EventTarget {
    /**
     * Returns a list of this session's XRInputSources, each representing an input device
     * used to control the camera and/or scene.
     */
    readonly inputSources: XRInputSourceArray;
    /**
     * object which contains options affecting how the imagery is rendered.
     * This includes things such as the near and far clipping planes
     */
    readonly renderState: XRRenderState;
    readonly environmentBlendMode: XREnvironmentBlendMode;
    readonly visibilityState: XRVisibilityState;
    readonly frameRate?: number | undefined;
    readonly supportedFrameRates?: Float32Array | undefined;

    /**
     * Removes a callback from the animation frame painting callback from
     * XRSession's set of animation frame rendering callbacks, given the
     * identifying handle returned by a previous call to requestAnimationFrame().
     */
    cancelAnimationFrame(id: number): void;

    /**
     * Ends the WebXR session. Returns a promise which resolves when the
     * session has been shut down.
     */
    end(): Promise<void>;

    /**
     * Schedules the specified method to be called the next time the user agent
     * is working on rendering an animation frame for the WebXR device. Returns an
     * integer value which can be used to identify the request for the purposes of
     * canceling the callback using cancelAnimationFrame(). This method is comparable
     * to the Window.requestAnimationFrame() method.
     */
    requestAnimationFrame(callback: XRFrameRequestCallback): number;

    /**
     * Requests that a new XRReferenceSpace of the specified type be created.
     * Returns a promise which resolves with the XRReferenceSpace or
     * XRBoundedReferenceSpace which was requested, or throws a NotSupportedError if
     * the requested space type isn't supported by the device.
     */
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace | XRBoundedReferenceSpace>;

    updateRenderState(renderStateInit?: XRRenderStateInit): Promise<void>;

    updateTargetFrameRate(rate: number): Promise<void>;

    onend: XRSessionEventHandler;
    oninputsourceschange: XRInputSourceChangeEventHandler;
    onselect: XRInputSourceEventHandler;
    onselectstart: XRInputSourceEventHandler;
    onselectend: XRInputSourceEventHandler;
    onsqueeze: XRInputSourceEventHandler;
    onsqueezestart: XRInputSourceEventHandler;
    onsqueezeend: XRInputSourceEventHandler;
    onvisibilitychange: XRSessionEventHandler;
    onframeratechange: XRSessionEventHandler;

    addEventListener<K extends keyof XRSessionEventMap>(type: K, listener: (this: XRSession, ev: XRSessionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XRSessionEventMap>(type: K, listener: (this: XRSession, ev: XRSessionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

abstract class XRSession implements XRSession {}

/**
 * An XRPose describing the state of a viewer of the XR scene as tracked by the XR
 * device. A viewer may represent a tracked piece of hardware, the observed position
 * of a user's head relative to the hardware, or some other means of computing a series
 * of viewpoints into the XR scene. XRViewerPoses can only be queried relative to an
 * XRReferenceSpace. It provides, in addition to the XRPose values, an array of views
 * which include rigid transforms to indicate the viewpoint and projection matrices.
 * These values should be used by the application when rendering a frame of an XR scene.
 *
 * ref: https://immersive-web.github.io/webxr/#xrviewerpose-interface
 */
interface XRViewerPose extends XRPose {
    readonly views: ReadonlyArray<XRView>;
}

abstract class XRViewerPose implements XRViewerPose {}

/**
 * A transform described by a position and orientation. When interpreting an
 * XRRigidTransform the orientation is always applied prior to the position.
 *
 * ref: https://immersive-web.github.io/webxr/#xrrigidtransform-interface
 */
class XRRigidTransform {
    readonly position: DOMPointReadOnly;
    readonly orientation: DOMPointReadOnly;
    readonly matrix: Float32Array;
    readonly inverse: XRRigidTransform;

    constructor(position?: DOMPointInit, direction?: DOMPointInit);
}

/**
 * Describes a single view into an XR scene for a given frame.
 *
 * ref: https://immersive-web.github.io/webxr/#xrview-interface
 */
interface XRView {
    readonly eye: XREye;
    readonly projectionMatrix: Float32Array;
    readonly transform: XRRigidTransform;
    readonly recommendedViewportScale?: number | undefined;
    requestViewportScale(scale: number): void;
}

abstract class XRView implements XRView {}

/**
 * XRInputSourcesChangeEvents are fired to indicate changes to the XRInputSources that are
 * available to an XRSession.
 * ref: https://immersive-web.github.io/webxr/#xrinputsourceschangeevent-interface
 */
interface XRInputSourceChangeEvent extends XRSessionEvent {
    readonly removed: ReadonlyArray<XRInputSource>;
    readonly added: ReadonlyArray<XRInputSource>;
}

interface XRInputSourceChangeEventHandler {
    (evt: XRInputSourceChangeEvent): any;
}

// Experimental/Draft features

// Anchors
type XRAnchorSet = Set<XRAnchor>;

interface XRAnchor {
    anchorSpace: XRSpace;
    delete(): void;
}

abstract class XRAnchor implements XRAnchor {}

interface XRFrame {
    trackedAnchors?: XRAnchorSet | undefined;
    createAnchor?: (pose: XRRigidTransform, space: XRSpace) => Promise<XRAnchor>;
}

// AR Hit testing
class XRRay {
    readonly origin: DOMPointReadOnly;
    readonly direction: DOMPointReadOnly;
    readonly matrix: Float32Array;

    constructor(transformOrOrigin?: XRRigidTransform | DOMPointInit, direction?: DOMPointInit);
}

type XRHitTestTrackableType = "point" | "plane" | "mesh";

interface XRTransientInputHitTestResult {
    readonly inputSource: XRInputSource;
    readonly results: ReadonlyArray<XRHitTestResult>;
}

class XRTransientInputHitTestResult {
    prototype: XRTransientInputHitTestResult;
}

interface XRHitTestResult {
    getPose(baseSpace: XRSpace): XRPose | undefined;
    // When anchor system is enabled
    createAnchor?: (pose: XRRigidTransform) => Promise<XRAnchor> | undefined;
}

abstract class XRHitTestResult implements XRHitTestResult {}

interface XRHitTestSource {
    cancel(): void;
}

abstract class XRHitTestSource implements XRHitTestSource {}

interface XRTransientInputHitTestSource {
    cancel(): void;
}

abstract class XRTransientInputHitTestSource implements XRTransientInputHitTestSource {}

interface XRHitTestOptionsInit {
    space: XRSpace;
    entityTypes?: XRHitTestTrackableType[] | undefined;
    offsetRay?: XRRay | undefined;
}

interface XRTransientInputHitTestOptionsInit {
    profile: string;
    entityTypes?: XRHitTestTrackableType[] | undefined;
    offsetRay?: XRRay | undefined;
}

interface XRSession {
    requestHitTestSource?: (options: XRHitTestOptionsInit) => Promise<XRHitTestSource>;
    requestHitTestSourceForTransientInput?: (options: XRTransientInputHitTestOptionsInit) => Promise<XRTransientInputHitTestSource>;

    // Legacy
    requestHitTest?: (ray: XRRay, referenceSpace: XRReferenceSpace) => Promise<XRHitResult[]>;
}

interface XRFrame {
    getHitTestResults(hitTestSource: XRHitTestSource): XRHitTestResult[];
    getHitTestResultsForTransientInput(hitTestSource: XRTransientInputHitTestSource): XRTransientInputHitTestResult[];
}

// Legacy
interface XRHitResult {
    hitMatrix: Float32Array;
}

// Plane detection
type XRPlaneSet = Set<XRPlane>;

type XRPlaneOrientation = "horizontal" | "vertical";

interface XRPlane {
    orientation: XRPlaneOrientation;
    planeSpace: XRSpace;
    polygon: DOMPointReadOnly[];
    lastChangedTime: number;
}

abstract class XRPlane implements XRPlane {}

interface XRSession {
    // Legacy
    updateWorldTrackingState?: (options: { planeDetectionState?: { enabled: boolean } | undefined }) => void | undefined;
}

// interface XRFrame {
//     worldInformation?:
//         | {
//               detectedPlanes?: XRPlaneSet | undefined;
//           }
//         | undefined;
// }

// Hand Tracking
type XRHandJoint =
    | "wrist"
    | "thumb-metacarpal"
    | "thumb-phalanx-proximal"
    | "thumb-phalanx-distal"
    | "thumb-tip"
    | "index-finger-metacarpal"
    | "index-finger-phalanx-proximal"
    | "index-finger-phalanx-intermediate"
    | "index-finger-phalanx-distal"
    | "index-finger-tip"
    | "middle-finger-metacarpal"
    | "middle-finger-phalanx-proximal"
    | "middle-finger-phalanx-intermediate"
    | "middle-finger-phalanx-distal"
    | "middle-finger-tip"
    | "ring-finger-metacarpal"
    | "ring-finger-phalanx-proximal"
    | "ring-finger-phalanx-intermediate"
    | "ring-finger-phalanx-distal"
    | "ring-finger-tip"
    | "pinky-finger-metacarpal"
    | "pinky-finger-phalanx-proximal"
    | "pinky-finger-phalanx-intermediate"
    | "pinky-finger-phalanx-distal"
    | "pinky-finger-tip";

interface XRJointSpace extends XRSpace {
    readonly jointName: XRHandJoint;
}

abstract class XRJointSpace implements XRJointSpace {}

interface XRJointPose extends XRPose {
    readonly radius: number | undefined;
}

abstract class XRJointPose implements XRJointPose {}

interface XRHand extends Map<XRHandJoint, XRJointSpace> {
    readonly WRIST: number;

    readonly THUMB_METACARPAL: number;
    readonly THUMB_PHALANX_PROXIMAL: number;
    readonly THUMB_PHALANX_DISTAL: number;
    readonly THUMB_PHALANX_TIP: number;

    readonly INDEX_METACARPAL: number;
    readonly INDEX_PHALANX_PROXIMAL: number;
    readonly INDEX_PHALANX_INTERMEDIATE: number;
    readonly INDEX_PHALANX_DISTAL: number;
    readonly INDEX_PHALANX_TIP: number;

    readonly MIDDLE_METACARPAL: number;
    readonly MIDDLE_PHALANX_PROXIMAL: number;
    readonly MIDDLE_PHALANX_INTERMEDIATE: number;
    readonly MIDDLE_PHALANX_DISTAL: number;
    readonly MIDDLE_PHALANX_TIP: number;

    readonly RING_METACARPAL: number;
    readonly RING_PHALANX_PROXIMAL: number;
    readonly RING_PHALANX_INTERMEDIATE: number;
    readonly RING_PHALANX_DISTAL: number;
    readonly RING_PHALANX_TIP: number;

    readonly LITTLE_METACARPAL: number;
    readonly LITTLE_PHALANX_PROXIMAL: number;
    readonly LITTLE_PHALANX_INTERMEDIATE: number;
    readonly LITTLE_PHALANX_DISTAL: number;
    readonly LITTLE_PHALANX_TIP: number;
}

abstract class XRHand extends Map<XRHandJoint, XRJointSpace> implements XRHand {}

// WebXR Layers

/**
 * The base class for XRWebGLLayer and other layer types introduced by future extensions.
 * ref: https://immersive-web.github.io/webxr/#xrlayer-interface
 */
// tslint:disable-next-line no-empty-interface
interface XRLayer extends EventTarget {}

abstract class XRLayer implements XRLayer {}

interface XRWebGLLayerInit {
    antialias?: boolean | undefined;
    depth?: boolean | undefined;
    stencil?: boolean | undefined;
    alpha?: boolean | undefined;
    ignoreDepthValues?: boolean | undefined;
    framebufferScaleFactor?: number | undefined;
}

/**
 * A layer which provides a WebGL framebuffer to render into, enabling hardware accelerated
 * rendering of 3D graphics to be presented on the XR device. *
 * ref: https://immersive-web.github.io/webxr/#xrwebgllayer-interface
 */
class XRWebGLLayer extends XRLayer {
    static getNativeFramebufferScaleFactor(session: XRSession): number;

    constructor(session: XRSession, context: WebGLRenderingContext | WebGL2RenderingContext, layerInit?: XRWebGLLayerInit);

    readonly antialias: boolean;
    readonly ignoreDepthValues: boolean;
    fixedFoveation?: number | undefined;

    readonly framebuffer: WebGLFramebuffer;
    readonly framebufferWidth: number;
    readonly framebufferHeight: number;

    getViewport(view: XRView): XRViewport | undefined;
}

interface XRRenderStateInit {
    layers?: XRLayer[] | undefined;
}

interface XRRenderState {
    readonly layers?: XRLayer[] | undefined;
}

type XRLayerEventType = "redraw";

interface XRLayerEvent extends Event {
    readonly type: XRLayerEventType;
    readonly layer: XRLayer;
}

interface XRCompositionLayerEventMap {
    redraw: XRLayerEvent;
}

interface XRCompositionLayer extends XRLayer {
    readonly layout: XRLayerLayout;
    blendTextureSourceAlpha: boolean;
    chromaticAberrationCorrection?: boolean | undefined;
    readonly mipLevels: number;
    readonly needsRedraw: boolean;
    destroy(): void;

    space: XRSpace;

    // Events
    onredraw: (evt: XRCompositionLayerEventMap["redraw"]) => any;

    addEventListener<K extends keyof XRCompositionLayerEventMap>(
        this: XRCompositionLayer,
        type: K,
        callback: (evt: XRCompositionLayerEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof XRCompositionLayerEventMap>(this: XRCompositionLayer, type: K, callback: (evt: XRCompositionLayerEventMap[K]) => any): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

abstract class XRCompositionLayer implements XRCompositionLayer {}

type XRTextureType = "texture" | "texture-array";

type XRLayerLayout = "default" | "mono" | "stereo" | "stereo-left-right" | "stereo-top-bottom";

interface XRProjectionLayerInit {
    scaleFactor?: number | undefined;
    textureType?: XRTextureType | undefined;
    colorFormat?: GLenum | undefined;
    depthFormat?: GLenum | undefined;
    clearOnAccess?: boolean | undefined;
}

interface XRProjectionLayer extends XRCompositionLayer {
    readonly textureWidth: number;
    readonly textureHeight: number;
    readonly textureArrayLength: number;
    readonly ignoreDepthValues: number;
    fixedFoveation: number;
}

abstract class XRProjectionLayer implements XRProjectionLayer {}

interface XRLayerInit {
    mipLevels?: number | undefined;
    viewPixelWidth: number;
    viewPixelHeight: number;
    isStatic?: boolean | undefined;
    colorFormat?: GLenum | undefined;
    depthFormat?: GLenum | undefined;
    space: XRSpace;
    layout?: XRLayerLayout | undefined;
    clearOnAccess?: boolean | undefined;
}

interface XRMediaLayerInit {
    invertStereo?: boolean | undefined;
    space: XRSpace;
    layout?: XRLayerLayout | undefined;
}

interface XRCylinderLayerInit extends XRLayerInit {
    textureType?: XRTextureType | undefined;
    transform: XRRigidTransform;
    radius?: number | undefined;
    centralAngle?: number | undefined;
    aspectRatio?: number | undefined;
}

interface XRMediaCylinderLayerInit extends XRMediaLayerInit {
    transform?: XRRigidTransform | undefined;
    radius?: number | undefined;
    centralAngle?: number | undefined;
    aspectRatio?: number | undefined;
}

interface XRCylinderLayer extends XRCompositionLayer {
    transform: XRRigidTransform;
    radius: number;
    centralAngle: number;
    aspectRatio: number;
}

abstract class XRCylinderLayer implements XRCylinderLayer {}

interface XRQuadLayerInit extends XRLayerInit {
    textureType?: XRTextureType | undefined;
    transform?: XRRigidTransform | undefined;
    width?: number | undefined;
    height?: number | undefined;
}

interface XRMediaQuadLayerInit extends XRMediaLayerInit {
    transform?: XRRigidTransform | undefined;
    width?: number | undefined;
    height?: number | undefined;
}

interface XRQuadLayer extends XRCompositionLayer {
    transform: XRRigidTransform;
    width: number;
    height: number;
}

abstract class XRQuadLayer implements XRQuadLayer {}

interface XREquirectLayerInit extends XRLayerInit {
    textureType?: XRTextureType | undefined;
    transform?: XRRigidTransform | undefined;
    radius?: number | undefined;
    centralHorizontalAngle?: number | undefined;
    upperVerticalAngle?: number | undefined;
    lowerVerticalAngle?: number | undefined;
}

interface XRMediaEquirectLayerInit extends XRMediaLayerInit {
    transform?: XRRigidTransform | undefined;
    radius?: number | undefined;
    centralHorizontalAngle?: number | undefined;
    upperVerticalAngle?: number | undefined;
    lowerVerticalAngle?: number | undefined;
}

interface XREquirectLayer extends XRCompositionLayer {
    transform: XRRigidTransform;
    radius: number;
    centralHorizontalAngle: number;
    upperVerticalAngle: number;
    lowerVerticalAngle: number;
}

abstract class XREquirectLayer implements XREquirectLayer {}

interface XRCubeLayerInit extends XRLayerInit {
    orientation?: DOMPointReadOnly | undefined;
}

interface XRCubeLayer extends XRCompositionLayer {
    orientation: DOMPointReadOnly;
}

abstract class XRCubeLayer implements XRCubeLayer {}

interface XRSubImage {
    readonly viewport: XRViewport;
}

abstract class XRSubImage implements XRSubImage {}

interface XRWebGLSubImage extends XRSubImage {
    readonly colorTexture: WebGLTexture;
    readonly depthStencilTexture?: WebGLTexture;
    readonly motionVectorTexture?: WebGLTexture;
    readonly imageIndex: number;
    readonly textureWidth: number;
    readonly textureHeight: number;
    readonly colorTextureWidth?: number;
    readonly colorTextureHeight?: number;
    readonly depthStencilTextureWidth?: number;
    readonly depthStencilTextureHeight?: number;
    readonly motionVectorTextureWidth?: number;
    readonly motionVectorTextureHeight?: number;
}

abstract class XRWebGLSubImage implements XRWebGLSubImage {}

class XRWebGLBinding {
    readonly nativeProjectionScaleFactor: number;

    constructor(session: XRSession, context: WebGLRenderingContext);

    createProjectionLayer(init?: XRProjectionLayerInit): XRProjectionLayer;
    createQuadLayer(init?: XRQuadLayerInit): XRQuadLayer;
    createCylinderLayer(init?: XRCylinderLayerInit): XRCylinderLayer;
    createEquirectLayer(init?: XREquirectLayerInit): XREquirectLayer;
    createCubeLayer(init?: XRCubeLayerInit): XRCubeLayer;

    getSubImage(layer: XRCompositionLayer, frame: XRFrame, eye?: XREye): XRWebGLSubImage;
    getViewSubImage(layer: XRProjectionLayer, view: XRView): XRWebGLSubImage;

    // BABYLON addition
    getReflectionCubeMap: (lightProbe: XRLightProbe) => WebGLTexture;
}

class XRMediaBinding {
    constructor(sesion: XRSession);

    createQuadLayer(video: HTMLVideoElement, init?: XRMediaQuadLayerInit): XRQuadLayer;
    createCylinderLayer(video: HTMLVideoElement, init?: XRMediaCylinderLayerInit): XRCylinderLayer;
    createEquirectLayer(video: HTMLVideoElement, init?: XRMediaEquirectLayerInit): XREquirectLayer;
}

// WebGL extensions
interface WebGLRenderingContextBase {
    getExtension(extensionName: "OCULUS_multiview"): OCULUS_multiview | null;
}

enum XOVR_multiview2 {
    FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR = 0x9630,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR = 0x9632,
    MAX_VIEWS_OVR = 0x9631,
    FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR = 0x9633,
}

// Oculus extensions
interface XRSessionGrant {
    mode: XRSessionMode;
}

interface XRSystemSessionGrantedEvent extends Event {
    type: "sessiongranted";
    session: XRSessionGrant;
}

interface XRSystemSessionGrantedEventHandler {
    (event: XRSystemSessionGrantedEvent): any;
}

interface XRSystemEventMap {
    // Session Grant events are an Meta Oculus Browser extension
    sessiongranted: XRSystemSessionGrantedEvent;
}

interface XRSystem {
    onsessiongranted: XRSystemSessionGrantedEventHandler | null;
}

interface OCULUS_multiview extends OVR_multiview2 {
    framebufferTextureMultisampleMultiviewOVR(
        target: GLenum,
        attachment: GLenum,
        texture: WebGLTexture | null,
        level: GLint,
        samples: GLsizei,
        baseViewIndex: GLint,
        numViews: GLsizei
    ): void;
}

abstract class OCULUS_multiview implements OCULUS_multiview {}

/**
 * BEGIN: WebXR DOM Overlays Module
 * https://immersive-web.github.io/dom-overlays/
 */

interface GlobalEventHandlersEventMap {
    beforexrselect: XRSessionEvent;
}

interface GlobalEventHandlers {
    /**
     * An XRSessionEvent of type beforexrselect is dispatched on the DOM overlay
     * element before generating a WebXR selectstart input event if the -Z axis
     * of the input source's targetRaySpace intersects the DOM overlay element
     * at the time the input device's primary action is triggered.
     */
    onbeforexrselect: ((this: GlobalEventHandlers, ev: XRSessionEvent) => any) | null;
}

interface XRDOMOverlayInit {
    root: Element;
}

interface XRSessionInit {
    domOverlay?: XRDOMOverlayInit | undefined;
}

type XRDOMOverlayType = "screen" | "floating" | "head-locked";

interface XRDOMOverlayState {
    type: XRDOMOverlayType;
}

interface XRSession {
    readonly domOverlayState?: XRDOMOverlayState | undefined;
}

/// BABYLON EDITS
interface XREyeTrackingSourceEvent extends XRSessionEvent {
    readonly gazeSpace: XRSpace;
}

interface XRFrame {
    fillPoses?(spaces: XRSpace[], baseSpace: XRSpace, transforms: Float32Array): boolean;
    // Anchors
    trackedAnchors?: XRAnchorSet;
    // World geometries. DEPRECATED
    worldInformation?: XRWorldInformation | undefined;
    detectedPlanes?: XRPlaneSet | undefined;
    // Hand tracking
    getJointPose?(joint: XRJointSpace, baseSpace: XRSpace): XRJointPose;
    fillJointRadii?(jointSpaces: XRJointSpace[], radii: Float32Array): boolean;
    // Image tracking
    getImageTrackingResults?(): Array<XRImageTrackingResult>;
    getLightEstimate(xrLightProbe: XRLightProbe): XRLightEstimate;
}

// Plane detection
interface XRSession {
    initiateRoomCapture?(): Promise<void>;
}

type XREventType = keyof XRSessionEventMap;

type XRImageTrackingState = "tracked" | "emulated";
type XRImageTrackingScore = "untrackable" | "trackable";

interface XRTrackedImageInit {
    image: ImageBitmap;
    widthInMeters: number;
}

interface XRImageTrackingResult {
    readonly imageSpace: XRSpace;
    readonly index: number;
    readonly trackingState: XRImageTrackingState;
    readonly measuredWidthInMeters: number;
}

interface XRPose {
    readonly linearVelocity?: DOMPointReadOnly;
    readonly angularVelocity?: DOMPointReadOnly;
}

type XRLightProbeInit = {
    reflectionFormat: XRReflectionFormat;
};

type XRReflectionFormat = "srgba8" | "rgba16f";

interface XRSession {
    readonly preferredReflectionFormat?: XRReflectionFormat;
    /**
     * The XRSession interface is extended with the ability to create new XRLightProbe instances.
     * XRLightProbe instances have a session object, which is the XRSession that created this XRLightProbe.
     *
     * Can reject with with a "NotSupportedError" DOMException
     */
    requestLightProbe(options?: XRLightProbeInit): Promise<XRLightProbe>;

    getTrackedImageScores?(): Promise<XRImageTrackingScore[]>;
}

interface XRWorldInformation {
    detectedPlanes?: XRPlaneSet;
}

interface XRSessionInit {
    trackedImages?: XRTrackedImageInit[];
}

interface XRLightEstimate {
    readonly sphericalHarmonicsCoefficients: Float32Array;
    readonly primaryLightDirection: DOMPointReadOnly;
    readonly primaryLightIntensity: DOMPointReadOnly;
}

interface XREventHandler {
    (evt: Event): any;
}

interface XRLightProbe extends EventTarget {
    readonly probeSpace: XRSpace;
    onreflectionchange: XREventHandler;
}

/**
 * END: WebXR DOM Overlays Module
 * https://immersive-web.github.io/dom-overlays/
 */

/**
 * BEGIN: WebXR Depth Sensing Moudle
 * https://www.w3.org/TR/webxr-depth-sensing-1/
 */

type XRDepthUsage = "cpu-optimized" | "gpu-optimized";
type XRDepthDataFormat = "luminance-alpha" | "float32";

type XRDepthStateInit = {
    readonly usagePreference: XRDepthUsage[];
    readonly dataFormatPreference: XRDepthDataFormat[];
};

interface XRSessionInit {
    depthSensing?: XRDepthStateInit;
}

interface XRSession {
    readonly depthUsage: XRDepthUsage;
    readonly depthDataFormat: XRDepthDataFormat;
}

interface XRDepthInformation {
    readonly width: number;
    readonly height: number;

    readonly normDepthBufferFromNormView: XRRigidTransform;
    readonly rawValueToMeters: number;
}

interface XRCPUDepthInformation extends XRDepthInformation {
    readonly data: ArrayBuffer;

    getDepthInMeters(x: number, y: number): number;
}

interface XRFrame {
    getDepthInformation(view: XRView): XRCPUDepthInformation | undefined;
}

interface XRWebGLDepthInformation extends XRDepthInformation {
    readonly texture: WebGLTexture;
}

interface XRWebGLBinding {
    getDepthInformation(view: XRView): XRWebGLDepthInformation | undefined;
}

// enabledFeatures
interface XRSession {
    enabledFeatures: string[];
}

// Raw camera access

interface XRView {
    readonly camera: XRCamera | undefined;
}

interface XRCamera {
    readonly width: number;
    readonly height: number;
}

interface XRWebGLBinding {
    getCameraImage(camera: XRCamera): WebGLTexture | undefined;
}

// Mesh Detection

interface XRMesh {
    meshSpace: XRSpace;
    vertices: Float32Array;
    indices: Uint32Array;
    lastChangedTime: DOMHighResTimeStamp;
}

type XRMeshSet = Set<XRMesh>;

interface XRFrame {
    detectedMeshes?: XRMeshSet;
}

// This file contains native only extensions for WebXR. These APIs are not supported in the browser yet.
// They are intended for use with either Babylon Native https://github.com/BabylonJS/BabylonNative or
// Babylon React Native: https://github.com/BabylonJS/BabylonReactNative

type XRSceneObjectType = "unknown" | "background" | "wall" | "floor" | "ceiling" | "platform" | "inferred" | "world";

interface XRSceneObject {
    type: XRSceneObjectType;
}

interface XRFieldOfView {
    angleLeft: number;
    angleRight: number;
    angleUp: number;
    angleDown: number;
}

interface XRFrustum {
    position: DOMPointReadOnly;
    orientation: DOMPointReadOnly;
    fieldOfView: XRFieldOfView;
    farDistance: number;
}

interface XRPlane {
    parentSceneObject?: XRSceneObject;
}

// extending the webxr XRMesh with babylon native properties
interface XRMesh {
    normals?: Float32Array;
    parentSceneObject?: XRSceneObject;
    positions: Float32Array; // Babylon native!
}

interface XRFrustumDetectionBoundary {
    type: "frustum";
    frustum: XRFrustum;
}

interface XRSphereDetectionBoundary {
    type: "sphere";
    radius: number;
}

interface XRBoxDetectionBoundary {
    type: "box";
    extent: DOMPointReadOnly;
}

type XRDetectionBoundary = XRFrustumDetectionBoundary | XRSphereDetectionBoundary | XRBoxDetectionBoundary;

interface XRGeometryDetectorOptions {
    detectionBoundary?: XRDetectionBoundary;
    updateInterval?: number;
}

interface XRSession {
    trySetFeaturePointCloudEnabled(enabled: boolean): boolean;
    trySetPreferredPlaneDetectorOptions(preferredOptions: XRGeometryDetectorOptions): boolean;
    trySetMeshDetectorEnabled(enabled: boolean): boolean;
    trySetPreferredMeshDetectorOptions(preferredOptions: XRGeometryDetectorOptions): boolean;
}

interface XRFrame {
    featurePointCloud?: Array<number> | undefined;
}

interface XRWorldInformation {
    detectedMeshes?: XRMeshSet;
}

}