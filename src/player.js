"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.lives = 3;
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.movementY = 0;
  this.movementX = 0;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite1.png');
  this.timer = 0;
  this.frame = 0;
  /*
    frame setup: 256 x 128
    frame = 0, pixels: x 0 -> 64 , y 128 -> 64  jump
    frame = 1, pixels: x 64 -> 128 , y 128 -> 64 end jump
    frame = 2, pixels: x 128 -> 192 , y 128 -> 64 almost wait
    frame = 3, pixels: x 192 -> 256 , y 128 -> 64 wait
    frame = 4, pixels: x 0 -> 64 , y 64 -> 0 almost almost wink
    frame = 5, pixels: x 64 -> 128 , y 64 -> 0 almost wink
    frame = 6, pixels: x 128 -> 192 , y 64 -> 0 wink
    frame = 7, pixels: x 192 -> 256 , y 64 -> 0   wait
  */


var self = this;

window.onkeydown = function(event) {
  event.preventDefault();

  switch(event.keyCode) {
    case 38:
    case 87:
      self.movementY = -4;
      self.state = "hopping";
      break;

    case 40:
    case 83:
      self.movementY = 4;
      self.state = "hopping";
      break;

    case 37:
    case 65:
      self.movementX = -4;
      self.state = "hopping";
      break;

    case 39:
    case 68:
      self.movementX = 4;
      self.state = "hopping";
      break;

    default:
      self.movementX = 0;
      self.movementY = 0;
      self.state = "idle";
      break;
  }

  self.frame = 0;
}
window.onkeyup = function(event) {
  event.preventDefault();
  self.movementX = 0;
  self.movementY = 0;
  if(self.x>760 || self.x<0 || self.y>480 || self.y<0) self.state = "death";
  else self.state = "idle";
}

}
/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    // TODO: Implement your player's update by state
    case "hopping":
     this.timer+= time;
     if(this.timer > MS_PER_FRAME) {
       this.timer = 0;
       this.frame += 1;
       if(this.frame > 3) this.frame = 0;
     }
     this.x += this.movementX;
     this.y += this.movementY;
     break;

    case "death":
     this.movementX = 0;
     this.movementY = 0;
     this.x = 0;
     this.y = 150;
     this.lives--;
     console.log(this.lives);
     if (this.lives <= 0)
        document.getElementById('score').innerHTML = "Game Over!";
     else document.getElementById('score').innerHTML = "Lives "+ this.lives;
     break
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      this.spritesheet.src = encodeURI('assets/PlayerSprite1.png');
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state
    case "hopping":
      this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
      //image is 256 x 128
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "death":
      this.spritesheet.src = encodeURI('assets/PlayerSprite3.png');
      //image is 256 x 128
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;

  }
}
