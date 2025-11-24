export async function showMainMenu(ui) {
  ui.output.printMenu();

  const choice = await ui.input.getMenuNumber("번호를 선택하세요: ");
  return choice;
}

export async function showCategoryMenu(ui, categories) {
  ui.output.printLine("\n🧩 개발자 용어 퀴즈를 선택하셨군요!");
  ui.output.printLine("카테고리를 선택해주세요.\n");

  categories.forEach((cat, idx) => {
    ui.output.printLine(`  ${idx + 1}) ${cat}`);
  });

  const num = await ui.input.getMenuNumber("번호를 입력하세요: ");
  return categories[num - 1];
}
