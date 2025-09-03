"use client";
import React from "react";
import Container from "../../components/Container";
import CloseNavigation from "../../components/CloseNavigation";
import { useSearchParams } from "next/navigation";
import CircleWithInner from "../../components/CircleShape";
import Card from "../../components/Card";

export default function Page() {
  const params = useSearchParams().get("navbarTitle");
  const items = [
    { label: "Jumlah soal benar", value: "10" },
    { label: "Jumlah soal salah", value: "0" },
    { label: "Jumlah soal kosong", value: "0" },
    { label: "Waktu Pengerjaan", value: "09:30" },
  ];

  return (
    <Container>
      <CloseNavigation>
        <p style={{ color: "black" }}>
          <b>Skor : {params}</b>
        </p>
      </CloseNavigation>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "0px 20px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Skor Total</h3>
        <p style={{ marginBottom: "15px" }}>Selamat atas pencapaianmu</p>
        <CircleWithInner background={"#78CF93"} width={100} height={100} label={"100"} />
        <p style={{ margin: "15px 0px" }}>Infografis Pencapianmu</p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            padding: "10px 0px",
          }}
        >
          {items.map((item, index) => (
            <Card
              description={item.label}
              key={index}
              color={index % 2 === 0 ? "white" : "black"}
              backgroundColor={index % 2 === 0 ? "#78CF93" : "white"}
              suffix={
                <span style={{ color: index % 2 === 0 ? "white" : "black" }}>
                  <b>{item.value}</b>
                </span>
              }
            />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "sticky",
          left: 0,
          bottom: 0,
          padding: "20px",
          backgroundColor: "#78CF93",
          textAlign: "center",
          color: "white",
        }}
      >
        Pembahasan ➡️
      </div>
    </Container>
  );
}
