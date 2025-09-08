"use client";
import React, { useCallback, useEffect, useState } from "react";
import Container from "../../components/Container";
import CloseNavigation from "../../components/CloseNavigation";
import CircleWithInner from "../../components/CircleShape";
import Card from "../../components/Card";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const [testResult, setTestResult] = useState<{
    maximumScore: number;
    score: number;
    testName: string;
    testTime: string;
    closePath: "/";
  }>();
  const [percentageByAnswerType, setPercentageByAnswerType] = useState<
    {
      type: string;
      label: string;
      percentage: number;
      totalQuestion: number;
    }[]
  >();
  const [percentageBySubDomain, setPercentageBySubDomain] = useState<
    {
      percentage: number;
      totalQuestion: number;
      subDomain: string;
    }[]
  >();
  const [percentageByDomain, setPercentageByDomain] =
    useState<{ percentage: number; totalQuestion: number; domain: string }[]>();

  const [percentageByKompetensi, setPercentageByKompetensi] =
    useState<
      { percentage: number; totalQuestion: number; kompetensi: string; kompetensiId: string }[]
    >();

  useEffect(() => {
    setTestResult(JSON.parse(localStorage.getItem("testResult") || ""));
    setPercentageByAnswerType(JSON.parse(localStorage.getItem("percentageByType") || ""));
    setPercentageBySubDomain(JSON.parse(localStorage.getItem("percentageBySubDomain") || ""));
    setPercentageByDomain(JSON.parse(localStorage.getItem("percentageByDomain") || ""));
    setPercentageByKompetensi(JSON.parse(localStorage.getItem("percentageByKompetensi") || ""));
  }, []);

  const handleClose = useCallback(() => {
    localStorage.removeItem("test-result");
    localStorage.removeItem("percentageByDomain");
    localStorage.removeItem("percentageByKompetensi");
    localStorage.removeItem("percentageBySubDomain");
    localStorage.removeItem("percentageByType");
    window.close();
  }, []);

  return (
    <Container>
      <CloseNavigation onClick={handleClose}>
        <p style={{ color: "black" }}>
          <b>Skor : {testResult?.testName}</b>
        </p>
      </CloseNavigation>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          gap: "10px",
        }}
      >
        <h3 style={{ color: "black" }}>Skor Total</h3>
        <p style={{ color: "black" }}>Selamat atas pencapaianmu</p>
        <CircleWithInner
          background={"#78CF93"}
          width={100}
          height={100}
          label={`${testResult?.score}`}
        />
        {/* <p>⏰ : {testResult?.testTime}</p> */}
        <p style={{ color: "black" }}>Berikut ini Persentase Jawaban Benar Testmu</p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "100%",
            padding: "10px 0px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ color: "black", fontWeight: "bold" }}>Domain</p>
            {percentageByDomain?.map((item, index) => (
              <Card
                description={item.domain}
                key={index}
                color={index % 2 === 0 ? "white" : "black"}
                backgroundColor={index % 2 === 0 ? "#78CF93" : "white"}
                suffix={
                  <span style={{ color: index % 2 === 0 ? "white" : "black" }}>
                    <b>{`${item.percentage}%`}</b>
                  </span>
                }
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ color: "black", fontWeight: "bold" }}>Sub Domain</p>
            {percentageBySubDomain?.map((item, index) => (
              <Card
                description={item.subDomain}
                key={index}
                color={index % 2 === 0 ? "white" : "black"}
                backgroundColor={index % 2 === 0 ? "#78CF93" : "white"}
                suffix={
                  <span style={{ color: index % 2 === 0 ? "white" : "black" }}>
                    <b>{`${item.percentage}%`}</b>
                  </span>
                }
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ color: "black", fontWeight: "bold" }}>Kompetensi</p>
            {percentageByKompetensi?.map((item, index) => (
              <Card
                description={item.kompetensi}
                key={index}
                color={index % 2 === 0 ? "white" : "black"}
                backgroundColor={index % 2 === 0 ? "#78CF93" : "white"}
                suffix={
                  <span style={{ color: index % 2 === 0 ? "white" : "black" }}>
                    <b>{`${item.percentage}%`}</b>
                  </span>
                }
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ color: "black", fontWeight: "bold" }}>Tipe Jawaban</p>
            {percentageByAnswerType?.map((item, index) => (
              <Card
                description={item.label}
                key={index}
                color={index % 2 === 0 ? "white" : "black"}
                backgroundColor={index % 2 === 0 ? "#78CF93" : "white"}
                suffix={
                  <span style={{ color: index % 2 === 0 ? "white" : "black" }}>
                    <b>{`${item.percentage}%`}</b>
                  </span>
                }
              />
            ))}
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          router.push(`/ranking?id=${params.get("id")}&title=${params.get("name")}`);
        }}
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
        Ranking ➡️
      </div>
    </Container>
  );
}
