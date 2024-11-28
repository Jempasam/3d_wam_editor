import type { Nullable } from "@babylonjs/core/types.js";
import type { Matrix } from "@babylonjs/core/Maths/math.vector.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import type { IAnimatable } from "@babylonjs/core/Animations/animatable.interface.js";
import type { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture.js";
import { PushMaterial } from "@babylonjs/core/Materials/pushMaterial.js";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh.js";
import type { SubMesh } from "@babylonjs/core/Meshes/subMesh.js";
import type { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { Scene } from "@babylonjs/core/scene.js";
import "./fur.fragment";
import "./fur.vertex";
export declare class FurMaterial extends PushMaterial {
    private _diffuseTexture;
    diffuseTexture: BaseTexture;
    private _heightTexture;
    heightTexture: BaseTexture;
    diffuseColor: Color3;
    furLength: number;
    furAngle: number;
    furColor: Color3;
    furOffset: number;
    furSpacing: number;
    furGravity: Vector3;
    furSpeed: number;
    furDensity: number;
    furOcclusion: number;
    furTexture: DynamicTexture;
    private _disableLighting;
    disableLighting: boolean;
    private _maxSimultaneousLights;
    maxSimultaneousLights: number;
    highLevelFur: boolean;
    _meshes: AbstractMesh[];
    private _furTime;
    constructor(name: string, scene?: Scene);
    get furTime(): number;
    set furTime(furTime: number);
    needAlphaBlending(): boolean;
    needAlphaTesting(): boolean;
    getAlphaTestTexture(): Nullable<BaseTexture>;
    updateFur(): void;
    isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean;
    bindForSubMesh(world: Matrix, mesh: Mesh, subMesh: SubMesh): void;
    getAnimatables(): IAnimatable[];
    getActiveTextures(): BaseTexture[];
    hasTexture(texture: BaseTexture): boolean;
    dispose(forceDisposeEffect?: boolean): void;
    clone(name: string): FurMaterial;
    serialize(): any;
    getClassName(): string;
    static Parse(source: any, scene: Scene, rootUrl: string): FurMaterial;
    static GenerateTexture(name: string, scene: Scene): DynamicTexture;
    static FurifyMesh(sourceMesh: Mesh, quality: number): Mesh[];
}