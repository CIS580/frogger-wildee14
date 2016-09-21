"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const EntityManager = require('./entity.js');
const Enemy = require('./enemy.js')
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240})
var entity = new EntityManager();
var enemy1 = new Enemy({x:150, y: 0},1)
var enemy2 = new Enemy({x:380, y: 0},2)
var enemy3 = new Enemy({x:580, y: 0},3)
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
  enemy2.update(elapsedTime);
  enemy3.update(elapsedTime);
  // TODO: Update the game objects
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
  enemy2.render(elapsedTime, ctx);
  enemy3.render(elapsedTime, ctx);
  player.render(elapsedTime, ctx);

}
