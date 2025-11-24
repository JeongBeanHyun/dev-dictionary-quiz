import path from "path";

import Dictionary from "../src/logic/Dictionary.js";
import QuestionSelector from "../src/logic/QuestionSelector.js";
import Session from "../src/logic/Session.js";
import {
  loadHistory,
  loadConfig,
  persistSessionResult,
  resetHistory,
} from "../src/logic/Result.js";

import * as input from "../src/ui/ConsoleInput.js";
import * as output from "../src/ui/ConsoleOutput.js";
import { showMainMenu, showCategoryMenu } from "../src/ui/MenuView.js";

function getConfig() {
  return loadConfig(path.resolve("src/data/config.json"));
}

function getQuestionCount(config) {
  return config.questionCount ?? 10;
}

function createUI() {
  return { input, output };
}

function getCategories(dictionary) {
  const terms = dictionary.getAllTerms();
  return [...new Set(terms.map((t) => t.category))];
}

function createAppContext() {
  const dictionary = new Dictionary();
  const config = getConfig();
  const questionCount = getQuestionCount(config);
  const ui = createUI();
  const categories = getCategories(dictionary);

  return { dictionary, config, questionCount, ui, categories };
}

function createSelector(dictionary, history, config) {
  return new QuestionSelector(dictionary, history, config);
}

function createSession(selector, dictionary, ui, count, category, weakMode) {
  return new Session(selector, dictionary, ui, count, category, weakMode);
}

function printPlaySummary(out, history) {
  out.printLine("\n📁 이번 플레이 결과가 누적 기록에 저장되었습니다.");
  out.printLine(
    `총 플레이 횟수: ${history.playCount}, 최고 점수: ${history.bestScore}`
  );
}

async function startNormalQuiz(app) {
  const { dictionary, config, questionCount, ui, categories } = app;

  const selectedCategory = await showCategoryMenu(ui, categories);
  const history = loadHistory();
  const selector = createSelector(dictionary, history, config);

  const session = createSession(
    selector,
    dictionary,
    ui,
    questionCount,
    selectedCategory,
    false
  );

  const result = await session.start();
  const updatedHistory = persistSessionResult(result);
  printPlaySummary(ui.output, updatedHistory);
}

function printHistoryHeader(out, history) {
  out.printLine("\n📊 누적 기록");
  out.printLine(`- 전체 플레이 수: ${history.playCount ?? 0}`);
  out.printLine(`- 최고 점수: ${history.bestScore ?? 0}`);
  out.printLine(`- 마지막 점수: ${history.lastScore ?? 0}`);
}

function printEmptyCategoryStats(out) {
  out.printLine("\n📊 카테고리별 통계");
  out.printLine("  (아직 기록이 없습니다.)");
}

function printCategoryStats(out, categoryStats) {
  out.printLine("\n📊 카테고리별 통계");

  Object.entries(categoryStats).forEach(([cat, stats]) => {
    out.printLine(
      `  [${cat}] 정답: ${stats.correct ?? 0}, 오답: ${
        stats.wrong ?? 0
      }, 시도: ${stats.total ?? 0}`
    );
  });
}

function showHistorySummary(app) {
  const history = loadHistory();
  const { output: out } = app.ui;
  const categoryStats = history.categoryStats ?? {};

  printHistoryHeader(out, history);

  if (Object.keys(categoryStats).length === 0) {
    printEmptyCategoryStats(out);
  } else {
    printCategoryStats(out, categoryStats);
  }
}

async function startWeakQuiz(app) {
  const { dictionary, config, questionCount, ui } = app;

  ui.output.printLine("\n🔥 약점 퀴즈를 시작합니다!");

  const history = loadHistory();
  const selector = createSelector(dictionary, history, config);
  const session = createSession(
    selector,
    dictionary,
    ui,
    questionCount,
    null,
    true
  );

  const result = await session.start();
  persistSessionResult(result);
  ui.output.printLine("\n📁 약점 퀴즈 결과가 저장되었습니다.");
}

function clearHistory(app) {
  resetHistory();
  app.ui.output.printLine("\n🧹 누적 기록이 초기화되었습니다!");
}

function exitProgram(app) {
  app.ui.output.printLine("\n👋 프로그램을 종료합니다.");
}

function printInvalidMenu(app) {
  app.ui.output.printLine("⚠️ 존재하지 않는 메뉴입니다. 다시 선택해주세요.");
}

const menuHandlers = {
  1: startNormalQuiz,
  2: showHistorySummary,
  3: startWeakQuiz,
  4: clearHistory,
};

async function handleMenuChoice(choice, app) {
  const handler = menuHandlers[choice];

  if (handler) {
    await handler(app);
    return true;
  }

  if (choice === 5) {
    exitProgram(app);
    return false;
  }

  printInvalidMenu(app);
  return true;
}

async function runAppLoop(app) {
  const { ui } = app;
  let running = true;

  while (running) {
    const choice = await showMainMenu(ui);
    running = await handleMenuChoice(choice, app);
  }
}

function printWelcome(out) {
  out.printLine("👋 개발자 용어 퀴즈에 오신 것을 환영합니다!");
}

export async function runApp() {
  const app = createAppContext();

  try {
    printWelcome(app.ui.output);
    await runAppLoop(app);
  } finally {
    app.ui.input.closeInput();
  }
}
