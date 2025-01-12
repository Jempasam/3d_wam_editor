import type { TransformNode } from "../../Meshes/transformNode";
import type { AbstractMesh } from "../../Meshes/abstractMesh";
import type { BoundingBox } from "../../Culling/boundingBox";
import { PhysicsShapeType } from "./IPhysicsEnginePlugin";
import type { PhysicsShapeParameters } from "./IPhysicsEnginePlugin";
import type { PhysicsMaterial } from "./physicsMaterial";
import { Vector3, Quaternion } from "../../Maths/math.vector";
import type { Mesh } from "../../Meshes/mesh";
import type { Scene } from "../../scene";
/**
 * Options for creating a physics shape
 */
export interface PhysicShapeOptions {
    /**
     * The type of the shape. This can be one of the following: SPHERE, BOX, CAPSULE, CYLINDER, CONVEX_HULL, MESH, HEIGHTFIELD, CONTAINER
     */
    type?: PhysicsShapeType;
    /**
     * The parameters of the shape. Varies depending of the shape type.
     */
    parameters?: PhysicsShapeParameters;
    /**
     * Reference to an already existing physics shape in the plugin.
     */
    pluginData?: any;
}
/**
 * PhysicsShape class.
 * This class is useful for creating a physics shape that can be used in a physics engine.
 * A Physic Shape determine how collision are computed. It must be attached to a body.
 */
export declare class PhysicsShape {
    /**
     * V2 Physics plugin private data for single shape
     */
    _pluginData: any;
    /**
     * The V2 plugin used to create and manage this Physics Body
     */
    private _physicsPlugin;
    private _type;
    private _material;
    private _isTrigger;
    private _isDisposed;
    /**
     * Constructs a new physics shape.
     * @param options The options for the physics shape. These are:
     *  * type: The type of the shape. This can be one of the following: SPHERE, BOX, CAPSULE, CYLINDER, CONVEX_HULL, MESH, HEIGHTFIELD, CONTAINER
     *  * parameters: The parameters of the shape.
     *  * pluginData: The plugin data of the shape. This is used if you already have a reference to the object on the plugin side.
     * You need to specify either type or pluginData.
     * @param scene The scene the shape belongs to.
     *
     * This code is useful for creating a new physics shape with the given type, options, and scene.
     * It also checks that the physics engine and plugin version are correct.
     * If not, it throws an error. This ensures that the shape is created with the correct parameters and is compatible with the physics engine.
     */
    constructor(options: PhysicShapeOptions, scene: Scene);
    /**
     * Returns the string "PhysicsShape".
     * @returns "PhysicsShape"
     */
    getClassName(): string;
    /**
     * Returns the type of the physics shape.
     * @returns The type of the physics shape.
     */
    get type(): PhysicsShapeType;
    /**
     * Set the membership mask of a shape. This is a bitfield of arbitrary
     * "categories" to which the shape is a member. This is used in combination
     * with the collide mask to determine if this shape should collide with
     * another.
     *
     * @param membershipMask Bitfield of categories of this shape.
     */
    set filterMembershipMask(membershipMask: number);
    /**
     * Get the membership mask of a shape.
     * @returns Bitmask of categories which this shape is a member of.
     */
    get filterMembershipMask(): number;
    /**
     * Sets the collide mask of a shape. This is a bitfield of arbitrary
     * "categories" to which this shape collides with. Given two shapes,
     * the engine will check if the collide mask and membership overlap:
     * shapeA.filterMembershipMask & shapeB.filterCollideMask
     *
     * If this value is zero (i.e. shapeB only collides with categories
     * which shapeA is _not_ a member of) then the shapes will not collide.
     *
     * Note, the engine will also perform the same test with shapeA and
     * shapeB swapped; the shapes will not collide if either shape has
     * a collideMask which prevents collision with the other shape.
     *
     * @param collideMask Bitmask of categories this shape should collide with
     */
    set filterCollideMask(collideMask: number);
    /**
     *
     * @returns Bitmask of categories that this shape should collide with
     */
    get filterCollideMask(): number;
    /**
     *
     * @param material
     */
    set material(material: PhysicsMaterial);
    /**
     * Returns the material of the physics shape.
     * @returns The material of the physics shape.
     */
    get material(): PhysicsMaterial;
    /**
     * Sets the density of the physics shape.
     * @param density The density of the physics shape.
     */
    set density(density: number);
    /**
     * Returns the density of the physics shape.
     * @returns The density of the physics shape.
     */
    get density(): number;
    /**
     * Utility to add a child shape to this container,
     * automatically computing the relative transform between
     * the container shape and the child instance.
     *
     * @param parentTransform The transform node associated with this shape
     * @param newChild The new PhysicsShape to add
     * @param childTransform The transform node associated with the child shape
     */
    addChildFromParent(parentTransform: TransformNode, newChild: PhysicsShape, childTransform: TransformNode): void;
    /**
     * Adds a child shape to a container with an optional transform
     * @param newChild The new PhysicsShape to add
     * @param translation Optional position of the child shape relative to this shape
     * @param rotation Optional rotation of the child shape relative to this shape
     * @param scale Optional scale of the child shape relative to this shape
     */
    addChild(newChild: PhysicsShape, translation?: Vector3, rotation?: Quaternion, scale?: Vector3): void;
    /**
     * Removes a child shape from this shape.
     * @param childIndex The index of the child shape to remove
     */
    removeChild(childIndex: number): void;
    /**
     * Returns the number of children of a physics shape.
     * @returns The number of children of a physics shape.
     */
    getNumChildren(): number;
    /**
     * Returns the bounding box of the physics shape.
     * @returns The bounding box of the physics shape.
     */
    getBoundingBox(): BoundingBox;
    set isTrigger(isTrigger: boolean);
    get isTrigger(): boolean;
    /**
     * Dispose the shape and release its associated resources.
     */
    dispose(): void;
}
/**
 * Helper object to create a sphere shape
 */
export declare class PhysicsShapeSphere extends PhysicsShape {
    /**
     * Constructor for the Sphere Shape
     * @param center local center of the sphere
     * @param radius radius
     * @param scene scene to attach to
     */
    constructor(center: Vector3, radius: number, scene: Scene);
    /**
     * Derive an approximate sphere from the mesh.
     * @param mesh node from which to derive the sphere shape
     * @returns PhysicsShapeSphere
     */
    static FromMesh(mesh: AbstractMesh): PhysicsShapeSphere;
}
/**
 * Helper object to create a capsule shape
 */
export declare class PhysicsShapeCapsule extends PhysicsShape {
    /**
     *
     * @param pointA Starting point that defines the capsule segment
     * @param pointB ending point of that same segment
     * @param radius radius
     * @param scene scene to attach to
     */
    constructor(pointA: Vector3, pointB: Vector3, radius: number, scene: Scene);
    /**
     * Derive an approximate capsule from the mesh. Note, this is
     * not the optimal bounding capsule.
     * @param mesh Node from which to derive a cylinder shape
     * @returns Physics Shape Capsule
     */
    static FromMesh(mesh: AbstractMesh): PhysicsShapeCapsule;
}
/**
 * Helper object to create a cylinder shape
 */
export declare class PhysicsShapeCylinder extends PhysicsShape {
    /**
     *
     * @param pointA Starting point that defines the cylinder segment
     * @param pointB ending point of that same segment
     * @param radius radius
     * @param scene scene to attach to
     */
    constructor(pointA: Vector3, pointB: Vector3, radius: number, scene: Scene);
    /**
     * Derive an approximate cylinder from the mesh. Note, this is
     * not the optimal bounding cylinder.
     * @param mesh Node from which to derive a cylinder shape
     * @returns Physics Shape Cylinder
     */
    static FromMesh(mesh: AbstractMesh): PhysicsShapeCylinder;
}
/**
 * Helper object to create a box shape
 */
export declare class PhysicsShapeBox extends PhysicsShape {
    /**
     *
     * @param center local center of the box
     * @param rotation local orientation
     * @param extents size of the box in each direction
     * @param scene scene to attach to
     */
    constructor(center: Vector3, rotation: Quaternion, extents: Vector3, scene: Scene);
    /**
     *
     * @param mesh
     * @returns PhysicsShapeBox
     */
    static FromMesh(mesh: AbstractMesh): PhysicsShapeBox;
}
/**
 * Helper object to create a convex hull shape
 */
export declare class PhysicsShapeConvexHull extends PhysicsShape {
    /**
     *
     * @param mesh the mesh to be used as topology infos for the convex hull
     * @param scene scene to attach to
     */
    constructor(mesh: Mesh, scene: Scene);
}
/**
 * Helper object to create a mesh shape
 */
export declare class PhysicsShapeMesh extends PhysicsShape {
    /**
     *
     * @param mesh the mesh topology that will be used to create the shape
     * @param scene scene to attach to
     */
    constructor(mesh: Mesh, scene: Scene);
}
/**
 * A shape container holds a variable number of shapes. Use AddChild to append to newly created parent container.
 */
export declare class PhysicsShapeContainer extends PhysicsShape {
    /**
     * Constructor of the Shape container
     * @param scene scene to attach to
     */
    constructor(scene: Scene);
}
