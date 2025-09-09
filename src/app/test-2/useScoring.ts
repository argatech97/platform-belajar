// hooks/useScoring.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQuestionForm, AnswerFormValue, CoupleingValue } from "@/app/types/answerForm";

/**
 * Hook untuk menghitung skor setiap soal
 */
export function useScoring() {
  const POINT_PER_QUESTION = 5;

  const normalize = (v: any) =>
    typeof v === "string" ? v.trim().toLowerCase() : `${v}`.trim().toLowerCase();

  // ------------------ TIPE PENILAIAN ------------------

  function scoreMultipleChoice(user: AnswerFormValue, correct: AnswerFormValue) {
    return normalize(user) === normalize(correct) ? POINT_PER_QUESTION : 0;
  }

  function scoreMultipleSelect(user: AnswerFormValue, correct: AnswerFormValue) {
    if (!Array.isArray(user) || !Array.isArray(correct)) return 0;
    if (user.length !== correct.length) return 0;
    const sortedUser = [...user].sort().map(normalize);
    const sortedCorrect = [...correct].sort().map(normalize);
    return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect) ? POINT_PER_QUESTION : 0;
  }

  function scoreShortAnswer(user: AnswerFormValue, correct: AnswerFormValue) {
    return normalize(user) === normalize(correct) ? POINT_PER_QUESTION : 0;
  }

  function scoreQuestioner(user: AnswerFormValue, correct: AnswerFormValue) {
    if (!Array.isArray(user) || !Array.isArray(correct)) return 0;
    const userAns = user.map(normalize);
    const correctAns = correct.map(normalize);

    let total = 0;
    correctAns.forEach((el, idx) => {
      if (el === userAns[idx]) total++;
    });

    return (total / correctAns.length) * POINT_PER_QUESTION;
  }

  function scoreCoupleing(user: CoupleingValue, correct: CoupleingValue) {
    if (!Array.isArray(user) || !Array.isArray(correct)) return 0;

    const userCouple = user.map((el) => [normalize(el.sourceId), normalize(el.targetId)]);
    const correctCouple = correct.map((el) => [normalize(el.sourceId), normalize(el.targetId)]);

    let total = 0;
    correctCouple.forEach((el) => {
      if (userCouple.some((x) => x[0] === el[0] && x[1] === el[1])) {
        total++;
      }
    });

    return (total / correctCouple.length) * POINT_PER_QUESTION;
  }

  // ------------------ ENTRY POINT ------------------

  function scoreForQuestion(question: IQuestionForm, userAnswer: any) {
    if (!userAnswer) return 0;

    switch (question.type) {
      case "multiple-choice":
        return scoreMultipleChoice(
          userAnswer.value,
          question.correctAnswer // ✅ bukan question.answer
        );

      case "multiple-select":
        return scoreMultipleSelect(
          userAnswer.value,
          question.correctAnswer // ✅
        );

      case "short-answer":
        return scoreShortAnswer(
          userAnswer.value,
          question.correctAnswer // ✅
        );

      case "questioner":
        return scoreQuestioner(
          userAnswer.value,
          question.correctAnswer // ✅
        );

      case "coupleing":
        return scoreCoupleing(
          userAnswer.value,
          question.correctAnswer // ✅
        );

      default:
        return 0;
    }
  }

  return {
    POINT_PER_QUESTION,
    scoreMultipleChoice,
    scoreMultipleSelect,
    scoreShortAnswer,
    scoreQuestioner,
    scoreCoupleing,
    scoreForQuestion,
  };
}
