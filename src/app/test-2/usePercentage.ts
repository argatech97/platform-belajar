/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/usePercentage.ts
import { IQuestionForm } from "@/app/types/answerForm";

interface IPercentageResult {
  byType: Record<string, number>;
  byDomain: Record<string, number>;
  bySubDomain: Record<string, number>;
  byContent: Record<string, number>;
  totalPercentage: number;
}

export function usePercentage(
  testData: IQuestionForm[],
  scoreForQuestion: (q: IQuestionForm, ans: any) => number
) {
  const computeAndSaveAllPercentages = (answers: any): IPercentageResult => {
    if (!testData.length) {
      return {
        byType: {},
        byDomain: {},
        bySubDomain: {},
        byContent: {},
        totalPercentage: 0,
      };
    }

    const result: IPercentageResult = {
      byType: {},
      byDomain: {},
      bySubDomain: {},
      byContent: {},
      totalPercentage: 0,
    };

    let totalScore = 0;

    testData.forEach((q) => {
      const score = scoreForQuestion(q, answers[q.id]);
      totalScore += score;

      if (!result.byType[q.type]) result.byType[q.type] = 0;
      result.byType[q.type] += score;

      if (!result.byDomain[q.domain]) result.byDomain[q.domain] = 0;
      result.byDomain[q.domain] += score;

      if (!result.bySubDomain[q.subDomain]) result.bySubDomain[q.subDomain] = 0;
      result.bySubDomain[q.subDomain] += score;

      if (q.contentId) {
        if (!result.byContent[q.contentId]) result.byContent[q.contentId] = 0;
        result.byContent[q.contentId] += score;
      }
    });

    const maxScore = testData.length * 5;
    result.totalPercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    Object.keys(result.byType).forEach((k) => {
      const typeCount = testData.filter((q) => q.type === k).length;
      result.byType[k] = typeCount > 0 ? (result.byType[k] / (typeCount * 5)) * 100 : 0;
    });

    Object.keys(result.byDomain).forEach((k) => {
      const domainCount = testData.filter((q) => q.domain === k).length;
      result.byDomain[k] = domainCount > 0 ? (result.byDomain[k] / (domainCount * 5)) * 100 : 0;
    });

    Object.keys(result.bySubDomain).forEach((k) => {
      const subCount = testData.filter((q) => q.subDomain === k).length;
      result.bySubDomain[k] = subCount > 0 ? (result.bySubDomain[k] / (subCount * 5)) * 100 : 0;
    });

    Object.keys(result.byContent).forEach((k) => {
      const contentCount = testData.filter((q) => q.contentId === k).length;
      result.byContent[k] = contentCount > 0 ? (result.byContent[k] / (contentCount * 5)) * 100 : 0;
    });

    localStorage.setItem("percentageResult", JSON.stringify(result));
    return result;
  };

  return { computeAndSaveAllPercentages };
}
