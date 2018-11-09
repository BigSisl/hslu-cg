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
    /** @type { any } */
    aVertexColor: -1,
    /** @type { WebGLUniformLocation } */
    uModelMat: -1,
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
    startLoop();
}

function startLoop() {
    loop(getUpdateFunction());
}

function loop(func) {
    window.requestAnimationFrame((timeStamp) => {
        func(timeStamp),
        loop(func);
    });
}

function getUpdateFunction() {
    return (function() {
        let lasttime = 0;
        return function(timeStamp) {
            let deltaTime = timeStamp - lasttime;
            lasttime = timeStamp;
            update(deltaTime, lasttime);
        }
    })();
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexColor = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");

    ctx.uProjectionMatrix = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uModelMat = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
    ctx.uModelViewMatrix = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");

    console.log(ctx);

}

function setupWorldCoordinates() {
    var projectionMatrix = mat4.create();
    setupPerspectiveProjection(projectionMatrix, 100);
    gl.uniformMatrix4fv(ctx.uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(ctx.uModelMat, false, mat4.create());

    var camera = new Camera();

    let pos = vec3.create();
    let up = vec3.create();

    vec3.add(pos, pos, [100, 30, 100]);
    vec3.add(up, [0,1,0], pos);

    camera.lookAt(pos, vec3.create(), up);
    camera.updateCameraPosition(gl, ctx.uModelViewMatrix);

    gl.frontFace ( gl . CCW ) ; // defines how the front face is drawn
    gl.cullFace ( gl . BACK ) ; // defines which face should be culled
    gl.enable ( gl . CULL_FACE ) ; // enables culling
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
/** @param { number? } [deg] */
function setupPerspectiveProjection(projectionMatrix, deg) {
    if(deg == null) {
        mat4.frustum(
            projectionMatrix,
            -gl.drawingBufferWidth/100.0/2.0,
            gl.drawingBufferWidth/100.0/2.0,
            -gl.drawingBufferHeight/100.0/2.0,
            gl.drawingBufferHeight/100.0/2.0,
            5, 400);
    } else {
        let aspect = gl.drawingBufferWidth/gl.drawingBufferHeight;
        mat4.perspective(projectionMatrix, deg * Math.PI / 180, aspect, 1, 400);
    }
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */

let cube = new Cube();

/** @type { WebGLBuffer } */
var buffer = -1;
/** @type { WebGLBuffer } */
var edgeBuffer = -1;
function setUpBuffers(){
    "use strict";

    cube.configureVertexBuffer(gl, new CubeColors(
        [0,1,0,1],
        [1,0,1,1],
        [1,0,0,1],
        [0,0,1,1],
        [1,1,1,1],
        [1,1,0,1]
    ));
    Cube.configureEdgeBuffer(gl);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);

    cube.draw(gl, ctx.aVertexPositionId, ctx.uModelMat, ctx.aVertexColor);
}

/**
 * @param { number } lastTime
 * @param { number } deltaTime
 **/
function update(deltaTime, lastTime) {
    mat4.rotateY(cube.modelMat, cube.modelMat, 0.001 * deltaTime);
    mat4.rotateX(cube.modelMat, cube.modelMat, 0.0005 * deltaTime);
    mat4.rotateZ(cube.modelMat, cube.modelMat, 0.0005 * deltaTime);
    draw();
}
