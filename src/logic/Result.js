import path from "path";
import { readJSON, writeJSON } from "../utils/FileUtils.js";

const HISTORY_PATH = path.resolve("src/data/history.json");
const CONFIG_PATH = path.resolve("src/data/config.json");

export function createInitialHistory() {
  return {
    playCount: 0,
    bestScore: 0,
    lastScore: 0,
    wrongHistory: [],
    questionWeights: {},
    categoryStats: {},
  };
}

export function loadHistory(historyPath = HISTORY_PATH) {
  try {
    return readJSON(historyPath);
  } catch (e) {
    const initial = createInitialHistory();
    writeJSON(historyPath, initial);
    return initial;
  }
}

export function saveHistory(history, historyPath = HISTORY_PATH) {
  writeJSON(historyPath, history);
}

export function loadConfig(configPath = CONFIG_PATH) {
  return readJSON(configPath);
}

export function updateHistoryWithResult(sessionResult, history, config) {
  const updated = { ...history };

  const { score, questions } = sessionResult;
  const wrongAnswerWeightBonus = config.wrongAnswerWeightBonus ?? 1;
  const maxWeight = config.maxWeight ?? 10;

  updated.playCount = (updated.playCount ?? 0) + 1;

  updated.lastScore = score;
  updated.bestScore = Math.max(updated.bestScore ?? 0, score);

  const wrongQuestions = questions.filter((q) => !q.isCorrect);
  const wrongIds = wrongQuestions.map((q) => q.id);

  if (!Array.isArray(updated.wrongHistory)) {
    updated.wrongHistory = [];
  }
  updated.wrongHistory = [...updated.wrongHistory, ...wrongIds];

  if (!updated.questionWeights) {
    updated.questionWeights = {};
  }

  wrongQuestions.forEach((q) => {
    const current = updated.questionWeights[q.id] ?? 0;
    const next = Math.min(current + wrongAnswerWeightBonus, maxWeight);
    updated.questionWeights[q.id] = next;
  });

  if (!updated.categoryStats) {
    updated.categoryStats = {};
  }

  questions.forEach((q) => {
    const cat = q.category ?? "unknown";
    if (!updated.categoryStats[cat]) {
      updated.categoryStats[cat] = { correct: 0, wrong: 0, total: 0 };
    }

    const stat = updated.categoryStats[cat];
    stat.total += 1;

    if (q.isCorrect) stat.correct += 1;
    else stat.wrong += 1;
  });

  return updated;
}

export function persistSessionResult(sessionResult) {
  const history = loadHistory();
  const config = loadConfig();

  const updated = updateHistoryWithResult(sessionResult, history, config);

  saveHistory(updated);

  return updated;
}

export function resetHistory(historyPath = HISTORY_PATH) {
  const initial = createInitialHistory();
  writeJSON(historyPath, initial);
  return initial;
}
