attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexTextureCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMat;
uniform mat4 uModelViewMatrix;

varying vec4 vVertexColor;
varying vec2 vTextureCoord;

void main() {
    vec4 projectedPosition = uProjectionMatrix * uModelViewMatrix * uModelMat * vec4(aVertexPosition[0], aVertexPosition[1], aVertexPosition[2], 1);
    gl_Position = projectedPosition;
    vVertexColor = aVertexColor;
    vTextureCoord = aVertexTextureCoord;
}