//APRIL 19 started
import { customWordList, wordList } from "./wordlist.js";

let gameData = {
  players: [],
  categories: [],
  customCategories: [],
  finalCategory: null,
  impostorCount: 1,
  time: 2,
  impostorIndices: [],
  word: null,
  hint: null,
};

//Some stuff

function camelToRegular(camel) {
  // Split camelCase at uppercase letters, then join with spaces
  const spaced = camel.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Capitalize first letter of the whole string
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function saveStatus() {
  sessionStorage.setItem("gameData", JSON.stringify(gameData));
  console.log("save game data to session storage");
  console.log(JSON.parse(sessionStorage.getItem("gameData")));
}

//START BUTTON
const startButton = document.getElementById("start-button");

startButton.addEventListener("click", () => {
  saveStatus();
  window.location.href = "rolecards.html";
});

function showStartButton() {
  if (
    gameData.players.length >= 3 &&
    (gameData.categories.length > 0 || gameData.customCategories.length > 0)
  ) {
    startButton.classList.remove("hidden");
  } else {
    startButton.classList.add("hidden");
  }
}

// PLAYER
let playersContainer = document.getElementById("players-container");

function getLocalGameData() {
  let data = JSON.parse(sessionStorage.getItem("gameData"));
  console.log(data ? "200" : "404");
  return data || [];
}

gameData.players = getLocalGameData().players || [];

//add cached players
if (gameData.players.length > 0) {
  let players = gameData.players;
  console.log("players", players);
  playersContainer.innerHTML = "";
  players.forEach((item) => {
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
      "p-3",
      "font-bold",
      "bg-gray-300",
    );
    element.innerHTML = `
    <div>${item}</div><div class="active:text-gray-500">
    <i class="fa-solid fa-xmark text-lg"></i></div>`;
    playersContainer.append(element);
  });
}

const playerInput = document.getElementById("player-input");
const playerSubmitBtn = document.getElementById("player-submit-btn");

let playerItems = playersContainer.querySelectorAll(".player-item");

function assignPLayers() {
  playerItems = playersContainer.querySelectorAll(".player-item");
  let playerArray = [];
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

const categoryItemsContainer = document.getElementById("category-items-container");
const customCategoryItemsContainer = document.getElementById("custom-category-items-container");

//load category items

for (const key in wordList) {
  const value = wordList[key];

  console.log("key: ", key, "VAlue", value);
  let element = document.createElement("div");
  element.dataset.category = key;
  element.classList.add(
    "category-item",
    "flex",
    "justify-between",
    "w-full",
    "rounded-xl",
    "shadow-lg",
    "overflow-hidden",
    "border",
    "border-gray-800",
    "p-3",
    "mb-3",
    "font-bold",
    "bg-gray-300",
  );
  element.innerHTML = `
    <div>${camelToRegular(key)}</div>
    <div class="hidden"><i class="fa-solid fa-check text-lg"></i></div>
  `;
  categoryItemsContainer.append(element);
}

for (const key in customWordList) {
  let element = document.createElement("div");
  element.dataset.category = key;
  element.classList.add(
    "custom-category-item",
    "flex",
    "justify-between",
    "w-full",
    "rounded-xl",
    "shadow-lg",
    "overflow-hidden",
    "border",
    "border-gray-800",
    "p-3",
    "mb-3",
    "font-bold",
    "bg-gray-300",
  );
  element.innerHTML = `
    <div>${camelToRegular(key)}</div>
    <div class="hidden"><i class="fa-solid fa-check text-lg"></i></div>
  `;
  customCategoryItemsContainer.append(element);
}

let categoryItems = categoryItemsContainer.querySelectorAll(".category-item");
let customCategoryItems = customCategoryItemsContainer.querySelectorAll(".custom-category-item");

function assignCategories() {
  let categoriesArray = [];
  let customCategoriesArray = [];
  categoryItems.forEach((item) => {
    if (item.classList.contains("selected-item")) {
      // console.log(item.dataset.category);
      categoriesArray.push(item.dataset.category);
    }
  });
  customCategoryItems.forEach((item) => {
    if (item.classList.contains("selected-item")) {
      // console.log(item.dataset.category);
      customCategoriesArray.push(item.dataset.category);
    }
  });
  gameData.categories = categoriesArray;
  gameData.customCategories = customCategoriesArray;
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
  customCategoryItems.forEach((item) => {
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
  if (output > 0 && output <= 10) {
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

//SHARE
const shareBtn = document.getElementById("share-button");

if (!shareBtn) {
  console.warn("Share button not found");
}

shareBtn.addEventListener("click", async () => {
  // 1. Web Share API (Chrome, Edge, some Android, Safari TP, etc.)
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        url: window.location.origin + "/index.html",
      });
      return;
    } catch (err) {
      console.log("Share failed:", err.message);
    }
  }

  // 2. Clipboard API fallback (modern browsers)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(window.location.origin + "/index.html");
      showNotification("Link copied to clipboard!");
      return;
    } catch (err) {
      console.log("Clipboard write failed:", err.message);
    }
  }

  // 3. Old‑school fallback: input + execCommand (IE / very old browsers)
  try {
    const input = document.createElement("input");
    input.value = window.location.origin + "/index.html";
    input.style.cssText = "position:fixed; top:0; left:0; opacity:0; pointer-events:none;";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    showNotification("Link copied to clipboard!");
  } catch (err) {
    console.log("Fallback copy failed:", err.message);
    showNotification("Please copy the link manually.");
  }
});

// Helper to show a nicer message than alert
function showNotification(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText =
    "position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);" +
    "background:#333; color:white; padding:0.75rem 1rem; border-radius:0.5rem;" +
    "font-size:0.875rem; z-index:9999; pointer-events:none;";

  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

//SELECT CUSTOM MODAL
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("close-modal-button");
const addModalBtn = document.getElementById("add-modal-button");
const selectCustomCard = document.getElementById("select-custom-card");
selectCustomCard.addEventListener("click", () => {
  modal.showModal();
});

closeModalBtn.addEventListener("click", () => {
  modal.close();
  customCategoryItems.forEach((item) => {
    item.classList.remove("selected-item");
  });
  assignCategories();
});

addModalBtn.addEventListener("click", () => {
  modal.close();
});
