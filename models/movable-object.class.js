class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection;
  speedY = 0;
  acceleration = 3.2;
  energy = 100;
  collectedCoins = 0;
  collectedBottles = 0;
  lastHit = 0;
  isEnemyDead;


  /**
   * Animates the object by cycling through the provided images at a specified interval.
   * @param {string[]} images - Array of image paths to animate.
   * @param {number} [interval=700] - Interval between each frame in milliseconds.
   */
  animate(images, interval = 700) {
    this.world.addInterval(setInterval(() => {
      this.playAnimation(images);
    }, interval));
  }


  /**
   * Plays an animation sequence using the provided images array.
   * @param {string[]} images - Array of image paths to animate.
   * @param {boolean} [playOnce=false] - Flag indicating if the animation should play once.
   */
  playAnimation(images, playOnce = false) {
    if (playOnce) {
      this.currentImage = Math.min(this.currentImage, images.length - 1);
    } else {
      this.currentImage = this.currentImage % images.length;
    }
    let path = images[this.currentImage];
    this.img = this.imageCache[path];
    this.currentImage++;
  }


  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
    this.lastMoved = new Date().getTime();
  }


  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
    this.lastMoved = new Date().getTime();
  }


  /**
   * Checks if the object is above the ground level based on its type.
   * @returns {boolean} True if the object is above the ground, false otherwise.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 340;
    } else { // Character
      return this.y < 135;
    }
  }


  /**
   * Checks if the object is jumping on another movable object.
   * @param {MovableObject} mo - The other movable object to check.
   * @returns {boolean} True if the object is jumping on the other object, false otherwise.
   */
  isJumpingOn(mo) {
    return (
      this.speedY < 0 &&
      this.y + this.height >= mo.y &&
      this.y + this.height <= mo.y + mo.height
    );
  }


  /**
   * Checks collision between this object and another movable object.
   * @param {MovableObject} mo - The other movable object to check collision with.
   * @returns {boolean} True if collision occurs, false otherwise.
   */
  isColliding(mo) {
    if (this instanceof Character) {
      return (
        this.x + 25 < mo.x + mo.width &&
        this.x + this.width - 35 > mo.x &&
        this.y + 145 < mo.y + mo.height &&
        this.y + this.height + 13 > mo.y
      );
    } else if (this instanceof Bottle) {
      return (
        this.x + 20 < mo.x + mo.width &&
        this.x + this.width - 30 > mo.x &&
        this.y + 10 < mo.y + mo.height &&
        this.y + this.height - 15 > mo.y
      );
    } else if (this instanceof Coin) {
      return (
        this.x + 40 < mo.x + mo.width &&
        this.x + this.width - 80 > mo.x &&
        this.y + 40 < mo.y + mo.height &&
        this.y + this.height - 80 > mo.y
      );
    } else if (this instanceof Endboss) {
      return (
        this.x + 40 < mo.x + mo.width &&
        this.x + this.width - 50 > mo.x &&
        this.y + 80 < mo.y + mo.height &&
        this.y + this.height - 130 > mo.y
      );
    } else {
      return (
        this.x + 5 < mo.x + mo.width &&
        this.x + this.width - 10 > mo.x &&
        this.y < mo.y + mo.height &&
        this.y + this.height - 10 > mo.y
      );
    }
  }


  /**
   * Increments the coin count.
   */
  incrementCoinCount() {
    this.collectedCoins++;
    if (this.collectedCoins > 5) {
      this.collectedCoins = 5;
    }
  }


  /**
   * Increments the bottle count.
   */
  incrementBottleCount() {
    this.collectedBottles++;
    if (this.collectedBottles > 5) {
      this.collectedBottles = 5;
    }
  }


  /**
   * Checks for collisions between the character and enemies.
   */
  checkEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.world.canCollideWithEnemy && this.isColliding(enemy)) {
        if (!enemy.isEnemyDead) {
          if (this.isJumpingOn(enemy) && !(enemy instanceof Endboss)) {
            enemy.die();
            this.bounceOff();
          } else {
            if (enemy instanceof Endboss) {
              this.energy = 0;
              this.world.healthStatusBar.setPercentage(0);
              this.isDead();
            } else {
              this.hit();
              this.world.healthStatusBar.setPercentage(this.energy);
            }
          }
          this.world.canCollideWithEnemy = false;
          setTimeout(() => {
            this.world.canCollideWithEnemy = true;
          }, 1000);
        }
      }
    });
  }


  /**
   * Checks for collisions between throwable objects and enemies.
   * @param {Array<ThrowableObject>} throwableObjects - The throwable objects to check for collisions.
   * @param {Array<MovableObject>} enemies - The enemies to check for collisions.
   */
  checkThrowableCollisions(throwableObjects, enemies) {
    throwableObjects.forEach((bottle) => {
      if (!bottle.isUsed) {
        enemies.forEach((enemy) => {
          if (bottle.isColliding(enemy)) {
            if (enemy instanceof Endboss) {
              if (enemy.canTakeDamage) {
                enemy.energy -= 20;
                enemy.hurt();
                if (enemy.energy < 0) enemy.energy = 0;
                this.world.updateEndbossStatusBar();
                if (enemy.energy <= 0 && !enemy.isEnemyDead) {
                  enemy.die();
                }
              }
            } else {
              enemy.die();
            }
            bottle.markAsUsed();
          }
        });
      }
    });
  }


  /**
   * Checks for collisions between the character and items.
   * @param {Array<MovableObject>} items - The items to check for collisions.
   */
  checkItemCollisions(items) {
    items.forEach((item, index) => {
      if (this.isColliding(item)) {
        item.handleCollision(this.world, index);
      }
    });
  }

  
  /**
   * Checks if the character is jumping on enemies.
   */
  checkJumpOnEnemies() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.isColliding(enemy) && this.isJumpingOn(enemy)) {
        if (!(enemy instanceof Endboss) && !enemy.isEnemyDead) {
          enemy.die();
          this.bounceOff();
        }
      }
    });
  }

  
  /**
   * Plays the specified sound if it is paused.
   * @param {HTMLAudioElement} sound - The audio element to play.
   */
  playSound(sound) {
    if (sound.paused) {
      sound.play();
    }
  }

  
  /**
   * Pauses the specified sound if it is playing.
   * @param {HTMLAudioElement} sound - The audio element to pause.
   */
  pauseSound(sound) {
    if (!sound.paused) {
      sound.pause(); 
      sound.currentTime = 0; 
    }
  }
}
