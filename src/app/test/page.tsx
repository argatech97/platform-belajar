"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Container from "@/components/Container";
import { useSearchParams } from "next/navigation";
import CloseNavigation from "@/components/CloseNavigation";
import Countdown from "@/components/Countdown";
import ConfirmationButton from "../components/ConfirmationButton";
import Loading from "@/components/Loading";
import { useSecurePage } from "../hooks/useSecurePage";
import BottomNumberNav from "./components/bottomNumberNav";
import BottomNavigation from "./components/bottomNavigation";
import NomerSoal from "./components/nomerSoal";
import Soal from "./components/soal";
import { useTestData } from "./hooks/useTestData";
import { useTimer } from "./hooks/useTimer";
import { useAnswers } from "./hooks/useAnswers";
import { Jawaban } from "../skor/types";
import { useConfirmExit } from "../hooks/useConfirmExit";
import FullscreenPointModal from "@/components/PointModal";

export default function Page() {
  const params = useSearchParams();

  // useSecurePage({ blockCopy: true, blockScreenshot: true });

  const [isStopTimer, setIsStopTimer] = useState(false);

  const POINT_PER_QUESTION = useMemo(() => 5, []);
  const storagekeyRef = useRef<string>(params.get("id") || "test");

  const {
    testData,
    contentActive,
    isLoading,
    currentIndex,
    activeItem,
    setCurrentIndex,
    setIsLoading,
  } = useTestData();
  const { timeLeft, setTimeLeft } = useTimer(
    Number(params.get("duration") || 0),
    params.get("name") || "test"
  );

  const {
    answers,
    activeAnswer,
    typeOfAnswer,
    opsiPilihanGanda,
    questionerResource,
    coupleingResource,
    isAnsweredSet,
    submitAnswers,
    setAnswer,
    setAnswers,
    isDone,
    handleNext,
  } = useAnswers(activeItem, testData, POINT_PER_QUESTION);

  useEffect(() => {
    if (isStopTimer) {
      localStorage.removeItem("soal-aktif-platform-belajar");
      localStorage.removeItem("content-aktif-platform-belajar");
      localStorage.removeItem("testResult");
      localStorage.removeItem("percentageByDomain");
      localStorage.removeItem("percentageByKompetensi");
      localStorage.removeItem("percentageBySubDomain");
      localStorage.removeItem("percentageByType");
      localStorage.removeItem("timeLeft");
      localStorage.removeItem(storagekeyRef.current);
      window.close();
    }
  }, [isStopTimer]);

  const handleClose = useCallback(() => {
    setIsStopTimer(true);
  }, []);

  useEffect(() => {
    if (!currentIndex) {
      setCurrentIndex(0);
    }
  }, [currentIndex, setCurrentIndex]);

  useEffect(() => {
    const x: { answers: Jawaban; currentIndex: number; updatedAt: number } = JSON.parse(
      localStorage.getItem(storagekeyRef.current) || "{}"
    );
    setAnswers(x.answers);
    setCurrentIndex(x.currentIndex);
  }, [setAnswers, setCurrentIndex]);

  // simpan ke localstorage setiap kali answers atau index berubah
  useEffect(() => {
    try {
      const payload = { answers, currentIndex, updatedAt: Date.now() };
      localStorage.setItem(storagekeyRef.current, JSON.stringify(payload));
    } catch (e) {
      alert((e as Error).message);
    }
  }, [answers, currentIndex]);

  useConfirmExit();

  if (isDone)
    return (
      <FullscreenPointModal
        visible={isDone}
        actionButtonLabel={"Lihat Skor"}
        actionButton={function (): void {
          handleNext();
        }}
      />
    );

  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <CloseNavigation onClick={handleClose}>
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
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "black",
              fontWeight: "bold",
              maxWidth: "200px",
            }}
          >
            {params.get("navbarTitle") || ""}
          </p>
          {timeLeft && (
            <Countdown
              isStopTimer={isStopTimer}
              initialTime={timeLeft}
              onEnd={async (x: number) => {
                setIsLoading(true);
                submitAnswers(x)
                  .catch(
                    (err: {
                      isDone: boolean;
                      error: string;
                      dataCapaian: { id: string; test_id: string; test_type_name: string }[];
                    }) => {
                      if (err.isDone) {
                        alert(err.error);
                        setTimeLeft(
                          localStorage.getItem("timeLeft")
                            ? JSON.parse(localStorage.getItem("timeLeft") || "0")
                            : timeLeft
                        );
                        const x = params.get("testType");
                        const y = params.get("id");
                        const capaianId = err.dataCapaian.find(
                          (el) => el.test_id === y && el.test_type_name === x
                        )?.id;
                        if (capaianId) {
                          handleNext(capaianId);
                        } else {
                          window.close();
                        }
                        return;
                      }
                      alert(err);
                      setTimeLeft(
                        localStorage.getItem("timeLeft")
                          ? JSON.parse(localStorage.getItem("timeLeft") || "0")
                          : timeLeft
                      );
                    }
                  )
                  .finally(() => {
                    setIsLoading(false);
                  });
              }}
            />
          )}
          {timeLeft && (
            <ConfirmationButton
              confirmMessage="Apakah kamu yakin ingin mengakhiri tes ini ?"
              onConfirm={() => {
                setIsLoading(true);
                submitAnswers(
                  localStorage.getItem("timeLeft")
                    ? JSON.parse(localStorage.getItem("timeLeft") || "0")
                    : timeLeft
                )
                  .catch(
                    (err: {
                      isDone: boolean;
                      error: string;
                      dataCapaian: { id: string; test_id: string; test_type_name: string }[];
                    }) => {
                      if (err.isDone) {
                        alert(err.error);
                        setTimeLeft(
                          localStorage.getItem("timeLeft")
                            ? JSON.parse(localStorage.getItem("timeLeft") || "0")
                            : timeLeft
                        );
                        const x = params.get("testType");
                        const y = params.get("id");
                        const capaianId = err.dataCapaian.find(
                          (el) => el.test_id === y && el.test_type_name === x
                        )?.id;
                        if (capaianId) {
                          handleNext(capaianId);
                        } else {
                          window.close();
                        }

                        return;
                      }
                      alert(err);
                      setTimeLeft(
                        localStorage.getItem("timeLeft")
                          ? JSON.parse(localStorage.getItem("timeLeft") || "0")
                          : timeLeft
                      );
                    }
                  )
                  .finally(() => {
                    setIsLoading(false);
                  });
                return Promise.resolve();
              }}
              label="Akhiri!"
            />
          )}
        </div>
      </CloseNavigation>
      <NomerSoal currentIndex={currentIndex ? currentIndex : 0} />
      <Soal
        setAnswer={setAnswer}
        contentActive={contentActive}
        activeItem={activeItem}
        activeAnswer={activeAnswer}
        typeOfAnswer={typeOfAnswer}
        opsiPilihanGanda={opsiPilihanGanda}
        questionerResource={questionerResource}
        coupleingResource={coupleingResource}
        stopTimer={isStopTimer}
      />
      <div className="flex flex-col sticky bottom-0 left-0">
        <BottomNavigation
          handleNext={() => setCurrentIndex((i) => (i < testData.length - 1 ? i + 1 : i))}
          handlePrev={() => setCurrentIndex((i) => (i > 0 ? i - 1 : i))}
        />
        <BottomNumberNav
          testData={testData}
          onClick={(index) => setCurrentIndex(index)}
          currentIndex={currentIndex}
          isAnsweredSet={isAnsweredSet}
        />
      </div>
    </Container>
  );
}
