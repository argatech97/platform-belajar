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

export default function Page() {
  const params = useSearchParams();

  //state
  const [jawaban, setJawaban] = useState<
    { idSoal: string; type: AnswerForm; value: AnswerFormValue }[]
  >([]);
  const [idSoalAktif, setIdSoalAktif] = useState<string>();
  const [idKontenAktif, setIdKontenAktif] = useState<string>();
  const [pertanyaanAktif, setPertanyaanAktif] = useState<string>("");
  const [tipeJawaban, setTipeJawaban] = useState<AnswerForm>();
  const [opsiPilihanGanda, setOpsiPilihanGanda] = useState<IOptionWithType[]>();
  const [questionerResource, setQuestionerResource] = useState<{
    source: SourceQuestioner;
    option: OptionQuestioner;
  }>();
  const [coupleingResource, setCoupleingResource] = useState<{
    source: IOption<string>[];
    target: IOption<string>[];
  }>();
  const [typeOfAnswer, setTypeOfAnswer] = useState<"number" | "text">("text");

  // function
  const pilihNomorSoal = useCallback((index: number) => {
    const item = quizDummy.find((item, indexItem) => index === indexItem);
    if (item) {
      setPertanyaanAktif(item?.question || "");
      setTipeJawaban(item?.type);
      if (item.type === "multiple-choice" || item.type === "multiple-select") {
        setOpsiPilihanGanda(item.option);
      } else if (item.type === "questioner") {
        setQuestionerResource({ source: item.source, option: item.option });
      } else if (item.type === "coupleing") {
        setCoupleingResource({ source: item.source, target: item.target });
      } else if (item.type === "short-answer") {
        setTypeOfAnswer(item.typeOfAnswer);
      }
    }
  }, []);

  // memo
  const listNomorSoal = useMemo(() => {
    return quizDummy.map((item, index) => {
      return {
        idSoalAktif: item.id,
        contentId: item.contentId,
        noSoal: index + 1,
        isActive: item.id === idSoalAktif,
        isAnswered: jawaban.find((el) => el.idSoal === item.id) ? true : false,
      };
    });
  }, [idSoalAktif, jawaban]);

  const contentActive = useMemo(() => {
    return content.find((el) => el.id === idKontenAktif)?.value || ``;
  }, [idKontenAktif]);

  const jawabanSoalPilihanGanda = useMemo(() => {
    return jawaban.find((item) => item.idSoal === idSoalAktif && item.type === "multiple-choice")
      ?.value as abcd;
  }, [idSoalAktif, jawaban]);

  const jawabanSoalPilihanGanda2 = useMemo(() => {
    return jawaban.find((item) => item.idSoal === idSoalAktif && item.type === "multiple-select")
      ?.value as abcd[];
  }, [idSoalAktif, jawaban]);

  const jawabanQuestioner = useMemo(() => {
    const x = jawaban.find((item) => item.idSoal === idSoalAktif && item.type === "questioner")
      ?.value as QuestionerValue;
    return x;
  }, [idSoalAktif, jawaban]);

  const jawabanCoupleing = useMemo(() => {
    const x = jawaban.find((item) => item.idSoal === idSoalAktif && item.type === "coupleing")
      ?.value as CoupleingValue;
    return x;
  }, [idSoalAktif, jawaban]);

  const jawabanShortAnswer = useMemo(() => {
    const x = jawaban.find((item) => item.idSoal === idSoalAktif && item.type === "short-answer")
      ?.value as ShortAnswerValue;
    return x;
  }, [idSoalAktif, jawaban]);

  useEffect(() => {
    pilihNomorSoal(0);
  }, [pilihNomorSoal]);

  useEffect(() => {
    console.log({ jawaban });
  }, [jawaban]);
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
          {/* <Countdown minutes={10} onEnd={async () => {}} /> */}
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
        {/* Conetnt */}
        {contentActive && (
          <div
            style={{ color: "black", paddingBottom: "10px" }}
            dangerouslySetInnerHTML={{ __html: contentActive }}
          />
        )}
        {/* Pertanyaan */}
        <div
          style={{ color: "black", paddingBottom: "10px" }}
          dangerouslySetInnerHTML={{ __html: pertanyaanAktif }}
        />
        {tipeJawaban === "multiple-choice" && (
          <MultipleChoice
            selectedOptions={jawabanSoalPilihanGanda}
            options={opsiPilihanGanda || []}
            onClick={(value: string) => {
              if (idSoalAktif) {
                setJawaban((prev) => [
                  ...prev.filter((item) => item.idSoal !== idSoalAktif),
                  { idSoal: idSoalAktif, type: "multiple-choice", value },
                ]);
              }
            }}
          />
        )}
        {tipeJawaban === "multiple-select" && (
          <MultipleSelect
            selectedOptions={jawabanSoalPilihanGanda2}
            options={opsiPilihanGanda || []}
            onClick={(value: abcd[]) => {
              if (idSoalAktif) {
                if (value.length !== 0) {
                  setJawaban((prev) => [
                    ...prev.filter((item) => item.idSoal !== idSoalAktif),
                    { idSoal: idSoalAktif, type: "multiple-select", value },
                  ]);
                } else {
                  setJawaban((prev) => [...prev.filter((item) => item.idSoal !== idSoalAktif)]);
                }
              }
            }}
          />
        )}
        {tipeJawaban === "short-answer" && (
          <ShortAnswer
            value={jawabanShortAnswer || ""}
            type={typeOfAnswer}
            onchange={(value: string | number) => {
              if (idSoalAktif) {
                if (`${value}`.length > 0) {
                  setJawaban((prev) => [
                    ...prev.filter((item) => item.idSoal !== idSoalAktif),
                    { idSoal: idSoalAktif, type: "short-answer", value },
                  ]);
                } else {
                  setJawaban((prev) => [...prev.filter((item) => item.idSoal !== idSoalAktif)]);
                }
              }
            }}
          />
        )}
        {tipeJawaban === "questioner" && (
          <Questioner
            source={questionerResource?.source || []}
            option={questionerResource?.option || []}
            value={jawabanQuestioner || []}
            onClick={(value: QuestionerValue) => {
              if (idSoalAktif) {
                setJawaban((prev) => [
                  ...prev.filter((item) => item.idSoal !== idSoalAktif),
                  { idSoal: idSoalAktif, type: "questioner", value },
                ]);
              }
            }}
          />
        )}
        {tipeJawaban === "coupleing" && (
          <Coupleing
            source={coupleingResource?.source || []}
            target={coupleingResource?.target || []}
            originalValue={jawabanCoupleing || []}
            onSelectCouple={(value: CoupleingValue) => {
              if (value.length === 0 && idSoalAktif) {
                setJawaban((prev) => [...prev.filter((item) => item.idSoal !== idSoalAktif)]);
              } else if (idSoalAktif) {
                setJawaban((prev) => [
                  ...prev.filter((item) => item.idSoal !== idSoalAktif),
                  { idSoal: idSoalAktif, type: "coupleing", value },
                ]);
              }
            }}
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
        }}
      >
        {listNomorSoal.map((item, index) => (
          <CircleButton
            onClick={() => {
              setIdSoalAktif(item.idSoalAktif);
              setIdKontenAktif(item.contentId);
              pilihNomorSoal(index);
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
