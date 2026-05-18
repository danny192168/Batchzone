//May 16 started
import { wordList } from "./henyo-wordlist.js";

//DOM
const categoryItems = document.querySelectorAll(".category-item");
const readyButton = document.getElementById("ready-button");

const content1 = document.getElementById("content-1");

const wordBox = document.getElementById("word-box");

//DATA

let gameData = {
  word: "",
  time: 5,
};

function saveStatus() {
  sessionStorage.setItem("gameData", JSON.stringify(gameData));
  console.log("save game data to session storage");
  console.log(JSON.parse(sessionStorage.getItem("gameData")));
}

//STUFFs

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// WHEN YOU CLICK THE CATEGORY ITEM

categoryItems.forEach((item) => {
  item.onclick = () => {
    let itemCategory = item.getAttribute("data-category");
    console.log(itemCategory);

    if (itemCategory == "random") {
      let randomCategoryIndex = random(0, Object.keys(wordList).length - 1);
      let randomCategory = Object.keys(wordList)[randomCategoryIndex];
      gameData.word = wordList[randomCategory][random(0, wordList[randomCategory].length - 1)];
    } else {
      gameData.word = wordList[itemCategory][random(0, wordList[itemCategory].length - 1)];
    }

    wordBox.textContent = gameData.word;
    content1.classList.add("content-closed");
  };
});

// TYPE RANDOM WORD
const typeCustomWordContainer = document.getElementById("type-custom-word-container");
const wordInput = document.getElementById("word-input");
const snackbar = document.getElementById("snackbar");

typeCustomWordContainer.onclick = () => {
  wordBox.textContent = "";
  gameData.word = "";
  wordInput.classList.remove("hidden");
  setTimeout(() => {
    wordInput.focus();
  }, 500);
  // const customWord = wordInput.value.trim();
  if ("customWord") {
    // gameData.word = customWord;
  }
  content1.classList.add("content-closed");
};

wordInput.addEventListener("input", () => {
  console.log(gameData.word);
  const customWord = wordInput.value.trim();
  gameData.word = customWord;
  console.log(gameData.word);
  if (gameData.word.length == 12) {
    snackbar.textContent = "Darn, such a long one";
    snackbar.classList.remove("opacity-0");
    snackbar.classList.add("opacity-100");
    setTimeout(() => {
      snackbar.classList.remove("opacity-100");
      snackbar.classList.add("opacity-0");
    }, 4000);
  }
});

// TIMER
function minutesToTime(minutes) {
  const wholeMinutes = Math.floor(minutes);
  const seconds = Math.round((minutes - wholeMinutes) * 60);
  return `${wholeMinutes}:${seconds.toString().padStart(2, "0")}`;
}

const timerContainer = document.getElementById("timer-container");
const timerMinusBtn = document.getElementById("timer-minus-btn");
const timerAddBtn = document.getElementById("timer-add-btn");
const timerSpan = document.getElementById("timer-span");

function updateTime(i) {
  let copy = { ...gameData };
  let output = (copy.time += i);
  if (output > 0 && output <= 15) {
    gameData.time += i;
    timerSpan.innerText = minutesToTime(gameData.time);
  }
}

updateTime(0);

timerMinusBtn.addEventListener("click", () => {
  updateTime(-0.5);
});

timerAddBtn.addEventListener("click", () => {
  updateTime(0.5);
});

//ready button and change page to timer.html with basic encrypted word on the url

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

//BACK BUTTON
const backButton = document.getElementById("back-button");

backButton.addEventListener("click", () => {
  if (content1.classList.contains("content-closed")) {
    content1.classList.remove("content-closed");
  } else {
    window.location.href = "../index.html";
  }
});

// function

readyButton.addEventListener("click", () => {
  const encryptedWord = caesarShift(gameData.word, 3);
  if (gameData.word.length > 2) {
    window.location.href = `timer.html?word=${encodeURIComponent(encryptedWord)}&time=${gameData.time}`;
  } else {
    snackbar.textContent = "Word is too short";
    snackbar.classList.remove("opacity-0");
    snackbar.classList.add("opacity-100");
    setTimeout(() => {
      snackbar.classList.remove("opacity-100");
      snackbar.classList.add("opacity-0");
    }, 4000);
  }
});
