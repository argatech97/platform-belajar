"use client";
import React from "react";
import Container from "@/components/Container";
import BackNavigation from "@/components/BackNavigation";
import { useSearchParams } from "next/navigation";
import Tab from "@/components/Tab";

export default function Page() {
  const navbarTitle = useSearchParams().get("navbarTitle");
  return (
    <Container>
      <BackNavigation label={navbarTitle || ""} />
      <Tab
        initialActiveTab="tryout"
        tabList={[
          { label: "Try Out", value: "tryout" },
          { label: "Quiz", value: "quiz" },
          { label: "Tugas", value: "tugas" },
        ]}
        tabOnChange={function (value: string): void {
          console.log(value);
        }}
      ></Tab>
    </Container>
  );
}
