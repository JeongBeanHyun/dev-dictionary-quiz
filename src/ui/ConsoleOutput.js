export function printLine(text = "") {
  console.log(text);
}

export function printOptions(options) {
  options.forEach((opt, index) => {
    console.log(`  ${index + 1}) ${opt}`);
  });
}

export function printMenu() {
  console.log("\n====== 메인 메뉴 ======");
  console.log("1) 퀴즈 시작");
  console.log("2) 누적 기록 보기");
  console.log("3) 약점 퀴즈 시작");
  console.log("4) 누적 기록 초기화");
  console.log("5) 종료");
  console.log("========================");
}
