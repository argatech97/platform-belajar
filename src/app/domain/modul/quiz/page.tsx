"use client";

import React, { useMemo } from "react";
import Container from "@/components/Container";
import { useSearchParams } from "next/navigation";
import CloseNavigation from "@/components/CloseNavigation";
import Countdown from "@/components/Countdown";
import CircleButton from "@/components/ButtonCircle";
import Card from "@/components/Card";

export default function Page() {
  const params = useSearchParams();
  const items = useMemo(
    () => [
      {
        id: 1,
        isAnswered: false,
        isActive: true,
        option: [
          { id: "A", text: "Gang Sakura - Jalan Peribaru - Jalan Prabandinii" },
          {
            id: "B",
            text: "Gang Sakura - Gang Srikandi - Gang Kenanga - Gang Malabar - Jalan Raya Prabandini",
          },
          { id: "C", text: "Gang Sakura - Gang Srikandi - Jalan Peribaru - Jalan Raya Prabandini" },
          {
            id: "D",
            text: "Gang Sakura - Jalan Peribaru -  Gang Srikandi - Gang Kenanga  - Gang Malabar - Jalan Raya Prabandini",
          },
        ],
        content: `<p><strong>Perhatikan gambar di bawah ini!</strong></p>
<p>&nbsp;</p>
<p style="text-align: center;"><img src="https://idcopy.net/wp-content/uploads/2021/09/contoh-denah-lokasi.webp" alt="" width="400" height="" /></p>
<p style="text-align: center;">&nbsp;</p>
<p style="text-align: left;">Bila kamu berada di ujung barat gang sakura, Maka jalan tercepat untuk menuju pabrik gula&nbsp; adalah ?</p>
<p style="text-align: left;"><br /><strong>Pilih salah satu jawaban yang benar!</strong>&nbsp; &nbsp;</p>`,
      },
      {
        id: 2,
        isAnswered: true,
        isActive: false,
        option: [],
        content: `<p>Ini adalah contoh soal kedua</p>`,
      },
      {
        id: 3,
        isAnswered: false,
        isActive: false,
        option: [],
        content: `<p>Ini adalah contoh soal kedua</p>`,
      },
      {
        id: 4,
        isAnswered: false,
        isActive: false,
        option: [],
        content: `<p>Ini adalah contoh soal kedua</p>`,
      },
      {
        id: 5,
        isAnswered: false,
        isActive: false,
        option: [],
        content: `<p>Ini adalah contoh soal kedua</p>`,
      },
      {
        id: 6,
        isAnswered: false,
        isActive: false,
        option: [],
        content: `<p>Ini adalah contoh soal kedua</p>`,
      },
      {
        id: 7,
        isAnswered: false,
        isActive: false,
        option: [],
        content: `<p>Ini adalah contoh soal kedua</p>`,
      },
      {
        id: 8,
        isAnswered: false,
        isActive: false,
        option: [],
        content: `<p>Ini adalah contoh soal kedua</p>`,
      },
      {
        id: 9,
        isAnswered: false,
        isActive: false,
        option: [],
        content: `<p>Ini adalah contoh soal kedua</p>`,
      },
      {
        id: 9,
        isAnswered: true,
        isActive: false,
        option: [],
        content: `<p>Ini adalah contoh soal kedua</p>`,
      },
    ],
    []
  );
  const [nomor, setNomor] = React.useState(1);
  return (
    <Container>
      <CloseNavigation>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <p
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: "black",
            }}
          >
            <b>{params.get("navbarTitle") || ""}</b>
          </p>
          <Countdown minutes={10} />
          <button
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              color: "white",
              background: "#69CA87",
            }}
          >
            Akhiri!
          </button>
        </div>
      </CloseNavigation>
      <div style={{ height: "100%", overflow: "auto", padding: "20px 15px" }}>
        <div
          style={{ color: "black" }}
          dangerouslySetInnerHTML={{ __html: items.find((el) => el.isActive)?.content || "" }}
        ></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
          {items
            .find((el) => el.isActive)
            ?.option.map((option, index) => (
              <Card
                key={index}
                prefix={<span style={{ color: "black" }}>{option.id}</span>}
                description={option.text}
              />
            ))}
        </div>
      </div>
      <div
        style={{
          position: "sticky",
          bottom: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          borderTop: "0.5px solid #c6c6c6",
          padding: "15px 10px",
          gap: "10px",
        }}
      >
        {items.map((item, index) => (
          <CircleButton
            key={index}
            isAnswered={item.isAnswered}
            isActive={item.isActive}
            number={index + 1}
            width={30}
            height={30}
            fontSize={12}
          />
        ))}
      </div>{" "}
    </Container>
  );
}
