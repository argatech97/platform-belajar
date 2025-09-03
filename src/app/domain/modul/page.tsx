"use client";
import BackNavigation from "@/components/BackNavigation";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import Tab from "@/components/Tab";
import Materi from "./components/materi";
import Quiz from "./components/quiz";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const materi = useMemo(() => {
    return [
      {
        isDone: false,
        description:
          "Unsur intrinsik teks fiksi : tokoh(siapa), latar (kapan, di mana), alur (apa, mengapa, bagaimana)",
        id: "1",
      },
      { isDone: false, description: "Gagasan pokok dan informasi tersurat dalam teks", id: "2" },
    ];
  }, []);
  const quiz = useMemo(() => {
    return [
      {
        title: "Quiz 1",
        countQuestion: 10,
        minute: 60,
        id: "1",
      },
    ];
  }, []);
  const [activeTab, setActiveTab] = React.useState("materi");
  const onClickItemMateri = useCallback(
    (description: string, id: string) => {
      router.push(`/domain/modul/materi?navbarTitle=${description}&id=${id}`);
    },
    [router]
  );

  const onClickItemQuiz = useCallback(
    (title: string, id: string) => {
      router.push(`/domain/modul/quiz?navbarTitle=${title}&id=${id}`);
    },
    [router]
  );

  return (
    <Container>
      <BackNavigation
        disableBorder={true}
        color="white"
        backgroundColor="#69CA87"
        label={params.get("navbarTitle") || ""}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 20px 15px",
          gap: "10px",
          backgroundColor: "#69CA87",
        }}
      >
        <p style={{ color: "white", lineHeight: "1.5" }}>
          Menemukan informasi tersurat (siapa, kapan, dimana, mengapa, bagaimana) pada teks fiksi
        </p>
        <p style={{ color: "white", fontWeight: "bold" }}>
          <u>Detail</u>
        </p>
      </div>
      <Tab
        initialActiveTab="materi"
        primaryColor="#C6C6C6"
        tabList={[
          { label: "Materi", value: "materi" },
          { label: "Quiz", value: "quiz" },
        ]}
        tabOnChange={function (value: string): void {
          setActiveTab(value);
        }}
      />
      <div style={{ display: activeTab === "materi" ? "block" : "none" }}>
        <Materi materi={materi} onClickItem={onClickItemMateri} />
      </div>
      <div style={{ display: activeTab === "quiz" ? "block" : "none" }}>
        <Quiz items={quiz} onClickItem={onClickItemQuiz} />
      </div>
    </Container>
  );
}
