"use client";
import BackNavigation from "@/components/BackNavigation";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Tab from "@/components/Tab";
import Materi from "./components/materi";
import Quiz from "./components/quiz";
import { count } from "console";

interface MateriItem {
  id: string;
  name: string;
  sub_domain_id: string;
  kelas_id: string;
  kompetensi_id: string;
  description?: string;
}

interface QuizItem {
  id: string;
  name: string;
  jumlah_soal?: number;
  durasi_seconds?: number;
}

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

  const [materi, setMateri] = useState<MateriItem[]>([]);
  const [testTypeId, setTestTypeId] = useState<string>();
  const [materiDone, setMateriDone] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("materi");

  const kompetensiId = params.get("id");

  useEffect(() => {
    if (!kompetensiId) return;

    const fetchMateri = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/learning/materi/${kompetensiId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
          },
        });
        if (!res.ok && res.status === 401) {
          router.replace("/auth");
          return;
        }
        const data = await res.json();
        setMateri(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMateriDone = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");

        const res = await fetch(`/api/learning/materi/done/${user.id}/${kompetensiId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
          },
        });
        if (!res.ok && res.status === 401) {
          router.replace("/auth");
          return;
        }
        const data = await res.json();
        setMateriDone(data.data.map((el: { materi_id: string }) => el.materi_id));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTestTypeId = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/test/type`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
          },
        });
        if (!res.ok && res.status === 401) {
          router.replace("/auth");
          return;
        }
        const data = await res.json();
        console.log(data);
        setTestTypeId(data.data.find((el: { name: string }) => el.name === "Quiz").id || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/test/parent/${kompetensiId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
          },
        });
        if (!res.ok && res.status === 401) {
          router.replace("/auth");
          return;
        }
        const data = await res.json();
        setQuiz(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAll = async () => {
      await fetchTestTypeId();
      await fetchMateriDone();
      await fetchMateri();
      await fetchQuiz();
    };

    fetchAll();
  }, [kompetensiId, router]);

  const onClickItemMateri = useCallback(
    (description: string, id: string) => {
      router.push(
        `/subDomain/kompetensi/pembelajaran/materi?navbarTitle=${description}&id=${id}&parent_id=${kompetensiId}`
      );
    },
    [kompetensiId, router]
  );

  const onClickItemQuiz = useCallback(
    (title: string, id: string, seconds: number, countQuestion: number) => {
      window.open(
        `/preparation?total_question=${countQuestion}&navbarTitle=${title}&id=${id}&duration=${seconds}&testType=Quiz&testTypeId=${testTypeId}`,
        "_blank"
      );
    },
    [testTypeId]
  );

  return (
    <Container>
      <BackNavigation
        disableBorder={true}
        color="white"
        backgroundColor="#69CA87"
        label="Pembelajaran"
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
        <p style={{ color: "white", lineHeight: "1.5" }}>{params.get("navbarTitle") || ""}</p>
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
        {loading ? (
          <p style={{ padding: "20px", textAlign: "center" }}>Loading materi...</p>
        ) : materi.length === 0 ? (
          <div
            style={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span> Belum ada Materi</span>
          </div>
        ) : (
          <Materi
            materi={materi.map((m) => ({
              id: m.id,
              description: m.name,
              isDone: materiDone.includes(m.id),
            }))}
            onClickItem={onClickItemMateri}
          />
        )}
      </div>
      <div style={{ display: activeTab === "quiz" ? "block" : "none" }}>
        {quiz.length === 0 ? (
          <div
            style={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span> Belum ada quiz</span>
          </div>
        ) : (
          <Quiz
            items={quiz.map((q) => ({
              id: q.id,
              title: q.name,
              countQuestion: q.jumlah_soal || 0,
              minute: (q.durasi_seconds || 0) / 60,
            }))}
            onClickItem={onClickItemQuiz}
          />
        )}
      </div>
    </Container>
  );
}
