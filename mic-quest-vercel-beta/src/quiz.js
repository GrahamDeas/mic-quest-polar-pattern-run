export const FIELD_LABELS = {
  manufacturer: "Manufacturer",
  model: "Model",
  type: "Type",
  polar: "Polar pattern"
};

export const QUIZ_FIELDS = ["manufacturer", "model", "type", "polar"];

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[character]));
}

export function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function uniqueValues(microphones, field) {
  return [...new Set(microphones.map(mic => mic[field]))];
}

export function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function buildQuestionGroups(mic, microphones) {
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

export function answerMarkup(mic) {
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
