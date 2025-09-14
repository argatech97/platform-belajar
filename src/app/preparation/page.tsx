/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PreparationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil query params
  const testName = searchParams.get("navbarTitle") || "📚 SIMULASI TEST";
  const totalQuestions = searchParams.get("total_question") || "0";
  const durationSeconds = searchParams.get("duration") || "0";
  const testType = searchParams.get("testType") || "";
  const testTypeId = searchParams.get("testTypeId") || "";
  const id = searchParams.get("id") || "";

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handler untuk masuk fullscreen + navigasi
  const handleStart = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.error("Fullscreen gagal:", err);
    }
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("soal-aktif-platform-belajar");
    localStorage.removeItem("content-aktif-platform-belajar");

    router.push(
      `/test?name=${testName}&navbarTitle=${testName}&id=${id}&duration=${Number(
        durationSeconds
      )}&testType=${testType}&testTypeId=${testTypeId}`
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ff6de2ff, #6cc7ffff, #61ffdfff, #facd8aff)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 10s ease infinite",
        flexDirection: "column",
        color: "#fff",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.8rem",
          fontWeight: "bold",
          marginBottom: "25px",
          textShadow: "2px 2px 10px rgba(0,0,0,0.4)",
        }}
      >
        🚀 {testName}
      </h1>

      <p style={{ fontSize: "1.4rem", marginBottom: "12px" }}>
        📝 Jumlah Soal: <b>{totalQuestions}</b>
      </p>

      <p style={{ fontSize: "1.4rem", marginBottom: "50px" }}>
        ⏳ Durasi: <b>{Number(durationSeconds) / 60} menit</b>
      </p>

      <button
        onClick={handleStart}
        style={{
          padding: "18px 45px",
          fontSize: "1.3rem",
          fontWeight: "bold",
          borderRadius: "35px",
          border: "none",
          background: "linear-gradient(90deg, #ff512f, #dd2476, #24c6dc, #514a9d)",
          backgroundSize: "300% 300%",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0px 8px 25px rgba(0,0,0,0.3)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.transform = "scale(1.08)";
          (e.target as HTMLButtonElement).style.boxShadow = "0px 12px 35px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.transform = "scale(1)";
          (e.target as HTMLButtonElement).style.boxShadow = "0px 8px 25px rgba(0,0,0,0.3)";
        }}
      >
        🎯 Mulai Test Sekarang!
      </button>

      {/* Inline style untuk animasi gradient */}
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}
