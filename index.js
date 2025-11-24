import path from "path";

import Dictionary from "./src/logic/Dictionary.js";
import QuestionSelector from "./src/logic/QuestionSelector.js";
import Session from "./src/logic/Session.js";
import {
  loadHistory,
  loadConfig,
  persistSessionResult,
  resetHistory,
} from "./src/logic/Result.js";

import * as input from "./src/ui/ConsoleInput.js";
import * as output from "./src/ui/ConsoleOutput.js";
import { showMainMenu, showCategoryMenu } from "./src/ui/MenuView.js";

async function main() {
  const dictionary = new Dictionary();

  const config = loadConfig(path.resolve("src/data/config.json"));
  const questionCount = config.questionCount ?? 10;

  const ui = { input, output };

  const categories = [
    ...new Set(dictionary.getAllTerms().map((t) => t.category)),
  ];

  output.printLine("👋 개발자 용어 퀴즈에 오신 것을 환영합니다!");

  while (true) {
    const choice = await showMainMenu(ui);
    if (choice === 1) {
      const selectedCategory = await showCategoryMenu(ui, categories);

      const history = loadHistory();
      const selector = new QuestionSelector(dictionary, history, config);

      const session = new Session(
        selector,
        dictionary,
        ui,
        questionCount,
        selectedCategory,
        false
      );

      const sessionResult = await session.start();
      const updatedHistory = persistSessionResult(sessionResult);

      output.printLine("\n📁 이번 플레이 결과가 누적 기록에 저장되었습니다.");
      output.printLine(
        `총 플레이 횟수: ${updatedHistory.playCount}, 최고 점수: ${updatedHistory.bestScore}`
      );
    } else if (choice === 2) {
      const history = loadHistory();

      output.printLine("\n📊 누적 기록");
      output.printLine(`- 전체 플레이 수: ${history.playCount ?? 0}`);
      output.printLine(`- 최고 점수: ${history.bestScore ?? 0}`);
      output.printLine(`- 마지막 점수: ${history.lastScore ?? 0}`);
      output.printLine("\n📊 카테고리별 통계");

      const categoryStats = history.categoryStats ?? {};
      Object.entries(categoryStats).forEach(([cat, stats]) => {
        output.printLine(
          `  [${cat}] 정답: ${stats.correct ?? 0}, 오답: ${
            stats.wrong ?? 0
          }, 시도: ${stats.total ?? 0}`
        );
      });
    } else if (choice === 3) {
      output.printLine("\n🔥 약점 퀴즈를 시작합니다!");

      const history = loadHistory();
      const selector = new QuestionSelector(dictionary, history, config);

      const session = new Session(
        selector,
        dictionary,
        ui,
        questionCount,
        null,
        true // 🔥 weakMode ON
      );

      const result = await session.start();
      persistSessionResult(result);
    } else if (choice === 4) {
      resetHistory();
      output.printLine("\n🧹 누적 기록이 초기화되었습니다!");
    } else if (choice === 5) {
      output.printLine("\n👋 프로그램을 종료합니다.");
      break;
    } else {
      output.printLine("⚠️ 존재하지 않는 메뉴입니다. 다시 선택해주세요.");
    }
  }

  input.closeInput();
}

main().catch((err) => {
  console.error("예기치 못한 오류가 발생했습니다:", err);
  input.closeInput();
});
