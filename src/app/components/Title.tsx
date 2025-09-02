import Image from "next/image";
import React from "react";

export default function Title() {
  return (
    <div
      style={{
        width: "92%",
        background: "white",
        border: "solid 0.5px #c6c6c6",
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        zIndex: 2,
        borderRadius: "8px",
        margin: "0 auto",
        transform: "translateY(30%)",
        padding: "12px",
      }}
    >
      <Image
        style={{ marginBottom: "5px" }}
        alt="globe"
        src="/globe.svg"
        height="20"
        width="20"
      ></Image>
      <h4 style={{ fontWeight: "bold", color: "black" }}>
        Platform Belajar Literasi-Numerasi Peserta Didik
      </h4>
      <p style={{ marginTop: "5px", color: "black", fontSize: "15px" }}>
        Tingkatkan kompetensi dengan belajar dan berlatih di sini
      </p>
    </div>
  );
}
