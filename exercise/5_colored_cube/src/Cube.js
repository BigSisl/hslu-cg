/// <reference path="runtime.d.ts" />

class CubeColors {
    /**
     *
     * @param { Array<number> } top
     * @param { Array<number> } bottom
     * @param { Array<number> } front
     * @param { Array<number> } back
     * @param { Array<number> } rigth
     * @param { Array<number> } left
     */
    constructor(top, bottom, front, back, rigth, left) {
        this._top = top;
        this._bottom = bottom;
        this._front = front;
        this._back = back;
        this._rigth = rigth;
        this._left = left;
    }

    get Left() {
        return this._left;
    }

    get Rigth() {
        return this._rigth;
    }

    get Top() {
        return this._top;
    }

    get Bottom() {
        return this._bottom;
    }

    get Front() {
        return this._front;
    }

    get Back() {
        return this._back;
    }
}

class Cube {

    constructor() {
        this.modelMat = mat4.create();

        let scale = 100;
        mat4.translate(this.modelMat, this.modelMat, [0,0,0]);
        mat4.scale(this.modelMat, this.modelMat, [scale, scale, scale]);
    }

    /**
     * @param { WebGLRenderingContext } gl
     * @param { CubeColors } colors
     **/
    configureVertexBuffer(gl, colors) {
        this.vertices = [
            // front face
            -0.5, -0.5, 0.5, ...colors.Front, //v0
             0.5, -0.5, 0.5, ...colors.Front, //v1
             0.5,  0.5, 0.5, ...colors.Front, //v2
            -0.5,  0.5, 0.5, ...colors.Front, //v3

            // rigth face
             0.5, -0.5,  0.5, ...colors.Rigth, //v4
             0.5, -0.5, -0.5, ...colors.Rigth, //v5
             0.5,  0.5, -0.5, ...colors.Rigth, //v6
             0.5,  0.5,  0.5, ...colors.Rigth, //v7

             // top face
            -0.5,  0.5,  0.5, ...colors.Top, //v8
             0.5,  0.5,  0.5, ...colors.Top, //v9
             0.5,  0.5, -0.5, ...colors.Top, //v10
            -0.5,  0.5, -0.5, ...colors.Top, //v11

            // left face
            -.5, -.5, -.5, ...colors.Left, // v12
            -.5, -.5, 0.5, ...colors.Left, // v13
            -.5, 0.5, 0.5, ...colors.Left, // v14
            -.5, 0.5, -.5, ...colors.Left, // v15

            // back face
            0.5, -.5, -.5, ...colors.Back, // v16
            -.5, -.5, -.5, ...colors.Back, // v17
            -.5, 0.5, -.5, ...colors.Back, // v18
            0.5, 0.5, -.5, ...colors.Back, // v19

            // bottom face
            -.5, -.5, -.5, ...colors.Bottom, // v20
            0.5, -.5, -.5, ...colors.Bottom, // v21
            0.5, -.5, 0.5, ...colors.Bottom, // v22
            -.5, -.5, 0.5, ...colors.Bottom, // v23
        ]

        this.vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    }

    /**
     * @param { WebGLRenderingContext } gl
     * @param { any } aVertexPositionId
     * @param { WebGLUniformLocation } uModelMat
     * @param { any } aVertexColor
     */
    draw(gl, aVertexPositionId, uModelMat, aVertexColor) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 4*7, 0);

        gl.enableVertexAttribArray(aVertexPositionId);

        gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 4*7, 4*3);
        gl.enableVertexAttribArray(aVertexColor);

        gl.uniformMatrix4fv(uModelMat, false, this.modelMat);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.edgeBuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}

Cube.edgeBuffer = -1;
Cube.vertexIndexes = -1;

/** @param {WebGLRenderingContext} gl */
Cube.configureVertexBuffer = function(gl) {
    Cube.vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Cube.vertices), gl.STATIC_DRAW);
};

/** @param {WebGLRenderingContext} gl */
Cube.configureEdgeBuffer = function(gl) {
    Cube.edgeBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.edgeBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Cube.vertexIndexes), gl.STATIC_DRAW);
};

/**
 * vertices connection
 */
Cube.vertexIndexes = [
    0,1,3,
    1,2,3,

    4,5,7,
    5,6,7,

    8,9,11,
    9,10,11,

    12, 13, 15,
    13, 14, 15,

    16, 17, 18,
    16, 18, 19,

    20, 21, 22,
    20, 22, 23,
];
