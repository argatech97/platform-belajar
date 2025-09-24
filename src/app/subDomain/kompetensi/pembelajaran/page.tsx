"use client";
import BackNavigation from "@/components/BackNavigation";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Tab from "@/components/Tab";
import Materi from "./components/materi";
import Quiz from "./components/quiz";
import PreQuiz from "./components/preQuiz";

interface MateriItem {
  id: string;
  name: string;
  sub_domain_id: string;
  kelas_id: string;
  kompetensi_id: string;
  description?: string;
  point: number;
}

interface QuizItem {
  id: string;
  name: string;
  jumlah_soal?: number;
  durasi_seconds?: number;
  point: number;
}

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

  const [materi, setMateri] = useState<MateriItem[]>([]);
  const [quizId, setQuizId] = useState<string>();
  const [preQuizId, setPreQuizId] = useState<string>();
  const [materiDone, setMateriDone] = useState<string[]>([]);
  const [preQuizDone, setPreQuizDone] = useState<string[]>([]);
  const [quizDone, setQuizDone] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("materi");

  const kompetensiId = params.get("id");

  // ✅ Wrap pakai useCallback
  const fetchMateri = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/learning/materi/${kompetensiId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
        },
      });
      if (!res.ok && res.status === 401) {
        const currentUrl = encodeURIComponent(window.location.href);
        router.replace(`/auth?isNext=${currentUrl}`);
        return;
      }
      const data = await res.json();
      setMateri(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [kompetensiId, router]);

  const fetchMateriDone = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");

      const res = await fetch(`/api/learning/materi/done/${user.id}/${kompetensiId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
        },
      });
      if (!res.ok && res.status === 401) {
        const currentUrl = encodeURIComponent(window.location.href);
        router.replace(`/auth?isNext=${currentUrl}`);
        return;
      }
      const data = await res.json();
      setMateriDone(data.data.map((el: { materi_id: string }) => el.materi_id));
      return data.data;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [kompetensiId, router]);

  const fetchQuizDone = useCallback(
    async (preQuizId: string, quizId: string) => {
      try {
        setLoading(true);
        if (!preQuizId) return;
        const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");

        const prequizRes = await fetch(
          `/api/test/capaian/quiz/${user.id}/${kompetensiId}/${preQuizId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
            },
          }
        );
        const quizRes = await fetch(`/api/test/capaian/quiz/${user.id}/${kompetensiId}/${quizId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
          },
        });
        if (
          (!prequizRes.ok && prequizRes.status === 401) ||
          (!quizRes.ok && quizRes.status === 401)
        ) {
          const currentUrl = encodeURIComponent(window.location.href);
          router.replace(`/auth?isNext=${currentUrl}`);
          return;
        }
        const data1 = await prequizRes.json();
        const data2 = await quizRes.json();
        setQuizDone(data2.map((el: { test_id: string }) => el.test_id));
        setPreQuizDone(data1.map((el: { test_id: string }) => el.test_id));
        return {
          preQuiz: data1,
          quiz: data2,
        };
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [kompetensiId, router]
  );

  const fetchTestTypeId = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/test/type`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
        },
      });
      if (!res.ok && res.status === 401) {
        const currentUrl = encodeURIComponent(window.location.href);
        router.replace(`/auth?isNext=${currentUrl}`);
        return;
      }
      const data = await res.json();
      setQuizId(data.data.find((el: { name: string }) => el.name === "Quiz").id || "");
      setPreQuizId(data.data.find((el: { name: string }) => el.name === "Pre Quiz").id || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/test/parent/${kompetensiId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
        },
      });
      if (!res.ok && res.status === 401) {
        const currentUrl = encodeURIComponent(window.location.href);
        router.replace(`/auth?isNext=${currentUrl}`);
        return;
      }
      const data = await res.json();
      setQuiz(data.data.filter((el: { test_type_id: string }) => el.test_type_id === quizId) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [kompetensiId, quizId, router]);

  // ✅ Handler klik juga pakai useCallback
  const onClickItemMateri = useCallback(
    async (description: string, id: string, point: number) => {
      if (!preQuizId || !quizId) return;
      const res = await fetchQuizDone(preQuizId, quizId);
      if (res?.preQuiz.length === 0) {
        alert("Kamu harus menyelesaikan minimal 1 pre quiz terlebih dahulu untuk melihat materi");
        return;
      }
      router.push(
        `/subDomain/kompetensi/pembelajaran/materi?point=${point}&navbarTitle=${description}&id=${id}&parent_id=${kompetensiId}`
      );
    },
    [fetchQuizDone, kompetensiId, preQuizId, quizId, router]
  );

  const onClickItemQuiz = useCallback(
    async (title: string, id: string, seconds: number, countQuestion: number, point: number) => {
      if (!preQuizId || !quizId) return;
      const res = await fetchQuizDone(preQuizId, quizId);
      const res2 = await fetchMateriDone();
      if (res?.preQuiz.length === 0) {
        alert("Kamu harus menyelesaikan minimal 1 pre quiz terlebih dahulu untuk mengerjakan quiz");
        return;
      }

      if (res2.length !== materi.length) {
        alert("Kamu harus menyelesaikan semua materi terlebih dahulu untuk mengerjakan quiz");
        return;
      }

      window.open(
        `/preparation?point=${point}&total_question=${countQuestion}&navbarTitle=${title}&id=${id}&duration=${seconds}&testType=Quiz&testTypeId=${quizId}&parentId=${kompetensiId}`,
        "_blank"
      );
    },
    [fetchMateriDone, fetchQuizDone, kompetensiId, materi.length, preQuizId, quizId]
  );

  const onClickItemPreQuiz = useCallback(
    (title: string, id: string, seconds: number, countQuestion: number, point: number) => {
      window.open(
        `/preparation?point=${point}&total_question=${countQuestion}&navbarTitle=${title}&id=${id}&duration=${seconds}&testType=Pre Quiz&testTypeId=${preQuizId}&parentId=${kompetensiId}`,
        "_blank"
      );
    },
    [kompetensiId, preQuizId]
  );

  useEffect(() => {
    if (!preQuizId || !quizId) return;

    fetchQuizDone(preQuizId, quizId);
  }, [fetchQuizDone, preQuizId, quizId]);

  useEffect(() => {
    if (!kompetensiId) return;

    const fetchAll = async () => {
      await fetchTestTypeId();
      await fetchMateriDone();
      await fetchMateri();
      await fetchQuiz();
    };

    fetchAll();
  }, [
    fetchMateri,
    fetchMateriDone,
    fetchQuizDone,
    fetchQuiz,
    fetchTestTypeId,
    kompetensiId,
    preQuizId,
    quizId,
  ]);

  // ... (rendering tetap sama)
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
          { label: "Pre Quiz", value: "pre-quiz" },
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
              point: m.point,
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
              point: q.point,
            }))}
            onClickItem={onClickItemQuiz}
          />
        )}
      </div>
      <div style={{ display: activeTab === "pre-quiz" ? "block" : "none" }}>
        {quiz.length === 0 ? (
          <div
            style={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span> Belum ada pre quiz</span>
          </div>
        ) : (
          <PreQuiz
            items={quiz.map((q) => ({
              id: q.id,
              title: q.name,
              countQuestion: q.jumlah_soal || 0,
              minute: (q.durasi_seconds || 0) / 60,
              point: q.point,
            }))}
            onClickItem={onClickItemPreQuiz}
          />
        )}
      </div>
    </Container>
  );
}
