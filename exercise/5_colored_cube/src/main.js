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
    /** @type { any } */
    aVertexTextureCoord: -1,
    /** @type { WebGLUniformLocation } */
    uModelMat: -1,
    /** @type { WebGLUniformLocation } */
    uProjectionMatrix: -1,
    /** @type { WebGLUniformLocation } */
    uModelViewMatrix: -1,
    /** @type { WebGLUniformLocation } */
    uTextureEnabled: -1,
    /** @type { WebGLUniformLocation } */
    uSampler2DId: -1,
};

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexColor = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexTextureCoord = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");

    ctx.uProjectionMatrix = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uModelMat = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
    ctx.uModelViewMatrix = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uTextureEnabled = gl.getUniformLocation(ctx.shaderProgram, "uTextureEnabled");
    ctx.uSampler2DId = gl.getUniformLocation(ctx.shaderProgram, "uSampler2D");
}

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

    loadTexture("assets/lena512.png")
        .then((tex) => {
            cube2.setTexture(gl, tex);
        });

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

function setupWorldCoordinates() {
    var projectionMatrix = mat4.create();
    setupPerspectiveProjection(projectionMatrix, 60);
    gl.uniformMatrix4fv(ctx.uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(ctx.uModelMat, false, mat4.create());

    var camera = new Camera();

    let pos = vec3.create();
    let up = vec3.create();

    vec3.add(pos, pos, [0, 60, 250]);
    vec3.add(up, [0,1,0], pos);

    camera.lookAt(pos, vec3.create(), up);
    camera.updateCameraPosition(gl, ctx.uModelViewMatrix);

//    gl.frontFace ( gl . CCW ) ; // defines how the front face is drawn
//    gl.cullFace ( gl . BACK ) ; // defines which face should be culled
//    gl.enable ( gl . CULL_FACE ) ; // enables culling
    gl.enable(gl.DEPTH_TEST);
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
            100, 700);
    } else {
        let aspect = gl.drawingBufferWidth/gl.drawingBufferHeight;
        mat4.perspective(projectionMatrix, deg * Math.PI / 180, aspect, 1, 400);
    }
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */

let cube1 = new Cube([-70,0,0]);
let cube2 = new Cube([70,0,0]);

/** @type { WebGLBuffer } */
var buffer = -1;
/** @type { WebGLBuffer } */
var edgeBuffer = -1;
function setUpBuffers(){
    "use strict";

    cube1.configureVertexBuffer(gl, new CubeColors(
        [0,1,0,1],
        [1,0,1,1],
        [1,0,0,1],
        [0,0,1,1],
        [1,1,1,1],
        [1,1,0,1]
    ));
    cube2.configureVertexBuffer(gl, new CubeColors(
        [.4,0,1,1],
        [.6,.2,1,1],
        [.8,1,0,1],
        [0,.6,1,1],
        [1,1,.2,1],
        [1,.5,.3,1]
    ));

    Cube.configureEdgeBuffer(gl);
}

/**
 * @param { string } src
 * @returns { Promise }
 **/
function loadTexture(src) {
    let image = new Image();
    // create a texture object
    let textureObj = gl.createTexture();

    let promise = new Promise((resolve, reject) => {
        image.onload = function() {
            resolve(new Texture(gl, image, textureObj));
        };
    });
    // setting the src will trigger onload
    image.src = src;
    return promise;
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    cube1.draw(gl,
        ctx.aVertexPositionId,
        ctx.uModelMat,
        ctx.uTextureEnabled,
        ctx.aVertexColor,
        ctx.aVertexTextureCoord
    );
    cube2.draw(gl,
        ctx.aVertexPositionId,
        ctx.uModelMat,
        ctx.uTextureEnabled,
        ctx.aVertexColor,
        ctx.aVertexTextureCoord
    );
}

/**
 * @param { number } lastTime
 * @param { number } deltaTime
 **/
function update(deltaTime, lastTime) {
    cube1.rotate(0.1 * deltaTime, [1,1,0]);
    cube1.rotate(0.05 * deltaTime, [0,0,1]);

    cube2.rotate(0.1 * deltaTime, [1,0.5,0.3]);

    draw();
}
