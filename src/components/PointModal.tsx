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
        0% { transform: scale(0.7); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!visible) return null;

  return (
    <Container>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(-45deg, #d4fc79, #96e6a1, #a8edea, #dcedc2)",
          backgroundSize: "400% 400%",
          animation: "bgFlow 10s ease infinite",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 9999,
          textAlign: "center",
          color: "#1a3c34",
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            marginBottom: "20px",
            animation: "popIn 0.6s ease",
            textShadow: "2px 4px 6px rgba(0,0,0,0.15)",
          }}
        >
          🪙 + {point} Poin
        </h1>
        <p
          style={{
            fontSize: "22px",
            marginBottom: "60px",
            lineHeight: "1.5",
            maxWidth: "600px",
            marginInline: "auto",
            animation: "popIn 1s ease",
          }}
        >
          Kumpulkan dan tukar dengan reward yang menarik! ✨
        </p>
        <button
          onClick={actionButton}
          style={{
            padding: "18px 40px",
            borderRadius: "40px",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            background: "linear-gradient(135deg, #56ab2f, #a8e063)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            transition: "all 0.3s ease",
            animation: "bounce 2s infinite",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.35)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
          }}
        >
          {actionButtonLabel}
        </button>
      </div>
    </Container>
  );
}
