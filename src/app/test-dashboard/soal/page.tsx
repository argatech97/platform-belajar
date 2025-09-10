"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CreateContentButton from "./CreateContentButton";
import CreateQuestionButton from "./CreateQuestionButton";
import CreateQuestionButton2 from "./CreateQuestionButton2";

interface ISoal {
  domain_name: string;
  sub_domain_name: string;
  kompetensi_name: string;
  question_type_name: string;
  question: string;
}

interface IContent {
  id: string;
  data: string;
}

interface Option {
  id: string;
  name: string;
}

const truncate = (str: string, max: number) =>
  str && str.length > max ? str.substring(0, max) + "..." : str;

const QuestionPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = searchParams.get("id");

  const [questions, setQuestions] = useState<ISoal[]>([]);
  const [contents, setContents] = useState<IContent[]>([]);
  const [token, setToken] = useState("");

  const [domains, setDomains] = useState<Option[]>([]);
  const [subDomains, setSubDomains] = useState<Option[]>([]);
  const [kompetensis, setKompetensis] = useState<Option[]>([]);
  const [questionTypes, setQuestionTypes] = useState<Option[]>([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      if (!token) return;
      try {
        let res = await fetch("/api/learning/domain", { headers });
        if (!res.ok) {
          if (res.status === 401) router.push("/auth");
          return;
        }
        setDomains(await res.json());

        res = await fetch("/api/learning/sub-domain", { headers });
        if (!res.ok) {
          if (res.status === 401) router.push("/auth");
          return;
        }
        setSubDomains(await res.json());

        res = await fetch("/api/learning/kompetensi", { headers });
        if (!res.ok) {
          if (res.status === 401) router.push("/auth");
          return;
        }
        setKompetensis(await res.json());

        res = await fetch("/api/question/type/list", { headers });
        if (!res.ok) {
          if (res.status === 401) router.push("/auth");
          return;
        }
        const qt = await res.json();
        setQuestionTypes(qt.data ?? []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [token, router]);

  useEffect(() => {
    const token = localStorage.getItem("token-platform-belajar");
    setToken(token || "");
  }, []);

  useEffect(() => {
    if (!testId || !token) return;

    // Fetch questions
    fetch(`/api/question/${testId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setQuestions(data.data ?? []));

    // Fetch contents
    fetch(`/api/content/${testId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setContents(data.data ?? []));
  }, [testId, token]);

  return (
    <div style={{ padding: "20px", gap: "20px" }}>
      <h2>Daftar Soal & Konten</h2>
      <div
        style={{ padding: "20px 0px", display: "flex", justifyContent: "flex-start", gap: "10px" }}
      >
        <CreateContentButton
          testId={testId!}
          token={token}
          onSuccess={() => {
            // refresh konten setelah create
            fetch(`/api/content/${testId}`, { headers: { Authorization: `Bearer ${token}` } })
              .then((res) => res.json())
              .then((data) => setContents(data.data ?? []));
          }}
        />
        <CreateQuestionButton2
          testId={testId!}
          token={token}
          domains={domains}
          subDomains={subDomains}
          kompetensis={kompetensis}
          questionTypes={questionTypes}
          onSuccess={() => {
            fetch(`/api/question/${testId}`, { headers: { Authorization: `Bearer ${token}` } })
              .then((res) => res.json())
              .then((data) => setQuestions(data.data ?? []));
          }}
        />
      </div>
      {/* Tabel Soal */}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          overflow: "hidden",
          padding: "16px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Soal</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#E6FFEE" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Domain</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Sub Domain</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Kompetensi</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Tipe Soal</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Soal</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "12px", textAlign: "center" }}>
                  Belum ada data
                </td>
              </tr>
            ) : (
              questions.map((q, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px" }}>{truncate(q.domain_name, 50)}</td>
                  <td style={{ padding: "12px" }}>{truncate(q.sub_domain_name, 50)}</td>
                  <td style={{ padding: "12px" }}>{truncate(q.kompetensi_name, 50)}</td>
                  <td style={{ padding: "12px" }}>{truncate(q.question_type_name, 50)}</td>
                  <td style={{ padding: "12px" }}>{truncate(q.question, 50)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Tabel Konten */}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          overflow: "hidden",
          padding: "16px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Konten</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#E6FFEE" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Id</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {contents.length === 0 ? (
              <tr>
                <td style={{ padding: "12px", textAlign: "center" }}>Belum ada data</td>
              </tr>
            ) : (
              contents.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td
                    style={{
                      padding: "12px",
                      cursor: "pointer",
                      color: "#0070f3",
                      textDecoration: "underline",
                    }}
                    title="Klik untuk copy ID"
                    onClick={() => {
                      navigator.clipboard.writeText(c.id);
                    }}
                  >
                    {c.id}
                  </td>
                  <td style={{ padding: "12px" }}>{truncate(c.data, 300)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionPage;
