/// <reference path="runtime.d.ts" />


class Cube {

    constructor() {
        this.modelMat = mat4.create();

        let scale = 100;
        mat4.translate(this.modelMat, this.modelMat, [0,0,0]);
        mat4.scale(this.modelMat, this.modelMat, [scale, scale, scale]);
//        mat4.rotateY(this.modelMat, this.modelMat, -45);
//        mat4.rotateX(this.modelMat, this.modelMat, -45);
    }

    /**
     * @param { WebGLRenderingContext } gl
     * @param { any } aVertexPositionId
     * @param { WebGLUniformLocation } uModelMat
     * @param { WebGLUniformLocation } uColorId
     */
    draw(gl, aVertexPositionId, uModelMat, uColorId) {
        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexBuffer);
        gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPositionId);

        gl.uniformMatrix4fv(uModelMat, false, this.modelMat);
        gl.uniform4f(uColorId, 1, 1, 1, 1);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.edgeBuffer);
        gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);
    }

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

/** @type { WebGLBuffer } */
Cube.vertexBuffer = -1;
/** @type { WebGLBuffer } */
Cube.edgeBuffer = -1;

/**
 * vertices position
 **/
Cube.vertices = [
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5, -0.5,

    -0.5, -0.5, 0.5,
     0.5, -0.5, 0.5,
     0.5,  0.5, 0.5,
    -0.5,  0.5, 0.5,
];

/**
 * vertices connection
 */
Cube.vertexIndexes = [
    0,1,
    1,2,
    2,3,
    3,0,

    0,4,
    1,5,
    2,6,
    3,7,

    4,5,
    5,6,
    6,7,
    7,4,
];
