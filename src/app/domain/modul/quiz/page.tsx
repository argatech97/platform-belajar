/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import CloseNavigation from "@/components/CloseNavigation";
import Countdown from "@/components/Countdown";
import CircleButton from "@/components/ButtonCircle";
import {
  abcd,
  AnswerForm,
  AnswerFormValue,
  CoupleingValue,
  IOption,
  IOptionWithType,
  OptionQuestioner,
  QuestionerValue,
  ShortAnswerValue,
  SourceQuestioner,
} from "@/app/types/answerForm";
import MultipleChoice from "@/components/bentukJawaban/MultipleChoice";
import { quizDummy, content } from "./questionDummy";
import MultipleSelect from "@/components/bentukJawaban/MultipleSelect";
import Questioner from "@/components/bentukJawaban/Questioner";
import Coupleing from "@/components/bentukJawaban/Coupleing";
import ShortAnswer from "@/components/bentukJawaban/ShortAnswer";
import { time } from "console";

// Refactor notes:
// - use numeric currentIndex instead of separate id states
// - store answers in a dictionary for O(1) lookup
// - persist answers + currentIndex to localStorage
// - submit automatically on countdown end or when user clicks `Akhiri!` with scoring rules
// - adapted to quizDummy schema (correctAnswer property names)

type AnswersMap = Record<string, { type: AnswerForm; value: AnswerFormValue }>;

const STORAGE_KEY = "quiz-state-v1";
const POINT_PER_QUESTION = 5;

type TypePercentage = {
  type: "multiple-choice" | "multiple-select" | "questioner" | "short-answer" | "coupleing";
  label: string;
  percentage: number; // 0..100
  totalQuestions: number;
  correctQuestions: number;
};

type DomainPercentage = {
  domainId: string;
  domain: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
};

type SubDomainPercentage = {
  subDomainId: string;
  subDomain: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
};

const LABEL_BY_TYPE: Record<string, string> = {
  "multiple-choice": "Pilihan Tunggal",
  "multiple-select": "Pilihan Ganda",
  questioner: "Benar/Tidak Benar (Questioner)",
  "short-answer": "Isian Singkat",
  coupleing: "Mencocokkan (Coupleing)",
};
export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

  // state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [opsiPilihanGanda, setOpsiPilihanGanda] = useState<IOptionWithType[] | undefined>(
    undefined
  );
  const [questionerResource, setQuestionerResource] = useState<{
    source: SourceQuestioner;
    option: OptionQuestioner;
  } | null>(null);
  const [coupleingResource, setCoupleingResource] = useState<{
    source: IOption<string>[];
    target: IOption<string>[];
  } | null>(null);
  const [typeOfAnswer, setTypeOfAnswer] = useState<"number" | "text">("text");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // derived: active item and content
  const activeItem = useMemo(() => quizDummy[currentIndex], [currentIndex]);

  const contentActive = useMemo(() => {
    if (!activeItem) return "";
    return content.find((c) => c.id === activeItem.contentId)?.value || "";
  }, [activeItem]);

  const isAnsweredSet = useMemo(() => new Set(Object.keys(answers)), [answers]);

  // expose active answer typed
  const activeAnswer = useMemo(() => answers[activeItem?.id || ""], [answers, activeItem]);

  const availableTime = useMemo(() => 10 * 60, []);

  const [timeLeft, setTimeLeft] = useState<number>();

  useEffect(() => {
    const x = localStorage.getItem("timeLeft")
      ? JSON.parse(localStorage.getItem("timeLeft") || "0")
      : availableTime;
    console.log(x);
    setTimeLeft(x);
  }, [availableTime]);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if (parsed.answers && typeof parsed.answers === "object") {
            setAnswers(parsed.answers);
          }
          if (
            typeof parsed.currentIndex === "number" &&
            parsed.currentIndex >= 0 &&
            parsed.currentIndex < quizDummy.length
          ) {
            setCurrentIndex(parsed.currentIndex);
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // persist whenever answers or currentIndex changes
  useEffect(() => {
    try {
      const payload = { answers, currentIndex, updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore quota errors
    }
  }, [answers, currentIndex]);

  // initialize resources when activeItem changes
  useEffect(() => {
    if (!activeItem) return;

    if (activeItem.type === "multiple-choice" || activeItem.type === "multiple-select") {
      setOpsiPilihanGanda(activeItem.option);
    } else {
      setOpsiPilihanGanda(undefined);
    }

    if (activeItem.type === "questioner") {
      setQuestionerResource({ source: activeItem.source, option: activeItem.option });
    } else {
      setQuestionerResource(null);
    }

    if (activeItem.type === "coupleing") {
      setCoupleingResource({ source: activeItem.source, target: activeItem.target });
    } else {
      setCoupleingResource(null);
    }

    if (activeItem.type === "short-answer") {
      setTypeOfAnswer(activeItem.typeOfAnswer || "text");
    }
  }, [activeItem]);

  // save ke localstorage tiap answer berubah
  useEffect(() => {
    computeAndSavePercentageByType(answers);
    computeAndSavePercentageByDomain(answers);
    computeAndSavePercentageBySubDomain(answers);
  }, [answers]);

  // handlers
  const goToIndex = useCallback((index: number) => {
    if (index < 0 || index >= quizDummy.length) return;
    setCurrentIndex(index);
  }, []);

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
        next[id] = { type, value } as { type: AnswerForm; value: AnswerFormValue };
      }
      return next;
    });
  }, []);

  // specific typed handlers for each input type
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
    (value: string | number) => {
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

  // scoring helpers ------------------------------------------------------
  const normalize = (v: any) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v.trim().toLowerCase();
    return `${v}`.trim().toLowerCase();
  };

  function scoreMultipleChoice(user: any, correct: any) {
    if (correct === undefined || correct === null) return 0;
    return normalize(user) === normalize(correct) ? POINT_PER_QUESTION : 0;
  }

  function scoreShortAnswer(user: any, correctArr: any) {
    if (!correctArr) return 0;
    const correct = Array.isArray(correctArr) ? correctArr[0] : correctArr;
    if (correct === undefined || correct === null) return 0;

    // numeric comparison when expected is number
    const corrNum = Number(correct);
    const userNum = Number(user);
    if (!Number.isNaN(corrNum) && !Number.isNaN(userNum)) {
      return userNum === corrNum ? POINT_PER_QUESTION : 0;
    }

    return normalize(user) === normalize(correct) ? POINT_PER_QUESTION : 0;
  }

  function scoreMultipleSelect(user: any[], correct: any[]) {
    if (!Array.isArray(correct) || correct.length === 0) return 0;
    if (!Array.isArray(user) || user.length === 0) return 0;
    const correctSet = new Set(correct.map((c) => normalize(c)));
    const selectedSet = new Set(user.map((u) => normalize(u)));
    const correctSelected = [...selectedSet].filter((s) => correctSet.has(s)).length;
    const incorrectSelected = [...selectedSet].filter((s) => !correctSet.has(s)).length;
    const raw = (correctSelected - incorrectSelected) / correctSet.size; // can be negative
    const perc = Math.max(0, raw);
    return perc * POINT_PER_QUESTION;
  }

  function scoreQuestioner(user: any[], correct: any[]) {
    // correct: [{ sourceId, value }]
    if (!Array.isArray(correct) || correct.length === 0) return 0;
    if (!Array.isArray(user) || user.length === 0) return 0;

    const correctMap: Record<string, string> = {};
    correct.forEach((it: any) => {
      if (it && typeof it === "object") {
        const sid = normalize(it.sourceId ?? it.source ?? it.id);
        const val = normalize(it.value ?? it.answer ?? it.target);
        if (sid) correctMap[sid] = val;
      }
    });

    let matched = 0;
    Object.keys(correctMap).forEach((sid) => {
      const userItem = (user as any[]).find(
        (u) => normalize(u.sourceId ?? u.source ?? u.id) === sid
      );
      if (userItem) {
        const uval = normalize(userItem.value ?? userItem.answer ?? userItem.target);
        if (uval === correctMap[sid]) matched++;
      }
    });

    const total = Object.keys(correctMap).length || 1;
    return (matched / total) * POINT_PER_QUESTION;
  }

  function scoreCoupleing(user: any[], correct: any[]) {
    // correct: [{ sourceId, targetId }]
    if (!Array.isArray(correct) || correct.length === 0) return 0;
    if (!Array.isArray(user) || user.length === 0) return 0;

    const correctMap: Record<string, string> = {};
    correct.forEach((it: any) => {
      if (it && typeof it === "object") {
        const sid = normalize(it.sourceId ?? it.source ?? it.id);
        const tid = normalize(it.targetId ?? it.target ?? it.answer);
        if (sid) correctMap[sid] = tid;
      }
    });

    let matched = 0;
    Object.keys(correctMap).forEach((sid) => {
      const userItem = (user as any[]).find(
        (u) => normalize(u.sourceId ?? u.source ?? u.id) === sid
      );
      if (userItem) {
        const utid = normalize(userItem.targetId ?? userItem.target ?? userItem.answer);
        if (utid === correctMap[sid]) matched++;
      }
    });

    const total = Object.keys(correctMap).length || 1;
    return (matched / total) * POINT_PER_QUESTION;
  }

  const normalizeForScore = (v: any) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v.trim().toLowerCase();
    return `${v}`.trim().toLowerCase();
  };

  const scoreForQuestion = (q: any, ansEntry: { type: any; value: any } | undefined) => {
    const correct =
      (q as any).correctAnswer ?? (q as any).answer ?? (q as any).correct ?? (q as any).key;
    const user = ansEntry?.value;
    switch (q.type) {
      case "multiple-choice":
        return normalizeForScore(user) === normalizeForScore(correct) ? POINT_PER_QUESTION : 0;
      case "short-answer": {
        const corr = Array.isArray(correct) ? correct[0] : correct;
        if (corr === undefined || corr === null) return 0;
        const corrNum = Number(corr);
        const userNum = Number(user);
        if (!Number.isNaN(corrNum) && !Number.isNaN(userNum)) {
          return userNum === corrNum ? POINT_PER_QUESTION : 0;
        }
        return normalizeForScore(user) === normalizeForScore(corr) ? POINT_PER_QUESTION : 0;
      }
      case "multiple-select": {
        const correctArr = Array.isArray(correct) ? correct : correct ? [correct] : [];
        if (!Array.isArray(user) || correctArr.length === 0) return 0;
        const correctSet = new Set(correctArr.map((c: any) => normalizeForScore(c)));
        const selSet = new Set((user as any[]).map((u: any) => normalizeForScore(u)));
        const correctSelected = [...selSet].filter((s) => correctSet.has(s)).length;
        const incorrectSelected = [...selSet].filter((s) => !correctSet.has(s)).length;
        const raw = (correctSelected - incorrectSelected) / correctSet.size;
        const perc = Math.max(0, raw);
        return perc * POINT_PER_QUESTION;
      }
      case "questioner": {
        const correctArr = Array.isArray(correct) ? correct : [];
        if (!Array.isArray(user) || correctArr.length === 0) return 0;
        const correctMap: Record<string, string> = {};
        correctArr.forEach((c: any) => {
          const sid = normalizeForScore(c.sourceId ?? c.source ?? c.id);
          const val = normalizeForScore(c.value ?? c.answer ?? c.target);
          if (sid) correctMap[sid] = val;
        });
        let matched = 0;
        Object.keys(correctMap).forEach((sid) => {
          const u = (user as any[]).find(
            (it) => normalizeForScore(it.sourceId ?? it.source ?? it.id) === sid
          );
          if (u) {
            const uval = normalizeForScore(u.value ?? u.answer ?? u.target);
            if (uval === correctMap[sid]) matched++;
          }
        });
        return (matched / Math.max(1, Object.keys(correctMap).length)) * POINT_PER_QUESTION;
      }
      case "coupleing": {
        const correctArr = Array.isArray(correct) ? correct : [];
        if (!Array.isArray(user) || correctArr.length === 0) return 0;
        const correctMap: Record<string, string> = {};
        correctArr.forEach((c: any) => {
          const sid = normalizeForScore(c.sourceId ?? c.source ?? c.id);
          const tid = normalizeForScore(c.targetId ?? c.target ?? c.answer);
          if (sid) correctMap[sid] = tid;
        });
        let matched = 0;
        Object.keys(correctMap).forEach((sid) => {
          const u = (user as any[]).find(
            (it) => normalizeForScore(it.sourceId ?? it.source ?? it.id) === sid
          );
          if (u) {
            const utid = normalizeForScore(u.targetId ?? u.target ?? u.answer);
            if (utid === correctMap[sid]) matched++;
          }
        });
        return (matched / Math.max(1, Object.keys(correctMap).length)) * POINT_PER_QUESTION;
      }
      default:
        return 0;
    }
  };

  const computeAndSavePercentageByType = useCallback((answers: AnswersMap) => {
    const byType: Record<string, any[]> = {};
    quizDummy.forEach((q) => {
      if (!byType[q.type]) byType[q.type] = [];
      byType[q.type].push(q);
    });

    const result: TypePercentage[] = Object.keys(byType).map((type) => {
      const items = byType[type];
      const maxTotal = items.length * POINT_PER_QUESTION;
      let obtained = 0;
      let correct = 0;

      items.forEach((q) => {
        const ans = answers[q.id];
        const score = scoreForQuestion(q, ans);
        obtained += score;
        if (score === POINT_PER_QUESTION) correct++;
      });

      const percentage = maxTotal === 0 ? 0 : Math.round((obtained / maxTotal) * 10000) / 100;

      return {
        type: type as AnswerForm,
        label: LABEL_BY_TYPE[type],
        percentage,
        totalQuestions: items.length,
        correctQuestions: correct,
      };
    });

    localStorage.setItem("percentageByType", JSON.stringify(result));
    return result;
  }, []);

  const computeAndSavePercentageByDomain = useCallback((answers: AnswersMap) => {
    const byDomain: Record<string, any[]> = {};
    quizDummy.forEach((q) => {
      const id = (q as any).domainId ?? "unknown";
      if (!byDomain[id]) byDomain[id] = [];
      byDomain[id].push(q);
    });

    const result: DomainPercentage[] = Object.keys(byDomain).map((id) => {
      const items = byDomain[id];
      const maxTotal = items.length * POINT_PER_QUESTION;
      let obtained = 0;
      let correct = 0;

      items.forEach((q) => {
        const ans = answers[q.id];
        const score = scoreForQuestion(q, ans);
        obtained += score;
        if (score === POINT_PER_QUESTION) correct++;
      });

      const percentage = maxTotal === 0 ? 0 : Math.round((obtained / maxTotal) * 10000) / 100;

      return {
        domainId: id,
        domain: (items[0] as any).domain ?? id,
        percentage,
        totalQuestions: items.length,
        correctQuestions: correct,
      };
    });

    localStorage.setItem("percentageByDomain", JSON.stringify(result));
    return result;
  }, []);

  const computeAndSavePercentageBySubDomain = useCallback((answers: AnswersMap) => {
    const bySub: Record<string, any[]> = {};
    quizDummy.forEach((q) => {
      const id = (q as any).subDomainId ?? "unknown";
      if (!bySub[id]) bySub[id] = [];
      bySub[id].push(q);
    });

    const result: SubDomainPercentage[] = Object.keys(bySub).map((id) => {
      const items = bySub[id];
      const maxTotal = items.length * POINT_PER_QUESTION;
      let obtained = 0;
      let correct = 0;

      items.forEach((q) => {
        const ans = answers[q.id];
        const score = scoreForQuestion(q, ans);
        obtained += score;
        if (score === POINT_PER_QUESTION) correct++;
      });

      const percentage = maxTotal === 0 ? 0 : Math.round((obtained / maxTotal) * 10000) / 100;

      return {
        subDomainId: id,
        subDomain: (items[0] as any).subDomain ?? id,
        percentage,
        totalQuestions: items.length,
        correctQuestions: correct,
      };
    });

    localStorage.setItem("percentageBySubDomain", JSON.stringify(result));
    return result;
  }, []);

  // main submit function -------------------------------------------------
  const submitAnswers = useCallback(
    async (timeLeft: number) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        let totalScore = 0;
        // iterate through quizDummy to compute per-question score
        quizDummy.forEach((q) => {
          const qId = q.id;
          const ans = answers[qId];
          const correct =
            (q as any).correctAnswer ?? (q as any).answer ?? (q as any).correct ?? (q as any).key;
          if (!q.type) return;
          switch (q.type) {
            case "multiple-choice":
              totalScore += scoreMultipleChoice(ans?.value, correct);
              break;
            case "short-answer":
              totalScore += scoreShortAnswer(ans?.value, correct);
              break;
            case "multiple-select":
              totalScore += scoreMultipleSelect((ans?.value as any[]) || [], correct || []);
              break;
            case "coupleing":
              totalScore += scoreCoupleing((ans?.value as any[]) || [], correct || []);
              break;
            case "questioner":
              totalScore += scoreQuestioner((ans?.value as any[]) || [], correct || []);
              break;
            default:
              break;
          }
        });

        // round to 2 decimals
        const rounded = Math.round((totalScore + Number.EPSILON) * 100) / 100;

        const testName = params.get("navbarTitle") || "Test";
        const max = quizDummy.length * POINT_PER_QUESTION;
        const elapsedSeconds = (availableTime ?? 0) - (timeLeft ?? 0);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        const formattedElapsed = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        const result = {
          maximumScore: max,
          score: rounded,
          testName,
          testTime: formattedElapsed,
        };
        // clear saved state
        try {
          // di dalam submitAnswers, sebelum menghapus storage:
          localStorage.setItem("testResult", JSON.stringify(result));
          computeAndSavePercentageByType(answers);
          computeAndSavePercentageByDomain(answers);
          computeAndSavePercentageBySubDomain(answers);
          setTimeLeft(undefined);
          localStorage.removeItem("timeLeft");
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          // ignore
        }

        // navigate to score page with score data as query params
        router.push(`/skor?closePath=/domain/modul`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      answers,
      availableTime,
      computeAndSavePercentageByDomain,
      computeAndSavePercentageBySubDomain,
      computeAndSavePercentageByType,
      isSubmitting,
      params,
      router,
      scoreCoupleing,
      scoreMultipleChoice,
      scoreMultipleSelect,
      scoreQuestioner,
      scoreShortAnswer,
    ]
  );

  // render
  return (
    <Container>
      <CloseNavigation>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <p
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: "black",
            }}
          >
            <b>{params.get("navbarTitle") || ""}</b>
          </p>
          {/* pass submit handler to Countdown as onEnd/onComplete if supported */}
          {timeLeft && (
            <Countdown
              timeLeft={timeLeft}
              onEnd={submitAnswers}
              onChange={(timeLeft: number) => {
                setTimeLeft(timeLeft);
              }}
            />
          )}
          {timeLeft && (
            <button
              onClick={() => submitAnswers(timeLeft)}
              disabled={isSubmitting}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                color: "white",
                background: "#69CA87",
              }}
            >
              {isSubmitting ? "Mengirim..." : "Akhiri!"}
            </button>
          )}
        </div>
      </CloseNavigation>

      <div style={{ height: "100%", overflow: "auto", padding: "20px 15px" }}>
        {contentActive && (
          <div
            style={{ color: "black", paddingBottom: "10px" }}
            dangerouslySetInnerHTML={{ __html: contentActive }}
          />
        )}

        <div
          style={{ color: "black", paddingBottom: "10px" }}
          dangerouslySetInnerHTML={{ __html: activeItem?.question || "" }}
        />

        {activeItem?.type === "multiple-choice" && (
          <MultipleChoice
            selectedOptions={(activeAnswer?.value as abcd) || undefined}
            options={opsiPilihanGanda || []}
            onClick={handleMultipleChoice}
          />
        )}

        {activeItem?.type === "multiple-select" && (
          <MultipleSelect
            selectedOptions={(activeAnswer?.value as abcd[]) || []}
            options={opsiPilihanGanda || []}
            onClick={handleMultipleSelect}
          />
        )}

        {activeItem?.type === "short-answer" && (
          <ShortAnswer
            value={(activeAnswer?.value as ShortAnswerValue) || ""}
            type={typeOfAnswer}
            onchange={handleShortAnswer}
          />
        )}

        {activeItem?.type === "questioner" && (
          <Questioner
            source={questionerResource?.source || []}
            option={questionerResource?.option || []}
            value={(activeAnswer?.value as QuestionerValue) || []}
            onClick={handleQuestioner}
          />
        )}

        {activeItem?.type === "coupleing" && (
          <Coupleing
            source={coupleingResource?.source || []}
            target={coupleingResource?.target || []}
            originalValue={(activeAnswer?.value as CoupleingValue) || []}
            onSelectCouple={handleCoupleing}
          />
        )}
      </div>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          borderTop: "0.5px solid #c6c6c6",
          padding: "15px 10px",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {quizDummy.map((item, index) => (
          <CircleButton
            key={item.id}
            onClick={() => {
              goToIndex(index);
            }}
            isAnswered={isAnsweredSet.has(item.id)}
            isActive={index === currentIndex}
            number={index + 1}
            width={30}
            height={30}
            fontSize={12}
          />
        ))}
      </div>
    </Container>
  );
}
