"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import CloseNavigation from "@/components/CloseNavigation";

export default function Page() {
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const router = useRouter();
  const items = [
    {
      page: 1,
      content: `
<iframe
  width="100%"
  height="215"
  src="https://www.youtube.com/embed/rvdvkw367R8"
  title="Dota 2 WTF Moments 598"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">
</iframe>
<p style="color: black; margin-top: 15px; line-height: 1.5;">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
  been the industry standard dummy text ever since the 1500s, when an unknown printer took a
  galley of type and scrambled it to make a type specimen book.
</p>
<p style="line-height: 1.5; margin-top: 15px;color: black; ">
  It has survived not only five centuries, but also the leap into electronic typesetting,
  remaining essentially unchanged. It was popularised in the 1960s with the release of
  Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
  software like Aldus PageMaker including versions of Lorem Ipsum.
</p>`,
    },
    {
      page: 2,
      content: `<p style="color: black; margin-top: 15px; line-height: 1.5;">
      This is the content of page 2.`,
    },
  ];
  return (
    <Container>
      <CloseNavigation>
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
      </CloseNavigation>
      <div style={{ height: "100%", overflow: "auto", padding: "15px" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: "10px",
          }}
        >
          <p style={{ color: "grey" }}>
            Halaman {page} dari {items.length}
          </p>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: items.find((el) => el.page === page)?.content || "" }}
        ></div>
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
        }}
      >
        <div
          onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
          style={{
            textAlign: "center",
            padding: "20px 10px",
            flexGrow: "1",
            background: "#c6c6c6",
            color: "black",
          }}
        >
          Sebelumnya{" "}
        </div>
        <div
          onClick={() => {
            if (page < items.length) {
              setPage((prev) => (prev < items.length ? prev + 1 : prev));
            } else {
              router.back();
            }
          }}
          style={{
            textAlign: "center",
            padding: "20px 10px",
            flexGrow: "1",
            background: "#69CA87",
            color: "white",
          }}
        >
          {page === items.length ? "Selesai" : "Selanjutnya"}
        </div>
      </div>
    </Container>
  );
}
