/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { fetchRewards } from "../helper/rewardRequest";

interface IReward {
  id: string;
  name: string;
  image: string;
  stock: number;
  pointPrice: number;
}

export default function RewardList({
  redeem,
}: {
  redeem: (id: string, name: string, pricePoint: number) => Promise<void>;
}) {
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<IReward | null>(null);
  const limit = 6;

  const loadRewards = async (newOffset: number) => {
    try {
      setLoading(true);
      const data = await fetchRewards(newOffset, limit);
      setRewards(data.map((el) => ({ ...el, image: el.url_image, pointPrice: el.point })));
      setOffset(newOffset);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards(0);
  }, []);

  return (
    <div style={{ padding: "0px 10px" }}>
      <h2
        style={{
          textAlign: "center",
          margin: "1.5rem 0px 0px",
          color: "#2c3e50",
          fontSize: "20px",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        🎁 Tukar Poin
      </h2>
      <p style={{ textAlign: "center", lineHeight: "1.5", marginBottom: "10px" }}>
        Kumpulkan poin dengan mengerjkan quiz dan menyelesaikan materi
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>⏳ Memuat reward...</div>
      ) : (
        <>
          {/* Grid Reward */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
              marginBottom: "6rem",
            }}
          >
            {rewards.map((reward) => (
              <div
                key={reward.id}
                onClick={() => setSelected(reward)}
                style={{
                  background: "linear-gradient(135deg, #f9f9f9, #e3f2fd)",
                  borderRadius: "18px",
                  padding: "1rem",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)";
                }}
              >
                <img
                  src={reward.image}
                  alt={reward.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "14px",
                    marginBottom: "1rem",
                  }}
                />
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                    color: "#2c3e50",
                  }}
                >
                  {reward.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                    color: reward.stock > 0 ? "#27ae60" : "#e74c3c",
                  }}
                >
                  {reward.stock > 0 ? `📦 Stok: ${reward.stock}` : "❌ Habis"}
                </p>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#f39c12",
                    background: "linear-gradient(90deg, #fff3e0, #ffe0b2)",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                  }}
                >
                  🪙 {reward.pointPrice} poin
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Navigation */}
          <div
            style={{
              background: "linear-gradient(90deg, #3498db, #2ecc71)",
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 -4px 12px rgba(0,0,0,0.25)",
            }}
          >
            <button
              disabled={offset === 0}
              onClick={() => loadRewards(offset - limit)}
              style={{
                padding: "0.8rem 1.5rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: offset === 0 ? "#95a5a6" : "#2980b9",
                color: "white",
                cursor: offset === 0 ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                transition: "all 0.25s",
              }}
            >
              ⬅️ Sebelumnya
            </button>
            <button
              disabled={rewards.length < limit}
              onClick={() => loadRewards(offset + limit)}
              style={{
                padding: "0.8rem 1.5rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: rewards.length < limit ? "#95a5a6" : "#27ae60",
                color: "white",
                cursor: rewards.length < limit ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                transition: "all 0.25s",
              }}
            >
              Selanjutnya ➡️
            </button>
          </div>
        </>
      )}

      {/* Modal Detail */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "2rem",
              width: "420px",
              maxWidth: "90%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              textAlign: "center",
              transform: "scale(1)",
              animation: "zoomIn 0.3s ease",
              position: "relative",
            }}
          >
            {/* Tombol Tutup */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#e74c3c",
              }}
            >
              ❌
            </button>

            <img
              src={selected.image}
              alt={selected.name}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "14px",
                marginBottom: "1rem",
              }}
            />
            <h2 style={{ marginBottom: "0.5rem", color: "#2c3e50" }}>{selected.name}</h2>
            <p
              style={{
                marginBottom: "0.5rem",
                color: selected.stock > 0 ? "#27ae60" : "#e74c3c",
              }}
            >
              {selected.stock > 0 ? `📦 Stok: ${selected.stock}` : "❌ Habis"}
            </p>
            <p
              style={{
                marginBottom: "1.5rem",
                fontWeight: "bold",
                color: "#f39c12",
              }}
            >
              🪙 {selected.pointPrice} poin
            </p>
            <button
              disabled={loading ? true : false}
              style={{
                padding: "0.8rem 1.5rem",
                border: "none",
                borderRadius: "10px",
                background: "linear-gradient(90deg, #2ecc71, #27ae60)",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                transition: "transform 0.2s",
              }}
              onClick={async () => {
                setLoading(true);
                try {
                  setLoading(true);
                  await redeem(selected.id, selected.name, selected.pointPrice);
                  // Setelah redeem, reload data rewards dari API
                  await loadRewards(offset);

                  // Ambil ulang data reward yang barusan di klik
                  const updatedData = await fetchRewards(offset, limit);
                  const updatedReward = updatedData.find((r: any) => r.id === selected.id);

                  if (updatedReward) {
                    setSelected({
                      ...updatedReward,
                      image: updatedReward.url_image,
                      pointPrice: updatedReward.point,
                    });
                  } else {
                    setSelected(null); // kalau reward sudah tidak ada (stok habis)
                  }
                } catch (err) {
                  console.error("Gagal redeem reward:", err);
                } finally {
                  setLoading(false);
                }
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {loading ? "Loading" : "🔄 Tukar Sekarang"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
