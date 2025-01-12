import { RawTexture } from "../Textures/rawTexture";
import { MaterialPluginBase } from "../materialPluginBase";
import type { Scene } from "../../scene";
import type { UniformBuffer } from "../uniformBuffer";
import { Vector2 } from "../../Maths/math.vector";
import type { Color3 } from "../../Maths/math.color";
import type { Nullable } from "../../types";
import type { Material } from "../material";
import { MaterialDefines } from "../materialDefines";
import type { AbstractMesh } from "../../Meshes/abstractMesh";
import type { BaseTexture } from "../Textures/baseTexture";
import type { GreasedLineMaterialOptions, IGreasedLineMaterial } from "./greasedLineMaterialInterfaces";
import { GreasedLineMeshColorDistributionType, GreasedLineMeshColorMode } from "./greasedLineMaterialInterfaces";
/**
 * @internal
 */
export declare class MaterialGreasedLineDefines extends MaterialDefines {
    /**
     * The material has a color option specified
     */
    GREASED_LINE_HAS_COLOR: boolean;
    /**
     * The material's size attenuation optiom
     */
    GREASED_LINE_SIZE_ATTENUATION: boolean;
    /**
     * The type of color distribution is set to line this value equals to true.
     */
    GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE: boolean;
    /**
     * True if scene is in right handed coordinate system.
     */
    GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM: boolean;
    /**
     * True if the line is in camera facing mode
     */
    GREASED_LINE_CAMERA_FACING: boolean;
}
/**
 * GreasedLinePluginMaterial for GreasedLineMesh/GreasedLineRibbonMesh.
 * Use the GreasedLineBuilder.CreateGreasedLineMaterial function to create and instance of this class.
 */
export declare class GreasedLinePluginMaterial extends MaterialPluginBase implements IGreasedLineMaterial {
    /**
     * Plugin name
     */
    static readonly GREASED_LINE_MATERIAL_NAME = "GreasedLinePluginMaterial";
    /**
     * Whether to use the colors option to colorize the line
     */
    useColors: boolean;
    /**
     * Normalized value of how much of the line will be visible
     * 0 - 0% of the line will be visible
     * 1 - 100% of the line will be visible
     */
    visibility: number;
    /**
     * Dash offset
     */
    dashOffset: number;
    /**
     * Length of the dash. 0 to 1. 0.5 means half empty, half drawn.
     */
    dashRatio: number;
    /**
     * Line base width. At each point the line width is calculated by widths[pointIndex] * width
     */
    width: number;
    /**
     * The type of sampling of the colors texture. The values are the same when using with textures.
     */
    colorsSampling: number;
    /**
     * Turns on/off dash mode
     */
    useDash: boolean;
    /**
     * The mixing mode of the color paramater. Default value is GreasedLineMeshColorMode.SET
     * @see GreasedLineMeshColorMode
     */
    colorMode: GreasedLineMeshColorMode;
    /**
     * You can provide a colorsTexture to use instead of one generated from the 'colors' option
     */
    colorsTexture: Nullable<RawTexture>;
    private _scene;
    private _dashCount;
    private _dashArray;
    private _color;
    private _colors;
    private _colorsDistributionType;
    private _resolution;
    private _aspect;
    private _sizeAttenuation;
    private _cameraFacing;
    private _engine;
    /**
     * Creates a new instance of the GreasedLinePluginMaterial
     * @param material base material for the plugin
     * @param scene the scene
     * @param options plugin options
     */
    constructor(material: Material, scene?: Scene, options?: GreasedLineMaterialOptions);
    /**
     * Get the shader attributes
     * @param attributes array which will be filled with the attributes
     */
    getAttributes(attributes: string[]): void;
    /**
     * Get the shader samplers
     * @param samplers
     */
    getSamplers(samplers: string[]): void;
    /**
     * Get the shader textures
     * @param activeTextures array which will be filled with the textures
     */
    getActiveTextures(activeTextures: BaseTexture[]): void;
    /**
     * Get the shader uniforms
     * @returns uniforms
     */
    getUniforms(): {
        ubo: {
            name: string;
            size: number;
            type: string;
        }[];
        vertex: string;
        fragment: string;
    };
    get isEnabled(): boolean;
    /**
     * Bind the uniform buffer
     * @param uniformBuffer
     */
    bindForSubMesh(uniformBuffer: UniformBuffer): void;
    /**
     * Prepare the defines
     * @param defines
     * @param _scene
     * @param _mesh
     */
    prepareDefines(defines: MaterialGreasedLineDefines, _scene: Scene, _mesh: AbstractMesh): void;
    /**
     * Get the class name
     * @returns class name
     */
    getClassName(): string;
    /**
     * Get shader code
     * @param shaderType vertex/fragment
     * @returns shader code
     */
    getCustomCode(shaderType: string): Nullable<{
        [pointName: string]: string;
    }>;
    /**
     * Disposes the plugin material.
     */
    dispose(): void;
    /**
     * Returns the colors used to colorize the line
     */
    get colors(): Nullable<Color3[]>;
    /**
     * Sets the colors used to colorize the line
     */
    set colors(value: Nullable<Color3[]>);
    /**
     * Creates or updates the colors texture
     * @param colors color table RGBA
     * @param lazy if lazy, the colors are not updated
     * @param forceNewTexture force creation of a new texture
     */
    setColors(colors: Nullable<Color3[]>, lazy?: boolean, forceNewTexture?: boolean): void;
    /**
     * Updates the material. Use when material created in lazy mode.
     */
    updateLazy(): void;
    /**
     * Gets the number of dashes in the line
     */
    get dashCount(): number;
    /**
     * Sets the number of dashes in the line
     * @param value dash
     */
    set dashCount(value: number);
    /**
     * If set to true the line will be rendered always with the same width regardless how far it is located from the camera.
     * Not supported for non camera facing lines.
     */
    get sizeAttenuation(): boolean;
    /**
     * Turn on/off size attenuation of the width option and widths array.
     * Not supported for non camera facing lines.
     * @param value If set to true the line will be rendered always with the same width regardless how far it is located from the camera.
     */
    set sizeAttenuation(value: boolean);
    /**
     * Gets the color of the line
     */
    get color(): Nullable<Color3>;
    /**
     * Sets the color of the line
     * @param value Color3 or null to clear the color. You need to clear the color if you use colors and useColors = true
     */
    set color(value: Nullable<Color3>);
    /**
     * Sets the color of the line. If set the whole line will be mixed with this color according to the colorMode option.
     * @param value color
     * @param doNotMarkDirty if true, the material will not be marked as dirty
     */
    setColor(value: Nullable<Color3>, doNotMarkDirty?: boolean): void;
    /**
     * Gets the color distributiopn type
     */
    get colorsDistributionType(): GreasedLineMeshColorDistributionType;
    /**
     * Sets the color distribution type
     * @see GreasedLineMeshColorDistributionType
     * @param value color distribution type
     */
    set colorsDistributionType(value: GreasedLineMeshColorDistributionType);
    /**
     * Gets the resolution
     */
    get resolution(): Vector2;
    /**
     * Sets the resolution
     * @param value resolution of the screen for GreasedLine
     */
    set resolution(value: Vector2);
    /**
     * Serializes this plugin material
     * @returns serializationObjec
     */
    serialize(): any;
    /**
     * Parses a serialized objects
     * @param source serialized object
     * @param scene scene
     * @param rootUrl root url for textures
     */
    parse(source: any, scene: Scene, rootUrl: string): void;
    /**
     * Makes a duplicate of the current configuration into another one.
     * @param plugin define the config where to copy the info
     */
    copyTo(plugin: MaterialPluginBase): void;
}
