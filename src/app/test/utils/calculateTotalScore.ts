import { IQuestionForm } from "@/app/types/answerForm";
import { AnswersMap } from "../types";
import { scoreForQuestion } from "./scoreQuestion";

export function calculateTotalScore(testData: IQuestionForm[], answers: AnswersMap, point: number) {
  let totalScore = 0;
  testData.forEach((q) => {
    totalScore += scoreForQuestion(q, answers[q.id], point);
  });
  return Math.round((totalScore + Number.EPSILON) * 100) / 100;
}
