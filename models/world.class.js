class World {
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  bottleStatusBar = new StatusBar(StatusBar.BOTTLE_IMAGES, 10, 0);
  healthStatusBar = new StatusBar(StatusBar.HEALTH_IMAGES, 10, 35);
  coinStatusBar = new StatusBar(StatusBar.COIN_IMAGES, 10, 70);
  endbossStatusBar = new StatusBar(StatusBar.ENDBOSS_IMAGES, 540, 10);
  throwableObjects = [];
  canCollideWithEnemy = true;
  audioManager = new AudioManager();
  lastThrowTime = 0;
  allIntervals = [];
  character;
  gameOver = false;
  gameWon = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character(this);
    this.audioManager = new AudioManager();
    this.setupGame();
  }

  
/**
 * Sets up the game by initializing the drawing loop, setting the world context, running the game logic,
 * and playing the background music.
 */
setupGame() {
  this.draw();
  this.setWorld();
  this.run();
  this.audioManager.playBackgroundMusic();
}
  

/**
 * Draws all game objects on the canvas. Clears the canvas and draws background objects,
 * the character, enemies, items, clouds, status bars, and throwable objects. 
 * The method uses `requestAnimationFrame` for continuous drawing.
 */
draw() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.translate(this.camera_x, 0);
  this.drawObjects(this.level.backgroundObjects);
  this.addToMap(this.character);
  this.drawObjects(this.level.enemies);
  this.drawObjects(this.level.items);
  this.drawObjects(this.level.clouds);
  this.ctx.translate(-this.camera_x, 0);
  this.addToMap(this.bottleStatusBar);
  this.addToMap(this.healthStatusBar);
  this.addToMap(this.coinStatusBar);
  this.addToMap(this.endbossStatusBar);
  this.ctx.translate(this.camera_x, 0);
  this.throwableObjects.forEach((obj) => {
    this.addToMap(obj);
  });
  this.ctx.translate(-this.camera_x, 0);
  requestAnimationFrame(() => {
    this.draw();
  });
}
  

/**
 * Sets the world context for the character and animates enemies, clouds, and items.
 */
setWorld() {
  this.character.world = this;
  this.animateEnemies();
  this.animateClouds();
  this.animateItems();
}
  

/**
 * Animates all enemies in the game. Sets the world context for each enemy and starts the appropriate animation.
 * Chickens and baby chickens are animated differently from the endboss.
 */
animateEnemies() {
  this.level.enemies.forEach((enemy) => {
    enemy.world = this;
    if (enemy instanceof Chicken || enemy instanceof BabyChicken) {
      enemy.animate();
    } else if (enemy instanceof Endboss) {
      enemy.animateAlert();
    }
  });
}
  

/**
 * Animates all clouds in the game. Sets the world context for each cloud and starts the animation.
 */
animateClouds() {
  this.level.clouds.forEach((cloud) => {
    cloud.world = this;
    cloud.animate();
  });
}
  

/**
 * Animates all items in the game. Sets the world context for each item and starts the animation
 * if the item is a coin or a bottle.
 */
animateItems() {
  this.level.items.forEach((item) => {
    item.world = this;
    if (item instanceof Coin || item instanceof Bottle) {
      item.animate();
    }
  });
}
  

/**
 * Starts the main game logic by initiating collision checking, action checking, and endboss animation.
 */
run() {
  this.startCollisionChecking();
  this.startActionChecking();
  this.startEndbossAnimation();
}


/**
 * Starts the interval for checking various collisions in the game such as enemy collisions, throwable collisions,
 * jump on enemies, and item collisions.
 */
startCollisionChecking() {
  this.allIntervals.push(setInterval(() => {
    this.character.checkEnemyCollisions();
    this.character.checkThrowableCollisions(this.throwableObjects, this.level.enemies);
    this.character.checkJumpOnEnemies();
    this.character.checkItemCollisions(this.level.items);
  }, 40));
}

  
/**
 * Starts the interval for checking player actions such as throwing objects and starting the endboss walking animation.
 */
startActionChecking() {
  this.allIntervals.push(setInterval(() => {
    this.checkThrowObjects();
    this.checkEndbossStartWalking();
  }, 200));
}
  

/**
 * Starts the interval for animating the endboss if it is walking and not already attacking.
 */
startEndbossAnimation() {
  this.allIntervals.push(setInterval(() => {
    const endboss = this.level.enemies.find(
      (enemy) => enemy instanceof Endboss
    );
    if (endboss && endboss.walking && !endboss.attackAnimationInterval) {
      endboss.startAttackAnimation();
    }
  }, 6000));
}
  

/**
 * Checks if the character has reached a specific position to start the endboss walking animation.
 * If conditions are met, the endboss starts walking, can take damage, and the endboss music starts playing.
 */
checkEndbossStartWalking() {
  if (this.character.x >= 3150) {
    const endboss = this.level.enemies.find(
      (enemy) => enemy instanceof Endboss
    );
    if (endboss && !endboss.walking) {
      endboss.startWalking();
      endboss.canTakeDamage = true;
      this.audioManager.switchToEndbossMusic();
    }
  }
}
  

/**
 * Checks if the player has thrown an object. If the player has pressed the 'D' key, has collected bottles, 
 * and enough time has passed since the last throw, a new throwable object (bottle) is created and added to the game.
 */
checkThrowObjects() {
  const allBottlesSplashed = this.throwableObjects.every(bottle => bottle.hasSplashed);
  if (
    this.keyboard.D &&
    this.character.collectedBottles > 0 &&
    allBottlesSplashed
  ) {
    let bottleDirection = this.character.otherDirection ? "left" : "right";
    let bottle = new ThrowableObject(
      this.character.x + (bottleDirection === "right" ? 100 : -40),
      this.character.y + 100,
      bottleDirection
    );
    this.throwableObjects.push(bottle);
    let bottlePercentage = (this.character.collectedBottles / 6) * 100;
    this.character.collectedBottles--;
    this.bottleStatusBar.setPercentage(bottlePercentage);
    this.character.sleepAnimationPlayed = false;
  }
}


/**
 * Updates the endboss's status bar with the current health percentage.
 */
updateEndbossStatusBar() {
  let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
  if (endboss) {
    let endbossHealthPercentage = (endboss.energy / endboss.maxEnergy) * 100;
    this.endbossStatusBar.setPercentage(endbossHealthPercentage);
  }
}


/**
 * Adds a throwable object to the game world.
 * @param {ThrowableObject} throwableObject - The throwable object to be added.
 */
addThrowableObject(throwableObject) {
  throwableObject.world = this;
  this.throwableObjects.push(throwableObject);
}
  

/**
 * Removes an object from the game world.
 * @param {Object} object - The object to be removed.
 */
removeObject(object) {
  const index = this.throwableObjects.indexOf(object);
  if (index > -1) {
    this.throwableObjects.splice(index, 1);
  }
}


/**
 * Handles the collision between the character and an enemy. Sets the character's energy to 0, marks the character as dead, updates the health status bar, and starts the endboss attack animation if the endboss is not dead.
 */
handleEnemyCollision() {
  this.character.energy = 0;
  this.character.isDead();
  this.healthStatusBar.setPercentage(this.character.energy);
  const endboss = this.level.enemies.find(
    (enemy) => enemy instanceof Endboss
  );
  if (endboss && !endboss.isDead) {
    endboss.startAttackAnimation();
  }
}


/**
 * Adds a movable object to the map, drawing it on the canvas. Flips the image horizontally if the object is facing the other direction.
 * @param {MovableObject} mo - The movable object to add to the map.
 */
addToMap(mo) {
  if (mo.otherDirection) {
    this.flipImage(mo);
  }
  mo.draw(this.ctx);
  if (mo.otherDirection) {
    this.flipImageBack(mo);
  }
}


/**
 * Flips the image of a movable object horizontally.
 * @param {MovableObject} mo - The movable object whose image is to be flipped.
 */
flipImage(mo) {
  this.ctx.save();
  this.ctx.translate(mo.width, 0);
  this.ctx.scale(-1, 1);
  mo.x = mo.x * -1;
}


/**
 * Restores the image of a movable object to its original orientation after being flipped horizontally.
 * @param {MovableObject} mo - The movable object whose image is to be restored.
 */
flipImageBack(mo) {
  mo.x = mo.x * -1;
  this.ctx.restore();
}


/**
 * Draws an array of objects on the canvas.
 * @param {Array<MovableObject>} objects - The array of objects to draw.
 */
drawObjects(objects) {
  objects.forEach((obj) => {
    this.addToMap(obj);
  });
}


/**
 * Marks the game as won, clears all intervals, and shows the game end screen with the winning image and sound.
 */
winGame() {
  if (!this.gameWon) {
    this.gameWon = true;
    this.clearAllIntervals();
    this.showGameEndScreen("win-img", this.audioManager.winSound);
  }
}


/**
 * Marks the game as lost, clears all intervals, and shows the game end screen with the game over image and sound.
 */
loseGame() {
  if (!this.gameOver) {
    this.gameOver = true;
    this.clearAllIntervals();
    setTimeout(() => {
      this.showGameEndScreen("game-over-img", this.audioManager.gameOverSound);
    }, 1000);
  }
}


/**
 * Displays the game end screen with the specified image and sound, mutes all other sounds, and plays the specified sound.
 * @param {string} id - The ID of the HTML element to display.
 * @param {HTMLAudioElement} sound - The sound to play.
 */
showGameEndScreen(id, sound) {
  document.getElementById(id).style.display = "flex";
  document.getElementById("sound-btn").style.display = "none";
  document.getElementById("mute-btn").style.display = "none";
  document.getElementById("restart-btn").style.display = "flex";
  document.getElementById("home-btn").style.display = "flex";
  this.audioManager.setAllSoundsMuted(true);
  let isMuted = localStorage.getItem('isMuted') === 'true';
  if (!isMuted) {
    sound.muted = false;
    sound.play();
  }
}


/**
 * Adds an interval ID to the list of intervals to keep track of.
 * @param {number} intervalId - The ID of the interval to add.
 */
addInterval(intervalId) {
  this.allIntervals.push(intervalId);
}


/**
 * Clears all intervals and resets the list of interval IDs.
 */
clearAllIntervals() {
  this.allIntervals.forEach(clearInterval);
  this.allIntervals = [];
}
}
