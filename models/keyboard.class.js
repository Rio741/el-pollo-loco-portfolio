class Keyboard {
  LEFT = false;
  RIGHT = false;
  SPACE = false;
  D = false;
}


window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});


//for Mobile-Version

document.addEventListener("DOMContentLoaded", function () {
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const jumpBtn = document.getElementById("jump-btn");
  const throwBtn = document.getElementById("throw-btn");

  leftBtn.addEventListener("mousedown", () => {
    keyboard.LEFT = true;
  });
  leftBtn.addEventListener("mouseup", () => {
    keyboard.LEFT = false;
  });
  leftBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });
  leftBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });

  rightBtn.addEventListener("mousedown", () => {
    keyboard.RIGHT = true;
  });
  rightBtn.addEventListener("mouseup", () => {
    keyboard.RIGHT = false;
  });
  rightBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });
  rightBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });

  jumpBtn.addEventListener("mousedown", () => {
    keyboard.SPACE = true;
  });
  jumpBtn.addEventListener("mouseup", () => {
    keyboard.SPACE = false;
  });
  jumpBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });
  jumpBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
  });

  throwBtn.addEventListener("mousedown", () => {
    keyboard.D = true;
  });
  throwBtn.addEventListener("mouseup", () => {
    keyboard.D = false;
  });
  throwBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  });
  throwBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  });
});
