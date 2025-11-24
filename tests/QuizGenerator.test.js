import { jest } from "@jest/globals";

import {
  createMultipleChoiceQuestion,
  checkAnswerByIndex,
  checkAnswerByNumber,
} from "../src/logic/QuizGenerator.js";

jest.mock("../src/utils/ShuffleUtils.js", () => ({
  shuffle: jest.fn((arr) => arr),
}));

describe("QuizGenerator 테스트", () => {
  const correctTerm = {
    id: 1,
    term: "Closure",
    description: "기억된 렉시컬 환경과 함께 함수가 반환되는 JavaScript 기능",
    category: "JavaScript",
  };

  const allTerms = [
    correctTerm,
    {
      id: 2,
      term: "Hoisting",
      description: "선언이 스코프의 최상단으로 끌어올려지는 것처럼 보이는 현상",
      category: "JavaScript",
    },
    {
      id: 3,
      term: "OSI 7 Layer",
      description: "네트워크 통신을 7계층으로 나누어 표현한 모델",
      category: "Network",
    },
    {
      id: 4,
      term: "Garbage Collection",
      description: "더 이상 참조되지 않는 메모리를 자동으로 해제하는 기능",
      category: "CS",
    },
  ];

  test("createMultipleChoiceQuestion()는 정답 term을 포함한 4지선다 문제 객체를 생성해야 한다.", () => {
    const question = createMultipleChoiceQuestion(correctTerm, allTerms);

    expect(question.id).toBe(correctTerm.id);
    expect(question.category).toBe(correctTerm.category);
    expect(question.questionText).toContain(correctTerm.description);

    expect(question.options).toHaveLength(4);

    expect(question.options).toContain(correctTerm.term);

    const uniqueOptions = new Set(question.options);
    expect(uniqueOptions.size).toBe(4);

    expect(question.options[question.correctOptionIndex]).toBe(
      correctTerm.term
    );
  });

  test("createMultipleChoiceQuestion()는 allTerms에서 정답을 제외한 3개의 오답을 선택해야 한다.", () => {
    const question = createMultipleChoiceQuestion(correctTerm, allTerms);

    const wrongOptions = question.options.filter(
      (opt) => opt !== correctTerm.term
    );

    expect(wrongOptions).toHaveLength(3);
    const allWrongTerms = allTerms
      .filter((t) => t.id !== correctTerm.id)
      .map((t) => t.term);

    wrongOptions.forEach((opt) => {
      expect(allWrongTerms).toContain(opt);
    });
  });

  test("checkAnswerByIndex()는 정답 인덱스와 비교해 true/false를 반환해야 한다.", () => {
    const question = createMultipleChoiceQuestion(correctTerm, allTerms);

    const correctIndex = question.correctOptionIndex;
    const wrongIndex = (correctIndex + 1) % question.options.length;

    expect(checkAnswerByIndex(question, correctIndex)).toBe(true);
    expect(checkAnswerByIndex(question, wrongIndex)).toBe(false);
  });

  test("checkAnswerByNumber()는 1부터 시작하는 번호를 인덱스로 변환해 채점해야 한다.", () => {
    const question = createMultipleChoiceQuestion(correctTerm, allTerms);

    const correctNumber = question.correctOptionIndex + 1; // 인덱스 → 1-based 번호
    const wrongNumber =
      ((question.correctOptionIndex + 1) % question.options.length) + 1;

    expect(checkAnswerByNumber(question, correctNumber)).toBe(true);
    expect(checkAnswerByNumber(question, wrongNumber)).toBe(false);
  });
});
