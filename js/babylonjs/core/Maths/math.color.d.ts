import type { DeepImmutable, FloatArray, Tuple } from "../types";
import type { Tensor } from "./tensor";
import type { IColor3Like, IColor4Like } from "./math.like";
/**
 * Class used to hold a RGB color
 */
export declare class Color3 implements Tensor<Tuple<number, 3>>, IColor3Like {
    /**
     * Defines the red component (between 0 and 1, default is 0)
     */
    r: number;
    /**
     * Defines the green component (between 0 and 1, default is 0)
     */
    g: number;
    /**
     * Defines the blue component (between 0 and 1, default is 0)
     */
    b: number;
    /**
     * @see Tensor.dimension
     */
    readonly dimension: [3];
    /**
     * @see Tensor.rank
     */
    readonly rank: 1;
    /**
     * Creates a new Color3 object from red, green, blue values, all between 0 and 1
     * @param r defines the red component (between 0 and 1, default is 0)
     * @param g defines the green component (between 0 and 1, default is 0)
     * @param b defines the blue component (between 0 and 1, default is 0)
     */
    constructor(
    /**
     * Defines the red component (between 0 and 1, default is 0)
     */
    r?: number, 
    /**
     * Defines the green component (between 0 and 1, default is 0)
     */
    g?: number, 
    /**
     * Defines the blue component (between 0 and 1, default is 0)
     */
    b?: number);
    /**
     * Creates a string with the Color3 current values
     * @returns the string representation of the Color3 object
     */
    toString(): string;
    /**
     * Returns the string "Color3"
     * @returns "Color3"
     */
    getClassName(): string;
    /**
     * Compute the Color3 hash code
     * @returns an unique number that can be used to hash Color3 objects
     */
    getHashCode(): number;
    /**
     * Stores in the given array from the given starting index the red, green, blue values as successive elements
     * @param array defines the array where to store the r,g,b components
     * @param index defines an optional index in the target array to define where to start storing values
     * @returns the current Color3 object
     */
    toArray(array: FloatArray, index?: number): this;
    /**
     * Update the current color with values stored in an array from the starting index of the given array
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns the current Color3 object
     */
    fromArray(array: DeepImmutable<ArrayLike<number>>, offset?: number): this;
    /**
     * Returns a new Color4 object from the current Color3 and the given alpha
     * @param alpha defines the alpha component on the new Color4 object (default is 1)
     * @returns a new Color4 object
     */
    toColor4(alpha?: number): Color4;
    /**
     * Returns a new array populated with 3 numeric elements : red, green and blue values
     * @returns the new array
     */
    asArray(): Tuple<number, 3>;
    /**
     * Returns the luminance value
     * @returns a float value
     */
    toLuminance(): number;
    /**
     * Multiply each Color3 rgb values by the given Color3 rgb values in a new Color3 object
     * @param otherColor defines the second operand
     * @returns the new Color3 object
     */
    multiply(otherColor: DeepImmutable<this>): this;
    /**
     * Multiply the rgb values of the Color3 and the given Color3 and stores the result in the object "result"
     * @param otherColor defines the second operand
     * @param result defines the Color3 object where to store the result
     * @returns the result Color3
     */
    multiplyToRef<T extends this>(otherColor: DeepImmutable<this>, result: T): T;
    /**
     * Multiplies the current Color3 coordinates by the given ones
     * @param otherColor defines the second operand
     * @returns the current updated Color3
     */
    multiplyInPlace(otherColor: DeepImmutable<Color3>): this;
    /**
     * Returns a new Color3 set with the result of the multiplication of the current Color3 coordinates by the given floats
     * @param r defines the r coordinate of the operand
     * @param g defines the g coordinate of the operand
     * @param b defines the b coordinate of the operand
     * @returns the new Color3
     */
    multiplyByFloats(r: number, g: number, b: number): this;
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
     * Updates the current Color3 with the minimal coordinate values between its and the given color ones
     * @param other defines the second operand
     * @returns the current updated Color3
     */
    minimizeInPlace(other: DeepImmutable<this>): this;
    /**
     * Updates the current Color3 with the maximal coordinate values between its and the given color ones.
     * @param other defines the second operand
     * @returns the current updated Color3
     */
    maximizeInPlace(other: DeepImmutable<this>): this;
    /**
     * Updates the current Color3 with the minimal coordinate values between its and the given coordinates
     * @param r defines the r coordinate of the operand
     * @param g defines the g coordinate of the operand
     * @param b defines the b coordinate of the operand
     * @returns the current updated Color3
     */
    minimizeInPlaceFromFloats(r: number, g: number, b: number): this;
    /**
     * Updates the current Color3 with the maximal coordinate values between its and the given coordinates.
     * @param r defines the r coordinate of the operand
     * @param g defines the g coordinate of the operand
     * @param b defines the b coordinate of the operand
     * @returns the current updated Color3
     */
    maximizeInPlaceFromFloats(r: number, g: number, b: number): this;
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
     * Determines equality between Color3 objects
     * @param otherColor defines the second operand
     * @returns true if the rgb values are equal to the given ones
     */
    equals(otherColor: DeepImmutable<this>): boolean;
    /**
     * Alias for equalsToFloats
     * @param r red color component
     * @param g green color component
     * @param b blue color component
     * @returns boolean
     */
    equalsFloats(r: number, g: number, b: number): boolean;
    /**
     * Determines equality between the current Color3 object and a set of r,b,g values
     * @param r defines the red component to check
     * @param g defines the green component to check
     * @param b defines the blue component to check
     * @returns true if the rgb values are equal to the given ones
     */
    equalsToFloats(r: number, g: number, b: number): boolean;
    /**
     * Returns true if the current Color3 and the given color coordinates are distant less than epsilon
     * @param otherColor defines the second operand
     * @param epsilon defines the minimal distance to define values as equals
     * @returns true if both colors are distant less than epsilon
     */
    equalsWithEpsilon(otherColor: DeepImmutable<this>, epsilon?: number): boolean;
    /**
     * @internal
     * Do not use
     */
    negate(): this;
    /**
     * @internal
     * Do not use
     */
    negateInPlace(): this;
    /**
     * @internal
     * Do not use
     */
    negateToRef<T extends this>(_result: T): T;
    /**
     * Creates a new Color3 with the current Color3 values multiplied by scale
     * @param scale defines the scaling factor to apply
     * @returns a new Color3 object
     */
    scale(scale: number): this;
    /**
     * Multiplies the Color3 values by the float "scale"
     * @param scale defines the scaling factor to apply
     * @returns the current updated Color3
     */
    scaleInPlace(scale: number): this;
    /**
     * Multiplies the rgb values by scale and stores the result into "result"
     * @param scale defines the scaling factor
     * @param result defines the Color3 object where to store the result
     * @returns the result Color3
     */
    scaleToRef<T extends this>(scale: number, result: T): T;
    /**
     * Scale the current Color3 values by a factor and add the result to a given Color3
     * @param scale defines the scale factor
     * @param result defines color to store the result into
     * @returns the result Color3
     */
    scaleAndAddToRef<T extends this>(scale: number, result: T): T;
    /**
     * Clamps the rgb values by the min and max values and stores the result into "result"
     * @param min defines minimum clamping value (default is 0)
     * @param max defines maximum clamping value (default is 1)
     * @param result defines color to store the result into
     * @returns the result Color3
     */
    clampToRef<T extends this>(min: number | undefined, max: number | undefined, result: T): T;
    /**
     * Creates a new Color3 set with the added values of the current Color3 and of the given one
     * @param otherColor defines the second operand
     * @returns the new Color3
     */
    add(otherColor: DeepImmutable<this>): this;
    /**
     * Adds the given color to the current Color3
     * @param otherColor defines the second operand
     * @returns the current updated Color3
     */
    addInPlace(otherColor: DeepImmutable<this>): this;
    /**
     * Adds the given coordinates to the current Color3
     * @param r defines the r coordinate of the operand
     * @param g defines the g coordinate of the operand
     * @param b defines the b coordinate of the operand
     * @returns the current updated Color3
     */
    addInPlaceFromFloats(r: number, g: number, b: number): this;
    /**
     * Stores the result of the addition of the current Color3 and given one rgb values into "result"
     * @param otherColor defines the second operand
     * @param result defines Color3 object to store the result into
     * @returns the unmodified current Color3
     */
    addToRef<T extends this>(otherColor: DeepImmutable<this>, result: T): T;
    /**
     * Returns a new Color3 set with the subtracted values of the given one from the current Color3
     * @param otherColor defines the second operand
     * @returns the new Color3
     */
    subtract(otherColor: DeepImmutable<this>): this;
    /**
     * Stores the result of the subtraction of given one from the current Color3 rgb values into "result"
     * @param otherColor defines the second operand
     * @param result defines Color3 object to store the result into
     * @returns the unmodified current Color3
     */
    subtractToRef<T extends this>(otherColor: DeepImmutable<this>, result: T): T;
    /**
     * Subtract the given color from the current Color3
     * @param otherColor defines the second operand
     * @returns the current updated Color3
     */
    subtractInPlace(otherColor: DeepImmutable<this>): this;
    /**
     * Returns a new Color3 set with the subtraction of the given floats from the current Color3 coordinates
     * @param r defines the r coordinate of the operand
     * @param g defines the g coordinate of the operand
     * @param b defines the b coordinate of the operand
     * @returns the resulting Color3
     */
    subtractFromFloats(r: number, g: number, b: number): this;
    /**
     * Subtracts the given floats from the current Color3 coordinates and set the given color "result" with this result
     * @param r defines the r coordinate of the operand
     * @param g defines the g coordinate of the operand
     * @param b defines the b coordinate of the operand
     * @param result defines the Color3 object where to store the result
     * @returns the result
     */
    subtractFromFloatsToRef<T extends Color3>(r: number, g: number, b: number, result: T): T;
    /**
     * Copy the current object
     * @returns a new Color3 copied the current one
     */
    clone(): this;
    /**
     * Copies the rgb values from the source in the current Color3
     * @param source defines the source Color3 object
     * @returns the updated Color3 object
     */
    copyFrom(source: DeepImmutable<this>): this;
    /**
     * Updates the Color3 rgb values from the given floats
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @returns the current Color3 object
     */
    copyFromFloats(r: number, g: number, b: number): this;
    /**
     * Updates the Color3 rgb values from the given floats
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @returns the current Color3 object
     */
    set(r: number, g: number, b: number): this;
    /**
     * Copies the given float to the current Color3 coordinates
     * @param v defines the r, g and b coordinates of the operand
     * @returns the current updated Color3
     */
    setAll(v: number): this;
    /**
     * Compute the Color3 hexadecimal code as a string
     * @returns a string containing the hexadecimal representation of the Color3 object
     */
    toHexString(): string;
    /**
     * Converts current color in rgb space to HSV values
     * @returns a new color3 representing the HSV values
     */
    toHSV(): this;
    /**
     * Converts current color in rgb space to HSV values
     * @param result defines the Color3 where to store the HSV values
     */
    toHSVToRef(result: this): void;
    /**
     * Computes a new Color3 converted from the current one to linear space
     * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
     * @returns a new Color3 object
     */
    toLinearSpace(exact?: boolean): this;
    /**
     * Converts the Color3 values to linear space and stores the result in "convertedColor"
     * @param convertedColor defines the Color3 object where to store the linear space version
     * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
     * @returns the unmodified Color3
     */
    toLinearSpaceToRef(convertedColor: this, exact?: boolean): this;
    /**
     * Computes a new Color3 converted from the current one to gamma space
     * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
     * @returns a new Color3 object
     */
    toGammaSpace(exact?: boolean): this;
    /**
     * Converts the Color3 values to gamma space and stores the result in "convertedColor"
     * @param convertedColor defines the Color3 object where to store the gamma space version
     * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
     * @returns the unmodified Color3
     */
    toGammaSpaceToRef(convertedColor: this, exact?: boolean): this;
    private static _BlackReadOnly;
    /**
     * Converts Hue, saturation and value to a Color3 (RGB)
     * @param hue defines the hue (value between 0 and 360)
     * @param saturation defines the saturation (value between 0 and 1)
     * @param value defines the value (value between 0 and 1)
     * @param result defines the Color3 where to store the RGB values
     */
    static HSVtoRGBToRef(hue: number, saturation: number, value: number, result: Color3): void;
    /**
     * Converts Hue, saturation and value to a new Color3 (RGB)
     * @param hue defines the hue (value between 0 and 360)
     * @param saturation defines the saturation (value between 0 and 1)
     * @param value defines the value (value between 0 and 1)
     * @returns a new Color3 object
     */
    static FromHSV(hue: number, saturation: number, value: number): Color3;
    /**
     * Creates a new Color3 from the string containing valid hexadecimal values
     * @param hex defines a string containing valid hexadecimal values
     * @returns a new Color3 object
     */
    static FromHexString(hex: string): Color3;
    /**
     * Creates a new Color3 from the starting index of the given array
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns a new Color3 object
     */
    static FromArray(array: DeepImmutable<ArrayLike<number>>, offset?: number): Color3;
    /**
     * Creates a new Color3 from the starting index element of the given array
     * @param array defines the source array to read from
     * @param offset defines the offset in the source array
     * @param result defines the target Color3 object
     */
    static FromArrayToRef(array: DeepImmutable<ArrayLike<number>>, offset: number | undefined, result: Color3): void;
    /**
     * Creates a new Color3 from integer values (\< 256)
     * @param r defines the red component to read from (value between 0 and 255)
     * @param g defines the green component to read from (value between 0 and 255)
     * @param b defines the blue component to read from (value between 0 and 255)
     * @returns a new Color3 object
     */
    static FromInts(r: number, g: number, b: number): Color3;
    /**
     * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
     * @param start defines the start Color3 value
     * @param end defines the end Color3 value
     * @param amount defines the gradient value between start and end
     * @returns a new Color3 object
     */
    static Lerp(start: DeepImmutable<Color3>, end: DeepImmutable<Color3>, amount: number): Color3;
    /**
     * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @param result defines the Color3 object where to store the result
     */
    static LerpToRef(left: DeepImmutable<Color3>, right: DeepImmutable<Color3>, amount: number, result: Color3): void;
    /**
     * Returns a new Color3 located for "amount" (float) on the Hermite interpolation spline defined by the vectors "value1", "tangent1", "value2", "tangent2"
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent Color3
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent Color3
     * @param amount defines the amount on the interpolation spline (between 0 and 1)
     * @returns the new Color3
     */
    static Hermite(value1: DeepImmutable<Color3>, tangent1: DeepImmutable<Color3>, value2: DeepImmutable<Color3>, tangent2: DeepImmutable<Color3>, amount: number): Color3;
    /**
     * Returns a new Color3 which is the 1st derivative of the Hermite spline defined by the colors "value1", "value2", "tangent1", "tangent2".
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @returns 1st derivative
     */
    static Hermite1stDerivative(value1: DeepImmutable<Color3>, tangent1: DeepImmutable<Color3>, value2: DeepImmutable<Color3>, tangent2: DeepImmutable<Color3>, time: number): Color3;
    /**
     * Returns a new Color3 which is the 1st derivative of the Hermite spline defined by the colors "value1", "value2", "tangent1", "tangent2".
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @param result define where to store the derivative
     */
    static Hermite1stDerivativeToRef(value1: DeepImmutable<Color3>, tangent1: DeepImmutable<Color3>, value2: DeepImmutable<Color3>, tangent2: DeepImmutable<Color3>, time: number, result: Color3): void;
    /**
     * Returns a Color3 value containing a red color
     * @returns a new Color3 object
     */
    static Red(): Color3;
    /**
     * Returns a Color3 value containing a green color
     * @returns a new Color3 object
     */
    static Green(): Color3;
    /**
     * Returns a Color3 value containing a blue color
     * @returns a new Color3 object
     */
    static Blue(): Color3;
    /**
     * Returns a Color3 value containing a black color
     * @returns a new Color3 object
     */
    static Black(): Color3;
    /**
     * Gets a Color3 value containing a black color that must not be updated
     */
    static get BlackReadOnly(): DeepImmutable<Color3>;
    /**
     * Returns a Color3 value containing a white color
     * @returns a new Color3 object
     */
    static White(): Color3;
    /**
     * Returns a Color3 value containing a purple color
     * @returns a new Color3 object
     */
    static Purple(): Color3;
    /**
     * Returns a Color3 value containing a magenta color
     * @returns a new Color3 object
     */
    static Magenta(): Color3;
    /**
     * Returns a Color3 value containing a yellow color
     * @returns a new Color3 object
     */
    static Yellow(): Color3;
    /**
     * Returns a Color3 value containing a gray color
     * @returns a new Color3 object
     */
    static Gray(): Color3;
    /**
     * Returns a Color3 value containing a teal color
     * @returns a new Color3 object
     */
    static Teal(): Color3;
    /**
     * Returns a Color3 value containing a random color
     * @returns a new Color3 object
     */
    static Random(): Color3;
}
/**
 * Class used to hold a RBGA color
 */
export declare class Color4 implements Tensor<Tuple<number, 4>>, IColor4Like {
    /**
     * Defines the red component (between 0 and 1, default is 0)
     */
    r: number;
    /**
     * Defines the green component (between 0 and 1, default is 0)
     */
    g: number;
    /**
     * Defines the blue component (between 0 and 1, default is 0)
     */
    b: number;
    /**
     * Defines the alpha component (between 0 and 1, default is 1)
     */
    a: number;
    /**
     * @see Tensor.dimension
     */
    readonly dimension: [4];
    /**
     * @see Tensor.rank
     */
    readonly rank: 1;
    /**
     * Creates a new Color4 object from red, green, blue values, all between 0 and 1
     * @param r defines the red component (between 0 and 1, default is 0)
     * @param g defines the green component (between 0 and 1, default is 0)
     * @param b defines the blue component (between 0 and 1, default is 0)
     * @param a defines the alpha component (between 0 and 1, default is 1)
     */
    constructor(
    /**
     * Defines the red component (between 0 and 1, default is 0)
     */
    r?: number, 
    /**
     * Defines the green component (between 0 and 1, default is 0)
     */
    g?: number, 
    /**
     * Defines the blue component (between 0 and 1, default is 0)
     */
    b?: number, 
    /**
     * Defines the alpha component (between 0 and 1, default is 1)
     */
    a?: number);
    /**
     * Creates a new array populated with 4 numeric elements : red, green, blue, alpha values
     * @returns the new array
     */
    asArray(): Tuple<number, 4>;
    /**
     * Stores from the starting index in the given array the Color4 successive values
     * @param array defines the array where to store the r,g,b components
     * @param index defines an optional index in the target array to define where to start storing values
     * @returns the current Color4 object
     */
    toArray(array: FloatArray, index?: number): this;
    /**
     * Update the current color with values stored in an array from the starting index of the given array
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns the current Color4 object
     */
    fromArray(array: DeepImmutable<ArrayLike<number>>, offset?: number): this;
    /**
     * Determines equality between Color4 objects
     * @param otherColor defines the second operand
     * @returns true if the rgba values are equal to the given ones
     */
    equals(otherColor: DeepImmutable<this>): boolean;
    /**
     * Creates a new Color4 set with the added values of the current Color4 and of the given one
     * @param otherColor defines the second operand
     * @returns a new Color4 object
     */
    add(otherColor: DeepImmutable<this>): this;
    /**
     * Updates the given color "result" with the result of the addition of the current Color4 and the given one.
     * @param otherColor the color to add
     * @param result the color to store the result
     * @returns result input
     */
    addToRef<T extends Color4>(otherColor: DeepImmutable<this>, result: T): T;
    /**
     * Adds in place the given Color4 values to the current Color4 object
     * @param otherColor defines the second operand
     * @returns the current updated Color4 object
     */
    addInPlace(otherColor: DeepImmutable<this>): this;
    /**
     * Adds the given coordinates to the current Color4
     * @param r defines the r coordinate of the operand
     * @param g defines the g coordinate of the operand
     * @param b defines the b coordinate of the operand
     * @param a defines the a coordinate of the operand
     * @returns the current updated Color4
     */
    addInPlaceFromFloats(r: number, g: number, b: number, a: number): this;
    /**
     * Creates a new Color4 set with the subtracted values of the given one from the current Color4
     * @param otherColor defines the second operand
     * @returns a new Color4 object
     */
    subtract(otherColor: DeepImmutable<this>): this;
    /**
     * Subtracts the given ones from the current Color4 values and stores the results in "result"
     * @param otherColor defines the second operand
     * @param result defines the Color4 object where to store the result
     * @returns the result Color4 object
     */
    subtractToRef<T extends this>(otherColor: DeepImmutable<this>, result: T): T;
    /**
     * Subtract in place the given color from the current Color4.
     * @param otherColor the color to subtract
     * @returns the updated Color4.
     */
    subtractInPlace(otherColor: DeepImmutable<Color4>): this;
    /**
     * Returns a new Color4 set with the result of the subtraction of the given floats from the current Color4 coordinates.
     * @param r value to subtract
     * @param g value to subtract
     * @param b value to subtract
     * @param a value to subtract
     * @returns new color containing the result
     */
    subtractFromFloats(r: number, g: number, b: number, a: number): this;
    /**
     * Sets the given color "result" set with the result of the subtraction of the given floats from the current Color4 coordinates.
     * @param r value to subtract
     * @param g value to subtract
     * @param b value to subtract
     * @param a value to subtract
     * @param result the color to store the result in
     * @returns result input
     */
    subtractFromFloatsToRef<T extends Color4>(r: number, g: number, b: number, a: number, result: T): T;
    /**
     * Creates a new Color4 with the current Color4 values multiplied by scale
     * @param scale defines the scaling factor to apply
     * @returns a new Color4 object
     */
    scale(scale: number): this;
    /**
     * Multiplies the Color4 values by the float "scale"
     * @param scale defines the scaling factor to apply
     * @returns the current updated Color4
     */
    scaleInPlace(scale: number): this;
    /**
     * Multiplies the current Color4 values by scale and stores the result in "result"
     * @param scale defines the scaling factor to apply
     * @param result defines the Color4 object where to store the result
     * @returns the result Color4
     */
    scaleToRef<T extends this>(scale: number, result: T): T;
    /**
     * Scale the current Color4 values by a factor and add the result to a given Color4
     * @param scale defines the scale factor
     * @param result defines the Color4 object where to store the result
     * @returns the result Color4
     */
    scaleAndAddToRef<T extends this>(scale: number, result: T): T;
    /**
     * Clamps the rgb values by the min and max values and stores the result into "result"
     * @param min defines minimum clamping value (default is 0)
     * @param max defines maximum clamping value (default is 1)
     * @param result defines color to store the result into.
     * @returns the result Color4
     */
    clampToRef<T extends this>(min: number | undefined, max: number | undefined, result: T): T;
    /**
     * Multiply an Color4 value by another and return a new Color4 object
     * @param color defines the Color4 value to multiply by
     * @returns a new Color4 object
     */
    multiply(color: DeepImmutable<this>): this;
    /**
     * Multiply a Color4 value by another and push the result in a reference value
     * @param color defines the Color4 value to multiply by
     * @param result defines the Color4 to fill the result in
     * @returns the result Color4
     */
    multiplyToRef<T extends this>(color: DeepImmutable<this>, result: T): T;
    /**
     * Multiplies in place the current Color4 by the given one.
     * @param otherColor color to multiple with
     * @returns the updated Color4.
     */
    multiplyInPlace(otherColor: DeepImmutable<Color4>): this;
    /**
     * Returns a new Color4 set with the multiplication result of the given floats and the current Color4 coordinates.
     * @param r value multiply with
     * @param g value multiply with
     * @param b value multiply with
     * @param a value multiply with
     * @returns resulting new color
     */
    multiplyByFloats(r: number, g: number, b: number, a: number): this;
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
     * Updates the Color4 coordinates with the minimum values between its own and the given color ones
     * @param other defines the second operand
     * @returns the current updated Color4
     */
    minimizeInPlace(other: DeepImmutable<Color4>): this;
    /**
     * Updates the Color4 coordinates with the maximum values between its own and the given color ones
     * @param other defines the second operand
     * @returns the current updated Color4
     */
    maximizeInPlace(other: DeepImmutable<Color4>): this;
    /**
     * Updates the current Color4 with the minimal coordinate values between its and the given coordinates
     * @param r defines the r coordinate of the operand
     * @param g defines the g coordinate of the operand
     * @param b defines the b coordinate of the operand
     * @param a defines the a coordinate of the operand
     * @returns the current updated Color4
     */
    minimizeInPlaceFromFloats(r: number, g: number, b: number, a: number): this;
    /**
     * Updates the current Color4 with the maximal coordinate values between its and the given coordinates.
     * @param r defines the r coordinate of the operand
     * @param g defines the g coordinate of the operand
     * @param b defines the b coordinate of the operand
     * @param a defines the a coordinate of the operand
     * @returns the current updated Color4
     */
    maximizeInPlaceFromFloats(r: number, g: number, b: number, a: number): this;
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
     * @internal
     * Do not use
     */
    negate(): this;
    /**
     * @internal
     * Do not use
     */
    negateInPlace(): this;
    /**
     * @internal
     * Do not use
     */
    negateToRef<T extends this>(_result: T): T;
    /**
     * Boolean : True if the current Color4 coordinates are each beneath the distance "epsilon" from the given color ones.
     * @param otherColor color to compare against
     * @param epsilon (Default: very small number)
     * @returns true if they are equal
     */
    equalsWithEpsilon(otherColor: DeepImmutable<Color4>, epsilon?: number): boolean;
    /**
     * Boolean : True if the given floats are strictly equal to the current Color4 coordinates.
     * @param x x value to compare against
     * @param y y value to compare against
     * @param z z value to compare against
     * @param w w value to compare against
     * @returns true if equal
     */
    equalsToFloats(x: number, y: number, z: number, w: number): boolean;
    /**
     * Creates a string with the Color4 current values
     * @returns the string representation of the Color4 object
     */
    toString(): string;
    /**
     * Returns the string "Color4"
     * @returns "Color4"
     */
    getClassName(): string;
    /**
     * Compute the Color4 hash code
     * @returns an unique number that can be used to hash Color4 objects
     */
    getHashCode(): number;
    /**
     * Creates a new Color4 copied from the current one
     * @returns a new Color4 object
     */
    clone(): this;
    /**
     * Copies the given Color4 values into the current one
     * @param source defines the source Color4 object
     * @returns the current updated Color4 object
     */
    copyFrom(source: DeepImmutable<Color4>): this;
    /**
     * Copies the given float values into the current one
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @param a defines the alpha component to read from
     * @returns the current updated Color4 object
     */
    copyFromFloats(r: number, g: number, b: number, a: number): this;
    /**
     * Copies the given float values into the current one
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @param a defines the alpha component to read from
     * @returns the current updated Color4 object
     */
    set(r: number, g: number, b: number, a: number): this;
    /**
     * Copies the given float to the current Vector4 coordinates
     * @param v defines the r, g, b, and a coordinates of the operand
     * @returns the current updated Vector4
     */
    setAll(v: number): this;
    /**
     * Compute the Color4 hexadecimal code as a string
     * @param returnAsColor3 defines if the string should only contains RGB values (off by default)
     * @returns a string containing the hexadecimal representation of the Color4 object
     */
    toHexString(returnAsColor3?: boolean): string;
    /**
     * Computes a new Color4 converted from the current one to linear space
     * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
     * @returns a new Color4 object
     */
    toLinearSpace(exact?: boolean): Color4;
    /**
     * Converts the Color4 values to linear space and stores the result in "convertedColor"
     * @param convertedColor defines the Color4 object where to store the linear space version
     * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
     * @returns the unmodified Color4
     */
    toLinearSpaceToRef(convertedColor: Color4, exact?: boolean): Color4;
    /**
     * Computes a new Color4 converted from the current one to gamma space
     * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
     * @returns a new Color4 object
     */
    toGammaSpace(exact?: boolean): Color4;
    /**
     * Converts the Color4 values to gamma space and stores the result in "convertedColor"
     * @param convertedColor defines the Color4 object where to store the gamma space version
     * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
     * @returns the unmodified Color4
     */
    toGammaSpaceToRef(convertedColor: Color4, exact?: boolean): Color4;
    /**
     * Creates a new Color4 from the string containing valid hexadecimal values.
     *
     * A valid hex string is either in the format #RRGGBB or #RRGGBBAA.
     *
     * When a hex string without alpha is passed, the resulting Color4 has
     * its alpha value set to 1.0.
     *
     * An invalid string results in a Color with all its channels set to 0.0,
     * i.e. "transparent black".
     *
     * @param hex defines a string containing valid hexadecimal values
     * @returns a new Color4 object
     */
    static FromHexString(hex: string): Color4;
    /**
     * Creates a new Color4 object set with the linearly interpolated values of "amount" between the left Color4 object and the right Color4 object
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @returns a new Color4 object
     */
    static Lerp(left: DeepImmutable<Color4>, right: DeepImmutable<Color4>, amount: number): Color4;
    /**
     * Set the given "result" with the linearly interpolated values of "amount" between the left Color4 object and the right Color4 object
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @param result defines the Color4 object where to store data
     */
    static LerpToRef(left: DeepImmutable<Color4>, right: DeepImmutable<Color4>, amount: number, result: Color4): void;
    /**
     * Interpolate between two Color4 using Hermite interpolation
     * @param value1 defines first Color4
     * @param tangent1 defines the incoming tangent
     * @param value2 defines second Color4
     * @param tangent2 defines the outgoing tangent
     * @param amount defines the target Color4
     * @returns the new interpolated Color4
     */
    static Hermite(value1: DeepImmutable<Color4>, tangent1: DeepImmutable<Color4>, value2: DeepImmutable<Color4>, tangent2: DeepImmutable<Color4>, amount: number): Color4;
    /**
     * Returns a new Color4 which is the 1st derivative of the Hermite spline defined by the colors "value1", "value2", "tangent1", "tangent2".
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @returns 1st derivative
     */
    static Hermite1stDerivative(value1: DeepImmutable<Color4>, tangent1: DeepImmutable<Color4>, value2: DeepImmutable<Color4>, tangent2: DeepImmutable<Color4>, time: number): Color4;
    /**
     * Update a Color4 with the 1st derivative of the Hermite spline defined by the colors "value1", "value2", "tangent1", "tangent2".
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @param result define where to store the derivative
     */
    static Hermite1stDerivativeToRef(value1: DeepImmutable<Color4>, tangent1: DeepImmutable<Color4>, value2: DeepImmutable<Color4>, tangent2: DeepImmutable<Color4>, time: number, result: Color4): void;
    /**
     * Creates a new Color4 from a Color3 and an alpha value
     * @param color3 defines the source Color3 to read from
     * @param alpha defines the alpha component (1.0 by default)
     * @returns a new Color4 object
     */
    static FromColor3(color3: DeepImmutable<Color3>, alpha?: number): Color4;
    /**
     * Creates a new Color4 from the starting index element of the given array
     * @param array defines the source array to read from
     * @param offset defines the offset in the source array
     * @returns a new Color4 object
     */
    static FromArray(array: DeepImmutable<ArrayLike<number>>, offset?: number): Color4;
    /**
     * Creates a new Color4 from the starting index element of the given array
     * @param array defines the source array to read from
     * @param offset defines the offset in the source array
     * @param result defines the target Color4 object
     */
    static FromArrayToRef(array: DeepImmutable<ArrayLike<number>>, offset: number | undefined, result: Color4): void;
    /**
     * Creates a new Color3 from integer values (less than 256)
     * @param r defines the red component to read from (value between 0 and 255)
     * @param g defines the green component to read from (value between 0 and 255)
     * @param b defines the blue component to read from (value between 0 and 255)
     * @param a defines the alpha component to read from (value between 0 and 255)
     * @returns a new Color3 object
     */
    static FromInts(r: number, g: number, b: number, a: number): Color4;
    /**
     * Check the content of a given array and convert it to an array containing RGBA data
     * If the original array was already containing count * 4 values then it is returned directly
     * @param colors defines the array to check
     * @param count defines the number of RGBA data to expect
     * @returns an array containing count * 4 values (RGBA)
     */
    static CheckColors4(colors: number[], count: number): number[];
}
/**
 * @internal
 */
export declare class TmpColors {
    static Color3: Color3[];
    static Color4: Color4[];
}
