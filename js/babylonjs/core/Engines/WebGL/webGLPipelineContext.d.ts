import type { IPipelineContext } from "../IPipelineContext";
import type { Nullable } from "../../types";
import type { Effect } from "../../Materials/effect";
import type { IMatrixLike, IVector2Like, IVector3Like, IVector4Like, IColor3Like, IColor4Like, IQuaternionLike } from "../../Maths/math.like";
import type { ThinEngine } from "../thinEngine";
import type { AbstractEngine } from "../abstractEngine";
/** @internal */
export declare class WebGLPipelineContext implements IPipelineContext {
    private _valueCache;
    private _uniforms;
    engine: ThinEngine;
    program: Nullable<WebGLProgram>;
    context?: WebGLRenderingContext;
    vertexShader?: WebGLShader;
    fragmentShader?: WebGLShader;
    isParallelCompiled: boolean;
    onCompiled?: () => void;
    transformFeedback?: WebGLTransformFeedback | null;
    vertexCompilationError: Nullable<string>;
    fragmentCompilationError: Nullable<string>;
    programLinkError: Nullable<string>;
    programValidationError: Nullable<string>;
    /** @internal */
    _isDisposed: boolean;
    get isAsync(): boolean;
    get isReady(): boolean;
    _handlesSpectorRebuildCallback(onCompiled: (program: WebGLProgram) => void): void;
    setEngine(engine: AbstractEngine): void;
    _fillEffectInformation(effect: Effect, uniformBuffersNames: {
        [key: string]: number;
    }, uniformsNames: string[], uniforms: {
        [key: string]: Nullable<WebGLUniformLocation>;
    }, samplerList: string[], samplers: {
        [key: string]: number;
    }, attributesNames: string[], attributes: number[]): void;
    /**
     * Release all associated resources.
     **/
    dispose(): void;
    /**
     * @internal
     */
    _cacheMatrix(uniformName: string, matrix: IMatrixLike): boolean;
    /**
     * @internal
     */
    _cacheFloat2(uniformName: string, x: number, y: number): boolean;
    /**
     * @internal
     */
    _cacheFloat3(uniformName: string, x: number, y: number, z: number): boolean;
    /**
     * @internal
     */
    _cacheFloat4(uniformName: string, x: number, y: number, z: number, w: number): boolean;
    /**
     * Sets an integer value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param value Value to be set.
     */
    setInt(uniformName: string, value: number): void;
    /**
     * Sets a int2 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First int in int2.
     * @param y Second int in int2.
     */
    setInt2(uniformName: string, x: number, y: number): void;
    /**
     * Sets a int3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First int in int3.
     * @param y Second int in int3.
     * @param z Third int in int3.
     */
    setInt3(uniformName: string, x: number, y: number, z: number): void;
    /**
     * Sets a int4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First int in int4.
     * @param y Second int in int4.
     * @param z Third int in int4.
     * @param w Fourth int in int4.
     */
    setInt4(uniformName: string, x: number, y: number, z: number, w: number): void;
    /**
     * Sets an int array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setIntArray(uniformName: string, array: Int32Array): void;
    /**
     * Sets an int array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setIntArray2(uniformName: string, array: Int32Array): void;
    /**
     * Sets an int array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setIntArray3(uniformName: string, array: Int32Array): void;
    /**
     * Sets an int array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setIntArray4(uniformName: string, array: Int32Array): void;
    /**
     * Sets an unsigned integer value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param value Value to be set.
     */
    setUInt(uniformName: string, value: number): void;
    /**
     * Sets an unsigned int2 value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First unsigned int in uint2.
     * @param y Second unsigned int in uint2.
     */
    setUInt2(uniformName: string, x: number, y: number): void;
    /**
     * Sets an unsigned int3 value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First unsigned int in uint3.
     * @param y Second unsigned int in uint3.
     * @param z Third unsigned int in uint3.
     */
    setUInt3(uniformName: string, x: number, y: number, z: number): void;
    /**
     * Sets an unsigned int4 value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First unsigned int in uint4.
     * @param y Second unsigned int in uint4.
     * @param z Third unsigned int in uint4.
     * @param w Fourth unsigned int in uint4.
     */
    setUInt4(uniformName: string, x: number, y: number, z: number, w: number): void;
    /**
     * Sets an unsigned int array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setUIntArray(uniformName: string, array: Uint32Array): void;
    /**
     * Sets an unsigned int array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setUIntArray2(uniformName: string, array: Uint32Array): void;
    /**
     * Sets an unsigned int array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setUIntArray3(uniformName: string, array: Uint32Array): void;
    /**
     * Sets an unsigned int array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setUIntArray4(uniformName: string, array: Uint32Array): void;
    /**
     * Sets an array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setArray(uniformName: string, array: number[]): void;
    /**
     * Sets an array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setArray2(uniformName: string, array: number[]): void;
    /**
     * Sets an array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setArray3(uniformName: string, array: number[]): void;
    /**
     * Sets an array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     */
    setArray4(uniformName: string, array: number[]): void;
    /**
     * Sets matrices on a uniform variable.
     * @param uniformName Name of the variable.
     * @param matrices matrices to be set.
     */
    setMatrices(uniformName: string, matrices: Float32Array): void;
    /**
     * Sets matrix on a uniform variable.
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     */
    setMatrix(uniformName: string, matrix: IMatrixLike): void;
    /**
     * Sets a 3x3 matrix on a uniform variable. (Specified as [1,2,3,4,5,6,7,8,9] will result in [1,2,3][4,5,6][7,8,9] matrix)
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     */
    setMatrix3x3(uniformName: string, matrix: Float32Array): void;
    /**
     * Sets a 2x2 matrix on a uniform variable. (Specified as [1,2,3,4] will result in [1,2][3,4] matrix)
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     */
    setMatrix2x2(uniformName: string, matrix: Float32Array): void;
    /**
     * Sets a float on a uniform variable.
     * @param uniformName Name of the variable.
     * @param value value to be set.
     */
    setFloat(uniformName: string, value: number): void;
    /**
     * Sets a Vector2 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector2 vector2 to be set.
     */
    setVector2(uniformName: string, vector2: IVector2Like): void;
    /**
     * Sets a float2 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First float in float2.
     * @param y Second float in float2.
     */
    setFloat2(uniformName: string, x: number, y: number): void;
    /**
     * Sets a Vector3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector3 Value to be set.
     */
    setVector3(uniformName: string, vector3: IVector3Like): void;
    /**
     * Sets a float3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First float in float3.
     * @param y Second float in float3.
     * @param z Third float in float3.
     */
    setFloat3(uniformName: string, x: number, y: number, z: number): void;
    /**
     * Sets a Vector4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector4 Value to be set.
     */
    setVector4(uniformName: string, vector4: IVector4Like): void;
    /**
     * Sets a Quaternion on a uniform variable.
     * @param uniformName Name of the variable.
     * @param quaternion Value to be set.
     */
    setQuaternion(uniformName: string, quaternion: IQuaternionLike): void;
    /**
     * Sets a float4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First float in float4.
     * @param y Second float in float4.
     * @param z Third float in float4.
     * @param w Fourth float in float4.
     */
    setFloat4(uniformName: string, x: number, y: number, z: number, w: number): void;
    /**
     * Sets a Color3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param color3 Value to be set.
     */
    setColor3(uniformName: string, color3: IColor3Like): void;
    /**
     * Sets a Color4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param color3 Value to be set.
     * @param alpha Alpha value to be set.
     */
    setColor4(uniformName: string, color3: IColor3Like, alpha: number): void;
    /**
     * Sets a Color4 on a uniform variable
     * @param uniformName defines the name of the variable
     * @param color4 defines the value to be set
     */
    setDirectColor4(uniformName: string, color4: IColor4Like): void;
    _getVertexShaderCode(): string | null;
    _getFragmentShaderCode(): string | null;
}
