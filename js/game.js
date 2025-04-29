let canvas;
let world;
let keyboard = new Keyboard();
let i = 1;


/**
 * Starts the game by initializing the level, setting up the game screen, 
 * creating a new game world, and handling sound settings.
 */
function startGame() {
  initLevel();
  setupGameScreen();
  const canvas = document.getElementById("canvas");
  canvas.style.display = "block";
  world = new World(canvas, keyboard);
  handleSoundSettings();
}


/**
 * Sets up the game screen by hiding specific elements and showing the sound button.
 */
function setupGameScreen() {
  document.getElementById("game-over-img").style.display = "none";
  document.getElementById("win-img").style.display = "none";
  document.getElementById("restart-btn").style.display = "none";
  document.getElementById("home-btn").style.display = "none";
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("sound-btn").style.display = "flex";
  document.getElementById("play-btn").style.display = "none";
  document.getElementById("privacy-policity-btn").style.display = "none";
  document.getElementById("legal-notice-btn").style.display = "none";
  document.getElementById("info-btn").style.display = "none";
}


/**
 * Handles sound settings based on the user's preference stored in localStorage.
 * Turns sound on or off accordingly.
 */
function handleSoundSettings() {
  const isMuted = localStorage.getItem('isMuted') === 'true';
  if (isMuted) {
    soundOff();
  } else {
    soundOn();
  }
}


/**
 * Sets up the home screen by hiding game-specific elements and showing the main menu buttons.
 */
function setupHomeScreen() {
  document.getElementById("game-over-img").style.display = "none";
  document.getElementById("win-img").style.display = "none";
  document.getElementById("restart-btn").style.display = "none";
  document.getElementById("home-btn").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("play-btn").style.display = "flex";
  document.getElementById("privacy-policity-btn").style.display = "flex";
  document.getElementById("legal-notice-btn").style.display = "flex";
  document.getElementById("info-btn").style.display = "flex";
}


/**
 * Toggles full-screen mode for the canvas element.
 */
function toggleFullScreen() {
  const canvas = document.getElementById("fullscreen");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      alert(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  } else {
    document.exitFullscreen();
  }
}


/**
 * Mutes all game sounds by displaying the mute button,
 * hiding the sound button, and setting all sounds to muted.
 */
function soundOff() {
  document.getElementById("mute-btn").style.display = "flex";
  document.getElementById("sound-btn").style.display = "none";
  if (world && world.audioManager) {
    world.audioManager.setAllSoundsMuted(true);
  }
  localStorage.setItem('isMuted', 'true');
}


/**
 * Unmutes all game sounds by hiding the mute button,
 * displaying the sound button, and setting all sounds to unmuted.
 */
function soundOn() {
  document.getElementById("mute-btn").style.display = "none";
  document.getElementById("sound-btn").style.display = "flex";
  if (world && world.audioManager) {
    world.audioManager.setAllSoundsMuted(false);
  }
  localStorage.setItem('isMuted', 'false');
}


/**
 * Toggles the display of the info container.
 */
function openInfo() {
  const infoContainer = document.getElementById("info-container");
  if (infoContainer.style.display === "flex") {
    infoContainer.style.display = "none";
  } else {
    infoContainer.style.display = "flex";
  }
}


function openPrivacyPolicity() {
  toggleContent(
    "privacy-policity-container",
    "privacy-policity-content",
    "privacy-policity.html"
  );
}


function openLegalNotice() {
  toggleContent(
    "legal-notice-container",
    "legal-notice-content",
    "legal-notice.html"
  );
}


/**
 * Toggles the display of a content container and loads content via an XMLHttpRequest.
 * If the container is currently hidden or not displayed, it loads content from the specified URL
 * and displays the container. If the container is currently displayed, it hides the container.
 *
 * @param {string} containerId - The ID of the container element to toggle.
 * @param {string} contentId - The ID of the content element where the loaded content will be inserted.
 * @param {string} url - The URL from which to load the content.
 */
function toggleContent(containerId, contentId, url) {
  var container = document.getElementById(containerId);
  if (
    container.style.display === "none" ||
    container.style.display === "flex" ||
    container.style.display === ""
  ) {
    // Load content via XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var content = document.getElementById(contentId);
          content.innerHTML = xhr.responseText;
          container.style.display = "block";
        } else {
          console.error("Error loading file " + url + ":", xhr.status);
        }
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  } else {
    container.style.display = "none";
  }
}


/**
 * Closes all popup containers by setting their display style to 'none'.
 */
function closePopup() {
  document.getElementById("info-container").style.display = "none";
  document.getElementById("privacy-policity-container").style.display = "none";
  document.getElementById("legal-notice-container").style.display = "none";
}


/**
 * Prevents the event from propagating up the DOM tree, thus preventing any parent handlers
 * from being notified of the event.
 *
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
  event.stopPropagation();
}


// Add event listeners to handle orientation change and window resize
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);


/**
 * Checks the orientation of the device and displays a warning if the device is in portrait mode
 * and the width is less than 760 pixels.
 */
function checkOrientation() {
  const warning = document.getElementById("orientation-warning");
  if (window.innerWidth < 760 && window.innerWidth < window.innerHeight) {
    warning.style.display = "flex";
  } else {
    warning.style.display = "none";
  }
}

