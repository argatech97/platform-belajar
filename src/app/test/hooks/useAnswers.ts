"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postRequest } from "@/helper/api";
import { TestResult, ActiveAnswer } from "../types";
import {
  AnswerForm,
  AnswerFormValue,
  ICoupleing,
  IMultipleChoice,
  IMultipleSelect,
  IOption,
  IOptionWithType,
  IQuestioner,
  IQuestionForm,
  IShortAnswer,
} from "@/app/types/answerForm";
import { usePercentageHooks } from "./usePercentage";
import { calculateTotalScore } from "../utils/calculateTotalScore";
import { scoreForQuestion } from "../utils/scoreQuestion";
import { Jawaban } from "@/app/skor/types";

export function useAnswers(
  activeItem: IQuestionForm,
  testData: IQuestionForm[],
  POINT_PER_QUESTION: number
) {
  const router = useRouter();
  const params = useSearchParams();

  const [answers, setAnswers] = useState<Jawaban>({});
  const [opsiPilihanGanda, setOpsiPilihanGanda] = useState<IOptionWithType[] | undefined>(
    undefined
  );
  const [questionerResource, setQuestionerResource] = useState<
    { source: IOption<string>[]; option: IOption<string>[] } | undefined
  >();
  const [coupleingResource, setCoupleingResource] = useState<
    { source: IOption<string>[]; target: IOption<string>[] } | undefined
  >();
  const [typeOfAnswer, setTypeOfAnswer] = useState<"number" | "text">("text");

  const activeAnswer: ActiveAnswer = useMemo(
    () => (answers && answers[activeItem?.id || ""]) || undefined,
    [answers, activeItem]
  );

  const isAnsweredSet = useMemo(
    () =>
      answers
        ? new Set(Object.keys(answers).filter((el) => answers[el].value !== undefined))
        : new Set(""),
    [answers]
  );

  const {
    computeAndSavePercentageByDomain,
    computeAndSavePercentageByKompetensi,
    computeAndSavePercentageBySubDomain,
    computeAndSavePercentageByType,
  } = usePercentageHooks(POINT_PER_QUESTION);

  const createResult = useCallback(
    (
      score: number,
      testData: IQuestionForm[],
      availableTime: number,
      timeLeft: number,
      testName: string
    ) => {
      const max = testData.length * POINT_PER_QUESTION;
      const elapsedSeconds = (availableTime ?? 0) - (timeLeft ?? 0);
      const result = { maximumScore: max, score, testName, testTime: String(elapsedSeconds) };
      localStorage.setItem("testResult", JSON.stringify(result));
      return result;
    },
    [POINT_PER_QUESTION]
  );

  const removeLocalStorage = useCallback(() => {
    // localStorage.removeItem("soal-aktif-platform-belajar");
    // localStorage.removeItem("content-aktif-platform-belajar");
    localStorage.removeItem("timeLeft");
    // localStorage.removeItem(params.get("name") || "test");
  }, []);

  const submitToDB = useCallback(
    async (result: TestResult, test_id: string, test_type_id: string, test_type_name: string) => {
      const percentageByType = computeAndSavePercentageByType(answers, testData);
      const percentageByDomain = computeAndSavePercentageByDomain(answers, testData);
      const percentageBySubDomain = computeAndSavePercentageBySubDomain(answers, testData);
      const percentageByKompetensi = computeAndSavePercentageByKompetensi(answers, testData);
      const currentUser = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
      console.log("submit to db");
      await postRequest(
        "/test/capaian/create",
        {
          user_id: currentUser.id,
          user_name: currentUser.nama_lengkap,
          test_id,
          test_name: result.testName,
          test_type_id,
          test_type_name,
          skor: result.score,
          time_spent: result.testTime,
          persentase_benar_by_type_answer: JSON.stringify(percentageByType),
          persentase_benar_by_domain: JSON.stringify(percentageByDomain),
          persentase_benar_by_sub_domain: JSON.stringify(percentageBySubDomain),
          persentase_benar_by_kompetensi: JSON.stringify(percentageByKompetensi),
          jawaban: answers,
        },
        {
          Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
        }
      );
    },
    [
      answers,
      testData,
      computeAndSavePercentageByType,
      computeAndSavePercentageByDomain,
      computeAndSavePercentageBySubDomain,
      computeAndSavePercentageByKompetensi,
    ]
  );

  const submitAnswers = useCallback(
    async (timeLeft: number) => {
      try {
        const totalScore = calculateTotalScore(testData, answers, POINT_PER_QUESTION);
        const result = createResult(
          totalScore,
          testData,
          Number(params.get("duration")),
          timeLeft,
          params.get("navbarTitle") || "Test"
        );

        await submitToDB(
          result,
          params.get("id") || "",
          params.get("testTypeId") || "",
          params.get("testType") || ""
        );
        removeLocalStorage();
        localStorage.setItem(`${params.get("navbarTitle")}-is-done`, JSON.stringify(true));
        router.replace(`/skor?id=${params.get("id")}&name=${params.get("navbarTitle")}`);
      } catch (error) {
        alert((error as Error).message);
      }
    },
    [
      testData,
      answers,
      POINT_PER_QUESTION,
      createResult,
      params,
      submitToDB,
      removeLocalStorage,
      router,
    ]
  );

  const setAnswer = useCallback(
    (id: string, type: AnswerForm, value?: AnswerFormValue, duration?: number) => {
      setAnswers((prev) => {
        const next = { ...prev };

        const question = testData?.find((q) => q.id === id);
        let score = 0;

        if (question) {
          score = scoreForQuestion(
            question,
            value ? { type, value } : undefined,
            POINT_PER_QUESTION
          );
        }

        next[id] = { type, value, score, duration };

        return next;
      });
    },
    [POINT_PER_QUESTION, testData]
  );

  useEffect(() => {
    if (!activeItem) return;
    if (activeItem.type === "multiple-choice" || activeItem.type === "multiple-select") {
      setOpsiPilihanGanda((activeItem as IMultipleChoice | IMultipleSelect).option);
    } else {
      setOpsiPilihanGanda(undefined);
    }
    if (activeItem.type === "questioner") {
      setQuestionerResource({
        source: (activeItem as IQuestioner).source,
        option: (activeItem as IQuestioner).target,
      });
    } else {
      setQuestionerResource(undefined);
    }
    if (activeItem.type === "coupleing") {
      setCoupleingResource({
        source: (activeItem as ICoupleing).source,
        target: (activeItem as ICoupleing).target,
      });
    } else {
      setCoupleingResource(undefined);
    }
    if (activeItem.type === "short-answer") {
      setTypeOfAnswer((activeItem as IShortAnswer).typeOfAnswer || "text");
    }
  }, [activeItem]);

  return {
    answers,
    opsiPilihanGanda,
    questionerResource,
    coupleingResource,
    typeOfAnswer,
    activeAnswer,
    isAnsweredSet,
    submitAnswers,
    setAnswer,
    setAnswers,
  };
}
