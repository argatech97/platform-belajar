"use client";
import BackNavigation from "@/components/BackNavigation";
import Container from "@/components/Container";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Page() {
  const params = useSearchParams();
  return (
    <Container>
      <BackNavigation
        disableBorder={true}
        color="white"
        backgroundColor="#69CA87"
        label={params.get("navbarTitle") || ""}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px 20px",
          gap: "10px",
          backgroundColor: "#69CA87",
        }}
      >
        <p style={{ color: "white" }}>
          Menemukan informasi tersurat (siapa, kapan, dimana, mengapa, bagaimana) pada teks fiksi
        </p>
        <p style={{ color: "white" }}>
          <u>Detail</u>
        </p>
      </div>
    </Container>
  );
}
