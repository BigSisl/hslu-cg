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
    uProjectionMatrix: -1,
    /** @type { WebGLUniformLocation } */
    uModelViewMatrix: -1,
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
    ctx.uModelViewMatrix = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
}

function setupWorldCoordinates() {
    var projectionMatrix = mat4.create();
    //setupPerspectiveProjection(projectionMatrix);
    setupOrthogonalProjection(projectionMatrix);
    gl.uniformMatrix4fv(ctx.uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(ctx.uModelMat, false, mat4.create());

    var camera = new Camera();

    let pos = vec3.create();
    let up = vec3.create();

    vec3.add(pos, pos, [100, 30, 100]);
    vec3.add(up, [0,1,0], pos);

    camera.lookAt(pos, vec3.create(), up);
    camera.updateCameraPosition(gl, ctx.uModelViewMatrix);
}

/** @param { mat4 } projectionMatrix */
function setupOrthogonalProjection(projectionMatrix) {
    mat4.ortho(
        projectionMatrix,
        -gl.drawingBufferWidth/2.0,
        gl.drawingBufferWidth/2.0,
        -gl.drawingBufferHeight/2.0,
        gl.drawingBufferHeight/2.0,
        0, 400);
}

/** @param { mat4 } projectionMatrix */
function setupPerspectiveProjection(projectionMatrix) {
    mat4.frustum(
        projectionMatrix,
        -gl.drawingBufferWidth/100.0/2.0,
        gl.drawingBufferWidth/100.0/2.0,
        -gl.drawingBufferHeight/100.0/2.0,
        gl.drawingBufferHeight/100.0/2.0,
        5, 100);
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
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    let cube = new Cube();

    gl.clear(gl.COLOR_BUFFER_BIT);

    cube.draw(gl, ctx.aVertexPositionId, ctx.uModelMat, ctx.uColorId);
}

function update() {

}
