//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aColor: -1,
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
    gl.clearColor(1,0,0,1);

    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aColor = gl.getAttribLocation(ctx.shaderProgram, "aColor");
}

var rectangleObject = {
    buffer: -1,
    color_buffer: -1,
    color_vertices_buffer: -1,
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    rectangleObject.color_buffer = gl.createBuffer();
    rectangleObject.color_vertices_buffer = gl.createBuffer();

    var color_vertices_buffer = [
        0.2,0.2,    0, 1, 1, 1,
        0.2,0.5,    0, 1, 1, 1,
        0.5,0.2,    0, 1, 1, 1,
        0.5,0.5,    1, 0, 1, 1,
        0.0,0.0,    0, 0, 1, 1,
        0.0,-0.4,   0, 1, 0, 1,
        -0.4,0.0,   1, 0, 0, 1
    ];

    var vertices = [
        0.2,0.2,
        0.2,0.5,
        0.5,0.2,
        0.5,0.5,
        0.0,0.0,
        0.0,-0.4,
        -0.4,0.0
    ];
    var color = [
        0, 1, 1, 1,
        0, 1, 1, 1,
        0, 1, 1, 1,
        1, 0, 1, 1,
        0, 0, 1, 1,
        0, 1, 0, 1,
        1, 0, 0, 1
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW)
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);
    // add drawing routines here

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.color_buffer);
    gl.vertexAttribPointer(ctx.aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aColor);

    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

    gl.drawArrays(gl.TRIANGLE_STRIP,4,3);

}