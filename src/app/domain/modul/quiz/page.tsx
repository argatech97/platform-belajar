"use client";

import React, { useCallback, useMemo, useState } from "react";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import CloseNavigation from "@/components/CloseNavigation";
import Countdown from "@/components/Countdown";
import CircleButton from "@/components/ButtonCircle";
import { AnswerForm, IOptionWithType } from "@/app/types/answerForm";
import MultipleChoice from "@/components/bentukJawaban/MultipleChoice";
import quizDummy from "./questionDummy";

export default function Page() {
  const params = useSearchParams();
  const [indexsAnswered, setIndexAnswered] = useState<number[]>([1, 2]);
  const [indexActive, setIndexActive] = useState<number>(0);
  const [activeQuestion, setActiveQuestion] = useState<string>("");
  const [answerType, setAnswerType] = useState<AnswerForm>();
  const selectQuestoin = useCallback((index: number) => {
    const item = quizDummy.find((item, indexItem) => index === indexItem);
    if (item) {
      setActiveQuestion(item?.content || "");
      setAnswerType(item?.type);
      if (item.type === "multiple-choice") {
        setMultipleChoiceOption(item.option);
      }
    }
  }, []);
  const soal = useMemo(() => {
    return quizDummy.map((item, index) => {
      return {
        noSoal: index + 1,
        isActive: index === indexActive,
        isAnswered: indexsAnswered.includes(index),
      };
    });
  }, [indexActive, indexsAnswered]);
  const [multipleChoiceOption, setMultipleChoiceOption] = useState<IOptionWithType[]>();
  const router = useRouter();
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
          <Countdown minutes={10} />
          <button
            onClick={() => router.push("/skor?navbarTitle=Quiz 1")}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              color: "white",
              background: "#69CA87",
            }}
          >
            Akhiri!
          </button>
        </div>
      </CloseNavigation>
      <div style={{ height: "100%", overflow: "auto", padding: "20px 15px" }}>
        <div style={{ color: "black" }} dangerouslySetInnerHTML={{ __html: activeQuestion }}></div>
        {answerType === "multiple-choice" && (
          <MultipleChoice
            options={multipleChoiceOption || []}
            onClick={function (value: string): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
        {answerType === "multiple-select" && <div></div>}
        {answerType === "short-answer" && <div></div>}
        {answerType === "questioner" && <div></div>}
        {answerType === "coupleing" && <div></div>}
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
        }}
      >
        {soal.map((item, index) => (
          <CircleButton
            onClick={() => {
              setIndexActive(index);
              selectQuestoin(index);
            }}
            key={index}
            isAnswered={item.isAnswered}
            isActive={item.isActive}
            number={item.noSoal}
            width={30}
            height={30}
            fontSize={12}
          />
        ))}
      </div>{" "}
    </Container>
  );
}
