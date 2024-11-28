// Do not edit.
import { ShaderStore } from "../../core/Engines/shaderStore.js";
import "../../core/Shaders/ShadersInclude/logDepthDeclaration.js";
import "../../core/Shaders/ShadersInclude/clipPlaneVertexDeclaration.js";
import "../../core/Shaders/ShadersInclude/fogVertexDeclaration.js";
import "../../core/Shaders/ShadersInclude/clipPlaneVertex.js";
import "../../core/Shaders/ShadersInclude/logDepthVertex.js";
import "../../core/Shaders/ShadersInclude/fogVertex.js";
const name = "skyVertexShader";
const shader = `precision highp float;attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
uniform mat4 world;uniform mat4 view;uniform mat4 viewProjection;
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<logDepthDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
gl_Position=viewProjection*world*vec4(position,1.0);vec4 worldPos=world*vec4(position,1.0);vPositionW=vec3(worldPos);
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#ifdef VERTEXCOLOR
vColor=color;
#endif
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const skyVertexShader = { name, shader };
//# sourceMappingURL=sky.vertex.js.map