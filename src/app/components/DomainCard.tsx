import { useMemo } from "react";
import { IHasilCapaian } from "../types/hasilCapain";

export const DomainCard = ({
  p,
  offset = 0,
  palette,
}: {
  p: IHasilCapaian;
  offset: number;
  palette: string[];
}) => {
  const styles = useMemo(
    () => ({
      domainWrap: { display: "flex", gap: 8, marginTop: 10 },
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
    }),
    []
  );
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
