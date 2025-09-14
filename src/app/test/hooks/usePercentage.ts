import { useCallback, useMemo } from "react";
import {
  AnswersMap,
  DomainPercentage,
  KompetensiPercentage,
  SubDomainPercentage,
  TypePercentage,
} from "../types";
import { AnswerForm, IQuestionForm } from "@/app/types/answerForm";
import { scoreForQuestion } from "../utils/scoreQuestion";

export function usePercentageHooks(POINT_PER_QUESTION: number) {
  const LABEL_BY_TYPE: Record<string, string> = useMemo(
    () => ({
      "multiple-choice": "Pilihan Tunggal",
      "multiple-select": "Pilihan Ganda",
      questioner: "Benar/Tidak Benar (Questioner)",
      "short-answer": "Isian Singkat",
      coupleing: "Mencocokkan (Coupleing)",
    }),
    []
  );

  const computeAndSavePercentageByType = useCallback(
    (answers: AnswersMap, questions: IQuestionForm[]) => {
      const byType: Record<string, IQuestionForm[]> = {};
      questions.forEach((q) => {
        if (!byType[q.type]) byType[q.type] = [];
        byType[q.type].push(q);
      });
      const result: TypePercentage[] = Object.keys(byType).map((type) => {
        const items = byType[type];
        const maxTotal = items.length * POINT_PER_QUESTION;
        let obtained = 0;
        let correct = 0;
        let duration = 0;

        items.forEach((q) => {
          const ans = answers[q.id];
          const score = scoreForQuestion(q, ans, POINT_PER_QUESTION);
          obtained += score;
          if (ans && ans.duration) duration += ans.duration || 0;
          if (score === POINT_PER_QUESTION) correct++;
        });

        const percentage = maxTotal === 0 ? 0 : Math.round((obtained / maxTotal) * 10000) / 100;

        return {
          type: type as AnswerForm,
          label: LABEL_BY_TYPE[type],
          percentage,
          totalQuestions: items.length,
          correctQuestions: correct,
          duration,
        };
      });

      localStorage.setItem("percentageByType", JSON.stringify(result));
      return result;
    },
    [LABEL_BY_TYPE, POINT_PER_QUESTION]
  );

  const computeAndSavePercentageByDomain = useCallback(
    (answers: AnswersMap, questions: IQuestionForm[]) => {
      const byDomain: Record<string, IQuestionForm[]> = {};
      questions.forEach((q) => {
        const id = (q as IQuestionForm).domainId ?? "unknown";
        if (!byDomain[id]) byDomain[id] = [];
        byDomain[id].push(q);
      });

      const result: DomainPercentage[] = Object.keys(byDomain).map((id) => {
        const items = byDomain[id];
        const maxTotal = items.length * POINT_PER_QUESTION;
        let obtained = 0;
        let correct = 0;
        let duration = 0;

        items.forEach((q) => {
          const ans = answers[q.id];
          const score = scoreForQuestion(q, ans, POINT_PER_QUESTION);
          obtained += score;
          if (ans && ans.duration) duration += ans.duration || 0;
          if (score === POINT_PER_QUESTION) correct++;
        });

        const percentage = maxTotal === 0 ? 0 : Math.round((obtained / maxTotal) * 10000) / 100;

        return {
          domainId: id,
          domain: (items[0] as IQuestionForm).domain ?? id,
          percentage,
          totalQuestions: items.length,
          correctQuestions: correct,
          duration,
        };
      });

      localStorage.setItem("percentageByDomain", JSON.stringify(result));
      return result;
    },
    [POINT_PER_QUESTION]
  );

  const computeAndSavePercentageBySubDomain = useCallback(
    (answers: AnswersMap, questions: IQuestionForm[]) => {
      const bySub: Record<string, IQuestionForm[]> = {};
      questions.forEach((q) => {
        const id = (q as IQuestionForm).subDomainId ?? "unknown";
        if (!bySub[id]) bySub[id] = [];
        bySub[id].push(q);
      });

      const result: SubDomainPercentage[] = Object.keys(bySub).map((id) => {
        const items = bySub[id];
        const maxTotal = items.length * POINT_PER_QUESTION;
        let obtained = 0;
        let correct = 0;
        let duration = 0;

        items.forEach((q) => {
          const ans = answers[q.id];
          const score = scoreForQuestion(q, ans, POINT_PER_QUESTION);
          obtained += score;
          if (ans && ans.duration) duration += ans.duration || 0;
          if (score === POINT_PER_QUESTION) correct++;
        });

        const percentage = maxTotal === 0 ? 0 : Math.round((obtained / maxTotal) * 10000) / 100;

        return {
          duration,
          subDomainId: id,
          subDomain: (items[0] as IQuestionForm).subDomain ?? id,
          percentage,
          totalQuestions: items.length,
          correctQuestions: correct,
        };
      });

      localStorage.setItem("percentageBySubDomain", JSON.stringify(result));
      return result;
    },
    [POINT_PER_QUESTION]
  );

  const computeAndSavePercentageByKompetensi = useCallback(
    (answers: AnswersMap, questions: IQuestionForm[]) => {
      const byKompetensi: Record<string, IQuestionForm[]> = {};
      questions.forEach((q) => {
        const id = (q as IQuestionForm).kompetensiId ?? "unknown";
        if (!byKompetensi[id]) byKompetensi[id] = [];
        byKompetensi[id].push(q);
      });

      const result: KompetensiPercentage[] = Object.keys(byKompetensi).map((id) => {
        const items = byKompetensi[id];
        const maxTotal = items.length * POINT_PER_QUESTION;
        let obtained = 0;
        let correct = 0;
        let duration = 0;

        items.forEach((q) => {
          const ans = answers[q.id];
          const score = scoreForQuestion(q, ans, POINT_PER_QUESTION);
          obtained += score;
          if (ans && ans.duration) duration += ans.duration || 0;
          if (score === POINT_PER_QUESTION) correct++;
        });

        const percentage = maxTotal === 0 ? 0 : Math.round((obtained / maxTotal) * 10000) / 100;

        return {
          duration,
          kompetensiId: id,
          kompetensi: (items[0] as IQuestionForm).kompetensi ?? id,
          percentage,
          totalQuestions: items.length,
          correctQuestions: correct,
        };
      });

      localStorage.setItem("percentageByKompetensi", JSON.stringify(result));
      return result;
    },
    [POINT_PER_QUESTION]
  );

  return {
    computeAndSavePercentageByDomain,
    computeAndSavePercentageByKompetensi,
    computeAndSavePercentageBySubDomain,
    computeAndSavePercentageByType,
  };
}
