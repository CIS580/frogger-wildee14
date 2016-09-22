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
         Math.pow(r1.y - r2.y, 2)) < 200)
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
