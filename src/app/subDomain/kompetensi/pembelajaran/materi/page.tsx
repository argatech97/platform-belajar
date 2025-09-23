"use client";

import React, { useCallback, useEffect, useState } from "react";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import CloseNavigation from "@/components/CloseNavigation";
import { postRequest } from "@/helper/api";
import { CreatePointHistoryDto, useEarnPoints } from "@/app/hooks/usePointApi";
import FullscreenPointModal from "@/components/PointModal";

type MateriContent = {
  id: string;
  content: string;
  order_number: number;
};

export default function Page() {
  const earn = useEarnPoints({
    baseUrl: "/api/point",
  });
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<MateriContent[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);
  const router = useRouter();
  const materiName = params.get("navbarTitle");

  const submitDone = useCallback(async () => {
    const token = localStorage.getItem("token-platform-belajar");
    const materi_id = params.get("id");
    const kompetensi_id = params.get("parent_id");
    const point = params.get("point");
    const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
    postRequest(
      "/learning/materi/done",
      {
        user_id: user.id,
        materi_id,
        kompetensi_id,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
      .then(() => {
        if (point) {
          const x: CreatePointHistoryDto = {
            point: Number(point),
            user_id: user.id,
            is_earned: true,
            relationd_id: materi_id,
            activity_name: `Menyelesaikan materi: ${materiName}`,
          };
          const token = localStorage.getItem("token-platform-belajar") || "";
          return earn(x, token)
            .then(() => {
              setIsDone(true);
              return;
            })
            .catch((err) => {
              console.log(err);
              return;
            });
        }
        return;
      })
      .catch((err) => {
        alert(err.message);
        router.back();
      });
  }, [earn, materiName, params, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token-platform-belajar");
        const materiId = params.get("id");

        if (!token || !materiId) return;

        const res = await fetch(`/api/learning/materi/${materiId}/content`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok && res.status === 401) {
          router.replace("/auth");
          return;
        }

        const data = await res.json();
        // Pastikan urut sesuai order
        setItems(
          (data?.data || []).sort(
            (a: MateriContent, b: MateriContent) => a.order_number - b.order_number
          )
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [params, router]);

  if (isDone)
    return (
      <Container>
        <FullscreenPointModal
          visible={isDone}
          actionButtonLabel={"Tutup"}
          actionButton={function (): void {
            router.back();
          }}
        ></FullscreenPointModal>
      </Container>
    );

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
          dangerouslySetInnerHTML={{
            __html: items.find((el) => el.order_number === page)?.content || "",
          }}
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
            cursor: "pointer",
          }}
        >
          Sebelumnya
        </div>
        <div
          onClick={() => {
            if (page < items.length) {
              setPage((prev) => prev + 1);
            } else {
              submitDone();
            }
          }}
          style={{
            textAlign: "center",
            padding: "20px 10px",
            flexGrow: "1",
            background: "#69CA87",
            color: "white",
            cursor: "pointer",
          }}
        >
          {page === items.length ? "Selesai" : "Selanjutnya"}
        </div>
      </div>
    </Container>
  );
}
