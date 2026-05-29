import {
  QUIZ_FIELDS,
  FIELD_LABELS,
  answerMarkup,
  buildQuestionGroups,
  escapeHtml,
  formatTime,
  shuffle
} from "./quiz.js";

const ROUND_SPACING = 560;
const FIRST_CHECKPOINT_X = 560;
const AMP_OFFSET = 230;
const TOTAL_POINTS_PER_MIC = 4;

const MODE_CONFIG = {
  practice: {
    label: "Practice Run",
    timeLimit: 0,
    fixedOrder: false
  },
  arcade: {
    label: "Arcade Run",
    timeLimit: 180000,
    fixedOrder: false
  },
  test: {
    label: "Test All 15 Mics",
    timeLimit: 0,
    fixedOrder: true
  }
};

const SOUND_ASSETS = {
  move: "assets/sounds/scrolling-sound.wav",
  jump: "assets/sounds/jump-sound.wav"
};

export class MicQuestGame {
  constructor({ microphones, showScreen, renderEnd, refreshLeaderboard }) {
    this.microphones = microphones;
    this.showScreen = showScreen;
    this.renderEnd = renderEnd;
    this.refreshLeaderboard = refreshLeaderboard;
    this.totalPoints = microphones.length * TOTAL_POINTS_PER_MIC;
    this.audio = new SoundEngine();
    this.lastResult = null;

    this.els = {
      modeLabel: byId("modeLabel"),
      scoreLabel: byId("scoreLabel"),
      checkpointCounter: byId("checkpointCounter"),
      streakLabel: byId("streakLabel"),
      timerLabel: byId("timerLabel"),
      viewport: byId("gameViewport"),
      world: byId("world"),
      player: byId("player"),
      impactText: byId("impactText"),
      runnerPrompt: byId("runnerPrompt"),
      quizModal: byId("quizModal"),
      quizPanel: byId("quizPanel"),
      quizCheckpointLabel: byId("quizCheckpointLabel"),
      quizImage: byId("quizImage"),
      questionGrid: byId("questionGrid"),
      feedback: byId("quizFeedback"),
      revealButton: byId("revealButton"),
      checkButton: byId("checkAnswersButton"),
      continueButton: byId("continueRunButton"),
      muteButton: byId("muteButton")
    };
  }

  start(modeName = "practice") {
    const mode = MODE_CONFIG[modeName] ? modeName : "practice";
    const config = MODE_CONFIG[mode];
    const orderedIds = this.microphones.map(mic => mic.id);
    const order = config.fixedOrder ? orderedIds : shuffle(orderedIds);

    this.clearTimers();
    this.state = {
      mode,
      order,
      round: 0,
      score: 0,
      streak: 0,
      perfect: 0,
      selected: {},
      checked: false,
      phase: "ready",
      moving: false,
      jumpedForObstacle: false,
      obstacleCleared: false,
      startedAt: Date.now(),
      elapsed: 0,
      timer: null,
      badges: new Set(),
      correctTypeDynamic: 0,
      correctTypeCondenser: 0,
      correctPolar: 0,
      moveTimer: null
    };

    this.els.modeLabel.textContent = config.label;
    this.showScreen("gameScreen");
    this.buildWorld();
    this.prepareRound();
    this.updateHud();
    this.setPrompt("Press Move to run. Jump when the amplifier blocks the stage.");
    this.state.timer = window.setInterval(() => this.tick(), 250);
  }

  move() {
    if (!this.isPlaying() || this.isQuizOpen() || this.state.moving) return;
    if (this.state.round >= this.state.order.length) {
      this.endRun(false);
      return;
    }

    if (this.state.phase === "ready") {
      this.runToAmplifier();
      return;
    }

    if (this.state.phase === "atAmp") {
      this.bump("Jump first!");
      this.setPrompt("The amplifier is still in the way. Press Jump, then Move.");
      this.audio.fail();
      return;
    }

    if (this.state.phase === "ampCleared") {
      this.runToCheckpoint();
    }
  }

  jump() {
    if (!this.isPlaying() || this.isQuizOpen()) return;
    this.audio.jump();

    if (this.state.phase === "movingToAmp") {
      this.state.jumpedForObstacle = true;
      this.playVaultAnimation();
      this.setPrompt("Good jump. The character is vaulting over the amplifier.");
      return;
    }

    if (this.state.phase === "atAmp") {
      this.state.phase = "vaultingAmp";
      this.playVaultAnimation();
      this.setPrompt("Jumping over the amplifier...");
      window.setTimeout(() => {
        if (this.state?.phase === "vaultingAmp") this.clearAmplifier();
      }, 520);
      return;
    }

    this.playHopAnimation();
    this.setPrompt("Nice jump. Press Move to keep running.");
  }

  toggleMute() {
    this.audio.setMuted(!this.audio.muted);
    this.els.muteButton.textContent = this.audio.muted ? "Sound Off" : "Sound On";
    this.els.muteButton.setAttribute("aria-pressed", String(this.audio.muted));
  }

  quit() {
    this.clearTimers();
    this.closeQuiz();
    this.showScreen("homeScreen");
  }

  selectAnswer(button) {
    if (!button || this.state.checked) return;
    const { field, value } = button.dataset;
    this.state.selected[field] = value;
    this.els.questionGrid.querySelectorAll(`[data-field="${field}"]`).forEach(option => {
      option.classList.toggle("is-selected", option === button);
      option.setAttribute("aria-pressed", String(option === button));
    });
    this.audio.tap();
  }

  checkAnswers() {
    if (!this.isQuizOpen() || this.state.checked) return;

    const missing = QUIZ_FIELDS.filter(field => !this.state.selected[field]);
    if (missing.length) {
      this.shakeQuiz();
      this.showQuizFeedback(`<strong>Pick one answer in every row before checking.</strong>`);
      this.audio.fail();
      return;
    }

    const mic = this.currentMic();
    let points = 0;

    QUIZ_FIELDS.forEach(field => {
      const isCorrect = this.state.selected[field] === mic[field];
      if (isCorrect) points += 1;
      this.markFieldOptions(field, mic[field], this.state.selected[field]);
    });

    this.state.score += points;
    this.state.checked = true;
    this.updateLearningStats(mic, points);
    this.disableQuizInputs();
    this.showAnswerFeedback(mic, points);
    this.updateHud();

    if (points === TOTAL_POINTS_PER_MIC) this.audio.success();
    else this.audio.fail();
  }

  revealAnswer() {
    if (!this.isQuizOpen()) return;
    const mic = this.currentMic();
    if (!this.state.checked) {
      QUIZ_FIELDS.forEach(field => this.markFieldOptions(field, mic[field], this.state.selected[field]));
      this.state.checked = true;
      this.state.streak = 0;
      this.disableQuizInputs();
      this.updateHud();
    }
    this.showAnswerFeedback(mic, 0, true);
    this.audio.reveal();
  }

  continueRun() {
    if (!this.state.checked) return;

    const checkpoint = this.els.world.querySelector(`.checkpoint[data-round="${this.state.round}"]`);
    checkpoint?.classList.add("is-done");
    checkpoint?.classList.remove("is-current");

    this.closeQuiz();
    this.state.round += 1;

    if (this.state.round >= this.state.order.length) {
      this.endRun(false);
      return;
    }

    this.prepareRound();
    this.updateHud();
    this.setPrompt("Press Move to run toward the next microphone.");
  }

  getLastResult() {
    return this.lastResult;
  }

  isPlaying() {
    return Boolean(this.state) && byId("gameScreen").classList.contains("is-active");
  }

  handleKeydown(event) {
    const key = event.key;
    const movementKeys = ["ArrowRight", "d", "D", " ", "ArrowUp", "w", "W", "Enter", "Escape"];
    if (!movementKeys.includes(key)) return;

    if (this.isPlaying() || this.isQuizOpen()) event.preventDefault();

    if (this.isQuizOpen()) {
      if (key === "Enter") this.checkAnswers();
      if (key === "Escape") this.quit();
      return;
    }

    if (key === "ArrowRight" || key === "d" || key === "D") this.move();
    if (key === " " || key === "ArrowUp" || key === "w" || key === "W") this.jump();
    if (key === "Escape") this.quit();
  }

  tick() {
    if (!this.state) return;
    this.state.elapsed = Date.now() - this.state.startedAt;
    const config = MODE_CONFIG[this.state.mode];
    if (config.timeLimit && this.state.elapsed >= config.timeLimit) {
      this.endRun(true);
      return;
    }
    this.updateHud();
  }

  buildWorld() {
    const generated = this.els.world.querySelectorAll(".generated");
    generated.forEach(node => node.remove());

    this.worldWidth = FIRST_CHECKPOINT_X + (this.microphones.length - 1) * ROUND_SPACING + 940;
    this.els.world.style.width = `${this.worldWidth}px`;
    this.els.world.style.transform = "translate3d(0, 0, 0)";

    this.state.order.forEach((micId, round) => {
      const mic = this.microphones.find(item => item.id === micId);
      const checkpointX = this.checkpointX(round);
      const ampX = this.ampX(round);

      this.els.world.appendChild(this.createAmp(round, ampX));
      this.els.world.appendChild(this.createCheckpoint(round, checkpointX, mic));
      this.els.world.appendChild(this.createPlatform(checkpointX - 34, round));
      this.els.world.appendChild(this.createCable(checkpointX - 320, round));
      this.createHorns(checkpointX, round).forEach(marker => this.els.world.appendChild(marker));
    });
  }

  createAmp(round, x) {
    const amp = document.createElement("div");
    amp.className = "amp generated";
    amp.dataset.round = String(round);
    amp.style.left = `${x}px`;
    amp.innerHTML = `<img src="assets/sprites/metal-guitar-amp.png" alt="">`;
    amp.setAttribute("aria-label", "Guitar amplifier obstacle");
    return amp;
  }

  createCheckpoint(round, x, mic) {
    const checkpoint = document.createElement("div");
    checkpoint.className = "checkpoint generated";
    checkpoint.dataset.round = String(round);
    checkpoint.style.left = `${x}px`;
    checkpoint.innerHTML = `
      <div class="mic-stand"></div>
      <div class="checkpoint-image">
        <img src="${mic.image}" alt="Microphone checkpoint ${round + 1}">
      </div>
      <span>Mic ${round + 1}</span>
    `;
    return checkpoint;
  }

  createPlatform(x, round) {
    const platform = document.createElement("div");
    platform.className = "bonus-platform generated";
    platform.style.left = `${x}px`;
    platform.style.bottom = `${260 + (round % 3) * 22}px`;
    return platform;
  }

  createCable(x, round) {
    const cable = document.createElement("div");
    cable.className = "stage-cable generated";
    cable.style.left = `${x}px`;
    cable.style.bottom = `${126 + (round % 2) * 18}px`;
    return cable;
  }

  createHorns(x, round) {
    return [0, 1, 2, 3].map(index => {
      const marker = document.createElement("div");
      marker.className = "devil-horns generated";
      marker.style.left = `${x + 8 + index * 34}px`;
      marker.style.bottom = `${342 + (round % 2) * 28}px`;
      marker.style.animationDelay = `${index * 90}ms`;
      marker.innerHTML = `<img src="assets/sprites/devil-horns.png" alt="">`;
      return marker;
    });
  }

  prepareRound() {
    this.state.phase = "ready";
    this.state.moving = false;
    this.state.jumpedForObstacle = false;
    this.state.obstacleCleared = false;
    this.state.selected = {};
    this.state.checked = false;
    this.els.player.classList.remove("is-running", "is-jumping", "is-vaulting", "is-bumped");

    this.els.world.querySelectorAll(".checkpoint").forEach(node => node.classList.remove("is-current"));
    this.els.world.querySelector(`.checkpoint[data-round="${this.state.round}"]`)?.classList.add("is-current");

    const leadX = Math.max(0, this.ampX(this.state.round) - 250);
    this.setWorldFocus(leadX, 0);
  }

  runToAmplifier() {
    this.state.phase = "movingToAmp";
    this.state.moving = true;
    this.state.jumpedForObstacle = false;
    this.els.player.classList.add("is-running");
    this.audio.startMove();
    this.setPrompt("Amp ahead. Press Jump now.");
    this.setWorldFocus(this.ampX(this.state.round) + 16, 760);

    this.state.moveTimer = window.setTimeout(() => {
      this.state.moving = false;
      this.els.player.classList.remove("is-running");
      this.audio.stopMove();
      if (this.state.jumpedForObstacle) {
        this.clearAmplifier();
      } else {
        this.state.phase = "atAmp";
        this.bump("Jump!");
        this.setPrompt("You clipped the amp. Press Jump to clear it, then Move.");
        this.audio.fail();
      }
    }, 780);
  }

  runToCheckpoint() {
    this.state.phase = "movingToCheckpoint";
    this.state.moving = true;
    this.els.player.classList.add("is-running");
    this.audio.startMove();
    this.setPrompt("Running to the microphone checkpoint.");
    this.setWorldFocus(this.checkpointX(this.state.round) + 28, 800);

    this.state.moveTimer = window.setTimeout(() => {
      this.state.moving = false;
      this.els.player.classList.remove("is-running");
      this.audio.stopMove();
      this.state.phase = "quiz";
      this.setPrompt("Checkpoint reached. Answer the microphone question.");
      this.openQuiz();
    }, 820);
  }

  clearAmplifier() {
    this.state.phase = "ampCleared";
    this.state.obstacleCleared = true;
    this.els.world.querySelector(`.amp[data-round="${this.state.round}"]`)?.classList.add("is-cleared");
    this.flashImpact("CLEAR");
    this.setPrompt("Amp cleared. Press Move to reach the microphone.");
    this.audio.clear();
  }

  playHopAnimation() {
    this.els.player.classList.remove("is-vaulting");
    this.els.player.classList.add("is-jumping");
    window.setTimeout(() => this.els.player.classList.remove("is-jumping"), 380);
  }

  playVaultAnimation() {
    this.els.player.classList.remove("is-jumping", "is-vaulting");
    void this.els.player.offsetWidth;
    this.els.player.classList.add("is-vaulting");
    window.setTimeout(() => this.els.player.classList.remove("is-vaulting"), 840);
  }

  bump(text) {
    this.els.player.classList.add("is-bumped");
    this.flashImpact(text);
    window.setTimeout(() => this.els.player.classList.remove("is-bumped"), 330);
  }

  flashImpact(text) {
    this.els.impactText.textContent = text;
    this.els.impactText.classList.remove("is-visible");
    void this.els.impactText.offsetWidth;
    this.els.impactText.classList.add("is-visible");
    window.setTimeout(() => this.els.impactText.classList.remove("is-visible"), 760);
  }

  openQuiz() {
    const mic = this.currentMic();
    this.state.selected = {};
    this.state.checked = false;

    this.els.quizCheckpointLabel.textContent = `Checkpoint ${this.state.round + 1} / ${this.microphones.length}`;
    this.els.quizImage.src = mic.image;
    this.els.questionGrid.innerHTML = this.renderQuestions(mic);
    this.els.feedback.innerHTML = "";
    this.els.feedback.classList.remove("is-visible");
    this.els.quizPanel.classList.remove("is-reviewing");
    this.els.continueButton.disabled = true;
    this.els.checkButton.disabled = false;
    this.els.revealButton.disabled = false;
    this.els.quizModal.hidden = false;
    this.els.quizModal.classList.add("is-open");

    const firstOption = this.els.questionGrid.querySelector(".option-button");
    firstOption?.focus({ preventScroll: true });
  }

  closeQuiz() {
    this.els.quizModal.classList.remove("is-open");
    this.els.quizPanel.classList.remove("is-reviewing");
    this.els.quizModal.hidden = true;
  }

  renderQuestions(mic) {
    return buildQuestionGroups(mic, this.microphones).map(group => `
      <section class="question-group">
        <h3>${escapeHtml(group.label)}</h3>
        <div class="option-list">
          ${group.options.map(option => `
            <button class="option-button" type="button" data-field="${group.field}" data-value="${escapeHtml(option)}" aria-pressed="false">
              ${escapeHtml(option)}
            </button>
          `).join("")}
        </div>
      </section>
    `).join("");
  }

  markFieldOptions(field, correctValue, selectedValue) {
    this.els.questionGrid.querySelectorAll(`[data-field="${field}"]`).forEach(button => {
      if (button.dataset.value === correctValue) button.classList.add("is-correct");
      if (selectedValue && button.dataset.value === selectedValue && selectedValue !== correctValue) {
        button.classList.add("is-wrong");
      }
    });
  }

  disableQuizInputs() {
    this.els.questionGrid.querySelectorAll(".option-button").forEach(button => {
      button.disabled = true;
    });
    this.els.checkButton.disabled = true;
    this.els.continueButton.disabled = false;
  }

  showAnswerFeedback(mic, points, revealed = false) {
    const heading = revealed
      ? "Answer revealed."
      : points === TOTAL_POINTS_PER_MIC
        ? "Perfect checkpoint."
        : `${points}/4 points collected.`;

    this.showQuizFeedback(`
      <strong>${heading}</strong>
      <div class="answer-grid">${answerMarkup(mic)}</div>
      <p><b>Memory hook:</b> ${escapeHtml(mic.mnemonic)}</p>
      <p><b>Typical use:</b> ${escapeHtml(mic.use)}</p>
    `, { review: true });
  }

  showQuizFeedback(markup, options = {}) {
    this.els.quizPanel.classList.toggle("is-reviewing", Boolean(options.review));
    this.els.feedback.innerHTML = markup;
    this.els.feedback.classList.add("is-visible");
  }

  shakeQuiz() {
    this.els.quizPanel.classList.add("is-shaking");
    window.setTimeout(() => this.els.quizPanel.classList.remove("is-shaking"), 340);
  }

  updateLearningStats(mic, points) {
    if (points === TOTAL_POINTS_PER_MIC) {
      this.state.perfect += 1;
      this.state.streak += 1;
      this.state.badges.add("Perfect Round");
    } else {
      this.state.streak = 0;
    }

    if (this.state.selected.type === mic.type) {
      if (mic.type === "Dynamic") this.state.correctTypeDynamic += 1;
      if (mic.type === "Condenser") this.state.correctTypeCondenser += 1;
    }

    if (this.state.selected.polar === mic.polar) {
      this.state.correctPolar += 1;
    }

    if (this.state.streak >= 3) this.state.badges.add("Three-Mic Streak");
    if (this.state.correctTypeCondenser >= 3) this.state.badges.add("Condenser Spotter");
    if (this.state.correctTypeDynamic >= 3) this.state.badges.add("Dynamic Spotter");
    if (this.state.correctPolar >= 5) this.state.badges.add("Pattern Pro");
  }

  updateHud() {
    if (!this.state) return;
    const config = MODE_CONFIG[this.state.mode];
    const elapsed = Date.now() - this.state.startedAt;
    const timerMs = config.timeLimit ? config.timeLimit - elapsed : elapsed;
    this.els.scoreLabel.textContent = `${this.state.score}/${this.totalPoints}`;
    this.els.checkpointCounter.textContent = `${Math.min(this.state.round + 1, this.microphones.length)}/${this.microphones.length}`;
    this.els.streakLabel.textContent = String(this.state.streak);
    this.els.timerLabel.textContent = formatTime(timerMs);
  }

  endRun(timeout) {
    if (!this.state) return;
    this.clearTimers();
    this.closeQuiz();
    this.state.elapsed = Date.now() - this.state.startedAt;

    if (this.state.score === this.totalPoints) this.state.badges.add("Perfect Round");
    if (!this.state.badges.size) this.state.badges.add("First Run Complete");

    this.lastResult = {
      score: this.state.score,
      total: this.totalPoints,
      perfect: this.state.perfect,
      time: this.state.elapsed,
      mode: MODE_CONFIG[this.state.mode].label,
      modeKey: this.state.mode,
      timeout,
      completed: this.state.round >= this.state.order.length,
      badges: [...this.state.badges],
      date: new Date().toLocaleString()
    };

    this.renderEnd(this.lastResult);
    this.showScreen("endScreen");
    this.refreshLeaderboard();
  }

  clearTimers() {
    if (!this.state) return;
    window.clearInterval(this.state.timer);
    window.clearTimeout(this.state.moveTimer);
    this.audio.stopMove();
  }

  currentMic() {
    const id = this.state.order[this.state.round];
    return this.microphones.find(mic => mic.id === id);
  }

  checkpointX(round) {
    return FIRST_CHECKPOINT_X + round * ROUND_SPACING;
  }

  ampX(round) {
    return this.checkpointX(round) - AMP_OFFSET;
  }

  setWorldFocus(worldX, duration = 620) {
    const viewportWidth = this.els.viewport.clientWidth || 1000;
    const screenAnchor = Math.min(250, Math.max(118, viewportWidth * 0.24));
    const maxOffset = Math.max(0, this.worldWidth - viewportWidth);
    const offset = Math.max(0, Math.min(maxOffset, worldX - screenAnchor));
    this.els.world.style.transitionDuration = `${duration}ms`;
    this.els.world.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }

  setPrompt(message) {
    this.els.runnerPrompt.textContent = message;
  }

  isQuizOpen() {
    return !this.els.quizModal.hidden;
  }
}

class SoundEngine {
  constructor() {
    this.muted = false;
    this.context = null;
    this.moveLoop = this.createClip(SOUND_ASSETS.move, { loop: true, volume: 0.45 });
    this.jumpClip = this.createClip(SOUND_ASSETS.jump, { volume: 0.7 });
  }

  setMuted(value) {
    this.muted = value;
    if (value) this.stopMove();
  }

  tap() {
    this.tone(330, 0.035, "square", 0.025);
  }

  startMove() {
    if (this.muted) return;
    if (this.moveLoop) {
      this.moveLoop.currentTime = 0;
      this.moveLoop.play().catch(() => this.tone(220, 0.08, "square", 0.02));
      return;
    }
    this.tone(220, 0.08, "square", 0.02);
  }

  stopMove() {
    if (!this.moveLoop) return;
    this.moveLoop.pause();
    this.moveLoop.currentTime = 0;
  }

  jump() {
    if (this.playClip(this.jumpClip)) return;
    this.tone(520, 0.065, "square", 0.04);
  }

  clear() {
    this.tone(600, 0.055, "square", 0.04);
    window.setTimeout(() => this.tone(780, 0.07, "square", 0.035), 70);
  }

  success() {
    this.tone(660, 0.06, "square", 0.045);
    window.setTimeout(() => this.tone(880, 0.06, "square", 0.04), 80);
    window.setTimeout(() => this.tone(990, 0.08, "square", 0.035), 160);
  }

  fail() {
    this.tone(150, 0.12, "sawtooth", 0.035);
  }

  reveal() {
    this.tone(250, 0.08, "triangle", 0.035);
  }

  createClip(src, options = {}) {
    try {
      const clip = new Audio(src);
      clip.loop = Boolean(options.loop);
      clip.volume = options.volume ?? 0.5;
      clip.preload = "auto";
      return clip;
    } catch {
      return null;
    }
  }

  playClip(clip) {
    if (this.muted || !clip) return false;
    clip.currentTime = 0;
    clip.play().catch(() => {});
    return true;
  }

  tone(frequency, duration, type, volume) {
    if (this.muted) return;
    try {
      this.context = this.context || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = volume;
      oscillator.connect(gain);
      gain.connect(this.context.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + duration);
      oscillator.stop(this.context.currentTime + duration);
    } catch {
      // Sound effects are optional; the game remains fully usable without Web Audio.
    }
  }
}

function byId(id) {
  return document.getElementById(id);
}
