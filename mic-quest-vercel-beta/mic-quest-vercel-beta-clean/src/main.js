import { MicQuestGame } from "./game.js";
import { Leaderboard, renderLeaderboardRows } from "./leaderboard.js";
import { escapeHtml, formatTime, shuffle } from "./quiz.js";

const leaderboard = new Leaderboard();
let game;
let microphones = [];
let flashcardOrder = [];

const elements = {
  screens: () => document.querySelectorAll(".screen"),
  leaderboardUrlInput: byId("leaderboardUrlInput"),
  leaderboardKeyInput: byId("leaderboardKeyInput"),
  leaderboardConfigStatus: byId("leaderboardConfigStatus"),
  leaderboardStatus: byId("leaderboardStatus"),
  leaderboardList: byId("leaderboardList"),
  saveScoreButton: byId("saveScoreButton"),
  playerNameInput: byId("playerNameInput"),
  endSummary: byId("endSummary"),
  badgeList: byId("badgeList"),
  flashcardGrid: byId("flashcardGrid"),
  flashcardTemplate: byId("flashcardTemplate")
};

init();

async function init() {
  try {
    microphones = await loadMicrophones();
    flashcardOrder = microphones.map(mic => mic.id);
    preloadImages(microphones);

    game = new MicQuestGame({
      microphones,
      showScreen,
      renderEnd,
      refreshLeaderboard
    });

    bindEvents();
    renderFlashcards();
    await updateLeaderboardConfig();
    window.__micQuestReady = true;
    await refreshLeaderboard();
  } catch (error) {
    showStartupError(error);
  }
}

async function loadMicrophones() {
  const response = await fetch("data/microphones.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load data/microphones.json.");
  const data = await response.json();
  if (!Array.isArray(data) || data.length !== 15) {
    throw new Error("The microphone dataset must contain exactly 15 microphones.");
  }
  return data;
}

function bindEvents() {
  document.addEventListener("click", event => {
    const modeButton = event.target.closest("[data-mode]");
    if (modeButton) {
      game.start(modeButton.dataset.mode);
      return;
    }

    if (event.target.closest("[data-home]")) {
      showScreen("homeScreen");
    }
  });

  byId("openFlashcardsButton").addEventListener("click", () => showScreen("flashcardScreen"));
  byId("shuffleFlashcardsButton").addEventListener("click", () => {
    flashcardOrder = shuffle(flashcardOrder);
    renderFlashcards();
  });

  byId("moveButton").addEventListener("click", () => game.move());
  byId("jumpButton").addEventListener("click", () => game.jump());
  byId("quitRunButton").addEventListener("click", () => game.quit());
  byId("quitFromQuizButton").addEventListener("click", () => game.quit());
  byId("muteButton").addEventListener("click", () => game.toggleMute());

  byId("questionGrid").addEventListener("click", event => {
    game.selectAnswer(event.target.closest(".option-button"));
  });
  byId("checkAnswersButton").addEventListener("click", () => game.checkAnswers());
  byId("revealButton").addEventListener("click", () => game.revealAnswer());
  byId("continueRunButton").addEventListener("click", () => game.continueRun());
  document.addEventListener("keydown", event => game.handleKeydown(event));

  byId("saveLeaderboardUrlButton").addEventListener("click", async () => {
    const result = leaderboard.saveSettings({
      url: elements.leaderboardUrlInput.value,
      anonKey: elements.leaderboardKeyInput.value
    });
    await updateLeaderboardConfig(result.error);
    refreshLeaderboard();
  });

  byId("clearLeaderboardUrlButton").addEventListener("click", async () => {
    leaderboard.clearSettings();
    await updateLeaderboardConfig();
    refreshLeaderboard();
  });

  byId("refreshLeaderboardButton").addEventListener("click", () => refreshLeaderboard());
  elements.saveScoreButton.addEventListener("click", saveCurrentScore);
}

function showScreen(screenId) {
  elements.screens().forEach(screen => {
    screen.classList.toggle("is-active", screen.id === screenId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderEnd(result) {
  const ending = result.timeout ? "Time up!" : result.completed ? "Run complete!" : "Run ended.";
  elements.endSummary.textContent = `${ending} Final score: ${result.score}/${result.total}. Perfect checkpoints: ${result.perfect}/15. Time: ${formatTime(result.time)}.`;
  elements.badgeList.innerHTML = result.badges.map(badge => `<span>${escapeHtml(badge)}</span>`).join("");
  elements.saveScoreButton.disabled = false;
}

async function saveCurrentScore() {
  const result = game.getLastResult();
  if (!result) return;

  const entry = {
    name: elements.playerNameInput.value.trim() || "Unnamed Team",
    score: result.score,
    total: result.total,
    perfect: result.perfect,
    time: result.time,
    mode: result.mode,
    date: result.date
  };

  elements.saveScoreButton.disabled = true;
  setStatus(elements.leaderboardStatus, "Saving score...", "local");

  const saveResult = await leaderboard.saveScore(entry);
  elements.leaderboardList.innerHTML = renderLeaderboardRows(saveResult.scores);
  setStatus(elements.leaderboardStatus, saveResult.message, classForSource(saveResult.source));
  elements.playerNameInput.value = "";
  elements.saveScoreButton.disabled = false;
}

async function refreshLeaderboard() {
  const result = await leaderboard.listScores();
  elements.leaderboardList.innerHTML = renderLeaderboardRows(result.scores);
  setStatus(elements.leaderboardStatus, result.message, classForSource(result.source));
}

async function updateLeaderboardConfig(error) {
  const manualConfig = leaderboard.getManualConfig();
  const status = await leaderboard.getConfigStatus();
  elements.leaderboardUrlInput.value = manualConfig?.url || "";
  elements.leaderboardKeyInput.value = manualConfig?.anonKey || "";

  if (error) {
    setStatus(elements.leaderboardConfigStatus, error, "error");
    return;
  }

  setStatus(elements.leaderboardConfigStatus, status.message, status.source);
}

function renderFlashcards() {
  elements.flashcardGrid.innerHTML = "";
  flashcardOrder.forEach(id => {
    const mic = microphones.find(item => item.id === id);
    const card = elements.flashcardTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");
    const answer = card.querySelector(".flashcard-answer");

    image.src = mic.image;
    image.alt = "Microphone flashcard image";
    answer.innerHTML = `
      <strong>${escapeHtml(mic.manufacturer)} ${escapeHtml(mic.model)}</strong>
      <span>${escapeHtml(mic.type)}</span>
      <span>${escapeHtml(mic.polar)}</span>
      <em>${escapeHtml(mic.mnemonic)}</em>
    `;

    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });

    elements.flashcardGrid.appendChild(card);
  });
}

function preloadImages(items) {
  items.forEach(item => {
    const image = new Image();
    image.src = item.image;
  });
}

function showStartupError(error) {
  byId("homeScreen").innerHTML = `
    <section class="panel startup-error">
      <h1>Mic Quest could not start</h1>
      <p>${escapeHtml(error.message)}</p>
      <p>Run the project from a small local web server so the browser can load the JSON data file.</p>
    </section>
  `;
}

function setStatus(element, message, source) {
  element.className = `status-chip is-${source}`;
  element.textContent = message;
}

function classForSource(source) {
  if (source === "online") return "online";
  if (source === "fallback") return "error";
  return "local";
}

function byId(id) {
  return document.getElementById(id);
}
