class Cloud extends MovableObject {
  x = 0;
  y = 0;
  height = 300;
  width = 700;
  speed = 0.3;

  constructor(image, startX) {
    super().loadImage(image);
    this.x = Math.random() * 300 + startX;
  }


  /**
   * Animates the cloud's movement.
   */
  animate() {
    this.world.addInterval(setInterval(() => {
      this.moveLeft();
    }, 1000 / 60));
  }
}
