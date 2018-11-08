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
function setUpBuffers(){
    "use strict";

    Cube.buffer = gl.createBuffer();

    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5
    ];

//    gl.bindBuffer(gl.ARRAY_BUFFER, Cube.buffer);
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {

    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);

}
