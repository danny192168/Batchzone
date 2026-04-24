const content1 = document.getElementById("content-1");
const content2 = document.getElementById("content-2");

function getLocalGameData() {
  let data = JSON.parse(sessionStorage.getItem("gameData"));
  console.log(data ? "200" : "404");
  return data || ((window.location.href = "setup.html"), false);
}

let gameData = getLocalGameData();

let votedPlayerIndices = gameData.votedPlayerIndices || [];
let votedPlayerIndex = null;

// DOM
const playerCardContainer = document.getElementById("player-card-container");
const submitVoteButton = document.getElementById("submit-vote-button");
const result1 = document.getElementById("result-1");
const result2 = document.getElementById("result-2");

const nameDisplays = document.querySelectorAll(".name-display");
const impostorNameSpan = document.getElementById("impostor-name-span");
const votedNameSpan = document.getElementById("voted-name-span");
const wordDisplay = document.getElementById("word-display");
const textFinalDisplay = document.getElementById("text-final-display");
const impostorLeftDisplay = document.getElementById("impostorsleft-display");
// Function

nameDisplays.innerText = gameData.players.forEach((item, index) => {
  if (!votedPlayerIndices.includes(index)) {
    let element = document.createElement("div");
    element.setAttribute(
      "class",
      "card-item shadow-lg py-3 px-4 font-bold rounded-xl bg-[#1A7A7A]",
    );
    element.innerText = item;
    playerCardContainer.append(element);
    element.addEventListener("click", () => {
      submitVoteButton.classList.remove("translate-y-[10rem]");
      document.querySelectorAll(".card-item").forEach((cardItem) => {
        cardItem.classList.remove("text-gray-900", "bg-white", "border-2", "border-[#1A7A7A]");
        cardItem.classList.add("bg-[#1A7A7A]");
      });
      element.classList.add("text-gray-900", "bg-white", "border-2", "border-[#1A7A7A]");
      votedPlayerIndex = index;
    });
  }
});

const voteIconContainer = document.getElementById("vote-icon-container");

function submitVote() {
  wordDisplay.innerText = `Word: ${gameData.word}`;
  //   result1.classList.add("hidden");
  //   result2.classList.remove("hidden");
  votedPlayerIndices.push(votedPlayerIndex);
  let isVotedImpostor = gameData.impostorIndices.includes(votedPlayerIndex);
  console.log(votedPlayerIndices);
  const playersLeft = gameData.players.filter((_, index) => !votedPlayerIndices.includes(index));
  const impostorsLeft = gameData.impostorIndices.filter(
    (item) => !votedPlayerIndices.includes(item),
  );
  const playerRatio = impostorsLeft.length / playersLeft.length;
  impostorLeftDisplay.innerText = `${impostorsLeft.length} Impostor left`;
  votedNameSpan.innerText = `${gameData.players[votedPlayerIndex]} is not the impostor`;
  if (gameData.impostorIndices.includes(votedPlayerIndex)) {
    votedNameSpan.innerText = `${gameData.players[votedPlayerIndex]} is an impostor`;
    voteIconContainer.innerHTML = '<i class="fa-solid fa-check text-[#1a7a7a]"></i>';
  }
  // impostor wins
  console.log(playerRatio);
  if (playerRatio >= 0.5) {
    console.log("lose", gameData.impostorIndices);
    result1.classList.add("hidden");
    result2.classList.remove("hidden");
    result2.classList.add("flex");
    textFinalDisplay.innerText = `The Impostor${gameData.impostorCount > 1 ? "s" : ""} won the game 😳`;
    console.log(textFinalDisplay);
  }
  // impostor loses

  if (playerRatio == 0) {
    console.log("win");
    result1.classList.add("hidden");
    result2.classList.remove("hidden");
    result2.classList.add("flex");
  }
  //Display impostors
  let impostors = "";
  //My dirty code 💪
  if (gameData.impostorCount > 1) {
    for (let i = 0; i < gameData.impostorCount; i++) {
      if (i < gameData.impostorCount - 1) {
        impostors += gameData.players[i];
        if (i < gameData.impostorCount - 2) {
          impostors += ", ";
        } else {
          impostors += " ";
        }
      }

      if (i == gameData.impostorCount - 1) {
        impostors += `and ${gameData.players[i]} are the Impostors`;
      }
    }
  }
  impostorNameSpan.innerText =
    impostors || `${gameData.players[gameData.impostorIndices[0]]} is the Impostor`;
}

submitVoteButton.addEventListener("click", () => {
  console.log(votedPlayerIndex);
  content1.classList.add("transform", "translate-y-[100%]");
  setTimeout(() => {
    submitVote();
    content1.classList.add("hidden");
    content2.classList.remove("translate-y-[100%]");
  }, 1000);
});

const newGameBtn = document.getElementById("new-game-button");
const newRoundBtn = document.getElementById("new-round-button");

newRoundBtn.addEventListener("click", () => {
  gameData.votedPlayerIndices = votedPlayerIndices;
  sessionStorage.setItem("gameData", JSON.stringify(gameData));
  window.location.href = "timer.html";
});

newGameBtn.addEventListener("click", () => {
  window.location.href = "setup.html";
});

// rename impostorLeftDisplay.html to setup.html
