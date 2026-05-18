const urlParams = new URLSearchParams(window.location.search);
const urlWord = urlParams.get("word"); // "42"
const urlTime = urlParams.get("time"); // "dark"

if (!urlParams.size) {
  window.location.href = "index.html";
}

function caesarShift(str, shift) {
  const shiftNormalized = ((shift % 26) + 26) % 26; // handle negatives
  return Array.from(str)
    .map((ch) => {
      const code = ch.charCodeAt(0);
      // Uppercase A-Z
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shiftNormalized) % 26) + 65);
      }
      // Lowercase a-z
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shiftNormalized) % 26) + 97);
      }
      // others unchanged
      return ch;
    })
    .join("");
}

let gameData = {
  word: caesarShift(urlWord, -3),
  time: parseFloat(urlTime),
};

console.log(gameData.word, urlTime);

// DOM

sessionStorage.getItem(gameData);

const container = document.getElementById("container");

const topButtonContainer = document.getElementById("top-button-container");

const backBtn = document.getElementById("back-button");

const timerBox = document.getElementById("timer-box");

const timeDisplay = document.getElementById("time-display");

const lavaBox = document.getElementById("lava-box");

const wordDisplay = document.getElementById("word-display");

const buttonContainer = document.getElementById("button-container");

const pauseButton = document.getElementById("pause-button");

const timerText = document.getElementById("timer-text");

const pausedButtonContainer = document.querySelector(".paused-button-container");

const contentOverlay = document.getElementById("content-overlay");

const resumeButton = document.getElementById("resume-button");
const finishButton = document.getElementById("finish-button");

//FUNCTIONS

wordDisplay.innerText = gameData.word;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function endRound() {
  timerBox.innerText = "Time's Up!!";
  timerBox.classList.remove("5xl");
  timerBox.classList.add("6xl");
  topButtonContainer.classList.add("hidden");
  buttonContainer.classList.add("hidden");
  setTimeout(() => {
    lavaBox.classList.add("top-full");
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

function displayTime() {
  timeDisplay.innerText = msToTime(currentTime);
}

displayTime();

function startTick() {
  currentTime -= 1000;
  displayTime();
  if (currentTime < 1) {
    endRound();
    clearInterval(timeInterval);
  }
}

let timeInterval = setInterval(startTick, 1000);

finishButton.onclick = () => {
  //   window.location.href = "vote.html";
  lavaBox.classList.add("top-full");
  document.getElementById("content-overlay-word").innerText = gameData.word;
  document.getElementById("content-overlay-time").innerText = msToTime(
    gameData.time * 60 * 1000 - currentTime,
  );
  contentOverlay.classList.remove("top-full");
  contentOverlay.classList.add("top-0");
};

const newGameButton = document.getElementById("new-game-button");

newGameButton.onclick = () => {
  window.location.href = "index.html";
};

//I'll use canvas since js and css isn't cooperating. I used Meta here
function toggleAnimateLava(toggleOnly = false) {
  if (isPlaying) {
    if (!toggleOnly) {
      pausedButtonContainer.classList.remove("hidden");
      pauseButton.classList.add("hidden");
    }
    clearInterval(timeInterval);
  } else {
    lastTimestamp = null; // reset so delta doesn't jump
    requestAnimationFrame(animate);
    if (!toggleOnly) {
      pausedButtonContainer.classList.add("hidden");
      pauseButton.classList.remove("hidden");
    }
    timeInterval = setInterval(startTick, 1000);
  }

  isPlaying = !isPlaying;
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
  toggleAnimateLava();
});

resumeButton.addEventListener("click", () => {
  toggleAnimateLava();
});

//GAME START

function gameStart() {
  timerText.innerText = "Get Ready!";
  timeDisplay.classList.remove("text-6xl");
  timeDisplay.classList.add("text-9xl");
  for (let i = 0; i <= 3; i++) {
    setTimeout(() => {
      timeDisplay.classList.add("text-red-400");
      timeDisplay.classList.remove("text-red-400");
      timeDisplay.innerText = (3 - i).toString();
    }, i * 1000);
    if (i === 3) {
      setTimeout(() => {
        timeDisplay.classList.add("transition-all", "duration-1000");
        buttonContainer.classList.remove("top-20");
        buttonContainer.classList.add("top-0");
        timeDisplay.classList.remove("text-9xl");
        timeDisplay.classList.add("text-6xl");
        timerText.innerText = "Timer";
        timeDisplay.innerText = msToTime(currentTime);
        toggleAnimateLava(true);
      }, i * 1000);
    }
  }

  toggleAnimateLava(true);
}

gameStart();
