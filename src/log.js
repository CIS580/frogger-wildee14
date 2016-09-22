"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Log class
 */
module.exports = exports = Log;

/**
 * @constructor Log
 * Creates a new Log object
 * @param {Postition} position object specifying an x and y
 */
function Log(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.movementY = 0;
  this.movementX = 0;
  this.width  = 250;
  this.height = 250;
  this.showWidth  = this.width/2 ;
  this.showHeight = this.height/2 ;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/lilypad.png');
  this.timer = 0;
}



/**
 * @function updates the Log object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Log.prototype.update = function(time) {
  if(this.y<=480) this.y = this.y + 2;
  else this.y = -20;

}

/**
 * @function renders the Log into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Log.prototype.render = function(time, ctx) {
      ctx.drawImage(
        // image
        this.spritesheet,
        // destination rectangle
        this.x, this.y, this.showWidth, this.showHeight
      );

}
