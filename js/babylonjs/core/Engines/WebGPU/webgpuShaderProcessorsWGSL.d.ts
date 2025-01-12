import type { Nullable } from "../../types";
import type { ShaderProcessingContext } from "../Processors/shaderProcessingOptions";
import type { WebGPUBufferDescription } from "./webgpuShaderProcessingContext";
import { WebGPUShaderProcessor } from "./webgpuShaderProcessor";
import "../../ShadersWGSL/ShadersInclude/bonesDeclaration";
import "../../ShadersWGSL/ShadersInclude/bonesVertex";
import "../../ShadersWGSL/ShadersInclude/bakedVertexAnimationDeclaration";
import "../../ShadersWGSL/ShadersInclude/bakedVertexAnimation";
import "../../ShadersWGSL/ShadersInclude/clipPlaneFragment";
import "../../ShadersWGSL/ShadersInclude/clipPlaneFragmentDeclaration";
import "../../ShadersWGSL/ShadersInclude/clipPlaneVertex";
import "../../ShadersWGSL/ShadersInclude/clipPlaneVertexDeclaration";
import "../../ShadersWGSL/ShadersInclude/instancesDeclaration";
import "../../ShadersWGSL/ShadersInclude/instancesVertex";
import "../../ShadersWGSL/ShadersInclude/helperFunctions";
import "../../ShadersWGSL/ShadersInclude/fresnelFunction";
import "../../ShadersWGSL/ShadersInclude/meshUboDeclaration";
import "../../ShadersWGSL/ShadersInclude/morphTargetsVertex";
import "../../ShadersWGSL/ShadersInclude/morphTargetsVertexDeclaration";
import "../../ShadersWGSL/ShadersInclude/morphTargetsVertexGlobal";
import "../../ShadersWGSL/ShadersInclude/morphTargetsVertexGlobalDeclaration";
import "../../ShadersWGSL/ShadersInclude/sceneUboDeclaration";
import { ShaderLanguage } from "../../Materials/shaderLanguage";
/** @internal */
export declare class WebGPUShaderProcessorWGSL extends WebGPUShaderProcessor {
    protected _attributesInputWGSL: string[];
    protected _attributesWGSL: string[];
    protected _attributesConversionCodeWGSL: string[];
    protected _hasNonFloatAttribute: boolean;
    protected _varyingsWGSL: string[];
    protected _varyingNamesWGSL: string[];
    protected _stridedUniformArrays: string[];
    shaderLanguage: ShaderLanguage;
    uniformRegexp: RegExp;
    textureRegexp: RegExp;
    noPrecision: boolean;
    protected _getArraySize(name: string, uniformType: string, preProcessors: {
        [key: string]: string;
    }): [string, string, number];
    initializeShaders(processingContext: Nullable<ShaderProcessingContext>): void;
    preProcessShaderCode(code: string): string;
    varyingCheck(varying: string, isFragment: boolean): boolean;
    varyingProcessor(varying: string, isFragment: boolean, preProcessors: {
        [key: string]: string;
    }): string;
    attributeProcessor(attribute: string, preProcessors: {
        [key: string]: string;
    }): string;
    uniformProcessor(uniform: string, isFragment: boolean, preProcessors: {
        [key: string]: string;
    }): string;
    textureProcessor(texture: string, isFragment: boolean, preProcessors: {
        [key: string]: string;
    }): string;
    postProcessor(code: string, defines: string[]): string;
    finalizeShaders(vertexCode: string, fragmentCode: string): {
        vertexCode: string;
        fragmentCode: string;
    };
    protected _generateLeftOverUBOCode(name: string, uniformBufferDescription: WebGPUBufferDescription): string;
    private _processSamplers;
    private _processCustomBuffers;
    private _processStridedUniformArrays;
}
