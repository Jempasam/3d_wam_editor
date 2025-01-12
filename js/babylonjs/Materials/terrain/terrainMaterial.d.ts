import type { Nullable } from "@babylonjs/core/types.js";
import type { Matrix } from "@babylonjs/core/Maths/math.vector.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import type { IAnimatable } from "@babylonjs/core/Animations/animatable.interface.js";
import type { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
import type { Texture } from "@babylonjs/core/Materials/Textures/texture.js";
import { PushMaterial } from "@babylonjs/core/Materials/pushMaterial.js";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh.js";
import type { SubMesh } from "@babylonjs/core/Meshes/subMesh.js";
import type { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { Scene } from "@babylonjs/core/scene.js";
import "./terrain.fragment";
import "./terrain.vertex";
export declare class TerrainMaterial extends PushMaterial {
    private _mixTexture;
    mixTexture: BaseTexture;
    private _diffuseTexture1;
    diffuseTexture1: Texture;
    private _diffuseTexture2;
    diffuseTexture2: Texture;
    private _diffuseTexture3;
    diffuseTexture3: Texture;
    private _bumpTexture1;
    bumpTexture1: Texture;
    private _bumpTexture2;
    bumpTexture2: Texture;
    private _bumpTexture3;
    bumpTexture3: Texture;
    diffuseColor: Color3;
    specularColor: Color3;
    specularPower: number;
    private _disableLighting;
    disableLighting: boolean;
    private _maxSimultaneousLights;
    maxSimultaneousLights: number;
    constructor(name: string, scene?: Scene);
    needAlphaBlending(): boolean;
    needAlphaTesting(): boolean;
    getAlphaTestTexture(): Nullable<BaseTexture>;
    isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean;
    bindForSubMesh(world: Matrix, mesh: Mesh, subMesh: SubMesh): void;
    getAnimatables(): IAnimatable[];
    getActiveTextures(): BaseTexture[];
    hasTexture(texture: BaseTexture): boolean;
    dispose(forceDisposeEffect?: boolean): void;
    clone(name: string): TerrainMaterial;
    serialize(): any;
    getClassName(): string;
    static Parse(source: any, scene: Scene, rootUrl: string): TerrainMaterial;
}
