// hooks/useTest.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IQuestionForm,
  AnswerForm,
  AnswerFormValue,
  abcd,
  QuestionerValue,
  ShortAnswerValue,
  CoupleingValue,
} from "@/app/types/answerForm";
import { mapEntitiesToQuestions } from "@/helper/mapSoalFromDB";
import { postRequest } from "@/helper/api";
import { usePercentage } from "./usePercentage";
import { useScoring } from "./useScoring";

type AnswersMap = Record<string, { type: AnswerForm; value: AnswerFormValue; score: number }>;

export function useTest() {
  const params = useSearchParams();
  const router = useRouter();

  const [testData, setTestData] = useState<IQuestionForm[]>([]);
  const [content, setContent] = useState<{ id: string; value: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTime = Number(params.get("duration") || 0);
  const STORAGE_KEY = params.get("name") || "test";

  // aktif question
  const activeItem = useMemo(() => testData[currentIndex], [testData, currentIndex]);

  // aktif content
  const contentActive = useMemo(() => {
    if (!activeItem) return "";
    return content.find((c) => c.id === activeItem.contentId)?.value || "";
  }, [activeItem, content]);

  const { scoreForQuestion } = useScoring();
  const { computeAndSaveAllPercentages } = usePercentage(testData, scoreForQuestion);

  // ------------------- FETCH DATA -------------------
  useEffect(() => {
    const testId = params.get("id");
    if (!testId) return;

    const localTest = localStorage.getItem("soal-aktif-platform-belajar");
    const localContent = localStorage.getItem("content-aktif-platform-belajar");

    if (localTest && localContent) {
      setTestData(JSON.parse(localTest));
      setContent(JSON.parse(localContent));
      setCurrentIndex(0);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token-platform-belajar");

        // fetch soal
        const resTest = await fetch(`/api/question/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resTest.ok) {
          const data = await resTest.json();
          const mappingData = await mapEntitiesToQuestions(data.data);
          setTestData(mappingData);
          localStorage.setItem("soal-aktif-platform-belajar", JSON.stringify(mappingData));
          setCurrentIndex(0);
        } else if (resTest.status === 401) {
          router.replace("/auth");
          return;
        }

        // fetch konten
        const resContent = await fetch(`/api/content/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resContent.ok) {
          const data = await resContent.json();
          const contentDatas = data.data.map((el: { id: string; data: string }) => ({
            id: el.id,
            value: el.data,
          }));
          setContent(contentDatas);
          localStorage.setItem("content-aktif-platform-belajar", JSON.stringify(contentDatas));
        } else if (resContent.status === 401) {
          router.replace("/auth");
          return;
        }
      } catch (err) {
        console.error("Failed to fetch test/content", err);
      }
    };

    fetchData();
  }, [params, router]);

  // ------------------- STORAGE -------------------
  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.answers) setAnswers(parsed.answers);
        if (typeof parsed?.currentIndex === "number") setCurrentIndex(parsed.currentIndex);
      }
    } catch {
      // ignore parse error
    }
  }, [STORAGE_KEY]);

  // persist answers & index
  useEffect(() => {
    try {
      const payload = { answers, currentIndex, updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore quota error
    }
  }, [answers, currentIndex, STORAGE_KEY]);

  // ------------------- HANDLERS -------------------
  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= testData.length) return;
      setCurrentIndex(index);
    },
    [testData]
  );

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < testData.length - 1 ? prev + 1 : prev));
  }, [testData]);

  const setAnswer = useCallback((id: string, type: AnswerForm, value: AnswerFormValue | null) => {
    setAnswers((prev) => {
      const next = { ...prev };
      if (
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        `${value}`.length === 0
      ) {
        delete next[id];
      } else {
        next[id] = { type, value, score: 0 }; // skor dihitung di hook lain
      }
      return next;
    });
  }, []);

  const handleMultipleChoice = useCallback(
    (value: string) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "multiple-choice", value as abcd);
    },
    [activeItem, setAnswer]
  );

  const handleMultipleSelect = useCallback(
    (value: abcd[]) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "multiple-select", value);
    },
    [activeItem, setAnswer]
  );

  const handleShortAnswer = useCallback(
    (value: (string | number)[]) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "short-answer", value as ShortAnswerValue);
    },
    [activeItem, setAnswer]
  );

  const handleQuestioner = useCallback(
    (value: QuestionerValue) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "questioner", value);
    },
    [activeItem, setAnswer]
  );

  const handleCoupleing = useCallback(
    (value: CoupleingValue) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "coupleing", value);
    },
    [activeItem, setAnswer]
  );

  // ------------------- SUBMIT -------------------
  const submitAnswers = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const percentageResult = computeAndSaveAllPercentages(answers);

      const result = {
        maximumScore: testData.length * 5,
        score: (percentageResult.totalPercentage / 100) * (testData.length * 5),
        testName: params.get("navbarTitle") || "Test",
        testTime: "0:00",
      };

      localStorage.setItem("testResult", JSON.stringify(result));

      // kirim ke API
      const currentUser = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
      await postRequest(
        "/test/capaian/create",
        {
          user_id: currentUser.id,
          user_name: currentUser.nama_lengkap,
          test_id: params.get("id"),
          test_name: result.testName,
          skor: result.score,
          jawaban: answers,
        },
        {
          Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
        }
      );

      localStorage.removeItem("soal-aktif-platform-belajar");
      localStorage.removeItem("content-aktif-platform-belajar");
      localStorage.removeItem(STORAGE_KEY);

      router.push(`/skor?id=${params.get("id")}&name=${params.get("navbarTitle")}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, isSubmitting, params, router, STORAGE_KEY, testData.length]);

  // ------------------- RETURN -------------------
  return {
    testData,
    content,
    currentIndex,
    setCurrentIndex,
    goToIndex,
    handleNext,
    answers,
    setAnswer,
    handleMultipleChoice,
    handleMultipleSelect,
    handleShortAnswer,
    handleQuestioner,
    handleCoupleing,
    activeItem,
    contentActive,
    submitAnswers,
    isSubmitting,
  };
}
