"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/Container";

interface FullscreenPointModalProps {
  visible: boolean;
  actionButtonLabel: string;
  actionButton: () => void;
}

export default function FullscreenPointModal({
  visible,
  actionButtonLabel,
  actionButton,
}: FullscreenPointModalProps) {
  const searchParams = useSearchParams();
  const point = searchParams.get("point") || "0";

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bgFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes popIn {
        0% { transform: scale(0.6); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      @keyframes glow {
        0% { box-shadow: 0 0 12px #ff9a9e, 0 0 24px #fad0c4; }
        50% { box-shadow: 0 0 28px #a18cd1, 0 0 48px #fbc2eb; }
        100% { box-shadow: 0 0 12px #ff9a9e, 0 0 24px #fad0c4; }
      }
      @keyframes fall {
        0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!visible) return null;

  const emojis = ["🎉", "✨", "🪙", "💎", "🔥", "🌟"];
  const floatingEmojis = Array.from({ length: 20 }).map((_, i) => {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const left = Math.random() * 100;
    const duration = 5 + Math.random() * 5;
    const delay = Math.random() * 5;
    const size = 24 + Math.random() * 24;
    return (
      <span
        key={i}
        style={{
          position: "absolute",
          left: `${left}%`,
          top: "-10vh",
          fontSize: `${size}px`,
          animation: `fall ${duration}s linear ${delay}s infinite`,
          pointerEvents: "none",
        }}
      >
        {emoji}
      </span>
    );
  });

  return (
    <Container>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(-45deg, #ff9a9e, #fad0c4, #a18cd1, #fbc2eb, #fda085, #f6d365)",
          backgroundSize: "500% 500%",
          animation: "bgFlow 15s ease infinite",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 9999,
          textAlign: "center",
          overflow: "hidden",
          color: "#2d1b4e",
        }}
      >
        {floatingEmojis}

        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            marginBottom: "24px",
            animation: "popIn 0.7s ease",
            textShadow: "2px 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          🪙 +{point} Poin
        </h1>

        <p
          style={{
            fontSize: "20px",
            marginBottom: "50px",
            lineHeight: "1.6",
            maxWidth: "650px",
            marginInline: "auto",
            animation: "popIn 1s ease",
            padding: "10px",
          }}
        >
          Kumpulkan poinmu sebanyak mungkin untuk dapatkan <strong>reward spesial</strong>✨💎
        </p>

        <button
          onClick={actionButton}
          style={{
            padding: "18px 50px",
            borderRadius: "50px",
            border: "none",
            cursor: "pointer",
            fontSize: "22px",
            fontWeight: "bold",
            color: "white",
            background: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
            animation: "bounce 2s infinite, glow 2s ease-in-out infinite",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {actionButtonLabel} 🚀
        </button>
      </div>
    </Container>
  );
}
