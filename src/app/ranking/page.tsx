/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Container from "@/components/Container";
import Loading from "@/components/Loading";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";

/** --- types sesuai yang kamu kirim --- */
export interface PersentaseBenarByDomain {
  domainId: string;
  domain: string;
  percentage: number;
  totalQuestions: number;
  correctQuestions: number;
}

export interface Root {
  id: string;
  test_id: string;
  test_name: string;
  test_type_id: string;
  test_type_name: string;
  skor: string; // API memberikan string
  time_left: string;
  persentase_benar_by_domain: PersentaseBenarByDomain[];
  persentase_benar_by_sub_domain: any[];
  persentase_benar_by_type_answer: any[];
  persentase_benar_by_kompetensi: any[];
  jawaban: any;
  user_id: string;
  user_name: string;
}
/** ----------------------------------- */

export default function Page() {
  const params = useSearchParams();
  const id = params.get("id");
  const name = params.get("title") || "Try Out";

  const [participants, setParticipants] = useState<Root[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/test/capaian/rank/${id}`);
        const json = (await res.json()) as any;

        // expecting json: Root[]
        if (Array.isArray(json)) {
          setParticipants(json as Root[]);
        } else {
          console.warn("Response bukan array Root[]:", json);
          // jika API bungkus di properti lain, coba fallback
          if (Array.isArray(json.data)) setParticipants(json.data);
        }
      } catch (err) {
        console.error("fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // konversi skor ke number untuk sorting dan perhitungan
  const normalized = useMemo(() => {
    return participants
      .map((p) => ({ ...p, _skor: Number(p.skor ?? 0) }))
      .sort((a, b) => (b._skor ?? 0) - (a._skor ?? 0));
  }, [participants]);

  const maxScore = useMemo(() => {
    return normalized.length ? Math.max(...normalized.map((p) => p._skor || 0)) : 100;
  }, [normalized]);

  const initials = (n = "") =>
    String(n)
      .split(" ")
      .map((s) => s[0] ?? "")
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const handleShare = async () => {
    try {
      await navigator.share?.({
        title: `Ranking - ${name}`,
        text: `Lihat ranking peserta untuk ${name}!`,
        url: window.location.href,
      });
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link disalin ke clipboard!");
      } catch {
        // noop
      }
    }
  };

  // inline styles (Record supaya fungsi style bisa dipakai)
  const styles: Record<string, any> = {
    page: {
      minHeight: "72vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 24,
      padding: 24,
    },
    headerBox: {
      width: "100%",
      maxWidth: 960,
      borderRadius: 18,
      padding: 18,
      background: "linear-gradient(135deg,#fff,#f7fbff)",
      boxShadow: "0 16px 30px rgba(0,0,0,0.06)",
    },
    title: { fontSize: 20, fontWeight: 800, margin: 0 },
    subtitle: { marginTop: 6, color: "#6b7280", fontSize: 13 },
    shareBtn: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      borderRadius: 9999,
      background: "rgba(255,255,255,0.85)",
      border: "1px solid #eee",
      cursor: "pointer",
    },

    listContainer: {
      width: "100%",
      maxWidth: 960,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    row: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: 14,
      borderRadius: 12,
      background: "#fff",
      boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
    },
    avatar: (bg: string) => ({
      width: 48,
      height: 48,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      color: "#fff",
      background: bg,
    }),
    nameBlock: { flex: 1 },
    score: { fontWeight: 800 },

    progressBarBg: {
      marginTop: 8,
      height: 10,
      width: "100%",
      borderRadius: 9999,
      background: "#f3f4f6",
      overflow: "hidden",
    },
    progressFill: (w: number, top = false) => ({
      height: "100%",
      width: `${w}%`,
      borderRadius: 9999,
      background: top ? "linear-gradient(90deg,#f59e0b,#ef4444)" : "#6366f1",
    }),

    // small domain chips for each participant
    domainWrap: { display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" },
    domainChip: (bg: string) => ({
      minWidth: 110,
      padding: "6px 8px",
      borderRadius: 10,
      color: "#fff",
      background: bg,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    }),
    domainLabel: { fontSize: 12, fontWeight: 700 },
    domainPct: { fontWeight: 900 },

    emptyBox: {
      width: "100%",
      maxWidth: 960,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      borderRadius: 12,
      background: "linear-gradient(90deg,#f8fafc,#f1f5f9)",
    },
  };

  const palette = [
    "linear-gradient(135deg,#f472b6,#fb7185)",
    "linear-gradient(135deg,#60a5fa,#7c3aed)",
    "linear-gradient(135deg,#34d399,#06b6d4)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#f97316,#f43f5e)",
  ];

  const renderParticipantDomains = (p: Root, offset = 0) => {
    if (!Array.isArray(p.persentase_benar_by_domain) || p.persentase_benar_by_domain.length === 0)
      return null;
    return (
      <div style={styles.domainWrap}>
        {p.persentase_benar_by_domain.map((d, i) => {
          const pct = Math.round(d.percentage * 10) / 10;
          const width = Math.max(6, d.percentage);
          return (
            <div key={d.domainId} style={styles.domainChip(palette[(offset + i) % palette.length])}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={styles.domainLabel}>{d.domain}</div>
                <div style={styles.domainPct}>{pct}%</div>
              </div>
              <div
                style={{
                  height: 6,
                  width: "100%",
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.2)",
                  overflow: "hidden",
                  marginTop: 6,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${width}%`,
                    borderRadius: 9999,
                    background: "rgba(255,255,255,0.95)",
                  }}
                />
              </div>
              <div style={{ fontSize: 11, marginTop: 6, opacity: 0.95 }}>
                {d.correctQuestions}/{d.totalQuestions} benar
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Container>
      <div style={styles.page}>
        <div style={styles.headerBox}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <h1 style={styles.title}>
                🏆 Ranking — <span style={{ color: "#3730a3" }}>{name}</span>
              </h1>
              <p style={styles.subtitle}>Kelas 5, SDN Jagakarsa 13 Pagi</p>
            </div>
            <div>
              <button onClick={handleShare} style={styles.shareBtn}>
                <Share2 size={16} /> <span style={{ fontWeight: 700 }}>Bagikan</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ width: "100%", maxWidth: 960 }}>
            <Loading />
          </div>
        ) : normalized.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 700 }}>Hmm... belum ada peserta 😅</p>
              <p style={{ marginTop: 8, color: "#6b7280" }}>
                Ajak temanmu untuk mengerjakan supaya leaderboard ramai!
              </p>
            </div>
          </div>
        ) : (
          <main style={styles.listContainer}>
            {/* podium top-3 */}
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 12,
              }}
            >
              {normalized.slice(0, 3).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                  style={{
                    borderRadius: 12,
                    padding: 12,
                    background: palette[i % palette.length],
                    color: "#fff",
                    textAlign: "center",
                    boxShadow: "0 10px 26px rgba(0,0,0,0.10)",
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      fontWeight: 800,
                      margin: "0 auto 8px",
                    }}
                  >
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{p.user_name}</div>
                  <div style={{ marginTop: 8, fontWeight: 900 }}>{p._skor} pts</div>
                </motion.div>
              ))}
            </section>

            {/* full list with domain chips */}
            <section>
              {normalized.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ x: -8, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.02 * idx }}
                  style={styles.row}
                >
                  <div style={styles.avatar(palette[idx % palette.length])}>
                    {initials(p.user_name)}
                  </div>

                  <div style={styles.nameBlock}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontWeight: 800 }}>{p.user_name} </div>
                      <div style={styles.score}>{p._skor}</div>
                    </div>

                    <div style={styles.progressBarBg}>
                      <div
                        style={styles.progressFill(
                          Math.max(6, (p._skor / maxScore) * 100),
                          idx < 3
                        )}
                      />
                    </div>

                    {/* tambahan: rank + % of top + badge */}
                    <div
                      style={{
                        marginTop: 8,
                        color: "#6b7280",
                        fontSize: 12,
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <span>Rank #{idx + 1}</span>
                      <span>•</span>
                      <span>{Math.round((p._skor / maxScore) * 100)}% of top</span>
                      <span>•</span>
                      <span>{idx < 3 ? "🔥 Top Performer" : "⭐ Participant"}</span>
                    </div>

                    {/* per-participant domains */}
                    {renderParticipantDomains(p, idx)}
                  </div>
                </motion.div>
              ))}
            </section>
          </main>
        )}
      </div>
    </Container>
  );
}
