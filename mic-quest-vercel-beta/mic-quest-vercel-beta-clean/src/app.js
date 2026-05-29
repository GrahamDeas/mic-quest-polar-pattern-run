/*
 * Mic Quest: Polar Pattern Run
 * Classic browser bundle for static hosting and direct file opening.
 * Source modules are kept beside this file for easier editing.
 */
(() => {
const EMBEDDED_MICROPHONES = [
  {
    "id": 1,
    "manufacturer": "Shure",
    "model": "SM58",
    "type": "Dynamic",
    "polar": "Cardioid",
    "mnemonic": "Ball grille = vocal stage classic. SM58s are dynamic cardioid vocal mics.",
    "use": "Live vocals, guide vocals, rehearsal rooms.",
    "image": "assets/microphones/01_Shure_SM58.jpg"
  },
  {
    "id": 5,
    "manufacturer": "Shure",
    "model": "SM57",
    "type": "Dynamic",
    "polar": "Cardioid",
    "mnemonic": "No ball grille, small silver end = the instrument workhorse.",
    "use": "Snare drum, guitar amps, brass, general instruments.",
    "image": "assets/microphones/05_Shure_SM57.jpg"
  },
  {
    "id": 3,
    "manufacturer": "AKG",
    "model": "D112",
    "type": "Dynamic",
    "polar": "Cardioid",
    "mnemonic": "The chunky egg-shaped kick drum mic with the coloured ring.",
    "use": "Kick drum, bass cabinet, low-frequency sources.",
    "image": "assets/microphones/03_AKG_D112.jpg"
  },
  {
    "id": 4,
    "manufacturer": "Sennheiser",
    "model": "E606",
    "type": "Dynamic",
    "polar": "Supercardioid",
    "mnemonic": "Flat side-address guitar cab mic. It can hang in front of an amp.",
    "use": "Electric guitar cabinets, percussion, brass.",
    "image": "assets/microphones/04_Sennheiser_E606.jpg"
  },
  {
    "id": 2,
    "manufacturer": "Sennheiser",
    "model": "MD421",
    "type": "Dynamic",
    "polar": "Cardioid",
    "mnemonic": "Long black body with the distinctive clip collar: a studio dynamic classic.",
    "use": "Toms, guitar amps, brass, broadcast voice.",
    "image": "assets/microphones/02_Sennheiser_MD421.jpg"
  },
  {
    "id": 6,
    "manufacturer": "Beyerdynamic",
    "model": "OPUS 65",
    "type": "Dynamic",
    "polar": "Hypercardioid",
    "mnemonic": "Large white/silver grille and body: Beyerdynamic bass/instrument dynamic.",
    "use": "Kick drum, percussion and loud instruments.",
    "image": "assets/microphones/06_Beyerdynamic_OPUS_65.jpg"
  },
  {
    "id": 7,
    "manufacturer": "Beyerdynamic",
    "model": "M201",
    "type": "Dynamic",
    "polar": "Hypercardioid",
    "mnemonic": "Slim black pencil-style dynamic: precise, tight pickup.",
    "use": "Snare, guitar amps, acoustic instruments, brass.",
    "image": "assets/microphones/07_Beyerdynamic_M201.jpg"
  },
  {
    "id": 8,
    "manufacturer": "AKG",
    "model": "C414",
    "type": "Condenser",
    "polar": "Multi-pattern: Omni / Cardioid / Hypercardioid / Figure-8",
    "mnemonic": "Black rectangular AKG body with pattern switches = the flexible C414.",
    "use": "Vocals, drum overheads, acoustic guitar, piano, room mics.",
    "image": "assets/microphones/08_AKG_C414.jpg"
  },
  {
    "id": 9,
    "manufacturer": "Neumann",
    "model": "U87",
    "type": "Condenser",
    "polar": "Multi-pattern: Omni / Cardioid / Figure-8",
    "mnemonic": "Large classic Neumann in a shock mount: three-pattern studio icon.",
    "use": "Vocals, voiceover, piano, strings, room capture.",
    "image": "assets/microphones/09_Neumann_U87.jpg"
  },
  {
    "id": 10,
    "manufacturer": "Neumann",
    "model": "TLM103",
    "type": "Condenser",
    "polar": "Cardioid",
    "mnemonic": "Looks U87-ish but simpler: transformerless cardioid condenser.",
    "use": "Vocals, spoken word, acoustic instruments.",
    "image": "assets/microphones/10_Neumann_TLM103.jpg"
  },
  {
    "id": 11,
    "manufacturer": "AKG",
    "model": "C3000",
    "type": "Condenser",
    "polar": "Cardioid",
    "mnemonic": "Rounded AKG body with a red band: fixed cardioid studio condenser.",
    "use": "Vocals, acoustic guitar, overheads, brass.",
    "image": "assets/microphones/11_AKG_C3000.jpg"
  },
  {
    "id": 13,
    "manufacturer": "Neumann",
    "model": "KM184",
    "type": "Condenser",
    "polar": "Cardioid",
    "mnemonic": "Small Neumann pencil condenser: 184 = cardioid.",
    "use": "Acoustic guitar, piano, drum overheads, spot mics.",
    "image": "assets/microphones/13_Neumann_KM184.jpg"
  },
  {
    "id": 12,
    "manufacturer": "Neumann",
    "model": "KM183",
    "type": "Condenser",
    "polar": "Omnidirectional",
    "mnemonic": "Small Neumann pencil condenser: 183 = omni.",
    "use": "Room, ambience, stereo pairs, natural acoustic capture.",
    "image": "assets/microphones/12_Neumann_KM183.jpg"
  },
  {
    "id": 14,
    "manufacturer": "Oktava",
    "model": "MK012",
    "type": "Condenser",
    "polar": "Interchangeable capsules: Omni / Cardioid / Hypercardioid",
    "mnemonic": "Short modular pencil condenser with interchangeable capsules.",
    "use": "Acoustic instruments, overheads, stereo techniques.",
    "image": "assets/microphones/14_Oktava_MK012.jpg"
  },
  {
    "id": 15,
    "manufacturer": "Audio Technica",
    "model": "AT4050",
    "type": "Condenser",
    "polar": "Multi-pattern: Omni / Cardioid / Figure-8",
    "mnemonic": "Large black side-address Audio Technica condenser with switchable patterns.",
    "use": "Vocals, overheads, piano, acoustic instruments, room.",
    "image": "assets/microphones/15_Audio_Technica_AT4050.jpg"
  }
];

const FIELD_LABELS = {
  manufacturer: "Manufacturer",
  model: "Model",
  type: "Type",
  polar: "Polar pattern"
};

const QUIZ_FIELDS = ["manufacturer", "model", "type", "polar"];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[character]));
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function uniqueValues(microphones, field) {
  return [...new Set(microphones.map(mic => mic[field]))];
}

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function buildQuestionGroups(mic, microphones) {
  const pools = {
    manufacturer: uniqueValues(microphones, "manufacturer"),
    model: uniqueValues(microphones, "model"),
    type: uniqueValues(microphones, "type"),
    polar: uniqueValues(microphones, "polar")
  };

  return QUIZ_FIELDS.map(field => ({
    field,
    label: FIELD_LABELS[field],
    options: buildOptions(mic[field], pools[field], optionCountFor(field))
  }));
}

function answerMarkup(mic) {
  return QUIZ_FIELDS.map(field => `
    <div class="answer-tile">
      <span>${escapeHtml(FIELD_LABELS[field])}</span>
      <strong>${escapeHtml(mic[field])}</strong>
    </div>
  `).join("");
}

function buildOptions(correct, pool, optionCount) {
  const distractors = shuffle(pool.filter(option => option !== correct)).slice(0, optionCount - 1);
  return shuffle([correct, ...distractors]);
}

function optionCountFor(field) {
  if (field === "type") return 2;
  if (field === "model") return 6;
  return 5;
}

const SUPABASE_URL_KEY = "micQuestSupabaseUrl";
const SUPABASE_KEY_KEY = "micQuestSupabaseAnonKey";
const LOCAL_KEY = "micQuestLocalScores";
const MAX_LOCAL_SCORES = 20;
const MAX_REMOTE_FETCH = 100;
const CONFIG_ENDPOINT = "/api/leaderboard-config";
const DEFAULT_TABLE = "mic_quest_scores";
const BUNDLED_SUPABASE_CONFIG = {
  url: "https://ppeowjccohgqqailxerm.supabase.co",
  anonKey: "sb_publishable_ihREYvW2NDYqOqYwarKm6g_-Vaj0g-G",
  table: DEFAULT_TABLE,
  origin: "bundled"
};

class Leaderboard {
  constructor() {
    this.remoteConfigLoaded = false;
    this.remoteConfig = null;
    this.remoteConfigError = "";
  }

  getManualConfig() {
    const url = normalizeSupabaseUrl(localStorage.getItem(SUPABASE_URL_KEY) || "");
    const anonKey = (localStorage.getItem(SUPABASE_KEY_KEY) || "").trim();
    if (!url || !anonKey) return null;
    return { url, anonKey, table: DEFAULT_TABLE, origin: "saved settings" };
  }

  async getActiveConfig() {
    await this.loadRemoteConfig();
    return this.remoteConfig || this.getManualConfig() || getBundledConfig();
  }

  async getConfigStatus() {
    await this.loadRemoteConfig();

    if (this.remoteConfig) {
      return {
        source: "online",
        message: "Leaderboard: Supabase online via Vercel"
      };
    }

    if (this.remoteConfigError) {
      return {
        source: "error",
        message: this.remoteConfigError
      };
    }

    if (this.getManualConfig()) {
      return {
        source: "online",
        message: "Leaderboard: Supabase online via saved settings"
      };
    }

    if (getBundledConfig()) {
      return {
        source: "online",
        message: "Leaderboard: Supabase online"
      };
    }

    return {
      source: "local",
      message: "Leaderboard: local browser only"
    };
  }

  saveSettings({ url, anonKey }) {
    const cleanUrl = normalizeSupabaseUrl(url);
    const cleanKey = String(anonKey || "").trim();

    if (!cleanUrl && !cleanKey) {
      this.clearSettings();
      return { ok: true, online: false };
    }

    const validation = validateSupabaseConfig(cleanUrl, cleanKey);
    if (!validation.ok) return validation;

    localStorage.setItem(SUPABASE_URL_KEY, cleanUrl);
    localStorage.setItem(SUPABASE_KEY_KEY, cleanKey);
    return { ok: true, online: true };
  }

  clearSettings() {
    localStorage.removeItem(SUPABASE_URL_KEY);
    localStorage.removeItem(SUPABASE_KEY_KEY);
  }

  async listScores() {
    const config = await this.getActiveConfig();
    if (!config) {
      return {
        source: "local",
        message: "Local leaderboard",
        scores: this.getLocalScores()
      };
    }

    try {
      return {
        source: "online",
        message: "Online leaderboard",
        scores: await this.fetchSupabaseScores(config)
      };
    } catch (error) {
      return {
        source: "fallback",
        message: "Online leaderboard unavailable. Showing local scores.",
        error: error.message,
        scores: this.getLocalScores()
      };
    }
  }

  async saveScore(entry) {
    const cleanEntry = normalizeEntry(entry);
    const config = await this.getActiveConfig();

    if (!config) {
      return {
        source: "local",
        message: "Saved locally in this browser",
        scores: this.saveLocalScore(cleanEntry)
      };
    }

    try {
      await this.submitSupabaseScore(config, cleanEntry);
      return {
        source: "online",
        message: "Saved to Supabase",
        scores: await this.fetchSupabaseScores(config)
      };
    } catch (error) {
      return {
        source: "fallback",
        message: "Online save failed. Saved locally instead.",
        error: error.message,
        scores: this.saveLocalScore(cleanEntry)
      };
    }
  }

  getLocalScores() {
    try {
      return normalizeScores(JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"));
    } catch {
      return [];
    }
  }

  saveLocalScore(entry) {
    const scores = [...this.getLocalScores(), normalizeEntry(entry)];
    scores.sort(compareScores);
    const trimmed = scores.slice(0, MAX_LOCAL_SCORES);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(trimmed));
    return trimmed;
  }

  async loadRemoteConfig() {
    if (this.remoteConfigLoaded) return;
    this.remoteConfigLoaded = true;

    if (window.location.protocol === "file:") return;

    try {
      const response = await fetchWithTimeout(CONFIG_ENDPOINT, { cache: "no-store" }, 5000);
      if (response.status === 204 || response.status === 404) return;
      if (!response.ok) throw new Error("Vercel leaderboard config could not be loaded.");

      const data = await response.json();
      const config = {
        url: normalizeSupabaseUrl(data.supabaseUrl),
        anonKey: String(data.anonKey || data.supabaseAnonKey || data.publishableKey || "").trim(),
        table: String(data.table || DEFAULT_TABLE).trim() || DEFAULT_TABLE,
        origin: "Vercel"
      };
      const validation = validateSupabaseConfig(config.url, config.anonKey);
      if (!validation.ok) throw new Error(validation.error);
      this.remoteConfig = config;
    } catch (error) {
      this.remoteConfigError = "Leaderboard: Supabase config unavailable";
    }
  }

  async fetchSupabaseScores(config) {
    const url = supabaseTableUrl(config);
    url.searchParams.set("select", "player_name,score,total,perfect,time_ms,mode,created_at");
    url.searchParams.set("order", "score.desc,perfect.desc,time_ms.asc,created_at.asc");
    url.searchParams.set("limit", String(MAX_REMOTE_FETCH));

    const response = await fetchWithTimeout(url.toString(), {
      headers: supabaseHeaders(config)
    });
    if (!response.ok) throw new Error(await supabaseError(response, "Could not load Supabase scores."));

    const rows = await response.json();
    return normalizeScores(rows.map(rowToEntry));
  }

  async submitSupabaseScore(config, entry) {
    const response = await fetchWithTimeout(supabaseTableUrl(config).toString(), {
      method: "POST",
      headers: {
        ...supabaseHeaders(config),
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(entryToRow(entry))
    });
    if (!response.ok) throw new Error(await supabaseError(response, "Supabase rejected the score."));
  }
}

function renderLeaderboardRows(scores) {
  if (!scores.length) {
    return `<p class="empty-state">No scores yet.</p>`;
  }

  return scores.map((score, index) => `
    <div class="leaderboard-row">
      <strong>#${index + 1} ${escapeHtml(score.name)}</strong>
      <span>${score.score}/${score.total} | ${score.perfect} perfect | ${formatTime(score.time)} | ${escapeHtml(score.mode)}</span>
    </div>
  `).join("");
}

function supabaseTableUrl(config) {
  return new URL(`/rest/v1/${encodeURIComponent(config.table || DEFAULT_TABLE)}`, config.url);
}

function supabaseHeaders(config) {
  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${config.anonKey}`
  };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

async function supabaseError(response, fallback) {
  try {
    const data = await response.json();
    return data.message || data.error || fallback;
  } catch {
    return fallback;
  }
}

function entryToRow(entry) {
  return {
    player_name: entry.name,
    score: entry.score,
    total: entry.total,
    perfect: entry.perfect,
    time_ms: entry.time,
    mode: entry.mode
  };
}

function rowToEntry(row) {
  return {
    name: row.player_name,
    score: row.score,
    total: row.total,
    perfect: row.perfect,
    time: row.time_ms,
    mode: row.mode,
    date: row.created_at
  };
}

function validateSupabaseConfig(url, anonKey) {
  if (!url || !anonKey) {
    return { ok: false, online: false, error: "Add both the Supabase Project URL and anon/publishable key." };
  }

  if (!isHttpUrl(url)) {
    return { ok: false, online: false, error: "Use a full Supabase Project URL, such as https://example.supabase.co." };
  }

  if (anonKey.startsWith("sb_secret_")) {
    return { ok: false, online: false, error: "Use the public anon/publishable key, not a Supabase secret key." };
  }

  const role = jwtRole(anonKey);
  if (role === "service_role") {
    return { ok: false, online: false, error: "Use the anon key, not the service role key." };
  }

  if (anonKey.length < 20) {
    return { ok: false, online: false, error: "The Supabase key looks too short." };
  }

  return { ok: true, online: true };
}

function getBundledConfig() {
  const validation = validateSupabaseConfig(BUNDLED_SUPABASE_CONFIG.url, BUNDLED_SUPABASE_CONFIG.anonKey);
  if (!validation.ok) return null;
  return { ...BUNDLED_SUPABASE_CONFIG };
}

function normalizeEntry(entry) {
  return {
    name: String(entry.name || "Unnamed Team").replace(/[\r\n\t]/g, " ").trim().slice(0, 40) || "Unnamed Team",
    score: clampNumber(entry.score, 0, 60),
    total: clampNumber(entry.total || 60, 1, 60),
    perfect: clampNumber(entry.perfect, 0, 15),
    time: clampNumber(entry.time || entry.timeMs, 0, 3600000),
    mode: String(entry.mode || "").slice(0, 30),
    date: String(entry.date || new Date().toLocaleString()).slice(0, 60)
  };
}

function normalizeScores(scores) {
  return scores.map(normalizeEntry).sort(compareScores).slice(0, MAX_LOCAL_SCORES);
}

function compareScores(a, b) {
  return (b.score - a.score) || (b.perfect - a.perfect) || (a.time - b.time) || String(b.date).localeCompare(String(a.date));
}

function clampNumber(value, min, max) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function normalizeSupabaseUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

function isHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function jwtRole(key) {
  try {
    const payload = key.split(".")[1];
    if (!payload) return "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = JSON.parse(window.atob(padded));
    return String(json.role || "");
  } catch {
    return "";
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[character]));
}

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

class MicQuestGame {
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
  try {
    const response = await fetch("data/microphones.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load data/microphones.json.");
    const data = await response.json();
    if (!Array.isArray(data) || data.length !== 15) {
      throw new Error("The microphone dataset must contain exactly 15 microphones.");
    }
    return data;
  } catch (error) {
    return EMBEDDED_MICROPHONES.map(mic => ({ ...mic }));
  }
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

})();
