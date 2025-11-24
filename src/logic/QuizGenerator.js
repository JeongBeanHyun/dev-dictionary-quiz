import { shuffle } from "../utils/ShuffleUtils.js";

export function createMultipleChoiceQuestion(correctTerm, allTerms) {
  const questionText = `"${correctTerm.description}"\n에 해당하는 용어는 무엇일까요?`;

  const wrongOptions = pickWrongOptions(correctTerm, allTerms, 3);

  const options = shuffle([correctTerm.term, ...wrongOptions]);
  const correctOptionIndex = options.findIndex(
    (option) => option === correctTerm.term
  );

  return {
    id: correctTerm.id,
    category: correctTerm.category,
    questionText,
    options,
    correctOptionIndex,
  };
}

function pickWrongOptions(correctTerm, allTerms, count) {
  const candidates = allTerms.filter((t) => t.term !== correctTerm.term);
  const shuffled = shuffle(candidates);
  return shuffled.slice(0, count).map((t) => t.term);
}

export function checkAnswerByIndex(question, selectedIndex) {
  return question.correctOptionIndex === selectedIndex;
}

export function checkAnswerByNumber(question, selectedNumber) {
  const idx = selectedNumber - 1;
  return checkAnswerByIndex(question, idx);
}
