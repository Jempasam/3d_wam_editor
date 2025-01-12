import { Vector3 } from "../Maths/math.vector";
import type { AbstractMesh } from "../Meshes/abstractMesh";
import type { IFontData } from "../Meshes/Builders/textBuilder";
import type { FloatArray, IndicesArray } from "../types";
import type { GreasedLinePoints } from "../Meshes/GreasedLine/greasedLineBaseMesh";
import type { Color3 } from "../Maths/math.color";
import { RawTexture } from "../Materials/Textures/rawTexture";
import type { Scene } from "../scene";
/**
 * Tool functions for GreasedLine
 */
export declare class GreasedLineTools {
    /**
     * Converts GreasedLinePoints to number[][]
     * @param points GreasedLinePoints
     * @returns number[][] with x, y, z coordinates of the points, like [[x, y, z, x, y, z, ...], [x, y, z, ...]]
     */
    static ConvertPoints(points: GreasedLinePoints): number[][];
    /**
     * Omit zero length lines predicate for the MeshesToLines function
     * @param p1 point1 position of the face
     * @param p2 point2 position of the face
     * @param p3 point3 position of the face
     * @returns original points or null if any edge length is zero
     */
    static OmitZeroLengthPredicate(p1: Vector3, p2: Vector3, p3: Vector3): Vector3[][] | null;
    /**
     * Omit duplicate lines predicate for the MeshesToLines function
     * @param p1 point1 position of the face
     * @param p2 point2 position of the face
     * @param p3 point3 position of the face
     * @param points array of points to search in
     * @returns original points or null if any edge length is zero
     */
    static OmitDuplicatesPredicate(p1: Vector3, p2: Vector3, p3: Vector3, points: Vector3[][]): Vector3[][] | null;
    private static _SearchInPoints;
    /**
     * Gets mesh triangles as line positions
     * @param meshes array of meshes
     * @param predicate predicate function which decides whether to include the mesh triangle/face in the ouput
     * @returns array of arrays of points
     */
    static MeshesToLines(meshes: AbstractMesh[], predicate?: (p1: Vector3, p2: Vector3, p3: Vector3, points: Vector3[][], indiceIndex: number, vertexIndex: number, mesh: AbstractMesh, meshIndex: number, vertices: FloatArray, indices: IndicesArray) => Vector3[][]): Vector3[][];
    /**
     * Converts number coordinates to Vector3s
     * @param points number array of x, y, z, x, y z, ... coordinates
     * @returns Vector3 array
     */
    static ToVector3Array(points: number[] | number[][]): Vector3[] | Vector3[][];
    /**
     * Gets a number array from a Vector3 array.
     * You can you for example to convert your Vector3[] offsets to the required number[] for the offsets option.
     * @param points Vector3 array
     * @returns an array of x, y, z coordinates as numbers [x, y, z, x, y, z, x, y, z, ....]
     */
    static ToNumberArray(points: Vector3[]): number[];
    /**
     * Calculates the sum of points of every line and the number of points in each line.
     * This function is useful when you are drawing multiple lines in one mesh and you want
     * to know the counts. For example for creating an offsets table.
     * @param points point array
     * @returns points count info
     */
    static GetPointsCountInfo(points: number[][]): {
        total: number;
        counts: number[];
    };
    /**
     * Gets the length of the line counting all it's segments length
     * @param data array of line points
     * @returns length of the line
     */
    static GetLineLength(data: Vector3[] | number[]): number;
    /**
     * Gets the the length from the beginning to each point of the line as array.
     * @param data array of line points
     * @returns length array of the line
     */
    static GetLineLengthArray(data: number[]): Float32Array;
    /**
     * Divides a segment into smaller segments.
     * A segment is a part of the line between it's two points.
     * @param point1 first point of the line
     * @param point2 second point of the line
     * @param segmentCount number of segments we want to have in the divided line
     * @returns
     */
    static SegmentizeSegmentByCount(point1: Vector3, point2: Vector3, segmentCount: number): Vector3[];
    /**
     * Divides a line into segments.
     * A segment is a part of the line between it's two points.
     * @param what line points
     * @param segmentLength length of each segment of the resulting line (distance between two line points)
     * @returns line point
     */
    static SegmentizeLineBySegmentLength(what: Vector3[] | number[] | {
        point1: Vector3;
        point2: Vector3;
        length: number;
    }[], segmentLength: number): Vector3[];
    /**
     * Divides a line into segments.
     * A segment is a part of the line between it's two points.
     * @param what line points
     * @param segmentCount number of segments
     * @returns line point
     */
    static SegmentizeLineBySegmentCount(what: Vector3[] | number[], segmentCount: number): Vector3[];
    /**
     * Gets line segments.
     * A segment is a part of the line between it's two points.
     * @param points line points
     * @returns segments information of the line segment including starting point, ending point and the distance between them
     */
    static GetLineSegments(points: Vector3[]): {
        point1: Vector3;
        point2: Vector3;
        length: number;
    }[];
    /**
     * Gets the minimum and the maximum length of a line segment in the line.
     * A segment is a part of the line between it's two points.
     * @param points line points
     * @returns
     */
    static GetMinMaxSegmentLength(points: Vector3[]): {
        min: number;
        max: number;
    };
    /**
     * Finds the last visible position in world space of the line according to the visibility parameter
     * @param lineSegments segments of the line
     * @param lineLength total length of the line
     * @param visbility normalized value of visibility
     * @param localSpace if true the result will be in local space (default is false)
     * @returns world space coordinate of the last visible piece of the line
     */
    static GetPositionOnLineByVisibility(lineSegments: {
        point1: Vector3;
        point2: Vector3;
        length: number;
    }[], lineLength: number, visbility: number, localSpace?: boolean): Vector3;
    /**
     * Creates lines in a shape of circle/arc.
     * A segment is a part of the line between it's two points.
     * @param radiusX radiusX of the circle
     * @param segments number of segments in the circle
     * @param z z coordinate of the points. Defaults to 0.
     * @param radiusY radiusY of the circle - you can draw an oval if using different values
     * @param segmentAngle angle offset of the segments. Defaults to Math.PI * 2 / segments. Change this value to draw a part of the circle.
     * @returns line points
     */
    static GetCircleLinePoints(radiusX: number, segments: number, z?: number, radiusY?: number, segmentAngle?: number): Vector3[];
    /**
     * Gets line points in a shape of a bezier curve
     * @param p0 bezier point0
     * @param p1 bezier point1
     * @param p2 bezier point2
     * @param segments number of segments in the curve
     * @returns
     */
    static GetBezierLinePoints(p0: Vector3, p1: Vector3, p2: Vector3, segments: number): number[];
    /**
     *
     * @param position position of the arrow cap (mainly you want to create a triangle, set widthUp and widthDown to the same value and omit widthStartUp and widthStartDown)
     * @param direction direction which the arrow points to
     * @param length length (size) of the arrow cap itself
     * @param widthUp the arrow width above the line
     * @param widthDown the arrow width belove the line
     * @param widthStartUp the arrow width at the start of the arrow above the line. In most scenarios this is 0.
     * @param widthStartDown the arrow width at the start of the arrow below the line. In most scenarios this is 0.
     * @returns
     */
    static GetArrowCap(position: Vector3, direction: Vector3, length: number, widthUp: number, widthDown: number, widthStartUp?: number, widthStartDown?: number): {
        points: Vector3[];
        widths: number[];
    };
    /**
     * Gets 3D positions of points from a text and font
     * @param text Text
     * @param size Size of the font
     * @param resolution Resolution of the font
     * @param fontData defines the font data (can be generated with http://gero3.github.io/facetype.js/)
     * @param z z coordinate
     * @param includeInner include the inner parts of the font in the result. Default true. If false, only the outlines will be returned.
     * @returns number[][] of 3D positions
     */
    static GetPointsFromText(text: string, size: number, resolution: number, fontData: IFontData, z?: number, includeInner?: boolean): number[][];
    /**
     * Converts an array of Color3 to Uint8Array
     * @param colors Arrray of Color3
     * @returns Uin8Array of colors [r, g, b, a, r, g, b, a, ...]
     */
    static Color3toRGBAUint8(colors: Color3[]): Uint8Array;
    /**
     * Creates a RawTexture from an RGBA color array and sets it on the plugin material instance.
     * @param name name of the texture
     * @param colors Uint8Array of colors
     * @param colorsSampling sampling mode of the created texture
     * @param scene Scene
     * @returns the colors texture
     */
    static CreateColorsTexture(name: string, colors: Color3[], colorsSampling: number, scene: Scene): RawTexture;
    /**
     * A minimum size texture for the colors sampler2D when there is no colors texture defined yet.
     * For fast switching using the useColors property without the need to use defines.
     * @param scene Scene
     * @returns empty colors texture
     */
    static PrepareEmptyColorsTexture(scene: Scene): RawTexture;
    /**
     * Diposes the shared empty colors texture
     */
    static DisposeEmptyColorsTexture(): void;
    /**
     * Converts boolean to number.
     * @param bool the bool value
     * @returns 1 if true, 0 if false.
     */
    static BooleanToNumber(bool?: boolean): 0 | 1;
}
