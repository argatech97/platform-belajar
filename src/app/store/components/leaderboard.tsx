/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Container from "@/components/Container";
import Loading from "@/components/Loading";
import CloseNavigation from "@/components/CloseNavigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";

interface LeaderboardItem {
  id: number;
  point: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  nama_lengkap: string;
}

// format tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// ambil inisial nama
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/point/leaderboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
          },
        });
        if (!res.ok && res.status === 401) {
          router.replace("/auth");
          return;
        }
        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [router]);

  const normalized = useMemo(() => {
    return [...data].sort((a, b) => b.point - a.point);
  }, [data]);

  const maxScore = useMemo(() => {
    return normalized.length ? Math.max(...normalized.map((p) => p.point || 0)) : 100;
  }, [normalized]);

  const handleShare = async () => {
    try {
      await navigator.share?.({
        title: "🏆 Leaderboard",
        text: "Lihat ranking terbaru!",
        url: window.location.href,
      });
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link disalin ke clipboard!");
      } catch {
        // ignore
      }
    }
  };

  const handleClose = useCallback(() => {
    window.close();
  }, []);

  const podiumPalette = [
    "linear-gradient(135deg,#f472b6,#fb7185)",
    "linear-gradient(135deg,#60a5fa,#7c3aed)",
    "linear-gradient(135deg,#34d399,#06b6d4)",
  ];

  const avatarPalette = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#fb923c"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: 24,
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          borderRadius: 18,
          padding: 18,
          background: "linear-gradient(135deg,#fff,#f7fbff)",
          boxShadow: "0 16px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              🏆 Leaderboard
            </h1>
            <p
              style={{
                marginTop: 6,
                marginBottom: 0,
                color: "#6b7280",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              Poin Tertinggi Saat Ini
            </p>
          </div>
          <div>
            <button
              onClick={handleShare}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.85)",
                border: "1px solid #eee",
                cursor: "pointer",
                lineHeight: 1.4,
              }}
            >
              <Share2 size={16} /> <span style={{ fontWeight: 700 }}>Bagikan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ width: "100%", maxWidth: 960 }}>
          <Loading />
        </div>
      ) : normalized.length === 0 ? (
        <div
          style={{
            width: "100%",
            maxWidth: 960,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            borderRadius: 12,
            background: "linear-gradient(90deg,#f8fafc,#f1f5f9)",
            lineHeight: 1.6,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              Hmm... belum ada peserta 😅
            </p>
            <p style={{ margin: 0, color: "#6b7280" }}>
              Ajak temanmu ikut supaya leaderboard ramai!
            </p>
          </div>
        </div>
      ) : (
        <main
          style={{
            width: "100%",
            maxWidth: 960,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            lineHeight: 1.5,
          }}
        >
          {/* Podium top-3 */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
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
                  padding: 20,
                  background: podiumPalette[i % podiumPalette.length],
                  color: "#fff",
                  textAlign: "center",
                  boxShadow: "0 10px 26px rgba(0,0,0,0.10)",
                  lineHeight: 1.5,
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
                    margin: "0 auto 10px",
                  }}
                >
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    marginBottom: 6,
                  }}
                >
                  {p.nama_lengkap}
                </div>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>{p.point} pts</div>
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.9,
                    margin: 0,
                  }}
                >
                  {formatDate(p.updated_at)}
                </div>
              </motion.div>
            ))}
          </section>

          {/* Full list */}
          {normalized.map((p, i) => {
            if (i < 3) return null;

            let emoji = "🎯";
            if (i === 0) emoji = "🥇";
            else if (i === 1) emoji = "🥈";
            else if (i === 2) emoji = "🥉";
            else if (i < 10) emoji = "🔥";
            else if (i < 20) emoji = "🚀";

            const progress = Math.round((p.point / maxScore) * 100);

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * i }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: 16,
                  borderRadius: 12,
                  background: "#fff",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* avatar lingkaran */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: "#fff",
                        background: avatarPalette[i % avatarPalette.length],
                      }}
                    >
                      {getInitials(p.nama_lengkap)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          marginBottom: 4,
                        }}
                      >
                        {i + 1}. {emoji} {p.nama_lengkap}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#666",
                        }}
                      >
                        {formatDate(p.updated_at)}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800 }}>{p.point} pts</div>
                </div>

                {/* progress bar */}
                <div
                  style={{
                    height: 8,
                    borderRadius: 9999,
                    background: "#f3f4f6",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      borderRadius: 9999,
                      background: "linear-gradient(90deg,#4f46e5,#06b6d4)",
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </main>
      )}
    </div>
  );
}
