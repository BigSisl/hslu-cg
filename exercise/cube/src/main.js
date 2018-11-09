/// <reference path="runtime.d.ts" />

//@ts-check
//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
/** @type { WebGLRenderingContext } */
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    /** @type { WebGLProgram } */
    shaderProgram: -1,
    /** @type { any } */
    aVertexPositionId: -1,
    /** @type { WebGLUniformLocation } */
    uModelMat: -1,
    /** @type { WebGLUniformLocation } */
    uColorId: -1,
    /** @type { WebGLUniformLocation } */
    uProjectionMatrix: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();
    setupWorldCoordinates();
    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatrix = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uModelMat = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

function setupWorldCoordinates() {
    var projectionMatrix = mat3.create();
    mat3.fromScaling(projectionMatrix, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix3fv(ctx.uModelMat, false, mat3.create());
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */

/** @type { WebGLBuffer } */
var buffer = -1;
/** @type { WebGLBuffer } */
var edgeBuffer = -1;
function setUpBuffers(){
    "use strict";

    Cube.setupVertexBuffer(gl);

    var color_vertices_buffer = [
        0.2,0.2,    0, 1, 1, 1,
        0.2,0.5,    0, 1, 1, 1,
        0.5,0.2,    0, 1, 1, 1,
        0.5,0.5,    1, 0, 1, 1,
    ];

    buffer = gl.createBuffer();
    edgeBuffer = gl.createBuffer();

    var vertices = [
        -0.5, -0.5, 1,
        0.5, -0.5, 1,
        0.5, 0.5, 1,
        -0.5, 0.5, 1,
    ];

    var vertices_indexes = [
        0,1,
        1,2,
        2,3,
        3,0,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertices_indexes), gl.STATIC_DRAW);

}

/**
 * Draw the scene.
 */
function draw() {

    mat3.scale(Cube.modelMat, Cube.modelMat, [100,100]);

    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    Cube.draw(gl, ctx.aVertexPositionId, ctx.uModelMat, ctx.uColorId);
}
