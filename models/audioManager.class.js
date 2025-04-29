class AudioManager {
  constructor() {
    this.bottleSound = new Audio("audio/bottle.mp3");
    this.coinSound = new Audio("audio/coin.mp3");
    this.splashSound = new Audio("audio/splash.mp3");
    this.throwSound = new Audio("audio/spin.mp3");
    this.backgroundMusic = new Audio("audio/background.mp3");
    this.endbossMusic = new Audio("audio/background-endboss.mp3");
    this.gunshotSound = new Audio("audio/gunshot.mp3");
    this.endbossSound = new Audio("audio/endboss.mp3");
    this.winSound = new Audio("audio/win.mp3");
    this.gameOverSound = new Audio("audio/game-over.mp3");
    this.walking_sound = new Audio("audio/running.mp3");
    this.jumpSound = new Audio("audio/jump.mp3");
    this.hurtSound = new Audio("audio/hurt.mp3");
    this.snoreSound = new Audio("audio/snore.mp3");
    this.chickenSound = new Audio("audio/chicken.mp3");
    this.babyChickenSound = new Audio("audio/baby-chicken.mp3");
  }


  /**
   * Plays the background music in a loop.
   */
  playBackgroundMusic() {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play();
  }

  
  /**
   * Switches music to the endboss music, pauses background music,
   * and plays gunshot and endboss sounds.
   */
  switchToEndbossMusic() {
    this.backgroundMusic.pause();
    this.endbossMusic.loop = true;
    this.gunshotSound.play();
    this.endbossMusic.play();
    this.endbossSound.play();
  }


  /**
   * Mutes or unmutes all sounds.
   * @param {boolean} muted - If true, mutes all sounds. If false, unmutes all sounds.
   */
   setAllSoundsMuted(muted) {
    let sounds = [
      this.bottleSound,
      this.coinSound,
      this.splashSound,
      this.throwSound,
      this.backgroundMusic,
      this.endbossMusic,
      this.gunshotSound,
      this.endbossSound,
      this.winSound,
      this.gameOverSound,
      this.walking_sound,
      this.jumpSound,
      this.hurtSound,
      this.snoreSound,
      this.chickenSound,
      this.babyChickenSound,
    ];
    sounds.forEach((sound) => {
      sound.muted = muted;
    });
  }
}
