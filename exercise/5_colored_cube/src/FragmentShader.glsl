precision mediump float;

uniform bool uTextureEnabled;
uniform sampler2D uSampler;

varying vec4 vVertexColor;
varying vec2 vTextureCoord;

void main() {
    if(uTextureEnabled) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    } else {
        gl_FragColor = vVertexColor;
    }
}