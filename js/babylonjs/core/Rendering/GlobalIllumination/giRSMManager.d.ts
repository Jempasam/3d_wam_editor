/**
 * Reflective Shadow Maps were first described in http://www.klayge.org/material/3_12/GI/rsm.pdf by Carsten Dachsbacher and Marc Stamminger
 * Further explanations and implementations can be found in:
 * - Jaker video explaining RSM and its implementation: https://www.youtube.com/watch?v=LJQQdBsOYPM
 * - C++ implementation by Luis Angel: https://github.com/imyoungmin/RSM
 * - Javascript implementation by Erkaman: https://github.com/Erkaman/webgl-rsm
 */
import type { Scene } from "../../scene.js";
import type { GIRSM } from "./giRSM.js";
import type { Material } from "../../Materials/material.js";
import { MaterialPluginBase } from "../../Materials/materialPluginBase.js";
import type { InternalTexture } from "../../Materials/Textures/internalTexture.js";
import type { StandardMaterial } from "../../Materials/standardMaterial.js";
import { PBRBaseMaterial } from "../../Materials/PBR/pbrBaseMaterial.js";
import type { UniformBuffer } from "../../Materials/uniformBuffer.js";
import { MaterialDefines } from "../../Materials/materialDefines.js";
import "../../Shaders/bilateralBlur.fragment";
import "../../Shaders/bilateralBlurQuality.fragment";
import "../../Shaders/rsmGlobalIllumination.fragment";
import "../../Shaders/rsmFullGlobalIllumination.fragment";
/**
 * Class used to manage the global illumination contribution calculated from reflective shadow maps (RSM).
 */
export declare class GIRSMManager {
    private _scene;
    private _engine;
    private _giRSM;
    private _materialsWithRenderPlugin;
    private _sampleTexture;
    private _maxSamples;
    private _blurRTT;
    private _blurPostProcesses;
    private _blurXPostprocess;
    private _blurYPostprocess;
    private _upsamplingXPostprocess;
    private _upsamplingYPostprocess;
    private _ppGlobalIllumination;
    private _drawPhaseObserver;
    private _debugLayer;
    private _counters;
    private _countersRTW;
    private _firstActivation;
    private _geomBufferEnabled;
    private _geomBufferEnablePosition;
    private _tempMatrix;
    private _enable;
    /**
     * Defines the default texture types and formats used by the geometry buffer renderer.
     */
    static GeometryBufferTextureTypesAndFormats: {
        [key: number]: {
            textureType: number;
            textureFormat: number;
        };
    };
    /**
     * Enables or disables the manager. Default is false.
     * If disabled, the global illumination won't be calculated and the scene will be rendered normally, without any global illumination contribution.
     */
    get enable(): boolean;
    set enable(enable: boolean);
    /**
     * Defines if the global illumination calculation is paused or not.
     * Use this setting to pause the global illumination calculation when you know that the scene (camera/mesh/light positions) is not changing anymore to save some GPU power.
     * The scene will still be rendered with the latest global illumination contribution.
     */
    pause: boolean;
    private _enableBlur;
    /**
     * Defines if the global illumination contribution should be blurred or not (using a bilateral blur). Default is true.
     */
    get enableBlur(): boolean;
    set enableBlur(enable: boolean);
    private _useQualityBlur;
    /**
     * Defines if the blur should be done with a better quality but slower or not. Default is false.
     */
    get useQualityBlur(): boolean;
    set useQualityBlur(enable: boolean);
    /**
     * Defines the depth threshold used by the bilateral blur post-processes (also used by the upsampling, if enabled).
     * You may have to change this value, depending on your scene.
     */
    blurDepthThreshold: number;
    /**
     * Defines the normal threshold used by the bilateral blur post-processes (also used by the upsampling, if enabled).
     * You may have to change this value, depending on your scene.
     */
    blurNormalThreshold: number;
    /**
     * Defines the kernel size used by the bilateral blur post-processes. Default is 12.
     */
    blurKernel: number;
    private _forceFullSizeBlur;
    /**
     * Defines if the blur should be done at full resolution or not. Default is false.
     * If this setting is enabled, upampling will be disabled (ignored) as it is not needed anymore.
     */
    get fullSizeBlur(): boolean;
    set fullSizeBlur(mode: boolean);
    private _useQualityUpsampling;
    /**
     * Defines if the upsampling should be done with a better quality but slower or not. Default is false.
     */
    get useQualityUpsampling(): boolean;
    set useQualityUpsampling(enable: boolean);
    /**
     * Defines the kernel size used by the bilateral upsampling post-processes. Default is 6.
     */
    upsamplerKernel: number;
    private _showOnlyGI;
    /**
     * Defines if the debug layer should be enabled or not. Default is false.
     * Use this setting for debugging purpose, to show the global illumination contribution only.
     */
    get showOnlyGI(): boolean;
    set showOnlyGI(show: boolean);
    private _use32BitsDepthBuffer;
    /**
     * Defines if the depth buffer used by the geometry buffer renderer should be 32 bits or not. Default is false (16 bits).
     */
    get use32BitsDepthBuffer(): boolean;
    set use32BitsDepthBuffer(enable: boolean);
    private _outputDimensions;
    /**
     * Sets the output dimensions of the final process. It should normally be the same as the output dimensions of the screen.
     * @param dimensions The dimensions of the output texture (width and height)
     */
    setOutputDimensions(dimensions: {
        width: number;
        height: number;
    }): void;
    private _giTextureDimensions;
    /**
     * Sets the dimensions of the GI texture. Try to use the smallest size possible for better performance.
     * @param dimensions The dimensions of the GI texture (width and height)
     */
    setGITextureDimensions(dimensions: {
        width: number;
        height: number;
    }): void;
    private _giTextureType;
    /**
     * Gets or sets the texture type used by the GI texture. Default is Constants.TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV.
     */
    get giTextureType(): number;
    set giTextureType(textureType: number);
    /**
     * Gets the list of GIRSM used by the manager.
     */
    get giRSM(): GIRSM[];
    /**
     * Adds a (list of) GIRSM to the manager.
     * @param rsm The GIRSM (or array of GIRSM) to add to the manager
     */
    addGIRSM(rsm: GIRSM | GIRSM[]): void;
    /**
     * Removes a (list of) GIRSM from the manager.
     * @param rsm The GIRSM (or array of GIRSM) to remove from the manager
     */
    removeGIRSM(rsm: GIRSM | GIRSM[]): void;
    /**
     * Add a material to the manager. This will enable the global illumination contribution for the material.
     * @param material Material that will be affected by the global illumination contribution. If not provided, all materials of the scene will be affected.
     */
    addMaterial(material?: Material): void;
    /**
     * Gets the list of GPU counters used by the manager.
     * GPU timing measurements must be enabled for the counters to be filled (engine.enableGPUTimingMeasurements = true).
     * Only available with WebGPU. You will still get the list of counters with other engines but the values will always be 0.
     */
    get countersGPU(): Array<{
        name: string;
        value: number;
    }>;
    /**
     * Recreates the resources used by the manager.
     * You should normally not have to call this method manually, except if you change the useFullTexture property of a GIRSM, because the manager won't track this change.
     * @param disposeGeometryBufferRenderer Defines if the geometry buffer renderer should be disposed and recreated. Default is false.
     */
    recreateResources(disposeGeometryBufferRenderer?: boolean): void;
    /**
     * Generates the sample texture used by the the global illumination calculation process.
     * @param maxSamples The maximum number of samples to generate in the texture. Default value is 2048. The numSamples property of the GIRSM should be less than or equal to this value!
     */
    generateSampleTexture(maxSamples: number): void;
    /**
     * Disposes the manager.
     */
    dispose(): void;
    /**
     * Creates a new GIRSMManager
     * @param scene The scene
     * @param outputDimensions The dimensions of the output texture (width and height). Should normally be the same as the output dimensions of the screen.
     * @param giTextureDimensions The dimensions of the GI texture (width and height). Try to use the smallest size possible for better performance.
     * @param maxSamples The maximum number of samples to generate in the sample texture. Default value is 2048. The numSamples property of the GIRSM should be less than or equal to this value!
     * @param giTextureType The texture type used by the GI texture. Default is Constants.TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV.
     */
    constructor(scene: Scene, outputDimensions: {
        width: number;
        height: number;
    }, giTextureDimensions?: {
        width: number;
        height: number;
    }, maxSamples?: number, giTextureType?: number);
    protected _disposePostProcesses(disposeGeometryBufferRenderer?: boolean): void;
    protected _setPluginParameters(): void;
    protected _createPostProcesses(): void;
    protected _addGISupportToMaterial(material: Material): void;
}
/**
 * @internal
 */
declare class MaterialGIRSMRenderDefines extends MaterialDefines {
    RENDER_WITH_GIRSM: boolean;
    RSMCREATE_PROJTEXTURE: boolean;
}
/**
 * Plugin used to render the global illumination contribution.
 */
export declare class GIRSMRenderPluginMaterial extends MaterialPluginBase {
    private _isPBR;
    /**
     * Defines the name of the plugin.
     */
    static readonly Name = "GIRSMRender";
    /**
     * The texture containing the global illumination contribution.
     */
    textureGIContrib: InternalTexture;
    /**
     * The width of the output texture.
     */
    outputTextureWidth: number;
    /**
     * The height of the output texture.
     */
    outputTextureHeight: number;
    private _isEnabled;
    /**
     * Defines if the plugin is enabled in the material.
     */
    isEnabled: boolean;
    protected _markAllSubMeshesAsTexturesDirty(): void;
    private _internalMarkAllSubMeshesAsTexturesDirty;
    constructor(material: Material | StandardMaterial | PBRBaseMaterial);
    prepareDefines(defines: MaterialGIRSMRenderDefines): void;
    getClassName(): string;
    getUniforms(): {
        ubo: {
            name: string;
            size: number;
            type: string;
        }[];
        fragment: string;
    };
    getSamplers(samplers: string[]): void;
    bindForSubMesh(uniformBuffer: UniformBuffer): void;
    getCustomCode(shaderType: string): {
        [name: string]: string;
    } | null;
}
export {};
