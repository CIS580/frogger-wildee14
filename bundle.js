(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const EntityManager = require('./entity.js');
const Enemy = require('./enemy.js')
const Log = require('./log.js');
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240})
var entity = new EntityManager();
var enemy1 = new Enemy({x:150, y: 0},Math.floor(Math.random()*4))
var friendlyLily = new Log({x:343, y:480 })
var enemy3 = new Enemy({x:580, y: 0},Math.floor(Math.random()*4))
var background = new Image();
background.src = encodeURI("assets/background.png");


// entity.add(player);
// entity.add(enemy1);
// entity.add(enemy2);
// entity.add(enemy3);

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  enemy1.update(elapsedTime);
  var check1 = entity.checkForApple(player, enemy1);
  if (check1) player.loseLife();
  enemy3.update(elapsedTime);
  var check3 = entity.checkForApple(player, enemy3);
  if (check3) player.loseLife();
  friendlyLily.update();
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background,0,0);
  enemy1.render(elapsedTime, ctx);
  friendlyLily.render(elapsedTime, ctx);
  enemy3.render(elapsedTime, ctx);
  player.render(elapsedTime, ctx);

}

},{"./enemy.js":2,"./entity.js":3,"./game.js":4,"./log.js":5,"./player.js":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
//Template based off Nathan Bean's lecture notes
"use strict";

module.exports = exports = EntityManager;

function EntityManager() {
  this.entities = [];
}

EntityManager.prototype.add = function(entity) {
 var index = cellIndex(entity);
 this.cells[index].push(entity);
 entity._cell = index;
}

EntityManager.prototype.remove = function(entity) {
  var index = this.entities.indexOf(entity);
  if(index != -1) this.entities.splice(index, 1);
}

EntityManager.prototype.update = function(entity) {
  this.cells.forEach(function(cell) {
    cells.forEach(function(entity){
      entity.update(elapsedTime);
      var index = cellIndex(entity);
      if (index != entity._cell) {
        // Remove from old cell
        var subIndex = this.cells[entity._cell].indexOf(entity);
        if(subIndex != -1) this.cells[entity._cell].splice(subIndex, 1);
        // Place in new cell
        this.cells[index].push(entity);
        entity._cell = index;
      }
    });
  });
}

EntityManager.prototype.render = function(elapsedTime, context, viewport) {
  // Min x range
  var xMin = Math.floor(viewport.x / this.cellSize);
  xMin = (xMin > 0) ? xMin : 0;

  // Max x range
  var xMax = Math.ceil((viewport.x + viewport.width)/this.cellSize) + 1;
  xMax = (xMax < this.widthInCells) ? xMax : this.widthInCells;

  // Min y range
  var yMin = Math.floor(viewport.y / this.cellSize);
  yMin = (yMin > 0) ? yMin : 0;

  // Max y range
  var yMax = Math.ceil((viewport.y + viewport.height)/this.cellSize) + 1;
  yMax = (yMax < this.widthInCells) ? yMax : this.widthInCells;

  // iterate over included cells
  for(var x = xMin; x < xMax; x++) {
    for(var y = yMin; y < yMax; y++) {
      this.cells[y * this.widthInCells + x].forEach(function(entity) {
        entity.render(elapsedTime, context);
      });
    }
  }
}

EntityManager.prototype.testForRectCollision= function(r1, r2) {
  return !( r1.x > r2.x + r2.width ||
            r1.x + r1.width < r2.width ||
            r1.y > r2.y + r2.height ||
            r1.y + r1.height < r2.y
          );
}
EntityManager.prototype.checkForApple = function(r1, r2) {
  if ( ( Math.pow(r1.x - r2.x, 2) +
         Math.pow(r1.y - r2.y, 2)) < 20)
    //Update score
    return true;
  };

function EntityManager(width, height, cellSize) {
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / cellSize);
  this.numberOfCells = this.widthInCells * this.heightInCells;
  this.cells = [];
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function cellIndex(position) {
  var x = Math.floor(position.x / this.cellSize);
  var y = Math.floor(position.y / this.cellSize);
  if(x >= this.widthInCells || y >= this.heightInCells || x < 0 || y < 0)
    return -1;
  else
    return y + this.widthInCells * x;
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
  this.level = 1;
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
  this.frogSprites = [];

  for(var i = 0; i < 4; i++){
    this.frogSprites.push(new Image());
    this.frogSprites[i].src = encodeURI('assets/PlayerSprite' + i + '.png');
  }

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
  else if (self.x >660 && self.x < 760) self.state = "win";
  else self.state = "idle";
}



}

Player.prototype.loseLife = function() {
  this.movementX = 0;
  this.movementY = 0;
  this.x = 2;
  this.y = 150;
  this.lives--;
  console.log(this.lives);
  if (this.lives <= 0)
     document.getElementById('score').innerHTML = "Game Over!";
  else document.getElementById('score').innerHTML =
       "Lives "+ this.lives + " Level: "+ this.level;
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
     if (this.movementX!= 0) this.x += this.movementX*this.level;
     else this.y += this.movementY*this.level;
     break;

    case "death":
     this.loseLife();
     break;

     case "win":
       this.movementX = 0;
       this.movementY = 0;
       this.x = 2;
       this.y = 150;
       document.getElementById('score').innerHTML = "You Win this round";
       this.level++;
       break;
    

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
        this.frame * 64, 0 , this.width, this.height,
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

},{}]},{},[1]);
