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
import { CreatePointHistoryDto, useEarnPoints } from "@/app/hooks/usePointApi";

export function useAnswers(
  activeItem: IQuestionForm,
  testData: IQuestionForm[],
  POINT_PER_QUESTION: number
) {
  const earn = useEarnPoints({
    baseUrl: "/api/point",
  });
  const router = useRouter();
  const params = useSearchParams();
  const point = params.get("point");
  const [isDone, setIsDone] = useState<boolean>(false);
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
    localStorage.removeItem("timeLeft");
  }, []);

  const submitToDB = useCallback(
    async (
      result: TestResult,
      test_id: string,
      test_type_id: string,
      test_type_name: string,
      parent_id?: string
    ) => {
      try {
        const percentageByType = computeAndSavePercentageByType(answers, testData);
        const percentageByDomain = computeAndSavePercentageByDomain(answers, testData);
        const percentageBySubDomain = computeAndSavePercentageBySubDomain(answers, testData);
        const percentageByKompetensi = computeAndSavePercentageByKompetensi(answers, testData);
        const currentUser = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
        const request = await fetch(`/api/test/capaian/creat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
          },
          body: JSON.stringify({
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
            parent_id,
          }),
        });
        if (!request.ok) throw request.statusText;
        const res = await request.json();
        if (res.isDone) throw res;
      } catch (error) {
        throw error;
      }
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

  const handleEarn = useCallback(
    async (point: number, test_id: string, test_name: string) => {
      const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");

      const x: CreatePointHistoryDto = {
        point,
        user_id: user.id,
        is_earned: true,
        relationd_id: test_id,
        activity_name: `Menyelesaikan test, ${test_name}`,
      };
      const token = (localStorage && localStorage.getItem("token-platform-belajar")) || "";

      await earn(x, token);
      setIsDone(true);
    },
    [earn]
  );

  const handleNext = useCallback(() => {
    removeLocalStorage();
    localStorage.setItem(`${params.get("id")}-is-done`, JSON.stringify(true));
    router.replace(`/skor?id=${params.get("id")}&name=${params.get("navbarTitle")}`);
  }, [params, removeLocalStorage, router]);

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

        const id = params.get("id");
        const testName = params.get("navbarTitle");
        await submitToDB(
          result,
          params.get("id") || "",
          params.get("testTypeId") || "",
          params.get("testType") || "",
          params.get("parentId") || undefined
        );
        if (!point) {
          handleNext();
          return;
        }
        if (id && testName) handleEarn(Number(point), id, testName);
        return;
      } catch (error) {
        throw error;
      }
    },
    [
      testData,
      answers,
      POINT_PER_QUESTION,
      createResult,
      params,
      submitToDB,
      point,
      handleEarn,
      handleNext,
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
    isDone,
    handleNext,
  };
}
