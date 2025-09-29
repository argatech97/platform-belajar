import React, { useEffect, useState } from "react";
import { useListPointHistory } from "@/app/hooks/usePointApi";
import { div } from "framer-motion/client";

interface IPointHistory {
  id: string;
  relationd_id: string;
  point: number;
  user_id: string;
  is_earned: boolean;
  activity_name: string;
  created_at: string;
}

interface Props {
  baseUrl: string;
  token: string;
  isEarned?: boolean;
  userId?: string;
}

export default function PointHistoryList({ baseUrl, token, isEarned, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<IPointHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const listHistory = useListPointHistory({ baseUrl, token });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await listHistory(userId ? { isEarned, userId } : { isEarned });
        setHistory(res.data || []);
      } catch (err) {
        setError((err as Error).message ?? "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isEarned, listHistory, userId]);

  if (loading) {
    return (
      <div style={{ padding: 20, fontSize: 18, textAlign: "center" }}>
        ⏳✨ Sedang mengambil data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: 20,
          color: "white",
          background: "linear-gradient(45deg, #ff4d4d, #ff944d)",
          borderRadius: 10,
          textAlign: "center",
          fontWeight: "bold",
          height: "100%",
        }}
      >
        ❌ {error}
      </div>
    );
  }

  return history.length === 0 ? (
    <div
      style={{
        padding: 20,
        background: "linear-gradient(135deg, #f9f9f9, #e6f7ff)",
        borderRadius: 12,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        maxWidth: 600,
        margin: "20px auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
          fontSize: 22,
          textAlign: "center",
          color: "#333",
        }}
      >
        📜🔥 {userId ? "Reward Saya" : "Riwayat Penukaran"}
      </h2>
      <div style={{ fontSize: 16, color: "#777", textAlign: "center" }}>
        😴{" "}
        {userId
          ? "Kamu belum menukarkan poin dengan reward apapun"
          : "Belum ada orang yang menukarkan poin dengan reward"}
      </div>
    </div>
  ) : (
    <div
      style={{
        padding: 20,
        background: "linear-gradient(135deg, #f9f9f9, #e6f7ff)",
        borderRadius: 12,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        maxWidth: 600,
        margin: "20px auto",
        height: "100%",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {history.map((item, idx) => {
          const bgColors = [
            "linear-gradient(135deg, #a8edea, #d0e6f6)", // biru pastel
            "linear-gradient(135deg, #f5f7fa, #d9e2ec)", // abu lembut
            "linear-gradient(135deg, #d4fc79, #96e6a1)", // hijau mint
            "linear-gradient(135deg, #ffecd2, #ffc5a1)", // peach
            "linear-gradient(135deg, #e2e8f0, #cfd9df)", // abu soft
            "linear-gradient(135deg, #fceabb, #f8d16c)", // kuning pastel
            "linear-gradient(135deg, #e0c3fc, #a8b4fc)", // ungu-biru
          ];

          const bg = bgColors[idx % bgColors.length];
          return (
            <li
              key={item.id}
              style={{
                padding: "16px 20px",
                marginBottom: 15,
                borderRadius: 12,
                background: bg,
                color: "#1e293b",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8, lineHeight: "1.5" }}>
                {item.activity_name}
              </div>
              <div style={{ fontSize: 13, marginBottom: "10px" }}>
                🔢 Point: <b>{item.point}</b>
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>
                🕒 {new Date(item.created_at).toLocaleString()}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
