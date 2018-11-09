import * as glmatrix from "gl-matrix";

declare global {
    export class mat2 extends glmatrix.mat2 { }

    export class mat3 extends glmatrix.mat3 { }
    export class vec3 extends glmatrix.vec3 { }

    export class mat4 extends glmatrix.mat4 { }
    export class vec4 extends glmatrix.vec4 { }
}

interface GameObject {
    draw()
    update()
}
