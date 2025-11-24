import {
  createMultipleChoiceQuestion,
  checkAnswerByNumber,
} from "./QuizGenerator.js";

export default class Session {
  constructor(
    selector,
    dictionary,
    ui,
    questionCount = 10,
    category = null,
    weakMode = false
  ) {
    this.selector = selector;
    this.dictionary = dictionary;
    this.input = ui.input;
    this.output = ui.output;

    this.questionCount = questionCount;
    this.category = category;
    this.weakMode = weakMode;

    this.score = 0;
    this.questions = [];
  }

  async start() {
    this.output.printLine("\n📚 퀴즈를 시작합니다!");

    const allTerms = this.dictionary.getAllTerms();

    const categoryTerms = this.category
      ? this.dictionary.filterByCategory(this.category)
      : allTerms;

    for (let i = 0; i < this.questionCount; i++) {
      let correctTerm;

      if (this.weakMode) {
        correctTerm = this.selector.pickWeakQuestion();
      } else {
        correctTerm = this.pickRandomFrom(categoryTerms);
      }

      const question = createMultipleChoiceQuestion(correctTerm, allTerms);

      this.questions.push(question);
      await this.askQuestion(question, i + 1);
    }

    this.output.printLine("\n✨ 모든 문제가 끝났습니다!\n");
    this.output.printLine(`당신의 점수: ${this.score} / ${this.questionCount}`);

    return {
      score: this.score,
      total: this.questionCount,
      questions: this.questions,
      category: this.category,
    };
  }

  pickRandomFrom(pool) {
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }

  async askQuestion(question, index) {
    this.output.printLine(`\n[문제 ${index}]`);
    this.output.printLine(question.questionText);
    this.output.printOptions(question.options);

    const userAnswer = await this.input.getNumber("번호를 입력하세요 (1~4): ");

    const isCorrect = checkAnswerByNumber(question, userAnswer);

    question.isCorrect = isCorrect;
    question.userAnswer = userAnswer;

    if (isCorrect) {
      this.output.printLine("✅ 정답입니다!");
      this.score++;
    } else {
      this.output.printLine(
        `❌ 오답입니다! 정답은 "${
          question.options[question.correctOptionIndex]
        }" 입니다.`
      );
    }
  }
}
