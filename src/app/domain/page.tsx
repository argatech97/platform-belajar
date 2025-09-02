"use client";

import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const navBarTitle = params.get("navbarTitle");
  const x: { label: string; jumlahModul: number; itemColor: string }[] = useMemo(() => {
    return [
      { label: "Mengakses dan Menemukan Informasi", jumlahModul: 2, itemColor: "#DC7777" },
      { label: "Menginterpretasi dan Mengintegrasi", jumlahModul: 2, itemColor: "#73ccedff" },
      { label: "Mengevaluasi dan Merefleksi", jumlahModul: 2, itemColor: "#e375e1ff" },
    ];
  }, []);

  return (
    <Container>
      <BackNavigation label={navBarTitle || ""} />
      <div style={{ display: "flex", gap: "10px", flexDirection: "column", padding: "20px 15px" }}>
        {x.map((item, index) => (
          <Card
            onClick={() => {
              router.push(`/domain/modul-list?navbarTitle=${item.label}`);
            }}
            key={index}
            prefix={
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="35" height="35" rx="10" fill={item.itemColor} />
              </svg>
            }
            title={item.label}
            items={[
              {
                icon: "📖",
                label: `${item.jumlahModul} Modul`,
              },
            ]}
            suffix={"➡️"}
          />
        ))}
      </div>
    </Container>
  );
}
