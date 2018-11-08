attribute vec2 aVertexPosition;
uniform mat3 uProjectionMatrix;
uniform mat3 uModelMat;

void main() {
    vec3 projectedPosition = uProjectionMatrix * uModelMat * vec3(aVertexPosition, 1);
    gl_Position = vec4(vec2(projectedPosition[0], projectedPosition[1]), 0, projectedPosition[2]);
}