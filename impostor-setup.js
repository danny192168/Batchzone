//APRIL 19 started

gameData = {
  players: ["1", "2", "3"],
  categories: [],
  impostorCount: 1,
  time: 2,
};

//START BUTTON
const startButton = document.getElementById("start-button");

startButton.addEventListener("click", () => {
  window.location.href = "rolecards.html";
});

//asdas

function saveStatus() {
  sessionStorage.setItem("gameData", JSON.stringify(gameData));
  console.log("save game data to session storage");
  console.log(JSON.parse(sessionStorage.getItem("gameData")));
}

function showStartButton() {
  if (gameData.players.length >= 3 && gameData.categories.length >= 1) {
    startButton.classList.remove("hidden");
    console.log("asda");
  } else {
    startButton.classList.add("hidden");
  }
  console.log("asdasdasdasdasa");
}

// PLAYER
let playersContainer = document.getElementById("players-container");

const playerInput = document.getElementById("player-input");
const playerSubmitBtn = document.getElementById("player-submit-btn");

let playerItems = playersContainer.querySelectorAll(".player-item");

function assignPLayers() {
  playerItems = playersContainer.querySelectorAll(".player-item");
  playerArray = [];
  playerItems.forEach((item) => {
    playerArray.push(item.querySelector("div:first-child").innerText);
  });
  gameData.players = playerArray;
  showStartButton();
}

assignPLayers();

function setItemEvents() {
  playerItems = playersContainer.querySelectorAll(".player-item");
  playerItems.forEach((item) => {
    const nameDiv = item.querySelector("div:first-child");
    const removeBtn = item.querySelector("div:last-child");

    removeBtn.addEventListener("click", () => {
      item.remove();
      assignPLayers();
    });
  });
}

setItemEvents();

function submitPlayerItem() {
  let nameValue = playerInput.value;
  if (playerInput.checkValidity()) {
    let element = document.createElement("div");
    element.classList.add(
      "player-item",
      "flex",
      "justify-between",
      "w-full",
      "rounded-xl",
      "shadow-lg",
      "overflow-hidden",
      "border",
      "border-gray-800",
      "py-3",
      "px-3",
      "font-bold",
      "bg-gray-300",
    );
    element.innerHTML = `
        <div>${nameValue}</div>
        <div class="active:text-gray-500"><i class="fa-solid fa-xmark text-lg"></i></div>
        `;
    playersContainer.appendChild(element);
    playerInput.value = "";
    setItemEvents();
    assignPLayers();
    playerInput.focus();
    // updateGame(players);
  }
}

playerSubmitBtn.addEventListener("click", submitPlayerItem);

playerInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    submitPlayerItem();
  }
});

// CATEGORY
const categoriesContainer = document.getElementById("categories-container");
let categoryItems = categoriesContainer.querySelectorAll(".category-item");

function assignCategories() {
  categoriesArray = [];
  categoryItems.forEach((item) => {
    if (item.classList.contains("selected-item")) {
      categoriesArray.push(item);
    }
  });
  gameData.categories = categoriesArray;
  showStartButton();
}

assignCategories();

function setCategoryEvents() {
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("selected-item");
      assignCategories();
    });
  });
  //   updateGame(categories, )
}

setCategoryEvents();

// IMPOSTOR
const impostorCountContainer = document.getElementById("impostorcount-container");
const impostorCountButtons = impostorCountContainer.querySelectorAll("button");

impostorCountButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (gameData.players.length > 3) {
      impostorCountButtons.forEach((x) => {
        x.classList.remove("bg-[#1A7A7A]", "text-white");
        x.classList.add("bg-gray-300");
      });
      btn.classList.add("bg-[#1A7A7A]", "text-white");
      btn.classList.remove("bg-gray-300");
      gameData.impostorCount = btn.dataset.count;
      // updateGame(impostor, 1);
    } else if (btn.dataset.count > 1) {
      alert("Need more players to add impostor");
    }
  });
});

// TIMER
function minutesToTime(minutes) {
  const wholeMinutes = Math.floor(minutes);
  const seconds = Math.round((minutes - wholeMinutes) * 60);
  return `${wholeMinutes}:${seconds.toString().padStart(2, "0")}`;
}

let timerString = "2:00";

const timerContainer = document.getElementById("timer-container");
const timerMinusBtn = document.getElementById("timer-minus-btn");
const timerAddBtn = document.getElementById("timer-add-btn");
const timerSpan = document.getElementById("timer-span");

function updateTime(i) {
  let copy = { ...gameData };
  let output = (copy.time += i);
  if (output >= 1 && output <= 10) {
    gameData.time += i;
    timerSpan.innerText = minutesToTime(gameData.time);
  }
}

timerMinusBtn.addEventListener("click", () => {
  updateTime(-0.5);
});

timerAddBtn.addEventListener("click", () => {
  updateTime(0.5);
});
