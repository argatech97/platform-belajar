/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "../../components/Container";
import CloseNavigation from "../../components/CloseNavigation";
import CircleWithInner from "../../components/CircleShape";
import {
  PersentaseBenarByDomain,
  PersentaseBenarByKompetensi,
  PersentaseBenarBySubDomain,
  PersentaseBenarByTypeAnswer,
  Root,
} from "./types";
import Loading from "@/components/Loading";

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 16px",
    gap: "24px",
    fontFamily:
      "Inter, Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial",
    color: "#111827",
  },
  headerCard: {
    width: "100%",
    maxWidth: "920px",
    background: "linear-gradient(135deg, #FFFFFF, #F0F9FF)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  titleRow: { display: "flex", alignItems: "center", gap: "10px" },
  title: { fontWeight: 800, color: "#0f172a" },
  subtitle: { color: "#6b7280" },
  actionsRow: { display: "flex", gap: "8px", marginTop: "8px" },
  buttonPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    outline: "none",
    boxShadow: "0 6px 18px rgba(99,102,241,0.18)",
  },
  btnGradient1: {
    background: "linear-gradient(90deg,#8b5cf6,#06b6d4)",
    color: "#fff",
  },
  btnGradient2: {
    background: "linear-gradient(90deg,#10b981,#06b6d4)",
    color: "#fff",
  },
  btnGhost: {
    background: "#fff",
    border: "1px solid #e6e9ee",
    color: "#374151",
    boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
  },
  sectionWrapper: {
    width: "100%",
    maxWidth: "920px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  sectionCard: {
    background: "#fff",
    padding: "14px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
  },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  itemCard: {
    padding: "12px",
    borderRadius: "12px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.95))",
    boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.02)",
    transition: "transform 0.22s ease, box-shadow 0.22s ease",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  progressBg: {
    width: "100%",
    height: "12px",
    borderRadius: "999px",
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
  },
  floatingBtnWrapper: {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "26px",
    zIndex: 60,
  },
  floatingBtn: {
    padding: "12px 22px",
    borderRadius: "999px",
    fontWeight: 800,
    boxShadow: "0 18px 40px rgba(16,24,40,0.2)",
    cursor: "pointer",
    border: "none",
  },
};

export default function PageGokilInline() {
  const router = useRouter();
  const params = useSearchParams();
  const prefersReduced = useReducedMotion();

  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    maximumScore: number;
    score: number;
    testName: string;
    testTime: string;
  } | null>(null);
  const [percentageByAnswerType, setPercentageByAnswerType] =
    useState<PersentaseBenarByTypeAnswer[]>();
  const [percentageBySubDomain, setPercentageBySubDomain] =
    useState<PersentaseBenarBySubDomain[]>();
  const [percentageByDomain, setPercentageByDomain] = useState<PersentaseBenarByDomain[]>();
  const [percentageByKompetensi, setPercentageByKompetensi] =
    useState<PersentaseBenarByKompetensi[]>();

  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    try {
      const storedName = localStorage.getItem("user_name") || "";
      setUserName(storedName);
    } catch (e) {
      // ignore
      console.log(e);
    }
  }, []);

  useEffect(() => {
    async function fetchResults(capaian_id: string) {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/test/capaian/detail/${capaian_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
          },
        });
        if (!res.ok) {
          router.replace("/auth");
          return;
        }

        const data: Root = await res.json();

        const minutes = Math.floor(Number(data.time_spent) / 60);
        const seconds = Number(data.time_spent) % 60;
        const formattedElapsed = `${minutes} Menit ${seconds.toString().padStart(2, "0")} Detik`;

        const mappedTestResult = {
          maximumScore: Number(data.skor),
          score: Number(data.skor),
          testName: data.test_name,
          testTime: formattedElapsed,
        };

        setTestResult(mappedTestResult);
        localStorage.setItem("testResult", JSON.stringify(mappedTestResult));

        if (data.persentase_benar_by_type_answer) {
          setPercentageByAnswerType(data.persentase_benar_by_type_answer);
          localStorage.setItem(
            "percentageByType",
            JSON.stringify(data.persentase_benar_by_type_answer)
          );
        }
        if (data.persentase_benar_by_sub_domain) {
          setPercentageBySubDomain(data.persentase_benar_by_sub_domain);
          localStorage.setItem(
            "percentageBySubDomain",
            JSON.stringify(data.persentase_benar_by_sub_domain)
          );
        }
        if (data.persentase_benar_by_domain) {
          setPercentageByDomain(data.persentase_benar_by_domain);
          localStorage.setItem(
            "percentageByDomain",
            JSON.stringify(data.persentase_benar_by_domain)
          );
        }
        if (data.persentase_benar_by_kompetensi) {
          setPercentageByKompetensi(data.persentase_benar_by_kompetensi);
          localStorage.setItem(
            "percentageByKompetensi",
            JSON.stringify(data.persentase_benar_by_kompetensi)
          );
        }
      } catch (err) {
        console.error("fetchResults error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    try {
      const capaian_id = params.get("capaian_id");
      if (capaian_id) {
        fetchResults(capaian_id);
        return;
      }
      const lsTestResult = localStorage.getItem("testResult");
      const lsPercentageByType = localStorage.getItem("percentageByType");
      const lsPercentageBySubDomain = localStorage.getItem("percentageBySubDomain");
      const lsPercentageByDomain = localStorage.getItem("percentageByDomain");
      const lsPercentageByKompetensi = localStorage.getItem("percentageByKompetensi");

      if (lsTestResult) setTestResult(JSON.parse(lsTestResult));
      if (lsPercentageByType) setPercentageByAnswerType(JSON.parse(lsPercentageByType));
      if (lsPercentageBySubDomain) setPercentageBySubDomain(JSON.parse(lsPercentageBySubDomain));
      if (lsPercentageByDomain) setPercentageByDomain(JSON.parse(lsPercentageByDomain));
      if (lsPercentageByKompetensi) setPercentageByKompetensi(JSON.parse(lsPercentageByKompetensi));
    } catch (err) {
      console.warn("localStorage read error", err);
      const capaian_id = params.get("capaian_id");
      if (capaian_id) fetchResults(capaian_id);
    }
  }, [params, router]);

  const handleClose = useCallback((noClose?: boolean) => {
    try {
      localStorage.removeItem("testResult");
      localStorage.removeItem("percentageByDomain");
      localStorage.removeItem("percentageByKompetensi");
      localStorage.removeItem("percentageBySubDomain");
      localStorage.removeItem("percentageByType");
    } catch (e) {
      // ignore
    }
    if (!noClose) {
      window.close();
    }
  }, []);

  const sections = useMemo(
    () => [
      {
        title: "🌐 Domain",
        data: percentageByDomain,
        key: "domain",
        colors: ["#34d399", "#10b981"],
      },
      {
        title: "📚 Sub Domain",
        data: percentageBySubDomain,
        key: "subDomain",
        colors: ["#60a5fa", "#3b82f6"],
      },
      {
        title: "💡 Kompetensi",
        data: percentageByKompetensi,
        key: "kompetensi",
        colors: ["#fbbf24", "#f59e0b"],
      },
      {
        title: "📝 Tipe Jawaban",
        data: percentageByAnswerType,
        key: "label",
        colors: ["#c084fc", "#a855f7"],
      },
    ],
    [percentageByAnswerType, percentageByDomain, percentageByKompetensi, percentageBySubDomain]
  );

  const onCopyScore = async () => {
    if (!testResult) return;
    const text = `Skor ${testResult.testName}: ${testResult.score} (${testResult.testTime})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.warn("copy failed", err);
    }
  };

  const openRanking = () => {
    router.push(`/ranking?id=${params.get("id")}&title=${params.get("name")}`);
  };

  const getName = useMemo(() => {
    return params.get("user_name") || userName;
  }, [params, userName]);

  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <CloseNavigation onClick={() => handleClose()}>
        <div style={styles.titleRow}>
          <div style={styles.title}>📊 Hasil Tes</div>
          <div style={{ ...styles.subtitle, marginLeft: 8 }}>{testResult?.testName}</div>
        </div>
      </CloseNavigation>

      <main style={styles.page}>
        <div style={styles.headerCard}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              🎉 Skor Total — <span style={{ color: "#5b21b6" }}>Kerja Keren!</span>
            </div>
            <div style={styles.subtitle}>Selamat atas pencapaianmu 🚀- {getName}</div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              duration: prefersReduced ? 0 : 0.6,
            }}
            style={{ marginTop: 10 }}
          >
            <CircleWithInner
              background={"linear-gradient(135deg,#7C3AED,#06B6D4)"}
              width={160}
              height={160}
              label={testResult ? `${testResult.score}` : "-"}
            />
          </motion.div>

          <div style={{ marginTop: 10, color: "#374151" }}>
            ⏰ Waktu: {testResult?.testTime ?? "-"}
          </div>

          <div style={styles.actionsRow}>
            <button
              onClick={onCopyScore}
              aria-label="Salin skor"
              style={{ ...styles.buttonPrimary, ...styles.btnGradient1 }}
            >
              📋 Salin Skor
            </button>

            <button
              onClick={openRanking}
              aria-label="Lihat ranking"
              style={{ ...styles.buttonPrimary, ...styles.btnGradient2 }}
            >
              🚀 Lihat Ranking
            </button>

            <button
              onClick={() => window.print()}
              aria-label="Cetak hasil"
              style={{ ...styles.buttonPrimary, ...styles.btnGhost }}
            >
              🖨️ Cetak
            </button>
          </div>

          {copied && <div style={{ marginTop: 8, color: "#059669" }}>✔️ Disalin ke clipboard</div>}
        </div>

        <section style={styles.sectionWrapper}>
          <h4 style={{ fontWeight: 800, fontSize: 16 }}>📊 Persentase Jawaban Benar</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sections.map((section, i) => (
              <div key={i} style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <div style={{ fontWeight: 700 }}>{section.title}</div>
                  <div style={{ color: "#6b7280" }}>
                    {section.data ? `${section.data.length} item` : "-"}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                  {!section.data && (
                    <div style={{ color: "#9ca3af" }}>
                      Belum ada data — coba buka lewat link capaian
                    </div>
                  )}

                  {section.data?.map((item: any, idx: number) => {
                    const percent = Math.min(100, Math.max(0, Number(item.percentage || 0)));
                    const correct = Number(item.correctQuestions ?? 0);
                    const total = Number(item.totalQuestions ?? 0);
                    const wrong = Math.max(0, total - correct);

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: prefersReduced ? 0 : -6 }}
                        style={{ ...styles.itemCard }}
                        tabIndex={0}
                        role="group"
                        aria-label={`${section.title} item ${idx + 1}`}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>{item[section.key] ?? "-"}</div>
                          <div style={{ fontWeight: 700 }}>{percent}% 🎯</div>
                        </div>

                        <div style={styles.progressBg} aria-hidden>
                          <div
                            style={{
                              width: `${percent}%`,
                              height: "100%",
                              borderRadius: 999,
                              transition: prefersReduced ? "none" : "width 0.9s ease",
                              background: `linear-gradient(90deg, ${section.colors[0]}, ${section.colors[1]})`,
                            }}
                          />
                        </div>

                        <div
                          style={{
                            marginTop: 10,
                            color: "#4b5563",
                            display: "flex",
                            gap: 12,
                          }}
                        >
                          <div>✅ Benar: {correct}</div>
                          <div>❌ Salah: {wrong}</div>
                          <div>📊 Total: {total}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div style={styles.floatingBtnWrapper}>
        <button
          onClick={openRanking}
          style={{
            ...styles.floatingBtn,
            background: "linear-gradient(90deg,#ec4899,#f59e0b)",
            color: "#fff",
          }}
          aria-label="lihat ranking"
        >
          🚀 Lihat Ranking — Tantang Temanmu!
        </button>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          main, main * { visibility: visible; }
          main { position: absolute; left: 0; top: 0; }
        }
        :focus { outline: 3px solid rgba(99,102,241,0.25); outline-offset: 2px; }
      `}</style>
    </Container>
  );
}
