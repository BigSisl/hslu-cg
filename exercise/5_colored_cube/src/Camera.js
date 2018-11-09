/// <reference path="runtime.d.ts" />
/// <reference path="runtime.d.ts" />


class Camera {

    constructor() {
        this.modelViewMatrix = mat4.create();
    }

    /**
     * @param { WebGLRenderingContext } gl
     * @param { WebGLUniformLocation } uModelViewMatrix
     **/
    updateCameraPosition(gl, uModelViewMatrix) {
        gl.uniformMatrix4fv(uModelViewMatrix, false, this.modelViewMatrix);
    }

    /**
     * @param { vec3 } position
     * @param { vec3 } target
     * @param { vec3 } up
     **/
    lookAt(position, target, up) {
        mat4.lookAt(
            this.modelViewMatrix,
            position,
            target,
            up
        );
    }
}