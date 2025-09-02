"use client";
import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

export default function Page() {
  const params = useSearchParams();
  const navBarTitle = params.get("navbarTitle");
  const router = useRouter();
  const x = useMemo(() => {
    return [
      {
        title: "Modul 1",
        description:
          "Menemukan informasi tersurat (siapa, kapan, dimana, mengapa, bagaimana) pada teks fiksi",
        itemColor: "#DC7777",
        items: [
          { icon: "📒", label: "1 Materi" },
          { icon: "🔥", label: "1 Quiz" },
        ],
        onClick: () => {
          router.push(`/domain/modul?navbarTitle=Modul 1`);
        },
      },
      {
        title: "Modul 2",
        description:
          "Menemukan informasi tersurat (siapa, kapan, dimana, mengapa, bagaimana) pada teks informasi",
        itemColor: "#73ccedff",
        onClick: () => {
          router.push(`/domain/modul?navbarTitle=Modul 2`);
        },
        items: [
          { icon: "📒", label: "1 Materi" },
          { icon: "🔥", label: "1 Quiz" },
        ],
      },
    ];
  }, []);

  return (
    <Container>
      <BackNavigation label={navBarTitle || ""} />
      <div style={{ display: "flex", gap: "10px", flexDirection: "column", padding: "20px 15px" }}>
        {x.map((item, index) => (
          <Card
            onClick={item.onClick}
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
            title={item.title}
            description={item.description}
            items={item.items}
            suffix={"➡️"}
          />
        ))}
      </div>
    </Container>
  );
}
