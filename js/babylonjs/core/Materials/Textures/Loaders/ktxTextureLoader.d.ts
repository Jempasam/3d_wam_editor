import type { Nullable } from "../../../types";
import type { InternalTexture } from "../internalTexture";
import type { IInternalTextureLoader } from "../internalTextureLoader";
/**
 * Implementation of the KTX Texture Loader.
 * @internal
 */
export declare class _KTXTextureLoader implements IInternalTextureLoader {
    /**
     * Defines whether the loader supports cascade loading the different faces.
     */
    readonly supportCascades = false;
    /**
     * This returns if the loader support the current file information.
     * @param extension defines the file extension of the file being loaded
     * @param mimeType defines the optional mime type of the file being loaded
     * @returns true if the loader can load the specified file
     */
    canLoad(extension: string, mimeType?: string): boolean;
    /**
     * Uploads the cube texture data to the WebGL texture. It has already been bound.
     * @param data contains the texture data
     * @param texture defines the BabylonJS internal texture
     * @param createPolynomials will be true if polynomials have been requested
     * @param onLoad defines the callback to trigger once the texture is ready
     */
    loadCubeData(data: ArrayBufferView | ArrayBufferView[], texture: InternalTexture, createPolynomials: boolean, onLoad: Nullable<(data?: any) => void>): void;
    /**
     * Uploads the 2D texture data to the WebGL texture. It has already been bound once in the callback.
     * @param data contains the texture data
     * @param texture defines the BabylonJS internal texture
     * @param callback defines the method to call once ready to upload
     * @param options
     */
    loadData(data: ArrayBufferView, texture: InternalTexture, callback: (width: number, height: number, loadMipmap: boolean, isCompressed: boolean, done: () => void, loadFailed: boolean) => void, options?: any): void;
}
