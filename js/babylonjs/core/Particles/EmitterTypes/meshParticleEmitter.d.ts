import type { Matrix } from "../../Maths/math.vector";
import { Vector3 } from "../../Maths/math.vector";
import type { Particle } from "../particle";
import type { IParticleEmitterType } from "./IParticleEmitterType";
import type { Nullable } from "../../types";
import type { Scene } from "../../scene";
import type { AbstractMesh } from "../../Meshes/abstractMesh";
import type { UniformBufferEffectCommonAccessor } from "../../Materials/uniformBufferEffectCommonAccessor";
import type { UniformBuffer } from "../../Materials/uniformBuffer";
/**
 * Particle emitter emitting particles from the inside of a box.
 * It emits the particles randomly between 2 given directions.
 */
export declare class MeshParticleEmitter implements IParticleEmitterType {
    private _indices;
    private _positions;
    private _normals;
    private _storedNormal;
    private _mesh;
    /**
     * Random direction of each particle after it has been emitted, between direction1 and direction2 vectors.
     */
    direction1: Vector3;
    /**
     * Random direction of each particle after it has been emitted, between direction1 and direction2 vectors.
     */
    direction2: Vector3;
    /**
     * Gets or sets a boolean indicating that particle directions must be built from mesh face normals
     */
    useMeshNormalsForDirection: boolean;
    /** Defines the mesh to use as source */
    get mesh(): Nullable<AbstractMesh>;
    set mesh(value: Nullable<AbstractMesh>);
    /**
     * Creates a new instance MeshParticleEmitter
     * @param mesh defines the mesh to use as source
     */
    constructor(mesh?: Nullable<AbstractMesh>);
    /**
     * Called by the particle System when the direction is computed for the created particle.
     * @param worldMatrix is the world matrix of the particle system
     * @param directionToUpdate is the direction vector to update with the result
     * @param particle is the particle we are computed the direction for
     * @param isLocal defines if the direction should be set in local space
     */
    startDirectionFunction(worldMatrix: Matrix, directionToUpdate: Vector3, particle: Particle, isLocal: boolean): void;
    /**
     * Called by the particle System when the position is computed for the created particle.
     * @param worldMatrix is the world matrix of the particle system
     * @param positionToUpdate is the position vector to update with the result
     * @param particle is the particle we are computed the position for
     * @param isLocal defines if the position should be set in local space
     */
    startPositionFunction(worldMatrix: Matrix, positionToUpdate: Vector3, particle: Particle, isLocal: boolean): void;
    /**
     * Clones the current emitter and returns a copy of it
     * @returns the new emitter
     */
    clone(): MeshParticleEmitter;
    /**
     * Called by the GPUParticleSystem to setup the update shader
     * @param uboOrEffect defines the update shader
     */
    applyToShader(uboOrEffect: UniformBufferEffectCommonAccessor): void;
    /**
     * Creates the structure of the ubo for this particle emitter
     * @param ubo ubo to create the structure for
     */
    buildUniformLayout(ubo: UniformBuffer): void;
    /**
     * Returns a string to use to update the GPU particles update shader
     * @returns a string containing the defines string
     */
    getEffectDefines(): string;
    /**
     * Returns the string "BoxParticleEmitter"
     * @returns a string containing the class name
     */
    getClassName(): string;
    /**
     * Serializes the particle system to a JSON object.
     * @returns the JSON object
     */
    serialize(): any;
    /**
     * Parse properties from a JSON object
     * @param serializationObject defines the JSON object
     * @param scene defines the hosting scene
     */
    parse(serializationObject: any, scene: Nullable<Scene>): void;
}
