attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMat;
uniform mat4 uModelViewMatrix;

varying vec4 vVertexColor;

void main() {
    vec4 projectedPosition = uProjectionMatrix * uModelViewMatrix * uModelMat * vec4(aVertexPosition[0], aVertexPosition[1], aVertexPosition[2], 1);
    gl_Position = projectedPosition;
    vVertexColor = aVertexColor;
}