import type { Nullable } from "../types";
import { GetDOMTextContent, IsWindowObjectExist } from "./domManagement";
import { WebRequest } from "./webRequest";
import type { IFileRequest } from "./fileRequest";
import type { ReadFileError } from "./fileTools";
import type { IOfflineProvider } from "../Offline/IOfflineProvider";
import type { IScreenshotSize } from "./interfaces/screenshotSize";
import type { Camera } from "../Cameras/camera";
import type { IColor4Like } from "../Maths/math.like";
import type { AbstractEngine } from "../Engines/abstractEngine";
/**
 * Class containing a set of static utilities functions
 */
export declare class Tools {
    /**
     * Gets or sets the base URL to use to load assets
     */
    static get BaseUrl(): string;
    static set BaseUrl(value: string);
    /**
     * This function checks whether a URL is absolute or not.
     * It will also detect data and blob URLs
     * @param url the url to check
     * @returns is the url absolute or relative
     */
    static IsAbsoluteUrl(url: string): boolean;
    /**
     * Sets the base URL to use to load scripts
     */
    static set ScriptBaseUrl(value: string);
    static get ScriptBaseUrl(): string;
    /**
     * Sets a preprocessing function to run on a source URL before importing it
     * Note that this function will execute AFTER the base URL is appended to the URL
     */
    static set ScriptPreprocessUrl(func: (source: string) => string);
    static get ScriptPreprocessUrl(): (source: string) => string;
    /**
     * Enable/Disable Custom HTTP Request Headers globally.
     * default = false
     * @see CustomRequestHeaders
     */
    static UseCustomRequestHeaders: boolean;
    /**
     * Custom HTTP Request Headers to be sent with XMLHttpRequests
     * i.e. when loading files, where the server/service expects an Authorization header
     */
    static CustomRequestHeaders: {
        [key: string]: string;
    };
    /**
     * Gets or sets the retry strategy to apply when an error happens while loading an asset
     */
    static get DefaultRetryStrategy(): (url: string, request: WebRequest, retryIndex: number) => number;
    static set DefaultRetryStrategy(strategy: (url: string, request: WebRequest, retryIndex: number) => number);
    /**
     * Default behavior for cors in the application.
     * It can be a string if the expected behavior is identical in the entire app.
     * Or a callback to be able to set it per url or on a group of them (in case of Video source for instance)
     */
    static get CorsBehavior(): string | ((url: string | string[]) => string);
    static set CorsBehavior(value: string | ((url: string | string[]) => string));
    /**
     * Gets or sets a global variable indicating if fallback texture must be used when a texture cannot be loaded
     * @ignorenaming
     */
    static get UseFallbackTexture(): boolean;
    static set UseFallbackTexture(value: boolean);
    /**
     * Use this object to register external classes like custom textures or material
     * to allow the loaders to instantiate them
     */
    static get RegisteredExternalClasses(): {
        [key: string]: Object;
    };
    static set RegisteredExternalClasses(classes: {
        [key: string]: Object;
    });
    /**
     * Texture content used if a texture cannot loaded
     * @ignorenaming
     */
    static get fallbackTexture(): string;
    static set fallbackTexture(value: string);
    /**
     * Read the content of a byte array at a specified coordinates (taking in account wrapping)
     * @param u defines the coordinate on X axis
     * @param v defines the coordinate on Y axis
     * @param width defines the width of the source data
     * @param height defines the height of the source data
     * @param pixels defines the source byte array
     * @param color defines the output color
     */
    static FetchToRef(u: number, v: number, width: number, height: number, pixels: Uint8Array, color: IColor4Like): void;
    /**
     * Interpolates between a and b via alpha
     * @param a The lower value (returned when alpha = 0)
     * @param b The upper value (returned when alpha = 1)
     * @param alpha The interpolation-factor
     * @returns The mixed value
     */
    static Mix(a: number, b: number, alpha: number): number;
    /**
     * Tries to instantiate a new object from a given class name
     * @param className defines the class name to instantiate
     * @returns the new object or null if the system was not able to do the instantiation
     */
    static Instantiate(className: string): any;
    /**
     * Polyfill for setImmediate
     * @param action defines the action to execute after the current execution block
     */
    static SetImmediate(action: () => void): void;
    /**
     * Function indicating if a number is an exponent of 2
     * @param value defines the value to test
     * @returns true if the value is an exponent of 2
     */
    static IsExponentOfTwo(value: number): boolean;
    /**
     * Returns the nearest 32-bit single precision float representation of a Number
     * @param value A Number.  If the parameter is of a different type, it will get converted
     * to a number or to NaN if it cannot be converted
     * @returns number
     */
    static FloatRound(value: number): number;
    /**
     * Extracts the filename from a path
     * @param path defines the path to use
     * @returns the filename
     */
    static GetFilename(path: string): string;
    /**
     * Extracts the "folder" part of a path (everything before the filename).
     * @param uri The URI to extract the info from
     * @param returnUnchangedIfNoSlash Do not touch the URI if no slashes are present
     * @returns The "folder" part of the path
     */
    static GetFolderPath(uri: string, returnUnchangedIfNoSlash?: boolean): string;
    /**
     * Extracts text content from a DOM element hierarchy
     * Back Compat only, please use GetDOMTextContent instead.
     */
    static GetDOMTextContent: typeof GetDOMTextContent;
    /**
     * Convert an angle in radians to degrees
     * @param angle defines the angle to convert
     * @returns the angle in degrees
     */
    static ToDegrees(angle: number): number;
    /**
     * Convert an angle in degrees to radians
     * @param angle defines the angle to convert
     * @returns the angle in radians
     */
    static ToRadians(angle: number): number;
    /**
     * Smooth angle changes (kind of low-pass filter), in particular for device orientation "shaking"
     * Use trigonometric functions to avoid discontinuity (0/360, -180/180)
     * @param previousAngle defines last angle value, in degrees
     * @param newAngle defines new angle value, in degrees
     * @param smoothFactor defines smoothing sensitivity; min 0: no smoothing, max 1: new data ignored
     * @returns the angle in degrees
     */
    static SmoothAngleChange(previousAngle: number, newAngle: number, smoothFactor?: number): number;
    /**
     * Returns an array if obj is not an array
     * @param obj defines the object to evaluate as an array
     * @param allowsNullUndefined defines a boolean indicating if obj is allowed to be null or undefined
     * @returns either obj directly if obj is an array or a new array containing obj
     */
    static MakeArray(obj: any, allowsNullUndefined?: boolean): Nullable<Array<any>>;
    /**
     * Gets the pointer prefix to use
     * @param engine defines the engine we are finding the prefix for
     * @returns "pointer" if touch is enabled. Else returns "mouse"
     */
    static GetPointerPrefix(engine: AbstractEngine): string;
    /**
     * Sets the cors behavior on a dom element. This will add the required Tools.CorsBehavior to the element.
     * @param url define the url we are trying
     * @param element define the dom element where to configure the cors policy
     * @param element.crossOrigin
     */
    static SetCorsBehavior(url: string | string[], element: {
        crossOrigin: string | null;
    }): void;
    /**
     * Sets the referrerPolicy behavior on a dom element.
     * @param referrerPolicy define the referrer policy to use
     * @param element define the dom element where to configure the referrer policy
     * @param element.referrerPolicy
     */
    static SetReferrerPolicyBehavior(referrerPolicy: Nullable<ReferrerPolicy>, element: {
        referrerPolicy: string | null;
    }): void;
    /**
     * Gets or sets a function used to pre-process url before using them to load assets
     */
    static get PreprocessUrl(): (url: string) => string;
    static set PreprocessUrl(processor: (url: string) => string);
    /**
     * Loads an image as an HTMLImageElement.
     * @param input url string, ArrayBuffer, or Blob to load
     * @param onLoad callback called when the image successfully loads
     * @param onError callback called when the image fails to load
     * @param offlineProvider offline provider for caching
     * @param mimeType optional mime type
     * @param imageBitmapOptions optional the options to use when creating an ImageBitmap
     * @returns the HTMLImageElement of the loaded image
     */
    static LoadImage(input: string | ArrayBuffer | Blob, onLoad: (img: HTMLImageElement | ImageBitmap) => void, onError: (message?: string, exception?: any) => void, offlineProvider: Nullable<IOfflineProvider>, mimeType?: string, imageBitmapOptions?: ImageBitmapOptions): Nullable<HTMLImageElement>;
    /**
     * Loads a file from a url
     * @param url url string, ArrayBuffer, or Blob to load
     * @param onSuccess callback called when the file successfully loads
     * @param onProgress callback called while file is loading (if the server supports this mode)
     * @param offlineProvider defines the offline provider for caching
     * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
     * @param onError callback called when the file fails to load
     * @returns a file request object
     */
    static LoadFile(url: string, onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void, onProgress?: (data: any) => void, offlineProvider?: IOfflineProvider, useArrayBuffer?: boolean, onError?: (request?: WebRequest, exception?: any) => void): IFileRequest;
    static LoadFileAsync(url: string, useArrayBuffer?: true): Promise<ArrayBuffer>;
    static LoadFileAsync(url: string, useArrayBuffer?: false): Promise<string>;
    /**
     * @internal
     */
    static _DefaultCdnUrl: string;
    /**
     * Get a script URL including preprocessing
     * @param scriptUrl the script Url to process
     * @param forceAbsoluteUrl force the script to be an absolute url (adding the current base url if necessary)
     * @returns a modified URL to use
     */
    static GetBabylonScriptURL(scriptUrl: Nullable<string>, forceAbsoluteUrl?: boolean): string;
    /**
     * This function is used internally by babylon components to load a script (identified by an url). When the url returns, the
     * content of this file is added into a new script element, attached to the DOM (body element)
     * @param scriptUrl defines the url of the script to load
     * @param onSuccess defines the callback called when the script is loaded
     * @param onError defines the callback to call if an error occurs
     * @param scriptId defines the id of the script element
     */
    static LoadBabylonScript(scriptUrl: string, onSuccess: () => void, onError?: (message?: string, exception?: any) => void, scriptId?: string): void;
    /**
     * Load an asynchronous script (identified by an url). When the url returns, the
     * content of this file is added into a new script element, attached to the DOM (body element)
     * @param scriptUrl defines the url of the script to laod
     * @returns a promise request object
     */
    static LoadBabylonScriptAsync(scriptUrl: string): Promise<void>;
    /**
     * This function is used internally by babylon components to load a script (identified by an url). When the url returns, the
     * content of this file is added into a new script element, attached to the DOM (body element)
     * @param scriptUrl defines the url of the script to load
     * @param onSuccess defines the callback called when the script is loaded
     * @param onError defines the callback to call if an error occurs
     * @param scriptId defines the id of the script element
     */
    static LoadScript(scriptUrl: string, onSuccess: () => void, onError?: (message?: string, exception?: any) => void, scriptId?: string): void;
    /**
     * Load an asynchronous script (identified by an url). When the url returns, the
     * content of this file is added into a new script element, attached to the DOM (body element)
     * @param scriptUrl defines the url of the script to load
     * @param scriptId defines the id of the script element
     * @returns a promise request object
     */
    static LoadScriptAsync(scriptUrl: string, scriptId?: string): Promise<void>;
    /**
     * Loads a file from a blob
     * @param fileToLoad defines the blob to use
     * @param callback defines the callback to call when data is loaded
     * @param progressCallback defines the callback to call during loading process
     * @returns a file request object
     */
    static ReadFileAsDataURL(fileToLoad: Blob, callback: (data: any) => void, progressCallback: (ev: ProgressEvent) => any): IFileRequest;
    /**
     * Reads a file from a File object
     * @param file defines the file to load
     * @param onSuccess defines the callback to call when data is loaded
     * @param onProgress defines the callback to call during loading process
     * @param useArrayBuffer defines a boolean indicating that data must be returned as an ArrayBuffer
     * @param onError defines the callback to call when an error occurs
     * @returns a file request object
     */
    static ReadFile(file: File, onSuccess: (data: any) => void, onProgress?: (ev: ProgressEvent) => any, useArrayBuffer?: boolean, onError?: (error: ReadFileError) => void): IFileRequest;
    /**
     * Creates a data url from a given string content
     * @param content defines the content to convert
     * @returns the new data url link
     */
    static FileAsURL(content: string): string;
    /**
     * Format the given number to a specific decimal format
     * @param value defines the number to format
     * @param decimals defines the number of decimals to use
     * @returns the formatted string
     */
    static Format(value: number, decimals?: number): string;
    /**
     * Tries to copy an object by duplicating every property
     * @param source defines the source object
     * @param destination defines the target object
     * @param doNotCopyList defines a list of properties to avoid
     * @param mustCopyList defines a list of properties to copy (even if they start with _)
     */
    static DeepCopy(source: any, destination: any, doNotCopyList?: string[], mustCopyList?: string[]): void;
    /**
     * Gets a boolean indicating if the given object has no own property
     * @param obj defines the object to test
     * @returns true if object has no own property
     */
    static IsEmpty(obj: any): boolean;
    /**
     * Function used to register events at window level
     * @param windowElement defines the Window object to use
     * @param events defines the events to register
     */
    static RegisterTopRootEvents(windowElement: Window, events: {
        name: string;
        handler: Nullable<(e: FocusEvent) => any>;
    }[]): void;
    /**
     * Function used to unregister events from window level
     * @param windowElement defines the Window object to use
     * @param events defines the events to unregister
     */
    static UnregisterTopRootEvents(windowElement: Window, events: {
        name: string;
        handler: Nullable<(e: FocusEvent) => any>;
    }[]): void;
    /**
     * Dumps the current bound framebuffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param engine defines the hosting engine
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
     * @returns a void promise
     */
    static DumpFramebuffer(width: number, height: number, engine: AbstractEngine, successCallback?: (data: string) => void, mimeType?: string, fileName?: string, quality?: number): Promise<void>;
    /**
     * Dumps an array buffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param data the data array
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     * @param invertY true to invert the picture in the Y dimension
     * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
     * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
     */
    static DumpData(width: number, height: number, data: ArrayBufferView, successCallback?: (data: string | ArrayBuffer) => void, mimeType?: string, fileName?: string, invertY?: boolean, toArrayBuffer?: boolean, quality?: number): void;
    /**
     * Dumps an array buffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param data the data array
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     * @param invertY true to invert the picture in the Y dimension
     * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
     * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
     * @returns a promise that resolve to the final data
     */
    static DumpDataAsync(width: number, height: number, data: ArrayBufferView, mimeType?: string, fileName?: string, invertY?: boolean, toArrayBuffer?: boolean, quality?: number): Promise<string | ArrayBuffer>;
    private static _IsOffScreenCanvas;
    /**
     * Converts the canvas data to blob.
     * This acts as a polyfill for browsers not supporting the to blob function.
     * @param canvas Defines the canvas to extract the data from (can be an offscreen canvas)
     * @param successCallback Defines the callback triggered once the data are available
     * @param mimeType Defines the mime type of the result
     * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
     */
    static ToBlob(canvas: HTMLCanvasElement | OffscreenCanvas, successCallback: (blob: Nullable<Blob>) => void, mimeType?: string, quality?: number): void;
    /**
     * Download a Blob object
     * @param blob the Blob object
     * @param fileName the file name to download
     */
    static DownloadBlob(blob: Blob, fileName?: string): void;
    /**
     * Encodes the canvas data to base 64, or automatically downloads the result if `fileName` is defined.
     * @param canvas The canvas to get the data from, which can be an offscreen canvas.
     * @param successCallback The callback which is triggered once the data is available. If `fileName` is defined, the callback will be invoked after the download occurs, and the `data` argument will be an empty string.
     * @param mimeType The mime type of the result.
     * @param fileName The name of the file to download. If defined, the result will automatically be downloaded. If not defined, and `successCallback` is also not defined, the result will automatically be downloaded with an auto-generated file name.
     * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
     */
    static EncodeScreenshotCanvasData(canvas: HTMLCanvasElement | OffscreenCanvas, successCallback?: (data: string) => void, mimeType?: string, fileName?: string, quality?: number): void;
    /**
     * Downloads a blob in the browser
     * @param blob defines the blob to download
     * @param fileName defines the name of the downloaded file
     */
    static Download(blob: Blob, fileName: string): void;
    /**
     * Will return the right value of the noPreventDefault variable
     * Needed to keep backwards compatibility to the old API.
     *
     * @param args arguments passed to the attachControl function
     * @returns the correct value for noPreventDefault
     */
    static BackCompatCameraNoPreventDefault(args: IArguments): boolean;
    /**
     * Captures a screenshot of the current rendering
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
     * @param engine defines the rendering engine
     * @param camera defines the source camera
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param successCallback defines the callback receives a single parameter which contains the
     * screenshot as a string of base64-encoded characters. This string can be assigned to the
     * src parameter of an <img> to display it
     * @param mimeType defines the MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param forceDownload force the system to download the image even if a successCallback is provided
     * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
     */
    static CreateScreenshot(engine: AbstractEngine, camera: Camera, size: IScreenshotSize | number, successCallback?: (data: string) => void, mimeType?: string, forceDownload?: boolean, quality?: number): void;
    /**
     * Captures a screenshot of the current rendering
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
     * @param engine defines the rendering engine
     * @param camera defines the source camera
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param mimeType defines the MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
     * @returns screenshot as a string of base64-encoded characters. This string can be assigned
     * to the src parameter of an <img> to display it
     */
    static CreateScreenshotAsync(engine: AbstractEngine, camera: Camera, size: IScreenshotSize | number, mimeType?: string, quality?: number): Promise<string>;
    /**
     * Generates an image screenshot from the specified camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
     * @param engine The engine to use for rendering
     * @param camera The camera to use for rendering
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param successCallback The callback receives a single parameter which contains the
     * screenshot as a string of base64-encoded characters. This string can be assigned to the
     * src parameter of an <img> to display it
     * @param mimeType The MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param samples Texture samples (default: 1)
     * @param antialiasing Whether antialiasing should be turned on or not (default: false)
     * @param fileName A name for for the downloaded file.
     * @param renderSprites Whether the sprites should be rendered or not (default: false)
     * @param enableStencilBuffer Whether the stencil buffer should be enabled or not (default: false)
     * @param useLayerMask if the camera's layer mask should be used to filter what should be rendered (default: true)
     * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
     */
    static CreateScreenshotUsingRenderTarget(engine: AbstractEngine, camera: Camera, size: IScreenshotSize | number, successCallback?: (data: string) => void, mimeType?: string, samples?: number, antialiasing?: boolean, fileName?: string, renderSprites?: boolean, enableStencilBuffer?: boolean, useLayerMask?: boolean, quality?: number): void;
    /**
     * Generates an image screenshot from the specified camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
     * @param engine The engine to use for rendering
     * @param camera The camera to use for rendering
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param mimeType The MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param samples Texture samples (default: 1)
     * @param antialiasing Whether antialiasing should be turned on or not (default: false)
     * @param fileName A name for for the downloaded file.
     * @returns screenshot as a string of base64-encoded characters. This string can be assigned
     * @param renderSprites Whether the sprites should be rendered or not (default: false)
     * @param enableStencilBuffer Whether the stencil buffer should be enabled or not (default: false)
     * @param useLayerMask if the camera's layer mask should be used to filter what should be rendered (default: true)
     * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
     * to the src parameter of an <img> to display it
     */
    static CreateScreenshotUsingRenderTargetAsync(engine: AbstractEngine, camera: Camera, size: IScreenshotSize | number, mimeType?: string, samples?: number, antialiasing?: boolean, fileName?: string, renderSprites?: boolean, enableStencilBuffer?: boolean, useLayerMask?: boolean, quality?: number): Promise<string>;
    /**
     * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
     * Be aware Math.random() could cause collisions, but:
     * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
     * @returns a pseudo random id
     */
    static RandomId(): string;
    /**
     * Test if the given uri is a base64 string
     * @deprecated Please use FileTools.IsBase64DataUrl instead.
     * @param uri The uri to test
     * @returns True if the uri is a base64 string or false otherwise
     */
    static IsBase64(uri: string): boolean;
    /**
     * Decode the given base64 uri.
     * @deprecated Please use FileTools.DecodeBase64UrlToBinary instead.
     * @param uri The uri to decode
     * @returns The decoded base64 data.
     */
    static DecodeBase64(uri: string): ArrayBuffer;
    /**
     * @returns the absolute URL of a given (relative) url
     */
    static GetAbsoluteUrl: (url: string) => string;
    /**
     * No log
     */
    static readonly NoneLogLevel = 0;
    /**
     * Only message logs
     */
    static readonly MessageLogLevel = 1;
    /**
     * Only warning logs
     */
    static readonly WarningLogLevel = 2;
    /**
     * Only error logs
     */
    static readonly ErrorLogLevel = 4;
    /**
     * All logs
     */
    static readonly AllLogLevel = 7;
    /**
     * Gets a value indicating the number of loading errors
     * @ignorenaming
     */
    static get errorsCount(): number;
    /**
     * Callback called when a new log is added
     */
    static OnNewCacheEntry: (entry: string) => void;
    /**
     * Log a message to the console
     * @param message defines the message to log
     */
    static Log(message: string): void;
    /**
     * Write a warning message to the console
     * @param message defines the message to log
     */
    static Warn(message: string): void;
    /**
     * Write an error message to the console
     * @param message defines the message to log
     */
    static Error(message: string): void;
    /**
     * Gets current log cache (list of logs)
     */
    static get LogCache(): string;
    /**
     * Clears the log cache
     */
    static ClearLogCache(): void;
    /**
     * Sets the current log level (MessageLogLevel / WarningLogLevel / ErrorLogLevel)
     */
    static set LogLevels(level: number);
    /**
     * Checks if the window object exists
     * Back Compat only, please use IsWindowObjectExist instead.
     */
    static IsWindowObjectExist: typeof IsWindowObjectExist;
    /**
     * No performance log
     */
    static readonly PerformanceNoneLogLevel = 0;
    /**
     * Use user marks to log performance
     */
    static readonly PerformanceUserMarkLogLevel = 1;
    /**
     * Log performance to the console
     */
    static readonly PerformanceConsoleLogLevel = 2;
    private static _Performance;
    /**
     * Sets the current performance log level
     */
    static set PerformanceLogLevel(level: number);
    private static _StartPerformanceCounterDisabled;
    private static _EndPerformanceCounterDisabled;
    private static _StartUserMark;
    private static _EndUserMark;
    private static _StartPerformanceConsole;
    private static _EndPerformanceConsole;
    /**
     * Starts a performance counter
     */
    static StartPerformanceCounter: (counterName: string, condition?: boolean) => void;
    /**
     * Ends a specific performance counter
     */
    static EndPerformanceCounter: (counterName: string, condition?: boolean) => void;
    /**
     * Gets either window.performance.now() if supported or Date.now() else
     */
    static get Now(): number;
    /**
     * This method will return the name of the class used to create the instance of the given object.
     * It will works only on Javascript basic data types (number, string, ...) and instance of class declared with the @className decorator.
     * @param object the object to get the class name from
     * @param isType defines if the object is actually a type
     * @returns the name of the class, will be "object" for a custom data type not using the @className decorator
     */
    static GetClassName(object: any, isType?: boolean): string;
    /**
     * Gets the first element of an array satisfying a given predicate
     * @param array defines the array to browse
     * @param predicate defines the predicate to use
     * @returns null if not found or the element
     */
    static First<T>(array: Array<T>, predicate: (item: T) => boolean): Nullable<T>;
    /**
     * This method will return the name of the full name of the class, including its owning module (if any).
     * It will works only on Javascript basic data types (number, string, ...) and instance of class declared with the @className decorator or implementing a method getClassName():string (in which case the module won't be specified).
     * @param object the object to get the class name from
     * @param isType defines if the object is actually a type
     * @returns a string that can have two forms: "moduleName.className" if module was specified when the class' Name was registered or "className" if there was not module specified.
     * @ignorenaming
     */
    static getFullClassName(object: any, isType?: boolean): Nullable<string>;
    /**
     * Returns a promise that resolves after the given amount of time.
     * @param delay Number of milliseconds to delay
     * @returns Promise that resolves after the given amount of time
     */
    static DelayAsync(delay: number): Promise<void>;
    /**
     * Utility function to detect if the current user agent is Safari
     * @returns whether or not the current user agent is safari
     */
    static IsSafari(): boolean;
}
/**
 * Use this className as a decorator on a given class definition to add it a name and optionally its module.
 * You can then use the Tools.getClassName(obj) on an instance to retrieve its class name.
 * This method is the only way to get it done in all cases, even if the .js file declaring the class is minified
 * @param name The name of the class, case should be preserved
 * @param module The name of the Module hosting the class, optional, but strongly recommended to specify if possible. Case should be preserved.
 * @returns a decorator function to apply on the class definition.
 */
export declare function className(name: string, module?: string): (target: Object) => void;
/**
 * An implementation of a loop for asynchronous functions.
 */
export declare class AsyncLoop {
    /**
     * Defines the number of iterations for the loop
     */
    iterations: number;
    /**
     * Defines the current index of the loop.
     */
    index: number;
    private _done;
    private _fn;
    private _successCallback;
    /**
     * Constructor.
     * @param iterations the number of iterations.
     * @param func the function to run each iteration
     * @param successCallback the callback that will be called upon successful execution
     * @param offset starting offset.
     */
    constructor(
    /**
     * Defines the number of iterations for the loop
     */
    iterations: number, func: (asyncLoop: AsyncLoop) => void, successCallback: () => void, offset?: number);
    /**
     * Execute the next iteration. Must be called after the last iteration was finished.
     */
    executeNext(): void;
    /**
     * Break the loop and run the success callback.
     */
    breakLoop(): void;
    /**
     * Create and run an async loop.
     * @param iterations the number of iterations.
     * @param fn the function to run each iteration
     * @param successCallback the callback that will be called upon successful execution
     * @param offset starting offset.
     * @returns the created async loop object
     */
    static Run(iterations: number, fn: (asyncLoop: AsyncLoop) => void, successCallback: () => void, offset?: number): AsyncLoop;
    /**
     * A for-loop that will run a given number of iterations synchronous and the rest async.
     * @param iterations total number of iterations
     * @param syncedIterations number of synchronous iterations in each async iteration.
     * @param fn the function to call each iteration.
     * @param callback a success call back that will be called when iterating stops.
     * @param breakFunction a break condition (optional)
     * @param timeout timeout settings for the setTimeout function. default - 0.
     * @returns the created async loop object
     */
    static SyncAsyncForLoop(iterations: number, syncedIterations: number, fn: (iteration: number) => void, callback: () => void, breakFunction?: () => boolean, timeout?: number): AsyncLoop;
}
