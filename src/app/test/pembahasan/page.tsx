"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Container from "@/components/Container";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import BottomNumberNav from "../components/bottomNumberNav";
import BottomNavigation from "../components/bottomNavigation";
import NomerSoal from "../components/nomerSoal";
import Soal from "../components/soal";
import { useTestData } from "../hooks/useTestData";
import { useAnswers } from "../hooks/useAnswers";
import BackNavigation from "@/components/BackNavigation";
import { Jawaban } from "@/app/skor/types";
import SaveButton from "../components/saveButton";

export default function Page() {
  const POINT_PER_QUESTION = useMemo(() => 5, []);
  const params = useSearchParams();
  const storagekeyRef = useRef<string>(params.get("id") || "test");

  const { testData, contentActive, isLoading, currentIndex, activeItem, setCurrentIndex } =
    useTestData(true);

  const hideSaveButton = params.get("hide-save");

  const {
    activeAnswer,
    typeOfAnswer,
    opsiPilihanGanda,
    questionerResource,
    coupleingResource,
    isAnsweredSet,
    setAnswer,
    setAnswers,
  } = useAnswers(activeItem, testData, POINT_PER_QUESTION);

  useEffect(() => {
    const x: { answers: Jawaban; currentIndex: number; updatedAt: number } = JSON.parse(
      localStorage.getItem(storagekeyRef.current) || "{}"
    );
    setAnswers(x.answers);
    setCurrentIndex(0);
  }, [setAnswers, setCurrentIndex]);

  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <BackNavigation label={params.get("navbarTitle") || ""} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <NomerSoal currentIndex={currentIndex} />
        {activeItem && !hideSaveButton && (
          <SaveButton pembahasanId={storagekeyRef.current} questionId={activeItem.id} />
        )}
      </div>
      <Soal
        isPembahasan
        setAnswer={setAnswer}
        contentActive={contentActive}
        activeItem={activeItem}
        activeAnswer={activeAnswer}
        typeOfAnswer={typeOfAnswer}
        opsiPilihanGanda={opsiPilihanGanda}
        questionerResource={questionerResource}
        coupleingResource={coupleingResource}
      />
      <div
        style={{ display: "flex", flexDirection: "column", position: "sticky", bottom: 0, left: 0 }}
      >
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
