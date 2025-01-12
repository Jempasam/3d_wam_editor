import type { Nullable } from "../../../types";
import type { TextureSampler } from "../../../Materials/Textures/textureSampler";
declare module "../../../Materials/effect" {
    interface Effect {
        /**
         * Sets a sampler on the engine to be used in the shader.
         * @param name Name of the sampler variable.
         * @param sampler Sampler to set.
         */
        setTextureSampler(name: string, sampler: Nullable<TextureSampler>): void;
    }
}
declare module "../../webgpuEngine" {
    interface WebGPUEngine {
        /**
         * Sets a texture sampler to the according uniform.
         * @param name The name of the uniform in the effect
         * @param sampler The sampler to apply
         */
        setTextureSampler(name: string, sampler: Nullable<TextureSampler>): void;
    }
}
