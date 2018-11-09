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

    /** @param { vec3 | number[] } [position] */
    constructor(position) {
        if(position == null) {
            position = [0,0,0];
        }

        this.modelMat = mat4.create();
        /** @type { Texture } */
        this._texture = null;

        let scale = 100;
        mat4.translate(this.modelMat, this.modelMat, position);
        mat4.scale(this.modelMat, this.modelMat, [scale, scale, scale]);
    }

    /**
     *
     * @param { WebGLRenderingContext  } gl
     * @param { Texture } texture
     */
    setTexture(gl, texture) {
        this._texture = texture;
        this.configureVertexBufferWithTex(gl);
    }

    /**
     *
     * @param { number } deg
     * @param { vec3|number[] } axis
     */
    rotate(deg, axis) {
        mat4.rotate(this.modelMat, this.modelMat, this.degToRad(deg), axis);
    }

    degToRad(deg) {
        return Math.PI * deg / 180
    }

    /**
     *
     * @param { WebGLRenderingContext } gl
     * @param { Texture } texture
     */
    configureVertexBufferWithTex(gl) {
        let vertices = [
            // front face
            -0.5, -0.5, 0.5, 0.0, 0.0, //v0
             0.5, -0.5, 0.5, 1.0, 0.0, //v1
             0.5,  0.5, 0.5, 1.0, 1.0, //v2
            -0.5,  0.5, 0.5, 0.0, 1.0, //v3

            // rigth face
             0.5, -0.5,  0.5, 0.0, 0.0, //v4
             0.5, -0.5, -0.5, 1.0, 0.0, //v5
             0.5,  0.5, -0.5, 1.0, 1.0, //v6
             0.5,  0.5,  0.5, 0.0, 1.0, //v7

             // top face
            -0.5,  0.5,  0.5, 0.0, 0.0, //v8
             0.5,  0.5,  0.5, 1.0, 0.0, //v9
             0.5,  0.5, -0.5, 1.0, 1.0, //v10
            -0.5,  0.5, -0.5, 0.0, 1.0, //v11

            // left face
            -.5, -.5, -.5, 0.0, 0.0, // v12
            -.5, -.5, 0.5, 1.0, 0.0, // v13
            -.5, 0.5, 0.5, 1.0, 1.0, // v14
            -.5, 0.5, -.5, 0.0, 1.0, // v15

            // back face
            0.5, -.5, -.5, 0.0, 0.0, // v16
            -.5, -.5, -.5, 1.0, 0.0, // v17
            -.5, 0.5, -.5, 1.0, 1.0, // v18
            0.5, 0.5, -.5, 0.0, 1.0, // v19

            // bottom face
            -.5, -.5, -.5, 0.0, 0.0, // v20
            0.5, -.5, -.5, 1.0, 0.0, // v21
            0.5, -.5, 0.5, 1.0, 1.0, // v22
            -.5, -.5, 0.5, 0.0, 1.0, // v23
        ];
        this._configureVertexBuffer(gl, vertices);
    }

    /**
     * @param { WebGLRenderingContext } gl
     * @param { Array } vertices
     **/
    _configureVertexBuffer(gl, vertices) {
        this.vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

    /**
     * @param { WebGLRenderingContext } gl
     * @param { CubeColors } colors
     **/
    configureVertexBuffer(gl, colors) {
        let vertices = [
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
        this._configureVertexBuffer(gl, vertices);
    }

    /**
     * @param { WebGLRenderingContext } gl
     * @param { any } aVertexPositionId
     * @param { WebGLUniformLocation } uModelMat
     * @param { WebGLUniformLocation } uTextureEnabled
     * @param { any } aVertexColor
     * @param { any } aVertexTextureCoord
     */
    draw(gl, aVertexPositionId, uModelMat, uTextureEnabled, aVertexColor, aVertexTextureCoord) {
        let textureEnabled = this._texture != null;
        let verticesBufferSize = textureEnabled ? 4*5 : 4*7;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, verticesBufferSize, 0);

        gl.enableVertexAttribArray(aVertexPositionId);

        if(textureEnabled) {
            gl.vertexAttribPointer(aVertexTextureCoord, 2, gl.FLOAT, false, verticesBufferSize, 4*3);
            gl.enableVertexAttribArray(aVertexTextureCoord);

            // draw texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._texture._textureObj);
            gl.uniform1i (ctx.uSampler2DId, 0);
        } else {
            // draw color sides
            gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, verticesBufferSize, 4*3);
            gl.enableVertexAttribArray(aVertexColor);
        }

        gl.uniformMatrix4fv(uModelMat, false, this.modelMat);
        gl.uniform1f(uTextureEnabled, textureEnabled);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.edgeBuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}

Cube.edgeBuffer = -1;
Cube.vertexIndexes = -1;

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
    //front
    0,1,3,
    1,2,3,

    // rigth
    4,5,7,
    5,6,7,

    // top
    8,9,11,
    9,10,11,

    // left
    12, 13, 15,
    13, 14, 15,

    16, 17, 18,
    16, 18, 19,

    20, 21, 23,
    21, 22, 23,
];
