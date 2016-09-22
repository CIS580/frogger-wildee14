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

  //Check if frog is in water
  if(player.x>340 && player.x < 400){
    if( Math.abs(player.y- friendlyLily.y) > 200 )
      player.loseLife();
  }
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
  if(player.state != "over"){
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background,0,0);
    enemy1.render(elapsedTime, ctx);
    friendlyLily.render(elapsedTime, ctx);
    enemy3.render(elapsedTime, ctx);
    player.render(elapsedTime, ctx);
    ctx.fillText("Level: "+ this.level
                        ,ctx.width*.40, ctx.height*.6);
   }
   else{
     //game is over
     ctx.fillRect(0,0,canvas.width, canvas.height);
     ctx.drawImage(background,0,0);
     ctx.font = "40pt Times New Roman";
     ctx.strokeStyle = "#ffffff";
     ctx.lineWidth = 0.1;
     ctx.fillStyle = "#fff";
     ctx.fillText("Game Over!"
                         ,canvas.width*.35, canvas.height*.4);

    }
}
