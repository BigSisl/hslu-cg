/// <reference path="runtime.d.ts" />

class PongGame {

    constructor() {
        this._objects = [];

        this.ball = new Ball(this);
        this.player = new MovablePlayer();
        this.enemy = new AIPlayer(this);

        this._setup();
    }

    _setup() {
        this.addObject(this.ball);
        
        this.player.setRigth();
        this.addObject(this.player);

        this.enemy.setLeft();
        this.addObject(this.enemy);
    }

    start() {
        window.requestAnimationFrame((timeStamp) => {
            this._endFrame = this._startFrame = timeStamp;
            this._loop(timeStamp)
        });
    }

    addObject(gameObject) {
        this._objects.push(gameObject);
    }

    _loop(timeStamp) {
        "use strict";
        this._deltaTime = this._startFrame - this._endFrame;
        this._endFrame = this._startFrame;
        this._startFrame = timeStamp;

        this._runUpdates();
        this._draw();

        window.requestAnimationFrame((timeStamp) => this._loop(timeStamp));
    }

    _runUpdates() {
        this._objects.forEach(o => {
            if(o.update != null) {
                o.update(this._deltaTime);
            }
        });
    }
     

    _draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._objects.forEach(o => {
            if(o.draw != null) {
                o.draw(this._deltaTime);
            }
        });
    }

}