class Character extends MovableObject {
  y = 35;
  height = 300;
  width = 140;
  speed = 6;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_SLEEP = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  
  IMAGES_LONG_SLEEP = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  constructor(world) {
   super()
   this.world = world; 
   this.lastMoved = new Date().getTime();
   this.loadInitialImage();
   this.loadAllImages();
   this.applyGravity();
   this.animate();
  }


/**
 * Loads the initial image for the character.
 */
loadInitialImage() {
  this.loadImage("img/2_character_pepe/2_walk/W-21.png");
}


/**
 * Loads all images needed for character animations.
 */
loadAllImages() {
  this.loadImages(this.IMAGES_WALKING);
  this.loadImages(this.IMAGES_JUMPING);
  this.loadImages(this.IMAGES_DEAD);
  this.loadImages(this.IMAGES_HURT);
  this.loadImages(this.IMAGES_SLEEP);
  this.loadImages(this.IMAGES_LONG_SLEEP);
}


/**
 * Animates various character movements and states.
 */
animate() {
  this.animateMovement();
  this.animateSleep();
  this.animateLongSleep();
  this.animateHurt();
  this.animateJump();
  this.animateWalk();
}
    

/**
 * Animates basic movement like walking and jumping.
 */
animateMovement() {
  const intervalId = setInterval(() => {
    if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
      this.pauseSound(this.world.audioManager.walking_sound);
    }
    this.handleRightMovement();
    this.handleLeftMovement();
    this.handleJump();
    this.updateCameraPosition();
  }, 1000 / 60);
  this.world.addInterval(intervalId);
}


/**
 * Handles character movement to the right.
 */
handleRightMovement() {
  if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
    this.moveRight();
    this.otherDirection = false;
    this.playSound(this.world.audioManager.walking_sound);
    this.sleepAnimationPlayed = false;
  }
}


/**
 * Handles character movement to the left.
 */
handleLeftMovement() {
  if (this.world.keyboard.LEFT && this.x > -100) {
    this.moveLeft();
    this.otherDirection = true;
    this.playSound(this.world.audioManager.walking_sound);
    this.sleepAnimationPlayed = false;
  }
}


/**
 * Handles character jumping.
 */
handleJump() {
  if (this.world.keyboard.SPACE && !this.isAboveGround()) {
    this.jump();
    this.playSound(this.world.audioManager.jumpSound);
    this.sleepAnimationPlayed = false;
  }
}


/**
 * Updates the camera position based on the character's position.
 */
updateCameraPosition() {
  this.world.camera_x = -this.x + 100;
}


/**
 * Animates the character's death state.
 */
animateDead() {
  this.deadAnimationInterval = setInterval(() => {
    this.playAnimation(this.IMAGES_DEAD);
  }, 100);

  setTimeout(() => {
    clearInterval(this.deadAnimationInterval);
  }, 3000);
}


/**
 * Animates the character's sleeping state.
 */
animateSleep() {
  let sleepAnimationIndex = 0;
  const intervalId = setInterval(() => {
    if (this.isSleep()) {
      if (!this.sleepAnimationPlayed) {
        let path = this.IMAGES_SLEEP[sleepAnimationIndex];
        this.img = this.imageCache[path];
        sleepAnimationIndex++;
        if (sleepAnimationIndex >= this.IMAGES_SLEEP.length) {
          this.sleepAnimationPlayed = true;
          sleepAnimationIndex = 0;
        }
      }
    } else {
      sleepAnimationIndex = 0;
    }
  }, 400);
  this.world.addInterval(intervalId);
}


/**
 * Animates the character's long sleep state.
 */
animateLongSleep() {
  const intervalId = setInterval(() => {
    if (this.isSleep() && this.sleepAnimationPlayed) {
      this.playAnimation(this.IMAGES_LONG_SLEEP);
      this.playSound(this.world.audioManager.snoreSound);
    } else {
      this.pauseSound(this.world.audioManager.snoreSound);
    }
  }, 200);
  this.world.addInterval(intervalId);
}


/**
 * Animates the character's hurt state.
 */
animateHurt() {
  const intervalId = setInterval(() => {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.sleepAnimationPlayed = false;
    }
  }, 100);
  this.world.addInterval(intervalId);
}


/**
 * Animates the character's jump state.
 */
animateJump() {
  const intervalId = setInterval(() => {
    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    }
  }, 130);
  this.world.addInterval(intervalId);
}


/**
 * Animates the character's walk state.
 */
animateWalk() {
  const intervalId = setInterval(() => {
    if (
      !this.isDead() &&
      !this.isSleep() &&
      !this.isHurt() &&
      !this.isAboveGround()
    ) {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.loadImage(this.IMAGES_JUMPING[0]);
      }
    }
  }, 80);
  this.world.addInterval(intervalId);
}


/**
 * Applies gravity to the character, simulating falling when not on the ground.
 */
applyGravity() {
  setInterval(() => {
    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;

      if (this.y > 135) {
        this.y = 135;
        this.speedY = 0;
      }
    }
  }, 1000 / 25);
}


/**
 * Handles character being hit, reducing energy and playing a hurt sound.
 */
hit() {
  this.energy -= 20;
  if (this.energy < 0) {
    this.energy = 0;
  } else {
    this.lastHit = new Date().getTime();
    this.world.audioManager.hurtSound.play();
  }
}


/**
 * Initiates a jump for the character, playing a jump sound and setting initial jump parameters.
 */
jump() {
  this.world.audioManager.jumpSound.play();
  this.speedY = 32;
  this.lastMoved = new Date().getTime();
}


/**
 * Makes the character bounce off an enemy or obstacle.
 */
bounceOff() {
  this.speedY = 23;
}


/**
 * Checks if the character is in a hurt state.
 * @returns {boolean} True if the character is hurt, false otherwise.
 */
isHurt() {
  let timePassed = new Date().getTime() - this.lastHit;
  timePassed = timePassed / 1000;
  return timePassed < 1;
}


/**
 * Checks if the character is dead.
 * @returns {boolean} True if the character is dead, false otherwise.
 */
isDead() {
  if (this.energy === 0) {
    if (!this.deadAnimationInterval) {
      this.animateDead();
      this.world.loseGame();
    }
    return true;
  }
  return false;
}


/**
 * Checks if the character is in a sleep state.
 * @returns {boolean} True if the character is in sleep state, false otherwise.
 */
isSleep() {
  if (!this.lastMoved) return false;
  let timePassed = new Date().getTime() - this.lastMoved;
  timePassed = timePassed / 1000;
  return timePassed > 1;
}
}
