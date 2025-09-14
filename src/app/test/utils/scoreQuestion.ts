import {
  abcd,
  AnswerForm,
  AnswerFormValue,
  CoupleingValue,
  IQuestionForm,
  MultipleSelectValue,
  QuestionerValue,
} from "@/app/types/answerForm";
import { normalizeCorrectAnswer, normalizeUserAnswer } from "./normalizeForScore";

export const scoreForQuestion = (
  q: IQuestionForm,
  ansEntry: { type: AnswerForm; value?: AnswerFormValue } | undefined,
  POINT_PER_QUESTION: number
) => {
  const correct = q.correctAnswer;
  const user = ansEntry?.value;
  switch (q.type) {
    case "multiple-choice":
      return normalizeUserAnswer(user) === normalizeCorrectAnswer(correct) ? POINT_PER_QUESTION : 0;
    case "short-answer": {
      const corr = correct as (string | number)[];
      return corr.map((el) => `${el}`).includes(normalizeUserAnswer(user)) ? POINT_PER_QUESTION : 0;
    }
    case "multiple-select": {
      const correctArr = correct as MultipleSelectValue;
      const userAnswer = (user as MultipleSelectValue) || [];
      if (userAnswer && userAnswer.length === 0) return 0;
      const correctSet = new Set(correctArr.map((c: abcd) => normalizeCorrectAnswer(c)));
      const selSet = new Set(userAnswer.map((u: abcd) => normalizeUserAnswer(u)));
      const correctSelected = [...selSet].filter((s) => correctSet.has(s)).length;
      const incorrectSelected = [...selSet].filter((s) => !correctSet.has(s)).length;
      const raw = (correctSelected - incorrectSelected) / correctSet.size;
      const perc = Math.max(0, raw);
      return perc * POINT_PER_QUESTION;
    }
    case "questioner": {
      const correctArr = correct as QuestionerValue;
      const userAnswer = (user as QuestionerValue) || [];
      if (userAnswer && userAnswer.length === 0) return 0;
      const correctMap: Record<string, string> = {};
      correctArr.forEach((c) => {
        const sid = normalizeCorrectAnswer(c.sourceId);
        const val = normalizeCorrectAnswer(c.targetId);
        if (sid) correctMap[sid] = val;
      });
      let matched = 0;
      Object.keys(correctMap).forEach((sid) => {
        const u = userAnswer.find((it) => normalizeUserAnswer(it.sourceId) === sid);
        if (u) {
          const uval = normalizeUserAnswer(u.targetId);
          if (uval === correctMap[sid]) matched++;
        }
      });
      return (matched / Math.max(1, Object.keys(correctMap).length)) * POINT_PER_QUESTION;
    }
    case "coupleing": {
      const correctArr = correct as CoupleingValue;
      const userAnswer = (user as CoupleingValue) || [];

      if (userAnswer && userAnswer.length === 0) return 0;
      const correctMap: Record<string, string> = {};
      correctArr.forEach((c) => {
        const sid = normalizeCorrectAnswer(c.sourceId);
        const tid = normalizeCorrectAnswer(c.targetId);
        if (sid) correctMap[sid] = tid;
      });
      let matched = 0;
      Object.keys(correctMap).forEach((sid) => {
        const u = userAnswer.find((it) => normalizeUserAnswer(it.sourceId) === sid);
        if (u) {
          const utid = normalizeUserAnswer(u.targetId);
          if (utid === correctMap[sid]) matched++;
        }
      });
      return (matched / Math.max(1, Object.keys(correctMap).length)) * POINT_PER_QUESTION;
    }
    default:
      return 0;
  }
};
