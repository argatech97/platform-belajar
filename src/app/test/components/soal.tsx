import Coupleing from "@/components/bentukJawaban/Coupleing";
import MultipleChoice from "@/components/bentukJawaban/MultipleChoice";
import MultipleSelect from "@/components/bentukJawaban/MultipleSelect";
import Questioner from "@/components/bentukJawaban/Questioner";
import ShortAnswer from "@/components/bentukJawaban/ShortAnswer";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActiveAnswer } from "../types";
import {
  abcd,
  AnswerForm,
  AnswerFormValue,
  CoupleingValue,
  IOption,
  IOptionWithType,
  IQuestionForm,
  QuestionerValue,
  ShortAnswerValue,
} from "@/app/types/answerForm";
import { formattedElapsed } from "@/helper/formatedElapasedTime";

export default function Soal({
  contentActive,
  activeItem,
  activeAnswer,
  typeOfAnswer,
  opsiPilihanGanda,
  questionerResource,
  coupleingResource,
  setAnswer,
  isPembahasan,
  stopTimer,
}: {
  stopTimer?: boolean;
  isPembahasan?: boolean;
  contentActive?: string;
  activeItem?: IQuestionForm;
  activeAnswer?: ActiveAnswer;
  typeOfAnswer?: "number" | "text";
  opsiPilihanGanda?: IOptionWithType[];
  questionerResource?: {
    source: IOption<string>[];
    option: IOption<string>[];
  };
  coupleingResource?: {
    source: IOption<string>[];
    target: IOption<string>[];
  };
  setAnswer: (id: string, type: AnswerForm, value?: AnswerFormValue, duration?: number) => void;
}) {
  const [duration, setDuration] = useState<number>(1);
  const durationRef = useRef<number>(0);
  const activeAnswerRef = useRef<ActiveAnswer>(undefined);
  const activeItemRef = useRef<IQuestionForm>(undefined);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    activeAnswerRef.current = activeAnswer;
  }, [activeAnswer]);

  useEffect(() => {
    activeItemRef.current = activeItem;
  }, [activeItem]);

  // 🔹 Mulai interval per soal
  useEffect(() => {
    if (!activeItem || isPembahasan) return;

    // mulai dari durasi sebelumnya kalau ada
    const startDuration = activeAnswerRef.current?.duration ?? 0;
    setDuration(startDuration);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeItem, isPembahasan]);

  useEffect(() => {
    if (!activeItemRef.current || isPembahasan) return;
    setAnswer(
      activeItemRef.current.id,
      activeItemRef.current.type,
      activeAnswerRef?.current?.value,
      duration
    );
  }, [isPembahasan, setAnswer, duration]);

  useEffect(() => {
    if (stopTimer && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [stopTimer]);

  // specific typed handlers for each input type
  const handleMultipleChoice = useCallback(
    (value: string) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "multiple-choice", value as abcd, durationRef.current);
    },
    [activeItem, setAnswer]
  );

  const handleMultipleSelect = useCallback(
    (value: abcd[]) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "multiple-select", value, durationRef.current);
    },
    [activeItem, setAnswer]
  );

  const handleShortAnswer = useCallback(
    (value: string | number) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "short-answer", value as ShortAnswerValue, durationRef.current);
    },
    [activeItem, setAnswer]
  );

  const handleQuestioner = useCallback(
    (value: QuestionerValue) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "questioner", value, durationRef.current);
    },
    [activeItem, setAnswer]
  );

  const handleCoupleing = useCallback(
    (value: CoupleingValue) => {
      if (!activeItem) return;
      setAnswer(activeItem.id, "coupleing", value, durationRef.current);
    },
    [activeItem, setAnswer]
  );

  const renderPembahasan = useMemo(
    () =>
      activeItem && activeItem.pembahasan && isPembahasan ? (
        <div
          style={{
            padding: "15px",
            background: "#f6f6f6",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            borderRadius: "10px",
          }}
        >
          <p>
            <b>Pembahasan</b>
          </p>
          <div dangerouslySetInnerHTML={{ __html: activeItem?.pembahasan }}></div>
        </div>
      ) : (
        <></>
      ),
    [activeItem, isPembahasan]
  );

  const renderDuration = useMemo(
    () =>
      activeAnswer && activeAnswer.duration && isPembahasan ? (
        <div
          style={{
            padding: "15px",
            borderRadius: "10px",
            background: "#f6f6f6",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>
            <b>Durasi</b>
          </p>
          {formattedElapsed(`${activeAnswer.duration}`)}
        </div>
      ) : (
        <></>
      ),
    [activeAnswer, isPembahasan]
  );
  return (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        padding: "10px 15px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
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
          kunciJawaban={activeItem.correctAnswer}
          isPembahasan={isPembahasan}
          selectedOptions={(activeAnswer?.value as abcd) || undefined}
          options={opsiPilihanGanda || []}
          onClick={handleMultipleChoice}
        />
      )}
      {activeItem?.type === "multiple-select" && (
        <MultipleSelect
          kunciJawaban={activeItem.correctAnswer}
          isPembahasan={isPembahasan}
          selectedOptions={(activeAnswer?.value as abcd[]) || []}
          options={opsiPilihanGanda || []}
          onClick={handleMultipleSelect}
        />
      )}
      {activeItem?.type === "short-answer" && typeOfAnswer && (
        <ShortAnswer
          kunciJawaban={activeItem.correctAnswer}
          isPembahasan={isPembahasan}
          value={(activeAnswer?.value as ShortAnswerValue) || ""}
          type={typeOfAnswer}
          onchange={handleShortAnswer}
        />
      )}
      {activeItem?.type === "questioner" && (
        <Questioner
          kunciJawaban={activeItem.correctAnswer}
          isPembahasan={isPembahasan}
          source={questionerResource?.source || []}
          option={questionerResource?.option || []}
          value={(activeAnswer?.value as QuestionerValue) || []}
          onClick={handleQuestioner}
        />
      )}
      {activeItem?.type === "coupleing" && (
        <Coupleing
          kunciJawaban={activeItem.correctAnswer}
          isPembahasan={isPembahasan}
          source={coupleingResource?.source || []}
          target={coupleingResource?.target || []}
          originalValue={(activeAnswer?.value as CoupleingValue) || []}
          onSelectCouple={handleCoupleing}
        />
      )}
      {renderDuration}
      {renderPembahasan}
    </div>
  );
}
