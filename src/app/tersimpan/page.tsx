/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import { IQuestionEntity, IQuestionForm } from "../types/answerForm";
import { mapEntitiesToQuestions } from "@/helper/mapSoalFromDB";
import BottomNavigation from "../components/BottomNavigation";
import BottomNavigationPrevNext from "../test/components/bottomNavigation";
import BackNavigation from "@/components/BackNavigation";
import EmptyResult from "@/components/emptyResult";
import Box from "@/components/Box";

const LIMIT = 5;

const SavedPembahasanPage: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestionForm[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navbarTitle = useSearchParams().get("navbarTitle");

  const fetchSaved = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token-platform-belajar");
      if (!token) throw new Error("Token not found");
      const user = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
      const res = await fetch(
        `/api/question/saved/list?no_identitas=${user.no_identitas}&offset=${offset}&limit=${LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch saved questions");
      const data: { length: number; data: IQuestionEntity[] } = await res.json();
      const mappedQuestions = await mapEntitiesToQuestions(data.data);
      setQuestions(mappedQuestions);
      setTotal(data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const fetchContent = useCallback(
    async (id: string) => {
      setLoading(true);
      const token = localStorage.getItem("token-platform-belajar");
      if (!token) throw new Error("Token not found");
      const res = await fetch(`/api/content/single/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const content = await res.json();
      setLoading(false);
      localStorage.setItem(
        "content-aktif-platform-belajar",
        JSON.stringify(content.map((el: any) => ({ ...el, value: el.data })))
      );
      return;
    },
    [setLoading]
  );

  const handleClick = useCallback(
    async (item: IQuestionForm) => {
      if (item.contentId) {
        await fetchContent(item.contentId);
      }
      localStorage.setItem("pembahasan-aktif-platform-belajar", JSON.stringify([item]));
      router.push(
        `/test/pembahasan?id=${item.testId}&hide-save=true&navbarTitle=Pembahasan Tersimpan`
      );
    },
    [fetchContent, router]
  );

  const handleNext = useCallback(() => {
    if (offset + LIMIT < total) {
      setOffset((prev) => prev + LIMIT);
    }
  }, [offset, total]);

  const handlePrev = useCallback(() => {
    if (offset - LIMIT >= 0) {
      setOffset((prev) => prev - LIMIT);
    }
  }, [offset]);

  if (loading) {
    return <Loading />;
  }

  if (questions.length === 0) {
    return (
      <Container>
        <EmptyResult
          message={"Belum Ada Pembahasan Tersimpan"}
          description={"Klik simpan pembahasan pada halaman pembahasan"}
        />
        <BottomNavigation />
      </Container>
    );
  }

  return (
    <Container>
      {/* <BackNavigation label={na vbarTitle || ""} /> */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f9fafb",
          height: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#1f2937",
            textAlign: "center",
          }}
        >
          📚 Pembahasan Tersimpan
        </h1>

        <div style={{ display: "grid", gap: "15px" }}>
          {questions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 8px rgba(0,0,0,0.05)";
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2563eb",
                  marginBottom: "4px",
                }}
              >
                {item.domain} ➝ {item.subDomain}
              </p>

              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Kompetensi: {item.kompetensi}
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "#111827",
                  lineHeight: "1.5",
                  marginBottom: "10px",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    item.question.length > 200
                      ? item.question.slice(0, 200) + "..."
                      : item.question,
                }}
              />
              {item.pembahasan && (
                <p
                  style={{
                    fontSize: "15px",
                    color: "#111827",
                    lineHeight: "1.5",
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      item.pembahasan.length > 500
                        ? item.pembahasan.slice(0, 600) + "..."
                        : item.pembahasan,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          position: "sticky",
          bottom: 0,
          left: 0,
        }}
      >
        <BottomNavigationPrevNext handleNext={handleNext} handlePrev={handlePrev} />
        <BottomNavigation />
      </div>
      <Box />
    </Container>
  );
};

export default SavedPembahasanPage;
