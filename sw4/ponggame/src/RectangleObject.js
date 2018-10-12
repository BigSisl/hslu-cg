/// <reference path="runtime.d.ts" />


var POS = {
    X: 0,
    Y: 1
}

class RectangleObject {

    constructor() {
        this.color = [1, 1, 1, 1];
        this._position = [0,0];
        this._scale = [1,1];
        this._rotation = 0;

        this._transMatrix = mat3.create();
    }

    get position() {
        return this._position;
    }

    move(pos) {
        this.position = [
            this.position[0] + pos[0],
            this.position[1] + pos[1]
        ];
    }

    moveX(x) {
        this.move([x, 0]);
    }

    moveY(y) {
        this.move([0, y]);
    }

    set position(pos) {
        this._position = pos;
        this._updateMatrix();
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = scale;
        this._updateMatrix();
    }

    set rotation(degree) {
        this._rotation = (degree%360) * (Math.PI/180);
        this._updateMatrix();
    }

    _updateMatrix() {
        this._transMatrix = mat3.create();

        mat3.translate(this._transMatrix, this._transMatrix, this._position);
        mat3.rotate(this._transMatrix, this._transMatrix, this._rotation);
        mat3.scale(this._transMatrix, this._transMatrix, this._scale);
    }

    draw() {
        gl.bindBuffer(gl.ARRAY_BUFFER, RectangleObject.buffer);
        gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexPositionId);

        gl.uniformMatrix3fv(ctx.uModelMat, false, this._transMatrix);
        gl.uniform4f(ctx.uColorId, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}

class Player extends RectangleObject {
    constructor() {
        super();
        this.scale = [8,50];
        this.speed = 0.3;
    }

    setLeft() {
        this.position = [
            -this._getBorderPosition(),
            0
        ]
    }

    setRigth() {
        this.position = [
            this._getBorderPosition(),
            0
        ]
    }

    _getTopBorder() {
        return gl.drawingBufferHeight/2 - this.scale[1]/2;
    }

    _getBottomBorder() {
        return -this._getTopBorder();
    }

    moveUp(deltaTime) {
        var y = this.position[1] + (deltaTime * this.speed);
        y = y < this._getTopBorder() ? y : this._getTopBorder();
        this.position = [this.position[POS.X], y];
    }

    moveDown(deltaTime) {
        var y = this.position[1] - (deltaTime * this.speed)
        y = y > this._getBottomBorder() ? y : this._getBottomBorder();
        this.position = [this.position[POS.X], y];
    }

    _getBorderPosition() {
        var space = 7;
        return (((gl.drawingBufferWidth/2) - (this.scale[0]/2)) - space)
    }

    update(deltaTime) { 
        
    }
}

class MovablePlayer extends Player {
    update(deltaTime) {
        if(isDown(key.UP)) {
            this.moveUp(deltaTime);
        }
        if(isDown(key.DOWN)) {
            this.moveDown(deltaTime);
        }
    }
}

class AIPlayer extends Player {
    constructor(game) {
        super();
        this._game = game;
    }

    update(deltaTime) {
        var posY = this._game.ball.position[POS.Y];
        if(this._game.ball.position[POS.Y] > this._getTopBorder()) {
            posY = this._getTopBorder();
        } else if(this._game.ball.position[POS.Y] < this._getBottomBorder()) {
            posY = this._getBottomBorder();
        }
        this.position = [
            this.position[POS.X],
            posY
        ]
    }
}

class Ball extends RectangleObject {
    constructor(game) {
        super();
        this.scale = [5,5];
        this.velocity = [-3, 3];
        this._spawn();
        this.game = game;
    }

    _spawn() {
        this.position = [0,0];
    }

    _change(pos) {
        this.velocity[pos] = -this.velocity[pos];
    }

    update(deltaTime) {
        this.move([
            this.velocity[POS.X],
            this.velocity[POS.Y]
        ])
        if(this._hasHitTopOrBottomWall()) {
            this._change(POS.Y);
        }
        if(this._hasHitBackWall()) {
            this._spawn();
            this._change(POS.X);
        }
        if(this._collidedWithPlayer()) {
            this._change(POS.X);
        }
    }

    _hasHitTopOrBottomWall() {
        var halfway = gl.drawingBufferHeight/2 - this.scale[POS.Y]/2
        return this.position[POS.Y] >= halfway ||
            this.position[POS.Y] <= -halfway
    }

    _hasHitBackWall() {
        var halfway = gl.drawingBufferWidth/2 - this.scale[POS.X]/2
        return this.position[POS.X] >= halfway ||
            this.position[POS.X] <= -halfway;
    }

    _collidedWithPlayer() {
        return this._hasHitPlayer(this.game.player) ||
            this._hasHitPlayer(this.game.enemy)
    }

    _hasHitPlayer(player) {
        return this._isInRectangle(POS.X, player) && this._isInRectangle(POS.Y, player);
    }

    _isInRectangle(axis, object) {
        var size = object.scale[axis]/2;
        return (this.position[axis] - this.scale[axis]/2) < (object.position[axis] + size) &&
            (this.position[axis] + this.scale[axis]/2) > (object.position[axis] - size);
    }
}

/** @type { WebGLBuffer } */
RectangleObject.buffer = -1;
RectangleObject.modelMat = mat3.create();