class Coin extends MovableObject {
  height = 120;
  width = 120;
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];
  currentImage = 0;
  
  constructor(x, y) {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = y;
  }


  /**
   * Animates the coin by cycling through its images.
   */
  animate() {
    super.animate(this.IMAGES_COIN);
  }


  /**
   * Handles collision with the character.
   * @param {World} world - The game world object.
   * @param {number} index - The index of the coin in the items array.
   */
  handleCollision(world, index) {
    if (world.character.collectedCoins < 5) {
      world.character.incrementCoinCount();
      let coinPercentage = world.character.collectedCoins * 20;
      world.coinStatusBar.setPercentage(coinPercentage);
      world.level.items.splice(index, 1);
      world.audioManager.coinSound.play();
    }
  }
}
