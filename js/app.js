// Constants
const CANVAS_WIDTH = 505;
const CANVAS_HEIGHT = 606;
const DANGER_ZONE_LIMIT = 307;
const MIN_EN_SPEED = 50;
const MAX_EN_SPEED = 100;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.xPos = x;
    this.yPos = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.xPos < CANVAS_WIDTH) { // CANVAS_WIDTH = 505

      // console.log("[Testing]: xPos value is ", this.xPos);
      this.xPos = this.xPos + (this.speed * dt);
    }

    else {
      this.xPos = -101;
    }

    if (this.checkCollisions(player.get_xPos(), player.get_yPos())) {

      player.reset();   // Resets the player's position
      game.decrLives(); // Decreases the player's lives
    }
};

// Sets the enemy's speed attribute
Enemy.prototype.setSpeed = function (speed) {

  this.speed = speed;
}

// Sets the enemy's speed attribute choosing randomly between
// min_speed and max_speed
Enemy.prototype.setRndSpeed = function (min_speed, max_speed) {

  var speed = getRndInteger(min_speed, max_speed);
  this.setSpeed(speed);
}

// Check for collision with the enemy
Enemy.prototype.checkCollisions = function (xPos, yPos) {

  var enemy_xPos = this.xPos;
  var enemy_yPos = this.yPos;
  var player_xPos = xPos;
  var player_yPos = yPos;

  // The enemy and the player are on the same row (y position can differ
  // by 2px at most, due to the sprites positioning)
  if( enemy_yPos - player_yPos === 2) {

    // The enemy and the player overlap on the x-axis
    if (player_xPos + 16 < enemy_xPos + 101 && player_xPos + 85 > enemy_xPos) {

      return true;
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xPos, this.yPos);
};

// This class handles all the enemies logic (e.g., spawning)
var Enemies = function(minSpeed = MIN_EN_SPEED, maxSpeed = MAX_EN_SPEED) {

  this.minSpeed = minSpeed;
  this.maxSpeed = maxSpeed;
  this.yPositions = [60, 143, 226];
  this.num = this.yPositions.length;
};

// Resets the enemies speed range
Enemies.prototype.resetSpeed = function () {

  this.minSpeed = MIN_EN_SPEED;
  this.maxSpeed = MAX_EN_SPEED;
};

Enemies.prototype.addEnemies = function () {

  // Cloning 'this.yPositions'
  var yPositions = this.yPositions.slice(0);

  for (var i = 0; i < this.num; i++) {

    var yPos = getRndValue(yPositions, true);
    var speed = getRndInteger(this.minSpeed, this.maxSpeed);

    allEnemies.push(new Enemy(-101, yPos, speed));
  }
};

// This method increments the enemies max speed
Enemies.prototype.incrSpeed = function () {

  this.maxSpeed += (this.maxSpeed * 20/100 * game.level);

  // Prevent 'maxSpeed' to be higher than 1100
  if (this.maxSpeed > 1100) this.maxSpeed = 1100;

  this.updateSpeed();
};

// This method updates the enemies speed
// according to the new range
Enemies.prototype.updateSpeed = function () {

  for (var ind = 0; ind < allEnemies.length; ind++) {

    allEnemies[ind].setRndSpeed(this.minSpeed, this.maxSpeed);
  }
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function (x = 202, y = 390) {

  this.sprite = 'images/char-boy.png';
  this.xPos = x;
  this.yPos = y;
};

Player.prototype.update = function () {

  // See: engine.js
  // canvas.width = 505;
  // canvas.height = 606;

  if (this.yPos > 390) {

    this.yPos = 390;
  }

  if (this.xPos > 404) {

    this.xPos = 404;
  }

  if (this.xPos < 0) {

    this.xPos = 0;
  }

  if(this.checkIfWin()) {

    game.incrLevel(); // To the next level!
    enemies.incrSpeed();
    player.reset(); // Resetting the player's position
  }
};

Player.prototype.render = function () {

  ctx.drawImage(Resources.get(this.sprite), this.xPos, this.yPos);
};

Player.prototype.handleInput = function (key) {

  switch (key) {

    case 'left': this.xPos -= 101;
                 break;

    case 'up': this.yPos -= 83;
               break;

    case 'right': this.xPos += 101;
                  break;

    case 'down': this.yPos += 83;
                 break;

                  // If the player presses the 'space' key, the game pauses
                  // If he presses twice, the game resumes
    case 'pause': game.isPaused = game.isPaused ? false : true;
                  break;

    case 'restart': game.restart();
                    break;
  }
};

Player.prototype.get_xPos = function () {

  return this.xPos;
};

Player.prototype.get_yPos = function () {

  return this.yPos;
};

Player.prototype.reset = function () {

  this.xPos = 202;
  this.yPos = 390;
};

Player.prototype.set_xPos = function (x) {

  this.xPos = x;
};

Player.prototype.set_yPos = function (y) {

  this.xPos = x;
};

Player.prototype.checkIfWin = function () {

  return (this.get_yPos() < 0);
};


// Handles all of the global game logic
var Game = function() {

  this.level = 1;
  this.lives = 5;
  this.score = 0;
  this.bonus = 0;
  this.isPaused = false;
};

// Updates the game status
Game.prototype.update = function() {

    game.showScoreboard(); // Shows the game scoreboard
    game.over(); // Handles the end of the game
}

// Decrements the player's lives
Game.prototype.decrLives = function () {

  this.lives --;
};

// To the next game level!
Game.prototype.incrLevel = function () {

  this.level++;
  this.updBonus();
};

// This method handles the player's score
// When the player moves into the 'danger' zone (i.e., tiles crossed by the
// enemy) its score increments every time he moves without hitting the enemy
Game.prototype.incrScore = function (key) {

  if (key === 'left' || key === 'right' || key === 'up' || key === 'down') {

    if (player.yPos < DANGER_ZONE_LIMIT) this.score += (15 + this.bonus);
  }
};

// Increments the bonus
// The player receives a higher bonus according to the reached level
Game.prototype.updBonus = function () {

  this.bonus = this.level * 10;
};

// Handles the end of the game
// When the game ends, displays a recap screen with the player's
// score and level
Game.prototype.over = function () {

  if (this.lives < 1) {

    game.isPaused = true;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Cleaning the canvas

    // Border?
    // ctx.strokeStyle="#ededed";
    // ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // ctx.font = "bold 3em serif";
    // ctx.fillText("GAME OVER!!!", 75, 180);

    ctx.drawImage(Resources.get('images/game-over.jpg'), 102, 5, 300, 300);

    ctx.fillStyle = "black";
    ctx.font = "bold 1.6em serif";
    ctx.fillText("Your score is: " +this.score, 10, 300);
    ctx.fillText("Best level: " +this.level, 10, 340);
  }
};

// Shows the lives and the level on the game board
Game.prototype.showScoreboard = function () {

  ctx.fillStyle = '#919191';
  ctx.font = "1.5em serif";
  ctx.fillText('Level: ', 5, 30);
  ctx.fillText('Lives: ', 160, 30);
  ctx.fillText('Score: ', 330, 30);

  ctx.font = "1.1em serif";
  ctx.fillText(this.level, 85, 30);
  ctx.fillText(this.lives, 245, 30);
  ctx.fillText(this.score, 420, 30);
};

// Restarts the game (initializes all
// of the game variables and attributes)
Game.prototype.restart = function () {

  this.level = 1;
  this.lives = 5;
  this.score = 0;
  this.bonus = 0;

  player.reset();
  enemies.resetSpeed();
  allEnemies = [];

  enemies.addEnemies();
  this.paused = false;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var enemies = new Enemies();
enemies.addEnemies();

var player = new Player();
var game = new Game();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'pause',
        82: 'restart'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    game.incrScore((allowedKeys[e.keyCode]));
});


// This JavaScript function always returns a random number between min
// (included) and max (excluded)

// https://www.w3schools.com/js/js_random.asp
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

// This JavaScript function returns a random element from the array passed
// to the function. If flag is true, the returned element will be deleted
// from 'ls'
function getRndValue(ls, flag = false) {

  el = ls[Math.floor(Math.random() * ls.length)];

  if (flag) ls.splice(ls.indexOf(el), 1);

  return el;
}
