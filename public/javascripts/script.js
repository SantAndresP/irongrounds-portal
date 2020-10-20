document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");

    const formBtn = document.querySelector("#form-btn");
    const form = document.querySelector("#form-edit");

    formBtn.addEventListener("click", () => {
      console.log("clicked");
      form.submit(); 
    });
  },
  false
);

//<-- Full Screen setting -->
const fullScreenBtn = document.querySelector(".game__fullscreen");

fullScreenBtn.addEventListener("click", fullscreen);

document.addEventListener("keydown", function (e) {
  console.log("key press" + e.keyCode);
});
// detect enter or exit fullscreen mode
document.addEventListener("webkitfullscreenchange", fullscreenChange);
document.addEventListener("mozfullscreenchange", fullscreenChange);
document.addEventListener("fullscreenchange", fullscreenChange);
document.addEventListener("MSFullscreenChange", fullscreenChange);

function fullscreen() {
  // check if fullscreen mode is available
  if (
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
  ) {
    // which element will be fullscreen
    const iframe = document.querySelector("iframe");
    // Do fullscreen
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
      iframe.mozRequestFullScreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  } else {
    document.querySelector(".error").innerHTML =
      "Your browser is not supported";
  }
}

function fullscreenChange() {
  if (
    document.fullscreenEnabled ||
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement
  ) {
    console.log("enter fullscreen");
  } else {
    console.log("exit fullscreen");
  }
  // force to reload iframe once to prevent the iframe source didn't care about trying to resize the window
  // comment this line and you will see
  const iframe = document.querySelector("iframe");
  iframe.src = iframe.src;
}

//<-- Modal setting -->
