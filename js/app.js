// Enemies our player must avoid
// Takes two values to determine enemy placement and speed
var Enemy = function(y,m) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = y;
    // m is used as a speed modifier for enemy movement
    this.m = m;
};

// Spawns a new enemy with a random speed modifier
// randomly on one off the top three rows
function spawnEnemy() {
  if (allEnemies.length < 5) {
    let rowVals = [65, 142.25, 225];
    allEnemies[allEnemies.length] = new Enemy(rowVals[Math.floor(Math.random() * 3)],Math.floor(Math.random() * 4) + 3);
  }
};

// Runs spawnEnemy at a random time interval
setInterval(spawnEnemy, ((Math.floor(Math.random() * 2) + 1) * 850));
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  setTimeout(this.x += this.m, dt);
  // Checks for collision between player and enemy
  // and updates game if collision takes place
  if (52 > Math.abs(this.x - player.x) && 20 > Math.abs(this.y - player.y)) {
    player.starting();
    player.losses+=1;
    player.streak=0;
    document.getElementById('streakCount').innerHTML = player.streak;
    document.getElementById('loseCount').innerHTML = player.losses;
  }
  // Removes enemy from active pool once it reaches edge of game
  if (this.x > 505) {
    let i = allEnemies.indexOf(this);
    allEnemies.splice(i,1);
  }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function PlayerClass() {
  // Player starting position
  this.starting = function() {
    player.x = 200;
    player.y = 390;
  };
  this.wins = 0;
  this.losses = 0;
  this.streak = 0;
  this.sprite = 'images/char-boy.png';
  // Updates game sprite on click if chosen character is unlocked
  this.changeChar = function(evt){
    if (evt.target.className === 'canClick') {
      player.sprite = 'images/' + evt.target.id + '.png';
    };
  }
  // Sets player back to beginning and updates wins and streaks
  // upon player reaching the water
  this.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
  this.playerSafe = function() {
    player.starting();
    player.wins+=1;
    player.streak+=1;
    document.getElementById('streakCount').innerHTML = player.streak;
    document.getElementById('winCount').innerHTML = player.wins;
    if (player.wins === 10) {
      document.getElementById('char-cat-girl').className = "canClick";
    } else if (player.wins === 15) {
      document.getElementById('char-horn-girl').className = "canClick";
    } else if (player.streak === 20) {
      document.getElementById('char-princess-girl').className = "canClick";
    }
  };
  // Controls player movement, restricts edges and checks for win condition
  this.handleInput = function(input) {
    if (input=='left' && player.x > 0) {
      this.x -= 100;
    } else if (input=='right' && player.x < 400) {
      this.x += 100;
    } else if (input=='up') {
      this.y -= 85;
      if (player.y < 50) {
        this.playerSafe();
      };
    } else if (input=='down' && player.y < 390) {
      this.y += 85;
    };
  }
}

// Array of active enemy list
const allEnemies = [];
const player = new PlayerClass;
player.starting();

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

const charSelect = document.querySelector('.characters');
charSelect.addEventListener('click',player.changeChar);
