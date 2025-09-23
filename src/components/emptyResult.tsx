import React from "react";

export default function EmptyResult({
  message,
  description,
}: {
  message: string;
  description: string;
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px",
        color: "#444",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f9f9ff, #cdf7deff)",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "32px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "42px",
          marginBottom: "12px",
          animation: "spin 3s linear infinite",
        }}
      >
        ✨
      </div>
      <div style={{ fontWeight: "600", marginBottom: "6px" }}>{message}</div>
      <div style={{ fontSize: "14px", color: "#666" }}>{description}</div>

      <style>{`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      50% { transform: rotate(20deg); }
      100% { transform: rotate(0deg); }
    }
  `}</style>
    </div>
  );
}
