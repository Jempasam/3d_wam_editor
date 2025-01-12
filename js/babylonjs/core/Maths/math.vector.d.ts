import type { Viewport } from "./math.viewport";
import type { DeepImmutable, Nullable, FloatArray, float, Tuple } from "../types";
import type { Plane } from "./math.plane";
import type { TransformNode } from "../Meshes/transformNode";
import type { Dimension, Tensor, TensorStatic } from "./tensor";
import type { IVector2Like, IVector3Like, IVector4Like, IQuaternionLike, IMatrixLike, IPlaneLike } from "./math.like";
/**
 * Represents a vector of any dimension
 */
export interface Vector<N extends number[] = number[]> extends Tensor<N> {
    /**
     * @see Tensor.dimension
     */
    readonly dimension: Readonly<Dimension<N>>;
    /**
     * @see Tensor.rank
     */
    readonly rank: 1;
    /**
     * Gets the length of the vector
     * @returns the vector length (float)
     */
    length(): number;
    /**
     * Gets the vector squared length
     * @returns the vector squared length (float)
     */
    lengthSquared(): number;
    /**
     * Normalize the vector
     * @returns the current updated Vector
     */
    normalize(): this;
    /**
     * Normalize the current Vector with the given input length.
     * Please note that this is an in place operation.
     * @param len the length of the vector
     * @returns the current updated Vector
     */
    normalizeFromLength(len: number): this;
    /**
     * Normalize the current Vector to a new vector
     * @returns the new Vector
     */
    normalizeToNew(): this;
    /**
     * Normalize the current Vector to the reference
     * @param reference define the Vector to update
     * @returns the updated Vector
     */
    normalizeToRef(reference: this): this;
}
/**
 * Static side of Vector
 */
export interface VectorStatic<T extends Vector> extends TensorStatic<T> {
    /**
     * Checks if a given vector is inside a specific range
     * @param v defines the vector to test
     * @param min defines the minimum range
     * @param max defines the maximum range
     */
    CheckExtends(v: T, min: T, max: T): void;
    /**
     * Returns a new Vector equal to the normalized given vector
     * @param vector defines the vector to normalize
     * @returns a new Vector
     */
    Normalize(vector: DeepImmutable<T>): T;
    /**
     * Normalize a given vector into a second one
     * @param vector defines the vector to normalize
     * @param result defines the vector where to store the result
     * @returns result input
     */
    NormalizeToRef(vector: DeepImmutable<T>, result: T): T;
}
/**
 * Class representing a vector containing 2 coordinates
 * Example Playground - Overview -  https://playground.babylonjs.com/#QYBWV4#9
 */
export declare class Vector2 implements Vector<Tuple<number, 2>>, IVector2Like {
    /** defines the first coordinate */
    x: number;
    /** defines the second coordinate */
    y: number;
    private static _ZeroReadOnly;
    /**
     * @see Tensor.dimension
     */
    readonly dimension: Readonly<[2]>;
    /**
     * @see Tensor.rank
     */
    readonly rank: 1;
    /**
     * Creates a new Vector2 from the given x and y coordinates
     * @param x defines the first coordinate
     * @param y defines the second coordinate
     */
    constructor(
    /** defines the first coordinate */
    x?: number, 
    /** defines the second coordinate */
    y?: number);
    /**
     * Gets a string with the Vector2 coordinates
     * @returns a string with the Vector2 coordinates
     */
    toString(): string;
    /**
     * Gets class name
     * @returns the string "Vector2"
     */
    getClassName(): string;
    /**
     * Gets current vector hash code
     * @returns the Vector2 hash code as a number
     */
    getHashCode(): number;
    /**
     * Sets the Vector2 coordinates in the given array or Float32Array from the given index.
     * Example Playground https://playground.babylonjs.com/#QYBWV4#15
     * @param array defines the source array
     * @param index defines the offset in source array
     * @returns the current Vector2
     */
    toArray(array: FloatArray, index?: number): this;
    /**
     * Update the current vector from an array
     * Example Playground https://playground.babylonjs.com/#QYBWV4#39
     * @param array defines the destination array
     * @param offset defines the offset in the destination array
     * @returns the current Vector2
     */
    fromArray(array: FloatArray, offset?: number): this;
    /**
     * Copy the current vector to an array
     * Example Playground https://playground.babylonjs.com/#QYBWV4#40
     * @returns a new array with 2 elements: the Vector2 coordinates.
     */
    asArray(): [number, number];
    /**
     * Sets the Vector2 coordinates with the given Vector2 coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#24
     * @param source defines the source Vector2
     * @returns the current updated Vector2
     */
    copyFrom(source: DeepImmutable<this>): this;
    /**
     * Sets the Vector2 coordinates with the given floats
     * Example Playground https://playground.babylonjs.com/#QYBWV4#25
     * @param x defines the first coordinate
     * @param y defines the second coordinate
     * @returns the current updated Vector2
     */
    copyFromFloats(x: number, y: number): this;
    /**
     * Sets the Vector2 coordinates with the given floats
     * Example Playground https://playground.babylonjs.com/#QYBWV4#62
     * @param x defines the first coordinate
     * @param y defines the second coordinate
     * @returns the current updated Vector2
     */
    set(x: number, y: number): this;
    /**
     * Copies the given float to the current Vector2 coordinates
     * @param v defines the x and y coordinates of the operand
     * @returns the current updated Vector2
     */
    setAll(v: number): this;
    /**
     * Add another vector with the current one
     * Example Playground https://playground.babylonjs.com/#QYBWV4#11
     * @param otherVector defines the other vector
     * @returns a new Vector2 set with the addition of the current Vector2 and the given one coordinates
     */
    add(otherVector: DeepImmutable<this>): this;
    /**
     * Sets the "result" coordinates with the addition of the current Vector2 and the given one coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#12
     * @param otherVector defines the other vector
     * @param result defines the target vector
     * @returns result input
     */
    addToRef<T extends this>(otherVector: DeepImmutable<this>, result: T): T;
    /**
     * Set the Vector2 coordinates by adding the given Vector2 coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#13
     * @param otherVector defines the other vector
     * @returns the current updated Vector2
     */
    addInPlace(otherVector: DeepImmutable<this>): this;
    /**
     * Adds the given coordinates to the current Vector2
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @returns the current updated Vector2
     */
    addInPlaceFromFloats(x: number, y: number): this;
    /**
     * Gets a new Vector2 by adding the current Vector2 coordinates to the given Vector3 x, y coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#14
     * @param otherVector defines the other vector
     * @returns a new Vector2
     */
    addVector3(otherVector: Vector3): this;
    /**
     * Gets a new Vector2 set with the subtracted coordinates of the given one from the current Vector2
     * Example Playground https://playground.babylonjs.com/#QYBWV4#61
     * @param otherVector defines the other vector
     * @returns a new Vector2
     */
    subtract(otherVector: DeepImmutable<this>): this;
    /**
     * Sets the "result" coordinates with the subtraction of the given one from the current Vector2 coordinates.
     * Example Playground https://playground.babylonjs.com/#QYBWV4#63
     * @param otherVector defines the other vector
     * @param result defines the target vector
     * @returns result input
     */
    subtractToRef<T extends this>(otherVector: DeepImmutable<this>, result: T): T;
    /**
     * Sets the current Vector2 coordinates by subtracting from it the given one coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#88
     * @param otherVector defines the other vector
     * @returns the current updated Vector2
     */
    subtractInPlace(otherVector: DeepImmutable<this>): this;
    /**
     * Multiplies in place the current Vector2 coordinates by the given ones
     * Example Playground https://playground.babylonjs.com/#QYBWV4#43
     * @param otherVector defines the other vector
     * @returns the current updated Vector2
     */
    multiplyInPlace(otherVector: DeepImmutable<this>): this;
    /**
     * Returns a new Vector2 set with the multiplication of the current Vector2 and the given one coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#42
     * @param otherVector defines the other vector
     * @returns a new Vector2
     */
    multiply(otherVector: DeepImmutable<this>): this;
    /**
     * Sets "result" coordinates with the multiplication of the current Vector2 and the given one coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#44
     * @param otherVector defines the other vector
     * @param result defines the target vector
     * @returns result input
     */
    multiplyToRef<T extends this>(otherVector: DeepImmutable<this>, result: T): T;
    /**
     * Gets a new Vector2 set with the Vector2 coordinates multiplied by the given floats
     * Example Playground https://playground.babylonjs.com/#QYBWV4#89
     * @param x defines the first coordinate
     * @param y defines the second coordinate
     * @returns a new Vector2
     */
    multiplyByFloats(x: number, y: number): this;
    /**
     * Returns a new Vector2 set with the Vector2 coordinates divided by the given one coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#27
     * @param otherVector defines the other vector
     * @returns a new Vector2
     */
    divide(otherVector: DeepImmutable<this>): this;
    /**
     * Sets the "result" coordinates with the Vector2 divided by the given one coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#30
     * @param otherVector defines the other vector
     * @param result defines the target vector
     * @returns result input
     */
    divideToRef<T extends this>(otherVector: DeepImmutable<this>, result: T): T;
    /**
     * Divides the current Vector2 coordinates by the given ones
     * Example Playground https://playground.babylonjs.com/#QYBWV4#28
     * @param otherVector defines the other vector
     * @returns the current updated Vector2
     */
    divideInPlace(otherVector: DeepImmutable<this>): this;
    /**
     * Updates the current Vector2 with the minimal coordinate values between its and the given vector ones
     * @param other defines the second operand
     * @returns the current updated Vector2
     */
    minimizeInPlace(other: DeepImmutable<this>): this;
    /**
     * Updates the current Vector2 with the maximal coordinate values between its and the given vector ones.
     * @param other defines the second operand
     * @returns the current updated Vector2
     */
    maximizeInPlace(other: DeepImmutable<this>): this;
    /**
     * Updates the current Vector2 with the minimal coordinate values between its and the given coordinates
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @returns the current updated Vector2
     */
    minimizeInPlaceFromFloats(x: number, y: number): this;
    /**
     * Updates the current Vector2 with the maximal coordinate values between its and the given coordinates.
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @returns the current updated Vector2
     */
    maximizeInPlaceFromFloats(x: number, y: number): this;
    /**
     * Returns a new Vector2 set with the subtraction of the given floats from the current Vector2 coordinates
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @returns the resulting Vector2
     */
    subtractFromFloats(x: number, y: number): this;
    /**
     * Subtracts the given floats from the current Vector2 coordinates and set the given vector "result" with this result
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param result defines the Vector2 object where to store the result
     * @returns the result
     */
    subtractFromFloatsToRef<T extends this>(x: number, y: number, result: T): T;
    /**
     * Gets a new Vector2 with current Vector2 negated coordinates
     * @returns a new Vector2
     */
    negate(): this;
    /**
     * Negate this vector in place
     * Example Playground https://playground.babylonjs.com/#QYBWV4#23
     * @returns this
     */
    negateInPlace(): this;
    /**
     * Negate the current Vector2 and stores the result in the given vector "result" coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#41
     * @param result defines the Vector3 object where to store the result
     * @returns the result
     */
    negateToRef<T extends this>(result: T): T;
    /**
     * Multiply the Vector2 coordinates by
     * Example Playground https://playground.babylonjs.com/#QYBWV4#59
     * @param scale defines the scaling factor
     * @returns the current updated Vector2
     */
    scaleInPlace(scale: number): this;
    /**
     * Returns a new Vector2 scaled by "scale" from the current Vector2
     * Example Playground https://playground.babylonjs.com/#QYBWV4#52
     * @param scale defines the scaling factor
     * @returns a new Vector2
     */
    scale(scale: number): this;
    /**
     * Scale the current Vector2 values by a factor to a given Vector2
     * Example Playground https://playground.babylonjs.com/#QYBWV4#57
     * @param scale defines the scale factor
     * @param result defines the Vector2 object where to store the result
     * @returns result input
     */
    scaleToRef<T extends this>(scale: number, result: T): T;
    /**
     * Scale the current Vector2 values by a factor and add the result to a given Vector2
     * Example Playground https://playground.babylonjs.com/#QYBWV4#58
     * @param scale defines the scale factor
     * @param result defines the Vector2 object where to store the result
     * @returns result input
     */
    scaleAndAddToRef<T extends this>(scale: number, result: T): T;
    /**
     * Gets a boolean if two vectors are equals
     * Example Playground https://playground.babylonjs.com/#QYBWV4#31
     * @param otherVector defines the other vector
     * @returns true if the given vector coordinates strictly equal the current Vector2 ones
     */
    equals(otherVector: DeepImmutable<this>): boolean;
    /**
     * Gets a boolean if two vectors are equals (using an epsilon value)
     * Example Playground https://playground.babylonjs.com/#QYBWV4#32
     * @param otherVector defines the other vector
     * @param epsilon defines the minimal distance to consider equality
     * @returns true if the given vector coordinates are close to the current ones by a distance of epsilon.
     */
    equalsWithEpsilon(otherVector: DeepImmutable<this>, epsilon?: number): boolean;
    /**
     * Returns true if the current Vector2 coordinates equals the given floats
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @returns true if both vectors are equal
     */
    equalsToFloats(x: number, y: number): boolean;
    /**
     * Gets a new Vector2 from current Vector2 floored values
     * Example Playground https://playground.babylonjs.com/#QYBWV4#35
     * eg (1.2, 2.31) returns (1, 2)
     * @returns a new Vector2
     */
    floor(): this;
    /**
     * Gets the current Vector2's floored values and stores them in result
     * @param result the Vector2 to store the result in
     * @returns the result Vector2
     */
    floorToRef<T extends this>(result: T): T;
    /**
     * Gets a new Vector2 from current Vector2 fractional values
     * Example Playground https://playground.babylonjs.com/#QYBWV4#34
     * eg (1.2, 2.31) returns (0.2, 0.31)
     * @returns a new Vector2
     */
    fract(): this;
    /**
     * Gets the current Vector2's fractional values and stores them in result
     * @param result the Vector2 to store the result in
     * @returns the result Vector2
     */
    fractToRef<T extends this>(result: T): T;
    /**
     * Rotate the current vector into a given result vector
     * Example Playground https://playground.babylonjs.com/#QYBWV4#49
     * @param angle defines the rotation angle
     * @param result defines the result vector where to store the rotated vector
     * @returns result input
     */
    rotateToRef<T extends this>(angle: number, result: T): T;
    /**
     * Gets the length of the vector
     * @returns the vector length (float)
     */
    length(): number;
    /**
     * Gets the vector squared length
     * @returns the vector squared length (float)
     */
    lengthSquared(): number;
    /**
     * Normalize the vector
     * Example Playground https://playground.babylonjs.com/#QYBWV4#48
     * @returns the current updated Vector2
     */
    normalize(): this;
    /**
     * Normalize the current Vector2 with the given input length.
     * Please note that this is an in place operation.
     * @param len the length of the vector
     * @returns the current updated Vector2
     */
    normalizeFromLength(len: number): this;
    /**
     * Normalize the current Vector2 to a new vector
     * @returns the new Vector2
     */
    normalizeToNew(): this;
    /**
     * Normalize the current Vector2 to the reference
     * @param reference define the Vector to update
     * @returns the updated Vector2
     */
    normalizeToRef<T extends this>(reference: T): T;
    /**
     * Gets a new Vector2 copied from the Vector2
     * Example Playground https://playground.babylonjs.com/#QYBWV4#20
     * @returns a new Vector2
     */
    clone(): this;
    /**
     * Gets the dot product of the current vector and the vector "otherVector"
     * @param otherVector defines second vector
     * @returns the dot product (float)
     */
    dot(otherVector: DeepImmutable<this>): number;
    /**
     * Gets a new Vector2(0, 0)
     * @returns a new Vector2
     */
    static Zero(): Vector2;
    /**
     * Gets a new Vector2(1, 1)
     * @returns a new Vector2
     */
    static One(): Vector2;
    /**
     * Returns a new Vector2 with random values between min and max
     * @param min the minimum random value
     * @param max the maximum random value
     * @returns a Vector2 with random values between min and max
     */
    static Random(min?: number, max?: number): Vector2;
    /**
     * Sets a Vector2 with random values between min and max
     * @param min the minimum random value
     * @param max the maximum random value
     * @param ref the ref to store the values in
     * @returns the ref with random values between min and max
     */
    static RandomToRef<T extends Vector2>(min: number | undefined, max: number | undefined, ref: T): T;
    /**
     * Gets a zero Vector2 that must not be updated
     */
    static get ZeroReadOnly(): DeepImmutable<Vector2>;
    /**
     * Gets a new Vector2 set from the given index element of the given array
     * Example Playground https://playground.babylonjs.com/#QYBWV4#79
     * @param array defines the data source
     * @param offset defines the offset in the data source
     * @returns a new Vector2
     */
    static FromArray(array: DeepImmutable<ArrayLike<number>>, offset?: number): Vector2;
    /**
     * Sets "result" from the given index element of the given array
     * Example Playground https://playground.babylonjs.com/#QYBWV4#80
     * @param array defines the data source
     * @param offset defines the offset in the data source
     * @param result defines the target vector
     * @returns result input
     */
    static FromArrayToRef<T extends Vector2>(array: DeepImmutable<ArrayLike<number>>, offset: number, result: T): T;
    /**
     * Sets the given vector "result" with the given floats.
     * @param x defines the x coordinate of the source
     * @param y defines the y coordinate of the source
     * @param result defines the Vector2 where to store the result
     * @returns the result vector
     */
    static FromFloatsToRef<T extends Vector2>(x: number, y: number, result: T): T;
    /**
     * Gets a new Vector2 located for "amount" (float) on the CatmullRom spline defined by the given four Vector2
     * Example Playground https://playground.babylonjs.com/#QYBWV4#65
     * @param value1 defines 1st point of control
     * @param value2 defines 2nd point of control
     * @param value3 defines 3rd point of control
     * @param value4 defines 4th point of control
     * @param amount defines the interpolation factor
     * @returns a new Vector2
     */
    static CatmullRom<T extends Vector2>(value1: DeepImmutable<T>, value2: DeepImmutable<Vector2>, value3: DeepImmutable<Vector2>, value4: DeepImmutable<Vector2>, amount: number): T;
    /**
     * Sets reference with same the coordinates than "value" ones if the vector "value" is in the square defined by "min" and "max".
     * If a coordinate of "value" is lower than "min" coordinates, the returned Vector2 is given this "min" coordinate.
     * If a coordinate of "value" is greater than "max" coordinates, the returned Vector2 is given this "max" coordinate
     * @param value defines the value to clamp
     * @param min defines the lower limit
     * @param max defines the upper limit
     * @param ref the reference
     * @returns the reference
     */
    static ClampToRef<T extends Vector2>(value: DeepImmutable<T>, min: DeepImmutable<Vector2>, max: DeepImmutable<Vector2>, ref: T): T;
    /**
     * Returns a new Vector2 set with same the coordinates than "value" ones if the vector "value" is in the square defined by "min" and "max".
     * If a coordinate of "value" is lower than "min" coordinates, the returned Vector2 is given this "min" coordinate.
     * If a coordinate of "value" is greater than "max" coordinates, the returned Vector2 is given this "max" coordinate
     * Example Playground https://playground.babylonjs.com/#QYBWV4#76
     * @param value defines the value to clamp
     * @param min defines the lower limit
     * @param max defines the upper limit
     * @returns a new Vector2
     */
    static Clamp<T extends Vector2>(value: DeepImmutable<T>, min: DeepImmutable<Vector2>, max: DeepImmutable<Vector2>): T;
    /**
     * Returns a new Vector2 located for "amount" (float) on the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2"
     * Example Playground https://playground.babylonjs.com/#QYBWV4#81
     * @param value1 defines the 1st control point
     * @param tangent1 defines the outgoing tangent
     * @param value2 defines the 2nd control point
     * @param tangent2 defines the incoming tangent
     * @param amount defines the interpolation factor
     * @returns a new Vector2
     */
    static Hermite<T extends Vector2>(value1: DeepImmutable<T>, tangent1: DeepImmutable<Vector2>, value2: DeepImmutable<Vector2>, tangent2: DeepImmutable<Vector2>, amount: number): T;
    /**
     * Returns a new Vector2 which is the 1st derivative of the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2".
     * Example Playground https://playground.babylonjs.com/#QYBWV4#82
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @returns 1st derivative
     */
    static Hermite1stDerivative<T extends Vector2>(value1: DeepImmutable<T>, tangent1: DeepImmutable<Vector2>, value2: DeepImmutable<Vector2>, tangent2: DeepImmutable<Vector2>, time: number): T;
    /**
     * Returns a new Vector2 which is the 1st derivative of the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2".
     * Example Playground https://playground.babylonjs.com/#QYBWV4#83
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @param result define where the derivative will be stored
     * @returns result input
     */
    static Hermite1stDerivativeToRef<T extends Vector2>(value1: DeepImmutable<Vector2>, tangent1: DeepImmutable<Vector2>, value2: DeepImmutable<Vector2>, tangent2: DeepImmutable<Vector2>, time: number, result: T): T;
    /**
     * Returns a new Vector2 located for "amount" (float) on the linear interpolation between the vector "start" adn the vector "end".
     * Example Playground https://playground.babylonjs.com/#QYBWV4#84
     * @param start defines the start vector
     * @param end defines the end vector
     * @param amount defines the interpolation factor
     * @returns a new Vector2
     */
    static Lerp<T extends Vector2>(start: DeepImmutable<T>, end: DeepImmutable<Vector2>, amount: number): Vector2;
    /**
     * Gets the dot product of the vector "left" and the vector "right"
     * Example Playground https://playground.babylonjs.com/#QYBWV4#90
     * @param left defines first vector
     * @param right defines second vector
     * @returns the dot product (float)
     */
    static Dot(left: DeepImmutable<Vector2>, right: DeepImmutable<Vector2>): number;
    /**
     * Returns a new Vector2 equal to the normalized given vector
     * Example Playground https://playground.babylonjs.com/#QYBWV4#46
     * @param vector defines the vector to normalize
     * @returns a new Vector2
     */
    static Normalize<T extends Vector2>(vector: DeepImmutable<T>): T;
    /**
     * Normalize a given vector into a second one
     * Example Playground https://playground.babylonjs.com/#QYBWV4#50
     * @param vector defines the vector to normalize
     * @param result defines the vector where to store the result
     * @returns result input
     */
    static NormalizeToRef<T extends Vector2>(vector: DeepImmutable<Vector2>, result: T): T;
    /**
     * Gets a new Vector2 set with the minimal coordinate values from the "left" and "right" vectors
     * Example Playground https://playground.babylonjs.com/#QYBWV4#86
     * @param left defines 1st vector
     * @param right defines 2nd vector
     * @returns a new Vector2
     */
    static Minimize<T extends Vector2>(left: DeepImmutable<T>, right: DeepImmutable<Vector2>): T;
    /**
     * Gets a new Vector2 set with the maximal coordinate values from the "left" and "right" vectors
     * Example Playground https://playground.babylonjs.com/#QYBWV4#86
     * @param left defines 1st vector
     * @param right defines 2nd vector
     * @returns a new Vector2
     */
    static Maximize<T extends Vector2>(left: DeepImmutable<T>, right: DeepImmutable<Vector2>): T;
    /**
     * Gets a new Vector2 set with the transformed coordinates of the given vector by the given transformation matrix
     * Example Playground https://playground.babylonjs.com/#QYBWV4#17
     * @param vector defines the vector to transform
     * @param transformation defines the matrix to apply
     * @returns a new Vector2
     */
    static Transform<T extends Vector2>(vector: DeepImmutable<T>, transformation: DeepImmutable<Matrix>): T;
    /**
     * Transforms the given vector coordinates by the given transformation matrix and stores the result in the vector "result" coordinates
     * Example Playground https://playground.babylonjs.com/#QYBWV4#19
     * @param vector defines the vector to transform
     * @param transformation defines the matrix to apply
     * @param result defines the target vector
     * @returns result input
     */
    static TransformToRef<T extends Vector2>(vector: DeepImmutable<Vector2>, transformation: DeepImmutable<Matrix>, result: T): T;
    /**
     * Determines if a given vector is included in a triangle
     * Example Playground https://playground.babylonjs.com/#QYBWV4#87
     * @param p defines the vector to test
     * @param p0 defines 1st triangle point
     * @param p1 defines 2nd triangle point
     * @param p2 defines 3rd triangle point
     * @returns true if the point "p" is in the triangle defined by the vectors "p0", "p1", "p2"
     */
    static PointInTriangle(p: DeepImmutable<Vector2>, p0: DeepImmutable<Vector2>, p1: DeepImmutable<Vector2>, p2: DeepImmutable<Vector2>): boolean;
    /**
     * Gets the distance between the vectors "value1" and "value2"
     * Example Playground https://playground.babylonjs.com/#QYBWV4#71
     * @param value1 defines first vector
     * @param value2 defines second vector
     * @returns the distance between vectors
     */
    static Distance(value1: DeepImmutable<Vector2>, value2: DeepImmutable<Vector2>): number;
    /**
     * Returns the squared distance between the vectors "value1" and "value2"
     * Example Playground https://playground.babylonjs.com/#QYBWV4#72
     * @param value1 defines first vector
     * @param value2 defines second vector
     * @returns the squared distance between vectors
     */
    static DistanceSquared(value1: DeepImmutable<Vector2>, value2: DeepImmutable<Vector2>): number;
    /**
     * Gets a new Vector2 located at the center of the vectors "value1" and "value2"
     * Example Playground https://playground.babylonjs.com/#QYBWV4#86
     * Example Playground https://playground.babylonjs.com/#QYBWV4#66
     * @param value1 defines first vector
     * @param value2 defines second vector
     * @returns a new Vector2
     */
    static Center<T extends Vector2>(value1: DeepImmutable<T>, value2: DeepImmutable<Vector2>): T;
    /**
     * Gets the center of the vectors "value1" and "value2" and stores the result in the vector "ref"
     * Example Playground https://playground.babylonjs.com/#QYBWV4#66
     * @param value1 defines first vector
     * @param value2 defines second vector
     * @param ref defines third vector
     * @returns ref
     */
    static CenterToRef<T extends Vector2>(value1: DeepImmutable<Vector2>, value2: DeepImmutable<Vector2>, ref: T): T;
    /**
     * Gets the shortest distance (float) between the point "p" and the segment defined by the two points "segA" and "segB".
     * Example Playground https://playground.babylonjs.com/#QYBWV4#77
     * @param p defines the middle point
     * @param segA defines one point of the segment
     * @param segB defines the other point of the segment
     * @returns the shortest distance
     */
    static DistanceOfPointFromSegment(p: DeepImmutable<Vector2>, segA: DeepImmutable<Vector2>, segB: DeepImmutable<Vector2>): number;
}
/**
 * Class used to store (x,y,z) vector representation
 * A Vector3 is the main object used in 3D geometry
 * It can represent either the coordinates of a point the space, either a direction
 * Reminder: js uses a left handed forward facing system
 * Example Playground - Overview - https://playground.babylonjs.com/#R1F8YU
 */
export declare class Vector3 implements Vector<Tuple<number, 3>>, IVector3Like {
    private static _UpReadOnly;
    private static _DownReadOnly;
    private static _LeftHandedForwardReadOnly;
    private static _RightHandedForwardReadOnly;
    private static _LeftHandedBackwardReadOnly;
    private static _RightHandedBackwardReadOnly;
    private static _RightReadOnly;
    private static _LeftReadOnly;
    private static _ZeroReadOnly;
    private static _OneReadOnly;
    /**
     * @see Tensor.dimension
     */
    readonly dimension: Readonly<[3]>;
    /**
     * @see Tensor.rank
     */
    readonly rank: 1;
    /** @internal */
    _x: number;
    /** @internal */
    _y: number;
    /** @internal */
    _z: number;
    /** @internal */
    _isDirty: boolean;
    /** Gets or sets the x coordinate */
    get x(): number;
    set x(value: number);
    /** Gets or sets the y coordinate */
    get y(): number;
    set y(value: number);
    /** Gets or sets the z coordinate */
    get z(): number;
    set z(value: number);
    /**
     * Creates a new Vector3 object from the given x, y, z (floats) coordinates.
     * @param x defines the first coordinates (on X axis)
     * @param y defines the second coordinates (on Y axis)
     * @param z defines the third coordinates (on Z axis)
     */
    constructor(x?: number, y?: number, z?: number);
    /**
     * Creates a string representation of the Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#67
     * @returns a string with the Vector3 coordinates.
     */
    toString(): string;
    /**
     * Gets the class name
     * @returns the string "Vector3"
     */
    getClassName(): string;
    /**
     * Creates the Vector3 hash code
     * @returns a number which tends to be unique between Vector3 instances
     */
    getHashCode(): number;
    /**
     * Creates an array containing three elements : the coordinates of the Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#10
     * @returns a new array of numbers
     */
    asArray(): Tuple<number, 3>;
    /**
     * Populates the given array or Float32Array from the given index with the successive coordinates of the Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#65
     * @param array defines the destination array
     * @param index defines the offset in the destination array
     * @returns the current Vector3
     */
    toArray(array: FloatArray, index?: number): this;
    /**
     * Update the current vector from an array
     * Example Playground https://playground.babylonjs.com/#R1F8YU#24
     * @param array defines the destination array
     * @param offset defines the offset in the destination array
     * @returns the current Vector3
     */
    fromArray(array: DeepImmutable<FloatArray>, offset?: number): this;
    /**
     * Converts the current Vector3 into a quaternion (considering that the Vector3 contains Euler angles representation of a rotation)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#66
     * @returns a new Quaternion object, computed from the Vector3 coordinates
     */
    toQuaternion(): Quaternion;
    /**
     * Adds the given vector to the current Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#4
     * @param otherVector defines the second operand
     * @returns the current updated Vector3
     */
    addInPlace(otherVector: DeepImmutable<Vector3>): this;
    /**
     * Adds the given coordinates to the current Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#5
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    addInPlaceFromFloats(x: number, y: number, z: number): this;
    /**
     * Gets a new Vector3, result of the addition the current Vector3 and the given vector
     * Example Playground https://playground.babylonjs.com/#R1F8YU#3
     * @param otherVector defines the second operand
     * @returns the resulting Vector3
     */
    add(otherVector: DeepImmutable<Vector3>): this;
    /**
     * Adds the current Vector3 to the given one and stores the result in the vector "result"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#6
     * @param otherVector defines the second operand
     * @param result defines the Vector3 object where to store the result
     * @returns the result
     */
    addToRef<T extends Vector3>(otherVector: DeepImmutable<Vector3>, result: T): T;
    /**
     * Subtract the given vector from the current Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#61
     * @param otherVector defines the second operand
     * @returns the current updated Vector3
     */
    subtractInPlace(otherVector: DeepImmutable<Vector3>): this;
    /**
     * Returns a new Vector3, result of the subtraction of the given vector from the current Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#60
     * @param otherVector defines the second operand
     * @returns the resulting Vector3
     */
    subtract(otherVector: DeepImmutable<Vector3>): this;
    /**
     * Subtracts the given vector from the current Vector3 and stores the result in the vector "result".
     * Example Playground https://playground.babylonjs.com/#R1F8YU#63
     * @param otherVector defines the second operand
     * @param result defines the Vector3 object where to store the result
     * @returns the result
     */
    subtractToRef<T extends Vector3>(otherVector: DeepImmutable<Vector3>, result: T): T;
    /**
     * Returns a new Vector3 set with the subtraction of the given floats from the current Vector3 coordinates
     * Example Playground https://playground.babylonjs.com/#R1F8YU#62
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the resulting Vector3
     */
    subtractFromFloats(x: number, y: number, z: number): this;
    /**
     * Subtracts the given floats from the current Vector3 coordinates and set the given vector "result" with this result
     * Example Playground https://playground.babylonjs.com/#R1F8YU#64
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @param result defines the Vector3 object where to store the result
     * @returns the result
     */
    subtractFromFloatsToRef<T extends Vector3>(x: number, y: number, z: number, result: T): T;
    /**
     * Gets a new Vector3 set with the current Vector3 negated coordinates
     * Example Playground https://playground.babylonjs.com/#R1F8YU#35
     * @returns a new Vector3
     */
    negate(): this;
    /**
     * Negate this vector in place
     * Example Playground https://playground.babylonjs.com/#R1F8YU#36
     * @returns this
     */
    negateInPlace(): this;
    /**
     * Negate the current Vector3 and stores the result in the given vector "result" coordinates
     * Example Playground https://playground.babylonjs.com/#R1F8YU#37
     * @param result defines the Vector3 object where to store the result
     * @returns the result
     */
    negateToRef<T extends Vector3 = Vector3>(result: T): T;
    /**
     * Multiplies the Vector3 coordinates by the float "scale"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#56
     * @param scale defines the multiplier factor
     * @returns the current updated Vector3
     */
    scaleInPlace(scale: number): this;
    /**
     * Returns a new Vector3 set with the current Vector3 coordinates multiplied by the float "scale"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#53
     * @param scale defines the multiplier factor
     * @returns a new Vector3
     */
    scale(scale: number): this;
    /**
     * Multiplies the current Vector3 coordinates by the float "scale" and stores the result in the given vector "result" coordinates
     * Example Playground https://playground.babylonjs.com/#R1F8YU#57
     * @param scale defines the multiplier factor
     * @param result defines the Vector3 object where to store the result
     * @returns the result
     */
    scaleToRef<T extends Vector3>(scale: number, result: T): T;
    /**
     * Creates a vector normal (perpendicular) to the current Vector3 and stores the result in the given vector
     * Out of the infinite possibilities the normal chosen is the one formed by rotating the current vector
     * 90 degrees about an axis which lies perpendicular to the current vector
     * and its projection on the xz plane. In the case of a current vector in the xz plane
     * the normal is calculated to be along the y axis.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#230
     * Example Playground https://playground.babylonjs.com/#R1F8YU#231
     * @param result defines the Vector3 object where to store the resultant normal
     * @returns the result
     */
    getNormalToRef(result: Vector3): Vector3;
    /**
     * Rotates the vector using the given unit quaternion and stores the new vector in result
     * Example Playground https://playground.babylonjs.com/#R1F8YU#9
     * @param q the unit quaternion representing the rotation
     * @param result the output vector
     * @returns the result
     */
    applyRotationQuaternionToRef<T extends Vector3>(q: Quaternion, result: T): T;
    /**
     * Rotates the vector in place using the given unit quaternion
     * Example Playground https://playground.babylonjs.com/#R1F8YU#8
     * @param q the unit quaternion representing the rotation
     * @returns the current updated Vector3
     */
    applyRotationQuaternionInPlace(q: Quaternion): this;
    /**
     * Rotates the vector using the given unit quaternion and returns the new vector
     * Example Playground https://playground.babylonjs.com/#R1F8YU#7
     * @param q the unit quaternion representing the rotation
     * @returns a new Vector3
     */
    applyRotationQuaternion(q: Quaternion): this;
    /**
     * Scale the current Vector3 values by a factor and add the result to a given Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#55
     * @param scale defines the scale factor
     * @param result defines the Vector3 object where to store the result
     * @returns result input
     */
    scaleAndAddToRef<T extends Vector3>(scale: number, result: T): T;
    /**
     * Projects the current point Vector3 to a plane along a ray starting from a specified origin and passing through the current point Vector3.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#48
     * @param plane defines the plane to project to
     * @param origin defines the origin of the projection ray
     * @returns the projected vector3
     */
    projectOnPlane<T extends Vector3>(plane: Plane, origin: Vector3): T;
    /**
     * Projects the current point Vector3 to a plane along a ray starting from a specified origin and passing through the current point Vector3.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#49
     * @param plane defines the plane to project to
     * @param origin defines the origin of the projection ray
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    projectOnPlaneToRef<T extends Vector3>(plane: Plane, origin: Vector3, result: T): T;
    /**
     * Returns true if the current Vector3 and the given vector coordinates are strictly equal
     * Example Playground https://playground.babylonjs.com/#R1F8YU#19
     * @param otherVector defines the second operand
     * @returns true if both vectors are equals
     */
    equals(otherVector: DeepImmutable<Vector3>): boolean;
    /**
     * Returns true if the current Vector3 and the given vector coordinates are distant less than epsilon
     * Example Playground https://playground.babylonjs.com/#R1F8YU#21
     * @param otherVector defines the second operand
     * @param epsilon defines the minimal distance to define values as equals
     * @returns true if both vectors are distant less than epsilon
     */
    equalsWithEpsilon(otherVector: DeepImmutable<Vector3>, epsilon?: number): boolean;
    /**
     * Returns true if the current Vector3 coordinates equals the given floats
     * Example Playground https://playground.babylonjs.com/#R1F8YU#20
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns true if both vectors are equal
     */
    equalsToFloats(x: number, y: number, z: number): boolean;
    /**
     * Multiplies the current Vector3 coordinates by the given ones
     * Example Playground https://playground.babylonjs.com/#R1F8YU#32
     * @param otherVector defines the second operand
     * @returns the current updated Vector3
     */
    multiplyInPlace(otherVector: DeepImmutable<Vector3>): this;
    /**
     * Returns a new Vector3, result of the multiplication of the current Vector3 by the given vector
     * Example Playground https://playground.babylonjs.com/#R1F8YU#31
     * @param otherVector defines the second operand
     * @returns the new Vector3
     */
    multiply(otherVector: DeepImmutable<Vector3>): this;
    /**
     * Multiplies the current Vector3 by the given one and stores the result in the given vector "result"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#33
     * @param otherVector defines the second operand
     * @param result defines the Vector3 object where to store the result
     * @returns the result
     */
    multiplyToRef<T extends Vector3>(otherVector: DeepImmutable<Vector3>, result: T): T;
    /**
     * Returns a new Vector3 set with the result of the multiplication of the current Vector3 coordinates by the given floats
     * Example Playground https://playground.babylonjs.com/#R1F8YU#34
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the new Vector3
     */
    multiplyByFloats(x: number, y: number, z: number): this;
    /**
     * Returns a new Vector3 set with the result of the division of the current Vector3 coordinates by the given ones
     * Example Playground https://playground.babylonjs.com/#R1F8YU#16
     * @param otherVector defines the second operand
     * @returns the new Vector3
     */
    divide(otherVector: DeepImmutable<Vector3>): this;
    /**
     * Divides the current Vector3 coordinates by the given ones and stores the result in the given vector "result"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#18
     * @param otherVector defines the second operand
     * @param result defines the Vector3 object where to store the result
     * @returns the result
     */
    divideToRef<T extends Vector3>(otherVector: DeepImmutable<Vector3>, result: T): T;
    /**
     * Divides the current Vector3 coordinates by the given ones.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#17
     * @param otherVector defines the second operand
     * @returns the current updated Vector3
     */
    divideInPlace(otherVector: DeepImmutable<Vector3>): this;
    /**
     * Updates the current Vector3 with the minimal coordinate values between its and the given vector ones
     * Example Playground https://playground.babylonjs.com/#R1F8YU#29
     * @param other defines the second operand
     * @returns the current updated Vector3
     */
    minimizeInPlace(other: DeepImmutable<Vector3>): this;
    /**
     * Updates the current Vector3 with the maximal coordinate values between its and the given vector ones.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#27
     * @param other defines the second operand
     * @returns the current updated Vector3
     */
    maximizeInPlace(other: DeepImmutable<Vector3>): this;
    /**
     * Updates the current Vector3 with the minimal coordinate values between its and the given coordinates
     * Example Playground https://playground.babylonjs.com/#R1F8YU#30
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    minimizeInPlaceFromFloats(x: number, y: number, z: number): this;
    /**
     * Updates the current Vector3 with the maximal coordinate values between its and the given coordinates.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#28
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    maximizeInPlaceFromFloats(x: number, y: number, z: number): this;
    /**
     * Due to float precision, scale of a mesh could be uniform but float values are off by a small fraction
     * Check if is non uniform within a certain amount of decimal places to account for this
     * @param epsilon the amount the values can differ
     * @returns if the vector is non uniform to a certain number of decimal places
     */
    isNonUniformWithinEpsilon(epsilon: number): boolean;
    /**
     * Gets a boolean indicating that the vector is non uniform meaning x, y or z are not all the same
     */
    get isNonUniform(): boolean;
    /**
     * Gets the current Vector3's floored values and stores them in result
     * @param result the vector to store the result in
     * @returns the result vector
     */
    floorToRef<T extends this>(result: T): T;
    /**
     * Gets a new Vector3 from current Vector3 floored values
     * Example Playground https://playground.babylonjs.com/#R1F8YU#22
     * @returns a new Vector3
     */
    floor(): this;
    /**
     * Gets the current Vector3's fractional values and stores them in result
     * @param result the vector to store the result in
     * @returns the result vector
     */
    fractToRef<T extends this>(result: T): T;
    /**
     * Gets a new Vector3 from current Vector3 fractional values
     * Example Playground https://playground.babylonjs.com/#R1F8YU#23
     * @returns a new Vector3
     */
    fract(): this;
    /**
     * Gets the length of the Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#25
     * @returns the length of the Vector3
     */
    length(): number;
    /**
     * Gets the squared length of the Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#26
     * @returns squared length of the Vector3
     */
    lengthSquared(): number;
    /**
     * Gets a boolean indicating if the vector contains a zero in one of its components
     * Example Playground https://playground.babylonjs.com/#R1F8YU#1
     */
    get hasAZeroComponent(): boolean;
    /**
     * Normalize the current Vector3.
     * Please note that this is an in place operation.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#122
     * @returns the current updated Vector3
     */
    normalize(): this;
    /**
     * Reorders the x y z properties of the vector in place
     * Example Playground https://playground.babylonjs.com/#R1F8YU#44
     * @param order new ordering of the properties (eg. for vector 1,2,3 with "ZYX" will produce 3,2,1)
     * @returns the current updated vector
     */
    reorderInPlace(order: string): this;
    /**
     * Rotates the vector around 0,0,0 by a quaternion
     * Example Playground https://playground.babylonjs.com/#R1F8YU#47
     * @param quaternion the rotation quaternion
     * @param result vector to store the result
     * @returns the resulting vector
     */
    rotateByQuaternionToRef<T extends Vector3>(quaternion: Quaternion, result: T): T;
    /**
     * Rotates a vector around a given point
     * Example Playground https://playground.babylonjs.com/#R1F8YU#46
     * @param quaternion the rotation quaternion
     * @param point the point to rotate around
     * @param result vector to store the result
     * @returns the resulting vector
     */
    rotateByQuaternionAroundPointToRef<T extends Vector3>(quaternion: Quaternion, point: Vector3, result: T): T;
    /**
     * Returns a new Vector3 as the cross product of the current vector and the "other" one
     * The cross product is then orthogonal to both current and "other"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#14
     * @param other defines the right operand
     * @returns the cross product
     */
    cross(other: Vector3): this;
    /**
     * Normalize the current Vector3 with the given input length.
     * Please note that this is an in place operation.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#123
     * @param len the length of the vector
     * @returns the current updated Vector3
     */
    normalizeFromLength(len: number): this;
    /**
     * Normalize the current Vector3 to a new vector
     * Example Playground https://playground.babylonjs.com/#R1F8YU#124
     * @returns the new Vector3
     */
    normalizeToNew(): this;
    /**
     * Normalize the current Vector3 to the reference
     * Example Playground https://playground.babylonjs.com/#R1F8YU#125
     * @param reference define the Vector3 to update
     * @returns the updated Vector3
     */
    normalizeToRef<T extends Vector3>(reference: T): T;
    /**
     * Creates a new Vector3 copied from the current Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#11
     * @returns the new Vector3
     */
    clone(): this;
    /**
     * Copies the given vector coordinates to the current Vector3 ones
     * Example Playground https://playground.babylonjs.com/#R1F8YU#12
     * @param source defines the source Vector3
     * @returns the current updated Vector3
     */
    copyFrom(source: DeepImmutable<Vector3>): this;
    /**
     * Copies the given floats to the current Vector3 coordinates
     * Example Playground https://playground.babylonjs.com/#R1F8YU#13
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    copyFromFloats(x: number, y: number, z: number): this;
    /**
     * Copies the given floats to the current Vector3 coordinates
     * Example Playground https://playground.babylonjs.com/#R1F8YU#58
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @returns the current updated Vector3
     */
    set(x: number, y: number, z: number): this;
    /**
     * Copies the given float to the current Vector3 coordinates
     * Example Playground https://playground.babylonjs.com/#R1F8YU#59
     * @param v defines the x, y and z coordinates of the operand
     * @returns the current updated Vector3
     */
    setAll(v: number): this;
    /**
     * Get the clip factor between two vectors
     * Example Playground https://playground.babylonjs.com/#R1F8YU#126
     * @param vector0 defines the first operand
     * @param vector1 defines the second operand
     * @param axis defines the axis to use
     * @param size defines the size along the axis
     * @returns the clip factor
     */
    static GetClipFactor(vector0: DeepImmutable<Vector3>, vector1: DeepImmutable<Vector3>, axis: DeepImmutable<Vector3>, size: number): number;
    /**
     * Get angle between two vectors
     * Example Playground https://playground.babylonjs.com/#R1F8YU#86
     * @param vector0 the starting point
     * @param vector1 the ending point
     * @param normal direction of the normal
     * @returns the angle between vector0 and vector1
     */
    static GetAngleBetweenVectors(vector0: DeepImmutable<Vector3>, vector1: DeepImmutable<Vector3>, normal: DeepImmutable<Vector3>): number;
    /**
     * Get angle between two vectors projected on a plane
     * Example Playground https://playground.babylonjs.com/#R1F8YU#87
     * Expectation compute time: 0.01 ms (median) and 0.02 ms (percentile 95%)
     * @param vector0 angle between vector0 and vector1
     * @param vector1 angle between vector0 and vector1
     * @param normal Normal of the projection plane
     * @returns the angle in radians (float) between vector0 and vector1 projected on the plane with the specified normal
     */
    static GetAngleBetweenVectorsOnPlane(vector0: DeepImmutable<Vector3>, vector1: DeepImmutable<Vector3>, normal: DeepImmutable<Vector3>): number;
    /**
     * Gets the rotation that aligns the roll axis (Y) to the line joining the start point to the target point and stores it in the ref Vector3
     * Example PG https://playground.babylonjs.com/#R1F8YU#189
     * @param start the starting point
     * @param target the target point
     * @param ref the vector3 to store the result
     * @returns ref in the form (pitch, yaw, 0)
     */
    static PitchYawRollToMoveBetweenPointsToRef<T extends Vector3>(start: Vector3, target: Vector3, ref: T): T;
    /**
     * Gets the rotation that aligns the roll axis (Y) to the line joining the start point to the target point
     * Example PG https://playground.babylonjs.com/#R1F8YU#188
     * @param start the starting point
     * @param target the target point
     * @returns the rotation in the form (pitch, yaw, 0)
     */
    static PitchYawRollToMoveBetweenPoints(start: Vector3, target: Vector3): Vector3;
    /**
     * Slerp between two vectors. See also `SmoothToRef`
     * Slerp is a spherical linear interpolation
     * giving a slow in and out effect
     * Example Playground 1 https://playground.babylonjs.com/#R1F8YU#108
     * Example Playground 2 https://playground.babylonjs.com/#R1F8YU#109
     * @param vector0 Start vector
     * @param vector1 End vector
     * @param slerp amount (will be clamped between 0 and 1)
     * @param result The slerped vector
     * @returns The slerped vector
     */
    static SlerpToRef<T extends Vector3 = Vector3>(vector0: Vector3, vector1: Vector3, slerp: number, result: T): T;
    /**
     * Smooth interpolation between two vectors using Slerp
     * Example Playground https://playground.babylonjs.com/#R1F8YU#110
     * @param source source vector
     * @param goal goal vector
     * @param deltaTime current interpolation frame
     * @param lerpTime total interpolation time
     * @param result the smoothed vector
     * @returns the smoothed vector
     */
    static SmoothToRef<T extends Vector3 = Vector3>(source: Vector3, goal: Vector3, deltaTime: number, lerpTime: number, result: T): T;
    /**
     * Returns a new Vector3 set from the index "offset" of the given array
     * Example Playground https://playground.babylonjs.com/#R1F8YU#83
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @returns the new Vector3
     */
    static FromArray(array: DeepImmutable<ArrayLike<number>>, offset?: number): Vector3;
    /**
     * Returns a new Vector3 set from the index "offset" of the given Float32Array
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @returns the new Vector3
     * @deprecated Please use FromArray instead.
     */
    static FromFloatArray(array: DeepImmutable<Float32Array>, offset?: number): Vector3;
    /**
     * Sets the given vector "result" with the element values from the index "offset" of the given array
     * Example Playground https://playground.babylonjs.com/#R1F8YU#84
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static FromArrayToRef<T extends Vector3>(array: DeepImmutable<ArrayLike<number>>, offset: number, result: T): T;
    /**
     * Sets the given vector "result" with the element values from the index "offset" of the given Float32Array
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @param result defines the Vector3 where to store the result
     * @deprecated Please use FromArrayToRef instead.
     * @returns result input
     */
    static FromFloatArrayToRef<T extends Vector3>(array: DeepImmutable<Float32Array>, offset: number, result: T): T;
    /**
     * Sets the given vector "result" with the given floats.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#85
     * @param x defines the x coordinate of the source
     * @param y defines the y coordinate of the source
     * @param z defines the z coordinate of the source
     * @param result defines the Vector3 where to store the result
     * @returns the result vector
     */
    static FromFloatsToRef<T extends Vector3 = Vector3>(x: number, y: number, z: number, result: T): T;
    /**
     * Returns a new Vector3 set to (0.0, 0.0, 0.0)
     * @returns a new empty Vector3
     */
    static Zero(): Vector3;
    /**
     * Returns a new Vector3 set to (1.0, 1.0, 1.0)
     * @returns a new Vector3
     */
    static One(): Vector3;
    /**
     * Returns a new Vector3 set to (0.0, 1.0, 0.0)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#71
     * @returns a new up Vector3
     */
    static Up(): Vector3;
    /**
     * Gets an up Vector3 that must not be updated
     */
    static get UpReadOnly(): DeepImmutable<Vector3>;
    /**
     * Gets a down Vector3 that must not be updated
     */
    static get DownReadOnly(): DeepImmutable<Vector3>;
    /**
     * Gets a right Vector3 that must not be updated
     */
    static get RightReadOnly(): DeepImmutable<Vector3>;
    /**
     * Gets a left Vector3 that must not be updated
     */
    static get LeftReadOnly(): DeepImmutable<Vector3>;
    /**
     * Gets a forward Vector3 that must not be updated
     */
    static get LeftHandedForwardReadOnly(): DeepImmutable<Vector3>;
    /**
     * Gets a forward Vector3 that must not be updated
     */
    static get RightHandedForwardReadOnly(): DeepImmutable<Vector3>;
    /**
     * Gets a backward Vector3 that must not be updated
     */
    static get LeftHandedBackwardReadOnly(): DeepImmutable<Vector3>;
    /**
     * Gets a backward Vector3 that must not be updated
     */
    static get RightHandedBackwardReadOnly(): DeepImmutable<Vector3>;
    /**
     * Gets a zero Vector3 that must not be updated
     */
    static get ZeroReadOnly(): DeepImmutable<Vector3>;
    /**
     * Gets a one Vector3 that must not be updated
     */
    static get OneReadOnly(): DeepImmutable<Vector3>;
    /**
     * Returns a new Vector3 set to (0.0, -1.0, 0.0)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#71
     * @returns a new down Vector3
     */
    static Down(): Vector3;
    /**
     * Returns a new Vector3 set to (0.0, 0.0, 1.0)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#71
     * @param rightHandedSystem is the scene right-handed (negative z)
     * @returns a new forward Vector3
     */
    static Forward(rightHandedSystem?: boolean): Vector3;
    /**
     * Returns a new Vector3 set to (0.0, 0.0, -1.0)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#71
     * @param rightHandedSystem is the scene right-handed (negative-z)
     * @returns a new Backward Vector3
     */
    static Backward(rightHandedSystem?: boolean): Vector3;
    /**
     * Returns a new Vector3 set to (1.0, 0.0, 0.0)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#71
     * @returns a new right Vector3
     */
    static Right(): Vector3;
    /**
     * Returns a new Vector3 set to (-1.0, 0.0, 0.0)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#71
     * @returns a new left Vector3
     */
    static Left(): Vector3;
    /**
     * Returns a new Vector3 with random values between min and max
     * @param min the minimum random value
     * @param max the maximum random value
     * @returns a Vector3 with random values between min and max
     */
    static Random(min?: number, max?: number): Vector3;
    /**
     * Sets a Vector3 with random values between min and max
     * @param min the minimum random value
     * @param max the maximum random value
     * @param ref the ref to store the values in
     * @returns the ref with random values between min and max
     */
    static RandomToRef<T extends Vector3>(min: number | undefined, max: number | undefined, ref: T): T;
    /**
     * Returns a new Vector3 set with the result of the transformation by the given matrix of the given vector.
     * This method computes transformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#111
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @returns the transformed Vector3
     */
    static TransformCoordinates(vector: DeepImmutable<Vector3>, transformation: DeepImmutable<Matrix>): Vector3;
    /**
     * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given vector
     * This method computes transformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#113
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static TransformCoordinatesToRef<T extends Vector3>(vector: DeepImmutable<Vector3>, transformation: DeepImmutable<Matrix>, result: T): T;
    /**
     * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given floats (x, y, z)
     * This method computes transformed coordinates only, not transformed direction vectors
     * Example Playground https://playground.babylonjs.com/#R1F8YU#115
     * @param x define the x coordinate of the source vector
     * @param y define the y coordinate of the source vector
     * @param z define the z coordinate of the source vector
     * @param transformation defines the transformation matrix
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static TransformCoordinatesFromFloatsToRef<T extends Vector3>(x: number, y: number, z: number, transformation: DeepImmutable<Matrix>, result: T): T;
    /**
     * Returns a new Vector3 set with the result of the normal transformation by the given matrix of the given vector
     * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#112
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @returns the new Vector3
     */
    static TransformNormal(vector: DeepImmutable<Vector3>, transformation: DeepImmutable<Matrix>): Vector3;
    /**
     * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given vector
     * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#114
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static TransformNormalToRef<T extends Vector3>(vector: DeepImmutable<Vector3>, transformation: DeepImmutable<Matrix>, result: T): T;
    /**
     * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given floats (x, y, z)
     * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
     * Example Playground https://playground.babylonjs.com/#R1F8YU#116
     * @param x define the x coordinate of the source vector
     * @param y define the y coordinate of the source vector
     * @param z define the z coordinate of the source vector
     * @param transformation defines the transformation matrix
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static TransformNormalFromFloatsToRef<T extends Vector3>(x: number, y: number, z: number, transformation: DeepImmutable<Matrix>, result: T): T;
    /**
     * Returns a new Vector3 located for "amount" on the CatmullRom interpolation spline defined by the vectors "value1", "value2", "value3", "value4"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#69
     * @param value1 defines the first control point
     * @param value2 defines the second control point
     * @param value3 defines the third control point
     * @param value4 defines the fourth control point
     * @param amount defines the amount on the spline to use
     * @returns the new Vector3
     */
    static CatmullRom<T extends Vector3>(value1: DeepImmutable<T>, value2: DeepImmutable<Vector3>, value3: DeepImmutable<Vector3>, value4: DeepImmutable<Vector3>, amount: number): T;
    /**
     * Returns a new Vector3 set with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
     * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
     * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
     * Example Playground https://playground.babylonjs.com/#R1F8YU#76
     * @param value defines the current value
     * @param min defines the lower range value
     * @param max defines the upper range value
     * @returns the new Vector3
     */
    static Clamp<T extends Vector3>(value: DeepImmutable<T>, min: DeepImmutable<Vector3>, max: DeepImmutable<Vector3>): T;
    /**
     * Sets the given vector "result" with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
     * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
     * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
     * Example Playground https://playground.babylonjs.com/#R1F8YU#77
     * @param value defines the current value
     * @param min defines the lower range value
     * @param max defines the upper range value
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static ClampToRef<T extends Vector3>(value: DeepImmutable<Vector3>, min: DeepImmutable<Vector3>, max: DeepImmutable<Vector3>, result: T): T;
    /**
     * Checks if a given vector is inside a specific range
     * Example Playground https://playground.babylonjs.com/#R1F8YU#75
     * @param v defines the vector to test
     * @param min defines the minimum range
     * @param max defines the maximum range
     */
    static CheckExtends(v: Vector3, min: Vector3, max: Vector3): void;
    /**
     * Returns a new Vector3 located for "amount" (float) on the Hermite interpolation spline defined by the vectors "value1", "tangent1", "value2", "tangent2"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#89
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent vector
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent vector
     * @param amount defines the amount on the interpolation spline (between 0 and 1)
     * @returns the new Vector3
     */
    static Hermite<T extends Vector3>(value1: DeepImmutable<T>, tangent1: DeepImmutable<Vector3>, value2: DeepImmutable<Vector3>, tangent2: DeepImmutable<Vector3>, amount: number): T;
    /**
     * Returns a new Vector3 which is the 1st derivative of the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2".
     * Example Playground https://playground.babylonjs.com/#R1F8YU#90
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @returns 1st derivative
     */
    static Hermite1stDerivative<T extends Vector3>(value1: DeepImmutable<T>, tangent1: DeepImmutable<Vector3>, value2: DeepImmutable<Vector3>, tangent2: DeepImmutable<Vector3>, time: number): T;
    /**
     * Update a Vector3 with the 1st derivative of the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2".
     * Example Playground https://playground.babylonjs.com/#R1F8YU#91
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @param result define where to store the derivative
     * @returns result input
     */
    static Hermite1stDerivativeToRef<T extends Vector3>(value1: DeepImmutable<Vector3>, tangent1: DeepImmutable<Vector3>, value2: DeepImmutable<Vector3>, tangent2: DeepImmutable<Vector3>, time: number, result: T): T;
    /**
     * Returns a new Vector3 located for "amount" (float) on the linear interpolation between the vectors "start" and "end"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#95
     * @param start defines the start value
     * @param end defines the end value
     * @param amount max defines amount between both (between 0 and 1)
     * @returns the new Vector3
     */
    static Lerp<T extends Vector3>(start: DeepImmutable<T>, end: DeepImmutable<Vector3>, amount: number): T;
    /**
     * Sets the given vector "result" with the result of the linear interpolation from the vector "start" for "amount" to the vector "end"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#93
     * @param start defines the start value
     * @param end defines the end value
     * @param amount max defines amount between both (between 0 and 1)
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static LerpToRef<T extends Vector3>(start: DeepImmutable<Vector3>, end: DeepImmutable<Vector3>, amount: number, result: T): T;
    /**
     * Returns the dot product (float) between the vectors "left" and "right"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#82
     * @param left defines the left operand
     * @param right defines the right operand
     * @returns the dot product
     */
    static Dot(left: DeepImmutable<Vector3>, right: DeepImmutable<Vector3>): number;
    /**
     * Returns the dot product (float) between the current vectors and "otherVector"
     * @param otherVector defines the right operand
     * @returns the dot product
     */
    dot(otherVector: DeepImmutable<this>): number;
    /**
     * Returns a new Vector3 as the cross product of the vectors "left" and "right"
     * The cross product is then orthogonal to both "left" and "right"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#15
     * @param left defines the left operand
     * @param right defines the right operand
     * @returns the cross product
     */
    static Cross<T extends Vector3>(left: DeepImmutable<T>, right: DeepImmutable<Vector3>): T;
    /**
     * Sets the given vector "result" with the cross product of "left" and "right"
     * The cross product is then orthogonal to both "left" and "right"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#78
     * @param left defines the left operand
     * @param right defines the right operand
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static CrossToRef<T extends Vector3>(left: DeepImmutable<Vector3>, right: DeepImmutable<Vector3>, result: T): T;
    /**
     * Returns a new Vector3 as the normalization of the given vector
     * Example Playground https://playground.babylonjs.com/#R1F8YU#98
     * @param vector defines the Vector3 to normalize
     * @returns the new Vector3
     */
    static Normalize(vector: DeepImmutable<Vector3>): Vector3;
    /**
     * Sets the given vector "result" with the normalization of the given first vector
     * Example Playground https://playground.babylonjs.com/#R1F8YU#98
     * @param vector defines the Vector3 to normalize
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static NormalizeToRef<T extends Vector3>(vector: DeepImmutable<Vector3>, result: T): T;
    /**
     * Project a Vector3 onto screen space
     * Example Playground https://playground.babylonjs.com/#R1F8YU#101
     * @param vector defines the Vector3 to project
     * @param world defines the world matrix to use
     * @param transform defines the transform (view x projection) matrix to use
     * @param viewport defines the screen viewport to use
     * @returns the new Vector3
     */
    static Project<T extends Vector3>(vector: DeepImmutable<T>, world: DeepImmutable<Matrix>, transform: DeepImmutable<Matrix>, viewport: DeepImmutable<Viewport>): T;
    /**
     * Project a Vector3 onto screen space to reference
     * Example Playground https://playground.babylonjs.com/#R1F8YU#102
     * @param vector defines the Vector3 to project
     * @param world defines the world matrix to use
     * @param transform defines the transform (view x projection) matrix to use
     * @param viewport defines the screen viewport to use
     * @param result the vector in which the screen space will be stored
     * @returns result input
     */
    static ProjectToRef<T extends Vector3>(vector: DeepImmutable<Vector3>, world: DeepImmutable<Matrix>, transform: DeepImmutable<Matrix>, viewport: DeepImmutable<Viewport>, result: T): T;
    /**
     * Reflects a vector off the plane defined by a normalized normal
     * @param inDirection defines the vector direction
     * @param normal defines the normal - Must be normalized
     * @returns the resulting vector
     */
    static Reflect(inDirection: DeepImmutable<Vector3>, normal: DeepImmutable<Vector3>): Vector3;
    /**
     * Reflects a vector off the plane defined by a normalized normal to reference
     * @param inDirection defines the vector direction
     * @param normal defines the normal - Must be normalized
     * @param ref defines the Vector3 where to store the result
     * @returns the resulting vector
     */
    static ReflectToRef<T extends Vector3>(inDirection: DeepImmutable<Vector3>, normal: DeepImmutable<Vector3>, ref: T): T;
    /**
     * @internal
     */
    static _UnprojectFromInvertedMatrixToRef<T extends Vector3>(source: DeepImmutable<Vector3>, matrix: DeepImmutable<Matrix>, result: T): T;
    /**
     * Unproject from screen space to object space
     * Example Playground https://playground.babylonjs.com/#R1F8YU#121
     * @param source defines the screen space Vector3 to use
     * @param viewportWidth defines the current width of the viewport
     * @param viewportHeight defines the current height of the viewport
     * @param world defines the world matrix to use (can be set to Identity to go to world space)
     * @param transform defines the transform (view x projection) matrix to use
     * @returns the new Vector3
     */
    static UnprojectFromTransform<T extends Vector3>(source: DeepImmutable<T>, viewportWidth: number, viewportHeight: number, world: DeepImmutable<Matrix>, transform: DeepImmutable<Matrix>): T;
    /**
     * Unproject from screen space to object space
     * Example Playground https://playground.babylonjs.com/#R1F8YU#117
     * @param source defines the screen space Vector3 to use
     * @param viewportWidth defines the current width of the viewport
     * @param viewportHeight defines the current height of the viewport
     * @param world defines the world matrix to use (can be set to Identity to go to world space)
     * @param view defines the view matrix to use
     * @param projection defines the projection matrix to use
     * @returns the new Vector3
     */
    static Unproject<T extends Vector3>(source: DeepImmutable<T>, viewportWidth: number, viewportHeight: number, world: DeepImmutable<Matrix>, view: DeepImmutable<Matrix>, projection: DeepImmutable<Matrix>): T;
    /**
     * Unproject from screen space to object space
     * Example Playground https://playground.babylonjs.com/#R1F8YU#119
     * @param source defines the screen space Vector3 to use
     * @param viewportWidth defines the current width of the viewport
     * @param viewportHeight defines the current height of the viewport
     * @param world defines the world matrix to use (can be set to Identity to go to world space)
     * @param view defines the view matrix to use
     * @param projection defines the projection matrix to use
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static UnprojectToRef<T extends Vector3>(source: DeepImmutable<Vector3>, viewportWidth: number, viewportHeight: number, world: DeepImmutable<Matrix>, view: DeepImmutable<Matrix>, projection: DeepImmutable<Matrix>, result: T): T;
    /**
     * Unproject from screen space to object space
     * Example Playground https://playground.babylonjs.com/#R1F8YU#120
     * @param sourceX defines the screen space x coordinate to use
     * @param sourceY defines the screen space y coordinate to use
     * @param sourceZ defines the screen space z coordinate to use
     * @param viewportWidth defines the current width of the viewport
     * @param viewportHeight defines the current height of the viewport
     * @param world defines the world matrix to use (can be set to Identity to go to world space)
     * @param view defines the view matrix to use
     * @param projection defines the projection matrix to use
     * @param result defines the Vector3 where to store the result
     * @returns result input
     */
    static UnprojectFloatsToRef<T extends Vector3>(sourceX: float, sourceY: float, sourceZ: float, viewportWidth: number, viewportHeight: number, world: DeepImmutable<Matrix>, view: DeepImmutable<Matrix>, projection: DeepImmutable<Matrix>, result: T): T;
    /**
     * Gets the minimal coordinate values between two Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#97
     * @param left defines the first operand
     * @param right defines the second operand
     * @returns the new Vector3
     */
    static Minimize<T extends Vector3>(left: DeepImmutable<T>, right: DeepImmutable<Vector3>): T;
    /**
     * Gets the maximal coordinate values between two Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#96
     * @param left defines the first operand
     * @param right defines the second operand
     * @returns the new Vector3
     */
    static Maximize<T extends Vector3>(left: DeepImmutable<T>, right: DeepImmutable<Vector3>): T;
    /**
     * Returns the distance between the vectors "value1" and "value2"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#81
     * @param value1 defines the first operand
     * @param value2 defines the second operand
     * @returns the distance
     */
    static Distance(value1: DeepImmutable<Vector3>, value2: DeepImmutable<Vector3>): number;
    /**
     * Returns the squared distance between the vectors "value1" and "value2"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#80
     * @param value1 defines the first operand
     * @param value2 defines the second operand
     * @returns the squared distance
     */
    static DistanceSquared(value1: DeepImmutable<Vector3>, value2: DeepImmutable<Vector3>): number;
    /**
     * Projects "vector" on the triangle determined by its extremities "p0", "p1" and "p2", stores the result in "ref"
     * and returns the distance to the projected point.
     * Example Playground https://playground.babylonjs.com/#R1F8YU#104
     * From http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.104.4264&rep=rep1&type=pdf
     *
     * @param vector the vector to get distance from
     * @param p0 extremity of the triangle
     * @param p1 extremity of the triangle
     * @param p2 extremity of the triangle
     * @param ref variable to store the result to
     * @returns The distance between "ref" and "vector"
     */
    static ProjectOnTriangleToRef(vector: DeepImmutable<Vector3>, p0: DeepImmutable<Vector3>, p1: DeepImmutable<Vector3>, p2: DeepImmutable<Vector3>, ref: Vector3): number;
    /**
     * Returns a new Vector3 located at the center between "value1" and "value2"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#72
     * @param value1 defines the first operand
     * @param value2 defines the second operand
     * @returns the new Vector3
     */
    static Center(value1: DeepImmutable<Vector3>, value2: DeepImmutable<Vector3>): Vector3;
    /**
     * Gets the center of the vectors "value1" and "value2" and stores the result in the vector "ref"
     * Example Playground https://playground.babylonjs.com/#R1F8YU#73
     * @param value1 defines first vector
     * @param value2 defines second vector
     * @param ref defines third vector
     * @returns ref
     */
    static CenterToRef<T extends Vector3>(value1: DeepImmutable<Vector3>, value2: DeepImmutable<Vector3>, ref: T): T;
    /**
     * Given three orthogonal normalized left-handed oriented Vector3 axis in space (target system),
     * RotationFromAxis() returns the rotation Euler angles (ex : rotation.x, rotation.y, rotation.z) to apply
     * to something in order to rotate it from its local system to the given target system
     * Note: axis1, axis2 and axis3 are normalized during this operation
     * Example Playground https://playground.babylonjs.com/#R1F8YU#106
     * @param axis1 defines the first axis
     * @param axis2 defines the second axis
     * @param axis3 defines the third axis
     * @returns a new Vector3
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/target_align
     */
    static RotationFromAxis<T extends Vector3>(axis1: DeepImmutable<T>, axis2: DeepImmutable<Vector3>, axis3: DeepImmutable<Vector3>): T;
    /**
     * The same than RotationFromAxis but updates the given ref Vector3 parameter instead of returning a new Vector3
     * Example Playground https://playground.babylonjs.com/#R1F8YU#107
     * @param axis1 defines the first axis
     * @param axis2 defines the second axis
     * @param axis3 defines the third axis
     * @param ref defines the Vector3 where to store the result
     * @returns result input
     */
    static RotationFromAxisToRef<T extends Vector3>(axis1: DeepImmutable<Vector3>, axis2: DeepImmutable<Vector3>, axis3: DeepImmutable<Vector3>, ref: T): T;
}
/**
 * Vector4 class created for EulerAngle class conversion to Quaternion
 */
export declare class Vector4 implements Vector<Tuple<number, 4>>, IVector4Like {
    /** x value of the vector */
    x: number;
    /** y value of the vector */
    y: number;
    /** z value of the vector */
    z: number;
    /** w value of the vector */
    w: number;
    private static _ZeroReadOnly;
    /**
     * @see Tensor.dimension
     */
    readonly dimension: Readonly<[4]>;
    /**
     * @see Tensor.rank
     */
    readonly rank: 1;
    /**
     * Creates a Vector4 object from the given floats.
     * @param x x value of the vector
     * @param y y value of the vector
     * @param z z value of the vector
     * @param w w value of the vector
     */
    constructor(
    /** x value of the vector */
    x?: number, 
    /** y value of the vector */
    y?: number, 
    /** z value of the vector */
    z?: number, 
    /** w value of the vector */
    w?: number);
    /**
     * Returns the string with the Vector4 coordinates.
     * @returns a string containing all the vector values
     */
    toString(): string;
    /**
     * Returns the string "Vector4".
     * @returns "Vector4"
     */
    getClassName(): string;
    /**
     * Returns the Vector4 hash code.
     * @returns a unique hash code
     */
    getHashCode(): number;
    /**
     * Returns a new array populated with 4 elements : the Vector4 coordinates.
     * @returns the resulting array
     */
    asArray(): Tuple<number, 4>;
    /**
     * Populates the given array from the given index with the Vector4 coordinates.
     * @param array array to populate
     * @param index index of the array to start at (default: 0)
     * @returns the Vector4.
     */
    toArray(array: FloatArray, index?: number): this;
    /**
     * Update the current vector from an array
     * @param array defines the destination array
     * @param offset defines the offset in the destination array
     * @returns the current Vector3
     */
    fromArray(array: FloatArray, offset?: number): this;
    /**
     * Adds the given vector to the current Vector4.
     * @param otherVector the vector to add
     * @returns the updated Vector4.
     */
    addInPlace(otherVector: DeepImmutable<Vector4>): this;
    /**
     * Adds the given coordinates to the current Vector4
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @param w defines the w coordinate of the operand
     * @returns the current updated Vector4
     */
    addInPlaceFromFloats(x: number, y: number, z: number, w: number): this;
    /**
     * Returns a new Vector4 as the result of the addition of the current Vector4 and the given one.
     * @param otherVector the vector to add
     * @returns the resulting vector
     */
    add(otherVector: DeepImmutable<Vector4>): this;
    /**
     * Updates the given vector "result" with the result of the addition of the current Vector4 and the given one.
     * @param otherVector the vector to add
     * @param result the vector to store the result
     * @returns result input
     */
    addToRef<T extends Vector4>(otherVector: DeepImmutable<Vector4>, result: T): T;
    /**
     * Subtract in place the given vector from the current Vector4.
     * @param otherVector the vector to subtract
     * @returns the updated Vector4.
     */
    subtractInPlace(otherVector: DeepImmutable<Vector4>): this;
    /**
     * Returns a new Vector4 with the result of the subtraction of the given vector from the current Vector4.
     * @param otherVector the vector to add
     * @returns the new vector with the result
     */
    subtract(otherVector: DeepImmutable<Vector4>): this;
    /**
     * Sets the given vector "result" with the result of the subtraction of the given vector from the current Vector4.
     * @param otherVector the vector to subtract
     * @param result the vector to store the result
     * @returns result input
     */
    subtractToRef<T extends Vector4>(otherVector: DeepImmutable<Vector4>, result: T): T;
    /**
     * Returns a new Vector4 set with the result of the subtraction of the given floats from the current Vector4 coordinates.
     * @param x value to subtract
     * @param y value to subtract
     * @param z value to subtract
     * @param w value to subtract
     * @returns new vector containing the result
     */
    subtractFromFloats(x: number, y: number, z: number, w: number): this;
    /**
     * Sets the given vector "result" set with the result of the subtraction of the given floats from the current Vector4 coordinates.
     * @param x value to subtract
     * @param y value to subtract
     * @param z value to subtract
     * @param w value to subtract
     * @param result the vector to store the result in
     * @returns result input
     */
    subtractFromFloatsToRef<T extends Vector4>(x: number, y: number, z: number, w: number, result: T): T;
    /**
     * Returns a new Vector4 set with the current Vector4 negated coordinates.
     * @returns a new vector with the negated values
     */
    negate(): this;
    /**
     * Negate this vector in place
     * @returns this
     */
    negateInPlace(): this;
    /**
     * Negate the current Vector4 and stores the result in the given vector "result" coordinates
     * @param result defines the Vector3 object where to store the result
     * @returns the result
     */
    negateToRef<T extends Vector4>(result: T): T;
    /**
     * Multiplies the current Vector4 coordinates by scale (float).
     * @param scale the number to scale with
     * @returns the updated Vector4.
     */
    scaleInPlace(scale: number): this;
    /**
     * Returns a new Vector4 set with the current Vector4 coordinates multiplied by scale (float).
     * @param scale the number to scale with
     * @returns a new vector with the result
     */
    scale(scale: number): this;
    /**
     * Sets the given vector "result" with the current Vector4 coordinates multiplied by scale (float).
     * @param scale the number to scale with
     * @param result a vector to store the result in
     * @returns result input
     */
    scaleToRef<T extends Vector4>(scale: number, result: T): T;
    /**
     * Scale the current Vector4 values by a factor and add the result to a given Vector4
     * @param scale defines the scale factor
     * @param result defines the Vector4 object where to store the result
     * @returns result input
     */
    scaleAndAddToRef<T extends Vector4>(scale: number, result: T): T;
    /**
     * Boolean : True if the current Vector4 coordinates are stricly equal to the given ones.
     * @param otherVector the vector to compare against
     * @returns true if they are equal
     */
    equals(otherVector: DeepImmutable<Vector4>): boolean;
    /**
     * Boolean : True if the current Vector4 coordinates are each beneath the distance "epsilon" from the given vector ones.
     * @param otherVector vector to compare against
     * @param epsilon (Default: very small number)
     * @returns true if they are equal
     */
    equalsWithEpsilon(otherVector: DeepImmutable<Vector4>, epsilon?: number): boolean;
    /**
     * Boolean : True if the given floats are strictly equal to the current Vector4 coordinates.
     * @param x x value to compare against
     * @param y y value to compare against
     * @param z z value to compare against
     * @param w w value to compare against
     * @returns true if equal
     */
    equalsToFloats(x: number, y: number, z: number, w: number): boolean;
    /**
     * Multiplies in place the current Vector4 by the given one.
     * @param otherVector vector to multiple with
     * @returns the updated Vector4.
     */
    multiplyInPlace(otherVector: DeepImmutable<Vector4>): this;
    /**
     * Returns a new Vector4 set with the multiplication result of the current Vector4 and the given one.
     * @param otherVector vector to multiple with
     * @returns resulting new vector
     */
    multiply(otherVector: DeepImmutable<Vector4>): this;
    /**
     * Updates the given vector "result" with the multiplication result of the current Vector4 and the given one.
     * @param otherVector vector to multiple with
     * @param result vector to store the result
     * @returns result input
     */
    multiplyToRef<T extends Vector4>(otherVector: DeepImmutable<Vector4>, result: T): T;
    /**
     * Returns a new Vector4 set with the multiplication result of the given floats and the current Vector4 coordinates.
     * @param x x value multiply with
     * @param y y value multiply with
     * @param z z value multiply with
     * @param w w value multiply with
     * @returns resulting new vector
     */
    multiplyByFloats(x: number, y: number, z: number, w: number): this;
    /**
     * Returns a new Vector4 set with the division result of the current Vector4 by the given one.
     * @param otherVector vector to devide with
     * @returns resulting new vector
     */
    divide(otherVector: DeepImmutable<Vector4>): this;
    /**
     * Updates the given vector "result" with the division result of the current Vector4 by the given one.
     * @param otherVector vector to devide with
     * @param result vector to store the result
     * @returns result input
     */
    divideToRef<T extends Vector4>(otherVector: DeepImmutable<Vector4>, result: T): T;
    /**
     * Divides the current Vector3 coordinates by the given ones.
     * @param otherVector vector to devide with
     * @returns the updated Vector3.
     */
    divideInPlace(otherVector: DeepImmutable<Vector4>): this;
    /**
     * Updates the Vector4 coordinates with the minimum values between its own and the given vector ones
     * @param other defines the second operand
     * @returns the current updated Vector4
     */
    minimizeInPlace(other: DeepImmutable<Vector4>): this;
    /**
     * Updates the Vector4 coordinates with the maximum values between its own and the given vector ones
     * @param other defines the second operand
     * @returns the current updated Vector4
     */
    maximizeInPlace(other: DeepImmutable<Vector4>): this;
    /**
     * Updates the current Vector4 with the minimal coordinate values between its and the given coordinates
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @param w defines the w coordinate of the operand
     * @returns the current updated Vector4
     */
    minimizeInPlaceFromFloats(x: number, y: number, z: number, w: number): this;
    /**
     * Updates the current Vector4 with the maximal coordinate values between its and the given coordinates.
     * @param x defines the x coordinate of the operand
     * @param y defines the y coordinate of the operand
     * @param z defines the z coordinate of the operand
     * @param w defines the w coordinate of the operand
     * @returns the current updated Vector4
     */
    maximizeInPlaceFromFloats(x: number, y: number, z: number, w: number): this;
    /**
     * Gets the current Vector4's floored values and stores them in result
     * @param result the vector to store the result in
     * @returns the result vector
     */
    floorToRef<T extends this>(result: T): T;
    /**
     * Gets a new Vector4 from current Vector4 floored values
     * @returns a new Vector4
     */
    floor(): this;
    /**
     * Gets the current Vector4's fractional values and stores them in result
     * @param result the vector to store the result in
     * @returns the result vector
     */
    fractToRef<T extends this>(result: T): T;
    /**
     * Gets a new Vector4 from current Vector4 fractional values
     * @returns a new Vector4
     */
    fract(): this;
    /**
     * Returns the Vector4 length (float).
     * @returns the length
     */
    length(): number;
    /**
     * Returns the Vector4 squared length (float).
     * @returns the length squared
     */
    lengthSquared(): number;
    /**
     * Normalizes in place the Vector4.
     * @returns the updated Vector4.
     */
    normalize(): this;
    /**
     * Normalize the current Vector4 with the given input length.
     * Please note that this is an in place operation.
     * @param len the length of the vector
     * @returns the current updated Vector4
     */
    normalizeFromLength(len: number): this;
    /**
     * Normalize the current Vector4 to a new vector
     * @returns the new Vector4
     */
    normalizeToNew(): this;
    /**
     * Normalize the current Vector4 to the reference
     * @param reference define the Vector4 to update
     * @returns the updated Vector4
     */
    normalizeToRef<T extends this>(reference: T): T;
    /**
     * Returns a new Vector3 from the Vector4 (x, y, z) coordinates.
     * @returns this converted to a new vector3
     */
    toVector3(): Vector3;
    /**
     * Returns a new Vector4 copied from the current one.
     * @returns the new cloned vector
     */
    clone(): this;
    /**
     * Updates the current Vector4 with the given one coordinates.
     * @param source the source vector to copy from
     * @returns the updated Vector4.
     */
    copyFrom(source: DeepImmutable<Vector4>): this;
    /**
     * Updates the current Vector4 coordinates with the given floats.
     * @param x float to copy from
     * @param y float to copy from
     * @param z float to copy from
     * @param w float to copy from
     * @returns the updated Vector4.
     */
    copyFromFloats(x: number, y: number, z: number, w: number): this;
    /**
     * Updates the current Vector4 coordinates with the given floats.
     * @param x float to set from
     * @param y float to set from
     * @param z float to set from
     * @param w float to set from
     * @returns the updated Vector4.
     */
    set(x: number, y: number, z: number, w: number): this;
    /**
     * Copies the given float to the current Vector4 coordinates
     * @param v defines the x, y, z and w coordinates of the operand
     * @returns the current updated Vector4
     */
    setAll(v: number): this;
    /**
     * Returns the dot product (float) between the current vectors and "otherVector"
     * @param otherVector defines the right operand
     * @returns the dot product
     */
    dot(otherVector: DeepImmutable<this>): number;
    /**
     * Returns a new Vector4 set from the starting index of the given array.
     * @param array the array to pull values from
     * @param offset the offset into the array to start at
     * @returns the new vector
     */
    static FromArray(array: DeepImmutable<ArrayLike<number>>, offset?: number): Vector4;
    /**
     * Updates the given vector "result" from the starting index of the given array.
     * @param array the array to pull values from
     * @param offset the offset into the array to start at
     * @param result the vector to store the result in
     * @returns result input
     */
    static FromArrayToRef<T extends Vector4>(array: DeepImmutable<ArrayLike<number>>, offset: number, result: T): T;
    /**
     * Updates the given vector "result" from the starting index of the given Float32Array.
     * @param array the array to pull values from
     * @param offset the offset into the array to start at
     * @param result the vector to store the result in
     * @returns result input
     */
    static FromFloatArrayToRef<T extends Vector4>(array: DeepImmutable<Float32Array>, offset: number, result: T): T;
    /**
     * Updates the given vector "result" coordinates from the given floats.
     * @param x float to set from
     * @param y float to set from
     * @param z float to set from
     * @param w float to set from
     * @param result the vector to the floats in
     * @returns result input
     */
    static FromFloatsToRef<T extends Vector4>(x: number, y: number, z: number, w: number, result: T): T;
    /**
     * Returns a new Vector4 set to (0.0, 0.0, 0.0, 0.0)
     * @returns the new vector
     */
    static Zero(): Vector4;
    /**
     * Returns a new Vector4 set to (1.0, 1.0, 1.0, 1.0)
     * @returns the new vector
     */
    static One(): Vector4;
    /**
     * Returns a new Vector4 with random values between min and max
     * @param min the minimum random value
     * @param max the maximum random value
     * @returns a Vector4 with random values between min and max
     */
    static Random(min?: number, max?: number): Vector4;
    /**
     * Sets a Vector4 with random values between min and max
     * @param min the minimum random value
     * @param max the maximum random value
     * @param ref the ref to store the values in
     * @returns the ref with random values between min and max
     */
    static RandomToRef<T extends Vector4>(min: number | undefined, max: number | undefined, ref: T): T;
    /**
     * Returns a new Vector4 set with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
     * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
     * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
     * @param value defines the current value
     * @param min defines the lower range value
     * @param max defines the upper range value
     * @returns the new Vector4
     */
    static Clamp<T extends Vector4>(value: DeepImmutable<T>, min: DeepImmutable<Vector4>, max: DeepImmutable<Vector4>): T;
    /**
     * Sets the given vector "result" with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
     * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
     * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
     * @param value defines the current value
     * @param min defines the lower range value
     * @param max defines the upper range value
     * @param result defines the Vector4 where to store the result
     * @returns result input
     */
    static ClampToRef<T extends Vector4>(value: DeepImmutable<Vector4>, min: DeepImmutable<Vector4>, max: DeepImmutable<Vector4>, result: T): T;
    /**
     * Checks if a given vector is inside a specific range
     * Example Playground https://playground.babylonjs.com/#R1F8YU#75
     * @param v defines the vector to test
     * @param min defines the minimum range
     * @param max defines the maximum range
     */
    static CheckExtends(v: Vector4, min: Vector4, max: Vector4): void;
    /**
     * Gets a zero Vector4 that must not be updated
     */
    static get ZeroReadOnly(): DeepImmutable<Vector4>;
    /**
     * Returns a new normalized Vector4 from the given one.
     * @param vector the vector to normalize
     * @returns the vector
     */
    static Normalize(vector: DeepImmutable<Vector4>): Vector4;
    /**
     * Updates the given vector "result" from the normalization of the given one.
     * @param vector the vector to normalize
     * @param result the vector to store the result in
     * @returns result input
     */
    static NormalizeToRef<T extends Vector4>(vector: DeepImmutable<Vector4>, result: T): T;
    /**
     * Returns a vector with the minimum values from the left and right vectors
     * @param left left vector to minimize
     * @param right right vector to minimize
     * @returns a new vector with the minimum of the left and right vector values
     */
    static Minimize<T extends Vector4>(left: DeepImmutable<T>, right: DeepImmutable<Vector4>): T;
    /**
     * Returns a vector with the maximum values from the left and right vectors
     * @param left left vector to maximize
     * @param right right vector to maximize
     * @returns a new vector with the maximum of the left and right vector values
     */
    static Maximize<T extends Vector4>(left: DeepImmutable<T>, right: DeepImmutable<Vector4>): T;
    /**
     * Returns the distance (float) between the vectors "value1" and "value2".
     * @param value1 value to calulate the distance between
     * @param value2 value to calulate the distance between
     * @returns the distance between the two vectors
     */
    static Distance(value1: DeepImmutable<Vector4>, value2: DeepImmutable<Vector4>): number;
    /**
     * Returns the squared distance (float) between the vectors "value1" and "value2".
     * @param value1 value to calulate the distance between
     * @param value2 value to calulate the distance between
     * @returns the distance between the two vectors squared
     */
    static DistanceSquared(value1: DeepImmutable<Vector4>, value2: DeepImmutable<Vector4>): number;
    /**
     * Returns a new Vector4 located at the center between the vectors "value1" and "value2".
     * @param value1 value to calulate the center between
     * @param value2 value to calulate the center between
     * @returns the center between the two vectors
     */
    static Center(value1: DeepImmutable<Vector4>, value2: DeepImmutable<Vector4>): Vector4;
    /**
     * Gets the center of the vectors "value1" and "value2" and stores the result in the vector "ref"
     * @param value1 defines first vector
     * @param value2 defines second vector
     * @param ref defines third vector
     * @returns ref
     */
    static CenterToRef<T extends Vector4>(value1: DeepImmutable<Vector4>, value2: DeepImmutable<Vector4>, ref: T): T;
    /**
     * Returns a new Vector4 set with the result of the transformation by the given matrix of the given vector.
     * This method computes tranformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
     * The difference with Vector3.TransformCoordinates is that the w component is not used to divide the other coordinates but is returned in the w coordinate instead
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @returns the transformed Vector4
     */
    static TransformCoordinates(vector: DeepImmutable<Vector3>, transformation: DeepImmutable<Matrix>): Vector4;
    /**
     * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given vector
     * This method computes tranformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
     * The difference with Vector3.TransformCoordinatesToRef is that the w component is not used to divide the other coordinates but is returned in the w coordinate instead
     * @param vector defines the Vector3 to transform
     * @param transformation defines the transformation matrix
     * @param result defines the Vector4 where to store the result
     * @returns result input
     */
    static TransformCoordinatesToRef<T extends Vector4>(vector: DeepImmutable<Vector3>, transformation: DeepImmutable<Matrix>, result: T): T;
    /**
     * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given floats (x, y, z)
     * This method computes tranformed coordinates only, not transformed direction vectors
     * The difference with Vector3.TransformCoordinatesFromFloatsToRef is that the w component is not used to divide the other coordinates but is returned in the w coordinate instead
     * @param x define the x coordinate of the source vector
     * @param y define the y coordinate of the source vector
     * @param z define the z coordinate of the source vector
     * @param transformation defines the transformation matrix
     * @param result defines the Vector4 where to store the result
     * @returns result input
     */
    static TransformCoordinatesFromFloatsToRef<T extends Vector4>(x: number, y: number, z: number, transformation: DeepImmutable<Matrix>, result: T): T;
    /**
     * Returns a new Vector4 set with the result of the normal transformation by the given matrix of the given vector.
     * This methods computes transformed normalized direction vectors only.
     * @param vector the vector to transform
     * @param transformation the transformation matrix to apply
     * @returns the new vector
     */
    static TransformNormal<T extends Vector4>(vector: DeepImmutable<T>, transformation: DeepImmutable<Matrix>): T;
    /**
     * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given vector.
     * This methods computes transformed normalized direction vectors only.
     * @param vector the vector to transform
     * @param transformation the transformation matrix to apply
     * @param result the vector to store the result in
     * @returns result input
     */
    static TransformNormalToRef<T extends Vector4>(vector: DeepImmutable<Vector4>, transformation: DeepImmutable<Matrix>, result: T): T;
    /**
     * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given floats (x, y, z, w).
     * This methods computes transformed normalized direction vectors only.
     * @param x value to transform
     * @param y value to transform
     * @param z value to transform
     * @param w value to transform
     * @param transformation the transformation matrix to apply
     * @param result the vector to store the results in
     * @returns result input
     */
    static TransformNormalFromFloatsToRef<T extends Vector4>(x: number, y: number, z: number, w: number, transformation: DeepImmutable<Matrix>, result: T): T;
    /**
     * Creates a new Vector4 from a Vector3
     * @param source defines the source data
     * @param w defines the 4th component (default is 0)
     * @returns a new Vector4
     */
    static FromVector3(source: Vector3, w?: number): Vector4;
    /**
     * Returns the dot product (float) between the vectors "left" and "right"
     * @param left defines the left operand
     * @param right defines the right operand
     * @returns the dot product
     */
    static Dot(left: DeepImmutable<Vector4>, right: DeepImmutable<Vector4>): number;
}
/**
 * Class used to store quaternion data
 * Example Playground - Overview - https://playground.babylonjs.com/#L49EJ7#100
 * @see https://en.wikipedia.org/wiki/Quaternion
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms
 */
export declare class Quaternion implements Tensor<Tuple<number, 4>>, IQuaternionLike {
    /** @internal */
    _x: number;
    /** @internal */
    _y: number;
    /** @internal */
    _z: number;
    /** @internal */
    _w: number;
    /** @internal */
    _isDirty: boolean;
    /** Gets or sets the x coordinate */
    get x(): number;
    set x(value: number);
    /** Gets or sets the y coordinate */
    get y(): number;
    set y(value: number);
    /** Gets or sets the z coordinate */
    get z(): number;
    set z(value: number);
    /** Gets or sets the w coordinate */
    get w(): number;
    set w(value: number);
    /**
     * @see Tensor.dimension
     */
    readonly dimension: Readonly<[4]>;
    /**
     * @see Tensor.rank
     */
    readonly rank: 1;
    /**
     * Creates a new Quaternion from the given floats
     * @param x defines the first component (0 by default)
     * @param y defines the second component (0 by default)
     * @param z defines the third component (0 by default)
     * @param w defines the fourth component (1.0 by default)
     */
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * Gets a string representation for the current quaternion
     * @returns a string with the Quaternion coordinates
     */
    toString(): string;
    /**
     * Gets the class name of the quaternion
     * @returns the string "Quaternion"
     */
    getClassName(): string;
    /**
     * Gets a hash code for this quaternion
     * @returns the quaternion hash code
     */
    getHashCode(): number;
    /**
     * Copy the quaternion to an array
     * Example Playground https://playground.babylonjs.com/#L49EJ7#13
     * @returns a new array populated with 4 elements from the quaternion coordinates
     */
    asArray(): Tuple<number, 4>;
    /**
     * Stores from the starting index in the given array the Quaternion successive values
     * Example Playground https://playground.babylonjs.com/#L49EJ7#59
     * @param array defines the array where to store the x,y,z,w components
     * @param index defines an optional index in the target array to define where to start storing values
     * @returns the current Quaternion object
     */
    toArray(array: FloatArray, index?: number): this;
    fromArray(array: FloatArray, index?: number): this;
    /**
     * Check if two quaternions are equals
     * Example Playground https://playground.babylonjs.com/#L49EJ7#38
     * @param otherQuaternion defines the second operand
     * @returns true if the current quaternion and the given one coordinates are strictly equals
     */
    equals(otherQuaternion: DeepImmutable<Quaternion>): boolean;
    /**
     * Gets a boolean if two quaternions are equals (using an epsilon value)
     * Example Playground https://playground.babylonjs.com/#L49EJ7#37
     * @param otherQuaternion defines the other quaternion
     * @param epsilon defines the minimal distance to consider equality
     * @returns true if the given quaternion coordinates are close to the current ones by a distance of epsilon.
     */
    equalsWithEpsilon(otherQuaternion: DeepImmutable<Quaternion>, epsilon?: number): boolean;
    /**
     * Clone the current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#12
     * @returns a new quaternion copied from the current one
     */
    clone(): this;
    /**
     * Copy a quaternion to the current one
     * Example Playground https://playground.babylonjs.com/#L49EJ7#86
     * @param other defines the other quaternion
     * @returns the updated current quaternion
     */
    copyFrom(other: DeepImmutable<Quaternion>): this;
    /**
     * Updates the current quaternion with the given float coordinates
     * Example Playground https://playground.babylonjs.com/#L49EJ7#87
     * @param x defines the x coordinate
     * @param y defines the y coordinate
     * @param z defines the z coordinate
     * @param w defines the w coordinate
     * @returns the updated current quaternion
     */
    copyFromFloats(x: number, y: number, z: number, w: number): this;
    /**
     * Updates the current quaternion from the given float coordinates
     * Example Playground https://playground.babylonjs.com/#L49EJ7#56
     * @param x defines the x coordinate
     * @param y defines the y coordinate
     * @param z defines the z coordinate
     * @param w defines the w coordinate
     * @returns the updated current quaternion
     */
    set(x: number, y: number, z: number, w: number): this;
    setAll(value: number): this;
    /**
     * Adds two quaternions
     * Example Playground https://playground.babylonjs.com/#L49EJ7#10
     * @param other defines the second operand
     * @returns a new quaternion as the addition result of the given one and the current quaternion
     */
    add(other: DeepImmutable<Quaternion>): this;
    /**
     * Add a quaternion to the current one
     * Example Playground https://playground.babylonjs.com/#L49EJ7#11
     * @param other defines the quaternion to add
     * @returns the current quaternion
     */
    addInPlace(other: DeepImmutable<Quaternion>): this;
    addToRef<T extends this>(other: DeepImmutable<this>, result: T): T;
    addInPlaceFromFloats(x: number, y: number, z: number, w: number): this;
    subtractToRef<T extends this>(other: DeepImmutable<this>, result: T): T;
    subtractFromFloats(x: number, y: number, z: number, w: number): this;
    subtractFromFloatsToRef<T extends this>(x: number, y: number, z: number, w: number, result: T): T;
    /**
     * Subtract two quaternions
     * Example Playground https://playground.babylonjs.com/#L49EJ7#57
     * @param other defines the second operand
     * @returns a new quaternion as the subtraction result of the given one from the current one
     */
    subtract(other: DeepImmutable<this>): this;
    /**
     * Subtract a quaternion to the current one
     * Example Playground https://playground.babylonjs.com/#L49EJ7#58
     * @param other defines the quaternion to subtract
     * @returns the current quaternion
     */
    subtractInPlace(other: DeepImmutable<Quaternion>): this;
    /**
     * Multiplies the current quaternion by a scale factor
     * Example Playground https://playground.babylonjs.com/#L49EJ7#88
     * @param value defines the scale factor
     * @returns a new quaternion set by multiplying the current quaternion coordinates by the float "scale"
     */
    scale(value: number): this;
    /**
     * Scale the current quaternion values by a factor and stores the result to a given quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#89
     * @param scale defines the scale factor
     * @param result defines the Quaternion object where to store the result
     * @returns result input
     */
    scaleToRef<T extends Quaternion>(scale: number, result: T): T;
    /**
     * Multiplies in place the current quaternion by a scale factor
     * Example Playground https://playground.babylonjs.com/#L49EJ7#90
     * @param value defines the scale factor
     * @returns the current modified quaternion
     */
    scaleInPlace(value: number): this;
    /**
     * Scale the current quaternion values by a factor and add the result to a given quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#91
     * @param scale defines the scale factor
     * @param result defines the Quaternion object where to store the result
     * @returns result input
     */
    scaleAndAddToRef<T extends Quaternion>(scale: number, result: T): T;
    /**
     * Multiplies two quaternions
     * Example Playground https://playground.babylonjs.com/#L49EJ7#43
     * @param q1 defines the second operand
     * @returns a new quaternion set as the multiplication result of the current one with the given one "q1"
     */
    multiply(q1: DeepImmutable<Quaternion>): this;
    /**
     * Sets the given "result" as the multiplication result of the current one with the given one "q1"
     * Example Playground https://playground.babylonjs.com/#L49EJ7#45
     * @param q1 defines the second operand
     * @param result defines the target quaternion
     * @returns the current quaternion
     */
    multiplyToRef<T extends Quaternion>(q1: DeepImmutable<Quaternion>, result: T): T;
    /**
     * Updates the current quaternion with the multiplication of itself with the given one "q1"
     * Example Playground https://playground.babylonjs.com/#L49EJ7#46
     * @param other defines the second operand
     * @returns the currentupdated quaternion
     */
    multiplyInPlace(other: DeepImmutable<Quaternion>): this;
    multiplyByFloats(x: number, y: number, z: number, w: number): this;
    /**
     * @internal
     * Do not use
     */
    divide(_other: DeepImmutable<this>): this;
    /**
     * @internal
     * Do not use
     */
    divideToRef<T extends this>(_other: DeepImmutable<this>, _result: T): T;
    /**
     * @internal
     * Do not use
     */
    divideInPlace(_other: DeepImmutable<this>): this;
    /**
     * @internal
     * Do not use
     */
    minimizeInPlace(): this;
    /**
     * @internal
     * Do not use
     */
    minimizeInPlaceFromFloats(): this;
    /**
     * @internal
     * Do not use
     */
    maximizeInPlace(): this;
    /**
     * @internal
     * Do not use
     */
    maximizeInPlaceFromFloats(): this;
    negate(): this;
    negateInPlace(): this;
    negateToRef<T extends this>(result: T): T;
    equalsToFloats(x: number, y: number, z: number, w: number): boolean;
    /**
     * @internal
     * Do not use
     */
    floorToRef<T extends this>(_result: T): T;
    /**
     * @internal
     * Do not use
     */
    floor(): this;
    /**
     * @internal
     * Do not use
     */
    fractToRef<T extends this>(_result: T): T;
    /**
     * @internal
     * Do not use
     */
    fract(): this;
    /**
     * Conjugates the current quaternion and stores the result in the given quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#81
     * @param ref defines the target quaternion
     * @returns result input
     */
    conjugateToRef<T extends Quaternion>(ref: T): T;
    /**
     * Conjugates in place the current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#82
     * @returns the current updated quaternion
     */
    conjugateInPlace(): this;
    /**
     * Conjugates (1-q) the current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#83
     * @returns a new quaternion
     */
    conjugate(): this;
    /**
     * Returns the inverse of the current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#84
     * @returns a new quaternion
     */
    invert(): this;
    /**
     * Invert in place the current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#85
     * @returns this quaternion
     */
    invertInPlace(): this;
    /**
     * Gets squared length of current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#29
     * @returns the quaternion length (float)
     */
    lengthSquared(): number;
    /**
     * Gets length of current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#28
     * @returns the quaternion length (float)
     */
    length(): number;
    /**
     * Normalize in place the current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#54
     * @returns the current updated quaternion
     */
    normalize(): this;
    /**
     * Normalize the current quaternion with the given input length.
     * Please note that this is an in place operation.
     * @param len the length of the quaternion
     * @returns the current updated Quaternion
     */
    normalizeFromLength(len: number): this;
    /**
     * Normalize a copy of the current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#55
     * @returns the normalized quaternion
     */
    normalizeToNew(): this;
    /**
     * Normalize the current Quaternion to the reference
     * @param reference define the Quaternion to update
     * @returns the updated Quaternion
     */
    normalizeToRef<T extends Quaternion>(reference: T): T;
    /**
     * Returns a new Vector3 set with the Euler angles translated from the current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#32
     * @returns a new Vector3 containing the Euler angles
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/rotation_conventions
     */
    toEulerAngles(): Vector3;
    /**
     * Sets the given vector3 "result" with the Euler angles translated from the current quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#31
     * @param result defines the vector which will be filled with the Euler angles
     * @returns result input
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/rotation_conventions
     */
    toEulerAnglesToRef<T extends Vector3>(result: T): T;
    /**
     * Updates the given rotation matrix with the current quaternion values
     * Example Playground https://playground.babylonjs.com/#L49EJ7#67
     * @param result defines the target matrix
     * @returns the updated matrix with the rotation
     */
    toRotationMatrix<T extends Matrix>(result: T): T;
    /**
     * Updates the current quaternion from the given rotation matrix values
     * Example Playground https://playground.babylonjs.com/#L49EJ7#41
     * @param matrix defines the source matrix
     * @returns the current updated quaternion
     */
    fromRotationMatrix(matrix: DeepImmutable<Matrix>): this;
    /**
     * Returns the dot product (float) between the current quaternions and "other"
     * @param other defines the right operand
     * @returns the dot product
     */
    dot(other: DeepImmutable<this>): number;
    /**
     * Creates a new quaternion from a rotation matrix
     * Example Playground https://playground.babylonjs.com/#L49EJ7#101
     * @param matrix defines the source matrix
     * @returns a new quaternion created from the given rotation matrix values
     */
    static FromRotationMatrix(matrix: DeepImmutable<Matrix>): Quaternion;
    /**
     * Updates the given quaternion with the given rotation matrix values
     * Example Playground https://playground.babylonjs.com/#L49EJ7#102
     * @param matrix defines the source matrix
     * @param result defines the target quaternion
     * @returns result input
     */
    static FromRotationMatrixToRef<T extends Quaternion>(matrix: DeepImmutable<Matrix>, result: T): T;
    /**
     * Returns the dot product (float) between the quaternions "left" and "right"
     * Example Playground https://playground.babylonjs.com/#L49EJ7#61
     * @param left defines the left operand
     * @param right defines the right operand
     * @returns the dot product
     */
    static Dot(left: DeepImmutable<Quaternion>, right: DeepImmutable<Quaternion>): number;
    /**
     * Checks if the orientations of two rotation quaternions are close to each other
     * Example Playground https://playground.babylonjs.com/#L49EJ7#60
     * @param quat0 defines the first quaternion to check
     * @param quat1 defines the second quaternion to check
     * @param epsilon defines closeness, 0 same orientation, 1 PI apart, default 0.1
     * @returns true if the two quaternions are close to each other within epsilon
     */
    static AreClose(quat0: DeepImmutable<Quaternion>, quat1: DeepImmutable<Quaternion>, epsilon?: number): boolean;
    /**
     * Smooth interpolation between two quaternions using Slerp
     * Example Playground https://playground.babylonjs.com/#L49EJ7#93
     * @param source source quaternion
     * @param goal goal quaternion
     * @param deltaTime current interpolation frame
     * @param lerpTime total interpolation time
     * @param result the smoothed quaternion
     * @returns the smoothed quaternion
     */
    static SmoothToRef<T extends Quaternion>(source: Quaternion, goal: Quaternion, deltaTime: number, lerpTime: number, result: T): T;
    /**
     * Creates an empty quaternion
     * @returns a new quaternion set to (0.0, 0.0, 0.0)
     */
    static Zero(): Quaternion;
    /**
     * Inverse a given quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#103
     * @param q defines the source quaternion
     * @returns a new quaternion as the inverted current quaternion
     */
    static Inverse<T extends Quaternion>(q: DeepImmutable<T>): T;
    /**
     * Inverse a given quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#104
     * @param q defines the source quaternion
     * @param result the quaternion the result will be stored in
     * @returns the result quaternion
     */
    static InverseToRef<T extends Quaternion>(q: Quaternion, result: T): T;
    /**
     * Creates an identity quaternion
     * @returns the identity quaternion
     */
    static Identity(): Quaternion;
    /**
     * Gets a boolean indicating if the given quaternion is identity
     * @param quaternion defines the quaternion to check
     * @returns true if the quaternion is identity
     */
    static IsIdentity(quaternion: DeepImmutable<Quaternion>): boolean;
    /**
     * Creates a quaternion from a rotation around an axis
     * Example Playground https://playground.babylonjs.com/#L49EJ7#72
     * @param axis defines the axis to use
     * @param angle defines the angle to use
     * @returns a new quaternion created from the given axis (Vector3) and angle in radians (float)
     */
    static RotationAxis(axis: DeepImmutable<Vector3>, angle: number): Quaternion;
    /**
     * Creates a rotation around an axis and stores it into the given quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#73
     * @param axis defines the axis to use
     * @param angle defines the angle to use
     * @param result defines the target quaternion
     * @returns the target quaternion
     */
    static RotationAxisToRef<T extends Quaternion>(axis: DeepImmutable<Vector3>, angle: number, result: T): T;
    /**
     * Creates a new quaternion from data stored into an array
     * Example Playground https://playground.babylonjs.com/#L49EJ7#63
     * @param array defines the data source
     * @param offset defines the offset in the source array where the data starts
     * @returns a new quaternion
     */
    static FromArray(array: DeepImmutable<ArrayLike<number>>, offset?: number): Quaternion;
    /**
     * Updates the given quaternion "result" from the starting index of the given array.
     * Example Playground https://playground.babylonjs.com/#L49EJ7#64
     * @param array the array to pull values from
     * @param offset the offset into the array to start at
     * @param result the quaternion to store the result in
     * @returns result input
     */
    static FromArrayToRef<T extends Quaternion>(array: DeepImmutable<ArrayLike<number>>, offset: number, result: T): T;
    /**
     * Sets the given quaternion "result" with the given floats.
     * @param x defines the x coordinate of the source
     * @param y defines the y coordinate of the source
     * @param z defines the z coordinate of the source
     * @param w defines the w coordinate of the source
     * @param result defines the quaternion where to store the result
     * @returns the result quaternion
     */
    static FromFloatsToRef<T extends Quaternion = Quaternion>(x: number, y: number, z: number, w: number, result: T): T;
    /**
     * Create a quaternion from Euler rotation angles
     * Example Playground https://playground.babylonjs.com/#L49EJ7#33
     * @param x Pitch
     * @param y Yaw
     * @param z Roll
     * @returns the new Quaternion
     */
    static FromEulerAngles(x: number, y: number, z: number): Quaternion;
    /**
     * Updates a quaternion from Euler rotation angles
     * Example Playground https://playground.babylonjs.com/#L49EJ7#34
     * @param x Pitch
     * @param y Yaw
     * @param z Roll
     * @param result the quaternion to store the result
     * @returns the updated quaternion
     */
    static FromEulerAnglesToRef<T extends Quaternion>(x: number, y: number, z: number, result: T): T;
    /**
     * Create a quaternion from Euler rotation vector
     * Example Playground https://playground.babylonjs.com/#L49EJ7#35
     * @param vec the Euler vector (x Pitch, y Yaw, z Roll)
     * @returns the new Quaternion
     */
    static FromEulerVector(vec: DeepImmutable<Vector3>): Quaternion;
    /**
     * Updates a quaternion from Euler rotation vector
     * Example Playground https://playground.babylonjs.com/#L49EJ7#36
     * @param vec the Euler vector (x Pitch, y Yaw, z Roll)
     * @param result the quaternion to store the result
     * @returns the updated quaternion
     */
    static FromEulerVectorToRef<T extends Quaternion>(vec: DeepImmutable<Vector3>, result: T): T;
    /**
     * Updates a quaternion so that it rotates vector vecFrom to vector vecTo
     * Example Playground - https://playground.babylonjs.com/#L49EJ7#70
     * @param vecFrom defines the direction vector from which to rotate
     * @param vecTo defines the direction vector to which to rotate
     * @param result the quaternion to store the result
     * @param epsilon defines the minimal dot value to define vecs as opposite. Default: `BABYLON.Epsilon`
     * @returns the updated quaternion
     */
    static FromUnitVectorsToRef<T extends Quaternion>(vecFrom: DeepImmutable<Vector3>, vecTo: DeepImmutable<Vector3>, result: T, epsilon?: number): T;
    /**
     * Creates a new quaternion from the given Euler float angles (y, x, z)
     * Example Playground https://playground.babylonjs.com/#L49EJ7#77
     * @param yaw defines the rotation around Y axis
     * @param pitch defines the rotation around X axis
     * @param roll defines the rotation around Z axis
     * @returns the new quaternion
     */
    static RotationYawPitchRoll(yaw: number, pitch: number, roll: number): Quaternion;
    /**
     * Creates a new rotation from the given Euler float angles (y, x, z) and stores it in the target quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#78
     * @param yaw defines the rotation around Y axis
     * @param pitch defines the rotation around X axis
     * @param roll defines the rotation around Z axis
     * @param result defines the target quaternion
     * @returns result input
     */
    static RotationYawPitchRollToRef<T extends Quaternion>(yaw: number, pitch: number, roll: number, result: T): T;
    /**
     * Creates a new quaternion from the given Euler float angles expressed in z-x-z orientation
     * Example Playground https://playground.babylonjs.com/#L49EJ7#68
     * @param alpha defines the rotation around first axis
     * @param beta defines the rotation around second axis
     * @param gamma defines the rotation around third axis
     * @returns the new quaternion
     */
    static RotationAlphaBetaGamma(alpha: number, beta: number, gamma: number): Quaternion;
    /**
     * Creates a new quaternion from the given Euler float angles expressed in z-x-z orientation and stores it in the target quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#69
     * @param alpha defines the rotation around first axis
     * @param beta defines the rotation around second axis
     * @param gamma defines the rotation around third axis
     * @param result defines the target quaternion
     * @returns result input
     */
    static RotationAlphaBetaGammaToRef<T extends Quaternion>(alpha: number, beta: number, gamma: number, result: T): T;
    /**
     * Creates a new quaternion containing the rotation value to reach the target (axis1, axis2, axis3) orientation as a rotated XYZ system (axis1, axis2 and axis3 are normalized during this operation)
     * Example Playground https://playground.babylonjs.com/#L49EJ7#75
     * @param axis1 defines the first axis
     * @param axis2 defines the second axis
     * @param axis3 defines the third axis
     * @returns the new quaternion
     */
    static RotationQuaternionFromAxis(axis1: DeepImmutable<Vector3>, axis2: DeepImmutable<Vector3>, axis3: DeepImmutable<Vector3>): Quaternion;
    /**
     * Creates a rotation value to reach the target (axis1, axis2, axis3) orientation as a rotated XYZ system (axis1, axis2 and axis3 are normalized during this operation) and stores it in the target quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#76
     * @param axis1 defines the first axis
     * @param axis2 defines the second axis
     * @param axis3 defines the third axis
     * @param ref defines the target quaternion
     * @returns result input
     */
    static RotationQuaternionFromAxisToRef<T extends Quaternion>(axis1: DeepImmutable<Vector3>, axis2: DeepImmutable<Vector3>, axis3: DeepImmutable<Vector3>, ref: T): T;
    /**
     * Creates a new rotation value to orient an object to look towards the given forward direction, the up direction being oriented like "up".
     * This function works in left handed mode
     * Example Playground https://playground.babylonjs.com/#L49EJ7#96
     * @param forward defines the forward direction - Must be normalized and orthogonal to up.
     * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
     * @returns A new quaternion oriented toward the specified forward and up.
     */
    static FromLookDirectionLH(forward: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>): Quaternion;
    /**
     * Creates a new rotation value to orient an object to look towards the given forward direction with the up direction being oriented like "up", and stores it in the target quaternion.
     * This function works in left handed mode
     * Example Playground https://playground.babylonjs.com/#L49EJ7#97
     * @param forward defines the forward direction - Must be normalized and orthogonal to up.
     * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
     * @param ref defines the target quaternion.
     * @returns result input
     */
    static FromLookDirectionLHToRef<T extends Quaternion>(forward: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>, ref: T): T;
    /**
     * Creates a new rotation value to orient an object to look towards the given forward direction, the up direction being oriented like "up".
     * This function works in right handed mode
     * Example Playground https://playground.babylonjs.com/#L49EJ7#98
     * @param forward defines the forward direction - Must be normalized and orthogonal to up.
     * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
     * @returns A new quaternion oriented toward the specified forward and up.
     */
    static FromLookDirectionRH(forward: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>): Quaternion;
    /**
     * Creates a new rotation value to orient an object to look towards the given forward direction with the up direction being oriented like "up", and stores it in the target quaternion.
     * This function works in right handed mode
     * Example Playground https://playground.babylonjs.com/#L49EJ7#105
     * @param forward defines the forward direction - Must be normalized and orthogonal to up.
     * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
     * @param ref defines the target quaternion.
     * @returns result input
     */
    static FromLookDirectionRHToRef<T extends Quaternion>(forward: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>, ref: T): T;
    /**
     * Interpolates between two quaternions
     * Example Playground https://playground.babylonjs.com/#L49EJ7#79
     * @param left defines first quaternion
     * @param right defines second quaternion
     * @param amount defines the gradient to use
     * @returns the new interpolated quaternion
     */
    static Slerp(left: DeepImmutable<Quaternion>, right: DeepImmutable<Quaternion>, amount: number): Quaternion;
    /**
     * Interpolates between two quaternions and stores it into a target quaternion
     * Example Playground https://playground.babylonjs.com/#L49EJ7#92
     * @param left defines first quaternion
     * @param right defines second quaternion
     * @param amount defines the gradient to use
     * @param result defines the target quaternion
     * @returns result input
     */
    static SlerpToRef<T extends Quaternion>(left: DeepImmutable<Quaternion>, right: DeepImmutable<Quaternion>, amount: number, result: T): T;
    /**
     * Interpolate between two quaternions using Hermite interpolation
     * Example Playground https://playground.babylonjs.com/#L49EJ7#47
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/drawCurves#hermite-quaternion-spline
     * @param value1 defines first quaternion
     * @param tangent1 defines the incoming tangent
     * @param value2 defines second quaternion
     * @param tangent2 defines the outgoing tangent
     * @param amount defines the target quaternion
     * @returns the new interpolated quaternion
     */
    static Hermite<T extends Quaternion>(value1: DeepImmutable<T>, tangent1: DeepImmutable<Quaternion>, value2: DeepImmutable<Quaternion>, tangent2: DeepImmutable<Quaternion>, amount: number): T;
    /**
     * Returns a new Quaternion which is the 1st derivative of the Hermite spline defined by the quaternions "value1", "value2", "tangent1", "tangent2".
     * Example Playground https://playground.babylonjs.com/#L49EJ7#48
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @returns 1st derivative
     */
    static Hermite1stDerivative<T extends Quaternion>(value1: DeepImmutable<T>, tangent1: DeepImmutable<Quaternion>, value2: DeepImmutable<Quaternion>, tangent2: DeepImmutable<Quaternion>, time: number): T;
    /**
     * Update a Quaternion with the 1st derivative of the Hermite spline defined by the quaternions "value1", "value2", "tangent1", "tangent2".
     * Example Playground https://playground.babylonjs.com/#L49EJ7#49
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @param result define where to store the derivative
     * @returns result input
     */
    static Hermite1stDerivativeToRef<T extends Quaternion>(value1: DeepImmutable<Quaternion>, tangent1: DeepImmutable<Quaternion>, value2: DeepImmutable<Quaternion>, tangent2: DeepImmutable<Quaternion>, time: number, result: T): T;
    /**
     * Returns a new Quaternion as the normalization of the given Quaternion
     * @param quat defines the Quaternion to normalize
     * @returns the new Quaternion
     */
    static Normalize(quat: DeepImmutable<Quaternion>): Quaternion;
    /**
     * Sets the given Quaternion "result" with the normalization of the given first Quaternion
     * @param quat defines the Quaternion to normalize
     * @param result defines the Quaternion where to store the result
     * @returns result input
     */
    static NormalizeToRef<T extends Quaternion>(quat: DeepImmutable<Quaternion>, result: T): T;
    /**
     * Returns a new Quaternion set with the coordinates of "value", if the quaternion "value" is in the cube defined by the quaternions "min" and "max"
     * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
     * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
     * @param value defines the current value
     * @param min defines the lower range value
     * @param max defines the upper range value
     * @returns the new Quaternion
     */
    static Clamp<T extends Quaternion>(value: DeepImmutable<T>, min: DeepImmutable<Quaternion>, max: DeepImmutable<Quaternion>): T;
    /**
     * Sets the given quaternion "result" with the coordinates of "value", if the quaternion "value" is in the cube defined by the quaternions "min" and "max"
     * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
     * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
     * @param value defines the current value
     * @param min defines the lower range value
     * @param max defines the upper range value
     * @param result defines the Quaternion where to store the result
     * @returns result input
     */
    static ClampToRef<T extends Quaternion>(value: DeepImmutable<Quaternion>, min: DeepImmutable<Quaternion>, max: DeepImmutable<Quaternion>, result: T): T;
    /**
     * Returns a new Quaternion with random values between min and max
     * @param min the minimum random value
     * @param max the maximum random value
     * @returns a Quaternion with random values between min and max
     */
    static Random(min?: number, max?: number): Quaternion;
    /**
     * Sets a Quaternion with random values between min and max
     * @param min the minimum random value
     * @param max the maximum random value
     * @param ref the ref to store the values in
     * @returns the ref with random values between min and max
     */
    static RandomToRef<T extends Quaternion>(min: number | undefined, max: number | undefined, ref: T): T;
    /**
     * Do not use
     * @internal
     */
    static Minimize(): Quaternion;
    /**
     * Do not use
     * @internal
     */
    static Maximize(): Quaternion;
    /**
     * Returns the distance (float) between the quaternions "value1" and "value2".
     * @param value1 value to calulate the distance between
     * @param value2 value to calulate the distance between
     * @returns the distance between the two quaternions
     */
    static Distance(value1: DeepImmutable<Quaternion>, value2: DeepImmutable<Quaternion>): number;
    /**
     * Returns the squared distance (float) between the quaternions "value1" and "value2".
     * @param value1 value to calulate the distance between
     * @param value2 value to calulate the distance between
     * @returns the distance between the two quaternions squared
     */
    static DistanceSquared(value1: DeepImmutable<Quaternion>, value2: DeepImmutable<Quaternion>): number;
    /**
     * Returns a new Quaternion located at the center between the quaternions "value1" and "value2".
     * @param value1 value to calulate the center between
     * @param value2 value to calulate the center between
     * @returns the center between the two quaternions
     */
    static Center(value1: DeepImmutable<Quaternion>, value2: DeepImmutable<Quaternion>): Quaternion;
    /**
     * Gets the center of the quaternions "value1" and "value2" and stores the result in the quaternion "ref"
     * @param value1 defines first quaternion
     * @param value2 defines second quaternion
     * @param ref defines third quaternion
     * @returns ref
     */
    static CenterToRef<T extends Quaternion>(value1: DeepImmutable<Quaternion>, value2: DeepImmutable<Quaternion>, ref: T): T;
}
/**
 * Class used to store matrix data (4x4)
 * Note on matrix definitions in Babylon.js for setting values directly
 * rather than using one of the methods available.
 * Matrix size is given by rows x columns.
 * A Vector3 is a 1 X 3 matrix [x, y, z].
 *
 * In Babylon.js multiplying a 1 x 3 matrix by a 4 x 4 matrix
 * is done using BABYLON.Vector4.TransformCoordinates(Vector3, Matrix).
 * and extending the passed Vector3 to a Vector4, V = [x, y, z, 1].
 * Let M be a matrix with elements m(row, column), so that
 * m(2, 3) is the element in row 2 column 3 of M.
 *
 * Multiplication is of the form VM and has the resulting Vector4
 * VM = [xm(0, 0) + ym(1, 0) + zm(2, 0) + m(3, 0), xm(0, 1) + ym(1, 1) + zm(2, 1) + m(3, 1), xm(0, 2) + ym(1, 2) + zm(2, 2) + m(3, 2), xm(0, 3) + ym(1, 3) + zm(2, 3) + m(3, 3)].
 * On the web you will find many examples that use the opposite convention of MV,
 * in which case to make use of the examples you will need to transpose the matrix.
 *
 * Example Playground - Overview Linear Algebra - https://playground.babylonjs.com/#AV9X17
 * Example Playground - Overview Transformation - https://playground.babylonjs.com/#AV9X17#1
 * Example Playground - Overview Projection - https://playground.babylonjs.com/#AV9X17#2
 */
export declare class Matrix implements Tensor<Tuple<Tuple<number, 4>, 4>>, IMatrixLike {
    /**
     * @see Tensor.dimension
     */
    readonly dimension: Readonly<[4, 4]>;
    /**
     * @see Tensor.rank
     */
    readonly rank: 2;
    /**
     * Gets the precision of matrix computations
     */
    static get Use64Bits(): boolean;
    private static _UpdateFlagSeed;
    private static _IdentityReadOnly;
    private _isIdentity;
    private _isIdentityDirty;
    private _isIdentity3x2;
    private _isIdentity3x2Dirty;
    /**
     * Gets the update flag of the matrix which is an unique number for the matrix.
     * It will be incremented every time the matrix data change.
     * You can use it to speed the comparison between two versions of the same matrix.
     */
    updateFlag: number;
    private readonly _m;
    /**
     * Gets the internal data of the matrix
     */
    get m(): DeepImmutable<Tuple<number, 16>>;
    /**
     * Update the updateFlag to indicate that the matrix has been updated
     */
    markAsUpdated(): void;
    private _updateIdentityStatus;
    /**
     * Creates an empty matrix (filled with zeros)
     */
    constructor();
    /**
     * Check if the current matrix is identity
     * @returns true is the matrix is the identity matrix
     */
    isIdentity(): boolean;
    /**
     * Check if the current matrix is identity as a texture matrix (3x2 store in 4x4)
     * @returns true is the matrix is the identity matrix
     */
    isIdentityAs3x2(): boolean;
    /**
     * Gets the determinant of the matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#34
     * @returns the matrix determinant
     */
    determinant(): number;
    /**
     * Gets a string with the Matrix values
     * @returns a string with the Matrix values
     */
    toString(): string;
    /**
     * Returns the matrix as a Float32Array or Array<number>
     * @deprecated Use asArray
     */
    toArray(): FloatArray;
    /**
     * Stores the matrix in a Float32Array or Array<number>
     * Example Playground - https://playground.babylonjs.com/#AV9X17#49
     * @param array The destination array
     * @param index The destination index to start ay
     * @returns the matrix
     */
    toArray(array: FloatArray, index: number): this;
    /**
     * Returns the matrix as a Float32Array or Array<number>
     * Example Playground - https://playground.babylonjs.com/#AV9X17#114
     * @returns the matrix underlying array.
     */
    asArray(): Tuple<number, 16>;
    fromArray(array: FloatArray, index?: number): this;
    copyFromFloats(...floats: Tuple<number, 16>): this;
    set(...values: Tuple<number, 16>): this;
    setAll(value: number): this;
    /**
     * Inverts the current matrix in place
     * Example Playground - https://playground.babylonjs.com/#AV9X17#118
     * @returns the current inverted matrix
     */
    invert(): this;
    /**
     * Sets all the matrix elements to zero
     * @returns the current matrix
     */
    reset(): this;
    /**
     * Adds the current matrix with a second one
     * Example Playground - https://playground.babylonjs.com/#AV9X17#44
     * @param other defines the matrix to add
     * @returns a new matrix as the addition of the current matrix and the given one
     */
    add(other: DeepImmutable<Matrix>): this;
    /**
     * Sets the given matrix "result" to the addition of the current matrix and the given one
     * Example Playground - https://playground.babylonjs.com/#AV9X17#45
     * @param other defines the matrix to add
     * @param result defines the target matrix
     * @returns result input
     */
    addToRef<T extends Matrix>(other: DeepImmutable<Matrix>, result: T): T;
    /**
     * Adds in place the given matrix to the current matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#46
     * @param other defines the second operand
     * @returns the current updated matrix
     */
    addToSelf(other: DeepImmutable<Matrix>): this;
    addInPlace(other: DeepImmutable<this>): this;
    addInPlaceFromFloats(...floats: Tuple<number, 16>): this;
    subtract(other: DeepImmutable<this>): this;
    subtractToRef<T extends this>(other: DeepImmutable<this>, result: T): T;
    subtractInPlace(other: DeepImmutable<this>): this;
    subtractFromFloats(...floats: Tuple<number, 16>): this;
    subtractFromFloatsToRef<T extends this>(...args: [...Tuple<number, 16>, T]): T;
    /**
     * Sets the given matrix to the current inverted Matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#119
     * @param other defines the target matrix
     * @returns result input
     */
    invertToRef<T extends Matrix>(other: T): T;
    /**
     * add a value at the specified position in the current Matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#47
     * @param index the index of the value within the matrix. between 0 and 15.
     * @param value the value to be added
     * @returns the current updated matrix
     */
    addAtIndex(index: number, value: number): this;
    /**
     * mutiply the specified position in the current Matrix by a value
     * @param index the index of the value within the matrix. between 0 and 15.
     * @param value the value to be added
     * @returns the current updated matrix
     */
    multiplyAtIndex(index: number, value: number): this;
    /**
     * Inserts the translation vector (using 3 floats) in the current matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#120
     * @param x defines the 1st component of the translation
     * @param y defines the 2nd component of the translation
     * @param z defines the 3rd component of the translation
     * @returns the current updated matrix
     */
    setTranslationFromFloats(x: number, y: number, z: number): this;
    /**
     * Adds the translation vector (using 3 floats) in the current matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#20
     * Example Playground - https://playground.babylonjs.com/#AV9X17#48
     * @param x defines the 1st component of the translation
     * @param y defines the 2nd component of the translation
     * @param z defines the 3rd component of the translation
     * @returns the current updated matrix
     */
    addTranslationFromFloats(x: number, y: number, z: number): this;
    /**
     * Inserts the translation vector in the current matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#121
     * @param vector3 defines the translation to insert
     * @returns the current updated matrix
     */
    setTranslation(vector3: DeepImmutable<Vector3>): this;
    /**
     * Gets the translation value of the current matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#122
     * @returns a new Vector3 as the extracted translation from the matrix
     */
    getTranslation(): Vector3;
    /**
     * Fill a Vector3 with the extracted translation from the matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#123
     * @param result defines the Vector3 where to store the translation
     * @returns the current matrix
     */
    getTranslationToRef<T extends Vector3>(result: T): T;
    /**
     * Remove rotation and scaling part from the matrix
     * @returns the updated matrix
     */
    removeRotationAndScaling(): this;
    /**
     * Copy the current matrix from the given one
     * Example Playground - https://playground.babylonjs.com/#AV9X17#21
     * @param other defines the source matrix
     * @returns the current updated matrix
     */
    copyFrom(other: DeepImmutable<Matrix>): this;
    /**
     * Populates the given array from the starting index with the current matrix values
     * @param array defines the target array
     * @param offset defines the offset in the target array where to start storing values
     * @returns the current matrix
     */
    copyToArray(array: Float32Array | Array<number>, offset?: number): this;
    /**
     * Multiply two matrices
     * Example Playground - https://playground.babylonjs.com/#AV9X17#15
     * A.multiply(B) means apply B to A so result is B x A
     * @param other defines the second operand
     * @returns a new matrix set with the multiplication result of the current Matrix and the given one
     */
    multiply(other: DeepImmutable<Matrix>): this;
    /**
     * This method performs component-by-component in-place multiplication, rather than true matrix multiplication.
     * Use multiply or multiplyToRef for matrix multiplication.
     * @param other defines the second operand
     * @returns the current updated matrix
     */
    multiplyInPlace(other: DeepImmutable<this>): this;
    /**
     * This method performs a component-by-component multiplication of the current matrix with the array of transmitted numbers.
     * Use multiply or multiplyToRef for matrix multiplication.
     * @param floats defines the array of numbers to multiply the matrix by
     * @returns the current updated matrix
     */
    multiplyByFloats(...floats: Tuple<number, 16>): this;
    /**
     * Multiples the current matrix by the given floats and stores them in the given ref
     * @param args The floats and ref
     * @returns The updated ref
     */
    multiplyByFloatsToRef<T extends this>(...args: [...Tuple<number, 16>, T]): T;
    /**
     * Sets the given matrix "result" with the multiplication result of the current Matrix and the given one
     * A.multiplyToRef(B, R) means apply B to A and store in R and R = B x A
     * Example Playground - https://playground.babylonjs.com/#AV9X17#16
     * @param other defines the second operand
     * @param result defines the matrix where to store the multiplication
     * @returns result input
     */
    multiplyToRef<T extends Matrix>(other: DeepImmutable<Matrix>, result: T): T;
    /**
     * Sets the Float32Array "result" from the given index "offset" with the multiplication of the current matrix and the given one
     * @param other defines the second operand
     * @param result defines the array where to store the multiplication
     * @param offset defines the offset in the target array where to start storing values
     * @returns the current matrix
     */
    multiplyToArray(other: DeepImmutable<Matrix>, result: Float32Array | Array<number>, offset: number): this;
    divide(other: DeepImmutable<this>): this;
    divideToRef<T extends this>(other: DeepImmutable<this>, result: T): T;
    divideInPlace(other: DeepImmutable<this>): this;
    minimizeInPlace(other: DeepImmutable<this>): this;
    minimizeInPlaceFromFloats(...floats: Tuple<number, 16>): this;
    maximizeInPlace(other: DeepImmutable<this>): this;
    maximizeInPlaceFromFloats(...floats: Tuple<number, 16>): this;
    negate(): this;
    negateInPlace(): this;
    negateToRef<T extends this>(result: T): T;
    /**
     * Check equality between this matrix and a second one
     * @param value defines the second matrix to compare
     * @returns true is the current matrix and the given one values are strictly equal
     */
    equals(value: DeepImmutable<Matrix>): boolean;
    equalsWithEpsilon(other: DeepImmutable<this>, epsilon?: number): boolean;
    equalsToFloats(...floats: Tuple<number, 16>): boolean;
    floor(): this;
    floorToRef<T extends this>(result: T): T;
    fract(): this;
    fractToRef<T extends this>(result: T): T;
    /**
     * Clone the current matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#18
     * @returns a new matrix from the current matrix
     */
    clone(): this;
    /**
     * Returns the name of the current matrix class
     * @returns the string "Matrix"
     */
    getClassName(): string;
    /**
     * Gets the hash code of the current matrix
     * @returns the hash code
     */
    getHashCode(): number;
    /**
     * Decomposes the current Matrix into a translation, rotation and scaling components of the provided node
     * Example Playground - https://playground.babylonjs.com/#AV9X17#13
     * @param node the node to decompose the matrix to
     * @returns true if operation was successful
     */
    decomposeToTransformNode(node: TransformNode): boolean;
    /**
     * Decomposes the current Matrix into a translation, rotation and scaling components
     * Example Playground - https://playground.babylonjs.com/#AV9X17#12
     * @param scale defines the scale vector3 given as a reference to update
     * @param rotation defines the rotation quaternion given as a reference to update
     * @param translation defines the translation vector3 given as a reference to update
     * @param preserveScalingNode Use scaling sign coming from this node. Otherwise scaling sign might change.
     * @param useAbsoluteScaling Use scaling sign coming from this absoluteScaling when true or scaling otherwise.
     * @returns true if operation was successful
     */
    decompose(scale?: Vector3, rotation?: Quaternion, translation?: Vector3, preserveScalingNode?: TransformNode, useAbsoluteScaling?: boolean): boolean;
    /**
     * Gets specific row of the matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#36
     * @param index defines the number of the row to get
     * @returns the index-th row of the current matrix as a new Vector4
     */
    getRow(index: number): Nullable<Vector4>;
    /**
     * Gets specific row of the matrix to ref
     * Example Playground - https://playground.babylonjs.com/#AV9X17#36
     * @param index defines the number of the row to get
     * @param rowVector vector to store the index-th row of the current matrix
     * @returns result input
     */
    getRowToRef<T extends Vector4>(index: number, rowVector: T): T;
    /**
     * Sets the index-th row of the current matrix to the vector4 values
     * Example Playground - https://playground.babylonjs.com/#AV9X17#36
     * @param index defines the number of the row to set
     * @param row defines the target vector4
     * @returns the updated current matrix
     */
    setRow(index: number, row: Vector4): this;
    /**
     * Compute the transpose of the matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#40
     * @returns the new transposed matrix
     */
    transpose(): this;
    /**
     * Compute the transpose of the matrix and store it in a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#41
     * @param result defines the target matrix
     * @returns result input
     */
    transposeToRef<T extends Matrix>(result: T): T;
    /**
     * Sets the index-th row of the current matrix with the given 4 x float values
     * Example Playground - https://playground.babylonjs.com/#AV9X17#36
     * @param index defines the row index
     * @param x defines the x component to set
     * @param y defines the y component to set
     * @param z defines the z component to set
     * @param w defines the w component to set
     * @returns the updated current matrix
     */
    setRowFromFloats(index: number, x: number, y: number, z: number, w: number): this;
    /**
     * Compute a new matrix set with the current matrix values multiplied by scale (float)
     * @param scale defines the scale factor
     * @returns a new matrix
     */
    scale(scale: number): this;
    /**
     * Scale the current matrix values by a factor to a given result matrix
     * @param scale defines the scale factor
     * @param result defines the matrix to store the result
     * @returns result input
     */
    scaleToRef<T extends Matrix>(scale: number, result: T): T;
    /**
     * Scale the current matrix values by a factor and add the result to a given matrix
     * @param scale defines the scale factor
     * @param result defines the Matrix to store the result
     * @returns result input
     */
    scaleAndAddToRef<T extends Matrix>(scale: number, result: T): T;
    scaleInPlace(scale: number): this;
    /**
     * Writes to the given matrix a normal matrix, computed from this one (using values from identity matrix for fourth row and column).
     * Example Playground - https://playground.babylonjs.com/#AV9X17#17
     * @param ref matrix to store the result
     * @returns the reference matrix
     */
    toNormalMatrix<T extends Matrix>(ref: T): T;
    /**
     * Gets only rotation part of the current matrix
     * @returns a new matrix sets to the extracted rotation matrix from the current one
     */
    getRotationMatrix(): this;
    /**
     * Extracts the rotation matrix from the current one and sets it as the given "result"
     * @param result defines the target matrix to store data to
     * @returns result input
     */
    getRotationMatrixToRef<T extends Matrix>(result: T): T;
    /**
     * Toggles model matrix from being right handed to left handed in place and vice versa
     * @returns the current updated matrix
     */
    toggleModelMatrixHandInPlace(): this;
    /**
     * Toggles projection matrix from being right handed to left handed in place and vice versa
     * @returns the current updated matrix
     */
    toggleProjectionMatrixHandInPlace(): this;
    /**
     * Creates a matrix from an array
     * Example Playground - https://playground.babylonjs.com/#AV9X17#42
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns a new Matrix set from the starting index of the given array
     */
    static FromArray(array: DeepImmutable<ArrayLike<number>>, offset?: number): Matrix;
    /**
     * Copy the content of an array into a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#43
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @param result defines the target matrix
     * @returns result input
     */
    static FromArrayToRef<T extends Matrix>(array: DeepImmutable<ArrayLike<number>>, offset: number, result: T): T;
    /**
     * Stores an array into a matrix after having multiplied each component by a given factor
     * Example Playground - https://playground.babylonjs.com/#AV9X17#50
     * @param array defines the source array
     * @param offset defines the offset in the source array
     * @param scale defines the scaling factor
     * @param result defines the target matrix
     * @returns result input
     */
    static FromFloat32ArrayToRefScaled<T extends Matrix>(array: DeepImmutable<Float32Array | Array<number>>, offset: number, scale: number, result: T): T;
    /**
     * Gets an identity matrix that must not be updated
     */
    static get IdentityReadOnly(): DeepImmutable<Matrix>;
    /**
     * Stores a list of values (16) inside a given matrix
     * @param initialM11 defines 1st value of 1st row
     * @param initialM12 defines 2nd value of 1st row
     * @param initialM13 defines 3rd value of 1st row
     * @param initialM14 defines 4th value of 1st row
     * @param initialM21 defines 1st value of 2nd row
     * @param initialM22 defines 2nd value of 2nd row
     * @param initialM23 defines 3rd value of 2nd row
     * @param initialM24 defines 4th value of 2nd row
     * @param initialM31 defines 1st value of 3rd row
     * @param initialM32 defines 2nd value of 3rd row
     * @param initialM33 defines 3rd value of 3rd row
     * @param initialM34 defines 4th value of 3rd row
     * @param initialM41 defines 1st value of 4th row
     * @param initialM42 defines 2nd value of 4th row
     * @param initialM43 defines 3rd value of 4th row
     * @param initialM44 defines 4th value of 4th row
     * @param result defines the target matrix
     */
    static FromValuesToRef(initialM11: number, initialM12: number, initialM13: number, initialM14: number, initialM21: number, initialM22: number, initialM23: number, initialM24: number, initialM31: number, initialM32: number, initialM33: number, initialM34: number, initialM41: number, initialM42: number, initialM43: number, initialM44: number, result: Matrix): void;
    /**
     * Creates new matrix from a list of values (16)
     * @param initialM11 defines 1st value of 1st row
     * @param initialM12 defines 2nd value of 1st row
     * @param initialM13 defines 3rd value of 1st row
     * @param initialM14 defines 4th value of 1st row
     * @param initialM21 defines 1st value of 2nd row
     * @param initialM22 defines 2nd value of 2nd row
     * @param initialM23 defines 3rd value of 2nd row
     * @param initialM24 defines 4th value of 2nd row
     * @param initialM31 defines 1st value of 3rd row
     * @param initialM32 defines 2nd value of 3rd row
     * @param initialM33 defines 3rd value of 3rd row
     * @param initialM34 defines 4th value of 3rd row
     * @param initialM41 defines 1st value of 4th row
     * @param initialM42 defines 2nd value of 4th row
     * @param initialM43 defines 3rd value of 4th row
     * @param initialM44 defines 4th value of 4th row
     * @returns the new matrix
     */
    static FromValues(initialM11: number, initialM12: number, initialM13: number, initialM14: number, initialM21: number, initialM22: number, initialM23: number, initialM24: number, initialM31: number, initialM32: number, initialM33: number, initialM34: number, initialM41: number, initialM42: number, initialM43: number, initialM44: number): Matrix;
    /**
     * Creates a new matrix composed by merging scale (vector3), rotation (quaternion) and translation (vector3)
     * Example Playground - https://playground.babylonjs.com/#AV9X17#24
     * @param scale defines the scale vector3
     * @param rotation defines the rotation quaternion
     * @param translation defines the translation vector3
     * @returns a new matrix
     */
    static Compose(scale: DeepImmutable<Vector3>, rotation: DeepImmutable<Quaternion>, translation: DeepImmutable<Vector3>): Matrix;
    /**
     * Sets a matrix to a value composed by merging scale (vector3), rotation (quaternion) and translation (vector3)
     * Example Playground - https://playground.babylonjs.com/#AV9X17#25
     * @param scale defines the scale vector3
     * @param rotation defines the rotation quaternion
     * @param translation defines the translation vector3
     * @param result defines the target matrix
     * @returns result input
     */
    static ComposeToRef<T extends Matrix>(scale: DeepImmutable<Vector3>, rotation: DeepImmutable<Quaternion>, translation: DeepImmutable<Vector3>, result: T): T;
    /**
     * Creates a new identity matrix
     * @returns a new identity matrix
     */
    static Identity(): Matrix;
    /**
     * Creates a new identity matrix and stores the result in a given matrix
     * @param result defines the target matrix
     * @returns result input
     */
    static IdentityToRef<T extends Matrix>(result: T): T;
    /**
     * Creates a new zero matrix
     * @returns a new zero matrix
     */
    static Zero(): Matrix;
    /**
     * Creates a new rotation matrix for "angle" radians around the X axis
     * Example Playground - https://playground.babylonjs.com/#AV9X17#97
     * @param angle defines the angle (in radians) to use
     * @returns the new matrix
     */
    static RotationX(angle: number): Matrix;
    /**
     * Creates a new matrix as the invert of a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#124
     * @param source defines the source matrix
     * @returns the new matrix
     */
    static Invert<T extends Matrix>(source: DeepImmutable<T>): T;
    /**
     * Creates a new rotation matrix for "angle" radians around the X axis and stores it in a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#98
     * @param angle defines the angle (in radians) to use
     * @param result defines the target matrix
     * @returns result input
     */
    static RotationXToRef<T extends Matrix>(angle: number, result: T): T;
    /**
     * Creates a new rotation matrix for "angle" radians around the Y axis
     * Example Playground - https://playground.babylonjs.com/#AV9X17#99
     * @param angle defines the angle (in radians) to use
     * @returns the new matrix
     */
    static RotationY(angle: number): Matrix;
    /**
     * Creates a new rotation matrix for "angle" radians around the Y axis and stores it in a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#100
     * @param angle defines the angle (in radians) to use
     * @param result defines the target matrix
     * @returns result input
     */
    static RotationYToRef<T extends Matrix>(angle: number, result: T): T;
    /**
     * Creates a new rotation matrix for "angle" radians around the Z axis
     * Example Playground - https://playground.babylonjs.com/#AV9X17#101
     * @param angle defines the angle (in radians) to use
     * @returns the new matrix
     */
    static RotationZ(angle: number): Matrix;
    /**
     * Creates a new rotation matrix for "angle" radians around the Z axis and stores it in a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#102
     * @param angle defines the angle (in radians) to use
     * @param result defines the target matrix
     * @returns result input
     */
    static RotationZToRef<T extends Matrix>(angle: number, result: T): T;
    /**
     * Creates a new rotation matrix for "angle" radians around the given axis
     * Example Playground - https://playground.babylonjs.com/#AV9X17#96
     * @param axis defines the axis to use
     * @param angle defines the angle (in radians) to use
     * @returns the new matrix
     */
    static RotationAxis(axis: DeepImmutable<Vector3>, angle: number): Matrix;
    /**
     * Creates a new rotation matrix for "angle" radians around the given axis and stores it in a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#94
     * @param axis defines the axis to use
     * @param angle defines the angle (in radians) to use
     * @param result defines the target matrix
     * @returns result input
     */
    static RotationAxisToRef<T extends Matrix>(axis: DeepImmutable<Vector3>, angle: number, result: T): T;
    /**
     * Takes normalised vectors and returns a rotation matrix to align "from" with "to".
     * Taken from http://www.iquilezles.org/www/articles/noacos/noacos.htm
     * Example Playground - https://playground.babylonjs.com/#AV9X17#93
     * @param from defines the vector to align
     * @param to defines the vector to align to
     * @param result defines the target matrix
     * @param useYAxisForCoplanar defines a boolean indicating that we should favor Y axis for coplanar vectors (default is false)
     * @returns result input
     */
    static RotationAlignToRef<T extends Matrix>(from: DeepImmutable<Vector3>, to: DeepImmutable<Vector3>, result: T, useYAxisForCoplanar?: boolean): T;
    /**
     * Creates a rotation matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#103
     * Example Playground - https://playground.babylonjs.com/#AV9X17#105
     * @param yaw defines the yaw angle in radians (Y axis)
     * @param pitch defines the pitch angle in radians (X axis)
     * @param roll defines the roll angle in radians (Z axis)
     * @returns the new rotation matrix
     */
    static RotationYawPitchRoll(yaw: number, pitch: number, roll: number): Matrix;
    /**
     * Creates a rotation matrix and stores it in a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#104
     * @param yaw defines the yaw angle in radians (Y axis)
     * @param pitch defines the pitch angle in radians (X axis)
     * @param roll defines the roll angle in radians (Z axis)
     * @param result defines the target matrix
     * @returns result input
     */
    static RotationYawPitchRollToRef<T extends Matrix>(yaw: number, pitch: number, roll: number, result: T): T;
    /**
     * Creates a scaling matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#107
     * @param x defines the scale factor on X axis
     * @param y defines the scale factor on Y axis
     * @param z defines the scale factor on Z axis
     * @returns the new matrix
     */
    static Scaling(x: number, y: number, z: number): Matrix;
    /**
     * Creates a scaling matrix and stores it in a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#108
     * @param x defines the scale factor on X axis
     * @param y defines the scale factor on Y axis
     * @param z defines the scale factor on Z axis
     * @param result defines the target matrix
     * @returns result input
     */
    static ScalingToRef<T extends Matrix>(x: number, y: number, z: number, result: T): T;
    /**
     * Creates a translation matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#109
     * @param x defines the translation on X axis
     * @param y defines the translation on Y axis
     * @param z defines the translationon Z axis
     * @returns the new matrix
     */
    static Translation(x: number, y: number, z: number): Matrix;
    /**
     * Creates a translation matrix and stores it in a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#110
     * @param x defines the translation on X axis
     * @param y defines the translation on Y axis
     * @param z defines the translationon Z axis
     * @param result defines the target matrix
     * @returns result input
     */
    static TranslationToRef<T extends Matrix>(x: number, y: number, z: number, result: T): T;
    /**
     * Returns a new Matrix whose values are the interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue".
     * Example Playground - https://playground.babylonjs.com/#AV9X17#55
     * @param startValue defines the start value
     * @param endValue defines the end value
     * @param gradient defines the gradient factor
     * @returns the new matrix
     */
    static Lerp<T extends Matrix>(startValue: DeepImmutable<T>, endValue: DeepImmutable<Matrix>, gradient: number): T;
    /**
     * Set the given matrix "result" as the interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue".
     * Example Playground - https://playground.babylonjs.com/#AV9X17#54
     * @param startValue defines the start value
     * @param endValue defines the end value
     * @param gradient defines the gradient factor
     * @param result defines the Matrix object where to store data
     * @returns result input
     */
    static LerpToRef<T extends Matrix>(startValue: DeepImmutable<Matrix>, endValue: DeepImmutable<Matrix>, gradient: number, result: T): T;
    /**
     * Builds a new matrix whose values are computed by:
     * * decomposing the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices
     * * interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end
     * * recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices
     * Example Playground - https://playground.babylonjs.com/#AV9X17#22
     * Example Playground - https://playground.babylonjs.com/#AV9X17#51
     * @param startValue defines the first matrix
     * @param endValue defines the second matrix
     * @param gradient defines the gradient between the two matrices
     * @returns the new matrix
     */
    static DecomposeLerp<T extends Matrix>(startValue: DeepImmutable<T>, endValue: DeepImmutable<Matrix>, gradient: number): T;
    /**
     * Update a matrix to values which are computed by:
     * * decomposing the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices
     * * interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end
     * * recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices
     * Example Playground - https://playground.babylonjs.com/#AV9X17#23
     * Example Playground - https://playground.babylonjs.com/#AV9X17#53
     * @param startValue defines the first matrix
     * @param endValue defines the second matrix
     * @param gradient defines the gradient between the two matrices
     * @param result defines the target matrix
     * @returns result input
     */
    static DecomposeLerpToRef<T extends Matrix>(startValue: DeepImmutable<Matrix>, endValue: DeepImmutable<Matrix>, gradient: number, result: T): T;
    /**
     * Creates a new matrix that transforms vertices from world space to camera space. It takes three vectors as arguments that together describe the position and orientation of the camera.
     * This function generates a matrix suitable for a left handed coordinate system
     * Example Playground - https://playground.babylonjs.com/#AV9X17#58
     * Example Playground - https://playground.babylonjs.com/#AV9X17#59
     * @param eye defines the final position of the entity
     * @param target defines where the entity should look at
     * @param up defines the up vector for the entity
     * @returns the new matrix
     */
    static LookAtLH(eye: DeepImmutable<Vector3>, target: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>): Matrix;
    /**
     * Sets the given "result" Matrix to a matrix that transforms vertices from world space to camera space. It takes three vectors as arguments that together describe the position and orientation of the camera.
     * This function generates a matrix suitable for a left handed coordinate system
     * Example Playground - https://playground.babylonjs.com/#AV9X17#60
     * Example Playground - https://playground.babylonjs.com/#AV9X17#61
     * @param eye defines the final position of the entity
     * @param target defines where the entity should look at
     * @param up defines the up vector for the entity
     * @param result defines the target matrix
     * @returns result input
     */
    static LookAtLHToRef(eye: DeepImmutable<Vector3>, target: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>, result: Matrix): Matrix;
    /**
     * Creates a new matrix that transforms vertices from world space to camera space. It takes three vectors as arguments that together describe the position and orientation of the camera.
     * This function generates a matrix suitable for a right handed coordinate system
     * Example Playground - https://playground.babylonjs.com/#AV9X17#62
     * Example Playground - https://playground.babylonjs.com/#AV9X17#63
     * @param eye defines the final position of the entity
     * @param target defines where the entity should look at
     * @param up defines the up vector for the entity
     * @returns the new matrix
     */
    static LookAtRH(eye: DeepImmutable<Vector3>, target: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>): Matrix;
    /**
     * Sets the given "result" Matrix to a matrix that transforms vertices from world space to camera space. It takes three vectors as arguments that together describe the position and orientation of the camera.
     * This function generates a matrix suitable for a right handed coordinate system
     * Example Playground - https://playground.babylonjs.com/#AV9X17#64
     * Example Playground - https://playground.babylonjs.com/#AV9X17#65
     * @param eye defines the final position of the entity
     * @param target defines where the entity should look at
     * @param up defines the up vector for the entity
     * @param result defines the target matrix
     * @returns result input
     */
    static LookAtRHToRef<T extends Matrix>(eye: DeepImmutable<Vector3>, target: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>, result: T): T;
    /**
     * Creates a new matrix that transforms vertices from world space to camera space. It takes two vectors as arguments that together describe the orientation of the camera. The position is assumed to be at the origin (0,0,0)
     * This function generates a matrix suitable for a left handed coordinate system
     * Example Playground - https://playground.babylonjs.com/#AV9X17#66
     * @param forward defines the forward direction - Must be normalized and orthogonal to up.
     * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
     * @returns the new matrix
     */
    static LookDirectionLH(forward: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>): Matrix;
    /**
     * Sets the given "result" Matrix to a matrix that transforms vertices from world space to camera space. It takes two vectors as arguments that together describe the orientation of the camera. The position is assumed to be at the origin (0,0,0)
     * This function generates a matrix suitable for a left handed coordinate system
     * Example Playground - https://playground.babylonjs.com/#AV9X17#67
     * @param forward defines the forward direction - Must be normalized and orthogonal to up.
     * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
     * @param result defines the target matrix
     * @returns result input
     */
    static LookDirectionLHToRef<T extends Matrix>(forward: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>, result: T): T;
    /**
     * Creates a new matrix that transforms vertices from world space to camera space. It takes two vectors as arguments that together describe the orientation of the camera. The position is assumed to be at the origin (0,0,0)
     * This function generates a matrix suitable for a right handed coordinate system
     * Example Playground - https://playground.babylonjs.com/#AV9X17#68
     * @param forward defines the forward direction - Must be normalized and orthogonal to up.
     * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
     * @returns the new matrix
     */
    static LookDirectionRH(forward: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>): Matrix;
    /**
     * Sets the given "result" Matrix to a matrix that transforms vertices from world space to camera space. It takes two vectors as arguments that together describe the orientation of the camera. The position is assumed to be at the origin (0,0,0)
     * This function generates a matrix suitable for a right handed coordinate system
     * Example Playground - https://playground.babylonjs.com/#AV9X17#69
     * @param forward defines the forward direction - Must be normalized and orthogonal to up.
     * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
     * @param result defines the target matrix
     * @returns result input
     */
    static LookDirectionRHToRef<T extends Matrix>(forward: DeepImmutable<Vector3>, up: DeepImmutable<Vector3>, result: T): T;
    /**
     * Create a left-handed orthographic projection matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#70
     * @param width defines the viewport width
     * @param height defines the viewport height
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @returns a new matrix as a left-handed orthographic projection matrix
     */
    static OrthoLH(width: number, height: number, znear: number, zfar: number, halfZRange?: boolean): Matrix;
    /**
     * Store a left-handed orthographic projection to a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#71
     * @param width defines the viewport width
     * @param height defines the viewport height
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param result defines the target matrix
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @returns result input
     */
    static OrthoLHToRef<T extends Matrix>(width: number, height: number, znear: number, zfar: number, result: T, halfZRange?: boolean): T;
    /**
     * Create a left-handed orthographic projection matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#72
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @returns a new matrix as a left-handed orthographic projection matrix
     */
    static OrthoOffCenterLH(left: number, right: number, bottom: number, top: number, znear: number, zfar: number, halfZRange?: boolean): Matrix;
    /**
     * Stores a left-handed orthographic projection into a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#73
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param result defines the target matrix
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @returns result input
     */
    static OrthoOffCenterLHToRef<T extends Matrix>(left: number, right: number, bottom: number, top: number, znear: number, zfar: number, result: T, halfZRange?: boolean): T;
    /**
     * Stores a left-handed oblique projection into a given matrix
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param length Length of the shear
     * @param angle Angle (along X/Y Plane) to apply shear
     * @param distance Distance from shear point
     * @param result defines the target matrix
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @returns result input
     */
    static ObliqueOffCenterLHToRef<T extends Matrix>(left: number, right: number, bottom: number, top: number, znear: number, zfar: number, length: number, angle: number, distance: number, result: T, halfZRange?: boolean): T;
    /**
     * Creates a right-handed orthographic projection matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#76
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @returns a new matrix as a right-handed orthographic projection matrix
     */
    static OrthoOffCenterRH(left: number, right: number, bottom: number, top: number, znear: number, zfar: number, halfZRange?: boolean): Matrix;
    /**
     * Stores a right-handed orthographic projection into a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#77
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param result defines the target matrix
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @returns result input
     */
    static OrthoOffCenterRHToRef<T extends Matrix>(left: number, right: number, bottom: number, top: number, znear: number, zfar: number, result: T, halfZRange?: boolean): T;
    /**
     * Stores a right-handed oblique projection into a given matrix
     * @param left defines the viewport left coordinate
     * @param right defines the viewport right coordinate
     * @param bottom defines the viewport bottom coordinate
     * @param top defines the viewport top coordinate
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param length Length of the shear
     * @param angle Angle (along X/Y Plane) to apply shear
     * @param distance Distance from shear point
     * @param result defines the target matrix
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @returns result input
     */
    static ObliqueOffCenterRHToRef<T extends Matrix>(left: number, right: number, bottom: number, top: number, znear: number, zfar: number, length: number, angle: number, distance: number, result: T, halfZRange?: boolean): T;
    /**
     * Creates a left-handed perspective projection matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#85
     * @param width defines the viewport width
     * @param height defines the viewport height
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
     * @returns a new matrix as a left-handed perspective projection matrix
     */
    static PerspectiveLH(width: number, height: number, znear: number, zfar: number, halfZRange?: boolean, projectionPlaneTilt?: number): Matrix;
    /**
     * Creates a left-handed perspective projection matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#78
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane. If 0, assume we are in "infinite zfar" mode
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
     * @param reverseDepthBufferMode true to indicate that we are in a reverse depth buffer mode (meaning znear and zfar have been inverted when calling the function)
     * @returns a new matrix as a left-handed perspective projection matrix
     */
    static PerspectiveFovLH(fov: number, aspect: number, znear: number, zfar: number, halfZRange?: boolean, projectionPlaneTilt?: number, reverseDepthBufferMode?: boolean): Matrix;
    /**
     * Stores a left-handed perspective projection into a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#81
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane. If 0, assume we are in "infinite zfar" mode
     * @param result defines the target matrix
     * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
     * @param reverseDepthBufferMode true to indicate that we are in a reverse depth buffer mode (meaning znear and zfar have been inverted when calling the function)
     * @returns result input
     */
    static PerspectiveFovLHToRef<T extends Matrix>(fov: number, aspect: number, znear: number, zfar: number, result: T, isVerticalFovFixed?: boolean, halfZRange?: boolean, projectionPlaneTilt?: number, reverseDepthBufferMode?: boolean): T;
    /**
     * Stores a left-handed perspective projection into a given matrix with depth reversed
     * Example Playground - https://playground.babylonjs.com/#AV9X17#89
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar not used as infinity is used as far clip
     * @param result defines the target matrix
     * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
     * @returns result input
     */
    static PerspectiveFovReverseLHToRef<T extends Matrix>(fov: number, aspect: number, znear: number, zfar: number, result: T, isVerticalFovFixed?: boolean, halfZRange?: boolean, projectionPlaneTilt?: number): T;
    /**
     * Creates a right-handed perspective projection matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#83
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane. If 0, assume we are in "infinite zfar" mode
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
     * @param reverseDepthBufferMode true to indicate that we are in a reverse depth buffer mode (meaning znear and zfar have been inverted when calling the function)
     * @returns a new matrix as a right-handed perspective projection matrix
     */
    static PerspectiveFovRH(fov: number, aspect: number, znear: number, zfar: number, halfZRange?: boolean, projectionPlaneTilt?: number, reverseDepthBufferMode?: boolean): Matrix;
    /**
     * Stores a right-handed perspective projection into a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#84
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar defines the far clip plane. If 0, assume we are in "infinite zfar" mode
     * @param result defines the target matrix
     * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
     * @param reverseDepthBufferMode true to indicate that we are in a reverse depth buffer mode (meaning znear and zfar have been inverted when calling the function)
     * @returns result input
     */
    static PerspectiveFovRHToRef<T extends Matrix>(fov: number, aspect: number, znear: number, zfar: number, result: T, isVerticalFovFixed?: boolean, halfZRange?: boolean, projectionPlaneTilt?: number, reverseDepthBufferMode?: boolean): T;
    /**
     * Stores a right-handed perspective projection into a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#90
     * @param fov defines the horizontal field of view
     * @param aspect defines the aspect ratio
     * @param znear defines the near clip plane
     * @param zfar not used as infinity is used as far clip
     * @param result defines the target matrix
     * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
     * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
     * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
     * @returns result input
     */
    static PerspectiveFovReverseRHToRef<T extends Matrix>(fov: number, aspect: number, znear: number, zfar: number, result: T, isVerticalFovFixed?: boolean, halfZRange?: boolean, projectionPlaneTilt?: number): T;
    /**
     * Computes a complete transformation matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#113
     * @param viewport defines the viewport to use
     * @param world defines the world matrix
     * @param view defines the view matrix
     * @param projection defines the projection matrix
     * @param zmin defines the near clip plane
     * @param zmax defines the far clip plane
     * @returns the transformation matrix
     */
    static GetFinalMatrix<T extends Matrix>(viewport: DeepImmutable<Viewport>, world: DeepImmutable<T>, view: DeepImmutable<Matrix>, projection: DeepImmutable<Matrix>, zmin: number, zmax: number): T;
    /**
     * Extracts a 2x2 matrix from a given matrix and store the result in a Float32Array
     * @param matrix defines the matrix to use
     * @returns a new Float32Array array with 4 elements : the 2x2 matrix extracted from the given matrix
     */
    static GetAsMatrix2x2(matrix: DeepImmutable<Matrix>): Float32Array | Array<number>;
    /**
     * Extracts a 3x3 matrix from a given matrix and store the result in a Float32Array
     * @param matrix defines the matrix to use
     * @returns a new Float32Array array with 9 elements : the 3x3 matrix extracted from the given matrix
     */
    static GetAsMatrix3x3(matrix: DeepImmutable<Matrix>): Float32Array | Array<number>;
    /**
     * Compute the transpose of a given matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#111
     * @param matrix defines the matrix to transpose
     * @returns the new matrix
     */
    static Transpose<T extends Matrix>(matrix: DeepImmutable<T>): T;
    /**
     * Compute the transpose of a matrix and store it in a target matrix
     * Example Playground - https://playground.babylonjs.com/#AV9X17#112
     * @param matrix defines the matrix to transpose
     * @param result defines the target matrix
     * @returns result input
     */
    static TransposeToRef<T extends Matrix>(matrix: DeepImmutable<Matrix>, result: T): T;
    /**
     * Computes a reflection matrix from a plane
     * Example Playground - https://playground.babylonjs.com/#AV9X17#87
     * @param plane defines the reflection plane
     * @returns a new matrix
     */
    static Reflection(plane: DeepImmutable<IPlaneLike>): Matrix;
    /**
     * Computes a reflection matrix from a plane
     * Example Playground - https://playground.babylonjs.com/#AV9X17#88
     * @param plane defines the reflection plane
     * @param result defines the target matrix
     * @returns result input
     */
    static ReflectionToRef<T extends Matrix>(plane: DeepImmutable<IPlaneLike>, result: T): T;
    /**
     * Sets the given matrix as a rotation matrix composed from the 3 left handed axes
     * @param xaxis defines the value of the 1st axis
     * @param yaxis defines the value of the 2nd axis
     * @param zaxis defines the value of the 3rd axis
     * @param result defines the target matrix
     * @returns result input
     */
    static FromXYZAxesToRef<T extends Matrix>(xaxis: DeepImmutable<Vector3>, yaxis: DeepImmutable<Vector3>, zaxis: DeepImmutable<Vector3>, result: T): T;
    /**
     * Creates a rotation matrix from a quaternion and stores it in a target matrix
     * @param quat defines the quaternion to use
     * @param result defines the target matrix
     * @returns result input
     */
    static FromQuaternionToRef<T extends Matrix>(quat: DeepImmutable<Quaternion>, result: T): T;
}
/**
 * @internal
 */
export declare class TmpVectors {
    /** 3 temp Vector2 at once should be enough */
    static Vector2: [Vector2, Vector2, Vector2];
    /** 13 temp Vector3 at once should be enough */
    static Vector3: [Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3];
    /** 3 temp Vector4 at once should be enough */
    static Vector4: [Vector4, Vector4, Vector4];
    /** 2 temp Quaternion at once should be enough */
    static Quaternion: [Quaternion, Quaternion];
    /** 8 temp Matrices at once should be enough */
    static Matrix: [Matrix, Matrix, Matrix, Matrix, Matrix, Matrix, Matrix, Matrix];
}
