/// <reference path="runtime.d.ts" />


class Cube {

}

/** @param {WebGLRenderingContext} gl */
Cube.setupVertexBuffer = function(gl) {
    Cube.vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Cube.vertices), gl.STATIC_DRAW);

    Cube.edgeBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.edgeBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Cube.vertexIndexes), gl.STATIC_DRAW);
}

/**
 * @param { WebGLRenderingContext } gl
 * @param { any } aVertexPositionId
 * @param { WebGLUniformLocation } uModelMat
 * @param { WebGLUniformLocation } uColorId
 */
Cube.draw = function(gl, aVertexPositionId, uModelMat, uColorId) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPositionId);

    gl.uniformMatrix3fv(uModelMat, false, Cube.modelMat);
    gl.uniform4f(uColorId, 1, 1, 1, 1);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer);
    gl.drawElements(gl.LINES, 8, gl.UNSIGNED_SHORT, 0);

}

/** @type { WebGLBuffer } */
Cube.vertexBuffer = -1;
/** @type { WebGLBuffer } */
Cube.edgeBuffer = -1;
Cube.modelMat = mat3.create();

/**
 * vertices position
 **/
Cube.vertices = [
    0,0,0,
    0.5,0,0,
    0.5,0.5,0,
];

/**
 * vertices connection
 */
Cube.vertexIndexes = [
    0,1,
    1,2,
    2,0,
];
