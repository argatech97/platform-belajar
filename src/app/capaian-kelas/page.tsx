"use client";
import React, { useCallback, useEffect } from "react";
import Container from "@/components/Container";
import BackNavigation from "@/components/BackNavigation";
import { useRouter, useSearchParams } from "next/navigation";
import Tab from "@/components/Tab";
import Loading from "@/components/Loading";
import { Test } from "../types/reference";
import Card from "@/components/Card";
import { label } from "framer-motion/client";
import BottomNavigation from "../components/BottomNavigation";
import EmptyResult from "@/components/emptyResult";
import Box from "@/components/Box";

export default function Page() {
  const navbarTitle = useSearchParams().get("navbarTitle");
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);
  const [testTypes, setTestTypes] = React.useState<{ name: string; id: string }[]>([]);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [data, setData] = React.useState<Test[]>([]);
  const [loading, setLoading] = React.useState(true);

  const getTestById = useCallback(
    async (selectedType: string, token: string) => {
      if (token) {
        const res = await fetch(`/api/test/type/${selectedType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok && res.status === 401) {
          router.replace("/auth");
          return;
        }

        return res.json();
      }
    },
    [router]
  );

  useEffect(() => {
    if (selectedType) {
      setLoading(true);
      getTestById(selectedType, token || "")
        .then((res: { data: Test[] }) => {
          setData(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [getTestById, router, selectedType, token]);

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
        if (tryOut) setSelectedType(tryOut.id);
        else if (data.data.length > 0) setSelectedType(data.data[0].id);
      });
  }, [router, token]);

  if (data.length === 0) {
    return (
      <Container>
        {selectedType && (
          <Tab
            initialActiveTab={selectedType}
            tabList={testTypes.map((type) => ({ label: type.name, value: type.id }))}
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
          {selectedType && (
            <Tab
              initialActiveTab={selectedType}
              tabList={testTypes.map((type) => ({ label: type.name, value: type.id }))}
              tabOnChange={function (value: string): void {
                setSelectedType(value);
              }}
            ></Tab>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "0px 10px",
              gap: "10px",
              marginBottom: "10px",
              height: "100%",
            }}
          >
            {data &&
              data.map((el, index) => (
                <Card
                  key={index}
                  title={el.name}
                  items={[{ label: `Durasi : ${el.durasi_seconds / 60} Menit`, icon: "⏰" }]}
                  suffix={<>🎯 {el.jumlah_soal} Soal</>}
                  onClick={() => {
                    localStorage.removeItem(el.name);
                    window.open(`/test-result?id=${el.id}&name=${el.name}`, "_blank");
                  }}
                />
              ))}
          </div>
          <Box />
          <BottomNavigation />
        </>
      )}
    </Container>
  );
}
