"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mapEntitiesToQuestions } from "@/helper/mapSoalFromDB";
import { IQuestionForm } from "@/app/types/answerForm";

export function useTestData(isPembahasan?: boolean) {
  const params = useSearchParams();
  const router = useRouter();

  const [testData, setTestData] = useState<IQuestionForm[]>([]);
  const [content, setContent] = useState<{ id: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const testId = params.get("id");
    if (!testId) return;

    const localTest = localStorage.getItem(
      isPembahasan ? "pembahasan-aktif-platform-belajar" : "soal-aktif-platform-belajar"
    );
    const localContent = localStorage.getItem("content-aktif-platform-belajar");

    if (localTest && localContent) {
      setTestData(JSON.parse(localTest));
      setContent(JSON.parse(localContent));
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token-platform-belajar");
        if (!token) {
          router.replace("/auth");
          return;
        }

        const resTest = await fetch(`/api/question/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resTest.status === 401) {
          router.replace("/auth");
          return;
        }
        if (resTest.ok) {
          const { data } = await resTest.json();
          const mappingData = await mapEntitiesToQuestions(data);
          setTestData(mappingData);
          localStorage.setItem("soal-aktif-platform-belajar", JSON.stringify(mappingData));
        }

        const resContent = await fetch(`/api/content/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resContent.status === 401) {
          router.replace("/auth");
          return;
        }
        if (resContent.ok) {
          const { data } = await resContent.json();
          const contentDatas = data.map((el: { id: string; data: string }) => ({
            id: el.id,
            value: el.data,
          }));
          setContent(contentDatas);
          localStorage.setItem("content-aktif-platform-belajar", JSON.stringify(contentDatas));
        }
      } catch (err) {
        console.error("Failed to fetch test/content", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isPembahasan, params, router]);

  const activeItem = useMemo(() => testData[currentIndex || 0], [currentIndex, testData]);

  const contentActive = useMemo(
    () => content.find((c) => c.id === activeItem?.contentId)?.value || "",
    [activeItem, content]
  );

  const handleRemoveLSAndClose = useCallback((storagekeyRef: string) => {
    localStorage.removeItem("soal-aktif-platform-belajar");
    localStorage.removeItem("content-aktif-platform-belajar");
    localStorage.removeItem("testResult");
    localStorage.removeItem("percentageByDomain");
    localStorage.removeItem("percentageByKompetensi");
    localStorage.removeItem("percentageBySubDomain");
    localStorage.removeItem("percentageByType");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem(storagekeyRef);
    window.close();
  }, []);

  return {
    handleRemoveLSAndClose,
    testData,
    contentActive,
    isLoading,
    currentIndex,
    activeItem,
    setCurrentIndex,
    setIsLoading,
  };
}
