/// <reference path="runtime.d.ts" />

class Texture {
    /**
     * @param { WebGLRenderingContext } gl
     * @param { HTMLImageElement } image
     * @param { WebGLTexture } textureObj
     **/
    constructor(gl, image, textureObj) {
        this._image = image;
        this._textureObj = textureObj;

        this.init(gl);
    }

    init(gl) {
        // create a new texture
        gl.bindTexture(gl.TEXTURE_2D, this._textureObj);

        // set parameters for the texture
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        // turn texture off again
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}