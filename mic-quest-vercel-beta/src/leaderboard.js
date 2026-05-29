import { formatTime } from "./quiz.js";

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

export class Leaderboard {
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

export function renderLeaderboardRows(scores) {
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
