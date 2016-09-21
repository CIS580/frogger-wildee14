"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Enemy class
 */
module.exports = exports = Enemy;

/**
 * @constructor Enemy
 * Creates a new Enemy object
 * @param {Postition} position object specifying an x and y
 */
function Enemy(position, colorNum) {
  this.state = "idle";
  this.colorNum = colorNum;
  this.x = position.x;
  this.y = position.y;
  this.movementY = 0;
  this.movementX = 0;
  this.width  = 245;
  this.height = 350;
  this.showWidth  = this.width / 4;
  this.showHeight = this.height / 4;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/cars_mini.svg');
  this.timer = 0;
}



/**
 * @function updates the Enemy object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Enemy.prototype.update = function(time) {
  if(this.y>=-70) this.y = this.y - 2;
  else this.y = 490;
}

/**
 * @function renders the Enemy into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Enemy.prototype.render = function(time, ctx) {
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        (this.width - 20)*this.colorNum, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.showWidth, this.showHeight
      );

}
