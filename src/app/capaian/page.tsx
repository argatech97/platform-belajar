"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import Container from "@/components/Container";
import BackNavigation from "@/components/BackNavigation";
import { useRouter, useSearchParams } from "next/navigation";
import Tab from "@/components/Tab";
import { IHasilCapaian } from "../types/hasilCapain";
import CapaianCardList from "../components/CapaianCardList";
import Loading from "@/components/Loading";
import BottomNavigation from "../components/BottomNavigation";
import EmptyResult from "@/components/emptyResult";
import Box from "@/components/Box";

export default function Page() {
  const navbarTitle = useSearchParams().get("navbarTitle");
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);
  const [testTypes, setTestTypes] = React.useState<{ name: string; id: string }[]>([]);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [data, setData] = React.useState<IHasilCapaian[]>([]);
  const [loading, setLoading] = React.useState(true);

  const getCapaian = useCallback(
    async (userId: string, selectedType: string, token: string) => {
      const res = await fetch(`/api/test/capaian/user/${userId}/${selectedType}`, {
        headers: {
          Authorization: `Bearer ${token}) || ""}`,
        },
      });

      if (!res.ok && res.status === 401) {
        router.replace("/auth");
        return;
      }

      return res.json();
    },
    [router]
  );

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user-platform-belajar") || "{}");
    if (selectedType) {
      setLoading(true);
      getCapaian(userId.id, selectedType, token || "")
        .then((res: IHasilCapaian[]) => {
          setData(res);
        })
        .finally(() => setLoading(false));
    }
  }, [getCapaian, router, selectedType, token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token-platform-belajar");
    setToken(storedToken);
    if (!storedToken) {
      router.push("/auth");
    }
  }, [router]);

  // Fetch test types
  useEffect(() => {
    if (!token) return;
    fetch("/api/test/type", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok && res.status === 401) {
          router.push("/auth");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setTestTypes(data.data);
        const tryOut = data.data.find((t: { name: string }) => t.name === "Try Out");
        console.log(tryOut);
        if (tryOut) setSelectedType(tryOut.id);
        else if (data.data.length > 0) setSelectedType(data.data[0].id);
      });
  }, [router, token]);

  const maxScore = useMemo(() => {
    return data.length ? Math.max(...data.map((p) => Number(p.skor) || 0)) : data.length * 5;
  }, [data]);

  const palette = [
    "linear-gradient(135deg,#f472b6,#fb7185)",
    "linear-gradient(135deg,#60a5fa,#7c3aed)",
    "linear-gradient(135deg,#34d399,#06b6d4)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#f97316,#f43f5e)",
  ];

  if (data.length === 0) {
    return (
      <Container>
        {selectedType && (
          <Tab
            initialActiveTab={selectedType}
            tabList={testTypes
              .filter((el) => el.name !== "Pre Quiz")
              .map((type) => ({ label: type.name, value: type.id }))}
            tabOnChange={function (value: string): void {
              setSelectedType(value);
            }}
          ></Tab>
        )}
        <EmptyResult
          message={"Belum Ada Capain"}
          description={"Kerjakan try out atau quiz untuk membuat capaian"}
        />
        <BottomNavigation />
      </Container>
    );
  }

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* <BackNavigation label={navbarTitle || ""} /> */}
          {selectedType && (
            <Tab
              initialActiveTab={selectedType}
              tabList={testTypes.map((type) => ({ label: type.name, value: type.id }))}
              tabOnChange={function (value: string): void {
                setSelectedType(value);
              }}
            ></Tab>
          )}
          <div style={{ height: "100%", padding: "0px 10px", overflow: "scroll" }}>
            <CapaianCardList
              modeCapaian
              index="test_name"
              data={data}
              maxScore={maxScore}
              palette={palette}
              onclick={(data: IHasilCapaian) => {
                window.open(
                  "/skor?id=" + data.test_id + "&name=" + data.test_name + "&capaian_id=" + data.id,
                  "_blank"
                );
              }}
            />
          </div>
          <Box />
          <BottomNavigation />
        </>
      )}
    </Container>
  );
}
