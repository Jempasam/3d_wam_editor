import type { Nullable } from "../types";
import type { Scene } from "../scene";
import { Quaternion, Matrix, Vector3, Vector2 } from "../Maths/math.vector";
import { Mesh } from "../Meshes/mesh";
import type { Material } from "../Materials/material";
import { Color4 } from "../Maths/math.color";
import { VertexData } from "./mesh.vertexData";
/**
 * Represents a vertex of a polygon. Use your own vertex class instead of this
 * one to provide additional features like texture coordinates and vertex
 * colors. Custom vertex classes need to provide a `pos` property and `clone()`,
 * `flip()`, and `interpolate()` methods that behave analogous to the ones
 * defined by `BABYLON.CSG.Vertex`. This class provides `normal` so convenience
 * functions like `BABYLON.CSG.sphere()` can return a smooth vertex normal, but `normal`
 * is not used anywhere else.
 * Same goes for uv, it allows to keep the original vertex uv coordinates of the 2 meshes
 */
declare class Vertex {
    /**
     * The position of the vertex
     */
    pos: Vector3;
    /**
     * The normal of the vertex
     */
    normal: Vector3;
    /**
     * The texture coordinate of the vertex
     */
    uv?: Vector2 | undefined;
    /**
     * The texture coordinate of the vertex
     */
    vertColor?: Color4 | undefined;
    /**
     * Initializes the vertex
     * @param pos The position of the vertex
     * @param normal The normal of the vertex
     * @param uv The texture coordinate of the vertex
     * @param vertColor The RGBA color of the vertex
     */
    constructor(
    /**
     * The position of the vertex
     */
    pos: Vector3, 
    /**
     * The normal of the vertex
     */
    normal: Vector3, 
    /**
     * The texture coordinate of the vertex
     */
    uv?: Vector2 | undefined, 
    /**
     * The texture coordinate of the vertex
     */
    vertColor?: Color4 | undefined);
    /**
     * Make a clone, or deep copy, of the vertex
     * @returns A new Vertex
     */
    clone(): Vertex;
    /**
     * Invert all orientation-specific data (e.g. vertex normal). Called when the
     * orientation of a polygon is flipped.
     */
    flip(): void;
    /**
     * Create a new vertex between this vertex and `other` by linearly
     * interpolating all properties using a parameter of `t`. Subclasses should
     * override this to interpolate additional properties.
     * @param other the vertex to interpolate against
     * @param t The factor used to linearly interpolate between the vertices
     * @returns The new interpolated vertex
     */
    interpolate(other: Vertex, t: number): Vertex;
}
/**
 * Represents a plane in 3D space.
 */
declare class CSGPlane {
    normal: Vector3;
    w: number;
    /**
     * Initializes the plane
     * @param normal The normal for the plane
     * @param w
     */
    constructor(normal: Vector3, w: number);
    /**
     * `CSG.Plane.EPSILON` is the tolerance used by `splitPolygon()` to decide if a
     * point is on the plane
     */
    static EPSILON: number;
    /**
     * Construct a plane from three points
     * @param a Point a
     * @param b Point b
     * @param c Point c
     * @returns A new plane
     */
    static FromPoints(a: Vector3, b: Vector3, c: Vector3): Nullable<CSGPlane>;
    /**
     * Clone, or make a deep copy of the plane
     * @returns a new Plane
     */
    clone(): CSGPlane;
    /**
     * Flip the face of the plane
     */
    flip(): void;
    /**
     * Split `polygon` by this plane if needed, then put the polygon or polygon
     * fragments in the appropriate lists. Coplanar polygons go into either
    `* coplanarFront` or `coplanarBack` depending on their orientation with
     * respect to this plane. Polygons in front or in back of this plane go into
     * either `front` or `back`
     * @param polygon The polygon to be split
     * @param coplanarFront Will contain polygons coplanar with the plane that are oriented to the front of the plane
     * @param coplanarBack Will contain polygons coplanar with the plane that are oriented to the back of the plane
     * @param front Will contain the polygons in front of the plane
     * @param back Will contain the polygons begind the plane
     */
    splitPolygon(polygon: CSGPolygon, coplanarFront: CSGPolygon[], coplanarBack: CSGPolygon[], front: CSGPolygon[], back: CSGPolygon[]): void;
}
/**
 * Represents a convex polygon. The vertices used to initialize a polygon must
 * be coplanar and form a convex loop.
 *
 * Each convex polygon has a `shared` property, which is shared between all
 * polygons that are clones of each other or were split from the same polygon.
 * This can be used to define per-polygon properties (such as surface color)
 */
declare class CSGPolygon {
    /**
     * Vertices of the polygon
     */
    vertices: Vertex[];
    /**
     * Properties that are shared across all polygons
     */
    shared: any;
    /**
     * A plane formed from the vertices of the polygon
     */
    plane: CSGPlane;
    /**
     * Initializes the polygon
     * @param vertices The vertices of the polygon
     * @param shared The properties shared across all polygons
     */
    constructor(vertices: Vertex[], shared: any);
    /**
     * Clones, or makes a deep copy, or the polygon
     * @returns A new CSGPolygon
     */
    clone(): CSGPolygon;
    /**
     * Flips the faces of the polygon
     */
    flip(): void;
}
/**
 * Class for building Constructive Solid Geometry
 */
export declare class CSG {
    private _polygons;
    /**
     * The world matrix
     */
    matrix: Matrix;
    /**
     * Stores the position
     */
    position: Vector3;
    /**
     * Stores the rotation
     */
    rotation: Vector3;
    /**
     * Stores the rotation quaternion
     */
    rotationQuaternion: Nullable<Quaternion>;
    /**
     * Stores the scaling vector
     */
    scaling: Vector3;
    /**
     * Convert a VertexData to CSG
     * @param data defines the VertexData to convert to CSG
     * @returns the new CSG
     */
    static FromVertexData(data: VertexData): CSG;
    /**
     * Convert the Mesh to CSG
     * @param mesh The Mesh to convert to CSG
     * @param absolute If true, the final (local) matrix transformation is set to the identity and not to that of `mesh`. It can help when dealing with right-handed meshes (default: false)
     * @returns A new CSG from the Mesh
     */
    static FromMesh(mesh: Mesh, absolute?: boolean): CSG;
    /**
     * Construct a CSG solid from a list of `CSG.Polygon` instances.
     * @param polygons Polygons used to construct a CSG solid
     * @returns A new CSG solid
     */
    private static _FromPolygons;
    /**
     * Clones, or makes a deep copy, of the CSG
     * @returns A new CSG
     */
    clone(): CSG;
    /**
     * Unions this CSG with another CSG
     * @param csg The CSG to union against this CSG
     * @returns The unioned CSG
     */
    union(csg: CSG): CSG;
    /**
     * Unions this CSG with another CSG in place
     * @param csg The CSG to union against this CSG
     */
    unionInPlace(csg: CSG): void;
    /**
     * Subtracts this CSG with another CSG
     * @param csg The CSG to subtract against this CSG
     * @returns A new CSG
     */
    subtract(csg: CSG): CSG;
    /**
     * Subtracts this CSG with another CSG in place
     * @param csg The CSG to subtract against this CSG
     */
    subtractInPlace(csg: CSG): void;
    /**
     * Intersect this CSG with another CSG
     * @param csg The CSG to intersect against this CSG
     * @returns A new CSG
     */
    intersect(csg: CSG): CSG;
    /**
     * Intersects this CSG with another CSG in place
     * @param csg The CSG to intersect against this CSG
     */
    intersectInPlace(csg: CSG): void;
    /**
     * Return a new CSG solid with solid and empty space switched. This solid is
     * not modified.
     * @returns A new CSG solid with solid and empty space switched
     */
    inverse(): CSG;
    /**
     * Inverses the CSG in place
     */
    inverseInPlace(): void;
    /**
     * This is used to keep meshes transformations so they can be restored
     * when we build back a Babylon Mesh
     * NB : All CSG operations are performed in world coordinates
     * @param csg The CSG to copy the transform attributes from
     * @returns This CSG
     */
    copyTransformAttributes(csg: CSG): CSG;
    /**
     * Build vertex data from CSG
     * Coordinates here are in world space
     * @param onBeforePolygonProcessing called before each polygon is being processed
     * @param onAfterPolygonProcessing called after each polygon has been processed
     * @returns the final vertex data
     */
    toVertexData(onBeforePolygonProcessing?: Nullable<(polygon: CSGPolygon) => void>, onAfterPolygonProcessing?: Nullable<() => void>): VertexData;
    /**
     * Build Raw mesh from CSG
     * Coordinates here are in world space
     * @param name The name of the mesh geometry
     * @param scene The Scene
     * @param keepSubMeshes Specifies if the submeshes should be kept
     * @returns A new Mesh
     */
    buildMeshGeometry(name: string, scene?: Scene, keepSubMeshes?: boolean): Mesh;
    /**
     * Build Mesh from CSG taking material and transforms into account
     * @param name The name of the Mesh
     * @param material The material of the Mesh
     * @param scene The Scene
     * @param keepSubMeshes Specifies if submeshes should be kept
     * @returns The new Mesh
     */
    toMesh(name: string, material?: Nullable<Material>, scene?: Scene, keepSubMeshes?: boolean): Mesh;
}
export {};
