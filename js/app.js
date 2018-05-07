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

    if (this.xPos < 505) {

      // console.log("[Testing]: xPos value is ", this.xPos);
      this.xPos = this.xPos + (this.speed * dt);
    }

    else {
      this.xPos = -101;
    }

    if (this.checkCollisions(player.get_xPos(), player.get_yPos())) player.reset();
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
var Enemies = function(minSpeed = 50, maxSpeed = 100) {

  this.minSpeed = minSpeed;
  this.maxSpeed = maxSpeed;
  this.yPositions = [60, 143, 226];
  this.num = this.yPositions.length;
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

    console.log("Victory!");
    player.reset();
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
}

Player.prototype.set_yPos = function (y) {

  this.xPos = x;
}

Player.prototype.checkIfWin = function () {

  return (this.get_yPos() < 0);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var enemies = new Enemies();
enemies.addEnemies();

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
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
