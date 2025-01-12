import { Quaternion, Vector3 } from "../../../Maths/math.vector";
import { PhysicsShapeType, PhysicsMotionType, PhysicsConstraintMotorType, PhysicsConstraintAxis, PhysicsConstraintAxisLimitMode, PhysicsActivationControl } from "../IPhysicsEnginePlugin";
import type { PhysicsShapeParameters, IPhysicsEnginePluginV2, PhysicsMassProperties, IPhysicsCollisionEvent, IBasePhysicsCollisionEvent, ConstrainedBodyPair } from "../IPhysicsEnginePlugin";
import type { IRaycastQuery, PhysicsRaycastResult } from "../../physicsRaycastResult";
import type { PhysicsBody } from "../physicsBody";
import type { PhysicsConstraint } from "../physicsConstraint";
import type { PhysicsMaterial } from "../physicsMaterial";
import { PhysicsShape } from "../physicsShape";
import type { BoundingBox } from "../../../Culling/boundingBox";
import type { TransformNode } from "../../../Meshes/transformNode";
import { Mesh } from "../../../Meshes/mesh";
import { Observable } from "../../../Misc/observable";
import type { Nullable } from "../../../types";
import type { IPhysicsPointProximityQuery } from "../../physicsPointProximityQuery";
import type { ProximityCastResult } from "../../proximityCastResult";
import type { IPhysicsShapeProximityCastQuery } from "../../physicsShapeProximityCastQuery";
import type { IPhysicsShapeCastQuery } from "../../physicsShapeCastQuery";
import type { ShapeCastResult } from "../../shapeCastResult";
declare class BodyPluginData {
    constructor(bodyId: any);
    hpBodyId: any;
    worldTransformOffset: number;
    userMassProps: PhysicsMassProperties;
}
/**
 * The Havok Physics plugin
 */
export declare class HavokPlugin implements IPhysicsEnginePluginV2 {
    private _useDeltaForWorldStep;
    /**
     * Reference to the WASM library
     */
    _hknp: any;
    /**
     * Created Havok world which physics bodies are added to
     */
    world: any;
    /**
     * Name of the plugin
     */
    name: string;
    /**
     * We only have a single raycast in-flight right now
     */
    private _queryCollector;
    private _fixedTimeStep;
    private _tmpVec3;
    private _bodies;
    private _shapes;
    private _bodyBuffer;
    private _bodyCollisionObservable;
    private _constraintToBodyIdPair;
    private _bodyCollisionEndedObservable;
    /**
     * Observable for collision started and collision continued events
     */
    onCollisionObservable: Observable<IPhysicsCollisionEvent>;
    /**
     * Observable for collision ended events
     */
    onCollisionEndedObservable: Observable<IBasePhysicsCollisionEvent>;
    /**
     * Observable for trigger entered and trigger exited events
     */
    onTriggerCollisionObservable: Observable<IBasePhysicsCollisionEvent>;
    constructor(_useDeltaForWorldStep?: boolean, hpInjection?: any);
    /**
     * If this plugin is supported
     * @returns true if its supported
     */
    isSupported(): boolean;
    /**
     * Sets the gravity of the physics world.
     *
     * @param gravity - The gravity vector to set.
     *
     */
    setGravity(gravity: Vector3): void;
    /**
     * Sets the fixed time step for the physics engine.
     *
     * @param timeStep - The fixed time step to use for the physics engine.
     *
     */
    setTimeStep(timeStep: number): void;
    /**
     * Gets the fixed time step used by the physics engine.
     *
     * @returns The fixed time step used by the physics engine.
     *
     */
    getTimeStep(): number;
    /**
     * Executes a single step of the physics engine.
     *
     * @param delta The time delta in seconds since the last step.
     * @param physicsBodies An array of physics bodies to be simulated.
     *
     * This method is useful for simulating the physics engine. It sets the physics body transformation,
     * steps the world, syncs the physics body, and notifies collisions. This allows for the physics engine
     * to accurately simulate the physics bodies in the world.
     */
    executeStep(delta: number, physicsBodies: Array<PhysicsBody>): void;
    /**
     * Returns the version of the physics engine plugin.
     *
     * @returns The version of the physics engine plugin.
     *
     * This method is useful for determining the version of the physics engine plugin that is currently running.
     */
    getPluginVersion(): number;
    /**
     * Initializes a physics body with the given position and orientation.
     *
     * @param body - The physics body to initialize.
     * @param motionType - The motion type of the body.
     * @param position - The position of the body.
     * @param orientation - The orientation of the body.
     * This code is useful for initializing a physics body with the given position and orientation.
     * It creates a plugin data for the body and adds it to the world. It then converts the position
     * and orientation to a transform and sets the body's transform to the given values.
     */
    initBody(body: PhysicsBody, motionType: PhysicsMotionType, position: Vector3, orientation: Quaternion): void;
    /**
     * Removes a body from the world. To dispose of a body, it is necessary to remove it from the world first.
     *
     * @param body - The body to remove.
     */
    removeBody(body: PhysicsBody): void;
    /**
     * Initializes the body instances for a given physics body and mesh.
     *
     * @param body - The physics body to initialize.
     * @param motionType - How the body will be handled by the engine
     * @param mesh - The mesh to initialize.
     *
     * This code is useful for creating a physics body from a mesh. It creates a
     * body instance for each instance of the mesh and adds it to the world. It also
     * sets the position of the body instance to the position of the mesh instance.
     * This allows for the physics engine to accurately simulate the mesh in the
     * world.
     */
    initBodyInstances(body: PhysicsBody, motionType: PhysicsMotionType, mesh: Mesh): void;
    private _createOrUpdateBodyInstances;
    /**
     * Update the internal body instances for a given physics body to match the instances in a mesh.
     * @param body the body that will be updated
     * @param mesh the mesh with reference instances
     */
    updateBodyInstances(body: PhysicsBody, mesh: Mesh): void;
    /**
     * Synchronizes the transform of a physics body with its transform node.
     * @param body - The physics body to synchronize.
     *
     * This function is useful for keeping the physics body's transform in sync with its transform node.
     * This is important for ensuring that the physics body is accurately represented in the physics engine.
     */
    sync(body: PhysicsBody): void;
    /**
     * Synchronizes the transform of a physics body with the transform of its
     * corresponding transform node.
     *
     * @param body - The physics body to synchronize.
     * @param transformNode - The destination Transform Node.
     *
     * This code is useful for synchronizing the position and orientation of a
     * physics body with the position and orientation of its corresponding
     * transform node. This is important for ensuring that the physics body and
     * the transform node are in the same position and orientation in the scene.
     * This is necessary for the physics engine to accurately simulate the
     * physical behavior of the body.
     */
    syncTransform(body: PhysicsBody, transformNode: TransformNode): void;
    /**
     * Sets the shape of a physics body.
     * @param body - The physics body to set the shape for.
     * @param shape - The physics shape to set.
     *
     * This function is used to set the shape of a physics body. It is useful for
     * creating a physics body with a specific shape, such as a box or a sphere,
     * which can then be used to simulate physical interactions in a physics engine.
     * This function is especially useful for meshes with multiple instances, as it
     * will set the shape for each instance of the mesh.
     */
    setShape(body: PhysicsBody, shape: Nullable<PhysicsShape>): void;
    /**
     * Returns a reference to the first instance of the plugin data for a physics body.
     * @param body
     * @param instanceIndex
     * @returns a reference to the first instance
     */
    private _getPluginReference;
    /**
     * Gets the shape of a physics body. This will create a new shape object
     *
     * @param body - The physics body.
     * @returns The shape of the physics body.
     *
     */
    getShape(body: PhysicsBody): Nullable<PhysicsShape>;
    /**
     * Gets the type of a physics shape.
     * @param shape - The physics shape to get the type for.
     * @returns The type of the physics shape.
     *
     */
    getShapeType(shape: PhysicsShape): PhysicsShapeType;
    /**
     * Sets the event mask of a physics body.
     * @param body - The physics body to set the event mask for.
     * @param eventMask - The event mask to set.
     * @param instanceIndex - The index of the instance to set the event mask for
     *
     * This function is useful for setting the event mask of a physics body, which is used to determine which events the body will respond to. This is important for ensuring that the physics engine is able to accurately simulate the behavior of the body in the game world.
     */
    setEventMask(body: PhysicsBody, eventMask: number, instanceIndex?: number): void;
    /**
     * Retrieves the event mask of a physics body.
     *
     * @param body - The physics body to retrieve the event mask from.
     * @param instanceIndex - The index of the instance to retrieve the event mask from.
     * @returns The event mask of the physics body.
     *
     */
    getEventMask(body: PhysicsBody, instanceIndex?: number): number;
    private _fromMassPropertiesTuple;
    private _internalUpdateMassProperties;
    _internalSetMotionType(pluginData: BodyPluginData, motionType: PhysicsMotionType): void;
    /**
     * sets the motion type of a physics body.
     * @param body - The physics body to set the motion type for.
     * @param motionType - The motion type to set.
     * @param instanceIndex - The index of the instance to set the motion type for. If undefined, the motion type of all the bodies will be set.
     */
    setMotionType(body: PhysicsBody, motionType: PhysicsMotionType, instanceIndex?: number): void;
    /**
     * Gets the motion type of a physics body.
     * @param body - The physics body to get the motion type from.
     * @param instanceIndex - The index of the instance to get the motion type from. If not specified, the motion type of the first instance will be returned.
     * @returns The motion type of the physics body.
     */
    getMotionType(body: PhysicsBody, instanceIndex?: number): PhysicsMotionType;
    /**
     * sets the activation control mode of a physics body, for instance if you need the body to never sleep.
     * @param body - The physics body to set the activation control mode.
     * @param controlMode - The activation control mode.
     */
    setActivationControl(body: PhysicsBody, controlMode: PhysicsActivationControl): void;
    private _internalComputeMassProperties;
    /**
     * Computes the mass properties of a physics body, from it's shape
     *
     * @param body - The physics body to copmute the mass properties of
     * @param instanceIndex - The index of the instance to compute the mass properties of.
     * @returns The mass properties of the physics body.
     */
    computeMassProperties(body: PhysicsBody, instanceIndex?: number): PhysicsMassProperties;
    /**
     * Sets the mass properties of a physics body.
     *
     * @param body - The physics body to set the mass properties of.
     * @param massProps - The mass properties to set.
     * @param instanceIndex - The index of the instance to set the mass properties of. If undefined, the mass properties of all the bodies will be set.
     * This function is useful for setting the mass properties of a physics body,
     * such as its mass, inertia, and center of mass. This is important for
     * accurately simulating the physics of the body in the physics engine.
     *
     */
    setMassProperties(body: PhysicsBody, massProps: PhysicsMassProperties, instanceIndex?: number): void;
    /**
     * Gets the mass properties of a physics body.
     * @param body - The physics body to get the mass properties from.
     * @param instanceIndex - The index of the instance to get the mass properties from. If not specified, the mass properties of the first instance will be returned.
     * @returns The mass properties of the physics body.
     */
    getMassProperties(body: PhysicsBody, instanceIndex?: number): PhysicsMassProperties;
    /**
     * Sets the linear damping of the given body.
     * @param body - The body to set the linear damping for.
     * @param damping - The linear damping to set.
     * @param instanceIndex - The index of the instance to set the linear damping for. If not specified, the linear damping of the first instance will be set.
     *
     * This method is useful for controlling the linear damping of a body in a physics engine.
     * Linear damping is a force that opposes the motion of the body, and is proportional to the velocity of the body.
     * This method allows the user to set the linear damping of a body, which can be used to control the motion of the body.
     */
    setLinearDamping(body: PhysicsBody, damping: number, instanceIndex?: number): void;
    /**
     * Gets the linear damping of the given body.
     * @param body - The body to get the linear damping from.
     * @param instanceIndex - The index of the instance to get the linear damping from. If not specified, the linear damping of the first instance will be returned.
     * @returns The linear damping of the given body.
     *
     * This method is useful for getting the linear damping of a body in a physics engine.
     * Linear damping is a force that opposes the motion of the body and is proportional to the velocity of the body.
     * It is used to simulate the effects of air resistance and other forms of friction.
     */
    getLinearDamping(body: PhysicsBody, instanceIndex?: number): number;
    /**
     * Sets the angular damping of a physics body.
     * @param body - The physics body to set the angular damping for.
     * @param damping - The angular damping value to set.
     * @param instanceIndex - The index of the instance to set the angular damping for. If not specified, the angular damping of the first instance will be set.
     *
     * This function is useful for controlling the angular velocity of a physics body.
     * By setting the angular damping, the body's angular velocity will be reduced over time, allowing for more realistic physics simulations.
     */
    setAngularDamping(body: PhysicsBody, damping: number, instanceIndex?: number): void;
    /**
     * Gets the angular damping of a physics body.
     * @param body - The physics body to get the angular damping from.
     * @param instanceIndex - The index of the instance to get the angular damping from. If not specified, the angular damping of the first instance will be returned.
     * @returns The angular damping of the body.
     *
     * This function is useful for retrieving the angular damping of a physics body,
     * which is used to control the rotational motion of the body. The angular damping is a value between 0 and 1, where 0 is no damping and 1 is full damping.
     */
    getAngularDamping(body: PhysicsBody, instanceIndex?: number): number;
    /**
     * Sets the linear velocity of a physics body.
     * @param body - The physics body to set the linear velocity of.
     * @param linVel - The linear velocity to set.
     * @param instanceIndex - The index of the instance to set the linear velocity of. If not specified, the linear velocity of the first instance will be set.
     *
     * This function is useful for setting the linear velocity of a physics body, which is necessary for simulating
     * motion in a physics engine. The linear velocity is the speed and direction of the body's movement.
     */
    setLinearVelocity(body: PhysicsBody, linVel: Vector3, instanceIndex?: number): void;
    /**
     * Gets the linear velocity of a physics body and stores it in a given vector.
     * @param body - The physics body to get the linear velocity from.
     * @param linVel - The vector to store the linear velocity in.
     * @param instanceIndex - The index of the instance to get the linear velocity from. If not specified, the linear velocity of the first instance will be returned.
     *
     * This function is useful for retrieving the linear velocity of a physics body,
     * which can be used to determine the speed and direction of the body. This
     * information can be used to simulate realistic physics behavior in a game.
     */
    getLinearVelocityToRef(body: PhysicsBody, linVel: Vector3, instanceIndex?: number): void;
    private _applyToBodyOrInstances;
    /**
     * Applies an impulse to a physics body at a given location.
     * @param body - The physics body to apply the impulse to.
     * @param impulse - The impulse vector to apply.
     * @param location - The location in world space to apply the impulse.
     * @param instanceIndex - The index of the instance to apply the impulse to. If not specified, the impulse will be applied to all instances.
     *
     * This method is useful for applying an impulse to a physics body at a given location.
     * This can be used to simulate physical forces such as explosions, collisions, and gravity.
     */
    applyImpulse(body: PhysicsBody, impulse: Vector3, location: Vector3, instanceIndex?: number): void;
    /**
     * Applies an angular impulse(torque) to a physics body
     * @param body - The physics body to apply the impulse to.
     * @param angularImpulse - The torque value
     * @param instanceIndex - The index of the instance to apply the impulse to. If not specified, the impulse will be applied to all instances.
     */
    applyAngularImpulse(body: PhysicsBody, angularImpulse: Vector3, instanceIndex?: number): void;
    /**
     * Applies a force to a physics body at a given location.
     * @param body - The physics body to apply the impulse to.
     * @param force - The force vector to apply.
     * @param location - The location in world space to apply the impulse.
     * @param instanceIndex - The index of the instance to apply the force to. If not specified, the force will be applied to all instances.
     *
     * This method is useful for applying a force to a physics body at a given location.
     * This can be used to simulate physical forces such as explosions, collisions, and gravity.
     */
    applyForce(body: PhysicsBody, force: Vector3, location: Vector3, instanceIndex?: number): void;
    /**
     * Sets the angular velocity of a physics body.
     *
     * @param body - The physics body to set the angular velocity of.
     * @param angVel - The angular velocity to set.
     * @param instanceIndex - The index of the instance to set the angular velocity of. If not specified, the angular velocity of the first instance will be set.
     *
     * This function is useful for setting the angular velocity of a physics body in a physics engine.
     * This allows for more realistic simulations of physical objects, as they can be given a rotational velocity.
     */
    setAngularVelocity(body: PhysicsBody, angVel: Vector3, instanceIndex?: number): void;
    /**
     * Gets the angular velocity of a body.
     * @param body - The body to get the angular velocity from.
     * @param angVel - The vector3 to store the angular velocity.
     * @param instanceIndex - The index of the instance to get the angular velocity from. If not specified, the angular velocity of the first instance will be returned.
     *
     * This method is useful for getting the angular velocity of a body in a physics engine. It
     * takes the body and a vector3 as parameters and stores the angular velocity of the body
     * in the vector3. This is useful for getting the angular velocity of a body in order to
     * calculate the motion of the body in the physics engine.
     */
    getAngularVelocityToRef(body: PhysicsBody, angVel: Vector3, instanceIndex?: number): void;
    /**
     * Sets the transformation of the given physics body to the given transform node.
     * @param body The physics body to set the transformation for.
     * @param node The transform node to set the transformation from.
     * Sets the transformation of the given physics body to the given transform node.
     *
     * This function is useful for setting the transformation of a physics body to a
     * transform node, which is necessary for the physics engine to accurately simulate
     * the motion of the body. It also takes into account instances of the transform
     * node, which is necessary for accurate simulation of multiple bodies with the
     * same transformation.
     */
    setPhysicsBodyTransformation(body: PhysicsBody, node: TransformNode): void;
    /**
     * Set the target transformation (position and rotation) of the body, such that the body will set its velocity to reach that target
     * @param body The physics body to set the target transformation for.
     * @param position The target position
     * @param rotation The target rotation
     * @param instanceIndex The index of the instance in an instanced body
     */
    setTargetTransform(body: PhysicsBody, position: Vector3, rotation: Quaternion, instanceIndex?: number | undefined): void;
    /**
     * Sets the gravity factor of a body
     * @param body the physics body to set the gravity factor for
     * @param factor the gravity factor
     * @param instanceIndex the index of the instance in an instanced body
     */
    setGravityFactor(body: PhysicsBody, factor: number, instanceIndex?: number): void;
    /**
     * Get the gravity factor of a body
     * @param body the physics body to get the gravity factor from
     * @param instanceIndex the index of the instance in an instanced body. If not specified, the gravity factor of the first instance will be returned.
     * @returns the gravity factor
     */
    getGravityFactor(body: PhysicsBody, instanceIndex?: number): number;
    /**
     * Disposes a physics body.
     *
     * @param body - The physics body to dispose.
     *
     * This method is useful for releasing the resources associated with a physics body when it is no longer needed.
     * This is important for avoiding memory leaks in the physics engine.
     */
    disposeBody(body: PhysicsBody): void;
    /**
     * Initializes a physics shape with the given type and parameters.
     * @param shape - The physics shape to initialize.
     * @param type - The type of shape to initialize.
     * @param options - The parameters for the shape.
     *
     * This code is useful for initializing a physics shape with the given type and parameters.
     * It allows for the creation of a sphere, box, capsule, container, cylinder, mesh, and heightfield.
     * Depending on the type of shape, different parameters are required.
     * For example, a sphere requires a radius, while a box requires extents and a rotation.
     */
    initShape(shape: PhysicsShape, type: PhysicsShapeType, options: PhysicsShapeParameters): void;
    /**
     * Sets the shape filter membership mask of a body
     * @param shape - The physics body to set the shape filter membership mask for.
     * @param membershipMask - The shape filter membership mask to set.
     */
    setShapeFilterMembershipMask(shape: PhysicsShape, membershipMask: number): void;
    /**
     * Gets the shape filter membership mask of a body
     * @param shape - The physics body to get the shape filter membership mask from.
     * @returns The shape filter membership mask of the given body.
     */
    getShapeFilterMembershipMask(shape: PhysicsShape): number;
    /**
     * Sets the shape filter collide mask of a body
     * @param shape - The physics body to set the shape filter collide mask for.
     * @param collideMask - The shape filter collide mask to set.
     */
    setShapeFilterCollideMask(shape: PhysicsShape, collideMask: number): void;
    /**
     * Gets the shape filter collide mask of a body
     * @param shape - The physics body to get the shape filter collide mask from.
     * @returns The shape filter collide mask of the given body.
     */
    getShapeFilterCollideMask(shape: PhysicsShape): number;
    /**
     * Sets the material of a physics shape.
     * @param shape - The physics shape to set the material of.
     * @param material - The material to set.
     *
     */
    setMaterial(shape: PhysicsShape, material: PhysicsMaterial): void;
    /**
     * Gets the material associated with a physics shape.
     * @param shape - The shape to get the material from.
     * @returns The material associated with the shape.
     */
    getMaterial(shape: PhysicsShape): PhysicsMaterial;
    /**
     * Sets the density of a physics shape.
     * @param shape - The physics shape to set the density of.
     * @param density - The density to set.
     *
     */
    setDensity(shape: PhysicsShape, density: number): void;
    /**
     * Calculates the density of a given physics shape.
     *
     * @param shape - The physics shape to calculate the density of.
     * @returns The density of the given physics shape.
     *
     */
    getDensity(shape: PhysicsShape): number;
    /**
     * Gets the transform infos of a given transform node.
     * This code is useful for getting the position and orientation of a given transform node.
     * It first checks if the node has a rotation quaternion, and if not, it creates one from the node's rotation.
     * It then creates an array containing the position and orientation of the node and returns it.
     * @param node - The transform node.
     * @returns An array containing the position and orientation of the node.
     */
    private _getTransformInfos;
    /**
     * Adds a child shape to the given shape.
     * @param shape - The parent shape.
     * @param newChild - The child shape to add.
     * @param translation - The relative translation of the child from the parent shape
     * @param rotation - The relative rotation of the child from the parent shape
     * @param scale - The relative scale scale of the child from the parent shaep
     *
     */
    addChild(shape: PhysicsShape, newChild: PhysicsShape, translation?: Vector3, rotation?: Quaternion, scale?: Vector3): void;
    /**
     * Removes a child shape from a parent shape.
     * @param shape - The parent shape.
     * @param childIndex - The index of the child shape to remove.
     *
     */
    removeChild(shape: PhysicsShape, childIndex: number): void;
    /**
     * Returns the number of children of the given shape.
     *
     * @param shape - The shape to get the number of children from.
     * @returns The number of children of the given shape.
     *
     */
    getNumChildren(shape: PhysicsShape): number;
    /**
     * Marks the shape as a trigger
     * @param shape the shape to mark as a trigger
     * @param isTrigger if the shape is a trigger
     */
    setTrigger(shape: PhysicsShape, isTrigger: boolean): void;
    /**
     * Calculates the bounding box of a given physics shape.
     *
     * @param _shape - The physics shape to calculate the bounding box for.
     * @returns The calculated bounding box.
     *
     * This method is useful for physics engines as it allows to calculate the
     * boundaries of a given shape. Knowing the boundaries of a shape is important
     * for collision detection and other physics calculations.
     */
    getBoundingBox(_shape: PhysicsShape): BoundingBox;
    /**
     * Gets the geometry of a physics body.
     *
     * @param body - The physics body.
     * @returns An object containing the positions and indices of the body's geometry.
     *
     */
    getBodyGeometry(body: PhysicsBody): {
        positions: never[];
        indices: never[];
    } | {
        positions: Float32Array;
        indices: Uint32Array;
    };
    /**
     * Releases a physics shape from the physics engine.
     *
     * @param shape - The physics shape to be released.
     *
     * This method is useful for releasing a physics shape from the physics engine, freeing up resources and preventing memory leaks.
     */
    disposeShape(shape: PhysicsShape): void;
    /**
     * Initializes a physics constraint with the given parameters.
     *
     * @param constraint - The physics constraint to be initialized.
     * @param body - The main body
     * @param childBody - The child body.
     * @param instanceIndex - If this body is instanced, the index of the instance to which the constraint will be applied. If not specified, no constraint will be applied.
     * @param childInstanceIndex - If the child body is instanced, the index of the instance to which the constraint will be applied. If not specified, no constraint will be applied.
     *
     * This function is useful for setting up a physics constraint in a physics engine.
     */
    initConstraint(constraint: PhysicsConstraint, body: PhysicsBody, childBody: PhysicsBody, instanceIndex?: number, childInstanceIndex?: number): void;
    /**
     * Get a list of all the pairs of bodies that are connected by this constraint.
     * @param constraint the constraint to search from
     * @returns a list of parent, child pairs
     */
    getBodiesUsingConstraint(constraint: PhysicsConstraint): ConstrainedBodyPair[];
    /**
     * Adds a constraint to the physics engine.
     *
     * @param body - The main body to which the constraint is applied.
     * @param childBody - The body to which the constraint is applied.
     * @param constraint - The constraint to be applied.
     * @param instanceIndex - If this body is instanced, the index of the instance to which the constraint will be applied. If not specified, no constraint will be applied.
     * @param childInstanceIndex - If the child body is instanced, the index of the instance to which the constraint will be applied. If not specified, no constraint will be applied.
     */
    addConstraint(body: PhysicsBody, childBody: PhysicsBody, constraint: PhysicsConstraint, instanceIndex?: number, childInstanceIndex?: number): void;
    /**
     * Enables or disables a constraint in the physics engine.
     * @param constraint - The constraint to enable or disable.
     * @param isEnabled - Whether the constraint should be enabled or disabled.
     *
     */
    setEnabled(constraint: PhysicsConstraint, isEnabled: boolean): void;
    /**
     * Gets the enabled state of the given constraint.
     * @param constraint - The constraint to get the enabled state from.
     * @returns The enabled state of the given constraint.
     *
     */
    getEnabled(constraint: PhysicsConstraint): boolean;
    /**
     * Enables or disables collisions for the given constraint.
     * @param constraint - The constraint to enable or disable collisions for.
     * @param isEnabled - Whether collisions should be enabled or disabled.
     *
     */
    setCollisionsEnabled(constraint: PhysicsConstraint, isEnabled: boolean): void;
    /**
     * Gets whether collisions are enabled for the given constraint.
     * @param constraint - The constraint to get collisions enabled for.
     * @returns Whether collisions are enabled for the given constraint.
     *
     */
    getCollisionsEnabled(constraint: PhysicsConstraint): boolean;
    /**
     * Sets the friction of the given axis of the given constraint.
     *
     * @param constraint - The constraint to set the friction of.
     * @param axis - The axis of the constraint to set the friction of.
     * @param friction - The friction to set.
     *
     */
    setAxisFriction(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis, friction: number): void;
    /**
     * Gets the friction value of the specified axis of the given constraint.
     *
     * @param constraint - The constraint to get the axis friction from.
     * @param axis - The axis to get the friction from.
     * @returns The friction value of the specified axis.
     *
     */
    getAxisFriction(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis): Nullable<number>;
    /**
     * Sets the limit mode of the specified axis of the given constraint.
     * @param constraint - The constraint to set the axis mode of.
     * @param axis - The axis to set the limit mode of.
     * @param limitMode - The limit mode to set.
     */
    setAxisMode(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis, limitMode: PhysicsConstraintAxisLimitMode): void;
    /**
     * Gets the axis limit mode of the given constraint.
     *
     * @param constraint - The constraint to get the axis limit mode from.
     * @param axis - The axis to get the limit mode from.
     * @returns The axis limit mode of the given constraint.
     *
     */
    getAxisMode(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis): Nullable<PhysicsConstraintAxisLimitMode>;
    /**
     * Sets the minimum limit of the given axis of the given constraint.
     * @param constraint - The constraint to set the minimum limit of.
     * @param axis - The axis to set the minimum limit of.
     * @param limit - The minimum limit to set.
     *
     */
    setAxisMinLimit(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis, limit: number): void;
    /**
     * Gets the minimum limit of the specified axis of the given constraint.
     * @param constraint - The constraint to get the minimum limit from.
     * @param axis - The axis to get the minimum limit from.
     * @returns The minimum limit of the specified axis of the given constraint.
     *
     */
    getAxisMinLimit(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis): Nullable<number>;
    /**
     * Sets the maximum limit of the given axis of the given constraint.
     * @param constraint - The constraint to set the maximum limit of the given axis.
     * @param axis - The axis to set the maximum limit of.
     * @param limit - The maximum limit to set.
     *
     */
    setAxisMaxLimit(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis, limit: number): void;
    /**
     * Gets the maximum limit of the given axis of the given constraint.
     *
     * @param constraint - The constraint to get the maximum limit from.
     * @param axis - The axis to get the maximum limit from.
     * @returns The maximum limit of the given axis of the given constraint.
     *
     */
    getAxisMaxLimit(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis): Nullable<number>;
    /**
     * Sets the motor type of the given axis of the given constraint.
     * @param constraint - The constraint to set the motor type of.
     * @param axis - The axis of the constraint to set the motor type of.
     * @param motorType - The motor type to set.
     *
     */
    setAxisMotorType(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis, motorType: PhysicsConstraintMotorType): void;
    /**
     * Gets the motor type of the specified axis of the given constraint.
     * @param constraint - The constraint to get the motor type from.
     * @param axis - The axis of the constraint to get the motor type from.
     * @returns The motor type of the specified axis of the given constraint.
     *
     */
    getAxisMotorType(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis): Nullable<PhysicsConstraintMotorType>;
    /**
     * Sets the target of an axis motor of a constraint.
     *
     * @param constraint - The constraint to set the axis motor target of.
     * @param axis - The axis of the constraint to set the motor target of.
     * @param target - The target of the axis motor.
     *
     */
    setAxisMotorTarget(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis, target: number): void;
    /**
     * Gets the target of the motor of the given axis of the given constraint.
     *
     * @param constraint - The constraint to get the motor target from.
     * @param axis - The axis of the constraint to get the motor target from.
     * @returns The target of the motor of the given axis of the given constraint.
     *
     */
    getAxisMotorTarget(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis): Nullable<number>;
    /**
     * Sets the maximum force that can be applied by the motor of the given constraint axis.
     * @param constraint - The constraint to set the motor max force for.
     * @param axis - The axis of the constraint to set the motor max force for.
     * @param maxForce - The maximum force that can be applied by the motor.
     *
     */
    setAxisMotorMaxForce(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis, maxForce: number): void;
    /**
     * Gets the maximum force of the motor of the given constraint axis.
     *
     * @param constraint - The constraint to get the motor maximum force from.
     * @param axis - The axis of the constraint to get the motor maximum force from.
     * @returns The maximum force of the motor of the given constraint axis.
     *
     */
    getAxisMotorMaxForce(constraint: PhysicsConstraint, axis: PhysicsConstraintAxis): Nullable<number>;
    /**
     * Disposes a physics constraint.
     *
     * @param constraint - The physics constraint to dispose.
     *
     * This method is useful for releasing the resources associated with a physics constraint, such as
     * the Havok constraint, when it is no longer needed. This is important for avoiding memory leaks.
     */
    disposeConstraint(constraint: PhysicsConstraint): void;
    private _populateHitData;
    /**
     * Performs a raycast from a given start point to a given end point and stores the result in a given PhysicsRaycastResult object.
     *
     * @param from - The start point of the raycast.
     * @param to - The end point of the raycast.
     * @param result - The PhysicsRaycastResult object to store the result of the raycast.
     * @param query - The raycast query options. See [[IRaycastQuery]] for more information.
     *
     * Performs a raycast. It takes in two points, from and to, and a PhysicsRaycastResult object to store the result of the raycast.
     * It then performs the raycast and stores the hit data in the PhysicsRaycastResult object.
     */
    raycast(from: Vector3, to: Vector3, result: PhysicsRaycastResult, query?: IRaycastQuery): void;
    /**
     * Given a point, returns the closest physics
     * body to that point.
     * @param query the query to perform. @see IPhysicsPointProximityQuery
     * @param result contact point on the hit shape, in world space
     */
    pointProximity(query: IPhysicsPointProximityQuery, result: ProximityCastResult): void;
    /**
     * Given a shape in a specific position and orientation, returns the closest point to that shape.
     * @param query the query to perform. @see IPhysicsShapeProximityCastQuery
     * @param inputShapeResult contact point on input shape, in input shape space
     * @param hitShapeResult contact point on hit shape, in world space
     */
    shapeProximity(query: IPhysicsShapeProximityCastQuery, inputShapeResult: ProximityCastResult, hitShapeResult: ProximityCastResult): void;
    /**
     * Given a shape in a specific orientation, cast it from the start to end position specified by the query, and return the first hit.
     * @param query the query to perform. @see IPhysicsShapeCastQuery
     * @param inputShapeResult contact point on input shape, in input shape space
     * @param hitShapeResult contact point on hit shape, in world space
     */
    shapeCast(query: IPhysicsShapeCastQuery, inputShapeResult: ShapeCastResult, hitShapeResult: ShapeCastResult): void;
    /**
     * Return the collision observable for a particular physics body.
     * @param body the physics body
     * @returns the collision observable for the body
     */
    getCollisionObservable(body: PhysicsBody): Observable<IPhysicsCollisionEvent>;
    /**
     * Return the collision ended observable for a particular physics body.
     * @param body the physics body
     * @returns
     */
    getCollisionEndedObservable(body: PhysicsBody): Observable<IBasePhysicsCollisionEvent>;
    /**
     * Enable collision to be reported for a body when a callback is setup on the world
     * @param body the physics body
     * @param enabled whether to enable or disable collision events
     */
    setCollisionCallbackEnabled(body: PhysicsBody, enabled: boolean): void;
    /**
     * Enable collision ended to be reported for a body when a callback is setup on the world
     * @param body the physics body
     * @param enabled whether to enable or disable collision ended events
     */
    setCollisionEndedCallbackEnabled(body: PhysicsBody, enabled: boolean): void;
    private _notifyTriggers;
    /**
     * Runs thru all detected collisions and filter by body
     */
    private _notifyCollisions;
    /**
     * Gets the number of bodies in the world
     */
    get numBodies(): any;
    /**
     * Dispose the world and free resources
     */
    dispose(): void;
    private _v3ToBvecRef;
    private _bVecToV3;
    private _bQuatToV4;
    private _constraintMotorTypeToNative;
    private _nativeToMotorType;
    private _materialCombineToNative;
    private _nativeToMaterialCombine;
    private _constraintAxisToNative;
    private _nativeToLimitMode;
    private _limitModeToNative;
    private _nativeCollisionValueToCollisionType;
    private _nativeTriggerCollisionValueToCollisionType;
}
export {};
