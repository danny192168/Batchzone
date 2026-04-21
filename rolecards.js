import { wordList } from "./wordlist.js";

function getLocalGameData() {
  let data = JSON.parse(sessionStorage.getItem("gameData"));
  console.log(data ? "200" : "404");
  return data || ((window.location.href = "impostor.html"), false);
}

let gameData = getLocalGameData();

let cardColors = ["red", "orange", "yellow", "green", "blue", "indigo", "purple", "pink"];

// DOM
const cardContainer = document.getElementById("card-container");

getLocalGameData();

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIndexes(array, maxCount) {
  let indexArray = [];
  while (!(indexArray.length >= maxCount)) {
    let randomPos = random(0, array.length - 1);
    console.log(
      "current size: ",
      indexArray.length + 1,
      "Max Count:",
      maxCount,
      "generated pos",
      randomPos,
    );
    if (!indexArray.includes(randomPos)) {
      indexArray.push(randomPos);
    }
  }
  console.log(indexArray);
  return indexArray;
}

function assignRandomWord() {
  let randomCategory = gameData.categories[random(0, gameData.categories.length - 1)];
  let categoryWordsData = wordList[randomCategory];
  console.log(wordList, randomCategory, "😳", wordList[randomCategory]);
  let categoryWordsArray = categoryWordsData[0];
  let categoryHintsArray = categoryWordsData[0];
  let randomArrayPos = random(0, categoryWordsArray.length - 1);
  let randomWord = categoryWordsArray[randomArrayPos];
  gameData.finalCategory = randomCategory;
  gameData.word = randomWord;
  gameData.hint = categoryHintsArray[randomArrayPos];
}

function createCardElements() {
  gameData.players.forEach((player, pos) => {
    let element = document.createElement("div");
    element.classList.add("card");
    pos == 0 ? element.classList.add("shown-card") : undefined;
    let isImpostor = gameData.impostorIndexes.includes(pos);
    element.innerHTML = `
           <div class="content">
              <div class="front bg-${cardColors[pos] || cardColors - cardColors.length + pos}-500">
                <h2 class="text-4xl font-bold text-center text-gray-900">${player}</h2>
                <div class="flex justify-center text-gray-900 flex-col items-center gap-4 mt-auto">
                  <i class="fa-regular fa-hand-pointer text-4xl"></i>
                  <p class="font-bold">HOLD TO REVEAL</p>
                </div>
              </div>
              <div class="back">
                <h2 class="text-4xl font-bold text-center mb-4 text-white">${player}</h2>
                <div>
                  <div class="text-lg text-center bg-gray-100 px-4 py-7 rounded-lg mt-4 w-full">
                  ${
                    isImpostor
                      ? ' <h3 class="text-2xl text-center font-bold text-[#B6174B]"> You are the Impostor</h3> <h4 class="font-bold text-gray-600 text-2xl">HINT: ' +
                        gameData.hint +
                        "</h4>"
                      : '<p class="text-gray-800">Don\'t tell this word to anyone</p> <h4 class="font-bold text-[#1A7A7A] text-2xl">' +
                        gameData.word +
                        "</h4>"
                  }
                  </div>
                </div>
              </div>
            </div>
  
    `;
    cardContainer.appendChild(element);
  });
}

function runRolecards() {
  gameData.impostorIndexes = getRandomIndexes(gameData.players, gameData.impostorCount);
  assignRandomWord();
  createCardElements();
}

runRolecards();

let isLastCard = false;

// START BTN

const nextCardBtn = document.getElementById("nextcard-button");

function dispBtn(isShow = true) {
  isShow
    ? nextCardBtn.classList.remove("translate-y-[10rem]")
    : nextCardBtn.classList.add("translate-y-[10rem]");
}

//ROTATE

function rotateCard() {
  console.log(isLastCard);
  if (!isLastCard) {
    dispBtn(false);
    var currentCard = document.querySelector(".shown-card");
    var nextCard = currentCard.nextElementSibling;
    currentCard.classList.remove("shown-card");
    nextCard.classList.add("shown-card");
    console.log(nextCard, nextCard.nextElementSibling);
    isLastCard = nextCard.nextElementSibling === null;
    console.log("is", isLastCard);
    if (isLastCard) {
      nextCardBtn.innerText = "Start Game";
      nextCardBtn.classList.add("bg-gray-900", "text-white", "active:text-gray-900");
    }
  } else {
    window.location.href = "timer.html";
  }
}

nextCardBtn.addEventListener("click", rotateCard);

//SHOWING AND HIDING THE BUTTON TO AVOID MISSING TO SEE CARD
let startButtonTimeout = null;

let cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("mousedown", () => {
    console.log("down");
    startButtonTimeout = setTimeout(dispBtn, 400, true);
  });
  card.addEventListener("mouseup", () => {
    clearTimeout(startButtonTimeout);
    console.log("up");
  });

  // mobile
  card.addEventListener("touchstart", () => {
    console.log("down");
    startButtonTimeout = setTimeout(() => dispBtn(true), 400);
  });

  card.addEventListener("touchend", () => {
    clearTimeout(startButtonTimeout);
    console.log("up");
  });

  card.addEventListener("touchcancel", () => {
    clearTimeout(startButtonTimeout);
    console.log("touch canceled");
  });
});
