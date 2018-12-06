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

var lennaTxt = {
    textureObj: {}
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
    gl.clearColor(1,0,0,1);
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
}

var rectangleObject = {
    color_vertices_buffer: -1,
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.color_vertices_buffer = gl.createBuffer();

    var color_vertices_buffer = [
        0.2,0.2,    0, 1, 1, 1,
        0.2,0.5,    0, 1, 1, 1,
        0.5,0.2,    0, 1, 1, 1,
        0.5,0.5,    1, 0, 1, 1,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.color_vertices_buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_vertices_buffer), gl.STATIC_DRAW)
}

function initTexture(image, textureObj) {
    // create new texture
    gl.bindTexture(gl.TEXTURE_2Dm, textureObj)

    // parameters for texture
    gl.texImage2D(gl .TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST);

}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);
    // add drawing routines here

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.color_vertices_buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 4*6, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}