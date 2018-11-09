attribute vec3 aVertexPosition;
uniform mat3 uProjectionMatrix;
uniform mat3 uModelMat;

void main() {
    vec3 projectedPosition = uProjectionMatrix * uModelMat * aVertexPosition;
    gl_Position = vec4(vec3(projectedPosition[0], projectedPosition[1], projectedPosition[2]), projectedPosition[2]);
}