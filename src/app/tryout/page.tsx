/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BackNavigation from "@/components/BackNavigation";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import TableSingleColumn from "@/components/TableSingleColumn";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState<boolean>();
  const [testTypeId, setTestTypeId] = useState<string>();
  const [data, setData] = useState<{ title: string; description: string }[]>([]);
  const router = useRouter();

  const formatDate = useCallback((iso: string) => {
    const date = new Date(iso);

    // Format tanggal (yyyy-mm-dd) + jam:menit
    const formatted = date.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formatted;
  }, []);

  useEffect(() => {
    async function fetchTestTypeId() {
      try {
        setLoading(true);
        const res = await fetch(`/api/test/type`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar")}`,
          },
        });
        if (!res.ok && res.status === 401) {
          router.replace("/auth");
          return;
        }
        const data = await res.json();
        setTestTypeId(data.data.find((el: { name: string }) => el.name === "Try Out").id || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTestTypeId();
  }, [router]);

  useEffect(() => {
    async function fetchTryoutLive() {
      try {
        const res = await fetch(`/api/test/live/${testTypeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-platform-belajar") || ""}`,
          },
        });
        if (!res.ok && res.status === 401) {
          router.push("/auth");
          return;
        }
        const data = await res.json();
        setData(
          data.data.map(
            (el: {
              name: string;
              durasi_seconds: number;
              jumlah_soal: number;
              live_at: string;
              id: string;
            }) => ({
              title: el.name,
              description: `⏰ ${el.durasi_seconds / 60} Menit; 💬 ${el.jumlah_soal} Soal;  📅 ${formatDate(el.live_at)}`,
              action: () => {
                window.open(
                  `/preparation?total_question=${el.jumlah_soal}&name=${el.name}&navbarTitle=${el.name}&id=${el.id}&duration=${el.durasi_seconds}&testType=Try Out&testTypeId=${testTypeId}`,
                  "_blank"
                );
              },
            })
          )
        );

        return res;
      } catch (err) {
        console.error(err);
      }
    }
    if (testTypeId) {
      fetchTryoutLive();
    }
  }, [formatDate, router, testTypeId]);

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
          <BackNavigation label={"Try Out"} />
          <div
            style={{ display: "flex", flexDirection: "column", padding: "10px 20px", gap: "15px" }}
          >
            <p style={{ lineHeight: 1.5 }}>
              Latihan berkala lewat Try Out untuk tingkatkan kompetensimu. Pantau setiap hari untuk
              cek kesediaan try out baru
            </p>
            <TableSingleColumn title={"Live Try Out"} items={data} />

            <TableSingleColumn
              title={"Try Out Mandiri"}
              items={[
                {
                  title: "Segera hadir",
                  description: "Try out mandiri belum tersedia",
                },
              ]}
            />
          </div>
        </div>
      )}
    </Container>
  );
}
