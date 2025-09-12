import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { IHasilCapaian } from "../types/hasilCapain";
import { DomainCard } from "./DomainCard";

export default function CapaianCardList({
  data,
  maxScore,
  palette,
  onclick,
  index,
  modeCapaian,
}: {
  data: IHasilCapaian[];
  maxScore: number;
  palette: string[];
  index: "test_name" | "user_name";
  onclick?: (data: IHasilCapaian) => void;
  modeCapaian?: boolean;
}) {
  const styles = useMemo(() => {
    return {
      row: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: 14,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
        cursor: "pointer",
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
    };
  }, []);

  const initials = useCallback(
    (n = "") =>
      String(n)
        .split(" ")
        .map((s) => s[0] ?? "")
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    []
  );

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((p, idx) => (
        <motion.div
          onClick={() => {
            if (onclick) onclick(p);
          }}
          key={p.id}
          initial={{ x: -8, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.02 * idx }}
          style={styles.row}
        >
          <div style={styles.avatar(palette[idx % palette.length])}>{initials(p[index])}</div>

          <div style={styles.nameBlock}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 800 }}>{p[index]} </div>
              <div style={styles.score}>{p.skor}</div>
            </div>

            <div style={styles.progressBarBg}>
              <div
                style={styles.progressFill(Math.max(6, (Number(p.skor) / maxScore) * 100), idx < 3)}
              />
            </div>

            {/* tambahan: rank + % of top + badge */}
            {
              <div
                style={{
                  marginTop: 8,
                  color: "#6b7280",
                  fontSize: 12,
                  display: "flex",
                  gap: 8,
                }}
              >
                {modeCapaian ? (
                  <>
                    {" "}
                    ⏰ :{" "}
                    {`${Math.floor(Number(p.time_spent) / 60)} Menit ${(Number(p.time_spent) % 60).toString().padStart(2, "0")} Detik`}
                  </>
                ) : (
                  <span>Rank #{idx + 1}</span>
                )}
                <span>•</span>
                {modeCapaian ? (
                  <>
                    📅 :{" "}
                    {new Date(p.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </>
                ) : (
                  <span>{Math.round((Number(p.skor) / maxScore) * 100)}% of top</span>
                )}
                <span>•</span>
                {modeCapaian ? (
                  <>
                    🕦 :{" "}
                    {new Date(p.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </>
                ) : (
                  <span>{idx < 3 ? "🔥 Top Performer" : "⭐ Participant"}</span>
                )}
              </div>
            }

            {/* per-participant domains */}
            <DomainCard p={p} offset={idx} palette={palette} />
          </div>
        </motion.div>
      ))}
    </section>
  );
}
