class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  maxEnergy = 100;
  energy = this.maxEnergy;
  hitCount = 0;
  walking = false;
  walkingSpeed = 3;
  canTakeDamage = false;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super();
    this.loadInitialImage();
    this.loadAllImages();
    this.x = 3500;
  }


  /**
   * Loads the initial image for the Endboss.
   */
  loadInitialImage() {
    this.loadImage(this.IMAGES_ALERT[0]);
  }


  /**
   * Loads all images required for Endboss animations.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }


  /**
   * Starts the alert animation.
   */
  animateAlert() {
    this.startAnimation(this.IMAGES_ALERT, 200);
  }


  /**
   * Starts the walking animation.
   */
  startWalking() {
    if (this.walking || this.isEnemyDead) return;
    this.walking = true;
    this.clearIntervals();
    this.startAnimation(this.IMAGES_WALKING, 130);
    this.walkingInterval = setInterval(() => {
      this.x -= this.walkingSpeed;
    }, 1000 / 60);
    this.world.addInterval(this.walkingInterval);
  }


   /**
   * Starts the attack animation.
   */
  startAttackAnimation() {
    if (this.attackAnimationInterval || this.isEnemyDead) return;
    this.clearIntervals();
    this.walking = false;
    this.attackAnimationInterval = this.animateSequence(this.IMAGES_ATTACK, 200, () => {
      if (!this.isEnemyDead) this.startWalking();
    });
  }


  /**
   * Starts the hurt animation.
   */
  hurt() {
    if (!this.canTakeDamage || this.hurtAnimationInterval || this.isEnemyDead) return;
    this.clearIntervals();
    this.walking = false;
    this.hurtAnimationInterval = this.animateSequence(this.IMAGES_HURT, 200, () => {
      if (!this.isEnemyDead) {
        this.startWalking();
        this.startAttackAnimation();
      }
    });
  }


  /**
   * Initiates the death sequence.
   */
  die() {
    if (this.isEnemyDead) return;
    this.isEnemyDead = true;
    this.clearIntervals();
    this.animateSequence(this.IMAGES_DEAD, 300, () => {
      this.world.winGame();
    });
  }


  /**
   * Starts an animation with a specified set of images and interval.
   * @param {string[]} images - Array of image paths to animate.
   * @param {number} interval - Interval between each frame in milliseconds.
   */
  startAnimation(images, interval) {
    this.animationInterval = setInterval(() => {
      this.playAnimation(images);
    }, interval);
    this.world.addInterval(this.animationInterval);
  }


  /**
   * Animates a sequence of images with a specified interval and calls a callback function on completion.
   * @param {string[]} images - Array of image paths to animate.
   * @param {number} interval - Interval between each frame in milliseconds.
   * @param {Function} onComplete - Callback function to call when the animation sequence completes.
   * @returns {number} - Interval ID of the animation interval.
   */
  animateSequence(images, interval, onComplete) {
    let i = 0;
    const animationInterval = setInterval(() => {
      if (i < images.length) {
        this.img = this.imageCache[images[i]];
        i++;
      } else {
        clearInterval(animationInterval);
        onComplete();
      }
    }, interval);
    this.world.addInterval(animationInterval);
    return animationInterval;
  }

  
   /**
   * Clears all animation intervals.
   */
  clearIntervals() {
    ['animationInterval', 'walkingInterval', 'attackAnimationInterval', 'hurtAnimationInterval'].forEach(interval => {
      clearInterval(this[interval]);
      this[interval] = null;
    });
  }
}
 