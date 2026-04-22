function getLocalGameData() {
  let data = JSON.parse(sessionStorage.getItem("gameData"));
  console.log(data ? "200" : "404");
  return data || ((window.location.href = "setup.html"), false);
}

// Source - https://stackoverflow.com/a/7525760
// Posted by Tower, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-23, License - CC BY-SA 3.0

function requestFullScreen(element) {
  // Supports most browsers and their versions.
  var requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

var elem = document.body; // Make the body go full screen.
requestFullScreen(elem);

// DOM

let gameData = getLocalGameData();

sessionStorage.getItem(gameData);

const container = document.getElementById("container");

const topButtonContainer = document.getElementById("top-button-container");

const backBtn = document.getElementById("back-button");

const timerBox = document.getElementById("timer-box");

const timeDisplay = document.getElementById("time-display");

const noticeBox = document.getElementById("notice-box");

const leadNameText = document.getElementById("lead-name-text");

const buttonContainer = document.getElementById("button-container");

const lavaBox = document.getElementById("lava-box");

//FUNCTIONS

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

leadNameText.innerText = gameData.players[random(0, gameData.players.length - 1)];

setTimeout(() => {
  noticeBox.classList.add("opacity-0");
  setTimeout(() => {
    noticeBox.classList.add("hidden");
  }, 4000);
}, 1000);

function endRound() {
  timerBox.innerText = "Time's Up!!";
  topButtonContainer.classList.add("hidden");
  buttonContainer.classList.add("hidden");
  setTimeout(() => {
    lavaBox.classList.add("top-full");
    setTimeout(() => {
      window.location.href = "vote.html";
    }, 1000);
  }, 500);
}

// Source - https://stackoverflow.com/a/9763769
// Posted by RobG, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-20, License - CC BY-SA 3.0

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  //   return hrs + ":" + mins + ":" + secs + "." + ms;
  return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
}

let currentTime = gameData.time * 60 * 1000;

console.log(gameData.time);
function displayTime() {
  timeDisplay.innerText = msToTime(currentTime);
}

displayTime();

let timeInterval = setInterval(() => {
  currentTime -= 1000;
  displayTime();
  if (currentTime < 1) {
    endRound();
    clearInterval(timeInterval);
  }
}, 1000);

//DOM
const pauseButton = document.getElementById("pause-button");

const pausedButtonContainer = document.querySelector(".paused-button-container");

const resumeButton = document.getElementById("resume-button");
const voteButton = document.getElementById("vote-button");

voteButton.onclick = () => {
  window.location.href = "vote.html";
};

//I'll use canvas since js and css isn't partcipating. I used Meta here
function toggleAnimateLava() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    lastTimestamp = null; // reset so delta doesn't jump
    requestAnimationFrame(animate);
  }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const box = {
  width: window.innerWidth,
  startHeight: 0,
  targetHeight: window.innerHeight,
  duration: gameData.time * 60,
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  box.width = window.innerWidth;
  box.targetHeight = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let isPlaying = true;
let accumulatedTime = 0;
let lastTimestamp = null;

function animate(timestamp) {
  if (!isPlaying) return;

  if (lastTimestamp === null) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 1000; // seconds since last frame
  lastTimestamp = timestamp;

  accumulatedTime += delta;
  if (accumulatedTime > box.duration) accumulatedTime = box.duration;

  const progress = accumulatedTime / box.duration;
  const currentHeight = box.startHeight + (box.targetHeight - box.startHeight) * progress;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const x = (canvas.width - box.width) / 2;
  const y = canvas.height;
  const drawY = y - currentHeight;

  ctx.fillStyle = "#B6174B";
  ctx.fillRect(x, drawY, box.width, currentHeight);

  if (accumulatedTime < box.duration) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);

//Bttons

pauseButton.addEventListener("click", () => {
  pausedButtonContainer.classList.remove("hidden");
  pauseButton.classList.add("hidden");
  clearInterval(timeInterval);
  toggleAnimateLava();
});

resumeButton.addEventListener("click", () => {
  pausedButtonContainer.classList.add("hidden");
  pauseButton.classList.remove("hidden");
  timeInterval = setInterval(() => {
    currentTime -= 1000;
    displayTime();
  }, 1000);
  toggleAnimateLava();
});
