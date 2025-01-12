import type { Nullable, IndicesArray } from "../types";
import { Vector3 } from "../Maths/math.vector";
import { Color4 } from "../Maths/math.color";
import { Mesh } from "../Meshes/mesh";
import type { Scene, IDisposable } from "../scene";
import { DepthSortedParticle, SolidParticle, ModelShape, SolidParticleVertex } from "./solidParticle";
import type { TargetCamera } from "../Cameras/targetCamera";
import { BoundingInfo } from "../Culling/boundingInfo";
import type { Material } from "../Materials/material";
import { MultiMaterial } from "../Materials/multiMaterial";
import type { PickingInfo } from "../Collisions/pickingInfo";
/**
 * The SPS is a single updatable mesh. The solid particles are simply separate parts or faces of this big mesh.
 *As it is just a mesh, the SPS has all the same properties than any other BJS mesh : not more, not less. It can be scaled, rotated, translated, enlighted, textured, moved, etc.

 * The SPS is also a particle system. It provides some methods to manage the particles.
 * However it is behavior agnostic. This means it has no emitter, no particle physics, no particle recycler. You have to implement your own behavior.
 *
 * Full documentation here : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_intro
 */
export declare class SolidParticleSystem implements IDisposable {
    /**
     *  The SPS array of Solid Particle objects. Just access each particle as with any classic array.
     *  Example : var p = SPS.particles[i];
     */
    particles: SolidParticle[];
    /**
     * The SPS total number of particles. Read only. Use SPS.counter instead if you need to set your own value.
     */
    nbParticles: number;
    /**
     * If the particles must ever face the camera (default false). Useful for planar particles.
     */
    billboard: boolean;
    /**
     * Recompute normals when adding a shape
     */
    recomputeNormals: boolean;
    /**
     * This a counter ofr your own usage. It's not set by any SPS functions.
     */
    counter: number;
    /**
     * The SPS name. This name is also given to the underlying mesh.
     */
    name: string;
    /**
     * The SPS mesh. It's a standard BJS Mesh, so all the methods from the Mesh class are available.
     */
    mesh: Mesh;
    /**
     * This empty object is intended to store some SPS specific or temporary values in order to lower the Garbage Collector activity.
     * Please read : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/optimize_sps#limit-garbage-collection
     */
    vars: any;
    /**
     * This array is populated when the SPS is set as 'pickable'.
     * Each key of this array is a `faceId` value that you can get from a pickResult object.
     * Each element of this array is an object `{idx: int, faceId: int}`.
     * `idx` is the picked particle index in the `SPS.particles` array
     * `faceId` is the picked face index counted within this particle.
     * This array is the first element of the pickedBySubMesh array : sps.pickBySubMesh[0].
     * It's not pertinent to use it when using a SPS with the support for MultiMaterial enabled.
     * Use the method SPS.pickedParticle(pickingInfo) instead.
     * Please read : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/picking_sps
     */
    pickedParticles: {
        idx: number;
        faceId: number;
    }[];
    /**
     * This array is populated when the SPS is set as 'pickable'
     * Each key of this array is a submesh index.
     * Each element of this array is a second array defined like this :
     * Each key of this second array is a `faceId` value that you can get from a pickResult object.
     * Each element of this second array is an object `{idx: int, faceId: int}`.
     * `idx` is the picked particle index in the `SPS.particles` array
     * `faceId` is the picked face index counted within this particle.
     * It's better to use the method SPS.pickedParticle(pickingInfo) rather than using directly this array.
     * Please read : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/picking_sps
     */
    pickedBySubMesh: {
        idx: number;
        faceId: number;
    }[][];
    /**
     * This array is populated when `enableDepthSort` is set to true.
     * Each element of this array is an instance of the class DepthSortedParticle.
     */
    depthSortedParticles: DepthSortedParticle[];
    /**
     * If the particle intersection must be computed only with the bounding sphere (no bounding box computation, so faster). (Internal use only)
     * @internal
     */
    _bSphereOnly: boolean;
    /**
     * A number to multiply the bounding sphere radius by in order to reduce it for instance. (Internal use only)
     * @internal
     */
    _bSphereRadiusFactor: number;
    protected _scene: Scene;
    protected _positions: number[];
    protected _indices: number[];
    protected _normals: number[];
    protected _colors: number[];
    protected _uvs: number[];
    protected _indices32: IndicesArray;
    protected _positions32: Float32Array;
    protected _normals32: Float32Array;
    protected _fixedNormal32: Float32Array;
    protected _colors32: Float32Array;
    protected _uvs32: Float32Array;
    protected _index: number;
    protected _updatable: boolean;
    protected _pickable: boolean;
    protected _isVisibilityBoxLocked: boolean;
    protected _alwaysVisible: boolean;
    protected _depthSort: boolean;
    protected _expandable: boolean;
    protected _shapeCounter: number;
    protected _copy: SolidParticle;
    protected _color: Color4;
    protected _computeParticleColor: boolean;
    protected _computeParticleTexture: boolean;
    protected _computeParticleRotation: boolean;
    protected _computeParticleVertex: boolean;
    protected _computeBoundingBox: boolean;
    protected _autoFixFaceOrientation: boolean;
    protected _depthSortParticles: boolean;
    protected _camera: TargetCamera;
    protected _mustUnrotateFixedNormals: boolean;
    protected _particlesIntersect: boolean;
    protected _needs32Bits: boolean;
    protected _isNotBuilt: boolean;
    protected _lastParticleId: number;
    protected _idxOfId: number[];
    protected _multimaterialEnabled: boolean;
    protected _useModelMaterial: boolean;
    protected _indicesByMaterial: number[];
    protected _materialIndexes: number[];
    protected _depthSortFunction: (p1: DepthSortedParticle, p2: DepthSortedParticle) => number;
    protected _materialSortFunction: (p1: DepthSortedParticle, p2: DepthSortedParticle) => number;
    protected _materials: Material[];
    protected _multimaterial: MultiMaterial;
    protected _materialIndexesById: any;
    protected _defaultMaterial: Material;
    protected _autoUpdateSubMeshes: boolean;
    protected _tmpVertex: SolidParticleVertex;
    protected _recomputeInvisibles: boolean;
    /**
     * Creates a SPS (Solid Particle System) object.
     * @param name (String) is the SPS name, this will be the underlying mesh name.
     * @param scene (Scene) is the scene in which the SPS is added.
     * @param options defines the options of the sps e.g.
     * * updatable (optional boolean, default true) : if the SPS must be updatable or immutable.
     * * isPickable (optional boolean, default false) : if the solid particles must be pickable.
     * * enableDepthSort (optional boolean, default false) : if the solid particles must be sorted in the geometry according to their distance to the camera.
     * * useModelMaterial (optional boolean, default false) : if the model materials must be used to create the SPS multimaterial. This enables the multimaterial supports of the SPS.
     * * enableMultiMaterial (optional boolean, default false) : if the solid particles can be given different materials.
     * * expandable (optional boolean, default false) : if particles can still be added after the initial SPS mesh creation.
     * * particleIntersection (optional boolean, default false) : if the solid particle intersections must be computed.
     * * boundingSphereOnly (optional boolean, default false) : if the particle intersection must be computed only with the bounding sphere (no bounding box computation, so faster).
     * * bSphereRadiusFactor (optional float, default 1.0) : a number to multiply the bounding sphere radius by in order to reduce it for instance.
     * * computeBoundingBox (optional boolean, default false): if the bounding box of the entire SPS will be computed (for occlusion detection, for example). If it is false, the bounding box will be the bounding box of the first particle.
     * * autoFixFaceOrientation (optional boolean, default false): if the particle face orientations will be flipped for transformations that change orientation (scale (-1, 1, 1), for example)
     * @param options.updatable
     * @param options.isPickable
     * @param options.enableDepthSort
     * @param options.particleIntersection
     * @param options.boundingSphereOnly
     * @param options.bSphereRadiusFactor
     * @param options.expandable
     * @param options.useModelMaterial
     * @param options.enableMultiMaterial
     * @param options.computeBoundingBox
     * @param options.autoFixFaceOrientation
     * @example bSphereRadiusFactor = 1.0 / Math.sqrt(3.0) => the bounding sphere exactly matches a spherical mesh.
     */
    constructor(name: string, scene: Scene, options?: {
        updatable?: boolean;
        isPickable?: boolean;
        enableDepthSort?: boolean;
        particleIntersection?: boolean;
        boundingSphereOnly?: boolean;
        bSphereRadiusFactor?: number;
        expandable?: boolean;
        useModelMaterial?: boolean;
        enableMultiMaterial?: boolean;
        computeBoundingBox?: boolean;
        autoFixFaceOrientation?: boolean;
    });
    /**
     * Builds the SPS underlying mesh. Returns a standard Mesh.
     * If no model shape was added to the SPS, the returned mesh is just a single triangular plane.
     * @returns the created mesh
     */
    buildMesh(): Mesh;
    private _getUVKind;
    /**
     * Digests the mesh and generates as many solid particles in the system as wanted. Returns the SPS.
     * These particles will have the same geometry than the mesh parts and will be positioned at the same localisation than the mesh original places.
     * Thus the particles generated from `digest()` have their property `position` set yet.
     * @param mesh ( Mesh ) is the mesh to be digested
     * @param options {facetNb} (optional integer, default 1) is the number of mesh facets per particle, this parameter is overridden by the parameter `number` if any
     * {delta} (optional integer, default 0) is the random extra number of facets per particle , each particle will have between `facetNb` and `facetNb + delta` facets
     * {number} (optional positive integer) is the wanted number of particles : each particle is built with `mesh_total_facets / number` facets
     * {storage} (optional existing array) is an array where the particles will be stored for a further use instead of being inserted in the SPS.
     * {uvKind} (optional positive integer, default 0) is the kind of UV to read from. Use -1 to deduce it from the diffuse/albedo texture (if any) of the mesh material
     * @param options.facetNb
     * @param options.number
     * @param options.delta
     * @param options.storage
     * @param options.uvKind
     * @returns the current SPS
     */
    digest(mesh: Mesh, options?: {
        facetNb?: number;
        number?: number;
        delta?: number;
        storage?: [];
        uvKind?: number;
    }): SolidParticleSystem;
    /**
     * Unrotate the fixed normals in case the mesh was built with pre-rotated particles, ex : use of positionFunction in addShape()
     * @internal
     */
    protected _unrotateFixedNormals(): void;
    /**
     * Resets the temporary working copy particle
     * @internal
     */
    protected _resetCopy(): void;
    /**
     * Inserts the shape model geometry in the global SPS mesh by updating the positions, indices, normals, colors, uvs arrays
     * @param p the current index in the positions array to be updated
     * @param ind the current index in the indices array
     * @param shape a Vector3 array, the shape geometry
     * @param positions the positions array to be updated
     * @param meshInd the shape indices array
     * @param indices the indices array to be updated
     * @param meshUV the shape uv array
     * @param uvs the uv array to be updated
     * @param meshCol the shape color array
     * @param colors the color array to be updated
     * @param meshNor the shape normals array
     * @param normals the normals array to be updated
     * @param idx the particle index
     * @param idxInShape the particle index in its shape
     * @param options the addShape() method  passed options
     * @param model
     * @model the particle model
     * @internal
     */
    protected _meshBuilder(p: number, ind: number, shape: Vector3[], positions: number[], meshInd: IndicesArray, indices: number[], meshUV: number[] | Float32Array, uvs: number[], meshCol: number[] | Float32Array, colors: number[], meshNor: number[] | Float32Array, normals: number[], idx: number, idxInShape: number, options: any, model: ModelShape): SolidParticle;
    /**
     * Returns a shape Vector3 array from positions float array
     * @param positions float array
     * @returns a vector3 array
     * @internal
     */
    protected _posToShape(positions: number[] | Float32Array): Vector3[];
    /**
     * Returns a shapeUV array from a float uvs (array deep copy)
     * @param uvs as a float array
     * @returns a shapeUV array
     * @internal
     */
    protected _uvsToShapeUV(uvs: number[] | Float32Array): number[];
    /**
     * Adds a new particle object in the particles array
     * @param idx particle index in particles array
     * @param id particle id
     * @param idxpos positionIndex : the starting index of the particle vertices in the SPS "positions" array
     * @param idxind indiceIndex : he starting index of the particle indices in the SPS "indices" array
     * @param model particle ModelShape object
     * @param shapeId model shape identifier
     * @param idxInShape index of the particle in the current model
     * @param bInfo model bounding info object
     * @param storage target storage array, if any
     * @internal
     */
    protected _addParticle(idx: number, id: number, idxpos: number, idxind: number, model: ModelShape, shapeId: number, idxInShape: number, bInfo?: Nullable<BoundingInfo>, storage?: Nullable<[]>): SolidParticle;
    /**
     * Adds some particles to the SPS from the model shape. Returns the shape id.
     * Please read the doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/immutable_sps
     * @param mesh is any Mesh object that will be used as a model for the solid particles. If the mesh does not have vertex normals, it will turn on the recomputeNormals attribute.
     * @param nb (positive integer) the number of particles to be created from this model
     * @param options {positionFunction} is an optional javascript function to called for each particle on SPS creation.
     * {vertexFunction} is an optional javascript function to called for each vertex of each particle on SPS creation
     * {storage} (optional existing array) is an array where the particles will be stored for a further use instead of being inserted in the SPS.
     * @param options.positionFunction
     * @param options.vertexFunction
     * @param options.storage
     * @returns the number of shapes in the system
     */
    addShape(mesh: Mesh, nb: number, options?: {
        positionFunction?: any;
        vertexFunction?: any;
        storage?: [];
    }): number;
    /**
     * Rebuilds a particle back to its just built status : if needed, recomputes the custom positions and vertices
     * @internal
     */
    protected _rebuildParticle(particle: SolidParticle, reset?: boolean): void;
    /**
     * Rebuilds the whole mesh and updates the VBO : custom positions and vertices are recomputed if needed.
     * @param reset boolean, default false : if the particles must be reset at position and rotation zero, scaling 1, color white, initial UVs and not parented.
     * @returns the SPS.
     */
    rebuildMesh(reset?: boolean): SolidParticleSystem;
    /** Removes the particles from the start-th to the end-th included from an expandable SPS (required).
     *  Returns an array with the removed particles.
     *  If the number of particles to remove is lower than zero or greater than the global remaining particle number, then an empty array is returned.
     *  The SPS can't be empty so at least one particle needs to remain in place.
     *  Under the hood, the VertexData array, so the VBO buffer, is recreated each call.
     * @param start index of the first particle to remove
     * @param end index of the last particle to remove (included)
     * @returns an array populated with the removed particles
     */
    removeParticles(start: number, end: number): SolidParticle[];
    /**
     * Inserts some pre-created particles in the solid particle system so that they can be managed by setParticles().
     * @param solidParticleArray an array populated with Solid Particles objects
     * @returns the SPS
     */
    insertParticlesFromArray(solidParticleArray: SolidParticle[]): SolidParticleSystem;
    /**
     * Creates a new particle and modifies the SPS mesh geometry :
     * - calls _meshBuilder() to increase the SPS mesh geometry step by step
     * - calls _addParticle() to populate the particle array
     * factorized code from addShape() and insertParticlesFromArray()
     * @param idx particle index in the particles array
     * @param i particle index in its shape
     * @param modelShape particle ModelShape object
     * @param shape shape vertex array
     * @param meshInd shape indices array
     * @param meshUV shape uv array
     * @param meshCol shape color array
     * @param meshNor shape normals array
     * @param bbInfo shape bounding info
     * @param storage target particle storage
     * @param options
     * @options addShape() passed options
     * @internal
     */
    protected _insertNewParticle(idx: number, i: number, modelShape: ModelShape, shape: Vector3[], meshInd: IndicesArray, meshUV: number[] | Float32Array, meshCol: number[] | Float32Array, meshNor: number[] | Float32Array, bbInfo: Nullable<BoundingInfo>, storage: Nullable<[]>, options: any): Nullable<SolidParticle>;
    /**
     *  Sets all the particles : this method actually really updates the mesh according to the particle positions, rotations, colors, textures, etc.
     *  This method calls `updateParticle()` for each particle of the SPS.
     *  For an animated SPS, it is usually called within the render loop.
     * This methods does nothing if called on a non updatable or not yet built SPS. Example : buildMesh() not called after having added or removed particles from an expandable SPS.
     * @param start The particle index in the particle array where to start to compute the particle property values _(default 0)_
     * @param end The particle index in the particle array where to stop to compute the particle property values _(default nbParticle - 1)_
     * @param update If the mesh must be finally updated on this call after all the particle computations _(default true)_
     * @returns the SPS.
     */
    setParticles(start?: number, end?: number, update?: boolean): SolidParticleSystem;
    /**
     * Disposes the SPS.
     */
    dispose(): void;
    /** Returns an object {idx: number faceId: number} for the picked particle from the passed pickingInfo object.
     * idx is the particle index in the SPS
     * faceId is the picked face index counted within this particle.
     * Returns null if the pickInfo can't identify a picked particle.
     * @param pickingInfo (PickingInfo object)
     * @returns {idx: number, faceId: number} or null
     */
    pickedParticle(pickingInfo: PickingInfo): Nullable<{
        idx: number;
        faceId: number;
    }>;
    /**
     * Returns a SolidParticle object from its identifier : particle.id
     * @param id (integer) the particle Id
     * @returns the searched particle or null if not found in the SPS.
     */
    getParticleById(id: number): Nullable<SolidParticle>;
    /**
     * Returns a new array populated with the particles having the passed shapeId.
     * @param shapeId (integer) the shape identifier
     * @returns a new solid particle array
     */
    getParticlesByShapeId(shapeId: number): SolidParticle[];
    /**
     * Populates the passed array "ref" with the particles having the passed shapeId.
     * @param shapeId the shape identifier
     * @param ref array to populate
     * @returns the SPS
     */
    getParticlesByShapeIdToRef(shapeId: number, ref: SolidParticle[]): SolidParticleSystem;
    /**
     * Computes the required SubMeshes according the materials assigned to the particles.
     * @returns the solid particle system.
     * Does nothing if called before the SPS mesh is built.
     */
    computeSubMeshes(): SolidParticleSystem;
    /**
     * Sorts the solid particles by material when MultiMaterial is enabled.
     * Updates the indices32 array.
     * Updates the indicesByMaterial array.
     * Updates the mesh indices array.
     * @returns the SPS
     * @internal
     */
    protected _sortParticlesByMaterial(): SolidParticleSystem;
    /**
     * Sets the material indexes by id materialIndexesById[id] = materialIndex
     * @internal
     */
    protected _setMaterialIndexesById(): void;
    /**
     * Returns an array with unique values of Materials from the passed array
     * @param array the material array to be checked and filtered
     * @internal
     */
    protected _filterUniqueMaterialId(array: Material[]): Material[];
    /**
     * Sets a new Standard Material as _defaultMaterial if not already set.
     * @internal
     */
    protected _setDefaultMaterial(): Material;
    /**
     * Visibility helper : Recomputes the visible size according to the mesh bounding box
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_visibility
     * @returns the SPS.
     */
    refreshVisibleSize(): SolidParticleSystem;
    /**
     * Visibility helper : Sets the size of a visibility box, this sets the underlying mesh bounding box.
     * @param size the size (float) of the visibility box
     * note : this doesn't lock the SPS mesh bounding box.
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_visibility
     */
    setVisibilityBox(size: number): void;
    /**
     * Gets whether the SPS as always visible or not
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_visibility
     */
    get isAlwaysVisible(): boolean;
    /**
     * Sets the SPS as always visible or not
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_visibility
     */
    set isAlwaysVisible(val: boolean);
    /**
     * Sets the SPS visibility box as locked or not. This enables/disables the underlying mesh bounding box updates.
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_visibility
     */
    set isVisibilityBoxLocked(val: boolean);
    /**
     * Gets if the SPS visibility box as locked or not. This enables/disables the underlying mesh bounding box updates.
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_visibility
     */
    get isVisibilityBoxLocked(): boolean;
    /**
     * Tells to `setParticles()` to compute the particle rotations or not.
     * Default value : true. The SPS is faster when it's set to false.
     * Note : the particle rotations aren't stored values, so setting `computeParticleRotation` to false will prevents the particle to rotate.
     */
    set computeParticleRotation(val: boolean);
    /**
     * Tells to `setParticles()` to compute the particle colors or not.
     * Default value : true. The SPS is faster when it's set to false.
     * Note : the particle colors are stored values, so setting `computeParticleColor` to false will keep yet the last colors set.
     */
    set computeParticleColor(val: boolean);
    set computeParticleTexture(val: boolean);
    /**
     * Tells to `setParticles()` to call the vertex function for each vertex of each particle, or not.
     * Default value : false. The SPS is faster when it's set to false.
     * Note : the particle custom vertex positions aren't stored values.
     */
    set computeParticleVertex(val: boolean);
    /**
     * Tells to `setParticles()` to compute or not the mesh bounding box when computing the particle positions.
     */
    set computeBoundingBox(val: boolean);
    /**
     * Tells to `setParticles()` to sort or not the distance between each particle and the camera.
     * Skipped when `enableDepthSort` is set to `false` (default) at construction time.
     * Default : `true`
     */
    set depthSortParticles(val: boolean);
    /**
     * Gets if `setParticles()` computes the particle rotations or not.
     * Default value : true. The SPS is faster when it's set to false.
     * Note : the particle rotations aren't stored values, so setting `computeParticleRotation` to false will prevents the particle to rotate.
     */
    get computeParticleRotation(): boolean;
    /**
     * Gets if `setParticles()` computes the particle colors or not.
     * Default value : true. The SPS is faster when it's set to false.
     * Note : the particle colors are stored values, so setting `computeParticleColor` to false will keep yet the last colors set.
     */
    get computeParticleColor(): boolean;
    /**
     * Gets if `setParticles()` computes the particle textures or not.
     * Default value : true. The SPS is faster when it's set to false.
     * Note : the particle textures are stored values, so setting `computeParticleTexture` to false will keep yet the last colors set.
     */
    get computeParticleTexture(): boolean;
    /**
     * Gets if `setParticles()` calls the vertex function for each vertex of each particle, or not.
     * Default value : false. The SPS is faster when it's set to false.
     * Note : the particle custom vertex positions aren't stored values.
     */
    get computeParticleVertex(): boolean;
    /**
     * Gets if `setParticles()` computes or not the mesh bounding box when computing the particle positions.
     */
    get computeBoundingBox(): boolean;
    /**
     * Gets if `setParticles()` sorts or not the distance between each particle and the camera.
     * Skipped when `enableDepthSort` is set to `false` (default) at construction time.
     * Default : `true`
     */
    get depthSortParticles(): boolean;
    /**
     * Gets if the SPS is created as expandable at construction time.
     * Default : `false`
     */
    get expandable(): boolean;
    /**
     * Gets if the SPS supports the Multi Materials
     */
    get multimaterialEnabled(): boolean;
    /**
     * Gets if the SPS uses the model materials for its own multimaterial.
     */
    get useModelMaterial(): boolean;
    /**
     * The SPS used material array.
     */
    get materials(): Material[];
    /**
     * Sets the SPS MultiMaterial from the passed materials.
     * Note : the passed array is internally copied and not used then by reference.
     * @param materials an array of material objects. This array indexes are the materialIndex values of the particles.
     */
    setMultiMaterial(materials: Material[]): void;
    /**
     * The SPS computed multimaterial object
     */
    get multimaterial(): MultiMaterial;
    set multimaterial(mm: MultiMaterial);
    /**
     * If the subMeshes must be updated on the next call to setParticles()
     */
    get autoUpdateSubMeshes(): boolean;
    set autoUpdateSubMeshes(val: boolean);
    /**
     * This function does nothing. It may be overwritten to set all the particle first values.
     * The SPS doesn't call this function, you may have to call it by your own.
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/manage_sps_particles
     */
    initParticles(): void;
    /**
     * This function does nothing. It may be overwritten to recycle a particle.
     * The SPS doesn't call this function, you may have to call it by your own.
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/manage_sps_particles
     * @param particle The particle to recycle
     * @returns the recycled particle
     */
    recycleParticle(particle: SolidParticle): SolidParticle;
    /**
     * Updates a particle : this function should  be overwritten by the user.
     * It is called on each particle by `setParticles()`. This is the place to code each particle behavior.
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/manage_sps_particles
     * @example : just set a particle position or velocity and recycle conditions
     * @param particle The particle to update
     * @returns the updated particle
     */
    updateParticle(particle: SolidParticle): SolidParticle;
    /**
     * Updates a vertex of a particle : it can be overwritten by the user.
     * This will be called on each vertex particle by `setParticles()` if `computeParticleVertex` is set to true only.
     * @param particle the current particle
     * @param vertex the current vertex of the current particle : a SolidParticleVertex object
     * @param pt the index of the current vertex in the particle shape
     * doc : https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_vertices
     * @example : just set a vertex particle position or color
     * @returns the sps
     */
    updateParticleVertex(particle: SolidParticle, vertex: SolidParticleVertex, pt: number): SolidParticleSystem;
    /**
     * This will be called before any other treatment by `setParticles()` and will be passed three parameters.
     * This does nothing and may be overwritten by the user.
     * @param start the particle index in the particle array where to stop to iterate, same than the value passed to setParticle()
     * @param stop the particle index in the particle array where to stop to iterate, same than the value passed to setParticle()
     * @param update the boolean update value actually passed to setParticles()
     */
    beforeUpdateParticles(start?: number, stop?: number, update?: boolean): void;
    /**
     * This will be called  by `setParticles()` after all the other treatments and just before the actual mesh update.
     * This will be passed three parameters.
     * This does nothing and may be overwritten by the user.
     * @param start the particle index in the particle array where to stop to iterate, same than the value passed to setParticle()
     * @param stop the particle index in the particle array where to stop to iterate, same than the value passed to setParticle()
     * @param update the boolean update value actually passed to setParticles()
     */
    afterUpdateParticles(start?: number, stop?: number, update?: boolean): void;
}
